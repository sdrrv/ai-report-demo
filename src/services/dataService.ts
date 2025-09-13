/**
 * Main data service orchestrator
 * Coordinates API calls, caching, transformations, and error handling
 */

import { MatchStatistics } from '@/types/backend';
import { 
  MatchSummaryData, 
  DataServiceError, 
  ErrorCode, 
  ServiceConfig, 
  AsyncOperation,
  PlayerSpeedData,
  PlayerDistanceData
} from '@/types/services';

import { getCacheInstance, defaultCacheConfig } from './cache/cacheManager';
import { statisticsApi } from './api/statisticsApi';
import { matchSummaryTransformer } from './transformers/matchSummaryTransformer';

export class StatisticsDataService {
  private static instance: StatisticsDataService;
  private cache = getCacheInstance();
  private loadingOperations = new Map<string, AsyncOperation<any>>();
  
  private config: ServiceConfig = {
    cache: defaultCacheConfig,
    enablePerformanceMonitoring: true,
    retryAttempts: 3,
    retryDelay: 1000
  };

  private constructor() {}

  static getInstance(): StatisticsDataService {
    if (!StatisticsDataService.instance) {
      StatisticsDataService.instance = new StatisticsDataService();
    }
    return StatisticsDataService.instance;
  }

  // ===== MATCH SUMMARY METHODS =====

  async getMatchSummary(matchId: string = 'default', options?: {
    forceRefresh?: boolean;
    timeout?: number;
  }): Promise<MatchSummaryData> {
    const { forceRefresh = false, timeout = 10000 } = options || {};
    const cacheKey = `match_summary_${matchId}`;
    
    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = this.cache.get<MatchSummaryData>(cacheKey);
      if (cached) {
        this.logPerformance('match_summary_cache_hit', cacheKey);
        return cached;
      }
    }

    // Check if already loading this data
    const existingOperation = this.loadingOperations.get(cacheKey);
    if (existingOperation && !forceRefresh) {
      return existingOperation.promise;
    }

    // Create new loading operation
    const operation = this.createAsyncOperation(
      () => this.fetchAndTransformMatchSummary(matchId),
      timeout
    );

    this.loadingOperations.set(cacheKey, operation);

