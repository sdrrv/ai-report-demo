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
    timeInPlay: 25,
    averageRally: 8,
    longestRally: 23,
  },
  delay = 0,
}) => {
  return (
    <div className="mx-auto max-w-md">
      <div
        className="mb-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
        style={{
          animation: `fade-in 0.5s ease-out ${delay}ms both`,
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="rounded-lg bg-slate-600 p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Match Summary
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200/50 bg-white/50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <div className="rounded bg-slate-500 p-1">
                <Clock className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-600">Time in Play</p>
            </div>
            <p className="text-xl font-bold text-slate-800">
              {gameData.timeInPlay} min
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/50 bg-white/50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <div className="rounded bg-slate-500 p-1">
                <Activity className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-600">Avg Rally</p>
            </div>
            <p className="text-xl font-bold text-slate-800">
              {gameData.averageRally} shots
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/50 bg-white/50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <div className="rounded bg-slate-500 p-1">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-600">
                Longest Rally
              </p>
            </div>
            <p className="text-xl font-bold text-slate-800">
              {gameData.longestRally} shots
            </p>
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

export default MatchSummary;
