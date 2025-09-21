import React from 'react';
import { Crown, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PlayerId } from '@/types/backend';

interface TeamsCardProps {
  selectedPlayer: PlayerId;
  delay?: number;
}

interface Player {
  id: PlayerId;
  label: string;
  isSelected: boolean;
}

const TeamsCard: React.FC<TeamsCardProps> = ({ selectedPlayer, delay = 0 }) => {
  // Define players for Team 1 vs Team 2
  const team1: Player[] = [
    { id: 1, label: 'P1', isSelected: selectedPlayer === 1 },
    { id: 2, label: 'P2', isSelected: selectedPlayer === 2 },
  ];

  const team2: Player[] = [
    { id: 3, label: 'P3', isSelected: selectedPlayer === 3 },
    { id: 4, label: 'P4', isSelected: selectedPlayer === 4 },
  ];

  const renderPlayer = (player: Player, index: number) => (
    <div
      key={player.id}
      className="flex flex-col items-center gap-2"
      style={{
        animation: `fade-in 0.5s ease-out ${delay + 200 + index * 100}ms both`,
      }}
    >
      {/* Player Avatar */}
      <div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 transition-all duration-300',
          player.isSelected && 'ring-4 ring-sky-500 ring-offset-2 ring-offset-white scale-110',
        )}
      >
        <User className="h-6 w-6 text-slate-600" />
        {player.isSelected && (
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-500 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        )}
      </div>

      {/* Player Label */}
      <span
        className={cn(
          'text-xs font-medium tracking-wide',
          player.isSelected ? 'text-sky-600 font-semibold' : 'text-slate-600'
        )}
      >
        {player.isSelected ? 'You' : player.label}
      </span>
    </div>
  );

  return (
    <div
      className="mb-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="mb-1 flex items-center gap-3">
          <div className="rounded-lg bg-slate-600 p-2">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Teams</h2>
            <p className="text-sm text-slate-500">
              Match lineup
            </p>
          </div>
        </div>
      </div>

      {/* VS Layout */}
      <div className="flex items-center justify-center gap-6">
        {/* Team 1 */}
        <div className="flex gap-4">
          {team1.map((player, index) => renderPlayer(player, index))}
        </div>

        {/* VS Separator */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-sm shadow-lg"
          style={{
            animation: `fade-in 0.5s ease-out ${delay + 400}ms both`,
          }}
        >
          VS
        </div>

        {/* Team 2 */}
        <div className="flex gap-4">
          {team2.map((player, index) => renderPlayer(player, index + 2))}
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

export default TeamsCard;