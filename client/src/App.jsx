import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TripPlannerPage from './pages/TripPlannerPage';
import PlanTrip from './components/PlanTrip';
import ChatAdvisor from './components/ChatAdvisor';
import { TripProvider } from './context/TripContext';
import './index.css';

function App() {
  const [tripPlaces, setTripPlaces] = useState([]); // Original legacy trip system
  const [favorites, setFavorites] = useState([]);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isPopularModalOpen, setIsPopularModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [tripMetadata, setTripMetadata] = useState({
    startDate: '',
    duration: 0,
    timeAllocations: {} 
  });

  const handleAddToTrip = (place) => {
    const exists = tripPlaces.some(
      p => p.placeName === place.placeName && p.stateName === place.stateName
    );
    if (!exists) {
      setTripPlaces([...tripPlaces, place]);
    }
  };

  const handleToggleFavorite = (place) => {
    const exists = favorites.some(
      p => p.placeName === place.placeName && p.stateName === place.stateName
    );

    if (exists) {
      setFavorites(favorites.filter(
        p => !(p.placeName === place.placeName && p.stateName === place.stateName)
      ));
    } else {
      setFavorites([...favorites, place]);
    }
  };

  const handleSelectPopularDestination = (stateId) => {
    const stateNames = {
      'uttar-pradesh': 'Uttar Pradesh',
      'rajasthan': 'Rajasthan',
      'kerala': 'Kerala',
      'punjab': 'Punjab',
      'maharashtra': 'Maharashtra',
      'goa': 'Goa'
    };
    const stateName = stateNames[stateId] || stateId;
    // This needs to navigate back home and select state
    window.location.href = `/#places`; // Simple fallback for cross-component navigation
  };

  return (
    <TripProvider>
      <div className="app">
        <Navbar
          tripCount={tripPlaces.length}
          onOpenTrip={() => setIsTripModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenTrip={() => setIsTripModalOpen(true)}
          favCount={favorites.length}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
        />

        <Routes>
          <Route path="/" element={
            <HomePage 
              tripPlaces={tripPlaces}
              favorites={favorites}
              onAddToTrip={handleAddToTrip}
              onToggleFavorite={handleToggleFavorite}
              isPopularModalOpen={isPopularModalOpen}
              onClosePopularModal={() => setIsPopularModalOpen(false)}
              isFavoritesOpen={isFavoritesOpen}
              onCloseFavorites={() => setIsFavoritesOpen(false)}
              handleSelectPopularDestination={handleSelectPopularDestination}
            />
          } />
          <Route path="/trip-planner" element={<TripPlannerPage />} />
        </Routes>

        <PlanTrip
          isOpen={isTripModalOpen}
          onClose={() => setIsTripModalOpen(false)}
          tripPlaces={tripPlaces}
          onRemovePlace={(place) => setTripPlaces(tripPlaces.filter(p => !(p.placeName === place.placeName && p.stateName === place.stateName)))}
          onClearTrip={() => setTripPlaces([])}
          tripMetadata={tripMetadata}
          setTripMetadata={setTripMetadata}
        />

        <ChatAdvisor />

        <footer style={{ textAlign: 'center', padding: '2rem', color: '#666', borderTop: '1px solid #eee', marginTop: '4rem' }}>
          <p>&copy; 2026 All India Tourist Guide. Made with ❤️</p>
        </footer>
      </div>
    </TripProvider>
  );
}

export default App;
