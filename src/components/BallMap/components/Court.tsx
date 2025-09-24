// components/Court.tsx
import React, { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';
import { CourtProps } from '../types';
import { getOverlayColor, generateHeatmapPoints } from '../utils';

const Court: React.FC<CourtProps> = ({
  shots,
  displayMode,
  isTransitioning,
  animatedShots,
  isFilterTransitioning,
  heatmapView,
  heatmapData,
}) => {
  const heatmapContainerRef = useRef<HTMLDivElement>(null);
  const heatmapInstanceRef = useRef<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('Court component mounted');
    if (svgRef.current) {
      console.log('SVG element dimensions:', svgRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Always clean up previous instance first
    if (heatmapInstanceRef.current) {
      heatmapInstanceRef.current = null;
      if (heatmapContainerRef.current) {
        heatmapContainerRef.current.innerHTML = '';
      }
    }

    if (
      heatmapView === 'heatmap' &&
      displayMode === 'playerPosition' &&
      heatmapContainerRef.current &&
      svgRef.current
    ) {

      // Wait for container to be properly sized
      timeoutRef.current = setTimeout(() => {
        // Double-check cleanup before creating new instance
        if (heatmapInstanceRef.current) {
          heatmapInstanceRef.current = null;
        }
        if (heatmapContainerRef.current) {
          heatmapContainerRef.current.innerHTML = '';
        }
        // Create heatmap instance
        if (heatmapContainerRef.current) {
          const config = {
            container: heatmapContainerRef.current,
            radius: 30,
            maxOpacity: 0.95,
            minOpacity: 0.1,
            blur: 0.85,
            gradient: {
              '0.0': 'rgb(0, 0, 255)',
              '0.2': 'rgb(0, 255, 255)',
              '0.4': 'rgb(0, 255, 0)',
              '0.6': 'rgb(255, 255, 0)',
              '0.8': 'rgb(255, 136, 0)',
              '1.0': 'rgb(255, 0, 0)',
            },
          };

          heatmapInstanceRef.current = h337.create(config);

          // Generate and set data - use real data if available
          const containerWidth = heatmapContainerRef.current!.offsetWidth;
          const containerHeight = heatmapContainerRef.current!.offsetHeight;
          
          let dataPoints;
          
          // Check if we have real heatmap grid data
          if (heatmapData && typeof heatmapData === 'object' && 'data' in heatmapData) {
            // Use real heatmap grid data
            const gridData = heatmapData as any; // Cast to avoid type issues
            dataPoints = [];
            
            // Convert 2D grid to points
            for (let i = 0; i < gridData.data.length; i++) {
              for (let j = 0; j < gridData.data[i].length; j++) {
                const intensity = gridData.data[i][j];
                if (intensity > 0) {
                  // Calculate grid center coordinates in meters
                  const backendX = gridData.x_edges[j] + (gridData.x_edges[j + 1] - gridData.x_edges[j]) / 2;
                  let backendY = gridData.y_edges[i] + (gridData.y_edges[i + 1] - gridData.y_edges[i]) / 2;
                  
                  // Handle mirroring if specified
                  if (gridData.mirror_negative_y) {
                    backendY = 10 - backendY; // Assuming 10 is max Y
                  }

                  // Transform to frontend coordinates: Backend[-5,5] -> Frontend[10,90], Backend[0,10] -> Frontend[0,75]
                  const frontendX = ((backendX + 5) / 10) * 80 + 10;
                  const frontendY = (backendY / 10) * 75;
                  
                  // Convert to pixel coordinates within container
                  const pixelX = ((frontendX - 10) / 80) * containerWidth;
                  // Invert Y coordinate for proper display (SVG Y=0 is top, but court Y=0 should be net)
                  const pixelY = containerHeight - (frontendY / 75) * containerHeight;
                  
                  dataPoints.push({
                    x: Math.round(pixelX),
                    y: Math.round(pixelY),
                    value: Math.round(intensity * 100) // Convert 0-1 to 0-100
                  });
                }
              }
            }
          } else {
            // Fallback to mock data
            const points = generateHeatmapPoints();
            dataPoints = points.map((point) => ({
              x: Math.round(((point.x - 10) / 80) * containerWidth),
              y: Math.round((point.y / 75) * containerHeight),
              value: point.value,
            }));
          }

          const data = {
            max: 100,
            min: 0,
            data: dataPoints,
          };

          heatmapInstanceRef.current.setData(data);
        }
      }, 100);
    }

    return () => {
      // Cleanup on unmount or dependency change
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (heatmapInstanceRef.current) {
        heatmapInstanceRef.current = null;
      }
      if (heatmapContainerRef.current) {
        heatmapContainerRef.current.innerHTML = '';
      }
    };
  }, [heatmapView, displayMode, heatmapData]);

  const renderHeatmapOverlays = () => {
    // Handle case where heatmapData might be a grid (for continuous heatmap)
    if (!Array.isArray(heatmapData)) {
      return null;
    }

    if (heatmapView === 'zones') {
      return (
        <g>
          {/* Net zones (first row: 4m height) */}
          <rect
            x="10"
            y="0"
            width="24"
            height="30"
            fill={getOverlayColor(heatmapData[0]?.value || 0)}
          />
          <rect
            x="34"
            y="0"
            width="32"
            height="30"
            fill={getOverlayColor(heatmapData[1]?.value || 0)}
          />
          <rect
            x="66"
            y="0"
            width="24"
            height="30"
            fill={getOverlayColor(heatmapData[2]?.value || 0)}
          />

          {/* Transition zones (middle row: 2m height) */}
          <rect
            x="10"
            y="30"
            width="24"
            height="15"
            fill={getOverlayColor(heatmapData[3]?.value || 0)}
          />
          <rect
            x="34"
            y="30"
            width="32"
            height="15"
            fill={getOverlayColor(heatmapData[4]?.value || 0)}
          />
          <rect
            x="66"
            y="30"
            width="24"
            height="15"
            fill={getOverlayColor(heatmapData[5]?.value || 0)}
          />

          {/* Back zones (bottom row: 4m height) */}
          <rect
            x="10"
            y="45"
            width="24"
            height="30"
            fill={getOverlayColor(heatmapData[6]?.value || 0)}
          />
          <rect
            x="34"
            y="45"
            width="32"
            height="30"
            fill={getOverlayColor(heatmapData[7]?.value || 0)}
          />
          <rect
            x="66"
            y="45"
            width="24"
            height="30"
            fill={getOverlayColor(heatmapData[8]?.value || 0)}
          />
        </g>
      );
    }

    if (heatmapView === 'sides') {
      return (
        <g>
          {/* Left Side (3m width) */}
          <rect
            x="10"
            y="0"
            width="24"
            height="75"
            fill={getOverlayColor(heatmapData[0]?.value || 0)}
          />

          {/* Middle Side (4m width) */}
          <rect
            x="34"
            y="0"
            width="32"
            height="75"
            fill={getOverlayColor(heatmapData[1]?.value || 0)}
          />

          {/* Right Side (3m width) */}
          <rect
            x="66"
            y="0"
            width="24"
            height="75"
            fill={getOverlayColor(heatmapData[2]?.value || 0)}
          />
        </g>
      );
    }

    if (heatmapView === 'front-back') {
      return (
        <g>
          {/* Net zone (4m height) */}
          <rect
            x="10"
            y="0"
            width="80"
            height="30"
            fill={getOverlayColor(heatmapData[0]?.value || 0)}
          />

          {/* Transition zone (2m height) */}
          <rect
            x="10"
            y="30"
            width="80"
            height="15"
            fill={getOverlayColor(heatmapData[1]?.value || 0)}
          />

          {/* Back zone (4m height) */}
          <rect
            x="10"
            y="45"
            width="80"
            height="30"
            fill={getOverlayColor(heatmapData[2]?.value || 0)}
          />
        </g>
      );
    }

    return null;
  };

  const renderHeatmapLabels = () => {
    // Handle case where heatmapData might be a grid (for continuous heatmap)
    if (!Array.isArray(heatmapData)) {
      return null;
    }

    if (heatmapView === 'zones') {
      return (
        <g>
          {/* Percentage badges */}
          {heatmapData.map((data, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;

            // Proportional column centers: Left(3m)=22, Center(4m)=50, Right(3m)=78
            const xPositions = [22, 50, 78];
            // Proportional row centers: Net(4m)=15, Transition(2m)=37.5, Back(4m)=60
            const yPositions = [15, 37.5, 60];

            const x = xPositions[col];
            const y = yPositions[row];

            return (
              <text
                key={index}
                x={x + 1}
                y={y + 2}
                textAnchor="middle"
                fontSize="5"
                fill="rgb(255, 255, 255)"
                stroke="rgb(0, 0, 0)"
                strokeWidth="0.3"
                paintOrder="stroke"
                fontWeight="600"
              >
                {data.value}%
              </text>
            );
          })}
        </g>
      );
    }

    if (heatmapView === 'sides') {
      return (
        <g>
          {/* Percentage badges */}
          {heatmapData.map((data, index) => {
            // Proportional column centers: Left(3m)=22, Center(4m)=50, Right(3m)=78
            const xPositions = [22, 50, 78];
            const x = xPositions[index];
            const y = 37.5;
            return (
              <text
                key={index}
                x={x + 1}
                y={y + 1}
                textAnchor="middle"
                fontSize="5"
                fill="rgb(255, 255, 255)"
                stroke="rgb(0, 0, 0)"
                strokeWidth="0.3"
                paintOrder="stroke"
                fontWeight="600"
              >
                {data.value}%
              </text>
            );
          })}
        </g>
      );
    }

    if (heatmapView === 'front-back') {
      return (
        <g>
          {/* Percentage badges */}
          {heatmapData.map((data, index) => {
            const x = 70;
            // Proportional row centers: Net(4m)=15, Transition(2m)=37.5, Back(4m)=60
            const yPositions = [15, 37.5, 60];
            const y = yPositions[index];
            return (
              <text
                key={index}
                x={x + 1}
                y={y + 2}
                textAnchor="middle"
                fontSize="5"
                fill="rgb(255, 255, 255)"
                stroke="rgb(0, 0, 0)"
                strokeWidth="0.3"
                paintOrder="stroke"
                fontWeight="600"
              >
                {data.value}%
              </text>
            );
          })}
        </g>
      );
    }

    return null;
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-slate-600 p-8">
      {/* SVG Container with aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: '100 / 85' }}>
        {/* Heatmap container */}
        <div
          ref={heatmapContainerRef}
          className={`absolute ${
            heatmapView === 'heatmap' &&
            displayMode === 'playerPosition' &&
            !isTransitioning
              ? 'opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
          style={{
            left: '10%',
            width: '80%',
            top: '0%',
            height: '88.235%',
            WebkitTransition: 'opacity 0.5s',
            transition: 'opacity 0.5s',
            opacity:
              heatmapView === 'heatmap' &&
              displayMode === 'playerPosition' &&
              !isTransitioning
                ? 1
                : 0,
          }}
        />

        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 85"
          width="100%"
          height="100%"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Court background */}
          <rect
            x="0"
            y="0"
            width="100"
            height="85"
            fill="rgb(69, 85, 108)"
            className={
              heatmapView === 'heatmap' && displayMode === 'playerPosition'
                ? 'opacity-0'
                : 'opacity-100'
            }
          />

          {/* Center service line */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="55"
            stroke="rgb(255, 255, 255)"
            strokeWidth="1"
          />

          {/* Service line */}
          <line
            x1="10"
            y1="55"
            x2="90"
            y2="55"
            stroke="rgb(255, 255, 255)"
            strokeWidth="1"
          />

          {/* Court outline (half court) - open at top */}
          <path
            d="M 10 0 L 10 75 L 90 75 L 90 0"
            fill="none"
            stroke="rgb(255, 255, 255)"
            strokeWidth="2"
          />

          {/* Net at the top */}
          <line
            x1="11"
            y1="0"
            x2="89"
            y2="0"
            stroke="rgb(255, 255, 255)"
            strokeWidth="2"
            strokeDasharray="2,2"
          />

          {/* Heatmap overlays */}
          <g
            className={
              displayMode === 'playerPosition' &&
              !isTransitioning &&
              heatmapView !== 'heatmap'
                ? 'opacity-100'
                : 'opacity-0'
            }
          >
            {renderHeatmapOverlays()}
          </g>

          {/* Shots - only show when in ball hits mode */}
          <g
            className={
              displayMode === 'ballHits' && !isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }
          >
            {shots.map((shot) => (
              <g
                key={`${shot.x}-${shot.y}-${shot.type}-${shot.result}`}
                className={
                  animatedShots &&
                  displayMode === 'ballHits' &&
                  !isFilterTransitioning
                    ? 'opacity-100'
                    : 'opacity-0'
                }
              >
                {shot.result === 'groundBounce' ? (
                  <circle
                    cx={shot.x}
                    cy={shot.y}
                    r="1.5"
                    fill="none"
                    stroke="rgb(14, 165, 233)"
                    strokeWidth="1"
                  />
                ) : (
                  <g>
                    <path
                      d={`M ${shot.x - 1} ${shot.y - 1} L ${shot.x + 1} ${
                        shot.y + 1
                      } M ${shot.x - 1} ${shot.y + 1} L ${shot.x + 1} ${
                        shot.y - 1
                      }`}
                      stroke="rgb(249, 115, 22)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            ))}
          </g>

          {/* Heatmap text labels - moved to the end so they appear on top */}
          <g
            className={
              displayMode === 'playerPosition' &&
              !isTransitioning &&
              heatmapView !== 'heatmap'
                ? 'opacity-100'
                : 'opacity-0'
            }
          >
            {renderHeatmapLabels()}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Court;
