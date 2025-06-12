import React, { useEffect, useState } from 'react';
import { Target } from 'lucide-react';

interface TripleCircleChartProps {
  center: number;
  body: number;
  wall: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

const TripleCircleChart: React.FC<TripleCircleChartProps> = ({
  center,
  body,
  wall,
  size = 140,
  strokeWidth = 12,
  delay = 0,
}) => {
  const [animatedCenter, setAnimatedCenter] = useState(0);
  const [animatedBody, setAnimatedBody] = useState(0);
  const [animatedWall, setAnimatedWall] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash arrays for the segments
  const centerLength = (animatedCenter / 100) * circumference;
  const bodyLength = (animatedBody / 100) * circumference;
  const wallLength = (animatedWall / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCenter(center);
      setAnimatedBody(body);
      setAnimatedWall(wall);
    }, delay);
    return () => clearTimeout(timer);
  }, [center, body, wall, delay]);

  return (
    <div className="flex items-center gap-6">
      {/* Chart */}
      <div className="relative flex-shrink-0">
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
          {/* Center segment - now with blue color */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${centerLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Body segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#64748b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${bodyLength} ${circumference}`}
            strokeDashoffset={-centerLength}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Wall segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth={strokeWidth}
            strokeDasharray={`${wallLength} ${circumference}`}
            strokeDashoffset={-(centerLength + bodyLength)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-2 rounded-lg bg-slate-600 p-2">
            <Target className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-500">
            Distribution
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-sky-500"></div>
          <span className="text-sm text-slate-700">
            {animatedCenter}% to the center (T zone)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-500"></div>
          <span className="text-sm text-slate-700">
            {animatedBody}% to opponent's body
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-800"></div>
          <span className="text-sm text-slate-700">
            {animatedWall}% to lateral wall
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripleCircleChart;
