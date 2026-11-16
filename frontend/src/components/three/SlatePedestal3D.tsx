import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createSlatePedestalTexture } from './textureGenerator';

interface SlatePedestal3DProps {
  radius?: number;
  height?: number;
  position?: [number, number, number];
}

export const SlatePedestal3D: React.FC<SlatePedestal3DProps> = ({
  radius = 2.4,
  height = 0.22,
  position = [0, -1.25, 0],
}) => {
  const slateTexture = useMemo(() => createSlatePedestalTexture(), []);

  const geometry = useMemo(() => {
    // Chamfered cylinder for natural stone slab look
    return new THREE.CylinderGeometry(radius, radius * 1.05, height, 48, 1);
  }, [radius, height]);

  return (
    <group position={position}>
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          map={slateTexture}
          roughness={0.78}
          metalness={0.12}
          color="#222022"
        />
      </mesh>
    </group>
  );
};

export default SlatePedestal3D;
