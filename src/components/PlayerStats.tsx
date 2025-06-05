import React, { useEffect, useState } from 'react';
import { Target, AlertCircle, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PlayerStats {
  id: number;
  name: string;
  points: number;
  errors: number;
  isMe?: boolean;
  isTeammate?: boolean;
}

interface PointsErrorsCardProps {
  selectedPlayer: number;
  delay?: number;
}

const PointsErrorsCard: React.FC<PointsErrorsCardProps> = ({
  selectedPlayer,
  delay = 0,
}) => {
  const [animatedPoints, setAnimatedPoints] = useState<number[]>([]);
  const [animatedErrors, setAnimatedErrors] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);

  // Sample data - replace with actual data based on selectedPlayer
  // Assuming selectedPlayer 1 is paired with Player 2 as teammate
  const playerStats: PlayerStats[] = [
    { id: 1, name: 'You', points: 32, errors: 8, isMe: true },
    {
      id: 2,
      name: 'Teammate (Player 2)',
      points: 28,
      errors: 11,
      isTeammate: true,
    },
    { id: 3, name: 'Player 3', points: 25, errors: 13 },
    { id: 4, name: 'Player 4', points: 22, errors: 9 },
  ];

  const maxPoints = Math.max(...playerStats.map((p) => p.points));
  const maxErrors = Math.max(...playerStats.map((p) => p.errors));
  const totalPoints = playerStats.reduce((sum, p) => sum + p.points, 0);
  const totalErrors = playerStats.reduce((sum, p) => sum + p.errors, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const pointWidths = playerStats.map(
        (player) => (player.points / maxPoints) * 100,
      );
      const errorWidths = playerStats.map(
        (player) => (player.errors / maxErrors) * 100,
      );
      setAnimatedPoints(pointWidths);
      setAnimatedErrors(errorWidths);

      setTimeout(() => {
        setShowStats(true);
      }, 300);
    }, delay + 400);

    return () => clearTimeout(timer);
  }, [playerStats, maxPoints, maxErrors, delay]);

  return (
    <div
      className="mt-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 flex items-center gap-3 text-lg font-semibold text-slate-800">
            <div className="rounded-lg bg-slate-600 p-2">
              <Target className="h-5 w-5 text-white" />
            </div>
            Points & Errors
          </h2>
          <p className="ml-12 text-sm text-slate-500">
            Match performance breakdown
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Points Won Section */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <div className="h-2 w-2 rounded-full bg-slate-600"></div>
            Points Won
          </h3>
          <div className="space-y-3">
            {playerStats
              .sort((a, b) => b.points - a.points)
              .map((player, index) => (
                <div
                  key={`points-${player.id}`}
                  className="flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-200',
                      player.isMe && 'border-[2px] border-sky-500',
                    )}
                  >
                    <User className="h-6 w-6 text-slate-500" />
                  </div>

                  {/* Player Info and Progress */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4
                        className={`text-sm font-medium ${
                          player.isMe ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {player.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {player.points}
                        </span>
                        <span
                          className="text-xs text-slate-500 transition-opacity duration-500"
                          style={{
                            opacity: showStats ? 1 : 0,
                            transitionDelay: `${index * 100 + 300}ms`,
                          }}
                        >
                          ({((player.points / totalPoints) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={cn(
                          'absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out',
                          player.isMe
                            ? 'bg-gradient-to-r from-sky-400 to-sky-500'
                            : 'bg-gradient-to-r from-slate-500 to-slate-600',
                        )}
                        style={{
                          width: `${animatedPoints[index] || 0}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Errors Section */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <div className="h-2 w-2 rounded-full bg-slate-600"></div>
            Errors Made
          </h3>
          <div className="space-y-3">
            {playerStats
              .sort((a, b) => b.errors - a.errors)
              .map((player, index) => (
                <div
                  key={`errors-${player.id}`}
                  className="flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-200',
                      player.isMe && 'border-[2px] border-sky-500',
                    )}
                  >
                    <User className="h-6 w-6 text-slate-500" />
                  </div>

                  {/* Player Info and Progress */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4
                        className={`text-sm font-medium ${
                          player.isMe ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {player.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {player.errors}
                        </span>
                        <span
                          className="text-xs text-slate-500 transition-opacity duration-500"
                          style={{
                            opacity: showStats ? 1 : 0,
                            transitionDelay: `${index * 100 + 600}ms`,
                          }}
                        >
                          ({((player.errors / totalErrors) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={cn(
                          'absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out',
                          player.isMe
                            ? 'bg-gradient-to-r from-sky-400 to-sky-500'
                            : 'bg-gradient-to-r from-slate-500 to-slate-600',
                        )}
                        style={{
                          width: `${animatedErrors[index] || 0}%`,
                          transitionDelay: `${index * 100 + 400}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 border-t border-slate-200 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Total Points</span>
            <span
              className="font-semibold text-slate-700 transition-opacity duration-500"
              style={{ opacity: showStats ? 1 : 0 }}
            >
              {totalPoints}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Total Errors</span>
            <span
              className="font-semibold text-slate-700 transition-opacity duration-500"
              style={{ opacity: showStats ? 1 : 0 }}
            >
              {totalErrors}
            </span>
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

export default PointsErrorsCard;
