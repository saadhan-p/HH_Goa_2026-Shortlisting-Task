import React from 'react';
import { Terminal, Shield, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: (mode: 'card' | 'pfp') => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative w-full max-w-4xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center text-center font-mono scanlines">
      {/* Visual Terminal Prompt */}
      <div className="flex items-center gap-2 border border-[#053d24] bg-hh-darker px-3 py-1.5 rounded text-xs text-hh-yellow animate-pulse-slow mb-6">
        <Terminal size={14} />
        <span>SYS_STATUS: ONLINE // HACKER_RESIDENCY_READY</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 leading-none">
        HH GOA 2026
      </h1>
      
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-hh-yellow mb-8 leading-none glow-yellow">
        BUILDER IDENTITY.
      </h2>

      {/* Supporting Copy */}
      <div className="max-w-xl text-sm sm:text-base text-gray-400 mb-10 space-y-2 border-l-2 border-hh-pink pl-4 text-left">
        <p className="font-bold text-white uppercase tracking-wider text-xs">Genesis Protocol 0x247:</p>
        <p>1. Upload your developer photograph.</p>
        <p>2. Configure your primary tech stack & title.</p>
        <p>3. Generate your cryptographic Builder ID card or PFP frame.</p>
        <p className="text-xs text-gray-500 italic">No credentials. No databases. Direct client compile.</p>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 max-w-md">
        <button
          onClick={() => onStart('card')}
          className="flex-1 touch-target bg-hh-yellow text-hh-dark hover:bg-white active:scale-[0.98] transition-all font-bold text-sm tracking-wider uppercase py-3.5 px-6 rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-hh-yellow/20"
        >
          CREATE MY BUILDER CARD
          <ArrowRight size={16} />
        </button>
        
        <button
          onClick={() => onStart('pfp')}
          className="flex-1 touch-target border border-[#053d24] text-gray-300 hover:text-white hover:border-hh-pink active:scale-[0.98] transition-all font-bold text-sm tracking-wider uppercase py-3.5 px-6 rounded flex items-center justify-center gap-2 cursor-pointer bg-hh-darker/50"
        >
          MAKE MY PFP
        </button>
      </div>

      {/* Bottom coordinate indicators */}
      <div className="mt-12 text-[10px] text-gray-600 flex gap-6">
        <span>LOC: 15.2993° N, 74.1240° E</span>
        <span>RESIDENCY // 28—31 OCT 2026</span>
      </div>
    </section>
  );
}
