import React, { useState, useEffect } from 'react';
import { User, Activity, MapPin } from 'lucide-react';
import { TennisBall } from '@/assets/icons/TennisBall';

interface Shot {
  x: number;
  y: number;
  type:
    | 'forehand'
    | 'backhand'
    | 'forehandVolley'
    | 'backhandVolley'
    | 'serve'
    | 'overhead';
  result: 'groundBounce' | 'interception';
}

interface BallMapProps {
  delay?: number;
}

type HeatmapView = 'zones' | 'sides' | 'front-back';
type MainMode = 'ballHits' | 'playerPosition';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedShots(true);
    }, delay + 400);

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
      }, 50);
    }, 300);
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
      }, 50);
    }, 200);
  };

  // Sample shot data - adjusted for half court (y coordinates now relative to half court)
  const shots: Shot[] = [
    { x: 75, y: 20, type: 'forehand', result: 'groundBounce' },
    { x: 80, y: 35, type: 'backhand', result: 'interception' },
    { x: 70, y: 50, type: 'forehand', result: 'groundBounce' },
    { x: 25, y: 15, type: 'forehand', result: 'interception' },
    { x: 20, y: 45, type: 'backhand', result: 'groundBounce' },
    { x: 30, y: 70, type: 'serve', result: 'groundBounce' },
    { x: 85, y: 25, type: 'overhead', result: 'interception' },
    { x: 90, y: 40, type: 'forehandVolley', result: 'interception' },
    { x: 45, y: 30, type: 'backhand', result: 'groundBounce' },
    { x: 55, y: 60, type: 'forehand', result: 'interception' },
  ];

  const shotTypes = [
    { id: 'forehand', label: 'Forehand' },
    { id: 'backhand', label: 'Backhand' },
    { id: 'forehandVolley', label: 'Forehand Volley' },
    { id: 'backhandVolley', label: 'Backhand Volley' },
    { id: 'serve', label: 'Serve' },
    { id: 'overhead', label: 'Overhead' },
  ];

  const filteredShots = shots.filter((shot) => {
    const matchesType = displayShot === 'all' || shot.type === displayShot;
    return matchesType;
  });

  const players = [
    { id: 1, position: 'Back Left' },
    { id: 2, position: 'Back Right' },
    { id: 3, position: 'Front Left' },
    { id: 4, position: 'Front Right' },
  ];

  // Sample heatmap data
  const getHeatmapData = () => {
    if (heatmapView === 'zones') {
      return [
        { region: 'net_left', value: 15 },
        { region: 'net_middle', value: 25 },
        { region: 'net_right', value: 10 },
        { region: 'transition_left', value: 20 },
        { region: 'transition_middle', value: 35 },
        { region: 'transition_right', value: 15 },
        { region: 'back_left', value: 30 },
        { region: 'back_middle', value: 40 },
        { region: 'back_right', value: 25 },
      ];
    } else if (heatmapView === 'sides') {
      return [
        { region: 'left', value: 35 },
        { region: 'middle', value: 45 },
        { region: 'right', value: 20 },
      ];
    } else {
      return [
        { region: 'front', value: 35 },
        { region: 'back', value: 65 },
      ];
    }
  };

  const heatmapData = getHeatmapData();

  // Helper function to get overlay color based on percentage
  const getOverlayColor = (percentage: number): string => {
    return `rgba(50, 50, 50, ${0.2 + (percentage / 100) * 0.5})`;
  };

  return (
    <div
      className="mt-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
      }}
    >
      {/* Header with main mode toggle */}
      <div className="mb-6 space-y-4">
        <div className="mb-1 flex items-center gap-3">
          <div className="rounded-lg bg-slate-600 p-2">
            <TennisBall className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Ball Map</h2>
            <p className="text-sm text-slate-500">
              Track ball hits and player positioning
            </p>
          </div>
        </div>

        {/* Main mode selector */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => handleModeChange('ballHits')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                mainMode === 'ballHits'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Activity className="h-4 w-4" />
              Ball Hits
            </button>
            <button
              onClick={() => handleModeChange('playerPosition')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                mainMode === 'playerPosition'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <MapPin className="h-4 w-4" />
              Player Position
            </button>
          </div>
        </div>
      </div>

      {/* Player positions */}
      <div className="mb-6 flex justify-center gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="group flex cursor-pointer flex-col items-center"
          >
            <div
              className={`transition-transform ${
                player.id === selectedPlayer
                  ? 'scale-110'
                  : 'group-hover:scale-105'
              }`}
            >
              <User
                className={`h-6 w-6 ${
                  player.id === selectedPlayer
                    ? 'text-sky-500'
                    : 'text-gray-600'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-xs ${
                player.id === selectedPlayer
                  ? 'font-semibold text-sky-500'
                  : 'text-gray-500'
              }`}
            >
              {player.id === selectedPlayer ? 'You' : `P${player.id}`}
            </span>
          </div>
        ))}
      </div>

      {/* Controls container with fixed height to prevent jumping */}
      <div className="relative z-20 mb-5" style={{ minHeight: '140px' }}>
        {/* Ball Hits Controls */}
        <div
          className={`absolute inset-0 z-20 space-y-5 transition-all duration-300 ${
            displayMode === 'ballHits' && !isTransitioning
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          }`}
        >
          {/* Shot type filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Filter by Shot
              </span>
              {selectedShot !== 'all' && (
                <button
                  onClick={() => handleFilterChange('all')}
                  className="text-xs font-medium text-sky-500 transition-colors hover:text-sky-600"
                >
                  Show all
                </button>
              )}
            </div>
            <div
              className={`flex flex-wrap justify-center gap-2 transition-opacity duration-200 ${
                isFilterTransitioning ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <button
                onClick={() => handleFilterChange('all')}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                  selectedShot === 'all'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 shadow-sm hover:text-slate-800 hover:shadow-md'
                }`}
              >
                All Shots
              </button>
              {shotTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleFilterChange(type.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                    selectedShot === type.id
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 shadow-sm hover:text-slate-800 hover:shadow-md'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Player Position Controls */}
        <div
          className={`absolute inset-0 space-y-5 transition-all duration-300 ${
            displayMode === 'playerPosition' && !isTransitioning
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          }`}
        >
          {/* Heatmap view selector */}
          <div className="space-y-3">
            <span className="px-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Coverage View
            </span>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setHeatmapView('zones')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  heatmapView === 'zones'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 shadow-sm hover:text-slate-800 hover:shadow-md'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect
                    x="6"
                    y="2"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <rect
                    x="10"
                    y="2"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect
                    x="2"
                    y="6"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <rect x="6" y="6" width="4" height="4" fill="currentColor" />
                  <rect
                    x="10"
                    y="6"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <rect
                    x="2"
                    y="10"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect
                    x="6"
                    y="10"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <rect
                    x="10"
                    y="10"
                    width="4"
                    height="4"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
                Zones
              </button>
              <button
                onClick={() => setHeatmapView('sides')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  heatmapView === 'sides'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 shadow-sm hover:text-slate-800 hover:shadow-md'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="4"
                    height="12"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect x="6" y="2" width="4" height="12" fill="currentColor" />
                  <rect
                    x="10"
                    y="2"
                    width="4"
                    height="12"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
                Sides
              </button>
              <button
                onClick={() => setHeatmapView('front-back')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  heatmapView === 'front-back'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 shadow-sm hover:text-slate-800 hover:shadow-md'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="6"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect x="2" y="8" width="12" height="6" fill="currentColor" />
                </svg>
                Front-Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Half Padel Court  */}
      <div className=" relative z-10 overflow-hidden rounded-lg bg-slate-600 p-2 pt-8">
        <svg
          viewBox="0 0 100 85"
          className="h-auto w-full"
          style={{ maxHeight: '300px' }}
        >
          {/* Court background */}
          <rect x="0" y="0" width="100" height="85" fill="#45556C" />

          {/* Center service line */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="55"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* Service line */}
          <line
            x1="10"
            y1="55"
            x2="90"
            y2="55"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* Court outline (half court) - open at top */}
          <path
            d="M 10 0 L 10 75 L 90 75 L 90 0"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />

          {/* Net at the top */}
          <line
            x1="11"
            y1="0"
            x2="89"
            y2="0"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          {/* Heatmap overlays (rectangles only) */}
          <g
            className={`transition-all duration-500 ${
              displayMode === 'playerPosition' && !isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {heatmapView === 'zones' && (
              <g>
                {/* Net zones (first row) */}
                <rect
                  x="10"
                  y="0"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[0].value)}
                />
                <rect
                  x="36.67"
                  y="0"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[1].value)}
                />
                <rect
                  x="63.33"
                  y="0"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[2].value)}
                />

                {/* Transition zones (middle row) */}
                <rect
                  x="10"
                  y="25"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[3].value)}
                />
                <rect
                  x="36.67"
                  y="25"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[4].value)}
                />
                <rect
                  x="63.33"
                  y="25"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[5].value)}
                />

                {/* Back zones (bottom row) */}
                <rect
                  x="10"
                  y="50"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[6].value)}
                />
                <rect
                  x="36.67"
                  y="50"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[7].value)}
                />
                <rect
                  x="63.33"
                  y="50"
                  width="26.67"
                  height="25"
                  fill={getOverlayColor(heatmapData[8].value)}
                />
              </g>
            )}

            {heatmapView === 'sides' && (
              <g>
                {/* Left Side */}
                <rect
                  x="10"
                  y="0"
                  width="26.67"
                  height="75"
                  fill={getOverlayColor(heatmapData[0].value)}
                />

                {/* Middle Side */}
                <rect
                  x="36.67"
                  y="0"
                  width="26.67"
                  height="75"
                  fill={getOverlayColor(heatmapData[1].value)}
                />

                {/* Right Side */}
                <rect
                  x="63.33"
                  y="0"
                  width="26.67"
                  height="75"
                  fill={getOverlayColor(heatmapData[2].value)}
                />
              </g>
            )}

            {heatmapView === 'front-back' && (
              <g>
                {/* Front (Net area) */}
                <rect
                  x="10"
                  y="0"
                  width="80"
                  height="37.5"
                  fill={getOverlayColor(heatmapData[0].value)}
                />

                {/* Back */}
                <rect
                  x="10"
                  y="37.5"
                  width="80"
                  height="37.5"
                  fill={getOverlayColor(heatmapData[1].value)}
                />
              </g>
            )}
          </g>

          {/* Shots - only show when in ball hits mode */}
          <g
            className={`transition-all duration-500 ${
              displayMode === 'ballHits' && !isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {filteredShots.map((shot, index) => (
              <g
                key={`${shot.x}-${shot.y}-${shot.type}-${shot.result}`}
                style={{
                  opacity:
                    animatedShots &&
                    displayMode === 'ballHits' &&
                    !isFilterTransitioning
                      ? 1
                      : 0,
                  transform:
                    animatedShots &&
                    displayMode === 'ballHits' &&
                    !isFilterTransitioning
                      ? 'scale(1)'
                      : 'scale(0)',
                  transition: `all 0.3s ease-out ${
                    isFilterTransitioning ? 0 : index * 50
                  }ms`,
                  transformOrigin: `${shot.x}px ${shot.y}px`,
                  cursor: 'pointer',
                }}
              >
                {shot.result === 'groundBounce' ? (
                  <circle
                    cx={shot.x}
                    cy={shot.y}
                    r="1.8"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="1.5"
                  />
                ) : (
                  <g>
                    <path
                      d={`M ${shot.x - 1.5} ${shot.y - 1.5} L ${shot.x + 1.5} ${
                        shot.y + 1.5
                      } M ${shot.x - 1.5} ${shot.y + 1.5} L ${shot.x + 1.5} ${
                        shot.y - 1.5
                      }`}
                      stroke="#f97316"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            ))}
          </g>

          {/* Heatmap text labels - moved to the end so they appear on top */}
          <g
            className={`transition-all duration-500 ${
              displayMode === 'playerPosition' && !isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {heatmapView === 'zones' && (
              <g>
                {/* Percentage badges */}
                {heatmapData.map((data, index) => {
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  const x = 23.33 + col * 26.67;
                  const y = 12.5 + row * 25;
                  return (
                    <g key={index}>
                      <text
                        x={x + 1}
                        y={y + 1}
                        textAnchor="middle"
                        fontSize="7"
                        fill="white"
                        stroke="black"
                        strokeWidth="0.9"
                        paintOrder="stroke"
                        fontWeight="600"
                      >
                        {data.value}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {heatmapView === 'sides' && (
              <g>
                {/* Percentage badges */}
                {heatmapData.map((data, index) => {
                  const x = 23.33 + index * 26.67;
                  const y = 37.5;
                  return (
                    <g key={index}>
                      <text
                        x={x + 1}
                        y={y + 1}
                        textAnchor="middle"
                        fontSize="7"
                        fill="white"
                        stroke="black"
                        strokeWidth="0.9"
                        paintOrder="stroke"
                        fontWeight="600"
                      >
                        {data.value}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {heatmapView === 'front-back' && (
              <g>
                {/* Percentage badges */}
                {heatmapData.map((data, index) => {
                  const x = 70;
                  const y = 18.75 + index * 37.5;
                  return (
                    <g key={index}>
                      <text
                        x={x + 1}
                        y={y + 2}
                        textAnchor="middle"
                        fontSize="7"
                        fill="white"
                        stroke="black"
                        strokeWidth="0.9"
                        paintOrder="stroke"
                        fontWeight="600"
                      >
                        {data.value}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Dynamic legend/info based on mode */}
      <div className=" mt-6 border-t border-slate-200 pt-4">
        <div className="relative" style={{ minHeight: '60px' }}>
          {/* Ball Hits Legend */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              displayMode === 'ballHits' && !isTransitioning
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <circle
                      cx="8"
                      cy="8"
                      r="5"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">Ground Bounce</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M 4 4 L 12 12 M 4 12 L 12 4"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">Interception</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {filteredShots.length} shots shown
                {displayShot !== 'all' && ` (${displayShot} only)`}
              </p>
            </div>
          </div>

          {/* Player Position Info */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              displayMode === 'playerPosition' && !isTransitioning
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0'
            }`}
          >
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-gray-700">
                Player {selectedPlayer} Court Coverage
              </p>
              <p className="text-xs text-gray-500">
                {heatmapView === 'zones'
                  ? '9-zone'
                  : heatmapView === 'sides'
                    ? '3-column'
                    : '2-row'}{' '}
                heatmap analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the fade-in animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default BallMap;
