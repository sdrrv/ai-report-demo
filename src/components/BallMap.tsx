import React, { useState } from 'react';
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
  result: 'hit' | 'bounce';
  team: 'yours' | 'opponent';
}

interface BallMapProps {
  selectedPlayer: number;
}

type HeatmapView = 'zones' | 'sides' | 'front-back';
type MainMode = 'ballHits' | 'playerPosition';

const BallMap: React.FC<BallMapProps> = ({ selectedPlayer }) => {
  const [mainMode, setMainMode] = useState<MainMode>('ballHits');
  const [selectedShot, setSelectedShot] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'hit' | 'bounce'>('hit');
  const [heatmapView, setHeatmapView] = useState<HeatmapView>('zones');

  // Sample shot data - adjusted y coordinates for the stretched court
  const shots: Shot[] = [
    { x: 75, y: 35, type: 'forehand', result: 'hit', team: 'yours' },
    { x: 80, y: 55, type: 'backhand', result: 'hit', team: 'yours' },
    { x: 70, y: 75, type: 'forehand', result: 'hit', team: 'yours' },
    { x: 25, y: 42, type: 'forehand', result: 'hit', team: 'opponent' },
    { x: 20, y: 70, type: 'backhand', result: 'hit', team: 'opponent' },
    { x: 30, y: 95, type: 'serve', result: 'hit', team: 'opponent' },
    { x: 85, y: 50, type: 'overhead', result: 'hit', team: 'yours' },
    { x: 90, y: 68, type: 'forehandVolley', result: 'bounce', team: 'yours' },
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
    const matchesType = selectedShot === 'all' || shot.type === selectedShot;
    const matchesMode = shot.result === viewMode;
    return matchesType && matchesMode;
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
    <div className="animate-fade-in-delay-4 mb-4 mt-4 rounded-2xl bg-white p-4 shadow-lg sm:p-6">
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out both; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out both; }
        @keyframes slide-in {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out both; }
      `}</style>

      {/* Header with main mode toggle */}
      <div className="mb-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TennisBall className="h-5 w-5 text-gray-600" />
          Ball Map
        </h2>

        {/* Main mode selector */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setMainMode('ballHits')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                mainMode === 'ballHits'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Activity className="h-4 w-4" />
              Ball Hits
            </button>
            <button
              onClick={() => setMainMode('playerPosition')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                mainMode === 'playerPosition'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
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
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-xs ${
                player.id === selectedPlayer
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {player.id === selectedPlayer ? 'You' : `P${player.id}`}
            </span>
          </div>
        ))}
      </div>

      {/* Controls based on main mode */}
      {mainMode === 'ballHits' ? (
        <div className="animate-slide-in mb-6 space-y-5">
          {/* Shot type filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Filter by Shot
              </span>
              {selectedShot !== 'all' && (
                <button
                  onClick={() => setSelectedShot('all')}
                  className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  Show all
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedShot('all')}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedShot === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
                }`}
              >
                All Shots
              </button>
              {shotTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedShot(type.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedShot === type.id
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hit/Bounce toggle */}
          <div className="space-y-3">
            <span className="px-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              View Mode
            </span>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setViewMode('hit')}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  viewMode === 'hit'
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
                }`}
              >
                Hit Location
              </button>
              <button
                onClick={() => setViewMode('bounce')}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  viewMode === 'bounce'
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
                }`}
              >
                Bounce Location
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-in mb-6 space-y-5">
          {/* Heatmap view selector */}
          <div className="space-y-3">
            <span className="px-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Coverage View
            </span>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setHeatmapView('zones')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  heatmapView === 'zones'
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
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
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  heatmapView === 'sides'
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
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
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  heatmapView === 'front-back'
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-300 bg-white text-gray-600 hover:text-gray-800'
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
      )}

      {/* Padel Court - Vertically Stretched */}
      <div className="relative overflow-hidden rounded-lg bg-blue-600 p-2">
        <svg
          viewBox="0 0 100 170"
          className="h-auto w-full"
          style={{ maxHeight: '400px' }}
        >
          {/* Court background */}
          <rect x="0" y="0" width="100" height="170" fill="#2563eb" />

          {/* Center service line */}
          <line
            x1="50"
            y1="42"
            x2="50"
            y2="128"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* Service lines */}
          <line
            x1="10"
            y1="42"
            x2="90"
            y2="42"
            stroke="white"
            strokeWidth="0.5"
          />
          <line
            x1="10"
            y1="128"
            x2="90"
            y2="128"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* Court outline */}
          <rect
            x="10"
            y="20"
            width="80"
            height="130"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />

          {/* Net */}
          <line
            x1="10"
            y1="85"
            x2="90"
            y2="85"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          {/* Wall indicators */}
          <rect
            x="5"
            y="15"
            width="90"
            height="140"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="1,1"
            opacity="0.5"
          />

          {/* Heatmap overlays (rectangles only) - only on bottom half */}
          {mainMode === 'playerPosition' && (
            <>
              {heatmapView === 'zones' && (
                <g className="animate-fade-in">
                  {/* Net zones (first row below net) */}
                  <rect
                    x="10"
                    y="85"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[0].value)}
                  />
                  <rect
                    x="36.67"
                    y="85"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[1].value)}
                  />
                  <rect
                    x="63.33"
                    y="85"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[2].value)}
                  />

                  {/* Transition zones (middle row) */}
                  <rect
                    x="10"
                    y="106.67"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[3].value)}
                  />
                  <rect
                    x="36.67"
                    y="106.67"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[4].value)}
                  />
                  <rect
                    x="63.33"
                    y="106.67"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[5].value)}
                  />

                  {/* Back zones (bottom row) */}
                  <rect
                    x="10"
                    y="128.33"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[6].value)}
                  />
                  <rect
                    x="36.67"
                    y="128.33"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[7].value)}
                  />
                  <rect
                    x="63.33"
                    y="128.33"
                    width="26.67"
                    height="21.67"
                    fill={getOverlayColor(heatmapData[8].value)}
                  />
                </g>
              )}

              {heatmapView === 'sides' && (
                <g className="animate-fade-in">
                  {/* Left Side */}
                  <rect
                    x="10"
                    y="85"
                    width="26.67"
                    height="65"
                    fill={getOverlayColor(heatmapData[0].value)}
                  />

                  {/* Middle Side */}
                  <rect
                    x="36.67"
                    y="85"
                    width="26.67"
                    height="65"
                    fill={getOverlayColor(heatmapData[1].value)}
                  />

                  {/* Right Side */}
                  <rect
                    x="63.33"
                    y="85"
                    width="26.67"
                    height="65"
                    fill={getOverlayColor(heatmapData[2].value)}
                  />
                </g>
              )}

              {heatmapView === 'front-back' && (
                <g className="animate-fade-in">
                  {/* Front (Net area) */}
                  <rect
                    x="10"
                    y="85"
                    width="80"
                    height="32.5"
                    fill={getOverlayColor(heatmapData[0].value)}
                  />

                  {/* Back */}
                  <rect
                    x="10"
                    y="117.5"
                    width="80"
                    height="32.5"
                    fill={getOverlayColor(heatmapData[1].value)}
                  />
                </g>
              )}
            </>
          )}

          {/* Shots - only show when in ball hits mode */}
          {mainMode === 'ballHits' &&
            filteredShots.map((shot, index) => (
              <g
                key={index}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {shot.team === 'yours' ? (
                  <circle
                    cx={shot.x}
                    cy={shot.y}
                    r="2"
                    fill="#fbbf24"
                    stroke="white"
                    strokeWidth="0.5"
                    className="hover:r-3 cursor-pointer transition-all"
                  />
                ) : (
                  <g>
                    <line
                      x1={shot.x - 2}
                      y1={shot.y - 2}
                      x2={shot.x + 2}
                      y2={shot.y + 2}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={shot.x - 2}
                      y1={shot.y + 2}
                      x2={shot.x + 2}
                      y2={shot.y - 2}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </g>
            ))}

          {/* Heatmap text labels - moved to the end so they appear on top */}
          {mainMode === 'playerPosition' && (
            <>
              {heatmapView === 'zones' && (
                <g className="animate-fade-in">
                  {/* Percentage badges */}
                  {heatmapData.map((data, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const x = 23.33 + col * 26.67;
                    const y = 95.83 + row * 21.67;
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
                <g className="animate-fade-in">
                  {/* Percentage badges */}
                  {heatmapData.map((data, index) => {
                    const x = 23.33 + index * 26.67;
                    const y = 117.5;
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
                <g className="animate-fade-in">
                  {/* Percentage badges */}
                  {heatmapData.map((data, index) => {
                    const x = 70;
                    const y = 101.25 + index * 32.5;
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
            </>
          )}
        </svg>
      </div>

      {/* Dynamic legend/info based on mode */}
      <div className="mt-6">
        {mainMode === 'ballHits' ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-white bg-yellow-400"></div>
                <span className="text-xs text-gray-600">Your Team</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-3 w-3">
                  <div className="absolute inset-0 rotate-45 transform bg-red-500"></div>
                  <div className="absolute inset-0 -rotate-45 transform bg-red-500"></div>
                </div>
                <span className="text-xs text-gray-600">Opponents</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {filteredShots.length} {viewMode === 'hit' ? 'hits' : 'bounces'}{' '}
              shown
              {selectedShot !== 'all' && ` (${selectedShot} only)`}
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default BallMap;
