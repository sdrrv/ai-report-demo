import React, { useEffect, useState } from 'react';
import { Zap, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PlayerSpeed {
  id: number;
  name: string;
  speed: number; // km/h (max speed)
  avgSpeed: number; // km/h (average speed)
  isMe?: boolean;
}

interface SpeedCardProps {
  //selectedPlayer: number;
  delay?: number;
}

const SpeedCard: React.FC<SpeedCardProps> = ({ delay = 0 }) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);

  // Sample data - replace with actual data based on selectedPlayer
  const playerSpeeds: PlayerSpeed[] = [
    { id: 1, name: 'You', speed: 28.5, avgSpeed: 22.3, isMe: true },
    { id: 2, name: 'Player 2', speed: 24.3, avgSpeed: 19.8 },
    { id: 3, name: 'Player 3', speed: 19.7, avgSpeed: 16.2 },
    { id: 4, name: 'Player 1', speed: 16.2, avgSpeed: 13.5 },
  ].sort((a, b) => b.speed - a.speed); // Sort by speed (highest first)

  const maxSpeed = Math.max(...playerSpeeds.map((p) => p.speed));

  useEffect(() => {
    const timer = setTimeout(() => {
      const widths = playerSpeeds.map(
        (player) => (player.speed / maxSpeed) * 100,
      );
      setAnimatedWidths(widths);
    }, delay + 400);

    return () => clearTimeout(timer);
  }, [playerSpeeds, maxSpeed, delay]);

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
        {playerSpeeds.map((player, index) => (
          <div key={player.id} className="flex items-center gap-4">
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
                <h3
                  className={`font-medium ${
                    player.isMe ? 'text-slate-900' : 'text-slate-700'
                  }`}
                >
                  {player.name}
                </h3>
                <div className="text-right">
                  <div className="text-medium font-bold text-slate-800">
                    {player.speed.toFixed(1)} km/h
                  </div>
                  <div
                    className="text-xs text-slate-500 transition-opacity duration-500"
                    style={{
                      opacity: animatedWidths[index] ? 1 : 0,
                      transitionDelay: `${index * 200 + 300}ms`,
                    }}
                  >
                    avg {player.avgSpeed.toFixed(1)}
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
