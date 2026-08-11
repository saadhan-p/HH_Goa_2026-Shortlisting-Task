'use client';

import React from 'react';
import { RefreshCw, User, Cpu, Briefcase } from 'lucide-react';
import { generateTitle } from '../lib/titleGenerator';

interface BuilderFormProps {
  name: string;
  stack: string;
  role: string;
  builderTitle: string;
  onChange: (updates: { name?: string; stack?: string; role?: string; builderTitle?: string }) => void;
}

export default function BuilderForm({
  name,
  stack,
  role,
  builderTitle,
  onChange,
}: BuilderFormProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.substring(0, 24); // Limit to 24 chars to avoid cards overflow
    onChange({ name: val });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.substring(0, 24); // Limit to 24 chars
    onChange({ role: val });
  };

  const handleStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.substring(0, 24); // Limit to 24 chars
    const newTitle = generateTitle(val, builderTitle);
    onChange({ stack: val, builderTitle: newTitle });
  };

  const handleRegenerateTitle = () => {
    const newTitle = generateTitle(stack, builderTitle);
    onChange({ builderTitle: newTitle });
  };

  return (
    <div className="w-full space-y-4 font-mono text-xs">
      {/* Name Input */}
      <div className="space-y-1">
        <label className="flex items-center gap-1.5 font-bold text-hh-yellow uppercase tracking-wider text-[11px]">
          <User size={13} />
          BUILDER NAME
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. SAADHAN P"
            className="w-full bg-hh-darker border border-[#053d24] focus:border-hh-yellow rounded px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-all"
          />
          <span className="absolute right-3 top-3 text-[10px] text-gray-600">
            {name.length}/24
          </span>
        </div>
      </div>

      {/* Stack Input */}
      <div className="space-y-1">
        <label className="flex items-center gap-1.5 font-bold text-hh-yellow uppercase tracking-wider text-[11px]">
          <Cpu size={13} />
          PRIMARY STACK
        </label>
        <div className="relative">
          <input
            type="text"
            value={stack}
            onChange={handleStackChange}
            placeholder="e.g. CYBERSECURITY, PYTORCH, FRONTEND"
            className="w-full bg-hh-darker border border-[#053d24] focus:border-hh-yellow rounded px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-all"
          />
          <span className="absolute right-3 top-3 text-[10px] text-gray-600">
            {stack.length}/24
          </span>
        </div>
      </div>

      {/* Role / Developer Title */}
      <div className="space-y-1">
        <label className="flex items-center gap-1.5 font-bold text-hh-yellow uppercase tracking-wider text-[11px]">
          <Briefcase size={13} />
          ROLE / SPECIALIZATION
        </label>
        <div className="relative">
          <input
            type="text"
            value={role}
            onChange={handleRoleChange}
            placeholder="e.g. SIGNAL PLOTTER or INFRA ENGINE"
            className="w-full bg-hh-darker border border-[#053d24] focus:border-hh-yellow rounded px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-all"
          />
          <span className="absolute right-3 top-3 text-[10px] text-gray-600">
            {role.length}/24
          </span>
        </div>
      </div>

      {/* Generated Title Display (with refresh action) */}
      <div className="space-y-1">
        <label className="flex items-center gap-1.5 font-bold text-hh-yellow uppercase tracking-wider text-[11px]">
          BUILDER CLASS (GENERATED)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 bg-hh-darkest border border-[#053d24] rounded px-3 py-2.5 text-hh-pink font-bold uppercase tracking-wider flex items-center justify-between min-h-[38px]">
            <span>{builderTitle || 'THE UNKNOWN CODEC'}</span>
          </div>
          
          <button
            type="button"
            onClick={handleRegenerateTitle}
            className="touch-target border border-[#053d24] hover:border-hh-pink bg-hh-darker hover:bg-hh-darkest text-gray-300 hover:text-white px-3.5 rounded flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
            title="Regenerate Builder Title"
          >
            <RefreshCw size={14} className="hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
