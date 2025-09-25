/**
 * Service layer types for data transformation and API communication
 */

// ===== TRANSFORMED DATA TYPES =====

export interface MatchSummaryData {
  timeInPlay: number;           // minutes (converted from seconds)
  averageRally: number;         // seconds (rally duration)
  longestRally: number;         // seconds (rally duration)
  totalRallies: number;         // count of rallies
  rallyTimePercentage: number;  // percentage of game time spent in rallies
  totalGameTime: number;        // minutes (converted from seconds)
  matchId?: string;
}

export interface PlayerSpeedData {
  playerId: number;
  playerName: string;
  maxSpeed: number;             // km/h
  averageSpeed: number;         // km/h
  runningDistance: number;      // meters
  isMe?: boolean;
}

export interface PlayerDistanceData {
  playerId: number;
  playerName: string;
  totalDistance: number;        // meters
  isMe?: boolean;
}

// ===== BALL MAP DATA TYPES =====

export interface CourtZoneData {
  region: string;
  value: number;                // percentage (0-100)
}

export interface HeatmapPoint {
  x: number;                    // pixel coordinate
  y: number;                    // pixel coordinate
  value: number;                // intensity value (0-100)
}

export interface HeatmapGridData {
  data: number[][];             // 2D intensity array (0-1 normalized)
  x_edges: number[];            // Grid edge coordinates in meters
  y_edges: number[];            // Grid edge coordinates in meters
  total_points: number;         // Total data points
  grid_size: [number, number];  // [width, height] in cells
  court_bounds: [number[], number[]]; // [[x_min, x_max], [y_min, y_max]]
  mirror_negative_y: boolean;   // Whether to mirror Y coordinates
}

export interface BallMapData {
  playerId: number;
  playerName: string;
  isMe?: boolean;
  
  // Court zone data (ready to display as percentages)
  zones: CourtZoneData[];       // 9 zones (3x3 grid)
  sides: CourtZoneData[];       // 3 sides (left, middle, right)
  frontBack: CourtZoneData[];   // 2 areas (front, back)
  
  // Heatmap data for continuous visualization
  heatmapGrid: HeatmapGridData;
  
  // Metadata
  matchId?: string;
}

// ===== SERVICE INTERFACES =====

export interface DataTransformer<TInput, TOutput> {
  transform(data: TInput): TOutput;
  validate(data: TInput): boolean;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheStrategy {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  invalidate(pattern?: string): void;
  clear(): void;
}

export interface DataRepository<T> {
  fetch(params?: any): Promise<T>;
  invalidate(): void;
}

// ===== ERROR HANDLING =====

export enum ErrorCode {
  FETCH_FAILED = 'FETCH_FAILED',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  TRANSFORMATION_ERROR = 'TRANSFORMATION_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  NOT_FOUND = 'NOT_FOUND'
}

export class DataServiceError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public context?: any,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'DataServiceError';
  }
}

// ===== HOOK RETURN TYPES =====

export interface DataHookResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface AsyncOperation<T> {
  promise: Promise<T>;
  cancel: () => void;
}

// ===== CACHE CONFIGURATION =====

export interface CacheConfig {
  memoryTTL: number;            // milliseconds
  persistentTTL: number;        // milliseconds
  maxMemorySize: number;        // bytes
  compressionThreshold: number; // bytes
}

// ===== SERVICE CONFIGURATION =====

export interface ServiceConfig {
  cache: CacheConfig;
  enablePerformanceMonitoring: boolean;
  retryAttempts: number;
  retryDelay: number;
}