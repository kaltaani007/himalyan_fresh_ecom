import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { KinnaurCanvas } from './KinnaurCanvas';
import { KinnaurNavbar } from './KinnaurNavbar';
import { KinnaurOverlays } from './KinnaurOverlays';
import { KinnaurHUD } from './KinnaurHUD';
import { TerroirDossierModal } from './TerroirDossierModal';
import { products } from '@/data';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import { Sparkles, Mountain } from 'lucide-react';

export const KinnaurRoyalExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const navigate = useNavigate();
  const { addItem: addToCart } = useCartStore();

  // Flagship Kinnaur Apple product reference
  const flagshipProduct = products[0]; // Royal Red Delicious Apples

  // Calculate scroll progress through 450vh track
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollDistance = -rect.top;
    const maxScroll = rect.height - window.innerHeight;

    if (maxScroll <= 0) return;

    const rawProgress = Math.min(1, Math.max(0, scrollDistance / maxScroll));
    setProgress(rawProgress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Navigate to specific percentage in the 450vh container
  const navigateToSection = (percentage: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + percentage * maxScroll;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  // Add to cart with celebratory feedback
  const handleReserve = () => {
    addToCart(flagshipProduct, 1);
    toast.success('🍎 Reserved 2024 Kinnaur Royal Red Harvest Box!', {
      style: {
        background: '#0e1811',
        color: '#fbf8f3',
        border: '1px solid rgba(200, 150, 44, 0.4)',
        borderRadius: '16px',
        padding: '16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#c8962c',
        secondary: '#0e1811',
      },
      duration: 4000,
    });
  };

  return (
    <div className="relative bg-[#070b09] text-white selection:bg-accent selection:text-white min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          1. APPLE-STYLE PRELOADER
         ───────────────────────────────────────────────────────────── */}
      {!isPreloaded && (
        <div className="fixed inset-0 z-50 bg-[#070b09] flex flex-col items-center justify-center p-6 text-center select-none transition-opacity duration-700">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5 mb-6 shadow-2xl animate-pulse">
            <div className="w-full h-full bg-[#070b09] rounded-2xl flex items-center justify-center">
              <Mountain className="w-8 h-8 text-accent-light" />
            </div>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
            Kinnaur Royal Red
          </h2>
          <p className="text-xs sm:text-sm text-cream-200/60 font-mono mb-8 max-w-sm">
            Initializing 198 High-Altitude Harvest Frames...
          </p>

          {/* Progress Bar */}
          <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#8a0a0c] via-[#d03a30] to-[#c8962c] rounded-full transition-all duration-150"
              style={{ width: `${preloadProgress}%` }}
            />
          </div>

          <span className="font-mono text-xs font-bold text-accent-light mt-3">
            {preloadProgress}%
          </span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. APPLE-GRADE MINIMAL TOP NAVIGATION BAR
         ───────────────────────────────────────────────────────────── */}
      <KinnaurNavbar
        progress={progress}
        onNavigateToSection={navigateToSection}
        onOpenDossier={() => setIsDossierOpen(true)}
        onReserve={handleReserve}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN 450vh SCROLLTRACK & STICKY FULLSCREEN CANVAS
         ───────────────────────────────────────────────────────────── */}
      <div ref={containerRef} className="relative h-[450vh] bg-[#070b09]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Subtle Radial Atmosphere Behind Product */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(200,150,44,0.08)_0%,rgba(7,11,9,0)_65%)]" />

          {/* Hardware-Accelerated 198-Frame Image Sequence Canvas */}
          <KinnaurCanvas
            progress={progress}
            onPreloadProgress={setPreloadProgress}
            onPreloadComplete={() => setIsPreloaded(true)}
            onFrameChange={setCurrentFrame}
          />

          {/* Storytelling Floating Overlays (Beats 1 to 5) */}
          <KinnaurOverlays
            progress={progress}
            onReserve={handleReserve}
            onOpenDossier={() => setIsDossierOpen(true)}
          />

          {/* Bottom Telemetry HUD, Frame Scrubber & Audio Atmosphere */}
          <KinnaurHUD
            currentFrame={currentFrame}
            progress={progress}
            onScrub={navigateToSection}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. POST-SCROLL SUMMARY BANNER (Direct Cart & Terroir Entry)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative z-30 bg-[#0b120e] py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
              ✦ Certified Alpine Origin
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Ready for the 2024 Kinnaur Harvest?
            </h3>
            <p className="text-xs sm:text-sm text-cream-200/70 max-w-lg">
              Fresh shipments dispatch every Tuesday & Friday from Kalpa directly into metro cold-chains.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReserve}
              className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Reserve Box — ₹599</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
            >
              Go to Cart →
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TECHNICAL AGRONOMIC DOSSIER DRAWER
         ───────────────────────────────────────────────────────────── */}
      <TerroirDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onReserve={handleReserve}
      />
    </div>
  );
};

export default KinnaurRoyalExperience;
