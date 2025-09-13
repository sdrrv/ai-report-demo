/**
 * Coordinate transformation utilities for Ball Map
 * Converts between backend coordinate system (meters) and frontend SVG units
 */

import { Position } from '@/types/backend';

// Frontend coordinate system constants
export const FRONTEND_CONSTANTS = {
  SVG_WIDTH: 100,
  SVG_HEIGHT: 85,
  COURT_X_MIN: 10,
  COURT_X_MAX: 90,
  COURT_Y_MIN: 0,
  COURT_Y_MAX: 75,
  COURT_WIDTH: 80, // 90 - 10
  COURT_HEIGHT: 75, // 75 - 0
} as const;

// Backend coordinate system constants (from statistics.json analysis)
export const BACKEND_CONSTANTS = {
  COURT_WIDTH_METERS: 10, // Full court width
  COURT_HEIGHT_METERS: 20, // Full court height
  HALF_COURT_HEIGHT_METERS: 10, // Half court (what we display)
  X_MIN: -5, // Left boundary
  X_MAX: 5,  // Right boundary
  Y_MIN: 0,  // Net (top)
  Y_MAX: 10, // Baseline (bottom of half court)
} as const;

/**
 * Convert backend X coordinate (meters) to frontend SVG coordinate
 */
export function backendToFrontendX(backendX: number): number {
  // Backend: [-5, 5] → Frontend: [10, 90]
  const normalizedX = (backendX - BACKEND_CONSTANTS.X_MIN) / (BACKEND_CONSTANTS.X_MAX - BACKEND_CONSTANTS.X_MIN);
  return FRONTEND_CONSTANTS.COURT_X_MIN + (normalizedX * FRONTEND_CONSTANTS.COURT_WIDTH);
}

/**
 * Convert backend Y coordinate (meters) to frontend SVG coordinate
 */
export function backendToFrontendY(backendY: number, shouldMirror: boolean = false): number {
  // Backend: [0, 10] → Frontend: [0, 75]
  let y = backendY;
  
  // Handle mirroring if specified
  if (shouldMirror) {
    y = BACKEND_CONSTANTS.Y_MAX - backendY;
  }
  
  const normalizedY = (y - BACKEND_CONSTANTS.Y_MIN) / (BACKEND_CONSTANTS.Y_MAX - BACKEND_CONSTANTS.Y_MIN);
  return FRONTEND_CONSTANTS.COURT_Y_MIN + (normalizedY * FRONTEND_CONSTANTS.COURT_HEIGHT);
}

/**
 * Convert frontend X coordinate to backend (meters)
 */
export function frontendToBackendX(frontendX: number): number {
  // Frontend: [10, 90] → Backend: [-5, 5]
  const normalizedX = (frontendX - FRONTEND_CONSTANTS.COURT_X_MIN) / FRONTEND_CONSTANTS.COURT_WIDTH;
  return BACKEND_CONSTANTS.X_MIN + (normalizedX * (BACKEND_CONSTANTS.X_MAX - BACKEND_CONSTANTS.X_MIN));
}

/**
 * Convert frontend Y coordinate to backend (meters)
 */
export function frontendToBackendY(frontendY: number, shouldMirror: boolean = false): number {
  // Frontend: [0, 75] → Backend: [0, 10]
  const normalizedY = (frontendY - FRONTEND_CONSTANTS.COURT_Y_MIN) / FRONTEND_CONSTANTS.COURT_HEIGHT;
  let backendY = BACKEND_CONSTANTS.Y_MIN + (normalizedY * (BACKEND_CONSTANTS.Y_MAX - BACKEND_CONSTANTS.Y_MIN));
  
  // Handle mirroring if specified
  if (shouldMirror) {
    backendY = BACKEND_CONSTANTS.Y_MAX - backendY;
  }
  
  return backendY;
}

/**
 * Transform backend position to frontend coordinates
 */
export function transformPositionToFrontend(
  position: Position, 
  shouldMirror: boolean = false
): { x: number; y: number } {
  return {
    x: backendToFrontendX(position.x),
    y: backendToFrontendY(position.y, shouldMirror)
  };
}

/**
 * Transform frontend position to backend coordinates
 */
export function transformPositionToBackend(
  frontendPosition: { x: number; y: number }, 
  shouldMirror: boolean = false
): Position {
  return {
    x: frontendToBackendX(frontendPosition.x),
    y: frontendToBackendY(frontendPosition.y, shouldMirror)
  };
}

/**
 * Convert heatmap grid coordinates to frontend pixel coordinates
 * Used for heatmap.js integration
 */
export function heatmapGridToPixels(
  gridX: number,
  gridY: number,
  xEdges: number[],
  yEdges: number[],
  containerWidth: number,
  containerHeight: number,
  shouldMirror: boolean = false
): { x: number; y: number } {
  // Get the actual meter coordinates for this grid cell
  const backendX = xEdges[gridX] + (xEdges[gridX + 1] - xEdges[gridX]) / 2; // Cell center
  const backendY = yEdges[gridY] + (yEdges[gridY + 1] - yEdges[gridY]) / 2; // Cell center
  
  // Transform to frontend coordinates (0-100 SVG units)
  const frontendX = backendToFrontendX(backendX);
  const frontendY = backendToFrontendY(backendY, shouldMirror);
  
  // Convert to pixel coordinates within the container
  // Court area is x: [10, 90] and y: [0, 75] in SVG coordinates
  const pixelX = ((frontendX - FRONTEND_CONSTANTS.COURT_X_MIN) / FRONTEND_CONSTANTS.COURT_WIDTH) * containerWidth;
  const pixelY = ((frontendY - FRONTEND_CONSTANTS.COURT_Y_MIN) / FRONTEND_CONSTANTS.COURT_HEIGHT) * containerHeight;
  
  return {
    x: Math.round(pixelX),
    y: Math.round(pixelY)
  };
}

/**
 * Validate if a position is within court boundaries
 */
export function isPositionInCourt(position: Position): boolean {
  return position.x >= BACKEND_CONSTANTS.X_MIN &&
         position.x <= BACKEND_CONSTANTS.X_MAX &&
         position.y >= BACKEND_CONSTANTS.Y_MIN &&
         position.y <= BACKEND_CONSTANTS.Y_MAX;
}

/**
 * Get court dimensions in different coordinate systems
 */
export function getCourtDimensions() {
  return {
    backend: {
      width: BACKEND_CONSTANTS.COURT_WIDTH_METERS,
      height: BACKEND_CONSTANTS.HALF_COURT_HEIGHT_METERS,
      bounds: {
        x: [BACKEND_CONSTANTS.X_MIN, BACKEND_CONSTANTS.X_MAX],
        y: [BACKEND_CONSTANTS.Y_MIN, BACKEND_CONSTANTS.Y_MAX]
      }
    },
    frontend: {
      width: FRONTEND_CONSTANTS.COURT_WIDTH,
      height: FRONTEND_CONSTANTS.COURT_HEIGHT,
      bounds: {
        x: [FRONTEND_CONSTANTS.COURT_X_MIN, FRONTEND_CONSTANTS.COURT_X_MAX],
        y: [FRONTEND_CONSTANTS.COURT_Y_MIN, FRONTEND_CONSTANTS.COURT_Y_MAX]
      }
    }
  };
}

// Export type for coordinate transformation result
export interface CoordinateTransformResult {
  x: number;
  y: number;
}

// Export constants for external use
export { FRONTEND_CONSTANTS as FRONTEND_COORDS };
export { BACKEND_CONSTANTS as BACKEND_COORDS };