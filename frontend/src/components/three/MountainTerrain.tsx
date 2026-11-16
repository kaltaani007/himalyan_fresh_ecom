import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TerrainMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate low-poly mountain ridge heightmap
  const geometry = useMemo(() => {
    const width = 60;
    const height = 30;
    const segmentsX = 45;
    const segmentsY = 25;
    const geo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Procedural mountain peak formula
      const distFromCenter = Math.abs(x) / (width / 2);
      const peak1 = Math.sin(x * 0.25) * Math.cos(y * 0.3) * 4.5;
      const peak2 = Math.sin(x * 0.6 + 1.2) * 2.2;
      const peak3 = Math.cos(y * 0.5) * 1.5;

      const z = (peak1 + peak2 + peak3) * (1 - distFromCenter * 0.4) + Math.random() * 0.2;
      pos.setZ(i, Math.max(0, z));
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.02;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2.3, 0, 0]}
      position={[0, -5, -8]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#15281c"
        roughness={0.85}
        metalness={0.1}
        wireframe={false}
        flatShading
      />
    </mesh>
  );
};

export const MountainTerrain: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none opacity-40 ${className}`}>
      <Canvas
        camera={{ position: [0, 6, 16], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} color="#a6c8b0" />
        <directionalLight position={[10, 15, 10]} intensity={1.2} color="#f5dfb8" />
        <pointLight position={[-10, 8, -5]} intensity={0.8} color="#439162" />
        <fog attach="fog" args={['#0f1a12', 12, 32]} />
        <TerrainMesh />
      </Canvas>
    </div>
  );
};

export default MountainTerrain;
