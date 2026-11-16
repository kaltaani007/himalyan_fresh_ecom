import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  Droplets,
  Mountain,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

interface KinnaurOverlaysProps {
  progress: number;
  onReserve: () => void;
  onOpenDossier: () => void;
}

// Helper to calculate smooth fade-in / fade-out alpha and vertical drift
const getBeatState = (
  progress: number,
  start: number,
  peakStart: number,
  peakEnd: number,
  end: number
) => {
  if (progress < start || progress > end) return { opacity: 0, pointerEvents: 'none' as const, y: 30 };
  let opacity = 1;
  let y = 0;

  if (progress < peakStart) {
    const t = (progress - start) / (peakStart - start);
    opacity = t;
    y = (1 - t) * 25;
  } else if (progress > peakEnd) {
    const t = (progress - peakEnd) / (end - peakEnd);
    opacity = 1 - t;
    y = -t * 25;
  }

  return { opacity, pointerEvents: opacity > 0.4 ? ('auto' as const) : ('none' as const), y };
};

export const KinnaurOverlays: React.FC<KinnaurOverlaysProps> = ({
  progress,
  onReserve,
  onOpenDossier,
}) => {
  // Beat 1: Intro (0.00 to 0.18)
  const beat1 = getBeatState(progress, 0.0, 0.03, 0.14, 0.18);

  // Beat 2: Cuticle & Epidermal Bio-defense (0.18 to 0.42)
  const beat2 = getBeatState(progress, 0.18, 0.22, 0.38, 0.42);

  // Beat 3: Exploded Anatomy & Brix Sweetness (0.42 to 0.68)
  const beat3 = getBeatState(progress, 0.42, 0.46, 0.64, 0.68);

  // Beat 4: Core, Seeds & Heritage Terroir (0.68 to 0.85)
  const beat4 = getBeatState(progress, 0.68, 0.71, 0.82, 0.85);

  // Beat 5: Reassembly & Final Harvest CTA (0.85 to 1.00)
  const beat5 = getBeatState(progress, 0.85, 0.89, 1.0, 1.0);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ─────────────────────────────────────────────────────────────
          BEAT 1: HERO / INTRO (0% - 18%)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="text-center max-w-3xl mx-auto transition-all duration-300 select-none"
        style={{
          opacity: beat1.opacity,
          transform: `translateY(${beat1.y}px)`,
          pointerEvents: beat1.pointerEvents,
          display: beat1.opacity > 0 ? 'block' : 'none',
        }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent-light text-xs font-semibold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>2024 VINTAGE HARVEST · 2,750M ASL</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-4">
          Kinnaur Royal Red
        </h1>

        <p className="text-lg sm:text-2xl font-light text-cream-100/90 leading-relaxed mb-6 max-w-2xl mx-auto">
          Grown at 2,750 Meters. <br className="hidden sm:inline" />
          <span className="text-accent-light font-medium italic">Untouched by Synthetic Wax.</span>
        </p>

        <p className="text-xs sm:text-sm text-cream-200/60 max-w-lg mx-auto mb-8 font-normal">
          Flagship high-altitude mountain apples harvested at dawn from Kalpa’s terraced orchards.
          Nourished solely by glacier runoff and sub-zero Himalayan winds.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-light/80 animate-bounce">
          <span>Scroll to Explode Anatomy</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 2: 100% WAX-FREE MOUNTAIN CUTICLE (18% - 42%)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="max-w-md transition-all duration-300 select-none self-start lg:ml-6"
        style={{
          opacity: beat2.opacity,
          transform: `translateY(${beat2.y}px)`,
          pointerEvents: beat2.pointerEvents,
          display: beat2.opacity > 0 ? 'block' : 'none',
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
            Industrial commercial apples are washed in scalding detergents and coated in petroleum wax
            to extend warehouse shelf-life. High-altitude Kinnaur apples naturally produce their own organic,
            edible crystalline bloom to shield against harsh alpine UV radiation.
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

      {/* ─────────────────────────────────────────────────────────────
          BEAT 3: PEAK EXPLODED VIEW & BRIX CRUNCH (42% - 68%)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="max-w-md transition-all duration-300 select-none self-end lg:mr-6"
        style={{
          opacity: beat3.opacity,
          transform: `translateY(${beat3.y}px)`,
          pointerEvents: beat3.pointerEvents,
          display: beat3.opacity > 0 ? 'block' : 'none',
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
            Extreme diurnal temperature swings (from 24°C daytime sun to -3°C alpine twilight) shock
            the starches into rich, complex natural fructose. The cellular walls stay rock-solid,
            releasing an audible, explosive crunch upon the very first bite.
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

      {/* ─────────────────────────────────────────────────────────────
          BEAT 4: CORE, SEEDS & MOUNTAIN HERITAGE (68% - 85%)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="max-w-md transition-all duration-300 select-none self-start lg:ml-6"
        style={{
          opacity: beat4.opacity,
          transform: `translateY(${beat4.y}px)`,
          pointerEvents: beat4.pointerEvents,
          display: beat4.opacity > 0 ? 'block' : 'none',
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

      {/* ─────────────────────────────────────────────────────────────
          BEAT 5: REASSEMBLY & HARVEST RESERVATION (85% - 100%)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="text-center max-w-2xl mx-auto transition-all duration-300 select-none"
        style={{
          opacity: beat5.opacity,
          transform: `translateY(${beat5.y}px)`,
          pointerEvents: beat5.pointerEvents,
          display: beat5.opacity > 0 ? 'block' : 'none',
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

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onReserve}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-[0_0_25px_rgba(200,150,44,0.4)] hover:shadow-[0_0_35px_rgba(200,150,44,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cream-100" />
              <span>Reserve 2024 Harvest Box — ₹599</span>
            </button>

            <button
              type="button"
              onClick={onOpenDossier}
              className="w-full sm:w-auto px-6 py-4 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Terroir Dossier</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </button>
          </div>

          {/* Trust Guarantees */}
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
  );
};

export default KinnaurOverlays;
