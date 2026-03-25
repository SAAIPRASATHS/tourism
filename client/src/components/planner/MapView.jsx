import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
function RecenterAutomatically({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) {
            map.setView([lat, lon], 13);
        }
    }, [lat, lon, map]);
    return null;
}

const MapView = ({ places, center, onMapMove }) => {
    const { addPlace, selectedPlaces } = useTrip();

    const MapEventHandler = () => {
        useMapEvents({
            dragend: (e) => {
                const center = e.target.getCenter();
                onMapMove(center.lat, center.lng);
            },
            zoomend: (e) => {
                const center = e.target.getCenter();
                onMapMove(center.lat, center.lng);
            }
        });
        return null;
    };

    const getAvailabilityStatus = (availability) => {
        if (availability > 0.7) return { text: 'Few Rooms Left', color: '#f97316' };
        if (availability > 0.4) return { text: 'Available', color: '#10b981' };
        return { text: 'Almost Full', color: '#ef4444' };
    };

    return (
        <div className="map-view-container" style={{ height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer 
                center={[center.lat, center.lon]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <RecenterAutomatically lat={center.lat} lon={center.lon} />
                <MapEventHandler />

                {places.map(place => {
                    const status = getAvailabilityStatus(place.availability);
                    const isAdded = selectedPlaces.some(p => p.xid === place.xid);

                    return (
                        <Marker key={place.xid} position={[place.point.lat, place.point.lon]}>
                            <Popup>
                                <div style={{ padding: '4px', minWidth: '150px' }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{place.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{place.rating}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>({place.category})</span>
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.75rem', 
                                        color: status.color, 
                                        fontWeight: 700, 
                                        marginBottom: '8px' 
                                    }}>
                                        {status.text}
                                    </div>
                                    <button 
                                        onClick={() => !isAdded && addPlace(place)}
                                        style={{
                                            width: '100%',
                                            padding: '4px 8px',
                                            background: isAdded ? '#10b981' : '#003580',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: isAdded ? 'default' : 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {isAdded ? 'Added to Trip' : 'Add to Trip'}
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;
