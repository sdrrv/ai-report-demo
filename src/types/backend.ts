/**
 * TypeScript interfaces for Matchlytics backend API responses
 * Generated from analysis of statistics.json
 */

// ===== COORDINATES & POSITIONING =====

export interface Position {
  x: number; // in meters
  y: number; // in meters  
}

export interface CourtDimensions {
  width: number;  // meters
  height: number; // meters
}

export interface CourtBounds {
  x: [number, number]; // [min, max] in meters
  y: [number, number]; // [min, max] in meters
}

// ===== COURT ZONES =====

export interface FrontBackZones {
  net: number;        // percentage 0-1
  transition: number; // percentage 0-1
  back: number;       // percentage 0-1
}

export interface SideZones {
  left: number;   // percentage 0-1
  middle: number; // percentage 0-1
  right: number;  // percentage 0-1
}

export interface DetailedZones {
  net_left: number;
  transition_left: number;
  back_left: number;
  net_middle: number;
  transition_middle: number;
  back_middle: number;
  net_right: number;
  transition_right: number;
  back_right: number;
}

export interface CourtZoneAnalysis {
  front_back: FrontBackZones;
  sides: SideZones;
  zones: DetailedZones;
}

// ===== HEATMAP DATA =====

export interface HeatmapData {
  heatmap: number[][]; // 2D array of intensity values (0-1)
  x_edges: number[];   // Grid edges for X axis in meters
  y_edges: number[];   // Grid edges for Y axis in meters
  total_points: number; // Total data points used
  court_bounds: [number[], number[]]; // [[x_min, x_max], [y_min, y_max]]
  grid_size: [number, number]; // [width_cells, height_cells]
  player_id: number;
  court_dimensions: CourtDimensions;
  mirror_negative_y: boolean;
}

// ===== SHOT TRACKING =====

export interface ShotOutcome {
  rally_id: string;
  shot_frame: number;
  player_position: Position;
  player_position_mirroed: Position; // Mirrored coordinates 
  shot_position: Position | { x: "NaN" | null; y: "NaN" | null };
  shot_position_mirroed: Position | { x: "NaN" | null; y: "NaN" | null };
  outcome: Record<string, any>; // Empty object in current data
  accepted: boolean;
}

export interface ShotDistribution {
  horizontal_positions: Record<string, any>; // Empty in current data
  vertical_positions: Record<string, any>;   // Empty in current data
}

export interface ShotsTracking {
  shot_outcomes: {
    rally_server: ShotOutcome[];
  };
  shot_distribution: {
    rally_server: ShotDistribution;
  };
}

// ===== PLAYER STATISTICS =====

export interface PlayerStatistics {
  running_distance: number;    // meters
  mean_velocity: number;       // km/h
  max_velocity: number;        // km/h
  court_zone: CourtZoneAnalysis;
  shots_tracking: ShotsTracking;
  heatmap: HeatmapData;
}

// ===== RALLY DETAILS =====

export interface PlayerActionSummary {
  rally_server?: number; // 1 if player served this rally
}

export interface RallyDetail {
  rally_id: string;
  start_frame: number;
  end_frame: number;
  start_time: number;    // seconds from match start
  end_time: number;      // seconds from match start
  duration: number;      // seconds
  frame_count: number;
  ball_states_summary: Record<string, any>; // Empty in current data
  players_actions_summary: {
    player1: PlayerActionSummary;
    player2: PlayerActionSummary; 
    player3: PlayerActionSummary;
    player4: PlayerActionSummary;
  };
}

export interface MatchSummary {
  total_game_time: number;        // seconds
  total_rally_time: number;       // seconds
  rally_time_percentage: number;  // percentage 0-100
  number_of_rallies: number;
  average_rally_duration: number; // seconds
  total_shots: number;            // Currently 0 in data
  average_number_shots: number;   // Currently 0.0 in data
  rally_details: RallyDetail[];
  longest_rally: RallyDetail | null; // Reference to longest rally
  game_start_time: number;        // seconds
  game_end_time: number;          // seconds
  game_start_frame: number;
  game_last_frame: number;
}

