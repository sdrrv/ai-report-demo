import React, { useEffect, useState } from 'react';
import { Swords, Shield, Info, BarChart3 } from 'lucide-react';
import DualCircleChart from './DualCircleChart';
import CircleChart from './CircleChart';
import { cn } from '@/utils/cn';

interface ShotData {
  name: string;
  percentage: number;
}

interface ShotAnalysisProps {
  delay?: number;
  offensive: number;
  defensive: number;
  rightShots?: number;
  centerShots?: number;
  leftShots?: number;
}

const ShotAnalysis: React.FC<ShotAnalysisProps> = ({
  delay = 0,
  defensive,
  offensive,
  rightShots = 35,
  centerShots = 40,
  leftShots = 25,
}) => {
  const [animatedAttackWidths, setAnimatedAttackWidths] = useState<number[]>(
    [],
  );
  const [animatedDefensiveWidths, setAnimatedDefensiveWidths] = useState<
    number[]
  >([]);

  // Sample data - replace with actual data based on selectedPlayer
  const attackHits: ShotData[] = [
    { name: 'Forehand', percentage: 64 },
    { name: 'Backhand', percentage: 14 },
    { name: 'Smash', percentage: 12 },
  ];

  const defensiveHits: ShotData[] = [
    { name: 'Backhand', percentage: 34 },
    { name: 'Forehand', percentage: 66 },
  ];

  const maxAttackPercentage = Math.max(
    ...attackHits.map((shot) => shot.percentage),
  );
  const maxDefensivePercentage = Math.max(
    ...defensiveHits.map((shot) => shot.percentage),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Calculate relative widths for attack shots
      const attackWidths = attackHits.map(
        (shot) => (shot.percentage / maxAttackPercentage) * 100,
      );
      setAnimatedAttackWidths(attackWidths);

      // Calculate relative widths for defensive shots
      const defensiveWidths = defensiveHits.map(
        (shot) => (shot.percentage / maxDefensivePercentage) * 100,
      );
      setAnimatedDefensiveWidths(defensiveWidths);
    }, delay + 600);

    return () => clearTimeout(timer);
  }, [
    attackHits,
    defensiveHits,
    maxAttackPercentage,
    maxDefensivePercentage,
    delay,
  ]);

  const ShotCategory = ({
    title,
    icon: Icon,
    shots,
    animatedWidths,
    color,
    iconColor,
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    shots: ShotData[];
    animatedWidths: number[];
    color: string;
    iconColor?: string;
  }) => (
    <div className="mb-6 last:mb-0">
      <div className="mb-4 flex items-center gap-3">
        <div className={cn('rounded-lg bg-slate-600 p-2', iconColor)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <div className="rounded-full bg-slate-200 p-1">
          <Info className="h-3 w-3 text-slate-500" />
        </div>
      </div>

      <div className="space-y-3">
        {shots
          .sort((a, b) => b.percentage - a.percentage)
          .map((shot, index) => (
            <div key={shot.name} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-slate-700">
                {shot.name}
              </div>

              <div className="relative flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{
                      width: `${animatedWidths[index] || 0}%`,
                      transitionDelay: `${index * 150}ms`,
                    }}
                  />
                </div>
              </div>

              <div className="w-10 text-right">
                <span className="text-sm font-semibold text-slate-800">
                  {shot.percentage}%
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div
      className="mb-5 mt-4 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg"
      style={{
        animation: `fade-in 0.5s ease-out ${delay}ms both`,
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 flex items-center gap-3 text-lg font-semibold text-slate-800">
            <div className="rounded-lg bg-slate-600 p-2">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Shot Analysis
          </h2>
          <p className="ml-12 text-sm text-slate-500">
            Complete breakdown of offensive, defensive, and positional shots
          </p>
        </div>
      </div>

      {/* Attack vs Defense Chart */}
      <div className="my-8 flex justify-center">
        <DualCircleChart
          offensive={offensive}
          defensive={defensive}
          delay={delay + 200}
        />
      </div>
      {/* Detailed Shot Breakdown */}
      <ShotCategory
        title="Attack hits"
        icon={Swords}
        shots={attackHits}
        animatedWidths={animatedAttackWidths}
        color="bg-gradient-to-r from-slate-500 to-slate-600"
      />

      <ShotCategory
        title="Defensive hits"
        icon={Shield}
        iconColor="bg-sky-500"
        shots={defensiveHits}
        animatedWidths={animatedDefensiveWidths}
        color="bg-gradient-to-r from-sky-400 to-sky-500"
      />

      {/* Shot Distribution */}
      <div className="mt-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-slate-600 p-2">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Shot Distribution
          </h3>
        </div>
        <div className="flex items-center justify-around">
          <CircleChart
            percentage={leftShots}
            label="Left"
            color="#64748b"
            size={85}
            strokeWidth={6}
            delay={delay + 400}
          />
          <CircleChart
            percentage={centerShots}
            label="Center"
            color="#475569"
            size={95}
            strokeWidth={8}
            delay={delay + 500}
          />
          <CircleChart
            percentage={rightShots}
            label="Right"
            color="#334155"
            size={85}
            strokeWidth={6}
            delay={delay + 600}
          />
        </div>
      </div>
    </div>
  );
};

export default ShotAnalysis;
