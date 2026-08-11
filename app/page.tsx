'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Hero from '../components/Hero';
import ModeSelector from '../components/ModeSelector';
import UploadZone from '../components/UploadZone';
import ImageEditor from '../components/ImageEditor';
import BuilderForm from '../components/BuilderForm';
import BuilderPreview from '../components/BuilderPreview';
import ShareButtons from '../components/ShareButtons';
import Footer from '../components/Footer';
import { BuilderState } from '../types/builder';

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Centralized state model
  const [state, setState] = useState<BuilderState>({
    mode: 'card',
    image: null,
    imageUrl: null,
    name: '',
    role: '',
    stack: '',
    builderTitle: 'THE UNKNOWN CODEC',
    zoom: 1.0,
    positionX: 0,
    positionY: 0,
  });

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (state.imageUrl) {
        URL.revokeObjectURL(state.imageUrl);
      }
    };
  }, [state.imageUrl]);

  const handleStart = (selectedMode: 'card' | 'pfp') => {
    setState((prev) => ({ ...prev, mode: selectedMode }));
    setShowGenerator(true);
  };

  const handleFileSelect = (file: File) => {
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
    }
    const url = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      image: file,
      imageUrl: url,
      zoom: 1.0,
      positionX: 0,
      positionY: 0,
    }));
  };

  const handleStateChange = (updates: Partial<BuilderState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetImage = () => {
    setState((prev) => ({
      ...prev,
      zoom: 1.0,
      positionX: 0,
      positionY: 0,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-hh-dark tech-grid relative font-mono text-white">
      {/* Scanning bar overlay across landing page */}
      {!showGenerator && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="w-full h-[1px] bg-hh-yellow/10 animate-scan top-0" />
        </div>
      )}

      {/* Main Header / Navigation */}
      <header className="w-full border-b border-[#053d24] bg-hh-darker/80 backdrop-blur-md sticky top-0 z-40 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4">
          <div 
            onClick={() => setShowGenerator(false)} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-bold text-sm tracking-wider hover:text-hh-yellow transition-colors flex items-center gap-1.5">
              HH GOA 2026 <span className="text-hh-pink group-hover:text-hh-yellow transition-colors">// IDENTITY</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="hidden sm:inline border border-[#053d24] bg-hh-darkest/60 px-2 py-0.5 rounded text-green-400 uppercase tracking-widest text-[9px] font-bold">
              SYS_REV // 1.0.2
            </span>
            <a
              href="https://hacker-house-goa-2026.devfolio.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-hh-yellow flex items-center gap-0.5 touch-target p-1 border border-transparent hover:border-[#053d24] hover:bg-hh-darkest/50 rounded transition-all"
            >
              DEVFOLIO
              <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {!showGenerator ? (
          <Hero onStart={handleStart} />
        ) : (
          <div className="w-full flex flex-col gap-6 animate-fadeIn">
            {/* Back button */}
            <div className="flex">
              <button
                onClick={() => setShowGenerator(false)}
                className="touch-target border border-[#053d24] hover:border-hh-yellow bg-hh-darker/40 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 transition-all cursor-pointer hover:bg-hh-darkest/60 active:scale-95"
              >
                <ArrowLeft size={14} />
                BACK_TO_HOME
              </button>
            </div>

            {/* Grid Layout - Responsive Column Splits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Controls Column (left on desktop, bottom on mobile if preview fits first) */}
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
                <div className="border border-[#053d24] bg-hh-darker/20 p-5 rounded-lg space-y-5">
                  <div className="flex items-center justify-between border-b border-[#053d24] pb-3 text-xs font-bold text-hh-yellow uppercase tracking-widest">
                    <span>CONSTRUCT_PARAMETERS</span>
                    <span className="text-[10px] text-gray-500">INIT // ID_GENERATION</span>
                  </div>

                  {/* Mode Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest">
                      CHOOSE GENERATOR FORMAT
                    </label>
                    <ModeSelector
                      mode={state.mode}
                      onChange={(m) => handleStateChange({ mode: m })}
                    />
                  </div>

                  {/* Upload Area */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest">
                      UPLOAD PORTRAIT PHOTO
                    </label>
                    <UploadZone onFileSelect={handleFileSelect} />
                  </div>

                  {/* Positioning Sliders (Shown only after image upload) */}
                  {state.imageUrl && (
                    <ImageEditor
                      zoom={state.zoom}
                      positionX={state.positionX}
                      positionY={state.positionY}
                      onChange={handleStateChange}
                      onReset={handleResetImage}
                    />
                  )}

                  {/* Form Details */}
                  <BuilderForm
                    name={state.name}
                    stack={state.stack}
                    role={state.role}
                    builderTitle={state.builderTitle}
                    onChange={handleStateChange}
                  />
                </div>
              </div>

              {/* Viewport/Preview Column (right on desktop, top on mobile) */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 lg:sticky lg:top-24">
                <BuilderPreview
                  state={state}
                  canvasRef={canvasRef}
                  isCompiling={isCompiling}
                  setIsCompiling={setIsCompiling}
                  onStateChange={handleStateChange}
                />

                {/* Compile Actions */}
                <ShareButtons
                  canvasRef={canvasRef}
                  state={state}
                  disabled={isCompiling}
                />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
