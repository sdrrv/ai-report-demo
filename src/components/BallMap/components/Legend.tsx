// components/Legend.tsx
import React from 'react';
import { LegendProps } from '../types';

const Legend: React.FC<LegendProps> = ({
  displayMode,
  isTransitioning,
  filteredShots,
  displayShot,
  selectedPlayer,
  heatmapView,
}) => {
  return (
    <div className="mt-6 border-t border-slate-200 pt-4">
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
                    strokeWidth="3"
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
  );
};

export default Legend;
