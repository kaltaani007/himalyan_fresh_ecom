import React, { useRef, useEffect, useState, useCallback } from 'react';
import { frameUrls, TOTAL_FRAMES } from '@/utils/frameSequence';

interface KinnaurCanvasProps {
  progress: number; // 0.0 to 1.0 from scroll
  onPreloadProgress?: (percentage: number) => void;
  onPreloadComplete?: () => void;
  onFrameChange?: (frameIndex: number) => void;
}

export const KinnaurCanvas: React.FC<KinnaurCanvasProps> = ({
  progress,
  onPreloadProgress,
  onPreloadComplete,
  onFrameChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // 1. Preload all 198 frames with concurrency control
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const total = frameUrls.length;
    const imageElements: HTMLImageElement[] = new Array(total);

    const onImageLoaded = () => {
      if (isCancelled) return;
      loadedCount++;
      const pct = Math.round((loadedCount / total) * 100);
      onPreloadProgress?.(pct);

      if (loadedCount === total) {
        imagesRef.current = imageElements;
        setIsLoaded(true);
        onPreloadComplete?.();
      }
    };

    // Preload all frames concurrently
    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imageElements[index] = img;
        onImageLoaded();
      };
      img.onerror = () => {
        // Fallback for network issues
        imageElements[index] = img;
        onImageLoaded();
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [onPreloadProgress, onPreloadComplete]);

  // 2. Map scroll progress to target frame index
  useEffect(() => {
    const target = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
    );
    targetFrameRef.current = target;
  }, [progress]);

  // 3. Render frame to canvas with aspect ratio preservation
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    // Clear with deep alpine background matching the frames
    ctx.fillStyle = '#070b09';
    ctx.fillRect(0, 0, cw, ch);

    // Calculate aspect-ratio fit
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let dw: number;
    let dh: number;
    let dx: number;
    let dy: number;

    // Use containment with slight vertical boost for prominent hero placement
    if (canvasRatio > imgRatio) {
      // Wider than image: fit height, center horizontally
      dh = ch * 0.94;
      dw = dh * imgRatio;
      dx = (cw - dw) / 2;
      dy = (ch - dh) / 2;
    } else {
      // Taller than image: fit width, center vertically
      dw = cw * 0.96;
      dh = dw / imgRatio;
      dx = (cw - dw) / 2;
      dy = (ch - dh) / 2;
    }

    // Draw the image frame
    ctx.drawImage(img, dx, dy, dw, dh);

    // Subtle edge vignette to blend seamless black space
    const grad = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      Math.min(cw, ch) * 0.35,
      cw / 2,
      ch / 2,
      Math.max(cw, ch) * 0.72
    );
    grad.addColorStop(0, 'rgba(7, 11, 9, 0)');
    grad.addColorStop(0.85, 'rgba(7, 11, 9, 0.4)');
    grad.addColorStop(1, 'rgba(7, 11, 9, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  }, []);

  // 4. Smooth frame interpolation loop (60fps lerp)
  useEffect(() => {
    if (!isLoaded) return;

    const renderLoop = () => {
      // Smoothly glide towards target frame to eliminate scroll stepping
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) < 0.2) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += diff * 0.28;
      }

      const activeIdx = Math.round(currentFrameRef.current);
      drawFrame(activeIdx);
      onFrameChange?.(activeIdx);

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isLoaded, drawFrame, onFrameChange]);

  // 5. Handle window resize with Retina / High-DPI support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Redraw immediately
      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block touch-none pointer-events-none select-none"
      style={{ background: '#070b09' }}
    />
  );
};

export default KinnaurCanvas;
