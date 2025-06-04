import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Target,
  Shield,
  Users,
  TrendingUp,
  Clock,
  Activity,
  Zap,
} from 'lucide-react';
import CircleChart from './CircleChart';
import DualCircleChart from './DualCircleChart';
import BallMap from './BallMap';
import SpeedCard from './SpeedCard';
import ShotBreakdown from './ShotBreakdown';
import DistanceCard from './PlayerDistance';

interface GameData {
  offensive: number;
  defensive: number;
  teamHits: number;
  yourWinners: number;
  teammateWinners: number;
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
    teamHits: 72,
    yourWinners: 45,
    teammateWinners: 38,
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
        <div className="animate-fade-in-delay-1 mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Match Summary</h3>
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-1">
                <Clock className="h-4 w-4 opacity-80" />
                <p className="text-xs opacity-90">Time in Play</p>
              </div>
              <p className="text-xl font-bold">{gameData.timeInPlay} min</p>
            </div>
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-1">
                <Activity className="h-4 w-4 opacity-80" />
                <p className="text-xs opacity-90">Avg Rally</p>
              </div>
              <p className="text-xl font-bold">{gameData.averageRally} shots</p>
            </div>
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-1">
                <Zap className="h-4 w-4 opacity-80" />
                <p className="text-xs opacity-90">Longest Rally</p>
              </div>
              <p className="text-xl font-bold">{gameData.longestRally} shots</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-delay-2 mb-4 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Target className="h-5 w-5 text-gray-600" />
            Shot Distribution
          </h2>
          <div className="flex justify-center">
            <DualCircleChart
              offensive={gameData.offensive}
              defensive={gameData.defensive}
              delay={400}
            />
          </div>
        </div>

        <ShotBreakdown delay={600} />

        <div className="animate-fade-in-delay-3 mb-4 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Users className="h-5 w-5 text-gray-600" />
            Team Performance
          </h2>
          <div className="flex items-center justify-around">
            <CircleChart
              percentage={gameData.teamHits}
              label="Team Hits"
              color="#10b981"
              size={100}
              delay={800}
            />
            <div className="flex flex-col gap-4">
              <CircleChart
                percentage={gameData.yourWinners}
                label="Your Winners"
                color="#8b5cf6"
                size={80}
                strokeWidth={8}
                delay={1000}
              />
              <CircleChart
                percentage={gameData.teammateWinners}
                label="Partner Winners"
                color="#06b6d4"
                size={80}
                strokeWidth={8}
                delay={1200}
              />
            </div>
          </div>
        </div>

        <div className="animate-fade-in-delay-4 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Shield className="h-5 w-5 text-gray-600" />
            Opponent Winners
          </h2>
          <div className="flex justify-around">
            <CircleChart
              percentage={gameData.opponentLeftWinners}
              label="Left Player"
              color="#f59e0b"
              size={100}
              delay={1400}
            />
            <CircleChart
              percentage={gameData.opponentRightWinners}
              label="Right Player"
              color="#ec4899"
              size={100}
              delay={1600}
            />
          </div>
        </div>

        <SpeedCard delay={1800} />
        <DistanceCard />
        <BallMap selectedPlayer={selectedPlayer} />
      </div>
    </div>
  );
};

export default GameReport;
