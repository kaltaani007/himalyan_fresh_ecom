import React from 'react';
import { X, Mountain, ShieldCheck, Droplets, Sun, Sparkles, CheckCircle2 } from 'lucide-react';

interface TerroirDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserve: () => void;
}

export const TerroirDossierModal: React.FC<TerroirDossierModalProps> = ({
  isOpen,
  onClose,
  onReserve,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#0b110d] border-l border-white/15 shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between text-white z-10 animate-slide-left">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-accent uppercase">
                Agronomic Laboratory Dossier · Batch #KIN-2024
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-1 text-white">
                Kinnaur Royal Red Terroir
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-cream-100 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Telemetry Cards */}
          <div className="space-y-6 py-6">
            {/* 1. Altitude & Soil */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-accent-light flex items-center gap-2 uppercase">
                <Mountain className="w-4 h-4 text-accent" />
                <span>Geographical Terroir</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="text-cream-200/60 block text-[10px] uppercase font-mono">Elevation</span>
                  <span className="text-base font-bold text-white font-mono">2,750m ASL</span>
                  <p className="text-[11px] text-cream-100/60 mt-1">Kalpa & Sangla Valleys, Kinnaur</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="text-cream-200/60 block text-[10px] uppercase font-mono">Water Source</span>
                  <span className="text-base font-bold text-white font-mono">Glacier Melt</span>
                  <p className="text-[11px] text-cream-100/60 mt-1">Kinner Kailash mineral channels</p>
                </div>
              </div>
            </div>

            {/* 2. Sugar & Acidity Lab Benchmarks */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-accent-light flex items-center gap-2 uppercase">
                <Droplets className="w-4 h-4 text-accent" />
                <span>Sugar & Density Benchmarks</span>
              </h4>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream-100 font-medium">Kinnaur Royal Red Sweetness</span>
                    <span className="font-mono font-bold text-accent-light">14.8° Brix</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream-200/60 font-medium">Commercial Supermarket Apple</span>
                    <span className="font-mono text-cream-200/60">11.2° Brix</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-white/30 h-full rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Purity & Residue Testing */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-accent-light flex items-center gap-2 uppercase">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Purity & Chemical Screening</span>
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Petroleum Paraffin Wax', value: '0.0% (Zero Detected)', icon: CheckCircle2 },
                  { name: 'Post-Harvest Diphenylamine (DPA)', value: '0.0 ppm', icon: CheckCircle2 },
                  { name: 'Artificial Artificial Color Enhancers', value: 'None (Natural UV Blush)', icon: Sun },
                  { name: 'Packaging Biodegradability', value: '100% Recyclable Honeycomb Pulp', icon: CheckCircle2 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-cream-100">
                      <item.icon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onReserve();
            }}
            className="w-full py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8a0a0c] via-[#b31e21] to-[#c8962c] shadow-[0_0_20px_rgba(200,150,44,0.4)] hover:shadow-[0_0_30px_rgba(200,150,44,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Reserve 2024 Harvest Box — ₹599</span>
          </button>
          <p className="text-[11px] text-center text-cream-200/50">
            Backed by Himalayan Fresh direct farmer guarantees. 100% money back if not satisfied.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerroirDossierModal;
