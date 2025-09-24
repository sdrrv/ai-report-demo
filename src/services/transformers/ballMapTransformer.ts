/**
 * Ball Map data transformer
 * Converts raw player statistics into format ready for BallMap component
 */

import { MatchStatistics, PlayerId } from '@/types/backend';
import { 
  DataTransformer, 
  BallMapData, 
  CourtZoneData, 
  HeatmapGridData,
  ErrorCode, 
  DataServiceError 
} from '@/types/services';

export class BallMapTransformer implements DataTransformer<MatchStatistics, BallMapData> {
  
  transform(data: MatchStatistics, selectedPlayerId?: PlayerId): BallMapData {
    try {
      const { players_statistics } = data;

      if (!players_statistics) {
        throw new DataServiceError(
          'Player statistics data is missing',
          ErrorCode.TRANSFORMATION_ERROR,
          { availableKeys: Object.keys(data) }
        );
      }

      // Get the selected player's data (default to player1 if not specified)
      const playerKey = selectedPlayerId ? `player${selectedPlayerId}` : 'player1';
      const playerStats = players_statistics[playerKey as keyof typeof players_statistics];
      
      if (!playerStats) {
        throw new DataServiceError(
          `Player ${playerKey} statistics not found`,
          ErrorCode.TRANSFORMATION_ERROR,
          { 
            selectedPlayerId, 
            availablePlayerKeys: Object.keys(players_statistics) 
          }
        );
      }

      // Validate required data
      if (!playerStats.court_zone || !playerStats.heatmap) {
        throw new DataServiceError(
          `Missing court_zone or heatmap data for ${playerKey}`,
          ErrorCode.TRANSFORMATION_ERROR,
          { 
            hasCourtZone: !!playerStats.court_zone,
            hasHeatmap: !!playerStats.heatmap
          }
        );
      }

      // Extract player info
      const playerId = selectedPlayerId || 1;
      const isMe = selectedPlayerId === playerId;
      const playerName = isMe ? 'You' : `Player ${playerId}`;

      // Transform court zone data
      const zones = this.transformCourtZones(playerStats.court_zone.zones);
      const sides = this.transformCourtSides(playerStats.court_zone.sides);
      const frontBack = this.transformFrontBack(playerStats.court_zone.front_back);

      // Transform heatmap data
      const heatmapGrid = this.transformHeatmapGrid(playerStats.heatmap);

      const result: BallMapData = {
        playerId,
        playerName,
        isMe,
        zones,
        sides,
        frontBack,
        heatmapGrid,
        matchId: this.extractMatchId(data)
      };

      return result;

    } catch (error) {
      if (error instanceof DataServiceError) {
        throw error;
      }

      throw new DataServiceError(
        'Failed to transform ball map data',
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
        console.warn('BallMapTransformer: Data is null, undefined, or not an object');
        return false;
      }

      // Check if players_statistics exists
      if (!data.players_statistics) {
        console.warn('BallMapTransformer: players_statistics is missing');
        return false;
      }

      const { players_statistics } = data;

      // Check that we have at least one player
      const playerKeys = Object.keys(players_statistics);
      if (playerKeys.length === 0) {
        console.warn('BallMapTransformer: No player statistics found');
        return false;
      }

      // Validate at least one player has required fields
      let hasValidPlayer = false;
      
      for (const key of playerKeys) {
        const playerStats = players_statistics[key as keyof typeof players_statistics];
        
        if (!playerStats) continue;

        // Check required fields
        if (!playerStats.court_zone || !playerStats.heatmap) {
          console.warn(`BallMapTransformer: Missing court_zone or heatmap for ${key}`);
          continue;
        }

        // Validate court_zone structure
        const { court_zone } = playerStats;
        if (!court_zone.zones || !court_zone.sides || !court_zone.front_back) {
          console.warn(`BallMapTransformer: Invalid court_zone structure for ${key}`);
          continue;
        }

        // Validate heatmap structure
        const { heatmap } = playerStats;
        if (!heatmap.heatmap || !heatmap.x_edges || !heatmap.y_edges || !heatmap.grid_size) {
          console.warn(`BallMapTransformer: Invalid heatmap structure for ${key}`);
          continue;
        }

        // Check grid consistency
        if (!Array.isArray(heatmap.heatmap) || 
            heatmap.heatmap.length !== heatmap.grid_size[0] ||
            !Array.isArray(heatmap.heatmap[0]) ||
            heatmap.heatmap[0].length !== heatmap.grid_size[1]) {
          console.warn(`BallMapTransformer: Heatmap grid size mismatch for ${key}`);
          continue;
        }

        hasValidPlayer = true;
        break;
      }

      if (!hasValidPlayer) {
        console.warn('BallMapTransformer: No valid player data found');
        return false;
      }

      return true;

    } catch (error) {
      console.error('BallMapTransformer validation error:', error);
      return false;
    }
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  private transformCourtZones(zones: any): CourtZoneData[] {
    // Convert zones object to array with percentage values
    const zoneOrder = [
      'net_left', 'net_middle', 'net_right',
      'transition_left', 'transition_middle', 'transition_right',
      'back_left', 'back_middle', 'back_right'
    ];

    return zoneOrder.map(region => ({
      region,
      value: Math.round((zones[region] || 0) * 100) // Convert from 0-1 to 0-100
    }));
  }

  private transformCourtSides(sides: any): CourtZoneData[] {
    return [
      { region: 'left', value: Math.round((sides.left || 0) * 100) },
      { region: 'middle', value: Math.round((sides.middle || 0) * 100) },
      { region: 'right', value: Math.round((sides.right || 0) * 100) }
    ];
  }

  private transformFrontBack(frontBack: any): CourtZoneData[] {
    // In backend: net, transition, back
    // For frontend front-back view, we show all 3 zones separately with proper proportions
    return [
      { region: 'net', value: Math.round((frontBack.net || 0) * 100) },
      { region: 'transition', value: Math.round((frontBack.transition || 0) * 100) },
      { region: 'back', value: Math.round((frontBack.back || 0) * 100) }
    ];
  }

  private transformHeatmapGrid(heatmapData: any): HeatmapGridData {
    return {
      data: heatmapData.heatmap, // Already a 2D array
      x_edges: heatmapData.x_edges,
      y_edges: heatmapData.y_edges,
      total_points: heatmapData.total_points,
      grid_size: heatmapData.grid_size,
      court_bounds: heatmapData.court_bounds,
      mirror_negative_y: heatmapData.mirror_negative_y || false
    };
  }

  private extractMatchId(data: MatchStatistics): string | undefined {
    // Try to extract match ID from various possible locations
    if (data.match_summary?.game_start_time) {
      return `match_${data.match_summary.game_start_time}`;
    }
    return undefined;
  }

  // ===== PUBLIC UTILITY METHODS =====

  /**
   * Get a preview of court zone data for debugging
   */
  getCourtZonePreview(data: MatchStatistics, selectedPlayerId?: PlayerId): {
    zones: Record<string, number>;
    sides: Record<string, number>;
    frontBack: Record<string, number>;
  } | null {
    try {
      if (!this.validate(data)) {
        return null;
      }

      const playerKey = selectedPlayerId ? `player${selectedPlayerId}` : 'player1';
      const playerStats = data.players_statistics[playerKey as keyof typeof data.players_statistics];
      
      if (!playerStats?.court_zone) {
        return null;
      }

      const { court_zone } = playerStats;
      
      return {
        zones: Object.fromEntries(
          Object.entries(court_zone.zones).map(([key, value]) => [
            key, 
            Math.round((value as number) * 100)
          ])
        ),
        sides: Object.fromEntries(
          Object.entries(court_zone.sides).map(([key, value]) => [
            key, 
            Math.round((value as number) * 100)
          ])
        ),
        frontBack: {
          front: Math.round(((court_zone.front_back.net + court_zone.front_back.transition) * 100)),
          back: Math.round((court_zone.front_back.back * 100))
        }
      };
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

      // Check court_zone
      if (!playerStats.court_zone) {
        errors.push(`${key} missing court_zone data`);
      } else {
        const { court_zone } = playerStats;
        if (!court_zone.zones || !court_zone.sides || !court_zone.front_back) {
          errors.push(`${key} has incomplete court_zone structure`);
        }
      }

      // Check heatmap
      if (!playerStats.heatmap) {
        errors.push(`${key} missing heatmap data`);
      } else {
        const { heatmap } = playerStats;
        if (!heatmap.heatmap || !heatmap.x_edges || !heatmap.y_edges) {
          errors.push(`${key} has incomplete heatmap structure`);
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

export const ballMapTransformer = new BallMapTransformer();