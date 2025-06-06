import React from 'react';
import { useParams } from 'react-router-dom';
import BallMap from './BallMap';
import SpeedCard from './SpeedCard';
import ShotAnalysis from './ShotAnalysis';
import DistanceCard from './PlayerDistance';
import MatchSummary from './MatchSummary';
import PointsErrorsCard from './PlayerStats';
import logo from '@/assets/images/iconBorder.png';

interface GameData {
  offensive: number;
  defensive: number;
  rightShots: number;
  centerShots: number;
  leftShots: number;
  opponentLeftWinners: number;
  opponentRightWinners: number;
  timeInPlay: number;
  averageRally: number;
  longestRally: number;
}

const GameReport: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const selectedPlayer = playerId ? parseInt(playerId) : null;

  if (!selectedPlayer || isNaN(selectedPlayer)) {
    return <div className="p-4 text-red-500">Invalid player ID.</div>;
  }

  const gameData: GameData = {
    offensive: 65,
    defensive: 35,
    rightShots: 35,
    centerShots: 40,
    leftShots: 25,
    opponentLeftWinners: 28,
    opponentRightWinners: 35,
    timeInPlay: 42,
    averageRally: 6.3,
    longestRally: 24,
  };

  return (
    <div className="min-h-screen p-4">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes logo-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          60% { transform: translateY(-2px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-fade-in-delay-1 { animation: fade-in 0.5s ease-out 0.1s both; }
        .animate-fade-in-delay-2 { animation: fade-in 0.5s ease-out 0.2s both; }
        .animate-fade-in-delay-3 { animation: fade-in 0.5s ease-out 0.3s both; }
        .animate-fade-in-delay-4 { animation: fade-in 0.5s ease-out 0.4s both; }
        .animate-slide-in { animation: slide-in 0.8s ease-out 0.2s both; }
        .animate-logo-bounce { animation: logo-bounce 1s ease-in-out 0.3s; }
      `}</style>

      <div className="mx-auto max-w-md">
        {/* Header with Logo and Title */}

        <div className="relative mb-8 pt-4">
          {/*<div className="flex items-center justify-center space-x-3 px-4 sm:space-x-5">
            <div className="relative flex-shrink-0">
              <img
                src={logo}
                className="animate-logo-bounce h-16 w-auto drop-shadow-sm sm:h-20"
                alt="Logo"
              />
            </div>
            <div className="min-w-0 text-center">
              <h1 className="animate-slide-in whitespace-nowrap bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Match Report
              </h1>
              <p className="animate-fade-in-delay-1 mt-1 text-xs font-medium tracking-wide text-gray-500 sm:text-sm">
                Performance Analytics
              </p>
            </div>
          </div>*/}

          {/* Decorative elements */}
          <div className="absolute -right-2 -top-2 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 blur-xl delay-1000"></div>
        </div>

        <MatchSummary gameData={gameData} />
        <ShotAnalysis
          delay={400}
          offensive={gameData.offensive}
          defensive={gameData.defensive}
          rightShots={gameData.rightShots}
          centerShots={gameData.centerShots}
          leftShots={gameData.leftShots}
        />
        <SpeedCard delay={1800} />
        <DistanceCard />
        <PointsErrorsCard selectedPlayer={selectedPlayer} delay={600} />
        <BallMap />
      </div>
    </div>
  );
};

export default GameReport;
