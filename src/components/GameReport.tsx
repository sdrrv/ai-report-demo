import React from 'react';
import { Trophy, Target, Shield, Users, TrendingUp } from 'lucide-react';
import CircleChart from './CircleChart';
import DualCircleChart from './DualCircleChart';
import BallMap from './BallMap';
import SpeedCard from './SpeedCard';
import ShotBreakdown from './ShotBreakdown'; // Import the new ShotBreakdown

interface GameData {
  offensive: number;
  defensive: number;
  teamHits: number;
  yourWinners: number;
  teammateWinners: number;
  opponentLeftWinners: number;
  opponentRightWinners: number;
}

interface GameReportProps {
  selectedPlayer: number;
}

const GameReport: React.FC<GameReportProps> = ({ selectedPlayer }) => {
  // Sample data - you can replace with actual data based on selectedPlayer
  const gameData: GameData = {
    offensive: 65,
    defensive: 35,
    teamHits: 72,
    yourWinners: 45,
    teammateWinners: 38,
    opponentLeftWinners: 28,
    opponentRightWinners: 35,
  };

  return (
    <div className="min-h-screen p-4">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-delay-1 { animation: fade-in 0.5s ease-out 0.1s both; }
        .animate-fade-in-delay-2 { animation: fade-in 0.5s ease-out 0.2s both; }
        .animate-fade-in-delay-3 { animation: fade-in 0.5s ease-out 0.3s both; }
        .animate-fade-in-delay-4 { animation: fade-in 0.5s ease-out 0.4s both; }
        .animate-fade-in-delay-5 { animation: fade-in 0.5s ease-out 0.5s both; }
      `}</style>

      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="animate-fade-in mb-4 rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Game Report</h1>
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500">
            Player {selectedPlayer} - Match Analysis & Performance
          </p>
        </div>

        {/* Shot Type Distribution */}
        <div className="animate-fade-in-delay-1 mb-4 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Target className="h-5 w-5 text-gray-600" />
            Shot Distribution
          </h2>
          <div className="flex justify-center">
            <DualCircleChart
              offensive={gameData.offensive}
              defensive={gameData.defensive}
              delay={200}
            />
          </div>
        </div>

        {/* Shot Breakdown - New Component */}
        <ShotBreakdown delay={400} />

        {/* Team Performance */}
        <div className="animate-fade-in-delay-2 mb-4 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Users className="h-5 w-5 text-gray-600" />
            Team Performance
          </h2>
          <div className="flex justify-around items-center">
            <CircleChart
              percentage={gameData.teamHits}
              label="Team Hits"
              color="#10b981"
              size={100}
              delay={600}
            />
            <div className="flex flex-col gap-4">
              <CircleChart
                percentage={gameData.yourWinners}
                label="Your Winners"
                color="#8b5cf6"
                size={80}
                strokeWidth={8}
                delay={800}
              />
              <CircleChart
                percentage={gameData.teammateWinners}
                label="Partner Winners"
                color="#06b6d4"
                size={80}
                strokeWidth={8}
                delay={1000}
              />
            </div>
          </div>
        </div>

        {/* Opponent Performance */}
        <div className="animate-fade-in-delay-3 rounded-2xl bg-white p-6 shadow-lg">
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
              delay={1200}
            />
            <CircleChart
              percentage={gameData.opponentRightWinners}
              label="Right Player"
              color="#ec4899"
              size={100}
              delay={1400}
            />
          </div>
        </div>

        {/* Speed Card */}
        <SpeedCard delay={1600} />

        {/* Ball Map */}
        <BallMap selectedPlayer={selectedPlayer} />

        {/* Summary Stats */}
        <div className="animate-fade-in-delay-5 mt-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Match Summary</h3>
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <p className="text-sm opacity-90">Total Winners</p>
              <p className="text-2xl font-bold">
                {gameData.yourWinners + gameData.teammateWinners}%
              </p>
            </div>
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <p className="text-sm opacity-90">Win Rate</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  ((gameData.yourWinners + gameData.teammateWinners) /
                    (gameData.yourWinners +
                      gameData.teammateWinners +
                      gameData.opponentLeftWinners +
                      gameData.opponentRightWinners)) *
                    100,
                )}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReport;
