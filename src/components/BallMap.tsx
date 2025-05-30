import React, { useState } from 'react';
import { User } from 'lucide-react';
import { TennisBall } from '../assets/icons/TennisBall';

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

const BallMap: React.FC<BallMapProps> = ({ selectedPlayer }) => {
  const [selectedShot, setSelectedShot] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'hit' | 'bounce'>('hit');

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

  return (
    <div className="animate-fade-in-delay-4 mb-4 mt-4 rounded-2xl bg-white p-4 shadow-lg sm:p-6">
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out both; }
      `}</style>

      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <TennisBall className="h-5 w-5 text-gray-600" />
        Ball Map
      </h2>

      {/* Player positions */}
      <div className="mb-4 flex justify-center gap-3">
        {players.map((player) => (
          <div key={player.id} className="flex flex-col items-center">
            <User
              className={`h-6 w-6 ${
                player.id === selectedPlayer ? 'text-blue-600' : 'text-gray-600'
              }`}
            />
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

      {/* Shot type filters */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {shotTypes.map((type) => (
          <button
            key={type.id}
            onClick={() =>
              setSelectedShot(selectedShot === type.id ? 'all' : type.id)
            }
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
              selectedShot === type.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Hit/Bounce toggle */}
      <div className="mb-4 flex rounded-full bg-gray-100 p-1">
        <button
          onClick={() => setViewMode('hit')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            viewMode === 'hit'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          HIT
        </button>
        <button
          onClick={() => setViewMode('bounce')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            viewMode === 'bounce'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          BOUNCE
        </button>
      </div>

      {/* Padel Court - Vertically Stretched */}
      <div className="relative overflow-hidden rounded-lg bg-blue-600 p-2">
        <svg
          viewBox="0 0 100 170"
          className="h-auto w-full"
          style={{ maxHeight: '400px' }}
        >
          {/* Court background */}
          <rect x="0" y="0" width="100" height="170" fill="#2563eb" />

          {/* Court lines */}
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

          {/* Shots */}
          {filteredShots.map((shot, index) => (
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
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6">
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
    </div>
  );
};

export default BallMap;