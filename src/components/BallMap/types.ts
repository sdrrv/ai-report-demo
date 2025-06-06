// types.ts
export interface Shot {
  x: number;
  y: number;
  type:
    | 'forehand'
    | 'backhand'
    | 'forehandVolley'
    | 'backhandVolley'
    | 'serve'
    | 'overhead';
  result: 'groundBounce' | 'interception';
}

export interface ShotType {
  id: string;
  label: string;
}

export interface Player {
  id: number;
  position: string;
}

export interface HeatmapData {
  region: string;
  value: number;
}

export type HeatmapView = 'zones' | 'sides' | 'front-back';
export type MainMode = 'ballHits' | 'playerPosition';

export interface BallMapProps {
  delay?: number;
}

export interface HeaderProps {
  mainMode: MainMode;
  onModeChange: (mode: MainMode) => void;
}

export interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: number;
}

export interface BallHitsControlsProps {
  selectedShot: string;
  shotTypes: ShotType[];
  isFilterTransitioning: boolean;
  onFilterChange: (filter: string) => void;
  isVisible: boolean;
}

export interface PlayerPositionControlsProps {
  heatmapView: HeatmapView;
  onHeatmapViewChange: (view: HeatmapView) => void;
  isVisible: boolean;
}

export interface CourtProps {
  shots: Shot[];
  displayMode: MainMode;
  isTransitioning: boolean;
  animatedShots: boolean;
  isFilterTransitioning: boolean;
  heatmapView: HeatmapView;
  heatmapData: HeatmapData[];
}

export interface LegendProps {
  displayMode: MainMode;
  isTransitioning: boolean;
  filteredShots: Shot[];
  displayShot: string;
  selectedPlayer: number;
  heatmapView: HeatmapView;
}
