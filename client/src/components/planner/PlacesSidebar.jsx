import React from 'react';
import PlaceCard from './PlaceCard';
import { useTrip } from '../../context/TripContext';
import { Trash2, MapIcon } from 'lucide-react';

const PlacesSidebar = ({ places, loading, filter, setFilter }) => {
    const { selectedPlaces, removePlace, clearTrip } = useTrip();

    return (
        <aside className="planner-sidebar glass-panel" style={{
            width: '380px',
            height: '100%',
            overflowY: 'auto',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            zIndex: 10,
            boxShadow: '10px 0 30px rgba(0,0,0,0.05)'
        }}>
            <header>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Trip Planner</h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {['All', 'Hotels', 'Tourist Places', 'Top Rated'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                background: filter === f ? '#003580' : 'white',
                                color: filter === f ? 'white' : '#64748b',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <section style={{ flex: 1, overflowY: 'auto' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                    Nearby Discoveries
                </h3>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: '140px', background: '#f1f5f9', borderRadius: '16px', opacity: 0.5 }}></div>
                        ))}
                    </div>
                ) : places.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        <MapIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No places found in this area. Try adjusting filters or moving the map.</p>
                    </div>
                ) : (
                    places.map(place => (
                        <PlaceCard key={place.xid} place={place} />
                    ))
                )}
            </section>

            {selectedPlaces.length > 0 && (
                <section style={{ 
                    borderTop: '1px solid #e2e8f0', 
                    paddingTop: '1.5rem',
                    background: 'rgba(248, 250, 252, 0.5)',
                    margin: '0 -1.5rem',
                    padding: '1.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                            Your Trip ({selectedPlaces.length})
                        </h3>
                        <button 
                            onClick={clearTrip}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Trash2 size={14} /> Clear
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {selectedPlaces.map(place => (
                            <div key={place.xid} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                background: 'white',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                border: '1px solid #f1f5f9'
                            }}>
                                <span style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {place.name}
                                </span>
                                <button 
                                    onClick={() => removePlace(place.xid)}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </aside>
    );
};

export default PlacesSidebar;
