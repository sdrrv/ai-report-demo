// components/PlayerPositionControls.tsx
import React from 'react';
import { PlayerPositionControlsProps } from '../types';

const PlayerPositionControls: React.FC<PlayerPositionControlsProps> = ({
  heatmapView,
  onHeatmapViewChange,
  isVisible,
}) => {
  return (
    <div
      className={`absolute inset-0 space-y-5 transition-all duration-300 ${
        isVisible
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
            onClick={() => onHeatmapViewChange('zones')}
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
            onClick={() => onHeatmapViewChange('sides')}
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
            onClick={() => onHeatmapViewChange('front-back')}
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
          <button
            onClick={() => onHeatmapViewChange('heatmap')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              heatmapView === 'heatmap'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'bg-white text-slate-600 shadow-sm hover:text-slate-800 hover:shadow-md'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <defs>
                <linearGradient
                  id="heatmapGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: '#3b82f6', stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: '#eab308', stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: '#ef4444', stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="2"
                fill="url(#heatmapGradient)"
                opacity="0.8"
              />
              <circle cx="6" cy="10" r="1.5" fill="white" opacity="0.8" />
              <circle cx="10" cy="6" r="1.5" fill="white" opacity="0.8" />
              <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.8" />
            </svg>
            Heatmap
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerPositionControls;
