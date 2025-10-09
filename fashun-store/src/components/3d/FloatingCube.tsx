'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface FloatingCubeProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
  rotationSpeed?: number;
  floatAmplitude?: number;
  floatSpeed?: number;
}

const FloatingCube = ({
  position = [0, 0, 0],
  color = '#8b5cf6',
  size = 1,
  rotationSpeed = 1,
  floatAmplitude = 0.5,
  floatSpeed = 1
}: FloatingCubeProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotation
    meshRef.current.rotation.x = time * rotationSpeed;
    meshRef.current.rotation.y = time * rotationSpeed * 0.7;
    
    // Floating motion
    meshRef.current.position.y = position[1] + Math.sin(time * floatSpeed) * floatAmplitude;
    meshRef.current.position.x = position[0] + Math.cos(time * floatSpeed * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export default FloatingCube;