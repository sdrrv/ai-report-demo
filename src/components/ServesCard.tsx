import React, { useEffect, useState } from 'react';
import { Zap, Target, Trophy } from 'lucide-react';
import TripleCircleChart from './TripleCricleChart';
import PlayerSelector from './PlayerSelector';
import { TennisBall } from '@/assets/icons/TennisBall';
import { cn } from '@/utils/cn';
import BounceBall from '@/assets/icons/bounceBall.svg';

interface Player {
  id: number;
  position: string;
}

interface PlayerServeData {
  firstServeSuccess: number; // percentage
  avgServeSpeed: number; // km/h
  serveToCenter: number; // percentage
  serveToBody: number; // percentage
  serveToWall: number; // percentage
  lowStrokeReturn: number; // percentage
  lobReturn: number; // percentage
}

interface ServesCardProps {
  delay?: number;
}

const ServesCard: React.FC<ServesCardProps> = ({ delay = 0 }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(1);
  const [animatedReturnWidths, setAnimatedReturnWidths] = useState<number[]>(
    [],
  );
  const [showStats, setShowStats] = useState(false);

  const players: Player[] = [
    { id: 1, position: 'Back Left' },
    { id: 2, position: 'Back Right' },
    { id: 3, position: 'Front Left' },
    { id: 4, position: 'Front Right' },
  ];

  // Sample data for different players - replace with actual data
  const playerData: Record<number, PlayerServeData> = {
    1: {
      firstServeSuccess: 81,
      avgServeSpeed: 57,
      serveToCenter: 47,
      serveToBody: 9,
      serveToWall: 44,
      lowStrokeReturn: 70,
      lobReturn: 30,
    },
    2: {
      firstServeSuccess: 75,
      avgServeSpeed: 52,
      serveToCenter: 40,
      serveToBody: 25,
      serveToWall: 35,
      lowStrokeReturn: 65,
      lobReturn: 35,
    },
    3: {
      firstServeSuccess: 88,
      avgServeSpeed: 61,
      serveToCenter: 50,
      serveToBody: 15,
      serveToWall: 35,
      lowStrokeReturn: 75,
      lobReturn: 25,
    },
    4: {
      firstServeSuccess: 70,
      avgServeSpeed: 48,
      serveToCenter: 35,
      serveToBody: 30,
      serveToWall: 35,
      lowStrokeReturn: 60,
      lobReturn: 40,
    },
  };

  const currentPlayerData = playerData[selectedPlayer];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStats(true);

      // Animate return type bars
      const returnTypes = [
        { percentage: currentPlayerData.lowStrokeReturn },
        { percentage: currentPlayerData.lobReturn },
      ];

      const maxReturnPercentage = Math.max(
        ...returnTypes.map((r) => r.percentage),
      );
      const widths = returnTypes.map(
        (r) => (r.percentage / maxReturnPercentage) * 100,
      );
      setAnimatedReturnWidths(widths);
    }, delay + 600);

    return () => clearTimeout(timer);
  }, [currentPlayerData, delay, selectedPlayer]);

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayer(playerId);
    // Reset animations
    setAnimatedReturnWidths([]);
    setShowStats(false);
  };

  return (
    <div
      className="mt-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 flex items-center gap-3 text-lg font-semibold text-slate-800">
            <div className="rounded-lg bg-slate-600 p-2">
              <img
                src={BounceBall}
                alt="Bounce Ball"
                className="h-6 w-6 brightness-0 invert filter"
              />
            </div>
            Serves Analysis
          </h2>
          <p className="ml-12 text-sm text-slate-500">
            Serve performance and distribution breakdown
          </p>
        </div>
      </div>

      {/* Player Selector */}
      <PlayerSelector
        players={players}
        selectedPlayer={selectedPlayer}
        onPlayerSelect={handlePlayerSelect}
      />

      {/* Serve Distribution */}
      <div className="mb-8 mt-10 flex justify-center px-4">
        <TripleCircleChart
          center={currentPlayerData.serveToCenter}
          body={currentPlayerData.serveToBody}
          wall={currentPlayerData.serveToWall}
          delay={delay + 400}
        />
      </div>

      {/* Key Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="rounded bg-slate-500 p-1">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
              1st Serve Success
            </span>
          </div>
          <div
            className={cn(
              'text-3xl font-bold text-slate-800 transition-all duration-1000',
              showStats ? 'opacity-100' : 'opacity-0',
            )}
          >
            {currentPlayerData.firstServeSuccess}%
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="rounded bg-slate-500 p-1">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
              Avg. Serve Speed
            </span>
          </div>
          <div
            className={cn(
              'text-3xl font-bold text-slate-800 transition-all duration-1000',
              showStats ? 'opacity-100' : 'opacity-0',
            )}
          >
            {currentPlayerData.avgServeSpeed}
            <span className="ml-1 text-lg font-normal text-slate-600">
              km/h
            </span>
          </div>
        </div>
      </div>

      {/* Type of Serve Return */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-sky-500 p-2">
            <TennisBall className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Type of serve return
          </h3>
        </div>

        <div className="space-y-3">
          {/* Low Stroke */}
          <div className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-slate-700">
              Low stroke
            </div>
            <div className="relative flex-1">
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${animatedReturnWidths[0] || 0}%`,
                    transitionDelay: '0ms',
                  }}
                />
              </div>
            </div>
            <div className="w-10 text-right">
              <span className="text-sm font-semibold text-slate-800">
                {currentPlayerData.lowStrokeReturn}%
              </span>
            </div>
          </div>

          {/* Lob */}
          <div className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-slate-700">Lob</div>
            <div className="relative flex-1">
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${animatedReturnWidths[1] || 0}%`,
                    transitionDelay: '150ms',
                  }}
                />
              </div>
            </div>
            <div className="w-10 text-right">
              <span className="text-sm font-semibold text-slate-800">
                {currentPlayerData.lobReturn}%
              </span>
            </div>
          </div>
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

export default ServesCard;
