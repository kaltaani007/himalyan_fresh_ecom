import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AppleModel3D, AppleVariety } from './AppleModel3D';

interface FloatingApplesProps {
  variety?: AppleVariety;
  scale?: number;
  className?: string;
}

export const FloatingApples: React.FC<FloatingApplesProps> = ({
  variety = 'royal-red',
  scale = 1,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full aspect-square overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0.2, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} color="#ffffff" />
          <directionalLight position={[3, 5, 3]} intensity={1.5} color="#fff6e8" />
          <directionalLight position={[-3, 1, -2]} intensity={0.6} color="#a6d5b0" />
          <AppleModel3D
            variety={variety}
            scale={scale * 1.15}
            isHovered={isHovered}
            rotationSpeed={isHovered ? 0.02 : 0.007}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FloatingApples;
