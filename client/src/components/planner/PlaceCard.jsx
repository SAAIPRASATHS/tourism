import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Plus, Check } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

const PlaceCard = ({ place }) => {
    const { selectedPlaces, addPlace } = useTrip();
    const isAdded = selectedPlaces.some(p => p.xid === place.xid);

    const getAvailabilityStatus = () => {
        if (place.availability > 0.7) return { text: 'Few Rooms Left', color: '#f97316' };
        if (place.availability > 0.4) return { text: 'Available', color: '#10b981' };
        return { text: 'Almost Full', color: '#ef4444' };
    };

    const status = getAvailabilityStatus();

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="planner-card glass-card"
            style={{
                padding: '1.25rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                marginBottom: '1rem',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    color: place.category === 'Hotel' ? '#3b82f6' : '#8b5cf6',
                    background: place.category === 'Hotel' ? '#dbeafe' : '#ede9fe',
                    padding: '2px 8px',
                    borderRadius: '99px'
                }}>
                    {place.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{place.rating}</span>
                </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>
                {place.name || 'Unnamed Place'}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <MapPin size={14} />
                <span>{place.distance.toFixed(1)} km away</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: status.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color }}></div>
                    {status.text}
                </div>

                <button 
                    onClick={() => !isAdded && addPlace(place)}
                    disabled={isAdded}
                    className="planner-add-btn"
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isAdded ? '#10b981' : '#003580',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: isAdded ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                    }}
                >
                    {isAdded ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add</>}
                </button>
            </div>
        </motion.div>
    );
};

export default PlaceCard;
