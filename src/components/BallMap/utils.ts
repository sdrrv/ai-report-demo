// utils.ts
import { HeatmapData, HeatmapView, HeatmapPoint } from './types';

/**
 * Get overlay color based on percentage value
 */
export const getOverlayColor = (percentage: number): string => {
  return `rgba(50, 50, 50, ${0.2 + (percentage / 100) * 0.5})`;
};

/**
 * Get heatmap data based on the current view
 */
export const getHeatmapData = (heatmapView: HeatmapView): HeatmapData[] => {
  if (heatmapView === 'zones') {
    return [
      { region: 'net_left', value: 15 },
      { region: 'net_middle', value: 25 },
      { region: 'net_right', value: 10 },
      { region: 'transition_left', value: 20 },
      { region: 'transition_middle', value: 35 },
      { region: 'transition_right', value: 15 },
      { region: 'back_left', value: 30 },
      { region: 'back_middle', value: 40 },
      { region: 'back_right', value: 25 },
    ];
  } else if (heatmapView === 'sides') {
    return [
      { region: 'left', value: 35 },
      { region: 'middle', value: 45 },
      { region: 'right', value: 20 },
    ];
  } else {
    return [
      { region: 'front', value: 35 },
      { region: 'back', value: 65 },
    ];
  }
};

/**
 * Generate sample heatmap points for player positions
 */
export const generateHeatmapPoints = (): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];

  // Left net positions
  points.push({
    x: 25,
    y: 30,
    value: 40,
  });
  points.push({
    x: 35,
    y: 30,
    value: 60,
  });
  points.push({
    x: 35,
    y: 20,
    value: 80,
  });
  points.push({
    x: 20,
    y: 25,
    value: 20,
  });
  points.push({
    x: 30,
    y: 25,
    value: 45,
  });
  points.push({
    x: 28,
    y: 22,
    value: 35,
  });
  points.push({
    x: 32,
    y: 28,
    value: 55,
  });

  points.push({
    x: 20,
    y: 37,
    value: 20,
  });

  // left court defense positions
  points.push({
    x: 25,
    y: 58,
    value: 35,
  });
  points.push({
    x: 35,
    y: 61,
    value: 45,
  });
  points.push({
    x: 30,
    y: 63,
    value: 65,
  });
  points.push({
    x: 20,
    y: 68,
    value: 25,
  });
  points.push({
    x: 28,
    y: 61,
    value: 40,
  });
  points.push({
    x: 32,
    y: 65,
    value: 50,
  });
  points.push({
    x: 22,
    y: 56,
    value: 30,
  });
  points.push({
    x: 33,
    y: 60,
    value: 55,
  });
  points.push({
    x: 45,
    y: 60,
    value: 55,
  });

  points.push({
    x: 25,
    y: 45,
    value: 20,
  });

  // Right defense positions
  points.push({
    x: 65,
    y: 58,
    value: 15,
  });
  points.push({
    x: 75,
    y: 61,
    value: 15,
  });
  points.push({
    x: 70,
    y: 63,
    value: 15,
  });
  points.push({
    x: 60,
    y: 68,
    value: 5,
  });
  points.push({
    x: 67,
    y: 61,
    value: 20,
  });
  points.push({
    x: 72,
    y: 65,
    value: 30,
  });
  points.push({
    x: 62,
    y: 56,
    value: 10,
  });
  points.push({
    x: 71,
    y: 60,
    value: 25,
  });
  points.push({
    x: 80,
    y: 60,
    value: 15,
  });

  return points;
};

/**
 * Add fade-in animation styles to document if not already present
 */
export const addFadeInStyles = (): void => {
  if (document.getElementById('ballmap-fade-in-styles')) return;

  const style = document.createElement('style');
  style.id = 'ballmap-fade-in-styles';
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
};
