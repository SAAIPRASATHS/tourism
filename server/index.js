require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Groq = require('groq-sdk');
const axios = require('axios');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 5005;

// Configure CORS for production
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

const getStatesData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, './data/states.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading states data:", err);
        return [];
    }
};

// Routes
app.get('/api/states', (req, res) => {
    res.json(getStatesData());
});

app.get('/api/states/:id', (req, res) => {
    const statesData = getStatesData();
    const state = statesData.find(s => s.id === req.params.id);
    if (state) {
        res.json(state);
    } else {
        res.status(404).json({ message: 'State not found' });
    }
});

// Weather API Proxy
app.get('/api/weather/:id', async (req, res) => {
    const statesData = getStatesData();
    const state = statesData.find(s => s.id === req.params.id);
    
    if (!state || !state.lat || !state.lng) {
        return res.status(404).json({ message: 'State or coordinates not found' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        return res.status(503).json({ message: 'Weather service not configured' });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat: state.lat,
                lon: state.lng,
                appid: apiKey,
                units: 'metric'
            }
        });

        const data = response.data;
        res.json({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            icon: data.weather[0].icon,
            location: state.capital || state.name
        });
    } catch (error) {
        console.error("Weather API Error:", error.message);
        res.status(500).json({ message: 'Failed to fetch weather data' });
    }
});

// Pollen API Proxy (Google)
app.get('/api/pollen/:id', async (req, res) => {
    const statesData = getStatesData();
    const state = statesData.find(s => s.id === req.params.id);
    
    if (!state || !state.lat || !state.lng) {
        return res.status(404).json({ message: 'State or coordinates not found' });
    }

    const apiKey = process.env.GOOGLE_POLLEN_API_KEY;
    if (!apiKey || apiKey === 'your_google_pollen_api_key_here') {
        return res.status(503).json({ message: 'Pollen service not configured' });
    }

    try {
        const response = await axios.get(`https://pollen.googleapis.com/v1/forecast:lookup`, {
            params: {
                'location.latitude': state.lat,
                'location.longitude': state.lng,
                days: 1,
                key: apiKey
            }
        });

        const dailyInfo = response.data.dailyInfo?.[0];
        if (!dailyInfo) {
            return res.json({ message: 'No pollen data available for this location' });
        }

        // Map pollen types
        const pollenTypes = {};
        dailyInfo.pollenTypeInfo?.forEach(info => {
            pollenTypes[info.displayName.toLowerCase()] = {
                index: info.indexInfo?.value || 0,
                category: info.indexInfo?.category || 'None'
            };
        });

        res.json({
            pollenTypes,
            recommendations: dailyInfo.healthRecommendations || [],
            date: dailyInfo.date
        });
    } catch (error) {
        console.error("Pollen API Error:", error.message);
        res.status(500).json({ message: 'Failed to fetch pollen data' });
    }
});

// AI Chat Route
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    try {
        const statesData = getStatesData();
        // Create a condensed context of states and their places
        const contextData = statesData.map(state => ({
            name: state.name,
            id: state.id,
            places: (state.places || []).map(p => p.name)
        }));

        const systemPrompt = `You are the "India Tourist Guide" AI Advisor. 
        Your goal is to help users plan their trips to India and answer questions about Indian tourism.
        
        CRITICAL RULES:
        1. Base your recommendations on climate (best time to visit), timing (trip duration), and geography (shortest distance between places).
        2. Use the provided tourist data context to suggest specific places. 
        3. If you suggest a place that is in our database, format it as [Place Name](place:State-ID).
        4. Be helpful, enthusiastic, and informative.
        5. For planning, group places logically by proximity.
        
        AVAILABLE STATES AND PLACES CONTEXT:
        ${JSON.stringify(contextData)}
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...history,
                { role: "user", content: message }
            ],
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        });

        res.json({
            response: completion.choices[0].message.content,
            suggestedPlaces: [] // We can expand this later to return structured place data
        });
    } catch (err) {
        console.error("Groq API Error:", err);
        res.status(500).json({ message: "AI Advisor is currently unavailable." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Keep alive interval
setInterval(() => {
    // console.log('Keep-alive tick');
}, 60000);

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
