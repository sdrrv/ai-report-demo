// components/Header.tsx
import React from 'react';
import { Activity, MapPin } from 'lucide-react';
import { TennisBall } from '@/assets/icons/TennisBall';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ mainMode, onModeChange }) => {
  return (
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
            onClick={() => onModeChange('ballHits')}
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
            onClick={() => onModeChange('playerPosition')}
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
  );
};

export default Header;
