import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, Zap, AlertCircle, Loader2, Timer } from 'lucide-react';
import { useMatchSummary } from '@/hooks/useMatchSummary';

interface MatchSummaryProps {
  matchId?: string;
  delay?: number;
}

interface TimeProgressChartProps {
  totalGameTime: number;
  rallyTime: number;
  rallyPercentage: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

const TimeProgressChart: React.FC<TimeProgressChartProps> = ({
  totalGameTime,
  rallyTime,
  rallyPercentage,
  size = 200,
  strokeWidth = 16,
  delay = 0,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash arrays for the rally time segment
  const rallyLength = (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(rallyPercentage);
    }, delay + 200);
    return () => clearTimeout(timer);
  }, [rallyPercentage, delay]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-3">
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Rally time progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${rallyLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transition-all duration-1500 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1 rounded-lg bg-slate-600 p-1.5 shadow-sm">
            <Timer className="h-4 w-4 text-white" />
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 font-medium">Rally Time</div>
            <div className="text-2xl font-bold text-sky-600 my-1">
              {rallyTime} min
            </div>
            <div className="h-px w-12 bg-slate-300 mx-auto my-1"></div>
            <div className="text-xs text-slate-500 font-medium">Total Time</div>
            <div className="text-base font-bold text-slate-700">
              {totalGameTime} min
            </div>
          </div>
        </div>
      </div>

      {/* Percentage display */}
      <div className="text-center">
        <div className="text-2xl font-bold text-sky-600 mb-1">
          {rallyPercentage}%
        </div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Rally Time
        </div>
      </div>
    </div>
  );
};

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

        {/* Time Progress Chart Section */}
        <div className="mb-6 flex justify-center">
          <TimeProgressChart
            totalGameTime={gameData.totalGameTime}
            rallyTime={gameData.timeInPlay}
            rallyPercentage={gameData.rallyTimePercentage}
            delay={delay + 300}
          />
        </div>

        {/* Rally Statistics Section */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Average Rally */}
          <div
            className="rounded-xl border border-slate-200/50 bg-gradient-to-br from-white/80 to-slate-50/50 p-4 shadow-sm"
            style={{
              animation: `fade-in 0.5s ease-out ${delay + 600}ms both`,
            }}
          >
            <div className="text-center">
              <div className="mb-3 flex items-center justify-center">
                <div className="rounded-lg bg-slate-600 p-2 shadow-sm">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {gameData.averageRally}
                <span className="ml-1 text-sm font-medium text-slate-600">
                  sec
                </span>
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Average Rally
              </div>
            </div>
          </div>

          {/* Longest Rally */}
          <div
            className="rounded-xl border border-slate-200/50 bg-gradient-to-br from-white/80 to-slate-50/50 p-4 shadow-sm"
            style={{
              animation: `fade-in 0.5s ease-out ${delay + 700}ms both`,
            }}
          >
            <div className="text-center">
              <div className="mb-3 flex items-center justify-center">
                <div className="rounded-lg bg-slate-600 p-2 shadow-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {gameData.longestRally}
                <span className="ml-1 text-sm font-medium text-slate-600">
                  sec
                </span>
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Longest Rally
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
