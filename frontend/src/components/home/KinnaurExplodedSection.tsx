import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Droplets,
  Mountain,
  Award,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { KinnaurCanvas } from '@/pages/experience/KinnaurCanvas';
import { TOTAL_FRAMES } from '@/utils/frameSequence';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

export const KinnaurExplodedSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const { addItem: addToCart } = useCartStore();
  const { data: flagshipProduct } = useProductBySlug('royal-red-delicious');

  // Calculate scroll progress within this dedicated 280vh section
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollDistance = -rect.top;
    const maxScroll = rect.height - windowH;

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
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.6);
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsAudioPlaying(false);
        }, 600);
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
          filter.frequency.setValueAtTime(300, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1.0);

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          whiteNoise.start(0);
          gainNodeRef.current = gain;
        } else {
          audioCtxRef.current.resume();
          gainNodeRef.current?.gain.linearRampToValueAtTime(0.3, audioCtxRef.current.currentTime + 0.6);
        }
        setIsAudioPlaying(true);
      } catch {
        // AudioContext disabled
      }
    }
  };

  const handleReserve = () => {
    if (!flagshipProduct) return;
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

  const activeChapter = progress < 0.25 ? 1 : progress < 0.6 ? 2 : progress < 0.85 ? 3 : 4;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[280vh] lg:min-h-[300vh] bg-[#070b09] text-white border-y border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: STORYTELLING BEATS & BOTANICAL BREAKDOWN
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-8 pt-4">
            {/* Section Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent-light text-xs font-bold font-mono tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BOTANICAL ANATOMY REVEAL</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Kinnaur Royal Red: <br />
                <span className="italic text-accent-light">The Exploded Anatomy</span>
              </h2>
              <p className="text-xs sm:text-sm text-cream-100/80 leading-relaxed font-normal">
                Scroll down to scrub through 198 ultra-high-definition frames of botanical engineering.
                Witness our flagship mountain apple explode into floating cuticle, cellular golden-cream flesh,
                and mineral-fed core structures.
              </p>
            </div>

            {/* Chapter 1: Wax-Free Cuticle */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeChapter === 1
                  ? 'bg-white/10 border-accent/60 shadow-[0_0_25px_rgba(200,150,44,0.15)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Chapter I · Cuticle Bio-Defense</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  0.0% WAX
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                100% Wax-Free Mountain Cuticle
              </h3>
              <p className="text-xs text-cream-100/75 leading-relaxed">
                Industrial apples are treated with petroleum wax. Kinnaur apples naturally secrete an organic crystalline
                bloom that shields against harsh alpine UV radiation and locks in natural aromatics.
              </p>
            </div>

            {/* Chapter 2: Cellular Crispness & Brix */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeChapter === 2
                  ? 'bg-white/10 border-accent/60 shadow-[0_0_25px_rgba(200,150,44,0.15)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-accent flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" />
                  <span>Chapter II · Cellular Density</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/40 font-bold">
                  14.8° BRIX
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                Explosive Crispness & Golden Flesh
              </h3>
              <p className="text-xs text-cream-100/75 leading-relaxed">
                Diurnal swings from 24°C sunlight down to -3°C frost convert mountain starches into rich natural fructose,
                creating dense cellular walls that yield an audible, explosive snap on every bite.
              </p>
            </div>

            {/* Chapter 3: Heritage Genetics & Glacier Runoff */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeChapter === 3
                  ? 'bg-white/10 border-accent/60 shadow-[0_0_25px_rgba(200,150,44,0.15)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <Mountain className="w-4 h-4" />
                  <span>Chapter III · Heritage Roots</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  2,750M ASL
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                Pure Glacier Irrigation & Ancient Seeds
              </h3>
              <p className="text-xs text-cream-100/75 leading-relaxed">
                Propagated from 70-year heirloom rootstocks planted in Kalpa and Sangla terraces. Irrigated solely by mineral-rich
                glacier runoff from the Kinner Kailash massif.
              </p>
            </div>

            {/* Chapter 4: Reassembly & Reserve Batch */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeChapter === 4
                  ? 'bg-white/10 border-accent/60 shadow-[0_0_25px_rgba(200,150,44,0.15)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-accent-light flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Chapter IV · Reassembled Flagship</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/40 font-bold">
                  2024 HARVEST
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                Taste the Altitude
              </h3>
              <p className="text-xs text-cream-100/75 leading-relaxed mb-4">
                Handpicked at dawn, packed in ventilated eco-cartons, and shipped temperature-controlled to your door in 48 hours.
              </p>
              <button
                type="button"
                onClick={handleReserve}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-[0_0_20px_rgba(200,150,44,0.4)] hover:shadow-[0_0_30px_rgba(200,150,44,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve 2024 Harvest Box — ₹599</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: STICKY 198-FRAME EXPLODED CANVAS
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="relative aspect-[9/14] sm:aspect-[9/13] lg:aspect-[9/12] w-full max-h-[75vh] rounded-3xl overflow-hidden bg-[#0a0f0d] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex items-center justify-center">
              {/* Radial glow backdrop */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(200,150,44,0.08)_0%,rgba(7,11,9,0)_70%)]" />

              {/* Hardware-Accelerated Canvas */}
              <KinnaurCanvas
                progress={progress}
                onFrameChange={setCurrentFrame}
              />

              {/* Top HUD Tag */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#070b09]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono text-accent-light shadow-md">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>SCROLLING 3D SEQUENCE</span>
              </div>

              {/* Bottom HUD Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 bg-[#070b09]/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-accent-light text-[11px]">
                    FRAME {String(currentFrame + 1).padStart(3, '0')} / {TOTAL_FRAMES}
                  </span>
                </div>

                {/* Scrubber indicator */}
                <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[180px]">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-75"
                      style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all border cursor-pointer ${
                    isAudioPlaying
                      ? 'bg-accent/20 text-accent-light border-accent/40'
                      : 'bg-white/5 text-cream-100/60 border-white/10 hover:text-white'
                  }`}
                  title={isAudioPlaying ? 'Mute Alpine Atmosphere' : 'Play Alpine Wind Sound'}
                >
                  {isAudioPlaying ? (
                    <>
                      <Volume2 className="w-3 h-3 text-accent animate-pulse" />
                      <span>Wind: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3 h-3" />
                      <span>Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KinnaurExplodedSection;
