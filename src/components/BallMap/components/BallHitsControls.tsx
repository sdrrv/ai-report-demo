// components/BallHitsControls.tsx
import React from 'react';
import { BallHitsControlsProps } from '../types';

const BallHitsControls: React.FC<BallHitsControlsProps> = ({
  selectedShot,
  shotTypes,
  isFilterTransitioning,
  onFilterChange,
  isVisible,
}) => {
  return (
    <div
      className={`absolute inset-0 z-20 space-y-5 transition-all duration-300 ${
        isVisible
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
              onClick={() => onFilterChange('all')}
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
            onClick={() => onFilterChange('all')}
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
              onClick={() => onFilterChange(type.id)}
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
  );
};

export default BallHitsControls;
