import React, { useEffect, useState } from 'react';
import { Zap, User } from 'lucide-react';

interface PlayerSpeed {
  id: number;
  name: string;
  speed: number; // km/h
  isMe?: boolean;
}

interface SpeedCardProps {
  selectedPlayer: number;
  delay?: number;
}

const SpeedCard: React.FC<SpeedCardProps> = ({ selectedPlayer, delay = 0 }) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);

  // Sample data - replace with actual data based on selectedPlayer
  const playerSpeeds: PlayerSpeed[] = [
    { id: 1, name: 'You', speed: 28.5, isMe: true },
    { id: 2, name: 'Player 2', speed: 24.3 },
    { id: 3, name: 'Player 3', speed: 19.7 },
    { id: 4, name: 'Player 1', speed: 16.2 },
  ].sort((a, b) => b.speed - a.speed); // Sort by speed (highest first)

  const maxSpeed = Math.max(...playerSpeeds.map(p => p.speed));

  useEffect(() => {
    const timer = setTimeout(() => {
      const widths = playerSpeeds.map(player => (player.speed / maxSpeed) * 100);
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
          <p className="text-sm text-gray-500">Maximum speed reached by each player</p>
        </div>
      </div>

      <div className="space-y-4">
        {playerSpeeds.map((player, index) => (
          <div key={player.id} className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`relative h-12 w-12 rounded-full flex items-center justify-center ${
              player.isMe 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                : 'bg-gray-200'
            }`}>
              
                <User className="h-6 w-6 text-gray-500" />
            </div>

            {/* Player Info and Progress */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${
                  player.isMe ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {player.name}
                </h3>
                <span className="text-lg font-bold text-gray-900">
                  {player.speed.toFixed(1)} km/h
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    player.isMe 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gray-800'
                  }`}
                  style={{ 
                    width: `${animatedWidths[index] || 0}%`,
                    transitionDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Speed Range Info */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500">
          <span>0 km/h</span>
          <span>{maxSpeed.toFixed(1)} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default SpeedCard;