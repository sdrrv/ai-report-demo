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

  // Net positions - High intensity for volleys and aggressive play
  // Left net position
  points.push({
    x: 25,
    y: 10,
    value: 85,
  });

  // Center net position (most common net position)
  points.push({
    x: 50,
    y: 12,
    value: 95,
  });

  // Right net position
  points.push({
    x: 75,
    y: 10,
    value: 85,
  });

  // Near net secondary positions
  points.push({
    x: 35,
    y: 15,
    value: 75,
  });

  points.push({
    x: 65,
    y: 15,
    value: 75,
  });

  // Transition zone - Moving between defense and attack
  // Left transition
  points.push({
    x: 30,
    y: 35,
    value: 70,
  });

  // Center transition (high traffic area)
  points.push({
    x: 50,
    y: 38,
    value: 80,
  });

  points.push({
    x: 50,
    y: 30,
    value: 75,
  });

  // Right transition
  points.push({
    x: 70,
    y: 35,
    value: 70,
  });

  // Back court positions - Defensive play and rallies
  // Back left corner (defensive position)
  points.push({
    x: 20,
    y: 65,
    value: 90,
  });

  // Back center (primary defensive position)
  points.push({
    x: 50,
    y: 62,
    value: 100,
  });

  points.push({
    x: 50,
    y: 68,
    value: 95,
  });

  // Back right corner (defensive position)
  points.push({
    x: 80,
    y: 65,
    value: 90,
  });

  // Service line positions
  // Left service position
  points.push({
    x: 35,
    y: 55,
    value: 75,
  });

  // Right service position
  points.push({
    x: 65,
    y: 55,
    value: 75,
  });

  // Glass/Wall positions (unique to padel)
  // Left glass position
  points.push({
    x: 15,
    y: 45,
    value: 65,
  });

  points.push({
    x: 12,
    y: 55,
    value: 60,
  });

  // Right glass position
  points.push({
    x: 85,
    y: 45,
    value: 65,
  });

  points.push({
    x: 88,
    y: 55,
    value: 60,
  });

  // Additional strategic positions
  // Mid-court left
  points.push({
    x: 25,
    y: 40,
    value: 60,
  });

  points.push({
    x: 30,
    y: 45,
    value: 65,
  });

  // Mid-court right
  points.push({
    x: 75,
    y: 40,
    value: 60,
  });

  points.push({
    x: 70,
    y: 45,
    value: 65,
  });

  // Deep defensive positions
  points.push({
    x: 35,
    y: 70,
    value: 80,
  });

  points.push({
    x: 65,
    y: 70,
    value: 80,
  });

  // Center court control positions
  points.push({
    x: 45,
    y: 25,
    value: 70,
  });

  points.push({
    x: 55,
    y: 25,
    value: 70,
  });

  points.push({
    x: 45,
    y: 45,
    value: 75,
  });

  points.push({
    x: 55,
    y: 45,
    value: 75,
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
