import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface KinnaurNavbarProps {
  progress: number;
  onNavigateToSection: (percentage: number) => void;
  onOpenDossier: () => void;
  onReserve: () => void;
}

export const KinnaurNavbar: React.FC<KinnaurNavbarProps> = ({
  progress,
  onNavigateToSection,
  onOpenDossier,
  onReserve,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-[#070b09]/80 backdrop-blur-md border-b border-white/10 select-none transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Home Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-cream-100/70 hover:text-white transition-colors"
            title="Return to Main Store"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Himalayan Fresh</span>
          </Link>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Kinnaur Royal Red
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/30 font-semibold hidden md:inline-block">
              2024 Harvest
            </span>
          </div>
        </div>

        {/* Center: Minimal Apple-Style Section Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => onNavigateToSection(0.05)}
            className={`transition-colors cursor-pointer ${
              progress < 0.2 ? 'text-accent-light font-semibold' : 'text-cream-100/60 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigateToSection(0.3)}
            className={`transition-colors cursor-pointer ${
              progress >= 0.2 && progress < 0.45 ? 'text-accent-light font-semibold' : 'text-cream-100/60 hover:text-white'
            }`}
          >
            Mountain Cuticle
          </button>
          <button
            type="button"
            onClick={() => onNavigateToSection(0.55)}
            className={`transition-colors cursor-pointer ${
              progress >= 0.45 && progress < 0.7 ? 'text-accent-light font-semibold' : 'text-cream-100/60 hover:text-white'
            }`}
          >
            Anatomy & Brix
          </button>
          <button
            type="button"
            onClick={() => onNavigateToSection(0.75)}
            className={`transition-colors cursor-pointer ${
              progress >= 0.7 && progress < 0.88 ? 'text-accent-light font-semibold' : 'text-cream-100/60 hover:text-white'
            }`}
          >
            Terroir
          </button>
          <button
            type="button"
            onClick={() => onNavigateToSection(0.95)}
            className={`transition-colors cursor-pointer ${
              progress >= 0.88 ? 'text-accent-light font-semibold' : 'text-cream-100/60 hover:text-white'
            }`}
          >
            Reserve Batch
          </button>
        </nav>

        {/* Right: Technical Dossier + Luxury CTA */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDossier}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-cream-100/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Dossier</span>
          </button>

          <button
            type="button"
            onClick={onReserve}
            className="relative group px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-[0_0_16px_rgba(200,150,44,0.3)] hover:shadow-[0_0_24px_rgba(200,150,44,0.5)] transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cream-100" />
            <span>Reserve Batch — ₹599</span>
          </button>
        </div>
      </div>

      {/* Hairline Live Scrub Progress Line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#8a0a0c] via-[#d03a30] to-[#c8962c] transition-all duration-75"
        style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
      />
    </header>
  );
};

export default KinnaurNavbar;
