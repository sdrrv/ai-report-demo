// components/PlayerSelector.tsx
import React from 'react';
import { User } from 'lucide-react';
import { PlayerSelectorProps } from '../types';

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  players,
  selectedPlayer,
}) => {
  return (
    <div className="mb-6 flex justify-center gap-4">
      {players.map((player) => (
        <div
          key={player.id}
          className="group flex cursor-pointer flex-col items-center"
        >
          <div
            className={`transition-transform ${
              player.id === selectedPlayer
                ? 'scale-110'
                : 'group-hover:scale-105'
            }`}
          >
            <User
              className={`h-6 w-6 ${
                player.id === selectedPlayer ? 'text-sky-500' : 'text-gray-600'
              }`}
            />
          </div>
          <span
            className={`mt-1 text-xs ${
              player.id === selectedPlayer
                ? 'font-semibold text-sky-500'
                : 'text-gray-500'
            }`}
          >
            {player.id === selectedPlayer ? 'You' : `P${player.id}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PlayerSelector;
