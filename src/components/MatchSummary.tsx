import React from 'react';
import { TrendingUp, Clock, Activity, Zap } from 'lucide-react';

interface MatchSummaryProps {
  gameData: {
    timeInPlay: number;
    averageRally: number;
    longestRally: number;
  };
  delay?: number;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({
  gameData = {
    timeInPlay: 42,
    averageRally: 6.3,
    longestRally: 24,
  },
  delay = 0,
}) => {
  return (
    <div className="mx-auto max-w-md">
      <div
        className="mb-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-lg sm:p-6"
        style={{
          animation: `fade-in 0.5s ease-out ${delay}ms both`,
        }}
      >
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 sm:gap-3 sm:text-lg">
              <div className="rounded-lg bg-slate-600 p-1.5 sm:p-2">
                <TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              </div>
              Match Summary
            </h3>
          </div>
        </div>

        {/* Responsive grid with consistent alignment */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex items-center justify-center rounded-lg border border-slate-200/50 bg-white/50 p-3 sm:p-4">
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <div className="rounded bg-slate-500 p-1">
                  <Clock className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="whitespace-nowrap text-xs font-medium text-slate-600">
                  Time in Play
                </p>
              </div>
              <p className="text-xl font-bold text-slate-800 sm:text-2xl">
                {gameData.timeInPlay} min
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-lg border border-slate-200/50 bg-white/50 p-3 sm:p-4">
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <div className="rounded bg-slate-500 p-1">
                  <Activity className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="whitespace-nowrap text-xs font-medium text-slate-600">
                  Avg Rally
                </p>
              </div>
              <p className="text-xl font-bold text-slate-800 sm:text-2xl">
                {gameData.averageRally}
                <span className="ml-1 text-sm font-normal text-slate-600 sm:text-base">
                  shots
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-lg border border-slate-200/50 bg-white/50 p-3 sm:p-4">
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <div className="rounded bg-slate-500 p-1">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="whitespace-nowrap text-xs font-medium text-slate-600">
                  Longest Rally
                </p>
              </div>
              <p className="text-xl font-bold text-slate-800 sm:text-2xl">
                {gameData.longestRally}
                <span className="ml-1 text-sm font-normal text-slate-600 sm:text-base">
                  shots
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
