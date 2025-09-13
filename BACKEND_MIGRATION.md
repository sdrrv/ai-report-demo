# Backend Integration Migration Guide

This document provides a comprehensive analysis of mock data usage across all AI Report components and a roadmap for integrating with the Matchlytics backend API.

## Executive Summary

The Matchlytics AI Report currently uses hardcoded mock data across 7 main components. Each component manages its own data locally, with no centralized data management. This analysis identifies:

- **144 hardcoded shot data points** in Ball Map
- **Player-specific data** across 4 components
- **Static match summary data** with 3 core metrics
- **No error handling or loading states** for future API integration

## ⚠️ Important: Component Adaptation Required

**Critical Note**: Based on the actual backend data structure (see `statistics.json`), many components will need **significant modifications** to properly consume real data. The backend provides:

- **Coordinate-based tracking data** (x, y positions in meters)
- **Court zone analysis** (front/back, left/middle/right percentages) 
- **Shot tracking with rally contexts** and frame-based timing
- **Statistical aggregations** different from current mock structure

**Components will need to be refactored** to match the backend's data format rather than simply replacing mock data values.

## Component Analysis & Migration Strategy

### 1. Match Summary Component

**File**: `src/components/MatchSummary.tsx`

**Current Mock Data**:
```typescript
gameData = {
  timeInPlay: 42,        // minutes
  averageRally: 6.3,     // shots
  longestRally: 24       // shots
}
```

**Backend Requirements**:
- Match duration tracking
- Rally analysis from shot sequence data
- Statistical calculations for averages

**Suggested API Endpoint**:
```typescript
GET /api/matches/{matchId}/summary
Response: {
  timeInPlay: number;
  averageRally: number;
  longestRally: number;
  totalRallies: number;
  matchStartTime: string;
  matchEndTime: string;
}
```

**Migration Priority**: ⭐⭐ (Low complexity, static data)

---

### 2. Shot Analysis Component

**File**: `src/components/ShotAnalysis.tsx`

**Current Mock Data**:
```typescript
playerData: Record<number, PlayerShotData> = {
  1: {
    offensive: 65, defensive: 35,           // percentages
    rightShots: 35, centerShots: 40, leftShots: 25,
    attackHits: [
      { name: 'Forehand', percentage: 64 },
      { name: 'Backhand', percentage: 14 },
      { name: 'Smash', percentage: 12 }
    ],
    defensiveHits: [
      { name: 'Backhand', percentage: 34 },
      { name: 'Forehand', percentage: 66 }
    ]
  }
  // ... data for players 2-4
}
```

**Backend Requirements**:
- Shot classification (offensive/defensive)
- Shot type identification (forehand, backhand, smash)
- Positional shot analysis (left, center, right)
- Player-specific breakdowns

**Suggested API Endpoint**:
```typescript
GET /api/matches/{matchId}/players/{playerId}/shot-analysis
Response: {
  playerId: number;
  offensivePercentage: number;
  defensivePercentage: number;
  shotDistribution: {
    left: number;
    center: number;
    right: number;
  };
  shotTypes: {
    offensive: Array<{ type: string; percentage: number; count: number }>;
    defensive: Array<{ type: string; percentage: number; count: number }>;
  };
}
```

**Migration Priority**: ⭐⭐⭐⭐ (High complexity, requires ML classification)

---

### 3. Serves Analysis Component

**File**: `src/components/ServesCard.tsx`

**Current Mock Data**:
```typescript
playerData: Record<number, PlayerServeData> = {
  1: {
    firstServeSuccess: 81,     // percentage
    avgServeSpeed: 57,         // km/h
    serveToCenter: 47,         // percentage
    serveToBody: 9,           // percentage  
    serveToWall: 44,          // percentage
    lowStrokeReturn: 70,      // percentage
    lobReturn: 30             // percentage
  }
}
```

**Backend Requirements**:
- Serve success rate calculation
- Speed tracking for serves
- Serve placement analysis
- Return type classification

