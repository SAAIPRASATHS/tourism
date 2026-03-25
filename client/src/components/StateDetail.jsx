import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceCard from './PlaceCard';
import WeatherWidget from './WeatherWidget';
import PollenWidget from './PollenWidget';
import { X } from 'lucide-react';

const StateDetail = ({ stateName, onClose, onAddToTrip, tripPlaces, favorites = [], onToggleFavorite }) => {
    const [stateData, setStateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMood, setSelectedMood] = useState('All');
    const [selectedBudget, setSelectedBudget] = useState('All');

    useEffect(() => {
        if (stateName) {
            setLoading(true);
            setError(null);
            setSelectedMood('All'); // Reset filter on state change
            setSelectedBudget('All');
            // Simple slugify: lowercase and replace spaces with hyphens
            // Note: This relies on backend IDs matching this pattern
            const stateId = stateName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

            axios.get(`${baseUrl}/api/states/${stateId}`)
                .then(response => {
                    setStateData(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching state data:", err);
                    setStateData(null);
                    setLoading(false);
                });
        }
    }, [stateName]);

    if (!stateName) return null;

    // Get unique moods
    const allMoods = stateData ? ['All', ...new Set(stateData.places.flatMap(p => p.moods || []))] : [];
    const allBudgets = ['All', 'Low', 'Medium', 'High'];

    // Filter places
    const filteredPlaces = stateData ? stateData.places.filter(place => {
        const moodMatch = selectedMood === 'All' || (place.moods && place.moods.includes(selectedMood));
        const budgetMatch = selectedBudget === 'All' || place.budget === selectedBudget;
        return moodMatch && budgetMatch;
    }) : [];

    return (
        <div className="state-detail-section" id="places">
            <div className="container">
                <div className="detail-header">
                    <h2 className="section-title">
                        {stateName}
                        {stateData && <span className="subtitle"> - {stateData.description}</span>}
                    </h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                {/* Monitoring Widgets (Weather & Pollen) */}
                {!loading && stateData && (
                    <div className="monitoring-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                        alignItems: 'start'
                    }}>
                        <WeatherWidget stateId={stateData.id} />
                        <PollenWidget stateId={stateData.id} />
                    </div>
                )}

                {/* Filters */}
                {!loading && stateData && (
                    <div className="filters-container" style={{ marginBottom: '2rem' }}>
                        {/* Mood Filter */}
                        <div className="mood-filter-container" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#4b5563', minWidth: '80px' }}>Mood:</span>
                            {allMoods.map(mood => (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        border: '1px solid ' + (selectedMood === mood ? 'var(--primary-color)' : '#e5e7eb'),
                                        cursor: 'pointer',
                                        background: selectedMood === mood ? 'var(--primary-color)' : 'white',
                                        color: selectedMood === mood ? 'white' : '#4b5563',
                                        transition: 'all 0.2s',
                                        fontSize: '0.9rem',
                                        fontWeight: 500
                                    }}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>

                        {/* Budget Filter */}
                        <div className="budget-filter-container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#4b5563', minWidth: '80px' }}>Budget:</span>
                            {allBudgets.map(budget => (
                                <button
                                    key={budget}
                                    onClick={() => setSelectedBudget(budget)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        border: '1px solid ' + (selectedBudget === budget ? 'var(--secondary-color)' : '#e5e7eb'),
                                        cursor: 'pointer',
                                        background: selectedBudget === budget ? 'var(--secondary-color)' : 'white',
                                        color: selectedBudget === budget ? 'white' : '#4b5563',
                                        transition: 'all 0.2s',
                                        fontSize: '0.9rem',
                                        fontWeight: 500
                                    }}
                                >
                                    {budget}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && <div className="loading">Loading details...</div>}

                {!loading && !stateData && (
                    <div className="no-data">
                        <p>Explorer guide coming soon for {stateName}!</p>
                        <p className="small-text">Try selecting Kerala, Rajasthan, Goa, Himachal Pradesh, or Tamil Nadu.</p>
                    </div>
                )}

                {!loading && stateData && (
                    <div className="places-grid">
                        {filteredPlaces.map((place, index) => {
                            const isInTrip = tripPlaces.some(
                                p => p.placeName === place.name && p.stateName === stateName
                            );
                            const isFavorite = favorites.some(
                                p => p.placeName === place.name && p.stateName === stateName
                            );

                            return (
                                <PlaceCard
                                    key={index}
                                    place={place}
                                    index={index}
                                    stateName={stateName}
                                    stateId={stateData.id}
                                    onAddToTrip={onAddToTrip}
                                    isInTrip={isInTrip}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StateDetail;
