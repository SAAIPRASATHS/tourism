import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v2/places';

/**
 * Calculate distance between two points in km using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const fetchNearbyPlaces = async (lat, lon, radius = 5000) => {
    if (!API_KEY || API_KEY === 'your_geoapify_api_key_here') {
        throw new Error('Geoapify API key not configured');
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                categories: 'tourism.sights,accommodation.hotel',
                filter: `circle:${lon},${lat},${radius}`,
                bias: `proximity:${lon},${lat}`,
                limit: 20,
                apiKey: API_KEY
            }
        });

        // Map Geoapify response to our internal structure
        return response.data.features.map(feature => {
            const props = feature.properties;
            const category = props.categories.includes('accommodation.hotel') ? 'Hotel' : 'Tourist Place';
            
            return {
                xid: props.place_id,
                name: props.name || props.address_line1 || 'Unnamed Place',
                point: {
                    lat: props.lat,
                    lon: props.lon
                },
                categories: props.categories,
                category: category,
                distance: calculateDistance(lat, lon, props.lat, props.lon),
                rating: Math.floor(Math.random() * 2) + 4, // Geoapify doesn't provide rating, randomizing 4-5
                availability: Math.random() // Used for UI logic
            };
        });
    } catch (error) {
        console.error('Error fetching nearby places from Geoapify:', error);
        throw error;
    }
};
