'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Eye, ShieldCheck, Loader2 } from 'lucide-react';
import { renderBuilderCard, renderPfpFrame } from '../lib/canvasRenderer';
import { BuilderState } from '../types/builder';

interface BuilderPreviewProps {
  state: BuilderState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCompiling: boolean;
  setIsCompiling: (compiling: boolean) => void;
  onStateChange?: (updates: Partial<BuilderState>) => void;
}

export default function BuilderPreview({
  state,
  canvasRef,
  isCompiling,
  setIsCompiling,
  onStateChange,
}: BuilderPreviewProps) {
  const [userImgElement, setUserImgElement] = useState<{ src: string; img: HTMLImageElement } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!state.imageUrl) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: state.positionX,
      posY: state.positionY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !onStateChange) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const sensitivity = 0.4 / state.zoom;
    
    const newPosX = Math.max(-100, Math.min(100, dragStartRef.current.posX + Math.round(dx * sensitivity)));
    const newPosY = Math.max(-100, Math.min(100, dragStartRef.current.posY - Math.round(dy * sensitivity)));

    onStateChange({
      positionX: newPosX,
      positionY: newPosY,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!state.imageUrl || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      posX: state.positionX,
      posY: state.positionY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !onStateChange || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;

    const sensitivity = 0.55 / state.zoom;
    
    const newPosX = Math.max(-100, Math.min(100, dragStartRef.current.posX + Math.round(dx * sensitivity)));
    const newPosY = Math.max(-100, Math.min(100, dragStartRef.current.posY - Math.round(dy * sensitivity)));

    onStateChange({
      positionX: newPosX,
      positionY: newPosY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Load the uploaded image into an HTMLImageElement
  useEffect(() => {
    if (!state.imageUrl) {
      return;
    }

    const imageUrl = state.imageUrl;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUserImgElement({ src: imageUrl, img });
    };
    img.onerror = () => {
      console.error('Failed to load image element');
    };
    img.src = imageUrl;
  }, [state.imageUrl]);

  // Redraw the canvas on any state or image change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = true;

    const draw = async () => {
      setIsCompiling(true);
      try {
        const activeImage = userImgElement?.src === state.imageUrl ? userImgElement.img : null;
        if (state.mode === 'card') {
          await renderBuilderCard(canvas, state, activeImage);
        } else {
          await renderPfpFrame(canvas, state, activeImage);
        }

        if (active) {
          const url = canvas.toDataURL('image/png');
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error('Canvas render error:', err);
      } finally {
        if (active) {
          setIsCompiling(false);
        }
      }
    };

    // Small debounce or immediate draw (since canvas drawing takes ~15ms)
    draw();

    return () => {
      active = false;
    };
  }, [
    state,
    userImgElement,
    canvasRef,
    setIsCompiling
  ]);

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-3 font-mono">
      {/* Viewport Control Panel */}
      <div className="w-full border border-[#053d24] bg-hh-darker/60 rounded overflow-hidden shadow-xl">
        <div className="flex items-center justify-between gap-2 border-b border-[#053d24] px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] text-gray-400 bg-hh-darkest/40">
          <div className="min-w-0 flex items-center gap-2">
            <Eye size={12} className="text-hh-yellow" />
            <span className="font-bold tracking-widest uppercase truncate">VIEWPORT_MONITOR_01</span>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden min-[390px]:inline text-[9px] uppercase tracking-wider text-green-400 font-bold">LIVE_PREVIEW</span>
          </div>
        </div>

        {/* Preview Frame Wrapper */}
        <div className="relative w-full bg-hh-darkest flex items-center justify-center p-2.5 min-[390px]:p-3 sm:p-6 min-h-[260px] sm:min-h-[300px] scanlines">
          {/* Offscreen compilation canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Core compiled image */}
          {previewUrl ? (
            <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
              <div 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative max-w-full max-h-[62vh] sm:max-h-[500px] w-auto h-auto shadow-2xl border border-[#053d24] rounded-sm group overflow-hidden select-none touch-none transition-shadow duration-200 ${
                  state.imageUrl 
                    ? isDragging 
                      ? 'cursor-grabbing shadow-hh-yellow/10' 
                      : 'cursor-grab hover:shadow-hh-yellow/5' 
                    : 'cursor-default'
                }`}
              >
                <img
                  src={previewUrl}
                  alt="HH Goa Builder Identity Preview"
                  className="max-w-full max-h-[62vh] sm:max-h-[500px] w-auto h-auto object-contain block pointer-events-none"
                />
                
                {/* Scan indicator overlay */}
                <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-hh-yellow/10 transition-colors">
                  {/* Horizontal scanner bar animation */}
                  <div className="absolute left-0 w-full h-[2px] bg-hh-yellow/15 shadow-[0_0_8px_rgba(243,224,59,0.3)] animate-scan top-0" />
                </div>
              </div>
              
              {state.imageUrl && (
                <div className="px-2 text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest text-center mt-0.5 animate-pulse-slow">
                  Drag the preview to position your photo
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 sm:py-16 text-center">
              <Loader2 className="animate-spin text-hh-yellow" size={24} />
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">
                INITIALIZING COMPILER PROTOCOLS...
              </p>
            </div>
          )}

          {/* Quick loading state indicator */}
          {isCompiling && (
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-hh-darkest/90 border border-hh-yellow text-hh-yellow text-[8px] sm:text-[9px] px-2 sm:px-2.5 py-1 rounded flex items-center gap-1.5 uppercase font-bold tracking-widest animate-pulse-slow">
              <Loader2 className="animate-spin" size={10} />
              <span>COMPILING_ASSETS</span>
            </div>
          )}
        </div>
      </div>

      {/* Helper instruction */}
      <div className="flex items-center gap-1.5 px-1.5 text-[8px] sm:text-[9px] text-gray-600 justify-center text-center">
        <ShieldCheck size={11} className="text-green-800" />
        <span>COMPILE SECURE // PHOTO REMAINS CLIENT-SIDE ONLY</span>
      </div>
    </div>
  );
}
