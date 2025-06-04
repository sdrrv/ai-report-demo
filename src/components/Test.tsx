import { Canvas } from '@react-three/fiber';

function Box() {
  return (
    <mesh rotation={[90, 0, 20]}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Test() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box />
    </Canvas>
  );
}
