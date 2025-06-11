import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';

const EntryPage: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/report/3');
  }, [navigate]);

  return null;
  const players = [
    {
      id: 1,
      name: 'Player 1',
      position: 'Back Left',
      image: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=P1',
    },
    {
      id: 2,
      name: 'Player 2',
      position: 'Back Right',
      image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=P2',
    },
    {
      id: 3,
      name: 'Player 3',
      position: 'Front Left',
      image: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=P3',
    },
    {
      id: 4,
      name: 'Player 4',
      position: 'Front Right',
      image: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=P4',
    },
  ];

  const handlePlayerClick = (playerId: number) => {
    setSelectedPlayer(playerId);
  };

  const handleContinue = () => {
    if (selectedPlayer) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate(`/report/${selectedPlayer}`);
      }, 300);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(56, 189, 248, 0.5); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.3); }
          50% { border-color: rgba(56, 189, 248, 0.8); box-shadow: 0 0 0 6px rgba(56, 189, 248, 0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-pulse-border { animation: pulse-border 2s infinite; }
      `}</style>

      <div className="w-full max-w-[360px]">
        <div className="animate-fade-in mb-4 text-center">
          <h1 className="mb-1 flex items-center justify-center gap-2 text-xl font-semibold text-slate-800">
            <div className="rounded-lg bg-slate-600 p-1.5">
              <User className="h-4 w-4 text-white" />
            </div>
            Padel AI Report
          </h1>
          <p className="text-xs text-slate-500">Select your position</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {players.map((player, index) => (
            <button
              key={player.id}
              onClick={() => handlePlayerClick(player.id)}
              className={`relative aspect-square rounded-xl border border-slate-200/50 bg-white shadow-md transition-all duration-300 hover:shadow-lg ${
                selectedPlayer === player.id
                  ? 'animate-pulse-border border-[2px] border-sky-400'
                  : 'hover:border-slate-300'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={player.image}
                alt={player.name}
                className="h-full w-full rounded-xl object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <h3 className="text-xs font-medium text-white">
                  {player.name}
                </h3>
                <p className="text-[10px] text-slate-200">{player.position}</p>
              </div>
              {selectedPlayer === player.id && (
                <div className="absolute right-2 top-2 rounded-full bg-sky-500 p-1 shadow">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 0"
                    stroke="inherit"
                  >
                    <path
                      stroke="currentcolor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedPlayer}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-all duration-150 ${
              selectedPlayer
                ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600 hover:shadow-md'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            Continue
            <ArrowRight
              className={`h-4 w-4 transition-transform duration-300 ${
                selectedPlayer ? 'group-hover:translate-x-1' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
