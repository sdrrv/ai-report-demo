/**
 * Statistics API service for loading and fetching match data
 */

import { MatchStatistics } from '@/types/backend';
import { DataRepository, ErrorCode, DataServiceError } from '@/types/services';

export class StatisticsApiService implements DataRepository<MatchStatistics> {
  private static instance: StatisticsApiService;
  private cachedData: MatchStatistics | null = null;
  private loadingPromise: Promise<MatchStatistics> | null = null;

  private constructor() {}

  static getInstance(): StatisticsApiService {
    if (!StatisticsApiService.instance) {
      StatisticsApiService.instance = new StatisticsApiService();
    }
    return StatisticsApiService.instance;
  }

  async fetch(params?: { forceRefresh?: boolean }): Promise<MatchStatistics> {
    const { forceRefresh = false } = params || {};

    // Return cached data if available and not forcing refresh
    if (this.cachedData && !forceRefresh) {
      return this.cachedData;
    }

    // If already loading, return the existing promise to prevent duplicate requests
    if (this.loadingPromise && !forceRefresh) {
      return this.loadingPromise;
    }

    // Create new loading promise
    this.loadingPromise = this.fetchStatisticsData();

    try {
      const data = await this.loadingPromise;
      this.cachedData = data;
      return data;
    } catch (error) {
      // Reset loading promise on error so we can retry
      this.loadingPromise = null;
      throw error;
    } finally {
      // Clear loading promise when done
      this.loadingPromise = null;
    }
  }

  invalidate(): void {
    this.cachedData = null;
    this.loadingPromise = null;
  }

  // ===== PRIVATE METHODS =====

  private async fetchStatisticsData(): Promise<MatchStatistics> {
    try {
      // In development, load from public folder
      // In production, this would be an API endpoint
      const response = await fetch('/statistics.json');
      
      if (!response.ok) {
        throw new DataServiceError(
          `Failed to fetch statistics: ${response.status} ${response.statusText}`,
          ErrorCode.FETCH_FAILED,
          { 
            status: response.status,
            statusText: response.statusText,
            url: response.url
          }
        );
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new DataServiceError(
          'Invalid response content type',
          ErrorCode.PARSE_ERROR,
          { contentType }
        );
      }

      const data = await response.json();

      // Basic validation
      if (!this.validateStatisticsData(data)) {
        throw new DataServiceError(
          'Invalid statistics data structure',
          ErrorCode.VALIDATION_FAILED,
          { data: typeof data }
        );
      }

      return data as MatchStatistics;

    } catch (error) {
      if (error instanceof DataServiceError) {
        throw error;
      }

      // Handle network errors, parse errors, etc.
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new DataServiceError(
          'Network error: Unable to fetch statistics data',
          ErrorCode.FETCH_FAILED,
          { originalError: error.message },
          true // recoverable - user can retry
        );
      }

      if (error instanceof SyntaxError) {
        throw new DataServiceError(
          'Failed to parse statistics data as JSON',
          ErrorCode.PARSE_ERROR,
          { originalError: error.message },
          false // not recoverable - data is corrupted
        );
      }

      throw new DataServiceError(
        'Unknown error occurred while fetching statistics',
        ErrorCode.FETCH_FAILED,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  private validateStatisticsData(data: any): boolean {
    try {
      // Basic structure validation
      if (!data || typeof data !== 'object') {
        return false;
      }

      // Check for required top-level properties
      const requiredKeys = ['match_summary', 'players_statistics'];
      for (const key of requiredKeys) {
        if (!(key in data)) {
          console.warn(`Missing required key: ${key}`);
          return false;
        }
      }

      // Validate match_summary structure
      const matchSummary = data.match_summary;
      if (!matchSummary || typeof matchSummary !== 'object') {
        console.warn('Invalid match_summary structure');
        return false;
      }

      // Check for required match_summary fields
      const requiredSummaryFields = ['total_rally_time', 'average_rally_duration'];
      for (const field of requiredSummaryFields) {
        if (!(field in matchSummary) || typeof matchSummary[field] !== 'number') {
          console.warn(`Missing or invalid match_summary field: ${field}`);
          return false;
        }
      }

      // Validate players_statistics structure
      const playersStats = data.players_statistics;
      if (!playersStats || typeof playersStats !== 'object') {
        console.warn('Invalid players_statistics structure');
        return false;
      }

      // Check that we have at least one player
      const playerKeys = Object.keys(playersStats);
      if (playerKeys.length === 0) {
        console.warn('No player statistics found');
        return false;
      }

      // Validate at least one player has required fields
      const firstPlayer = playersStats[playerKeys[0]];
      if (!firstPlayer || typeof firstPlayer !== 'object') {
        console.warn('Invalid player statistics structure');
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error during data validation:', error);
      return false;
    }
  }

  // ===== PUBLIC UTILITY METHODS =====

  isLoading(): boolean {
    return this.loadingPromise !== null;
  }

  hasData(): boolean {
    return this.cachedData !== null;
  }

  getCachedData(): MatchStatistics | null {
    return this.cachedData;
  }

  getDataAge(): number | null {
    // This would require tracking when data was fetched
    // For now, return null since we don't track timestamps in this simple implementation
    return null;
  }

  // For testing and development
  async preload(): Promise<void> {
    try {
      await this.fetch();
      console.log('Statistics data preloaded successfully');
    } catch (error) {
      console.error('Failed to preload statistics data:', error);
    }
  }
}

// ===== CONVENIENCE EXPORTS =====

export const statisticsApi = StatisticsApiService.getInstance();

// Helper function for components that just need to check if data is available
export function isStatisticsDataAvailable(): boolean {
  return statisticsApi.hasData();
}

// Helper function to get cached data without triggering a fetch
export function getCachedStatisticsData(): MatchStatistics | null {
  return statisticsApi.getCachedData();
}