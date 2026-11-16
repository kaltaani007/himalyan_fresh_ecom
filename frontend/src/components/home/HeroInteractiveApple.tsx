import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { AppleModel3D, AppleVariety } from '@/components/three';
import { frameUrls, TOTAL_FRAMES } from '@/utils/frameSequence';

interface HeroInteractiveAppleProps {
  variety: AppleVariety;
  className?: string;
}

// 3D Camera Rig that responds smoothly to cursor movement
const Interactive3DCameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.45, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.35, 0.08);
  });

  return <group ref={groupRef}>{children}</group>;
};

export const HeroInteractiveApple: React.FC<HeroInteractiveAppleProps> = ({
  variety = 'royal-red',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Drag & cursor physics state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentFrameFloatRef = useRef(0);
  const targetFrameFloatRef = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // 1. Preload 198 frames for royal-red
  useEffect(() => {
    let isMounted = true;
    const total = frameUrls.length;
    const elements: HTMLImageElement[] = new Array(total);
    let loaded = 0;

    frameUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!isMounted) return;
        elements[i] = img;
        loaded++;
        if (loaded >= Math.min(total, 40)) {
          imagesRef.current = elements;
          setIsPreloaded(true);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        elements[i] = img;
        loaded++;
      };
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Draw canvas frame with cover fit inside card
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let dw: number;
    let dh: number;

    if (canvasRatio > imgRatio) {
      dw = cw;
      dh = cw / imgRatio;
    } else {
      dh = ch;
      dw = ch * imgRatio;
    }

    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // 3. Smooth animation loop for frame scrubbing
  useEffect(() => {
    if (!isPreloaded || variety !== 'royal-red') return;

    const loop = () => {
      const diff = targetFrameFloatRef.current - currentFrameFloatRef.current;
      currentFrameFloatRef.current += diff * 0.22;

      let frame = Math.round(currentFrameFloatRef.current) % TOTAL_FRAMES;
      if (frame < 0) frame += TOTAL_FRAMES;

      drawFrame(frame);
      setCurrentFrameIndex(frame);

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPreloaded, variety, drawFrame]);

  // 4. Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(currentFrameIndex);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, currentFrameIndex]);

  // 5. Cursor Movements Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || variety !== 'royal-red') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progressX = Math.min(1, Math.max(0, x / rect.width));

    if (isDraggingRef.current) {
      const delta = e.clientX - startXRef.current;
      targetFrameFloatRef.current -= delta * 0.7;
      startXRef.current = e.clientX;
    } else {
      targetFrameFloatRef.current = progressX * (TOTAL_FRAMES - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || variety !== 'royal-red') return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const progressX = Math.min(1, Math.max(0, x / rect.width));
    targetFrameFloatRef.current = progressX * (TOTAL_FRAMES - 1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`relative w-full aspect-[4/5] max-w-[460px] lg:max-w-[500px] mx-auto rounded-3xl overflow-hidden select-none cursor-grab active:cursor-grabbing border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-center bg-[#0d1c12] ${className}`}
    >
      {variety === 'royal-red' ? (
        /* ─────────────────────────────────────────────────────────────
           1. PHOTOREALISTIC APPLE SEQUENCE SCRUBBED VIA CURSOR
           ───────────────────────────────────────────────────────────── */
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none pointer-events-none"
          />

          {!isPreloaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-accent-light bg-[#0f1f14]">
              Loading High-Definition Model...
            </div>
          )}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           2. 3D APPLE VARIETY MODEL PROPERLY SCALED WITH CURSOR RIG
           ───────────────────────────────────────────────────────────── */
        <div className="w-full h-full relative">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0.15, 3.8], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.9} color="#ebf5ed" />
              <directionalLight position={[4, 6, 4]} intensity={2.0} color="#fffcf5" castShadow />
              <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#a6d4b2" />
              <pointLight position={[0, -2, 2]} intensity={0.4} color="#ffffff" />

              <Interactive3DCameraRig>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                  <group position={[0, 0, 0]}>
                    <AppleModel3D
                      variety={variety}
                      scale={0.92}
                      rotationSpeed={0.006}
                      dewDrops={true}
                    />
                    <ContactShadows
                      position={[0, -1.25, 0]}
                      opacity={0.6}
                      scale={3.8}
                      blur={2.2}
                      far={3}
                    />
                  </group>
                </Float>
              </Interactive3DCameraRig>
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Floating Interactive Micro-Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-cream-100 flex items-center gap-2 pointer-events-none shadow-lg whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>Move cursor or drag to rotate 3D model</span>
      </div>
    </div>
  );
};

export default HeroInteractiveApple;
