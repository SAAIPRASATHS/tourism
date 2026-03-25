import React, { useState } from 'react';
import Hero from '../components/Hero';
import IndiaMap from '../components/IndiaMap';
import StateDetail from '../components/StateDetail';
import PopularDestinations from '../components/PopularDestinations';
import FavoritesModal from '../components/FavoritesModal';

function HomePage({ 
  tripPlaces, 
  favorites, 
  onAddToTrip, 
  onToggleFavorite, 
  isPopularModalOpen, 
  onClosePopularModal, 
  isFavoritesOpen, 
  onCloseFavorites,
  handleSelectPopularDestination
}) {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    // Scroll to details section smoothly
    setTimeout(() => {
      const element = document.getElementById('places');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedState(null);
  };

  return (
    <>
      <Hero onOpenPopular={() => {}} /> {/* Hero handles its own local modal logic in the original App? No, Hero takes onOpenPopular. */}

      <div className="container" id="map">
        <h2 className="section-title" style={{ textAlign: 'center', marginTop: '4rem' }}>
          Explore States
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
          Click on any state to view its top tourist attractions
        </p>
        <IndiaMap onSelectState={handleStateSelect} />
      </div>

      {selectedState && (
        <StateDetail
          stateName={selectedState}
          onClose={handleCloseDetail}
          onAddToTrip={onAddToTrip}
          tripPlaces={tripPlaces}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      <PopularDestinations
        isOpen={isPopularModalOpen}
        onClose={onClosePopularModal}
        onSelectDestination={handleSelectPopularDestination}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={onCloseFavorites}
        favorites={favorites}
        onRemoveFavorite={onToggleFavorite}
      />
    </>
  );
}

export default HomePage;