// ===== SHOTS BREAKDOWN =====

export interface ShotsBreakdown {
  players: Record<string, any>; // Structure unknown from current data
  game: Record<string, any>;    // Structure unknown from current data
}

// ===== PLAYER CROPS =====

export interface PlayerCrops {
  player1: any; // Structure unknown from current data
  player2: any;
  player3: any;
  player4: any;
}

// ===== MAIN RESPONSE INTERFACE =====

export interface MatchStatistics {
  highlights: any[];  // Empty array in current data
  players_statistics: {
    player1: PlayerStatistics;
    player2: PlayerStatistics;
    player3: PlayerStatistics;
    player4: PlayerStatistics;
  };
  match_summary: MatchSummary;
  shots_breakdown: ShotsBreakdown;
  player_crops: PlayerCrops;
}

// ===== UTILITY TYPES =====

export type PlayerId = 1 | 2 | 3 | 4;
export type PlayerKey = 'player1' | 'player2' | 'player3' | 'player4';

// Helper function types for coordinate conversion
export type CoordinateConverter = {
  metersToPercentage: (position: Position, courtDimensions: CourtDimensions) => Position;
  percentageToMeters: (position: Position, courtDimensions: CourtDimensions) => Position;
  isValidPosition: (position: Position | { x: "NaN" | null; y: "NaN" | null }) => position is Position;
};

// ===== DATA PROCESSING HELPERS =====

export interface ProcessedPlayerStats {
  playerId: PlayerId;
  playerName: string;
  runningDistance: number;      // meters
  meanVelocity: number;         // km/h  
  maxVelocity: number;          // km/h
  courtZoneAnalysis: CourtZoneAnalysis;
  totalShots: number;           // Derived from shot_outcomes
  serveCount: number;           // Count of rallies where player served
  heatmapData: HeatmapData;
}

export interface ProcessedMatchData {
  matchId: string;
  totalGameTime: number;        // seconds
  totalRallyTime: number;       // seconds
  rallyTimePercentage: number;  // 0-100
  numberOfRallies: number;
  averageRallyDuration: number; // seconds
  longestRallyDuration: number; // seconds
  players: ProcessedPlayerStats[];
  courtDimensions: CourtDimensions;
}

// ===== API ENDPOINT INTERFACES =====

export interface GetMatchSummaryResponse {
  matchId: string;
  totalGameTime: number;
  totalRallyTime: number;
  rallyTimePercentage: number;
  numberOfRallies: number;
  averageRallyDuration: number;
  longestRallyDuration: number;
  gameStartTime: number;
  gameEndTime: number;
}

export interface GetPlayerStatsResponse {
  playerId: PlayerId;
  playerName: string;
  runningDistance: number;
  meanVelocity: number;
  maxVelocity: number;
  totalShots: number;
  serveCount: number;
}

export interface GetPlayerHeatmapResponse {
  playerId: PlayerId;
  heatmapData: number[][];
  xEdges: number[];
  yEdges: number[];
  totalDataPoints: number;
  courtBounds: [number[], number[]];
  gridSize: [number, number];
  courtDimensions: CourtDimensions;
}

export interface GetCourtZonesResponse {
  playerId: PlayerId;
  frontBackZones: FrontBackZones;
  sideZones: SideZones;
  detailedZones: DetailedZones;
}

export interface GetShotTrackingResponse {
  playerId: PlayerId;
  shots: Array<{
    rallyId: string;
    shotFrame: number;
    playerPosition: Position;
    shotPosition: Position | null;
    accepted: boolean;
    timestamp: number; // Derived from frame timing
  }>;
}

// ===== ERROR HANDLING =====

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: string;
}