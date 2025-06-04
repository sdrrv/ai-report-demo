import React, { useEffect, useState } from 'react';
import { Swords } from 'lucide-react';

interface DualCircleChartProps {
  offensive: number;
  defensive: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

const DualCircleChart: React.FC<DualCircleChartProps> = ({
  offensive,
  defensive,
  size = 140,
  strokeWidth = 12,
  delay = 0,
}) => {
  const [animatedOffensive, setAnimatedOffensive] = useState(0);
  const [animatedDefensive, setAnimatedDefensive] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash arrays for the segments
  const offensiveLength = (animatedOffensive / 100) * circumference;
  const defensiveLength = (animatedDefensive / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffensive(offensive);
      setAnimatedDefensive(defensive);
    }, delay);
    return () => clearTimeout(timer);
  }, [offensive, defensive, delay]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Offensive segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth={strokeWidth}
            strokeDasharray={`${offensiveLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Defensive segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${defensiveLength} ${circumference}`}
            strokeDashoffset={-offensiveLength}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-2 rounded-lg bg-slate-600 p-2">
            <Swords className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-500">Shot Type</span>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-700"></div>
          <span className="text-sm font-medium text-slate-700">
            Offensive {animatedOffensive}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-sky-500"></div>
          <span className="text-sm font-medium text-slate-700">
            Defensive {animatedDefensive}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DualCircleChart;
