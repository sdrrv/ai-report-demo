import React, { useEffect, useState } from 'react';
import { Zap, User, AlertCircle, RefreshCw, Handshake } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePlayerSpeed } from '@/hooks/usePlayerSpeed';
import { PlayerId } from '@/types/backend';

interface SpeedCardProps {
  selectedPlayer: PlayerId;
  matchId?: string;
  delay?: number;
}

const SpeedCard: React.FC<SpeedCardProps> = ({ selectedPlayer, matchId = 'default', delay = 0 }) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);

  // Determine teammate based on selected player
  const getTeammate = (playerId: PlayerId): PlayerId | null => {
    if (playerId === 1) return 2;
    if (playerId === 2) return 1;
    if (playerId === 3) return 4;
    if (playerId === 4) return 3;
    return null;
  };

  const teammateId = getTeammate(selectedPlayer);

  // Fetch real speed data using the hook
  const { data: rawPlayerSpeedData, loading, error, refetch } = usePlayerSpeed({
    playerId: selectedPlayer,
    matchId
  });

  // Add teammate detection to player data
  const playerSpeedData = rawPlayerSpeedData?.map(player => ({
    ...player,
    isTeammate: teammateId === player.playerId
  }));

  // Calculate max speed for progress bar scaling
  const maxSpeed = playerSpeedData ? Math.max(...playerSpeedData.map((p) => p.maxSpeed)) : 0;

  // Animation effect for progress bars
  useEffect(() => {
    if (!playerSpeedData || loading) return;

    const timer = setTimeout(() => {
      const widths = playerSpeedData.map(
        (player) => (player.maxSpeed / maxSpeed) * 100,
      );
      setAnimatedWidths(widths);
    }, delay + 400);

    return () => clearTimeout(timer);
  }, [playerSpeedData, maxSpeed, delay, loading]);

  // Loading state
  if (loading) {
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
                <Zap className="h-5 w-5 text-white" />
              </div>
              Running Speed
            </h2>
            <p className="ml-12 text-sm text-slate-500">
              Loading player speed data...
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="mt-4 rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-lg"
        style={{
          animation: `fade-in 0.5s ease-out ${delay}ms both`,
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-3 text-lg font-semibold text-red-800">
              <div className="rounded-lg bg-red-600 p-2">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              Running Speed
            </h2>
            <p className="ml-12 text-sm text-red-600">
              Failed to load speed data
            </p>
          </div>
        </div>

        <div className="text-center py-6">
          <p className="mb-4 text-sm text-red-600">
            {error.message || 'Unable to load player speed data'}
          </p>
          <button
            onClick={refetch}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!playerSpeedData || playerSpeedData.length === 0) {
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
                <Zap className="h-5 w-5 text-white" />
              </div>
              Running Speed
            </h2>
            <p className="ml-12 text-sm text-slate-500">
              No speed data available
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-sm text-slate-500">
            No player speed data found for this match
          </p>
        </div>
      </div>
    );
  }

  // Success state with data
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
              <Zap className="h-5 w-5 text-white" />
            </div>
            Running Speed
          </h2>
          <p className="ml-12 text-sm text-slate-500">
            Maximum speed reached by each player
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {playerSpeedData.map((player, index) => (
          <div key={player.playerId} className="flex items-center gap-4">
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
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <h3
                    className={`font-medium ${
                      player.isMe ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {player.playerName}
                  </h3>
                  {(player as any).isTeammate && (
                    <Handshake className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 border border-emerald-600 rounded-sm p-0.5" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-medium font-bold text-slate-800">
                    {player.maxSpeed.toFixed(1)} km/h
                  </div>
                  <div
                    className="text-xs text-slate-500 transition-opacity duration-500"
                    style={{
                      opacity: animatedWidths[index] ? 1 : 0,
                      transitionDelay: `${index * 200 + 300}ms`,
                    }}
                  >
                    avg {player.averageSpeed.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out',
                    player.isMe
                      ? 'bg-gradient-to-r from-sky-400 to-sky-500'
                      : 'bg-gradient-to-r from-slate-500 to-slate-600',
                  )}
                  style={{
                    width: `${animatedWidths[index] || 0}%`,
                    transitionDelay: `${index * 200}ms`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Speed Range Info */}
      <div className="mt-6 border-t border-slate-200 pt-4">
        <div className="flex justify-between text-sm text-slate-500">
          <span>0 km/h</span>
          <span>{maxSpeed.toFixed(1)} km/h</span>
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

export default SpeedCard;
