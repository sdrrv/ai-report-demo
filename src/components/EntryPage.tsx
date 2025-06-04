import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EntryPage: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

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
      className={`flex min-h-screen items-center justify-center p-4 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgb(59 130 246); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          50% { border-color: rgb(59 130 246); box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-pulse-border { animation: pulse-border 2s infinite; }
      `}</style>

      <div className="w-full max-w-2xl">
        <div className="animate-fade-in mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            Welcome to Padel AI Report
          </h1>
          <p className="text-lg text-gray-600">
            Select your position to view your personalized match analysis
          </p>
        </div>

        <div className="animate-scale-in mb-8 grid grid-cols-2 gap-4">
          {players.map((player, index) => (
            <button
              key={player.id}
              onClick={() => handlePlayerClick(player.id)}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedPlayer === player.id
                  ? 'animate-pulse-border border-4 border-blue-500'
                  : 'border-2 border-transparent hover:border-gray-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={player.image}
                  alt={player.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="p-4">
                <h3 className="mb-1 text-xl font-semibold text-gray-800">
                  {player.name}
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    selectedPlayer === player.id
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {player.position}
                </p>
              </div>

              {selectedPlayer === player.id && (
                <div className="absolute right-4 top-4">
                  <div className="rounded-full bg-blue-500 p-2 text-white shadow-lg">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedPlayer}
            className={`group flex items-center gap-3 rounded-full px-8 py-4 font-semibold transition-all duration-300 ${
              selectedPlayer
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg'
                : 'cursor-not-allowed bg-gray-200 text-gray-400'
            }`}
          >
            Continue to Report
            <ArrowRight
              className={`h-5 w-5 transition-transform duration-300 ${
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
