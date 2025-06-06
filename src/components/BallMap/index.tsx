// index.tsx
import React, { useState, useEffect } from 'react';
import { BallMapProps, MainMode, HeatmapView } from './types';
import { shotTypes, players, sampleShots, ANIMATION_DELAYS } from './constants';
import { getHeatmapData, addFadeInStyles } from './utils';
import Header from './components/Header';
import PlayerSelector from './components/PlayerSelector';
import BallHitsControls from './components/BallHitsControls';
import PlayerPositionControls from './components/PlayerPositionControls';
import Court from './components/Court';
import Legend from './components/Legend';

const BallMap: React.FC<BallMapProps> = ({ delay = 0 }) => {
  const [mainMode, setMainMode] = useState<MainMode>('ballHits');
  const [selectedShot, setSelectedShot] = useState<string>('all');
  const [heatmapView, setHeatmapView] = useState<HeatmapView>('zones');
  const [animatedShots, setAnimatedShots] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayMode, setDisplayMode] = useState<MainMode>('ballHits');
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);
  const [displayShot, setDisplayShot] = useState<string>('all');

  // Internal selected player state (matching SpeedCard pattern)
  const selectedPlayer = 1; // You

  // Add fade-in styles to document
  useEffect(() => {
    addFadeInStyles();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedShots(true);
    }, delay + ANIMATION_DELAYS.SHOTS_DELAY);

    return () => clearTimeout(timer);
  }, [delay]);

  // Handle smooth mode transition
  const handleModeChange = (newMode: MainMode) => {
    if (newMode === mainMode) return;

    setIsTransitioning(true);

    // Start transition out
    setTimeout(() => {
      setMainMode(newMode);
      setDisplayMode(newMode);

      // Start transition in
      setTimeout(() => {
        setIsTransitioning(false);
      }, ANIMATION_DELAYS.TRANSITION_IN);
    }, ANIMATION_DELAYS.MODE_TRANSITION);
  };

  // Handle smooth filter transition
  const handleFilterChange = (newFilter: string) => {
    if (newFilter === selectedShot) return;

    setIsFilterTransitioning(true);

    // Start transition out
    setTimeout(() => {
      setSelectedShot(newFilter);
      setDisplayShot(newFilter);

      // Start transition in
      setTimeout(() => {
        setIsFilterTransitioning(false);
      }, ANIMATION_DELAYS.TRANSITION_IN);
    }, ANIMATION_DELAYS.FILTER_TRANSITION);
  };

  // Filter shots based on selected type
  const filteredShots = sampleShots.filter((shot) => {
    const matchesType = displayShot === 'all' || shot.type === displayShot;
    return matchesType;
  });

  // Get heatmap data based on current view
  const heatmapData = getHeatmapData(heatmapView);

  return (
    <div
      className="mt-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
      }}
    >
      <Header mainMode={mainMode} onModeChange={handleModeChange} />

      <PlayerSelector players={players} selectedPlayer={selectedPlayer} />

      {/* Controls container with fixed height to prevent jumping */}
      <div className="relative z-20 mb-5" style={{ minHeight: '140px' }}>
        <BallHitsControls
          selectedShot={selectedShot}
          shotTypes={shotTypes}
          isFilterTransitioning={isFilterTransitioning}
          onFilterChange={handleFilterChange}
          isVisible={displayMode === 'ballHits' && !isTransitioning}
        />

        <PlayerPositionControls
          heatmapView={heatmapView}
          onHeatmapViewChange={setHeatmapView}
          isVisible={displayMode === 'playerPosition' && !isTransitioning}
        />
      </div>

      <Court
        shots={filteredShots}
        displayMode={displayMode}
        isTransitioning={isTransitioning}
        animatedShots={animatedShots}
        isFilterTransitioning={isFilterTransitioning}
        heatmapView={heatmapView}
        heatmapData={heatmapData}
      />

      <Legend
        displayMode={displayMode}
        isTransitioning={isTransitioning}
        filteredShots={filteredShots}
        displayShot={displayShot}
        selectedPlayer={selectedPlayer}
        heatmapView={heatmapView}
      />
    </div>
  );
};

export default BallMap;
