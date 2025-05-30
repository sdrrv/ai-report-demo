import React, { useEffect, useState } from 'react';

interface CircleChartProps {
  percentage: number;
  label: string;
  color: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

const CircleChart: React.FC<CircleChartProps> = ({
  percentage,
  label,
  color,
  size = 120,
  strokeWidth = 10,
  delay = 0,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            {animatedPercentage}%
          </span>
        </div>
      </div>
      <span className="text-center text-sm font-medium text-gray-600">
        {label}
      </span>
    </div>
  );
};

export default CircleChart;
