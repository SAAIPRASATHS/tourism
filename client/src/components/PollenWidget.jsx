import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wind, AlertCircle, Loader2, Thermometer, Info } from 'lucide-react';

const PollenWidget = ({ stateId }) => {
    const [pollenData, setPollenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!stateId) return;

        const fetchPollen = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
                const response = await axios.get(`${baseUrl}/api/pollen/${stateId}`);
                setPollenData(response.data);
            } catch (err) {
                console.error("Error fetching pollen:", err);
                // Don't show critical error for pollen, just hide or show small message
                setError("Pollen data unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchPollen();
    }, [stateId]);

    if (loading) return null; // Keep it quiet during loading

    if (error || !pollenData || !pollenData.pollenTypes) {
        return null; // Don't show anything if no data or error
    }

    const categories = [
        { key: 'tree', label: 'Tree Pollen', color: '#10b981' },
        { key: 'grass', label: 'Grass Pollen', color: '#34d399' },
        { key: 'weed', label: 'Weed Pollen', color: '#6ee7b7' }
    ];

    const getSeverityColor = (category) => {
        switch (category.toLowerCase()) {
            case 'low': return '#10b981';
            case 'moderate': return '#f59e0b';
            case 'high': return '#ef4444';
            case 'very high': return '#7f1d1d';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="pollen-widget" style={{
            background: 'linear-gradient(to right, #f0fdf4, #fafffa)',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #dcfce7'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Wind size={18} color="#10b981" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#064e3b', margin: 0 }}>Pollen Monitoring</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                {categories.map(cat => {
                    const data = pollenData.pollenTypes[cat.key];
                    if (!data) return null;

                    return (
                        <div key={cat.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 500 }}>{cat.label}</span>
                                <span style={{ 
                                    fontSize: '0.7rem', 
                                    fontWeight: 700, 
                                    color: getSeverityColor(data.category),
                                    textTransform: 'uppercase'
                                }}>{data.category}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${(data.index / 5) * 100}%`, 
                                    height: '100%', 
                                    background: getSeverityColor(data.category),
                                    transition: 'width 1s ease-out'
                                }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {pollenData.recommendations && pollenData.recommendations.length > 0 && (
                <div style={{ 
                    marginTop: '0.75rem', 
                    padding: '0.5rem', 
                    background: 'white', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    border: '1px solid #f0fdf4'
                }}>
                    <Info size={14} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.75rem', color: '#065f46', margin: 0, lineHeight: 1.4 }}>
                        {pollenData.recommendations[0]}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PollenWidget;
