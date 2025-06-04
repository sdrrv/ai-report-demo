import React, { useEffect, useState } from 'react';
import { Footprints, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PlayerDistance {
  id: number;
  name: string;
  distance: number; // in meters
  isMe?: boolean;
}

interface DistanceCardProps {
  delay?: number;
}

const DistanceCard: React.FC<DistanceCardProps> = ({ delay = 0 }) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);

  // Sample data - replace with actual data
  const playerDistances: PlayerDistance[] = [
    { id: 1, name: 'You', distance: 2500, isMe: true },
    { id: 2, name: 'Player 2', distance: 2200 },
    { id: 3, name: 'Player 3', distance: 1800 },
    { id: 4, name: 'Player 1', distance: 1500 },
  ].sort((a, b) => b.distance - a.distance); // Sort by distance (highest first)

  const maxDistance = Math.max(...playerDistances.map((p) => p.distance));

  useEffect(() => {
    const timer = setTimeout(() => {
      const widths = playerDistances.map(
        (player) => (player.distance / maxDistance) * 100,
      );
      setAnimatedWidths(widths);
    }, delay);
    return () => clearTimeout(timer);
  }, [playerDistances, maxDistance, delay]);

  return (
    <div className="animate-fade-in-delay-4 mt-4 rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-2">
        <Footprints className="h-5 w-5" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Distance Covered
          </h2>
          <p className="text-sm text-gray-500">
            Total distance covered by each player
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {playerDistances.map((player, index) => (
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
                  {player.distance} m
                </span>
              </div>
              {/* Progress Bar */}
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-slate-600 transition-all duration-1000 ease-out"
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
      {/* Distance Range Info */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>0 m</span>
          <span>{maxDistance} m</span>
        </div>
      </div>
    </div>
  );
};

export default DistanceCard;