**Suggested API Endpoint**:
```typescript
GET /api/matches/{matchId}/players/{playerId}/serves
Response: {
  playerId: number;
  firstServeSuccess: number;
  averageServeSpeed: number;
  maxServeSpeed: number;
  serveDistribution: {
    center: number;
    body: number;
    wall: number;
  };
  returnTypes: {
    lowStroke: number;
    lob: number;
  };
  totalServes: number;
}
```

**Migration Priority**: ⭐⭐⭐ (Medium complexity, requires speed/position tracking)

---

### 4. Running Speed Component

**File**: `src/components/SpeedCard.tsx`

**Current Mock Data**:
```typescript
playerSpeeds: PlayerSpeed[] = [
  { id: 1, name: 'You', speed: 28.5, avgSpeed: 22.3, isMe: true },
  { id: 2, name: 'Player 2', speed: 24.3, avgSpeed: 19.8 },
  { id: 3, name: 'Player 3', speed: 19.7, avgSpeed: 16.2 },
  { id: 4, name: 'Player 1', speed: 16.2, avgSpeed: 13.5 }
]
```

**Backend Requirements**:
- Player movement tracking
- Speed calculations (max and average)
- Player identification and ranking

**Suggested API Endpoint**:
```typescript
GET /api/matches/{matchId}/speed-analysis
Response: {
  players: Array<{
    playerId: number;
    playerName: string;
    maxSpeed: number;      // km/h
    averageSpeed: number;  // km/h
    topSpeedTime: string;  // timestamp when max speed reached
    distanceCovered: number; // meters
  }>;
}
```

**Migration Priority**: ⭐⭐⭐ (Medium complexity, requires motion tracking)

---

### 5. Distance Covered Component

**File**: `src/components/PlayerDistance.tsx`

**Current Mock Data**:
```typescript
playerDistances: PlayerDistance[] = [
  { id: 1, name: 'You', distance: 2000, isMe: true },
  { id: 2, name: 'Player 2', distance: 2200 },
  { id: 3, name: 'Player 3', distance: 1800 },
  { id: 4, name: 'Player 1', distance: 1500 }
]
```

**Backend Requirements**:
- Player movement tracking
- Distance calculation (cumulative)
- Player ranking by activity level

**Suggested API Endpoint**:
```typescript
GET /api/matches/{matchId}/distance-analysis
Response: {
  players: Array<{
    playerId: number;
    playerName: string;
    totalDistance: number;    // meters
    averageSpeed: number;     // km/h
    activeTime: number;       // seconds
    courtCoverage: number;    // percentage of court covered
  }>;
}
```

**Migration Priority**: ⭐⭐ (Low complexity, similar to speed tracking)

---

### 6. Points & Errors Component

**File**: `src/components/PlayerStats.tsx`

**Current Mock Data**:
```typescript
playerStats: PlayerStats[] = [
  { id: 1, name: 'You', points: 32, errors: 8, isMe: true },
  { id: 2, name: 'Teammate (Player 2)', points: 28, errors: 11, isTeammate: true },
  { id: 3, name: 'Player 3', points: 25, errors: 13 },
  { id: 4, name: 'Player 4', points: 22, errors: 9 }
]
```

**Backend Requirements**:
- Point scoring tracking
- Error classification and counting
- Team/opponent identification

**Suggested API Endpoint**:
```typescript
GET /api/matches/{matchId}/player-stats
Response: {
  players: Array<{
    playerId: number;
    playerName: string;
    points: number;
    errors: number;
    relationship: 'self' | 'teammate' | 'opponent';
    errorBreakdown: {
      unforced: number;
      forced: number;
      netErrors: number;
      outErrors: number;
    };
  }>;
  matchScore: {
    team1: number;
    team2: number;
  };
}
```

**Migration Priority**: ⭐⭐⭐⭐ (High complexity, requires game logic and error classification)

---

### 7. Ball Map Component

**File**: `src/components/BallMap/index.tsx`, `src/components/BallMap/constants.ts`

**Current Mock Data**:
```typescript
sampleShots: Shot[] = [
  { x: 75, y: 25, type: 'forehand', result: 'interception' },
  { x: 25, y: 15, type: 'forehand', result: 'interception' },
  // ... 142 more hardcoded shot positions (percentage coordinates)
];

shotTypes: ShotType[] = [
  { id: 'forehand', label: 'Forehand' },
  { id: 'backhand', label: 'Backhand' },
  // ... more shot types
];
```

