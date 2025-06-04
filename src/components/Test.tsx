import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  OrbitControls,
  useProgress,
  Html,
  Trail,
  Line,
} from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface Shot {
  start: [number, number, number];
  end: [number, number, number];
  height: number;
  speed: number;
}

type ShotType = 'forehand' | 'backhand' | 'serve' | 'lob';

interface TennisBallProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  height?: number;
  duration?: number;
  onComplete?: () => void;
}

interface TrajectoryLineProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  height?: number;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="rounded bg-black bg-opacity-70 px-4 py-2 text-lg font-semibold text-white">
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

function FieldModel() {
  const gltf = useGLTF('/ai-report-demo/models/field.glb');
  return <primitive object={gltf.scene} />;
}

function TennisBall({
  startPosition,
  endPosition,
  height = 3,
  duration = 2,
  onComplete,
}: TennisBallProps) {
  const ballRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useFrame((_, delta) => {
    if (!isPlaying || !ballRef.current) return;

    const newProgress = Math.min(progress + delta / duration, 1);
    setProgress(newProgress);

    const t = newProgress;

    const x = startPosition[0] + (endPosition[0] - startPosition[0]) * t;
    const z = startPosition[2] + (endPosition[2] - startPosition[2]) * t;

    const baseY = startPosition[1] + (endPosition[1] - startPosition[1]) * t;
    const arcY = height * 4 * t * (1 - t);
    const y = baseY + arcY;

    ballRef.current.position.set(x, y, z);
    ballRef.current.rotation.x += delta * 8;
    ballRef.current.rotation.z += delta * 5;

    if (newProgress >= 1) {
      setIsPlaying(false);
      if (onComplete) onComplete();
    }
  });

  return (
    <Trail
      width={0.02}
      length={30}
      decay={1}
      attenuation={(t) => t * t}
      color="#ccff00"
    >
      <mesh ref={ballRef} position={startPosition} castShadow>
        <sphereGeometry args={[0.012, 16, 8]} />
        <meshStandardMaterial
          color="#ccff00"
          emissive="#ccff00"
          emissiveIntensity={0.5}
          roughness={0.7}
        />
      </mesh>
    </Trail>
  );
}

function TrajectoryLine({
  startPosition,
  endPosition,
  height = 3,
}: TrajectoryLineProps) {
  const points = [];
  const numPoints = 50;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    const x = startPosition[0] + (endPosition[0] - startPosition[0]) * t;
    const z = startPosition[2] + (endPosition[2] - startPosition[2]) * t;

    const baseY = startPosition[1] + (endPosition[1] - startPosition[1]) * t;
    const arcY = height * 4 * t * (1 - t);
    const y = baseY + arcY;

    points.push(new THREE.Vector3(x, y, z));
  }

  return <Line points={points} color="#ffff00" opacity={0.3} transparent />;
}

export default function TennisTrajectoryDemo() {
  const [showBall, setShowBall] = useState(true);
  const [shotType, setShotType] = useState<ShotType>('forehand');
  const [animationComplete, setAnimationComplete] = useState(false);

  const shots: Record<ShotType, Shot> = {
    forehand: {
      start: [-2, 0.3, 0],
      end: [1.8, 0.4, -0.8],
      height: 0.8,
      speed: 6,
    },
    backhand: {
      start: [-2, 0.3, 0.8],
      end: [1.8, 0.4, 0.5],
      height: 1,
      speed: 5,
    },
    serve: {
      start: [-2.5, 0.6, 0],
      end: [1.5, 0.4, -1],
      height: 0.4,
      speed: 8,
    },
    lob: {
      start: [-1.5, 0.3, 0],
      end: [2, 0.4, 0],
      height: 1.5,
      speed: 3,
    },
  };

  const currentShot = shots[shotType];

  useEffect(() => {
    setAnimationComplete(false);
  }, [shotType]);

  const handleReplay = () => {
    setAnimationComplete(false);
    setShowBall(false);
    setTimeout(() => setShowBall(true), 100);
  };

  const calculateDistance = (
    start: [number, number, number],
    end: [number, number, number],
  ) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const distance = calculateDistance(currentShot.start, currentShot.end);
  const duration = distance / currentShot.speed;

  return (
    <div className="h-screen bg-gray-100">
      <div className="absolute left-4 top-4 z-10 rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-3 text-xl font-bold">Ball Trajectory Demo</h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Shot Type</label>
            <select
              value={shotType}
              onChange={(e) => setShotType(e.target.value as ShotType)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="forehand">Forehand</option>
              <option value="backhand">Backhand</option>
              <option value="serve">Serve</option>
              <option value="lob">Lob</option>
            </select>
          </div>

          <button
            onClick={handleReplay}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Replay Shot
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-600">
          <p>• Drag to rotate view</p>
          <p>• Scroll to zoom</p>
          <p>• Right-click to pan</p>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 4, 8], fov: 60 }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1e293b');
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 2]} intensity={0.8} castShadow />
        <pointLight position={[-3, 3, -2]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />

        <Suspense fallback={<Loader />}>
          <FieldModel />

          {animationComplete && (
            <TrajectoryLine
              startPosition={currentShot.start}
              endPosition={currentShot.end}
              height={currentShot.height}
            />
          )}

          {showBall && (
            <TennisBall
              key={shotType}
              startPosition={currentShot.start}
              endPosition={currentShot.end}
              height={currentShot.height}
              duration={duration}
              onComplete={() => setAnimationComplete(true)}
            />
          )}
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
