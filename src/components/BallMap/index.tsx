// index.tsx
import React, { useState, useEffect } from 'react';
import { BallMapProps, MainMode, HeatmapView } from './types';
import { shotTypes, players, sampleShots, ANIMATION_DELAYS } from './constants';
import { getHeatmapData, addFadeInStyles } from './utils';
import { useBallMapData } from '@/hooks/useBallMapData';
import { PlayerId } from '@/types/backend';
import Header from './components/Header';
import PlayerSelector from '../PlayerSelector';
import BallHitsControls from './components/BallHitsControls';
import PlayerPositionControls from './components/PlayerPositionControls';
import Court from './components/Court';
import Legend from './components/Legend';

const BallMap: React.FC<BallMapProps> = ({ selectedPlayer, matchId = 'default', delay = 0 }) => {
  const [mainMode, setMainMode] = useState<MainMode>('playerPosition');
  const [selectedShot, setSelectedShot] = useState<string>('all');
  const [heatmapView, setHeatmapView] = useState<HeatmapView>('zones');
  const [animatedShots, setAnimatedShots] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayMode, setDisplayMode] = useState<MainMode>('playerPosition');
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);
  const [displayShot, setDisplayShot] = useState<string>('all');
  
  // Internal state for selected player (can be different from prop)
  const [internalSelectedPlayer, setInternalSelectedPlayer] = useState<number>(selectedPlayer);

  // Fetch real ball map data using the hook with internal selected player
  const { data: ballMapData, loading, error, refetch } = useBallMapData({
    playerId: internalSelectedPlayer as PlayerId,
    matchId
  });

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

  // Filter shots based on selected type (still using mock data for Ball Hits mode - Pro feature)
  const filteredShots = sampleShots.filter((shot) => {
    const matchesType = displayShot === 'all' || shot.type === displayShot;
    return matchesType;
  });

  // Get heatmap data based on current view - use real data if available
  const getHeatmapDataForView = (view: HeatmapView) => {
    if (!ballMapData) {
      // Fallback to mock data while loading or on error
      return getHeatmapData(view);
    }

    switch (view) {
      case 'zones':
        return ballMapData.zones;
      case 'sides':
        return ballMapData.sides;
      case 'front-back':
        return ballMapData.frontBack;
      case 'heatmap':
        // For continuous heatmap, return the grid data (will be handled in Court component)
        return ballMapData.heatmapGrid;
      default:
        return ballMapData.zones;
    }
  };

  const heatmapData = getHeatmapDataForView(heatmapView);

  return (
    <div
      className="mt-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        WebkitAnimation: `fade-in 0.5s ease-out ${delay}ms both`,
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'opacity, transform',
      }}
    >
      <Header mainMode={mainMode} onModeChange={handleModeChange} />

      <PlayerSelector
        players={players}
        selectedPlayer={internalSelectedPlayer}
        onPlayerSelect={setInternalSelectedPlayer}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-500">Loading court data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Failed to load court data</p>
            <p className="text-xs text-red-500 mb-3">{error.message}</p>
            <button
              onClick={refetch}
              className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Controls and Court - only show when data is loaded */}
      {!loading && !error && (
        <>
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
            selectedPlayer={internalSelectedPlayer}
            heatmapView={heatmapView}
          />
        </>
      )}
    </div>
  );
};

export default BallMap;