**⚠️ Major Component Refactoring Required**:

**Actual Backend Data** (from `statistics.json`):
```typescript
court_zone: {
  front_back: { net: 0.259, transition: 0.092, back: 0.649 },
  sides: { left: 0.042, middle: 0.369, right: 0.589 },
  zones: {
    net_left: 0.005, transition_left: 0.001, back_left: 0.035,
    net_middle: 0.104, transition_middle: 0.039, back_middle: 0.226,
    net_right: 0.149, transition_right: 0.052, back_right: 0.388
  }
}

shots_tracking: {
  shot_outcomes: {
    rally_server: [
      {
        rally_id: "rally15",
        shot_frame: 24236,
        player_position: { x: 1.418, y: 9.782 }, // meters, not percentages!
        shot_position: { x: NaN, y: NaN },
        outcome: {},
        accepted: false
      }
    ]
  }
}
```

**Component Changes Needed**:
1. **Coordinate System**: Convert from percentage (0-100) to meters-based coordinates
2. **Zone-based Visualization**: Replace individual shot dots with zone-based heatmaps
3. **Rally Context**: Group shots by rally_id instead of individual shot filtering
4. **Data Processing**: Transform zone percentages into visual heatmap intensities

**Suggested API Endpoints**:
```typescript
GET /api/matches/{matchId}/shots
Response: {
  shots: Array<{
    id: string;
    timestamp: string;
    playerId: number;
    position: { x: number; y: number };
    type: 'forehand' | 'backhand' | 'forehandVolley' | 'backhandVolley' | 'serve' | 'overhead';
    result: 'groundBounce' | 'interception' | 'winner' | 'error';
    speed: number;
    spin: number;
  }>;
  courtDimensions: {
    width: number;
    height: number;
    coordinateSystem: 'percentage' | 'meters';
  };
}

GET /api/matches/{matchId}/players/{playerId}/heatmap
Response: {
  playerId: number;
  positions: Array<{
    x: number;
    y: number;
    intensity: number;  // 0-100
    timestamp: string;
  }>;
  zones: {
    frontLeft: number;
    frontRight: number;
    backLeft: number;
    backRight: number;
  };
}
```

**Migration Priority**: ⭐⭐⭐⭐⭐ (Highest complexity, core feature with most data)

---

## Data Schema Definitions

### Core Types
```typescript
// Match-level data
interface Match {
  id: string;
  startTime: string;
  endTime: string;
  players: Player[];
  venue: string;
  gameType: 'padel' | 'tennis';
}

interface Player {
  id: number;
  name: string;
  team: number;  // 1 or 2
  position: 'frontLeft' | 'frontRight' | 'backLeft' | 'backRight';
}

// Shot data
interface Shot {
  id: string;
  matchId: string;
  playerId: number;
  timestamp: string;
  position: { x: number; y: number };
  type: ShotType;
  result: ShotResult;
  speed?: number;
  spin?: number;
}

type ShotType = 'forehand' | 'backhand' | 'forehandVolley' | 'backhandVolley' | 'serve' | 'overhead';
type ShotResult = 'groundBounce' | 'interception' | 'winner' | 'error';
```

## Migration Implementation Plan

### Phase 1: Data Service Layer & Backend Alignment (Week 1-2)
1. **Analyze actual backend data structure** from `statistics.json`
2. Create `src/services/api.ts` - Centralized API client
3. Create `src/hooks/useMatchData.ts` - Custom hooks for data fetching
4. **Design coordinate system conversion utilities** (meters ↔ percentages)
5. Add loading states and error handling
6. Implement caching with React Query or SWR

### Phase 2: Component Refactoring (Week 3-4)
**⚠️ Major Refactoring Phase**
1. **Distance Covered & Speed** - Adapt to use `running_distance`, `mean_velocity`, `max_velocity`
2. **Ball Map Zone System** - Complete redesign to use zone-based heatmaps instead of individual shots
3. **Coordinate Conversion** - Build utilities to convert between meters and UI coordinates
4. **Data Processing Layer** - Create functions to transform backend aggregations into UI-ready format

