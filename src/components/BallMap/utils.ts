// utils.ts
import { HeatmapData, HeatmapView } from './types';

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
