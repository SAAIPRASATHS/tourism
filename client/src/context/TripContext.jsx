import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTrip = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
};

export const TripProvider = ({ children }) => {
    const [selectedPlaces, setSelectedPlaces] = useState(() => {
        const saved = localStorage.getItem('trego_trip');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('trego_trip', JSON.stringify(selectedPlaces));
    }, [selectedPlaces]);

    const addPlace = (place) => {
        const exists = selectedPlaces.some(p => p.xid === place.xid);
        if (!exists) {
            setSelectedPlaces([...selectedPlaces, {
                ...place,
                addedAt: new Date().toISOString()
            }]);
        }
    };

    const removePlace = (xid) => {
        setSelectedPlaces(selectedPlaces.filter(p => p.xid !== xid));
    };

    const clearTrip = () => {
        if (window.confirm('Are you sure you want to clear your planned trip?')) {
            setSelectedPlaces([]);
        }
    };

    return (
        <TripContext.Provider value={{
            selectedPlaces,
            addPlace,
            removePlace,
            clearTrip
        }}>
            {children}
        </TripContext.Provider>
    );
};
