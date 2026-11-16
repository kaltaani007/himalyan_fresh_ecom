import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppleVariety } from './AppleModel3D';
import {
  createAppleSkinTexture,
  createAppleBumpTexture,
  createAppleSliceFaceTexture,
} from './textureGenerator';

interface AppleSlice3DProps {
  variety?: AppleVariety;
  scale?: number;
  interactive?: boolean;
  isHovered?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const AppleSlice3D: React.FC<AppleSlice3DProps> = ({
  variety = 'royal-red',
  scale = 1,
  interactive = false,
  isHovered = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate calibrated PBR textures
  const skinTexture = useMemo(() => createAppleSkinTexture(variety), [variety]);
  const bumpTexture = useMemo(() => createAppleBumpTexture(), []);
  const sliceFleshTexture = useMemo(() => createAppleSliceFaceTexture(), []);

  // Geometry: Realistic 75-degree crisp apple wedge matching showcase image
  const { skinGeometry, faceGeometry, phiLength } = useMemo(() => {
    const phi = Math.PI / 2.4; // ~75 degrees wedge
    const points: THREE.Vector2[] = [];
    const segments = 32;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI;

      // Realistic apple profile matching the main apple
      let r = Math.sin(angle) * (1.18 - 0.26 * Math.cos(angle * 1.15));
      let y = -Math.cos(angle) * 1.28 - 0.18 * Math.sin(angle * 2.1);

      // Top stem depression
      if (t < 0.12) {
        r *= Math.pow(t / 0.12, 1.4);
        y -= (1 - t / 0.12) * 0.18;
      }
      // Bottom calyx depression
      if (t > 0.9) {
        const bottomFactor = (t - 0.9) / 0.1;
        r *= 1 - bottomFactor * 0.85;
        y += bottomFactor * 0.15;
      }

      points.push(new THREE.Vector2(Math.max(0.005, r), y));
    }

    // Curved outer skin
    const skinGeo = new THREE.LatheGeometry(points, 24, 0, phi);
    skinGeo.computeVertexNormals();

    // 2D slice cross-section profile for cut faces
    const sliceShape = new THREE.Shape();
    sliceShape.moveTo(0, points[0].y);
    for (let i = 0; i < points.length; i++) {
      sliceShape.lineTo(points[i].x, points[i].y);
    }
    sliceShape.lineTo(0, points[points.length - 1].y);
    sliceShape.closePath();

    const faceGeo = new THREE.ShapeGeometry(sliceShape, 24);
    faceGeo.computeVertexNormals();

    return {
      skinGeometry: skinGeo,
      faceGeometry: faceGeo,
      phiLength: phi,
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !interactive) return;
    const t = state.clock.getElapsedTime();
    if (isHovered) {
      groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.05 + 0.08;
    } else {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. Curved Outer Skin (Red Delicious PBR skin) */}
      <mesh geometry={skinGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={skinTexture}
          bumpMap={bumpTexture}
          bumpScale={0.018}
          roughness={0.28}
          metalness={0.04}
          clearcoat={0.65}
          clearcoatRoughness={0.2}
          sheen={0.35}
          sheenColor={new THREE.Color('#ffdede')}
        />
      </mesh>

      {/* 2. First Cut Face (crisp golden-cream flesh) */}
      <mesh geometry={faceGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={sliceFleshTexture}
          roughness={0.35}
          metalness={0.02}
          clearcoat={0.3}
          clearcoatRoughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Second Cut Face rotated by phiLength */}
      <mesh
        geometry={faceGeometry}
        rotation={[0, phiLength, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          map={sliceFleshTexture}
          roughness={0.35}
          metalness={0.02}
          clearcoat={0.3}
          clearcoatRoughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default AppleSlice3D;
