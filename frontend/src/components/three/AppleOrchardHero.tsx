import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { AppleModel3D, AppleVariety } from './AppleModel3D';
import { AppleSlice3D } from './AppleSlice3D';
import { SlatePedestal3D } from './SlatePedestal3D';
import { Sparkles, Trees } from 'lucide-react';

// Subtle floating leaves / golden orchard pollen in high altitude mountain air
const OrchardParticles: React.FC<{ count?: number }> = ({ count = 35 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.03;
    pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#f2d37c"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera parallax rig responding to cursor
const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.12, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.1, 0.04);
  });

  return <group ref={groupRef}>{children}</group>;
};

interface AppleOrchardHeroProps {
  activeVariety?: AppleVariety;
  className?: string;
}

export const AppleOrchardHero: React.FC<AppleOrchardHeroProps> = ({
  activeVariety = 'royal-red',
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [stagingMode, setStagingMode] = useState<'showcase' | 'orchard'>('showcase');

  return (
    <div className={`relative w-full h-[520px] lg:h-[660px] select-none ${className}`}>
      {/* 3D Canvas Scene */}
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.15, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          {stagingMode === 'showcase' ? (
            /* Studio Lighting calibrated directly to Kinnaur Royal Red Showcase image */
            <>
              <ambientLight intensity={0.55} color="#2a2224" />
              {/* Key overhead softbox spotlight */}
              <directionalLight
                position={[3.5, 7, 4]}
                intensity={2.4}
                color="#fff8f0"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              />
              {/* Rich warm rim light accentuating the crimson silhouette */}
              <directionalLight
                position={[-4.5, 2.5, -2.5]}
                intensity={1.2}
                color="#ff8e72"
              />
              {/* Subtle fill bounce */}
              <pointLight position={[0, -2, 2.5]} intensity={0.5} color="#e0c296" />
            </>
          ) : (
            /* Golden Hour Orchard Sunlight */
            <>
              <ambientLight intensity={0.7} color="#ebf5ed" />
              <directionalLight
                position={[5, 8, 4]}
                intensity={2.0}
                color="#fff6e3"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight
                position={[-4, 2, -3]}
                intensity={0.9}
                color="#a2dbb2"
              />
              <pointLight position={[0, -3, 2]} intensity={0.4} color="#d4a84b" />
            </>
          )}

          <CameraRig>
            {stagingMode === 'showcase' ? (
              /* ─────────────────────────────────────────────────────────────
                 SHOWCASE STAGING: Whole Apple + Companion Crisp Wedge + Slate Pedestal
                 Matches reference image: "Kinnaur Royal Red Apple Showcase.png"
                 ───────────────────────────────────────────────────────────── */
              <group position={[0, 0.05, 0]}>
                {/* Whole Apple */}
                <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
                  <group
                    position={[-0.42, 0.08, -0.1]}
                    onPointerOver={() => setHoveredIndex(0)}
                    onPointerOut={() => setHoveredIndex(null)}
                  >
                    <AppleModel3D
                      variety={activeVariety}
                      scale={1.22}
                      isHovered={hoveredIndex === 0}
                      rotationSpeed={0.005}
                      dewDrops={true}
                    />
                  </group>
                </Float>

                {/* Crisp Cut Companion Apple Wedge */}
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                  <group
                    position={[0.88, -0.42, 0.55]}
                    rotation={[-0.22, -0.65, 0.38]}
                    onPointerOver={() => setHoveredIndex(3)}
                    onPointerOut={() => setHoveredIndex(null)}
                  >
                    <AppleSlice3D
                      variety={activeVariety}
                      scale={0.95}
                      interactive={true}
                      isHovered={hoveredIndex === 3}
                    />
                  </group>
                </Float>

                {/* Dark Mountain Slate Pedestal Base */}
                <SlatePedestal3D
                  radius={2.3}
                  height={0.22}
                  position={[0.1, -1.38, 0]}
                />

                {/* Contact Shadow on Pedestal */}
                <ContactShadows
                  position={[0.1, -1.37, 0]}
                  opacity={0.7}
                  scale={5.5}
                  blur={2.2}
                  far={3}
                />
              </group>
            ) : (
              /* ─────────────────────────────────────────────────────────────
                 ORCHARD FLIGHT STAGING: 3 Varieties Floating in Alpine Air
                 ───────────────────────────────────────────────────────────── */
              <>
                {/* Primary Hero Apple */}
                <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.4}>
                  <group
                    position={[0, 0.1, 0]}
                    onPointerOver={() => setHoveredIndex(0)}
                    onPointerOut={() => setHoveredIndex(null)}
                  >
                    <AppleModel3D
                      variety={activeVariety}
                      scale={1.28}
                      isHovered={hoveredIndex === 0}
                      rotationSpeed={0.007}
                      dewDrops={true}
                    />
                  </group>
                </Float>

                {/* Left Secondary Apple (Golden Delicious) */}
                <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                  <group
                    position={[-2.4, -0.6, -1.2]}
                    onPointerOver={() => setHoveredIndex(1)}
                    onPointerOut={() => setHoveredIndex(null)}
                  >
                    <AppleModel3D
                      variety="golden"
                      scale={0.88}
                      isHovered={hoveredIndex === 1}
                      rotationSpeed={0.004}
                      dewDrops={false}
                    />
                  </group>
                </Float>

                {/* Right Secondary Apple (Shimla Mountain Apple) */}
                <Float speed={2.0} rotationIntensity={0.3} floatIntensity={0.45}>
                  <group
                    position={[2.3, 0.35, -1.0]}
                    onPointerOver={() => setHoveredIndex(2)}
                    onPointerOut={() => setHoveredIndex(null)}
                  >
                    <AppleModel3D
                      variety="shimla"
                      scale={0.82}
                      isHovered={hoveredIndex === 2}
                      rotationSpeed={0.006}
                      dewDrops={false}
                    />
                  </group>
                </Float>

                {/* Contact Shadow */}
                <ContactShadows
                  position={[0, -1.75, 0]}
                  opacity={0.55}
                  scale={7}
                  blur={2.5}
                  far={4}
                />
              </>
            )}

            {/* Ambient Leaf Particles */}
            <OrchardParticles count={35} />
          </CameraRig>
        </Suspense>
      </Canvas>

      {/* Floating Staging Switcher Pill */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-xl z-20">
        <button
          type="button"
          onClick={() => setStagingMode('showcase')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            stagingMode === 'showcase'
              ? 'bg-accent text-white shadow-md'
              : 'text-cream-100 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Showcase Pairing</span>
        </button>
        <button
          type="button"
          onClick={() => setStagingMode('orchard')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            stagingMode === 'orchard'
              ? 'bg-primary text-white shadow-md'
              : 'text-cream-100 hover:text-white'
          }`}
        >
          <Trees className="w-3.5 h-3.5" />
          <span>Orchard Trio</span>
        </button>
      </div>
    </div>
  );
};

export default AppleOrchardHero;
