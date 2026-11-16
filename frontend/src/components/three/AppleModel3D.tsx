import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createAppleSkinTexture,
  createAppleBumpTexture,
  createAppleFleshTexture,
  createWoodStemTexture,
} from './textureGenerator';

export type AppleVariety = 'royal-red' | 'golden' | 'shimla' | 'fuji' | 'cherry' | 'walnut';

interface AppleModel3DProps {
  variety?: AppleVariety;
  scale?: number;
  interactive?: boolean;
  isHovered?: boolean;
  rotationSpeed?: number;
  cutaway?: boolean;
  dewDrops?: boolean;
}

export const AppleModel3D: React.FC<AppleModel3DProps> = ({
  variety = 'royal-red',
  scale = 1,
  interactive = true,
  isHovered = false,
  rotationSpeed = 0.005,
  cutaway = false,
  dewDrops = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const appleBodyRef = useRef<THREE.Mesh>(null);

  // Generate high-resolution PBR textures in memory
  const skinTexture = useMemo(() => createAppleSkinTexture(variety), [variety]);
  const bumpTexture = useMemo(() => createAppleBumpTexture(), []);
  const fleshTexture = useMemo(() => (cutaway ? createAppleFleshTexture() : null), [cutaway]);
  const stemTexture = useMemo(() => createWoodStemTexture(), []);

  // Variety-specific optical parameters
  const materialParams = useMemo(() => {
    switch (variety) {
      case 'golden':
        return { roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.25, bumpScale: 0.015 };
      case 'shimla':
        return { roughness: 0.32, clearcoat: 0.45, clearcoatRoughness: 0.2, bumpScale: 0.018 };
      case 'fuji':
        return { roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.18, bumpScale: 0.016 };
      case 'cherry':
        return { roughness: 0.14, clearcoat: 0.85, clearcoatRoughness: 0.1, bumpScale: 0.008 };
      case 'walnut':
        return { roughness: 0.88, clearcoat: 0.04, clearcoatRoughness: 0.6, bumpScale: 0.06 };
      case 'royal-red':
      default:
        // Kinnaur Royal Red Delicious: waxy natural mountain cuticle, specular studio sheen
        return { roughness: 0.24, clearcoat: 0.72, clearcoatRoughness: 0.16, bumpScale: 0.016 };
    }
  }, [variety]);

  // Construct Realistic Apple Morphology with 5-Lobed Bottom Calyx & Stem Basin
  const { appleGeometry, stemGeometry, leafGeometry, fleshCapGeometry } = useMemo(() => {
    // 1. Organic Apple Silhouette Profile
    const points: THREE.Vector2[] = [];
    const segments = 36;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI;

      // Realistic apple profile: wide top shoulders tapering into bottom calyx crown
      let r = Math.sin(angle) * (1.18 - 0.26 * Math.cos(angle * 1.15));
      let y = -Math.cos(angle) * 1.28 - 0.18 * Math.sin(angle * 2.1);

      // Indented stem basin (top)
      if (t < 0.12) {
        r *= Math.pow(t / 0.12, 1.4);
        y -= (1 - t / 0.12) * 0.18;
      }
      // Indented bottom calyx
      if (t > 0.9) {
        const bottomFactor = (t - 0.9) / 0.1;
        r *= 1 - bottomFactor * 0.85;
        y += bottomFactor * 0.15;
      }

      points.push(new THREE.Vector2(Math.max(0.005, r), y));
    }

    // Full apple (2*PI) or half cutaway (PI)
    const phiLength = cutaway ? Math.PI : Math.PI * 2;
    const appleGeo = new THREE.LatheGeometry(points, 64, 0, phiLength);

    // Deform vertices to create the organic 5-lobed bottom calyx
    const pos = appleGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Apply 5-lobe deformation near bottom calyx (y < -0.7)
      if (y < -0.5) {
        const theta = Math.atan2(z, x);
        const lobeFactor = Math.pow(Math.max(0, (-y - 0.5) / 0.8), 1.6);
        const wave = Math.sin(theta * 5) * 0.06 * lobeFactor;
        pos.setX(i, x * (1 + wave));
        pos.setZ(i, z * (1 + wave));
      }
    }
    appleGeo.computeVertexNormals();

    // 2. Cutaway flat flesh cap if in cutaway mode
    let fleshCapGeo: THREE.PlaneGeometry | null = null;
    if (cutaway) {
      fleshCapGeo = new THREE.PlaneGeometry(2.35, 2.5, 32, 32);
    }

    // 3. Curved Woody Stem with knot
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.95, 0),
      new THREE.Vector3(0.03, 1.15, 0.02),
      new THREE.Vector3(0.08, 1.38, 0.04),
      new THREE.Vector3(0.16, 1.58, 0.08),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.038, 8, false);

    // 4. Organic Mountain Leaf with realistic curvature
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.2, 0.15, 0.38, 0.45, 0.35, 0.75);
    leafShape.bezierCurveTo(0.3, 0.95, 0.15, 1.15, 0, 1.28);
    leafShape.bezierCurveTo(-0.15, 1.15, -0.3, 0.95, -0.35, 0.75);
    leafShape.bezierCurveTo(-0.38, 0.45, -0.2, 0.15, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape, 12);
    leafGeo.computeVertexNormals();

    return {
      appleGeometry: appleGeo,
      stemGeometry: stemGeo,
      leafGeometry: leafGeo,
      fleshCapGeometry: fleshCapGeo,
    };
  }, [cutaway]);

  // Procedural Dew Droplets on Apple Skin
  const dewDroplets = useMemo(() => {
    if (!dewDrops || cutaway) return [];
    return [
      { pos: [0.72, 0.45, 0.55] as [number, number, number], r: 0.038 },
      { pos: [0.82, 0.32, 0.42] as [number, number, number], r: 0.025 },
      { pos: [-0.65, 0.28, 0.68] as [number, number, number], r: 0.032 },
      { pos: [0.35, -0.42, 0.85] as [number, number, number], r: 0.028 },
      { pos: [-0.48, -0.25, 0.78] as [number, number, number], r: 0.035 },
    ];
  }, [dewDrops, cutaway]);

  // Frame animation: continuous rotation + floating oscillation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const effectiveSpeed = isHovered ? rotationSpeed * 2.2 : rotationSpeed;
    groupRef.current.rotation.y += effectiveSpeed;

    // Subtle gentle float
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.06;

    if (interactive) {
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group ref={groupRef} scale={scale} dispose={null}>
      {/* 1. Main Apple Body with Procedural PBR Skin */}
      <mesh ref={appleBodyRef} geometry={appleGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={skinTexture}
          bumpMap={bumpTexture}
          bumpScale={materialParams.bumpScale}
          roughness={materialParams.roughness}
          metalness={0.05}
          clearcoat={materialParams.clearcoat}
          clearcoatRoughness={materialParams.clearcoatRoughness}
          reflectivity={0.65}
          sheen={0.3}
          sheenColor={new THREE.Color('#ffdede')}
        />
      </mesh>

      {/* 2. Cutaway Flesh Plane (when cutaway mode enabled) */}
      {cutaway && fleshCapGeometry && fleshTexture && (
        <mesh
          geometry={fleshCapGeometry}
          position={[0, -0.05, 0]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            map={fleshTexture}
            roughness={0.4}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 3. Authentic Wood Stem with Natural Bark Texture */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial
          map={stemTexture}
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* 4. Natural Mountain Orchard Leaf */}
      <group
        position={[0.07, 1.35, 0.03]}
        rotation={[0.35, 0.65, -0.55]}
        scale={[0.62, 0.62, 0.62]}
      >
        <mesh geometry={leafGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#235c34"
            roughness={0.36}
            metalness={0.05}
            clearcoat={0.25}
            clearcoatRoughness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 5. Dew Droplets on Apple Skin */}
      {dewDroplets.map((drop, idx) => (
        <mesh key={idx} position={drop.pos} castShadow>
          <sphereGeometry args={[drop.r, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.92}
            opacity={1}
            transparent
            roughness={0.05}
            ior={1.33} // Water index of refraction
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};

export default AppleModel3D;
