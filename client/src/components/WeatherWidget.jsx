import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Wind, Droplets, AlertCircle, Loader2 } from 'lucide-react';

const WeatherWidget = ({ stateId }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!stateId) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
                const response = await axios.get(`${baseUrl}/api/weather/${stateId}`);
                setWeather(response.data);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError(err.response?.data?.message || "Weather data unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [stateId]);

    if (loading) {
        return (
            <div className="weather-widget loading-skeleton" style={{
                height: '80px',
                background: '#f1f5f9',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
            }}>
                <Loader2 className="animate-spin" size={20} />
                <span style={{ marginLeft: '10px' }}>Loading weather...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-widget error" style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '12px',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#991b1b',
                fontSize: '0.9rem'
            }}>
                <AlertCircle size={18} />
                <span>{error}</span>
            </div>
        );
    }

    if (!weather) return null;

    const getIcon = () => {
        const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        return <img src={iconUrl} alt={weather.condition} style={{ width: '48px', height: '48px' }} />;
    };

    return (
        <div className="weather-widget" style={{
            background: 'linear-gradient(to right, #e0f2fe, #f0f9ff)',
            padding: '1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #bae6fd'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    {getIcon()}
                </div>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{weather.temp}°C</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'capitalize' }}>{weather.description}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0ea5e9' }}>
                        <Droplets size={16} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{weather.humidity}%</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Humidity</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                        <Wind size={16} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{weather.wind} <span style={{fontSize: '0.7rem'}}>km/h</span></span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Wind</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
