'use client';

import React, { useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import { downloadCanvasImage } from '../lib/share';
import { BuilderState } from '../types/builder';

interface ShareButtonsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  state: BuilderState;
  disabled: boolean;
}

export default function ShareButtons({
  canvasRef,
  state,
  disabled,
}: ShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const getCleanFilename = (): string => {
    const cleanName = state.name
      ? state.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
      : '';
      
    if (state.mode === 'pfp') {
      return `hh-goa-2026-pfp${cleanName ? `-${cleanName}` : ''}.png`;
    }
    return `hh-goa-2026-builder-${cleanName || 'card'}.png`;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const filename = getCleanFilename();
      downloadCanvasImage(canvas, filename);
      setDownloadSuccess(true);
      
      // Reset success checkmark after 3 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    const xWindow = window.open('about:blank', '_blank');
    if (xWindow) {
      xWindow.opener = null;
    }
    setIsSharing(true);
    try {
      const filename = getCleanFilename();
      
      // Convert canvas to blob for upload
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Blob generation failed');

      // Upload to server
      const formData = new FormData();
      formData.append('image', blob, filename);

      const res = await fetch('/api/share', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Share upload failed');
      const data = await res.json();
      if (!data.url || typeof data.url !== 'string') {
        throw new Error('Share upload response did not include an image URL');
      }
      
      const origin = window.location.origin;
      const url = `${origin}/share?img=${encodeURIComponent(data.url)}`;

      const customCaption = `I just unlocked my HH Goa 2026 builder identity ⚡

NAME: ${state.name || 'Anonymous'}
STACK: ${state.stack || 'General'}
ROLE: ${state.role || 'Developer'}
TEAM: ${state.builderTitle || 'Still Searching'}

Ready to build, break, and ship in Goa.

#FrameInGoa #HHGoa @247pmstudio`;

      // Direct redirect to X tweet intent
      const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(customCaption)}&url=${encodeURIComponent(url)}`;
      if (xWindow) {
        xWindow.location.href = xUrl;
      } else {
        window.location.href = xUrl;
      }
    } catch (err) {
      xWindow?.close();
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Share request aborted');
      } else {
        console.error('Sharing failed:', err);
        alert('Could not compile share link. Please download the image and attach it directly to your share post!');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 min-[390px]:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2 font-mono">
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className={`touch-target bg-hh-yellow text-hh-dark hover:bg-white active:scale-[0.98] transition-all font-bold text-[10px] sm:text-xs tracking-wider uppercase py-3 px-3 sm:px-5 rounded flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-hh-yellow/10 disabled:opacity-50 disabled:pointer-events-none`}
      >
        {downloadSuccess ? (
          <>
            <Check size={16} className="text-green-800" />
            <span>IMAGE_DOWNLOADED</span>
          </>
        ) : isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-hh-dark border-t-transparent rounded-full animate-spin" />
            <span>SAVING_FILE...</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>DOWNLOAD {state.mode === 'pfp' ? 'PFP' : 'CARD'}</span>
          </>
        )}
      </button>

      {/* Share to X Button */}
      <button
        onClick={handleShare}
        disabled={disabled || isSharing}
        className={`touch-target border border-hh-pink hover:bg-hh-pink hover:text-white text-hh-pink active:scale-[0.98] transition-all font-bold text-[10px] sm:text-xs tracking-wider uppercase py-3 px-3 sm:px-5 rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none bg-hh-darker/30`}
      >
        {isSharing ? (
          <>
            <div className="w-4 h-4 border-2 border-hh-pink border-t-transparent rounded-full animate-spin" />
            <span>CONNECTING_SHARE...</span>
          </>
        ) : (
          <>
            <Share2 size={16} />
            <span>SHARE TO X</span>
          </>
        )}
      </button>
    </div>
  );
}
