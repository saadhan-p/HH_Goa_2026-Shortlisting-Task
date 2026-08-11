'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

interface ImageEditorProps {
  zoom: number;
  positionX: number;
  positionY: number;
  onChange: (updates: { zoom?: number; positionX?: number; positionY?: number }) => void;
  onReset: () => void;
}

export default function ImageEditor({
  zoom,
  positionX,
  positionY,
  onChange,
  onReset,
}: ImageEditorProps) {
  return (
    <div className="w-full border border-[#053d24] bg-hh-darker/40 p-4 rounded font-mono text-xs space-y-5">
      <div className="flex items-center justify-between border-b border-[#053d24] pb-2 text-[10px] text-gray-500 uppercase tracking-widest">
        <span>IMAGE_CALIBRATION_PROTOCOL</span>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-hh-pink hover:text-white cursor-pointer touch-target px-2 rounded hover:bg-hh-darkest/50 transition-all active:scale-95"
        >
          <RotateCcw size={10} />
          <span>RESET</span>
        </button>
      </div>

      {/* Zoom Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-gray-400">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
            <ZoomIn size={12} className="text-hh-yellow" />
            ZOOM SCALE
          </span>
          <span className="text-white text-xs">{(zoom * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-3">
          <ZoomOut size={14} className="text-gray-500" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
            className="flex-1 h-1.5 bg-hh-darkest rounded-lg appearance-none cursor-pointer accent-hh-yellow focus:outline-none"
            style={{ padding: '10px 0' }} // touch friendly height
          />
          <ZoomIn size={14} className="text-hh-yellow" />
        </div>
      </div>

      {/* Positioning Coordinates */}
      <div className="space-y-4 pt-1">
        {/* Horizontal Position X */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
              <Move size={12} className="text-hh-yellow" />
              HORIZONTAL SHIFT
            </span>
            <span className="text-white text-xs">{positionX}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs font-bold">L</span>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={positionX}
              onChange={(e) => onChange({ positionX: parseInt(e.target.value) })}
              className="flex-1 h-1.5 bg-hh-darkest rounded-lg appearance-none cursor-pointer accent-hh-yellow focus:outline-none"
              style={{ padding: '10px 0' }}
            />
            <span className="text-hh-yellow text-xs font-bold">R</span>
          </div>
        </div>

        {/* Vertical Position Y */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
              <Move size={12} className="text-hh-yellow" />
              VERTICAL SHIFT
            </span>
            <span className="text-white text-xs">{positionY}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs font-bold">D</span>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={positionY}
              onChange={(e) => onChange({ positionY: parseInt(e.target.value) })}
              className="flex-1 h-1.5 bg-hh-darkest rounded-lg appearance-none cursor-pointer accent-hh-yellow focus:outline-none"
              style={{ padding: '10px 0' }}
            />
            <span className="text-hh-yellow text-xs font-bold">U</span>
          </div>
        </div>
      </div>
    </div>
  );
}
