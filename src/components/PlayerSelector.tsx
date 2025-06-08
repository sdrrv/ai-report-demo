import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Player {
  id: number;
  position: string;
}

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: number;
  onPlayerSelect: (playerId: number) => void;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  players,
  selectedPlayer,
  onPlayerSelect,
}) => {
  return (
    <div className="mb-6 flex justify-center gap-4">
      {players.map((player) => (
        <button
          key={player.id}
          onClick={() => onPlayerSelect(player.id)}
          className={cn(
            'group flex cursor-pointer flex-col items-center transition-all duration-200',
            'hover:scale-105',
            selectedPlayer === player.id ? 'scale-110' : '',
          )}
        >
          <div
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
              selectedPlayer === player.id
                ? 'bg-slate-600 shadow-lg'
                : 'bg-slate-200 hover:bg-slate-300',
            )}
          >
            <User
              className={cn(
                'h-6 w-6 transition-colors duration-200',
                selectedPlayer === player.id ? 'text-white' : 'text-slate-500',
              )}
            />
          </div>
          <span
            className={cn(
              'mt-1 text-xs transition-all duration-200',
              selectedPlayer === player.id
                ? 'font-semibold text-slate-800'
                : 'text-slate-500',
            )}
          >
            {player.id === 1 ? 'You' : `P${player.id}`}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PlayerSelector;
