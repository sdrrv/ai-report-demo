import React from 'react';
import { TrendingUp, Clock, Activity, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useMatchSummary } from '@/hooks/useMatchSummary';

interface MatchSummaryProps {
  matchId?: string;
  delay?: number;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({
  matchId = 'default',
  delay = 0,
}) => {
  const { data: gameData, loading, error, refetch } = useMatchSummary({ matchId });

  // Loading state
  if (loading) {
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
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-600">Loading match data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <div className="ml-2">
              <p className="text-slate-700">Failed to load match data</p>
              <button 
                onClick={refetch}
                className="mt-1 text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!gameData) {
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
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-600">No match data available</p>
          </div>
        </div>
      </div>
    );
  }
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
                  sec
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
                  sec
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
