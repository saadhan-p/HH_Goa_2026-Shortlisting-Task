'use client';

import React, { useState, useRef } from 'react';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

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
      
      const origin = window.location.origin;
      const url = `${origin}/share?img=${encodeURIComponent(data.url)}`;
      setShareUrl(url);
      const customCaption = `I just unlocked my HH Goa 2026 builder identity ⚡

NAME: ${state.name || 'Anonymous'}
CLASS: ${state.builderTitle || 'The Unknown Codec'}
STACK: ${state.stack || 'General'}

Ready to build, break, and ship in Goa.

#FrameInGoa #HHGoa @247pmstudio`;

      // Construct native share file
      const file = new File([blob], filename, { type: 'image/png' });
      const nav = navigator as any;

      if (
        'share' in nav &&
        'canShare' in nav &&
        nav.canShare({ files: [file] })
      ) {
        // Share via native sharing panel
        await nav.share({
          files: [file],
          title: 'HH Goa 2026 Builder Card',
          text: `${customCaption}\n\n`,
        });
      } else if ('share' in nav) {
        // Fallback to sharing URL natively
        await nav.share({
          title: 'HH Goa 2026 Builder Card',
          text: customCaption,
          url: url,
        });
      } else {
        // Open fallback modal
        setShowShareModal(true);
      }
    } catch (err) {
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  const handleShareToX = () => {
    const customCaption = `I just unlocked my HH Goa 2026 builder identity ⚡

NAME: ${state.name || 'Anonymous'}
CLASS: ${state.builderTitle || 'The Unknown Codec'}
STACK: ${state.stack || 'General'}

Ready to build, break, and ship in Goa.

#FrameInGoa #HHGoa @247pmstudio`;

    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customCaption)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 pt-2 font-mono">
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className={`flex-1 touch-target bg-hh-yellow text-hh-dark hover:bg-white active:scale-[0.98] transition-all font-bold text-xs tracking-wider uppercase py-3 px-5 rounded flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-hh-yellow/10 disabled:opacity-50 disabled:pointer-events-none`}
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
        className={`flex-1 touch-target border border-hh-pink hover:bg-hh-pink hover:text-white text-hh-pink active:scale-[0.98] transition-all font-bold text-xs tracking-wider uppercase py-3 px-5 rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none bg-hh-darker/30`}
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

      {/* Fallback Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-hh-darker border border-hh-pink max-w-md w-full rounded-lg p-6 space-y-5 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#053d24] pb-3 text-xs font-bold text-hh-yellow uppercase tracking-widest">
              <span>SHARE_IDENTITY_PROTOCOL</span>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer p-1 hover:bg-hh-darkest/50 rounded transition-all text-xs font-bold"
              >
                [X]
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs">
              <p className="text-gray-400 leading-relaxed uppercase tracking-wider text-[9px]">
                Your builder identity is hosted. Share this link for full social media card preview renders:
              </p>

              {/* Link Input & Copy */}
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-hh-darkest border border-[#053d24] rounded px-3 py-2 text-gray-300 font-mono text-[9px] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 bg-hh-yellow text-hh-dark hover:bg-white font-bold uppercase tracking-wider rounded transition-all active:scale-95 cursor-pointer text-[10px] whitespace-nowrap min-h-[34px]"
                >
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>

              {/* Share actions */}
              <button
                onClick={handleShareToX}
                className="w-full touch-target bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold uppercase tracking-wider py-3 rounded flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-xs"
              >
                <span>POST TO X (TWITTER)</span>
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full border border-[#053d24] text-gray-400 hover:text-white hover:border-gray-500 font-bold uppercase tracking-wider py-2.5 rounded flex items-center justify-center transition-all active:scale-95 text-[10px] cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            {/* Aesthetic Tech Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-hh-yellow pointer-events-none rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-hh-yellow pointer-events-none rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-hh-yellow pointer-events-none rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-hh-yellow pointer-events-none rounded-br-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
