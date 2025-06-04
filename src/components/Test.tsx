import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, useProgress, Html } from '@react-three/drei';
import { Suspense } from 'react';

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

export default function Test() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-lg">
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={<Loader />}>
            <FieldModel />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
