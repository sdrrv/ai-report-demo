import React, { useEffect, useState } from 'react';
import { Zap, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PlayerSpeed {
  id: number;
  name: string;
  speed: number; // km/h
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
    { id: 1, name: 'You', speed: 28.5, isMe: true },
    { id: 2, name: 'Player 2', speed: 24.3 },
    { id: 3, name: 'Player 3', speed: 19.7 },
    { id: 4, name: 'Player 1', speed: 16.2 },
  ].sort((a, b) => b.speed - a.speed); // Sort by speed (highest first)

  const maxSpeed = Math.max(...playerSpeeds.map((p) => p.speed));

  useEffect(() => {
    const timer = setTimeout(() => {
      const widths = playerSpeeds.map(
        (player) => (player.speed / maxSpeed) * 100,
      );
      setAnimatedWidths(widths);
    }, delay);

    return () => clearTimeout(timer);
  }, [playerSpeeds, maxSpeed, delay]);

  return (
    <div className="animate-fade-in-delay-4 mt-4 rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-5 w-5" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Running Speed</h2>
          <p className="text-sm text-gray-500">
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
                'relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200',
                player.isMe && 'border-[2px] border-slate-500',
              )}
            >
              <User className="h-6 w-6 text-gray-500" />
            </div>

            {/* Player Info and Progress */}
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h3
                  className={`font-medium ${
                    player.isMe ? 'text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {player.name}
                </h3>
                <span className="text-medium font-bold text-gray-900">
                  {player.speed.toFixed(1)} km/h
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={
                    'absolute left-0 top-0 h-full rounded-full bg-slate-600 transition-all duration-1000 ease-out'
                  }
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
      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>0 km/h</span>
          <span>{maxSpeed.toFixed(1)} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default SpeedCard;
