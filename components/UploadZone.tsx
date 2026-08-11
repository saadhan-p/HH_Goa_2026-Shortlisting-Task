'use client';

import React, { useRef, useState } from 'react';
import { Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { convertHeicToJpeg } from '../lib/heic';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    
    // Validate File Size (Max 20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg('That image is too large. Try a photo under 20 MB.');
      return;
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isHEIC = fileType === 'image/heic' || fileType === 'image/heif' || fileName.endsWith('.heic') || fileName.endsWith('.heif');

    if (isHEIC) {
      setIsConverting(true);
      try {
        const jpegBlob = await convertHeicToJpeg(file);
        const jpegFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg',
        });
        onFileSelect(jpegFile);
      } catch {
        setErrorMsg('Your HEIC photo couldn\'t be processed. Try another image.');
      } finally {
        setIsConverting(false);
      }
      return;
    }

    const isSupported = fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg';
    if (!isSupported) {
      setErrorMsg('That image format isn\'t supported. Try JPG, PNG, or HEIC.');
      return;
    }

    // Normal supported image
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3 font-mono">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onZoneClick}
        className={`w-full min-h-[124px] sm:min-h-[160px] border-2 border-dashed rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-hh-yellow bg-hh-darker/70 scale-[1.01]'
            : 'border-[#053d24] bg-hh-darker/35 hover:border-hh-yellow/60 hover:bg-hh-darker/50'
        } ${isConverting ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, .heic, .heif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isConverting}
        />

        {isConverting ? (
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <Loader2 className="animate-spin text-hh-yellow" size={28} />
            <p className="text-xs sm:text-sm font-bold text-hh-yellow uppercase tracking-wider animate-pulse-slow">
              PROCESSING HEIC PHOTO...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 border border-[#053d24] rounded-full text-gray-400 bg-hh-darkest/50">
              <Upload size={20} className="text-hh-yellow" />
            </div>
            
            <div>
              <p className="text-xs sm:text-sm text-white font-bold uppercase tracking-wider">
                DROP YOUR PHOTO OR TAP TO SELECT
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase">
                JPG / PNG / HEIC (MAX 20MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="w-full bg-[#3d0505]/40 border border-[#8a1c1c] text-[#ff6b6b] p-3 rounded flex items-start gap-2.5 text-[10px] sm:text-xs">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 uppercase tracking-wide">
            <span className="font-bold">COMPILATION_ERROR:</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