    try {
      const result = await operation.promise;
      
      // Cache the result
      this.cache.set(cacheKey, result);
      this.logPerformance('match_summary_fetch_success', cacheKey);
      
      return result;

    } catch (error) {
      this.logPerformance('match_summary_fetch_error', cacheKey, error);
      throw this.handleServiceError(error, 'getMatchSummary', { matchId });
    } finally {
      this.loadingOperations.delete(cacheKey);
    }
  }

  private async fetchAndTransformMatchSummary(matchId: string): Promise<MatchSummaryData> {
    try {
      // Fetch raw data
      const rawData = await statisticsApi.fetch();
      
      // Validate data
      if (!matchSummaryTransformer.validate(rawData)) {
        const validationReport = matchSummaryTransformer.getValidationReport(rawData);
        throw new DataServiceError(
          'Match summary data validation failed',
          ErrorCode.VALIDATION_FAILED,
          { 
            errors: validationReport.errors,
            warnings: validationReport.warnings,
            availableFields: validationReport.availableFields
          }
        );
      }

      // Transform data
      const transformedData = matchSummaryTransformer.transform(rawData);
      
      return transformedData;

    } catch (error) {
      if (error instanceof DataServiceError) {
        throw error;
      }

      throw new DataServiceError(
        'Failed to fetch and transform match summary',
        ErrorCode.TRANSFORMATION_ERROR,
        { 
          matchId, 
          originalError: error instanceof Error ? error.message : String(error)
        }
      );
    }
  }

  // ===== FUTURE METHODS (STUBS FOR SCALABILITY) =====

  async getPlayerSpeed(playerId: string, matchId: string = 'default'): Promise<PlayerSpeedData[]> {
    // Placeholder for future implementation
    throw new DataServiceError(
      'Player speed data not yet implemented',
      ErrorCode.NOT_FOUND,
      { playerId, matchId }
    );
  }

  async getPlayerDistance(playerId: string, matchId: string = 'default'): Promise<PlayerDistanceData[]> {
    // Placeholder for future implementation
    throw new DataServiceError(
      'Player distance data not yet implemented',
      ErrorCode.NOT_FOUND,
      { playerId, matchId }
    );
  }

  // ===== UTILITY METHODS =====

  isLoading(operation: string): boolean {
    return this.loadingOperations.has(operation);
  }

  cancelOperation(operation: string): void {
    const op = this.loadingOperations.get(operation);
    if (op) {
      op.cancel();
      this.loadingOperations.delete(operation);
    }
  }

  cancelAllOperations(): void {
    for (const [key, operation] of this.loadingOperations.entries()) {
      operation.cancel();
    }
    this.loadingOperations.clear();
  }

  invalidateCache(pattern?: string): void {
    this.cache.invalidate(pattern);
    this.logPerformance('cache_invalidated', pattern || 'all');
  }

  getCacheStats() {
    return this.cache.getStats();
  }

  // ===== ERROR HANDLING =====

  private handleServiceError(
    error: any, 
    operation: string, 
    context: Record<string, any>
  ): DataServiceError {
    if (error instanceof DataServiceError) {
      return error;
    }

    return new DataServiceError(
      `Service operation '${operation}' failed`,
      ErrorCode.FETCH_FAILED,
      { 
        operation,
        context,
        originalError: error instanceof Error ? error.message : String(error)
      }
    );
  }

  // ===== ASYNC OPERATION MANAGEMENT =====

  private createAsyncOperation<T>(
    promiseFactory: () => Promise<T>,
    timeout?: number
  ): AsyncOperation<T> {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const promise = new Promise<T>(async (resolve, reject) => {
      // Set up timeout if specified
      if (timeout) {
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            cancelled = true;
            reject(new DataServiceError(
              'Operation timed out',
              ErrorCode.FETCH_FAILED,
              { timeout },
              true // recoverable
            ));
          }
        }, timeout);
      }

      try {
        const result = await promiseFactory();
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (!cancelled) {
          resolve(result);
        }
      } catch (error) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (!cancelled) {
          reject(error);
        }
      }
    });

    const cancel = () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    return { promise, cancel };
  }

  // ===== PERFORMANCE MONITORING =====

  private logPerformance(
    event: string, 
    operation: string, 
    data?: any
  ): void {
    if (!this.config.enablePerformanceMonitoring) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      event,
      operation,
      ...(data && { data })
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[StatisticsDataService] ${event}:`, logData);
    }

    // In production, you might send to analytics service
    // analytics.track('data_service_event', logData);
  }

  // ===== CONFIGURATION =====

  updateConfig(newConfig: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  // ===== HEALTH CHECK =====

  async healthCheck(): Promise<{
    api: boolean;
    cache: boolean;
    transformers: boolean;
    overall: boolean;
  }> {
    const health = {
      api: false,
      cache: false,
      transformers: false,
      overall: false
    };

    try {
      // Test API
      const data = await statisticsApi.fetch();
      health.api = !!data;
    } catch {
      health.api = false;
    }

    try {
      // Test cache
      this.cache.set('health_test', { test: true }, 1000);
      const cached = this.cache.get('health_test');
      health.cache = !!cached;
      this.cache.invalidate('health_test');
    } catch {
      health.cache = false;
    }

    try {
      // Test transformers (using mock data)
      const mockData = { match_summary: { total_rally_time: 100, average_rally_duration: 10 } } as any;
      const isValid = matchSummaryTransformer.validate(mockData);
      health.transformers = isValid;
    } catch {
      health.transformers = false;
    }

    health.overall = health.api && health.cache && health.transformers;

    return health;
  }

  // ===== PRELOAD & WARMUP =====

  async preloadMatchSummary(matchId: string = 'default'): Promise<void> {
    try {
      await this.getMatchSummary(matchId);
      this.logPerformance('preload_success', 'match_summary');
    } catch (error) {
      this.logPerformance('preload_failed', 'match_summary', error);
      throw error;
    }
  }

  async warmUpCache(keys: string[] = ['match_summary_default']): Promise<void> {
    await this.cache.warmUp(keys);
    this.logPerformance('cache_warmed_up', keys.join(','));
  }
}

// ===== SINGLETON EXPORT =====

export const statisticsDataService = StatisticsDataService.getInstance();

// ===== CONVENIENCE FUNCTIONS =====

export async function getMatchSummary(matchId?: string, options?: { forceRefresh?: boolean }) {
  return statisticsDataService.getMatchSummary(matchId, options);
}

export function invalidateMatchSummaryCache(matchId?: string) {
  const pattern = matchId ? `match_summary_${matchId}` : 'match_summary_';
  statisticsDataService.invalidateCache(pattern);
}

export function isMatchSummaryLoading(matchId: string = 'default'): boolean {
  return statisticsDataService.isLoading(`match_summary_${matchId}`);
}