import React from 'react';
import { Sparkles } from 'lucide-react';

interface WebGLFallbackProps {
  imageSrc?: string;
  alt?: string;
  badgeText?: string;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80',
  alt = 'Premium Himalayan Apples',
  badgeText = 'Farm Fresh Daily',
}) => {
  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border-light group">
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-primary flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          {badgeText}
        </span>
      </div>
    </div>
  );
};

export default WebGLFallback;
