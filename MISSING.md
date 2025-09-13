# Missing Data & Component Gap Analysis

This document details the gaps between what each AI Report component needs and what the backend (`statistics.json`) currently provides.

## Legend
- ✅ **Available** - Data exists in backend
- ❌ **Missing** - Data completely absent from backend
- 🟡 **Needs Conversion** - Data exists but in different format
- 🟢 **Ready** - Component can work with minor changes
- 🔴 **Blocked** - Component cannot function without backend changes

---

## Component Analysis

### 1️⃣ **Match Summary Component**

**Status: 🔴 BLOCKED**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| Time in play (minutes) | `timeInPlay: 42` | `total_game_time: 2655.08` (seconds) | 🟡 Needs conversion |
| Average rally (shots) | `averageRally: 6.3` | `average_number_shots: 0.0` | ❌ **MISSING** |
| Longest rally (shots) | `longestRally: 24` | No shot count tracking | ❌ **MISSING** |

**Critical Gaps:**
- 🔴 **No shot counting system** - Backend tracks rally duration but not shot counts
- 🔴 **Cannot show shots per rally** - Core component functionality broken

---

### 2️⃣ **Shot Analysis Component**

**Status: 🔴 BLOCKED**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| Offensive/Defensive % | `offensive: 65, defensive: 35` | No classification | ❌ **MISSING** |
| Shot distribution | `rightShots: 35, centerShots: 40, leftShots: 25` | Court zones available | 🟡 Has player zones |
| Shot types | `Forehand: 64%, Backhand: 14%, Smash: 12%` | No shot classification | ❌ **MISSING** |
| Attack/Defense breakdown | Detailed percentages by type | No shot analysis | ❌ **MISSING** |

**Critical Gaps:**
- 🔴 **No shot type classification** (Forehand/Backhand/Smash/Volley)
- 🔴 **No offensive/defensive categorization** 
- 🔴 **No ML/AI shot analysis system**

---

### 3️⃣ **Serves Analysis Component**

**Status: 🔴 BLOCKED**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| First serve success | `firstServeSuccess: 81%` | No serve tracking | ❌ **MISSING** |
| Average serve speed | `avgServeSpeed: 57` km/h | No speed per shot | ❌ **MISSING** |
| Serve placement | `serveToCenter: 47%, serveToBody: 9%, serveToWall: 44%` | No placement data | ❌ **MISSING** |
| Return types | `lowStrokeReturn: 70%, lobReturn: 30%` | No return classification | ❌ **MISSING** |
| Who served | Player selection | `rally_server: 1` | ✅ Available |

**Critical Gaps:**
- 🔴 **Serves not differentiated** from regular shots
- 🔴 **No serve success/failure tracking**
- 🔴 **No serve-specific metrics** (speed, placement, returns)

---

### 4️⃣ **Running Speed Component**

**Status: 🟢 READY**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| Max speed | `speed: 28.5` km/h | `max_velocity: 16.0` km/h | ✅ Available |
| Average speed | `avgSpeed: 22.3` km/h | `mean_velocity: 4.6` km/h | ✅ Available |
| Player names | "You", "Player 2", etc. | player1, player2, etc. | 🟡 Needs mapping |

**Minor Gaps:**
- 🟡 **Player identification** - Need to map player1-4 to user-friendly names
- Component is otherwise **fully functional**

---

### 5️⃣ **Distance Covered Component**

**Status: 🟢 READY**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| Distance covered | `distance: 2000` meters | `running_distance: 1519.27` meters | ✅ Available |
| Player names | "You", "Player 2", etc. | player1, player2, etc. | 🟡 Needs mapping |

**Minor Gaps:**
- 🟡 **Player identification** - Need to map player1-4 to user-friendly names
- Component is otherwise **fully functional**

---

### 6️⃣ **Points & Errors Component**

**Status: 🔴 BLOCKED**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| Points won | `points: 32` per player | No scoring data | ❌ **MISSING** |
| Errors made | `errors: 8` per player | No error tracking | ❌ **MISSING** |
| Team relationships | isMe, isTeammate flags | No team data | ❌ **MISSING** |
| Match score | Team totals | No game scoring | ❌ **MISSING** |

