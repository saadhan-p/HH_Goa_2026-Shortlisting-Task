import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#053d24] bg-hh-darker py-5 sm:py-6 mt-auto px-3 sm:px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500 font-mono">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-white font-bold">
            HH GOA 2026 // <span className="text-hh-yellow">BUILDER IDENTITY</span>
          </p>
          <p>© 2026 HH-Goa. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:gap-6 text-gray-400">
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hh-yellow transition-colors touch-target flex items-center"
          >
            OFFICIAL SITE
          </a>
          <a
            href="https://hacker-house-goa-2026.devfolio.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hh-yellow transition-colors touch-target flex items-center"
          >
            DEVFOLIO PORTAL
          </a>
          <a
            href="https://x.com/247pmstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hh-pink transition-colors touch-target flex items-center"
          >
            @247PMSTUDIO
          </a>
        </div>

        <div className="text-center md:text-right text-[9px] sm:text-[10px] text-gray-600">
          <p>SYS_REV // HACKER_HOUSE_GOA_2026</p>
          <p>COMPILE_STATE: SECURE_STATIC</p>
        </div>
      </div>
    </footer>
  );
}
