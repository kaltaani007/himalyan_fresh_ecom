import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mountain,
  ArrowRight,
  CheckCircle2,
  Truck,
  Award,
  ShieldCheck,
  Droplets,
  ChevronDown,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { KinnaurCanvas } from '@/pages/experience/KinnaurCanvas';
import { AppleModel3D, AppleVariety } from '@/components/three';
import { TOTAL_FRAMES } from '@/utils/frameSequence';
import { products } from '@/data';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

interface HomeScrollyHeroProps {
  selectedVariety: AppleVariety;
  onSelectVariety: (variety: AppleVariety) => void;
}

export const HomeScrollyHero: React.FC<HomeScrollyHeroProps> = ({
  selectedVariety,
  onSelectVariety,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const { addItem: addToCart } = useCartStore();
  const flagshipProduct = products[0]; // Royal Red Delicious Apples

  // Calculate scroll progress within this 420vh section
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollDistance = -rect.top;
    const maxScroll = rect.height - window.innerHeight;

    if (maxScroll <= 0) {
      setProgress(0);
      return;
    }

    const rawProgress = Math.min(1, Math.max(0, scrollDistance / maxScroll));
    setProgress(rawProgress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Audio synthesis for mountain wind
  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.8);
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsAudioPlaying(false);
        }, 800);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
            b6 = white * 0.115926;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.2);

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          whiteNoise.start(0);
          gainNodeRef.current = gain;
        } else {
          audioCtxRef.current.resume();
          gainNodeRef.current?.gain.linearRampToValueAtTime(0.35, audioCtxRef.current.currentTime + 0.8);
        }
        setIsAudioPlaying(true);
      } catch {
        // AudioContext disabled
      }
    }
  };

  const handleReserve = () => {
    addToCart(flagshipProduct, 1);
    toast.success('🍎 Added Kinnaur Royal Red Harvest Box to Cart!', {
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

  // Helper for storytelling phase opacity
  const getPhaseOpacity = (start: number, peakStart: number, peakEnd: number, end: number) => {
    if (progress < start || progress > end) return 0;
    if (progress < peakStart) return (progress - start) / (peakStart - start);
    if (progress > peakEnd) return 1 - (progress - peakEnd) / (end - peakEnd);
    return 1;
  };

  const phase1Opacity = getPhaseOpacity(0.0, 0.0, 0.12, 0.18);
  const phase2Opacity = getPhaseOpacity(0.18, 0.22, 0.38, 0.42);
  const phase3Opacity = getPhaseOpacity(0.42, 0.46, 0.64, 0.68);
  const phase4Opacity = getPhaseOpacity(0.68, 0.72, 0.82, 0.86);
  const phase5Opacity = getPhaseOpacity(0.86, 0.9, 1.0, 1.0);

  const getChapterName = () => {
    if (progress < 0.18) return 'Whole Harvest Apple';
    if (progress < 0.42) return '100% Wax-Free Cuticle';
    if (progress < 0.68) return 'Exploded Anatomy & 14.8° Brix';
    if (progress < 0.86) return 'Heritage Genetics & Glacier Melt';
    return 'Reassembled Flagship Batch';
  };

  return (
    <section ref={containerRef} className="relative h-[420vh] bg-[#070b09] text-white select-none">
      {/* ─────────────────────────────────────────────────────────────
          STICKY FULLSCREEN VIEWPORT CONTAINER
         ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(200,150,44,0.07)_0%,rgba(7,11,9,0)_65%)]" />

        {/* 1. Canvas / 3D Display Layer */}
        {selectedVariety === 'royal-red' ? (
          /* High-Performance 198-Frame Scrollytelling Canvas */
          <KinnaurCanvas
            progress={progress}
            onFrameChange={setCurrentFrame}
          />
        ) : (
          /* Real-Time 3D Variety Model when other variety selected */
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-80 h-80 sm:w-96 sm:h-96">
              <AppleModel3D
                variety={selectedVariety}
                scale={1.3}
                rotationSpeed={0.008}
                dewDrops={true}
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            2. SCROLLYTELLING OVERLAYS LAYER
           ───────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─────────────────────────────────────────────────────────
              PHASE 1 (0% - 18%): HERO INTRO (Matching user prompt)
             ───────────────────────────────────────────────────────── */}
          <div
            className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-300 w-full"
            style={{
              opacity: phase1Opacity,
              transform: `translateY(${(1 - phase1Opacity) * 20}px)`,
              pointerEvents: phase1Opacity > 0.4 ? 'auto' : 'none',
              display: phase1Opacity > 0 ? 'grid' : 'none',
            }}
          >
            {/* Left Column: Brand Typography & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Alpine Terroir Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-cream-50">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Harvest Season 2024 · Kinnaur & Shimla Orchards</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-white">
                From The World’s
                <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-light to-cream-50">
                  Highest Orchards
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-cream-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Authentic, wax-free Himalayan apples, organic mountain fruits, and artisanal produce.
                Handpicked at dawn and shipped cold-chain directly to your doorstep.
              </p>

              {/* 3D Variety Switcher Pills */}
              <div className="pt-2">
                <p className="text-xs font-mono uppercase tracking-wider text-cream-200/80 mb-2.5">
                  Inspect 3D Variety Model:
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {[
                    { id: 'royal-red', label: 'Royal Red Delicious (Exploded 3D)' },
                    { id: 'golden', label: 'Golden Delicious' },
                    { id: 'shimla', label: 'Shimla Mountain' },
                    { id: 'fuji', label: 'Fuji Striped' },
                  ].map((variety) => (
                    <button
                      key={variety.id}
                      type="button"
                      onClick={() => onSelectVariety(variety.id as AppleVariety)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedVariety === variety.id
                          ? 'bg-accent text-white shadow-md scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-cream-50 border border-white/15'
                      }`}
                    >
                      {variety.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 pt-3">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-[0_0_20px_rgba(200,150,44,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/districts"
                  className="px-5 py-3.5 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center gap-2"
                >
                  <Mountain className="w-4 h-4 text-accent" />
                  <span>Explore 12 Districts</span>
                </Link>
              </div>

              {/* Trust Micro-bar */}
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/15 text-xs text-cream-200/90 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>100% Wax-Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-accent shrink-0" />
                  <span>Free delivery &gt; ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent shrink-0" />
                  <span>4.9 / 5 Rating</span>
                </div>
              </div>

              {/* Scroll Down Hint */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-accent-light/80 pt-2 animate-bounce">
                <span>Scroll to explode botanical anatomy</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              PHASE 2 (18% - 42%): 100% WAX-FREE MOUNTAIN CUTICLE
             ───────────────────────────────────────────────────────── */}
          <div
            className="max-w-md transition-all duration-300 self-start lg:ml-8"
            style={{
              opacity: phase2Opacity,
              transform: `translateY(${(1 - phase2Opacity) * 20}px)`,
              pointerEvents: phase2Opacity > 0.4 ? 'auto' : 'none',
              display: phase2Opacity > 0 ? 'block' : 'none',
            }}
          >
            <div className="bg-[#0b110d]/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Epidermal Bio-Defense</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                100% Wax-Free <br />
                <span className="italic text-accent-light">Mountain Cuticle</span>
              </h2>

              <p className="text-xs sm:text-sm text-cream-100/75 leading-relaxed">
                Industrial commercial apples are washed in boiling chemicals and coated in petroleum wax
                to survive warehouse bins. High-altitude Kinnaur apples secrete their own organic crystalline
                bloom to shield against harsh mountain UV radiation.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-cream-200/60 block uppercase font-mono">Paraffin Wax</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">0.0% Added</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-cream-200/60 block uppercase font-mono">Organic Polyphenols</span>
                  <span className="font-bold text-white font-mono text-sm">3.4× Higher</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              PHASE 3 (42% - 68%): PEAK EXPLODED VIEW & 14.8° BRIX
             ───────────────────────────────────────────────────────── */}
          <div
            className="max-w-md transition-all duration-300 self-end lg:mr-8"
            style={{
              opacity: phase3Opacity,
              transform: `translateY(${(1 - phase3Opacity) * 20}px)`,
              pointerEvents: phase3Opacity > 0.4 ? 'auto' : 'none',
              display: phase3Opacity > 0 ? 'block' : 'none',
            }}
          >
            <div className="bg-[#0b110d]/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-accent uppercase">
                <Droplets className="w-4 h-4" />
                <span>Cellular Density & Sweetness</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                Explosive Crispness. <br />
                <span className="italic text-accent-light font-mono text-3xl">14.8° Brix.</span>
              </h2>

              <p className="text-xs sm:text-sm text-cream-100/75 leading-relaxed">
                Diurnal swings from 24°C sun down to -3°C alpine frost convert mountain starches into
                rich natural fructose. Dense cellular walls release an audible, explosive crunch upon the first bite.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-cream-200/60 block uppercase font-mono">Sweetness</span>
                  <span className="font-bold text-accent-light font-mono">14.8° Brix</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-cream-200/60 block uppercase font-mono">Crispness</span>
                  <span className="font-bold text-white font-mono">9.4 / 10</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-cream-200/60 block uppercase font-mono">Flesh Tone</span>
                  <span className="font-bold text-cream-100 font-mono text-[11px] truncate block">Warm Cream</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              PHASE 4 (68% - 86%): CORE, SEEDS & GLACIER RUNOFF
             ───────────────────────────────────────────────────────── */}
          <div
            className="max-w-md transition-all duration-300 self-start lg:ml-8"
            style={{
              opacity: phase4Opacity,
              transform: `translateY(${(1 - phase4Opacity) * 20}px)`,
              pointerEvents: phase4Opacity > 0.4 ? 'auto' : 'none',
              display: phase4Opacity > 0 ? 'block' : 'none',
            }}
          >
            <div className="bg-[#0b110d]/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                <Mountain className="w-4 h-4" />
                <span>Heritage Rootstock Genetics</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                Zero Preservatives. <br />
                <span className="italic text-accent-light">Pure Mountain Heritage.</span>
              </h2>

              <p className="text-xs sm:text-sm text-cream-100/75 leading-relaxed">
                Propagated from heirloom 70-year-old French and British rootstocks originally planted
                in Himachal during the mid-20th century. Irrigated solely by mineral-rich glacier runoff
                from the Kinner Kailash massif.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-cream-200/80">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span>Direct partnerships with 840+ native Kinnauri orchard families</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>100% pesticide residue tested · Clean mountain terroir</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              PHASE 5 (86% - 100%): REASSEMBLY & FINAL CTA
             ───────────────────────────────────────────────────────── */}
          <div
            className="text-center max-w-2xl mx-auto transition-all duration-300 w-full"
            style={{
              opacity: phase5Opacity,
              transform: `translateY(${(1 - phase5Opacity) * 20}px)`,
              pointerEvents: phase5Opacity > 0.4 ? 'auto' : 'none',
              display: phase5Opacity > 0 ? 'block' : 'none',
            }}
          >
            <div className="bg-[#0b110d]/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent-light text-xs font-bold uppercase font-mono tracking-wider">
                <span>Orchard to Table · Batch Ready</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Taste the Altitude.
              </h2>

              <p className="text-sm sm:text-base text-cream-100/80 max-w-xl mx-auto leading-relaxed">
                Every harvest carton is hand-graded for size, skin blush, and density. Shipped via temperature-controlled
                cold chain to your doorstep within 48 to 72 hours of tree harvest.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReserve}
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-[0_0_25px_rgba(200,150,44,0.4)] hover:shadow-[0_0_35px_rgba(200,150,44,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-cream-100" />
                  <span>Reserve 2024 Harvest Box — ₹599</span>
                </button>

                <Link
                  to="/products"
                  className="w-full sm:w-auto px-6 py-4 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center justify-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 text-accent" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs text-cream-200/70">
                <div className="flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-accent" />
                  <span>48h Express Cold Chain</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>100% Wax-Free Guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span>Zero-Damage Eco Cradles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. BOTTOM TELEMETRY HUD & AUDIO CONTROLS
           ───────────────────────────────────────────────────────────── */}
        <div className="absolute bottom-4 left-0 right-0 z-30 pointer-events-none select-none px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
            {/* Left: Frame Index & Story Beat Title */}
            <div className="flex items-center gap-2 bg-[#070b09]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-mono font-bold text-accent-light">
                FRAME {String(currentFrame + 1).padStart(3, '0')} / {TOTAL_FRAMES}
              </span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="text-cream-100/70 font-medium hidden sm:inline">
                {getChapterName()}
              </span>
            </div>

            {/* Right: Sound Atmosphere Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg border cursor-pointer ${
                isAudioPlaying
                  ? 'bg-accent/20 text-accent-light border-accent/40 shadow-[0_0_15px_rgba(200,150,44,0.3)]'
                  : 'bg-[#070b09]/85 text-cream-100/60 border-white/10 hover:text-white'
              }`}
              title={isAudioPlaying ? 'Mute Alpine Atmosphere' : 'Play Alpine Orchard Wind'}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span className="hidden sm:inline">Alpine Wind: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sound: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeScrollyHero;