**Critical Gaps:**
- 🔴 **No game scoring system** - No points, winners, errors tracked
- 🔴 **No shot outcome classification** - `outcome: {}` always empty
- 🔴 **No team/opponent identification**

---

### 7️⃣ **Ball Map Component**

**Status: 🔴 BLOCKED (Major Redesign Needed)**

| Required Data | Mock Data | Backend Data | Status |
|---------------|-----------|--------------|--------|
| Ball positions | `{x: 75, y: 25}` (0-100%) | `{x: "NaN", y: "NaN"}` | ❌ **MISSING** |
| Shot types | `type: 'forehand'` | No classification | ❌ **MISSING** |
| Shot results | `result: 'interception'` | No result tracking | ❌ **MISSING** |
| Player positions | Not used | `{x: 1.418, y: 9.782}` meters | ✅ Available |
| Heatmap data | Not used | 20x20 grid available | ✅ Available |
| Court zones | Not used | 9-zone percentages | ✅ Available |

**Critical Gaps & Changes Needed:**
- 🔴 **No ball tracking** - Only player positions available
- 🔴 **Coordinate system mismatch** - Meters vs percentages
- 🔴 **Complete visualization redesign** - From shot dots to heatmap zones
- 🟡 **Court dimensions** - 10m × 20m needs conversion

---

## Summary by Priority

### 🟢 **Ready to Implement (2/7 components)**
- **Running Speed** - Minor player mapping needed
- **Distance Covered** - Minor player mapping needed

### 🔴 **Blocked - Backend Changes Required (5/7 components)**

#### High Priority Backend Features Needed:
1. **Shot Classification System**
   - Forehand/Backhand/Smash/Volley/Overhead detection
   - Offensive/Defensive categorization
   - Required for: Shot Analysis, Ball Map, Serves Analysis

2. **Shot Counting**
   - Count shots per rally
   - Track rally shot sequences
   - Required for: Match Summary

3. **Game Scoring System**
   - Points won/lost tracking
   - Error classification (unforced, forced, net, out)
   - Winner/error determination
   - Required for: Points & Errors

4. **Ball Position Tracking**
   - X,Y coordinates where ball lands
   - Currently all `"NaN"` values
   - Required for: Ball Map individual shots

5. **Serve Differentiation**
   - Identify serves vs regular shots
   - Serve speed, placement, success tracking
   - Required for: Serves Analysis

#### Medium Priority:
6. **Player Name Mapping**
   - Map player1-4 to user-friendly names
   - Team/opponent relationships

## Implementation Strategy

### Phase 1: Quick Wins (Week 1)
- ✅ **Running Speed** component
- ✅ **Distance Covered** component
- Implement player name mapping

### Phase 2: Major Backend Work (Weeks 2-6)
- 🔴 Implement shot classification ML system
- 🔴 Add shot counting to rally processing  
- 🔴 Build game scoring logic
- 🔴 Add ball position tracking

### Phase 3: Component Redesigns (Weeks 4-8)
- 🔴 Redesign Ball Map for heatmap visualization
- 🔴 Adapt remaining components to new data structure

### Phase 4: Advanced Features (Weeks 6-10)
- 🔴 Serve-specific analytics
- 🔴 Advanced shot outcome classification
- Polish and optimization

## Risk Assessment

**High Risk:**
- 🔴 **71% of components blocked** - Only 2/7 can work with current data
- 🔴 **Core ML features missing** - No shot classification system
- 🔴 **Major backend architecture changes** needed for scoring

**Medium Risk:**
- 🟡 **Coordinate system conversion** complexity
- 🟡 **UI/UX changes** for unsupported features

**Timeline Impact:**
- **+4-6 weeks** for backend ML/classification system
- **+2-3 weeks** for component redesigns
- **Original 9-week estimate unrealistic** - needs 12-15 weeks

---

*Last updated: Based on statistics.json analysis*