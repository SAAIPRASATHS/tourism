import React, { useState, useEffect } from 'react';
import PlacesSidebar from '../components/planner/PlacesSidebar';
import MapView from '../components/planner/MapView';
import { fetchNearbyPlaces } from '../services/MapService';
import { MapPin, Search, AlertTriangle, Loader2 } from 'lucide-react';

const TripPlannerPage = () => {
    const [center, setCenter] = useState({ lat: 20.5937, lon: 78.9629 }); // Center of India default
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [manualLocation, setManualLocation] = useState({ lat: '', lon: '' });
    const [showManualInput, setShowManualInput] = useState(false);

    // Get initial location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setCenter(newCenter);
                    setShowManualInput(false);
                },
                (err) => {
                    console.error("Location permission denied:", err);
                    setShowManualInput(true);
                    setLoading(false);
                }
            );
        } else {
            setShowManualInput(true);
            setLoading(false);
        }
    }, []);

    // Fetch places when center changes
    useEffect(() => {
        const loadPlaces = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchNearbyPlaces(center.lat, center.lon);
                setPlaces(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch places');
            } finally {
                setLoading(false);
            }
        };

        if (center.lat !== 20.5937) { // Only fetch if we have a real location
            loadPlaces();
        }
    }, [center]);

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const lat = parseFloat(manualLocation.lat);
        const lon = parseFloat(manualLocation.lon);
        if (!isNaN(lat) && !isNaN(lon)) {
            setCenter({ lat, lon });
            setShowManualInput(false);
        }
    };

    const handleMapMove = (lat, lon) => {
        // Prevent excessive calls by checking distance
        setCenter({ lat, lon });
    };

    // Filter logic
    const filteredPlaces = places.filter(p => {
        if (filter === 'Hotels') return p.category === 'Hotel';
        if (filter === 'Tourist Places') return p.category === 'Tourist Place';
        if (filter === 'Top Rated') return p.rating >= 4.5; // Adjusted for Geoapify random range 4-5
        return true;
    });

    return (
        <div className="trip-planner-page" style={{ 
            height: 'calc(100vh - 4rem)', 
            marginTop: '4rem', 
            display: 'flex',
            position: 'relative'
        }}>
            <PlacesSidebar 
                places={filteredPlaces} 
                loading={loading} 
                filter={filter} 
                setFilter={setFilter} 
            />

            <main style={{ flex: 1, position: 'relative' }}>
                <MapView 
                    places={filteredPlaces} 
                    center={center} 
                    onMapMove={handleMapMove}
                />

                {/* Overlays */}
                {showManualInput && (
                    <div className="location-overlay glass-card" style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        padding: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        width: '320px',
                        border: '1px solid rgba(0, 53, 128, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#003580' }}>
                            <MapPin size={20} />
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Manual Location</h3>
                        </div>
                        <form onSubmit={handleManualSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <input 
                                    type="text" 
                                    placeholder="Latitude (e.g. 13.0827)"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}
                                    value={manualLocation.lat}
                                    onChange={(e) => setManualLocation({...manualLocation, lat: e.target.value})}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Longitude (e.g. 80.2707)"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={manualLocation.lon}
                                    onChange={(e) => setManualLocation({...manualLocation, lon: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="primary-btn" style={{ width: '100%' }}>Set Location</button>
                        </form>
                    </div>
                )}

                {error && (
                    <div className="error-toast glass-card" style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        padding: '1rem 2rem',
                        background: 'rgba(254, 242, 242, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid #fee2e2',
                        color: '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 600
                    }}>
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                )}

                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '1rem 2rem',
                        borderRadius: '99px',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 600,
                        color: '#003580'
                    }}>
                        <Loader2 className="animate-spin" size={20} />
                        Updating results...
                    </div>
                )}
            </main>
        </div>
    );
};

export default TripPlannerPage;
