import React, { useEffect, useState } from 'react';
import { Swords, Shield, Info } from 'lucide-react';

interface ShotData {
  name: string;
  percentage: number;
}

interface ShotBreakdownProps {
  //selectedPlayer: number;
  delay?: number;
}

const ShotBreakdown: React.FC<ShotBreakdownProps> = ({ delay = 0 }) => {
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
    { name: 'Smash', percentage: 22 },
  ];

  const defensiveHits: ShotData[] = [
    { name: 'Backhand', percentage: 44 },
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
    }, delay);

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
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    shots: ShotData[];
    animatedWidths: number[];
    color: string;
  }) => (
    <div className="last:mb0 !mb-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>

      <div className="space-y-3">
        {shots
          .sort((a, b) => b.percentage - a.percentage)
          .map((shot, index) => (
            <div key={shot.name} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-gray-700">
                {shot.name}
              </div>

              <div className="relative flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
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
                <span className="text-sm font-semibold text-gray-900">
                  {shot.percentage}%
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in-delay-4 mb-5 mt-4 rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-1 text-lg font-semibold text-gray-800">
          Shot Analysis
        </h2>
        <p className="text-sm text-gray-500">
          Breakdown of attack and defensive shots
        </p>
      </div>

      <ShotCategory
        title="Attack hits"
        icon={Swords}
        shots={attackHits}
        animatedWidths={animatedAttackWidths}
        color="bg-gradient-to-r from-red-400 to-red-500"
      />

      <ShotCategory
        title="Defensive hits"
        icon={Shield}
        shots={defensiveHits}
        animatedWidths={animatedDefensiveWidths}
        color="bg-gradient-to-r from-blue-400 to-blue-500"
      />
    </div>
  );
};

export default ShotBreakdown;