### Phase 3: Advanced Components (Week 5-6)
1. **Shot Analysis** - Will need significant changes if backend doesn't provide shot type classification
2. **Serves Analysis** - May need to derive serve data from shot tracking
3. **Points & Errors** - Depends on game logic being available in backend
4. **Match Summary** - Derive rally statistics from shot tracking data

### Phase 4: Data Integration & Testing (Week 7-8)
1. **Shot Data Processing** - Handle rally-based shot data with frame timing
2. **Heatmap Generation** - Convert zone percentages to visual heatmaps
3. **Error Handling** - Handle NaN values and missing shot positions
4. **Performance Testing** - Optimize for large datasets

### Phase 5: Component Polish & Fallbacks (Week 9)
1. **Missing Data Scenarios** - Handle components when certain data is unavailable
2. **Progressive Enhancement** - Show partial data while other metrics load
3. **Validation** - Ensure data integrity and handle edge cases
4. **User Experience** - Smooth transitions between different data states

## Technical Implementation Details

### API Client Setup
```typescript
// src/services/api.ts
class MatchlyticsAPI {
  private baseURL: string;
  
  async getMatchSummary(matchId: string): Promise<MatchSummary> {
    // Implementation
  }
  
  async getPlayerShotAnalysis(matchId: string, playerId: number): Promise<PlayerShotAnalysis> {
    // Implementation
  }
  
  // ... other methods
}
```

### Custom Hooks
```typescript
// src/hooks/useMatchData.ts
export function useMatchSummary(matchId: string) {
  return useQuery(['match', matchId, 'summary'], 
    () => api.getMatchSummary(matchId)
  );
}

export function usePlayerShotAnalysis(matchId: string, playerId: number) {
  return useQuery(['match', matchId, 'player', playerId, 'shots'], 
    () => api.getPlayerShotAnalysis(matchId, playerId)
  );
}
```

### Component Migration Example
```typescript
// Before (with mock data)
const ShotAnalysis: React.FC = ({ delay = 0 }) => {
  const playerData = mockPlayerData[selectedPlayer];
  // ...
};

// After (with API integration)
const ShotAnalysis: React.FC = ({ matchId, delay = 0 }) => {
  const { data: shotData, isLoading, error } = usePlayerShotAnalysis(matchId, selectedPlayer);
  
  if (isLoading) return <ShotAnalysisSkeleton />;
  if (error) return <ErrorFallback error={error} />;
  
  // ... rest of component with real data
};
```

## Success Metrics

- [ ] All 7 components successfully consuming backend data
- [ ] Loading states implemented for all API calls
- [ ] Error handling with user-friendly fallbacks
- [ ] Performance: < 2s initial load time
- [ ] Real-time data updates working (if applicable)
- [ ] Type safety maintained throughout migration
- [ ] Mock data completely removed from codebase

## Risk Mitigation

1. **Data Structure Mismatches**: Backend data differs significantly from mock data structure
   - **Mitigation**: Build robust data transformation layer and adapters
   - **Timeline Impact**: Extended refactoring phase (additional 2-3 weeks)

2. **Missing Component Data**: Some UI components may not have corresponding backend data
   - **Mitigation**: Identify gaps early, design fallback UI states, collaborate with backend team
   - **Example**: If shot type classification unavailable, simplify Shot Analysis component

3. **Coordinate System Complexity**: Backend uses meters, UI uses percentages
   - **Mitigation**: Create reliable conversion utilities with court dimension constants
   - **Testing**: Extensive coordinate mapping validation

4. **Performance with Real Data**: Actual datasets may be much larger than 144 mock shots
   - **Mitigation**: Implement data pagination, virtualization, and smart caching
   - **Monitoring**: Track component render times with real data volumes

5. **NaN and Missing Data**: Backend contains NaN values and incomplete shot positions
   - **Mitigation**: Robust null checking, data validation, and graceful degradation
   - **UX**: Clear indicators when data is incomplete or processing

6. **Rally-based Data Complexity**: Shot data organized by rallies with frame timing
   - **Mitigation**: Build rally processing utilities, consider temporal visualization features

---

*This document should be updated as the backend API evolves and new requirements emerge.*