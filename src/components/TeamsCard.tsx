import React from 'react';
import { Handshake, User } from 'lucide-react';
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
  isTeammate: boolean;
}

const TeamsCard: React.FC<TeamsCardProps> = ({ selectedPlayer, delay = 0 }) => {
  // Determine teammate based on selected player
  const getTeammate = (playerId: PlayerId): PlayerId | null => {
    if (playerId === 1) return 2;
    if (playerId === 2) return 1;
    if (playerId === 3) return 4;
    if (playerId === 4) return 3;
    return null;
  };

  const teammateId = getTeammate(selectedPlayer);

  // Define players for Team 1 vs Team 2
  const team1: Player[] = [
    { id: 1, label: 'P1', isSelected: selectedPlayer === 1, isTeammate: teammateId === 1 },
    { id: 2, label: 'P2', isSelected: selectedPlayer === 2, isTeammate: teammateId === 2 },
  ];

  const team2: Player[] = [
    { id: 3, label: 'P3', isSelected: selectedPlayer === 3, isTeammate: teammateId === 3 },
    { id: 4, label: 'P4', isSelected: selectedPlayer === 4, isTeammate: teammateId === 4 },
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
          'relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 transition-all duration-300',
          player.isSelected && 'ring-2 sm:ring-4 ring-sky-500 ring-offset-1 sm:ring-offset-2 ring-offset-white scale-110',
          player.isTeammate && !player.isSelected && 'ring-[3px] ring-emerald-600 ring-offset-1 ring-offset-white',
        )}
      >
        <User className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
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
            <Handshake className="h-5 w-5 text-white" />
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
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {/* Team 1 */}
        <div className="flex gap-2 sm:gap-4">
          {team1.map((player, index) => renderPlayer(player, index))}
        </div>

        {/* VS Separator */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-sm shadow-lg flex-shrink-0"
          style={{
            animation: `fade-in 0.5s ease-out ${delay + 400}ms both`,
          }}
        >
          VS
        </div>

        {/* Team 2 */}
        <div className="flex gap-2 sm:gap-4">
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