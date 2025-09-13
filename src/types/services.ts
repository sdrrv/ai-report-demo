/**
 * Service layer types for data transformation and API communication
 */

// ===== TRANSFORMED DATA TYPES =====

export interface MatchSummaryData {
  timeInPlay: number;           // minutes (converted from seconds)
  averageRally: number;         // seconds (rally duration)
  longestRally: number;         // seconds (rally duration)
  totalRallies: number;         // count of rallies
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