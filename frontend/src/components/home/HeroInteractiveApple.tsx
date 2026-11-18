import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AppleVariety } from '@/components/three';
import { frameUrls, TOTAL_FRAMES } from '@/utils/frameSequence';
import kinnaurShowcaseImg from '@/assets/images/Kinnaur Royal Red Apple Showcase.png';
import goldenDeliciousImg from '@/assets/images/products/golden-delicious.jpg';

interface HeroInteractiveAppleProps {
  variety: AppleVariety;
  className?: string;
}

export const HeroInteractiveApple: React.FC<HeroInteractiveAppleProps> = ({
  variety = 'royal-red',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Physics & animation references
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentFrameFloatRef = useRef(0);
  const targetFrameFloatRef = useRef(0);
  const isHoveredRef = useRef(false);
  const animFrameId = useRef<number | null>(null);

  // Sync ref
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // 1. High-Performance Progressive Preloader
  useEffect(() => {
    let isMounted = true;
    const total = frameUrls.length;
    const elements: (HTMLImageElement | null)[] = new Array(total).fill(null);
    let loadedCount = 0;

    // Load first frame immediately for instant first paint
    if (frameUrls[0]) {
      const firstImg = new Image();
      firstImg.src = frameUrls[0];
      firstImg.onload = () => {
        if (!isMounted) return;
        elements[0] = firstImg;
        imagesRef.current = elements;
        setIsPreloaded(true);
        drawFrame(0);
      };
    }

    // Load remaining frames asynchronously
    frameUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!isMounted) return;
        elements[i] = img;
        loadedCount++;
        imagesRef.current = elements;
        if (!isPreloaded && loadedCount >= 10) {
          setIsPreloaded(true);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
      };
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. High-DPI Smooth Frame Drawer with Nearest-Frame Fallback
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Look for exact frame or nearest loaded neighbor to prevent flickering
    const loadedImages = imagesRef.current;
    let img: HTMLImageElement | null = loadedImages[frameIdx] || null;

    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 30; offset++) {
        const prev = loadedImages[(frameIdx - offset + TOTAL_FRAMES) % TOTAL_FRAMES];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = loadedImages[(frameIdx + offset) % TOTAL_FRAMES];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

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

  // 3. Smooth Lerp Physics Loop with Gentle Idle Auto-Rotation
  useEffect(() => {
    if (variety !== 'royal-red') return;

    const loop = () => {
      // Gentle auto-rotation when user is not actively hovering or dragging
      if (!isHoveredRef.current && !isDraggingRef.current) {
        targetFrameFloatRef.current = (targetFrameFloatRef.current + 0.35) % TOTAL_FRAMES;
      }

      const diff = targetFrameFloatRef.current - currentFrameFloatRef.current;
      currentFrameFloatRef.current += diff * 0.16;

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
  }, [variety, drawFrame]);

  // 4. Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        drawFrame(currentFrameIndex);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, currentFrameIndex]);

  // 5. Cursor Movements & Tilt Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const progressX = Math.min(1, Math.max(0, x / rect.width));
    const progressY = Math.min(1, Math.max(0, y / rect.height));

    // Dynamic 3D tilt calculation
    const tiltX = (0.5 - progressY) * 14; // tilts up/down
    const tiltY = (progressX - 0.5) * 16; // tilts left/right
    setTilt({ x: tiltX, y: tiltY });

    if (variety === 'royal-red') {
      if (isDraggingRef.current) {
        const delta = e.clientX - startXRef.current;
        targetFrameFloatRef.current -= delta * 0.65;
        startXRef.current = e.clientX;
      } else {
        targetFrameFloatRef.current = progressX * (TOTAL_FRAMES - 1);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    isDraggingRef.current = false;
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const progressX = Math.min(1, Math.max(0, x / rect.width));

    if (variety === 'royal-red') {
      targetFrameFloatRef.current = progressX * (TOTAL_FRAMES - 1);
    }
  };

  // Image assets for alternate varieties (replaces procedural 3D balls with luxury photography)
  const varietyImageSrc =
    variety === 'golden'
      ? goldenDeliciousImg
      : variety === 'shimla'
      ? kinnaurShowcaseImg
      : variety === 'fuji'
      ? kinnaurShowcaseImg
      : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[540px] aspect-[4/5] mx-auto select-none cursor-grab active:cursor-grabbing flex items-center justify-center ${className}`}
    >
      {/* 3D Dynamic Tilt Wrapper */}
      <div
        // className="w-full h-full relative rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] border border-white/10 bg-[#0d1a12] transition-transform duration-150 ease-out flex items-center justify-center"
        className="w-full h-full relative rounded-[2rem] overflow-hidden bg-transparent border-0 shadow-none transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
            isHovered ? 1.02 : 1
          })`,
        }}
      >
        {variety === 'royal-red' ? (
          /* ─────────────────────────────────────────────────────────────
             1. PHOTOREALISTIC 3D APPLE SCRUBBED VIA CURSOR
             ───────────────────────────────────────────────────────────── */
          <div className="relative w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full block touch-none pointer-events-none"
            />
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
             2. LUXURY PHOTOREALISTIC EDITORIAL DISPLAY WITH 3D DEPTH
             ───────────────────────────────────────────────────────────── */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {varietyImageSrc && (
              <img
                src={varietyImageSrc}
                alt={`${variety} Apple Showcase`}
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${isHovered ? 0.05 : 1}) translate(${tilt.y * 0.4}px, ${-tilt.x * 0.4}px)`,
                }}
              />
            )}
            {/* Ambient vignette and rim light */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroInteractiveApple;
