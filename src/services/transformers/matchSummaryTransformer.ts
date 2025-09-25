/**
 * Match Summary data transformer
 * Converts raw statistics data into format ready for MatchSummary component
 */

import { MatchStatistics } from '@/types/backend';
import { DataTransformer, MatchSummaryData, ErrorCode, DataServiceError } from '@/types/services';

export class MatchSummaryTransformer implements DataTransformer<MatchStatistics, MatchSummaryData> {
  
  transform(data: MatchStatistics): MatchSummaryData {
    try {
      const { match_summary } = data;

      if (!match_summary) {
        throw new DataServiceError(
          'Match summary data is missing',
          ErrorCode.TRANSFORMATION_ERROR,
          { availableKeys: Object.keys(data) }
        );
      }

      // Extract the required values
      const totalRallyTimeSeconds = match_summary.total_rally_time || 0;
      const averageRallyDuration = match_summary.average_rally_duration || 0;
      const longestRallyDuration = match_summary.longest_rally?.duration || 0;
      const totalRallies = match_summary.number_of_rallies || 0;
      const rallyTimePercentage = match_summary.rally_time_percentage || 0;
      const totalGameTimeSeconds = match_summary.total_game_time || 0;

      // Transform the data
      const result: MatchSummaryData = {
        timeInPlay: this.convertSecondsToMinutes(totalRallyTimeSeconds),
        averageRally: this.roundToOneDecimal(averageRallyDuration),
        longestRally: this.roundToOneDecimal(longestRallyDuration),
        totalRallies: totalRallies,
        rallyTimePercentage: this.roundToOneDecimal(rallyTimePercentage),
        totalGameTime: this.convertSecondsToMinutes(totalGameTimeSeconds),
        matchId: this.extractMatchId(data)
      };

      return result;

    } catch (error) {
      if (error instanceof DataServiceError) {
        throw error;
      }

      throw new DataServiceError(
        'Failed to transform match summary data',
        ErrorCode.TRANSFORMATION_ERROR,
        { 
          originalError: error instanceof Error ? error.message : String(error),
          dataKeys: data ? Object.keys(data) : 'data is null/undefined'
        }
      );
    }
  }

  validate(data: MatchStatistics): boolean {
    try {
      // Check if data exists and is an object
      if (!data || typeof data !== 'object') {
        console.warn('MatchSummaryTransformer: Data is null, undefined, or not an object');
        return false;
      }

      // Check if match_summary exists
      if (!data.match_summary) {
        console.warn('MatchSummaryTransformer: match_summary is missing');
        return false;
      }

      const { match_summary } = data;

      // Validate required fields exist and are numbers
      const requiredFields = [
        'total_rally_time',
        'average_rally_duration'
      ];

      for (const field of requiredFields) {
        if (!(field in match_summary)) {
          console.warn(`MatchSummaryTransformer: Required field '${field}' is missing`);
          return false;
        }

        const value = match_summary[field as keyof typeof match_summary];
        if (typeof value !== 'number' || isNaN(value)) {
          console.warn(`MatchSummaryTransformer: Field '${field}' is not a valid number:`, value);
          return false;
        }

        // Check for reasonable bounds
        if (value < 0) {
          console.warn(`MatchSummaryTransformer: Field '${field}' has negative value:`, value);
          return false;
        }
      }

      // Validate longest_rally if it exists
      if (match_summary.longest_rally) {
        const longestRally = match_summary.longest_rally;
        if (typeof longestRally.duration !== 'number' || isNaN(longestRally.duration)) {
          console.warn('MatchSummaryTransformer: longest_rally.duration is not a valid number');
          return false;
        }
        if (longestRally.duration < 0) {
          console.warn('MatchSummaryTransformer: longest_rally.duration is negative');
          return false;
        }
      }

      // Validate number_of_rallies if it exists
      if (match_summary.number_of_rallies !== undefined) {
        const numRallies = match_summary.number_of_rallies;
        if (typeof numRallies !== 'number' || isNaN(numRallies) || numRallies < 0) {
          console.warn('MatchSummaryTransformer: number_of_rallies is invalid');
          return false;
        }
      }

      return true;

    } catch (error) {
      console.error('MatchSummaryTransformer validation error:', error);
      return false;
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private convertSecondsToMinutes(seconds: number): number {
    // Convert seconds to minutes and round to nearest whole number
    return Math.round(seconds / 60);
  }

  private roundToOneDecimal(value: number): number {
    // Round to one decimal place
    return Math.round(value * 10) / 10;
  }

  private extractMatchId(data: MatchStatistics): string | undefined {
    // Try to extract match ID from various possible locations
    // This might need to be adjusted based on actual data structure
    
    if (data.match_summary?.game_start_time) {
      // Use timestamp as a fallback match ID
      return `match_${data.match_summary.game_start_time}`;
    }

    // Could also check other places like:
    // - data.match_id
    // - data.metadata?.id
    // - etc.

    return undefined;
  }

  // ===== PUBLIC UTILITY METHODS =====

  /**
   * Get a preview of what the transformed data would look like
   * without actually transforming (useful for debugging)
   */
  getTransformPreview(data: MatchStatistics): Partial<MatchSummaryData> | null {
    try {
      if (!this.validate(data)) {
        return null;
      }

      const { match_summary } = data;

      return {
        timeInPlay: this.convertSecondsToMinutes(match_summary.total_rally_time),
        averageRally: this.roundToOneDecimal(match_summary.average_rally_duration),
        longestRally: match_summary.longest_rally
          ? this.roundToOneDecimal(match_summary.longest_rally.duration)
          : 0,
        totalRallies: match_summary.number_of_rallies || 0,
        rallyTimePercentage: this.roundToOneDecimal(match_summary.rally_time_percentage || 0),
        totalGameTime: this.convertSecondsToMinutes(match_summary.total_game_time || 0)
      };
    } catch {
      return null;
    }
  }

  /**
   * Check what fields are available in the source data
   */
  getAvailableFields(data: MatchStatistics): string[] {
    try {
      if (!data?.match_summary) {
        return [];
      }

      return Object.keys(data.match_summary);
    } catch {
      return [];
    }
  }

  /**
   * Get detailed validation report
   */
  getValidationReport(data: MatchStatistics): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    availableFields: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const availableFields = this.getAvailableFields(data);

    // Detailed validation with specific error messages
    if (!data) {
      errors.push('Data is null or undefined');
      return { isValid: false, errors, warnings, availableFields };
    }

    if (!data.match_summary) {
      errors.push('match_summary property is missing');
      return { isValid: false, errors, warnings, availableFields };
    }

    const { match_summary } = data;

    // Check required fields
    if (typeof match_summary.total_rally_time !== 'number') {
      errors.push('total_rally_time is missing or not a number');
    } else if (match_summary.total_rally_time < 0) {
      warnings.push('total_rally_time is negative');
    }

    if (typeof match_summary.average_rally_duration !== 'number') {
      errors.push('average_rally_duration is missing or not a number');
    } else if (match_summary.average_rally_duration < 0) {
      warnings.push('average_rally_duration is negative');
    }

    // Check optional fields
    if (!match_summary.longest_rally) {
      warnings.push('longest_rally data is missing');
    } else if (typeof match_summary.longest_rally.duration !== 'number') {
      warnings.push('longest_rally.duration is not a valid number');
    }

    if (!match_summary.number_of_rallies) {
      warnings.push('number_of_rallies is missing');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      availableFields
    };
  }
}

// ===== SINGLETON INSTANCE =====

export const matchSummaryTransformer = new MatchSummaryTransformer();