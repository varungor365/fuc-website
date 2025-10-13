'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

interface Scene3DProps {
  children: ReactNode;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  controls?: boolean;
  environment?: string | null;
  shadows?: boolean;
  className?: string;
  background?: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
}

const Scene3D = ({
  children,
  camera = { position: [0, 0, 5], fov: 75 },
  controls = true,
  environment = null,
  shadows = true,
  className = '',
  background = 'transparent',
  fog
}: Scene3DProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows={shadows}
        style={{ background }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={camera.position}
          fov={camera.fov}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow={shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment */}
        {environment && (
          <Environment preset={environment as any} />
        )}

        {/* Fog */}
        {fog && (
          <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
        )}

        {/* Controls */}
        {controls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}

        {/* Scene Content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;