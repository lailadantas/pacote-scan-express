
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Package3DProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  animated?: boolean;
}

const Package3D = ({ position, scale = 1, color = '#8B5CF6', animated = true }: Package3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} scale={scale} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, 0, scale * 0.51]}
        fontSize={scale * 0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        📦
      </Text>
    </group>
  );
};

export default Package3D;
