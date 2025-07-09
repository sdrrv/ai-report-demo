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

  useEffect(() => {
    console.log('Court component mounted');
    if (svgRef.current) {
      console.log('SVG element dimensions:', svgRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (
      heatmapView === 'heatmap' &&
      displayMode === 'playerPosition' &&
      heatmapContainerRef.current &&
      svgRef.current
    ) {
      // Clean up previous instance
      if (heatmapInstanceRef.current) {
        heatmapInstanceRef.current = null;
        if (heatmapContainerRef.current) {
          heatmapContainerRef.current.innerHTML = '';
        }
      }

      // Wait for container to be properly sized
      setTimeout(() => {
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

          // Generate and set data
          const points = generateHeatmapPoints();
          const containerWidth = heatmapContainerRef.current!.offsetWidth;
          const containerHeight = heatmapContainerRef.current!.offsetHeight;

          const data = {
            max: 100,
            min: 0,
            data: points.map((point) => ({
              // Transform from court coordinates (10-90, 0-75) to pixel coordinates
              //Doing the maths hehehehheehhe
              x: Math.round(((point.x - 10) / 80) * containerWidth),
              y: Math.round((point.y / 75) * containerHeight),
              value: point.value,
            })),
          };

          heatmapInstanceRef.current.setData(data);
        }
      }, 100);
    }

    return () => {
      if (heatmapInstanceRef.current) {
        heatmapInstanceRef.current = null;
      }
    };
  }, [heatmapView, displayMode]);

  const renderHeatmapOverlays = () => {
    if (heatmapView === 'zones') {
      return (
        <g>
          {/* Net zones (first row) */}
          <rect
            x="10"
            y="0"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[0].value)}
          />
          <rect
            x="36.67"
            y="0"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[1].value)}
          />
          <rect
            x="63.33"
            y="0"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[2].value)}
          />

          {/* Transition zones (middle row) */}
          <rect
            x="10"
            y="25"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[3].value)}
          />
          <rect
            x="36.67"
            y="25"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[4].value)}
          />
          <rect
            x="63.33"
            y="25"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[5].value)}
          />

          {/* Back zones (bottom row) */}
          <rect
            x="10"
            y="50"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[6].value)}
          />
          <rect
            x="36.67"
            y="50"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[7].value)}
          />
          <rect
            x="63.33"
            y="50"
            width="26.67"
            height="25"
            fill={getOverlayColor(heatmapData[8].value)}
          />
        </g>
      );
    }

    if (heatmapView === 'sides') {
      return (
        <g>
          {/* Left Side */}
          <rect
            x="10"
            y="0"
            width="26.67"
            height="75"
            fill={getOverlayColor(heatmapData[0].value)}
          />

          {/* Middle Side */}
          <rect
            x="36.67"
            y="0"
            width="26.67"
            height="75"
            fill={getOverlayColor(heatmapData[1].value)}
          />

          {/* Right Side */}
          <rect
            x="63.33"
            y="0"
            width="26.67"
            height="75"
            fill={getOverlayColor(heatmapData[2].value)}
          />
        </g>
      );
    }

    if (heatmapView === 'front-back') {
      return (
        <g>
          {/* Front (Net area) */}
          <rect
            x="10"
            y="0"
            width="80"
            height="37.5"
            fill={getOverlayColor(heatmapData[0].value)}
          />

          {/* Back */}
          <rect
            x="10"
            y="37.5"
            width="80"
            height="37.5"
            fill={getOverlayColor(heatmapData[1].value)}
          />
        </g>
      );
    }

    return null;
  };

  const renderHeatmapLabels = () => {
    if (heatmapView === 'zones') {
      return (
        <g>
          {/* Percentage badges */}
          {heatmapData.map((data, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = 23.33 + col * 26.67;
            const y = 12.5 + row * 25;
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
            const x = 23.33 + index * 26.67;
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
            const y = 18.75 + index * 37.5;
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
