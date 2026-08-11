import React from 'react';

interface ModeSelectorProps {
  mode: 'card' | 'pfp';
  onChange: (mode: 'card' | 'pfp') => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="w-full flex items-center justify-center p-1 border border-[#053d24] bg-hh-darker rounded overflow-hidden">
      <button
        onClick={() => onChange('card')}
        className={`flex-1 py-2 px-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all touch-target cursor-pointer rounded-sm ${
          mode === 'card'
            ? 'bg-hh-yellow text-hh-dark shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="hidden min-[390px]:inline">[ BUILDER CARD ]</span>
        <span className="min-[390px]:hidden">CARD</span>
      </button>
      
      <button
        onClick={() => onChange('pfp')}
        className={`flex-1 py-2 px-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all touch-target cursor-pointer rounded-sm ${
          mode === 'pfp'
            ? 'bg-hh-yellow text-hh-dark shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="hidden min-[390px]:inline">[ PFP FRAME ]</span>
        <span className="min-[390px]:hidden">PFP</span>
      </button>
    </div>
  );
}
