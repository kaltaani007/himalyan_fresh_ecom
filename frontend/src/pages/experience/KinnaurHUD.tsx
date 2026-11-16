import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Compass } from 'lucide-react';
import { TOTAL_FRAMES } from '@/utils/frameSequence';

interface KinnaurHUDProps {
  currentFrame: number;
  progress: number;
  onScrub: (percentage: number) => void;
}

export const KinnaurHUD: React.FC<KinnaurHUDProps> = ({
  currentFrame,
  progress,
  onScrub,
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Synthesize gentle mountain breeze atmosphere using Web Audio API (zero external mp3 dependency)
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

          // Pink/brown noise generator for gentle mountain wind
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

          // Low-pass filter for deep wind rumble
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
        // AudioContext disabled or blocked
      }
    }
  };

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  // Determine current chapter title based on progress
  const getChapterName = () => {
    if (progress < 0.2) return 'Chapter I · Mountain Origin';
    if (progress < 0.45) return 'Chapter II · 100% Wax-Free Cuticle';
    if (progress < 0.7) return 'Chapter III · Exploded Anatomy & 14.8° Brix';
    if (progress < 0.88) return 'Chapter IV · Heritage Genetics & Glacier Runoff';
    return 'Chapter V · Reassembly & Harvest Reservation';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none select-none pb-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
        {/* Left: Frame Telemetry & Current Chapter */}
        <div className="flex items-center gap-2 bg-[#070b09]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg text-xs">
          <Compass className="w-3.5 h-3.5 text-accent animate-spin-slow" />
          <span className="font-mono font-bold text-accent-light">
            FRAME {String(currentFrame + 1).padStart(3, '0')} / {TOTAL_FRAMES}
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-cream-100/70 font-medium hidden sm:inline">
            {getChapterName()}
          </span>
        </div>

        {/* Center: Interactive Scrubber Track (visible on medium+ screens) */}
        <div className="hidden md:flex items-center gap-3 bg-[#070b09]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg flex-1 max-w-md">
          <span className="text-[10px] font-mono text-cream-200/50">0%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.002"
            value={progress}
            onChange={(e) => onScrub(parseFloat(e.target.value))}
            className="w-full accent-accent h-1.5 bg-white/10 rounded-lg cursor-pointer"
            title="Drag to scrub image sequence"
          />
          <span className="text-[10px] font-mono text-cream-200/50">100%</span>
        </div>

        {/* Right: Sound Atmosphere Toggle */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg border cursor-pointer ${
            isAudioPlaying
              ? 'bg-accent/20 text-accent-light border-accent/40 shadow-[0_0_15px_rgba(200,150,44,0.3)]'
              : 'bg-[#070b09]/80 text-cream-100/60 border-white/10 hover:text-white'
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
  );
};

export default KinnaurHUD;
