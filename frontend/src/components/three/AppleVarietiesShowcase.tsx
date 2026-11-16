import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { AppleModel3D, AppleVariety } from './AppleModel3D';
import { AppleSlice3D } from './AppleSlice3D';
import { SlatePedestal3D } from './SlatePedestal3D';
import {
  Rotate3d,
  Layers,
  Sun,
  Sunrise,
  Sparkles,
  Slice,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface AppleVarietiesShowcaseProps {
  variety?: AppleVariety;
  originDistrict?: string;
  altitude?: string;
  className?: string;
}

type LightingPreset = 'golden' | 'morning' | 'studio';
type PresentationMode = 'whole' | 'showcase' | 'anatomy';

export const AppleVarietiesShowcase: React.FC<AppleVarietiesShowcaseProps> = ({
  variety = 'royal-red',
  originDistrict = 'Kinnaur Valley',
  altitude = '2,750m ASL',
  className = '',
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [presentationMode, setPresentationMode] = useState<PresentationMode>('showcase');
  const [lighting, setLighting] = useState<LightingPreset>('studio');

  const handleModeChange = (mode: PresentationMode) => {
    setPresentationMode(mode);
    trackEvent({
      type: 'product_view',
      productId: 1,
      slug: variety,
      name: `3D Mode: ${mode}`,
      price: 0,
    });
  };

  // Variety sensory matrix
  const sensoryData = React.useMemo(() => {
    switch (variety) {
      case 'golden':
        return { brix: '15.2° Brix', crispness: '8.8 / 10', aroma: 'Floral Honey', harvest: 'Late Sept' };
      case 'shimla':
        return { brix: '13.4° Brix', crispness: '9.4 / 10', aroma: 'Tart Citrus', harvest: 'Early Oct' };
      case 'fuji':
        return { brix: '16.0° Brix', crispness: '9.1 / 10', aroma: 'Sweet Berry', harvest: 'Mid Oct' };
      case 'cherry':
        return { brix: '18.5° Brix', crispness: '8.4 / 10', aroma: 'Dark Plum', harvest: 'June-July' };
      case 'walnut':
        return { brix: 'Rich Oil', crispness: '9.8 / 10', aroma: 'Earthy Nut', harvest: 'October' };
      case 'royal-red':
      default:
        return { brix: '14.8° Brix', crispness: '9.2 / 10', aroma: 'Classic Cider', harvest: 'Late Sept - Oct' };
    }
  }, [variety]);

  const isDarkMode = lighting === 'studio';

  return (
    <div
      className={`relative w-full aspect-square max-w-[580px] mx-auto rounded-3xl border shadow-2xl overflow-hidden select-none flex flex-col justify-between transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-b from-[#181617] via-[#141314] to-[#0d0c0d] border-zinc-800 text-white'
          : 'bg-gradient-to-b from-[#ffffff] via-[#faf7f0] to-[#f2ecde] border-border-light text-text-primary'
      } ${className}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          TOP CONTROL BAR (Terroir Tags & Lighting Presets)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 p-4 sm:p-5 flex items-start justify-between gap-3 pointer-events-auto">
        <div>
          <span
            className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
              isDarkMode
                ? 'bg-accent/20 text-accent-light border border-accent/30'
                : 'bg-primary text-white'
            }`}
          >
            📍 {originDistrict}
          </span>
          <p
            className={`font-mono text-xs mt-1.5 font-medium ${
              isDarkMode ? 'text-zinc-400' : 'text-text-tertiary'
            }`}
          >
            Harvest Altitude: {altitude}
          </p>
        </div>

        {/* Lighting Scenarios */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border backdrop-blur-md text-xs shadow-sm ${
            isDarkMode
              ? 'bg-zinc-900/80 border-zinc-700/60'
              : 'bg-white/90 border-border-light'
          }`}
        >
          <button
            type="button"
            onClick={() => setLighting('studio')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              lighting === 'studio'
                ? 'bg-accent text-white shadow-sm'
                : isDarkMode
                ? 'text-zinc-400 hover:text-white'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
            title="Kinnaur Dark Studio Showcase (Sampled from official photo)"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLighting('morning')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              lighting === 'morning'
                ? 'bg-primary text-white shadow-sm'
                : isDarkMode
                ? 'text-zinc-400 hover:text-white'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
            title="Morning Alpine Dew Lighting"
          >
            <Sunrise className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLighting('golden')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              lighting === 'golden'
                ? 'bg-amber-600 text-white shadow-sm'
                : isDarkMode
                ? 'text-zinc-400 hover:text-white'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
            title="Golden Sunset Lighting"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3D R3F CANVAS WITH CONTACT SHADOWS & TURNTABLE
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.35, 3.8], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            {/* Dynamic Lighting Setup */}
            {lighting === 'studio' && (
              <>
                <ambientLight intensity={0.45} color="#2b2325" />
                {/* Overhead Softbox Spotlight */}
                <directionalLight
                  position={[3.5, 7, 4]}
                  intensity={2.6}
                  color="#fff8f0"
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                  shadow-bias={-0.0001}
                />
                {/* Crimson Rim Light from Back-Left */}
                <directionalLight
                  position={[-4.5, 2.5, -2.5]}
                  intensity={1.3}
                  color="#ff8e72"
                />
                {/* Warm Floor Fill */}
                <pointLight position={[0, -2, 2.5]} intensity={0.5} color="#e0c296" />
              </>
            )}

            {lighting === 'morning' && (
              <>
                <ambientLight intensity={0.9} color="#eaf3ec" />
                <directionalLight position={[4, 6, 4]} intensity={1.8} color="#fffcf5" castShadow />
                <directionalLight position={[-4, 2, -2]} intensity={0.7} color="#a6d4b2" />
                <pointLight position={[0, -2, 2]} intensity={0.3} color="#ffffff" />
              </>
            )}

            {lighting === 'golden' && (
              <>
                <ambientLight intensity={0.7} color="#fff0d4" />
                <directionalLight position={[5, 4, 3]} intensity={2.2} color="#ffb74d" castShadow />
                <directionalLight position={[-4, 1, -3]} intensity={0.5} color="#e57373" />
                <pointLight position={[0, -1, 3]} intensity={0.6} color="#ffa726" />
              </>
            )}

            {/* Apple 3D Group with Turntable */}
            <group position={[0, 0, 0]}>
              {presentationMode === 'showcase' && (
                <>
                  {/* Whole Apple */}
                  <group position={[-0.38, 0.05, 0]}>
                    <AppleModel3D
                      variety={variety}
                      scale={1.12}
                      rotationSpeed={0}
                      cutaway={false}
                      dewDrops={lighting === 'morning'}
                    />
                  </group>

                  {/* Companion Apple Slice */}
                  <group position={[0.78, -0.42, 0.52]} rotation={[-0.22, -0.65, 0.38]}>
                    <AppleSlice3D
                      variety={variety}
                      scale={0.88}
                      interactive={true}
                    />
                  </group>

                  {/* Dark Stone Pedestal */}
                  <SlatePedestal3D
                    radius={2.1}
                    height={0.2}
                    position={[0.1, -1.35, 0]}
                  />

                  {/* Contact Shadows */}
                  <ContactShadows
                    position={[0.1, -1.34, 0]}
                    opacity={0.7}
                    scale={4.8}
                    blur={2.2}
                    far={3}
                  />
                </>
              )}

              {presentationMode === 'whole' && (
                <>
                  <AppleModel3D
                    variety={variety}
                    scale={1.18}
                    rotationSpeed={0}
                    cutaway={false}
                    dewDrops={lighting === 'morning'}
                  />
                  <ContactShadows
                    position={[0, -1.35, 0]}
                    opacity={0.65}
                    scale={4.5}
                    blur={2.2}
                    far={4}
                  />
                </>
              )}

              {presentationMode === 'anatomy' && (
                <>
                  <AppleModel3D
                    variety={variety}
                    scale={1.18}
                    rotationSpeed={0}
                    cutaway={true}
                    dewDrops={false}
                  />
                  <ContactShadows
                    position={[0, -1.35, 0]}
                    opacity={0.65}
                    scale={4.5}
                    blur={2.2}
                    far={4}
                  />
                </>
              )}
            </group>

            {/* Orbit Controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={(3 * Math.PI) / 4}
              autoRotate={autoRotate}
              autoRotateSpeed={1.2}
              onStart={() => setAutoRotate(false)}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM INTERACTIVE TABS & SENSORY MATRIX
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 p-4 sm:p-5 space-y-3 pointer-events-auto">
        {/* Sensory Matrix Floating Bar */}
        <div
          className={`grid grid-cols-4 gap-2 p-2.5 rounded-2xl border backdrop-blur-md text-center text-xs shadow-md ${
            isDarkMode
              ? 'bg-zinc-900/90 border-zinc-700/60'
              : 'bg-white/95 border-border-light'
          }`}
        >
          <div>
            <span className={`text-[10px] block font-semibold uppercase ${isDarkMode ? 'text-zinc-400' : 'text-text-tertiary'}`}>
              Sweetness
            </span>
            <span className={`font-bold font-mono ${isDarkMode ? 'text-accent-light' : 'text-primary'}`}>
              {sensoryData.brix}
            </span>
          </div>
          <div>
            <span className={`text-[10px] block font-semibold uppercase ${isDarkMode ? 'text-zinc-400' : 'text-text-tertiary'}`}>
              Crispness
            </span>
            <span className={`font-bold font-mono ${isDarkMode ? 'text-accent-light' : 'text-primary'}`}>
              {sensoryData.crispness}
            </span>
          </div>
          <div>
            <span className={`text-[10px] block font-semibold uppercase ${isDarkMode ? 'text-zinc-400' : 'text-text-tertiary'}`}>
              Aroma
            </span>
            <span className={`font-bold truncate block ${isDarkMode ? 'text-zinc-200' : 'text-text-primary'}`}>
              {sensoryData.aroma}
            </span>
          </div>
          <div>
            <span className={`text-[10px] block font-semibold uppercase ${isDarkMode ? 'text-zinc-400' : 'text-text-tertiary'}`}>
              Wax Polish
            </span>
            <span className="font-bold text-emerald-500 font-mono">0.0% Wax</span>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Presentation Mode Switcher */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border backdrop-blur-md text-xs shadow-sm ${
              isDarkMode
                ? 'bg-zinc-900/80 border-zinc-700/60'
                : 'bg-white border-border-medium'
            }`}
          >
            <button
              type="button"
              onClick={() => handleModeChange('showcase')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                presentationMode === 'showcase'
                  ? 'bg-accent text-white shadow-sm'
                  : isDarkMode
                  ? 'text-zinc-300 hover:text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('whole')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                presentationMode === 'whole'
                  ? 'bg-accent text-white shadow-sm'
                  : isDarkMode
                  ? 'text-zinc-300 hover:text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Slice className="w-3.5 h-3.5" />
              <span>Whole</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('anatomy')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                presentationMode === 'anatomy'
                  ? 'bg-accent text-white shadow-sm'
                  : isDarkMode
                  ? 'text-zinc-300 hover:text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inside</span>
            </button>
          </div>

          {/* 360 Rotation Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              autoRotate
                ? isDarkMode
                  ? 'bg-zinc-700 text-white'
                  : 'bg-primary text-white'
                : isDarkMode
                ? 'bg-zinc-900/80 text-zinc-300 border border-zinc-700'
                : 'bg-white text-text-primary border border-border-medium hover:bg-background-tertiary'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{autoRotate ? '360° Rotating' : 'Rotate Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppleVarietiesShowcase;
