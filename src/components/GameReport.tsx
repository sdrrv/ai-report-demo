import React from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, Clock, Activity, Zap } from 'lucide-react';
import BallMap from './BallMap';
import SpeedCard from './SpeedCard';
import ShotAnalysis from './ShotAnalysis';
import DistanceCard from './PlayerDistance';
import MatchSummary from './MatchSummary';

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
        .animate-fade-in-delay-1 { animation: fade-in 0.5s ease-out 0.1s both; }
        .animate-fade-in-delay-2 { animation: fade-in 0.5s ease-out 0.2s both; }
        .animate-fade-in-delay-3 { animation: fade-in 0.5s ease-out 0.3s both; }
        .animate-fade-in-delay-4 { animation: fade-in 0.5s ease-out 0.4s both; }
      `}</style>

      <div className="mx-auto max-w-md">
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
        <BallMap selectedPlayer={selectedPlayer} />
      </div>
    </div>
  );
};

export default GameReport;
