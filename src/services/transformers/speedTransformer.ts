/**
 * Speed data transformer
 * Converts raw player statistics into format ready for SpeedCard component
 */

import { MatchStatistics, PlayerId } from '@/types/backend';
import { DataTransformer, PlayerSpeedData, ErrorCode, DataServiceError } from '@/types/services';

export class SpeedTransformer implements DataTransformer<MatchStatistics, PlayerSpeedData[]> {
  
  transform(data: MatchStatistics, selectedPlayerId?: PlayerId): PlayerSpeedData[] {
    try {
      const { players_statistics } = data;

      if (!players_statistics) {
        throw new DataServiceError(
          'Player statistics data is missing',
          ErrorCode.TRANSFORMATION_ERROR,
          { availableKeys: Object.keys(data) }
        );
      }

      // Convert player statistics to speed data array
      const speedData: PlayerSpeedData[] = [];
      
      const playerKeys = Object.keys(players_statistics) as Array<keyof typeof players_statistics>;
      
      for (const playerKey of playerKeys) {
        const playerStats = players_statistics[playerKey];
        
        if (!playerStats) {
          continue;
        }

        // Extract player ID from key (player1 -> 1, player2 -> 2, etc.)
        const playerId = parseInt(playerKey.replace('player', '')) as PlayerId;
        
        // Determine player name and if this is the selected player
        const isMe = selectedPlayerId === playerId;
        const playerName = isMe ? 'You' : `Player ${playerId}`;

        // Validate required fields
        if (typeof playerStats.max_velocity !== 'number' || 
            typeof playerStats.mean_velocity !== 'number' ||
            typeof playerStats.running_distance !== 'number') {
          console.warn(`Invalid speed data for ${playerKey}:`, playerStats);
          continue;
        }

        speedData.push({
          playerId,
          playerName,
          maxSpeed: this.roundToOneDecimal(playerStats.max_velocity),
          averageSpeed: this.roundToOneDecimal(playerStats.mean_velocity),
          runningDistance: Math.round(playerStats.running_distance),
          isMe
        });
      }

      // Sort by max speed (highest first)
      speedData.sort((a, b) => b.maxSpeed - a.maxSpeed);

      if (speedData.length === 0) {
        throw new DataServiceError(
          'No valid player speed data found',
          ErrorCode.TRANSFORMATION_ERROR,
          { playerKeys: Object.keys(players_statistics) }
        );
      }

      return speedData;

    } catch (error) {
      if (error instanceof DataServiceError) {
        throw error;
      }

      throw new DataServiceError(
        'Failed to transform player speed data',
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
        console.warn('SpeedTransformer: Data is null, undefined, or not an object');
        return false;
      }

      // Check if players_statistics exists
      if (!data.players_statistics) {
        console.warn('SpeedTransformer: players_statistics is missing');
        return false;
      }

      const { players_statistics } = data;

      // Check that we have at least one player
      const playerKeys = Object.keys(players_statistics);
      if (playerKeys.length === 0) {
        console.warn('SpeedTransformer: No player statistics found');
        return false;
      }

      // Validate at least one player has required speed fields
      let hasValidPlayer = false;
      
      for (const key of playerKeys) {
        const playerStats = players_statistics[key as keyof typeof players_statistics];
        
        if (!playerStats) continue;

        // Check required fields
        const requiredFields = ['max_velocity', 'mean_velocity', 'running_distance'];
        let playerValid = true;

        for (const field of requiredFields) {
          if (!(field in playerStats)) {
            console.warn(`SpeedTransformer: Required field '${field}' missing for ${key}`);
            playerValid = false;
            break;
          }

          const value = playerStats[field as keyof typeof playerStats];
          if (typeof value !== 'number' || isNaN(value)) {
            console.warn(`SpeedTransformer: Field '${field}' is not a valid number for ${key}:`, value);
            playerValid = false;
            break;
          }

          // Check for reasonable bounds (speeds shouldn't be negative)
          if (value < 0) {
            console.warn(`SpeedTransformer: Field '${field}' has negative value for ${key}:`, value);
            playerValid = false;
            break;
          }
        }

        if (playerValid) {
          hasValidPlayer = true;
          break;
        }
      }

      if (!hasValidPlayer) {
        console.warn('SpeedTransformer: No valid player data found');
        return false;
      }

      return true;

    } catch (error) {
      console.error('SpeedTransformer validation error:', error);
      return false;
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private roundToOneDecimal(value: number): number {
    return Math.round(value * 10) / 10;
  }

  // ===== PUBLIC UTILITY METHODS =====

  /**
   * Get a preview of what the transformed data would look like
   */
  getTransformPreview(data: MatchStatistics, selectedPlayerId?: PlayerId): Partial<PlayerSpeedData>[] | null {
    try {
      if (!this.validate(data)) {
        return null;
      }

      const { players_statistics } = data;
      const preview: Partial<PlayerSpeedData>[] = [];

      const playerKeys = Object.keys(players_statistics) as Array<keyof typeof players_statistics>;
      
      for (const playerKey of playerKeys) {
        const playerStats = players_statistics[playerKey];
        if (!playerStats) continue;

        const playerId = parseInt(playerKey.replace('player', '')) as PlayerId;
        const isMe = selectedPlayerId === playerId;

        preview.push({
          playerId,
          playerName: isMe ? 'You' : `Player ${playerId}`,
          maxSpeed: this.roundToOneDecimal(playerStats.max_velocity),
          averageSpeed: this.roundToOneDecimal(playerStats.mean_velocity),
          isMe
        });
      }

      return preview.sort((a, b) => (b.maxSpeed || 0) - (a.maxSpeed || 0));
    } catch {
      return null;
    }
  }

  /**
   * Get available player IDs in the data
   */
  getAvailablePlayerIds(data: MatchStatistics): PlayerId[] {
    try {
      if (!data?.players_statistics) {
        return [];
      }

      return Object.keys(data.players_statistics)
        .map(key => parseInt(key.replace('player', '')) as PlayerId)
        .filter(id => !isNaN(id) && id >= 1 && id <= 4);
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
    availablePlayerIds: PlayerId[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const availablePlayerIds = this.getAvailablePlayerIds(data);

    if (!data) {
      errors.push('Data is null or undefined');
      return { isValid: false, errors, warnings, availablePlayerIds };
    }

    if (!data.players_statistics) {
      errors.push('players_statistics property is missing');
      return { isValid: false, errors, warnings, availablePlayerIds };
    }

    const { players_statistics } = data;
    const playerKeys = Object.keys(players_statistics);

    if (playerKeys.length === 0) {
      errors.push('No player statistics found');
      return { isValid: false, errors, warnings, availablePlayerIds };
    }

    // Check each player
    for (const key of playerKeys) {
      const playerStats = players_statistics[key as keyof typeof players_statistics];
      
      if (!playerStats) {
        warnings.push(`Player ${key} has no data`);
        continue;
      }

      // Check required fields
      const requiredFields = ['max_velocity', 'mean_velocity', 'running_distance'];
      
      for (const field of requiredFields) {
        if (!(field in playerStats)) {
          errors.push(`${key} missing required field: ${field}`);
        } else {
          const value = playerStats[field as keyof typeof playerStats];
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(`${key}.${field} is not a valid number`);
          } else if (value < 0) {
            warnings.push(`${key}.${field} has negative value`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      availablePlayerIds
    };
  }
}

// ===== SINGLETON INSTANCE =====

export const speedTransformer = new SpeedTransformer();