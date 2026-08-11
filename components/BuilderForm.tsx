'use client';

import React from 'react';
import { User, Cpu, Briefcase, Users } from 'lucide-react';

interface BuilderFormProps {
  name: string;
  stack: string;
  role: string;
  builderTitle: string; // Used for Team Name
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
    onChange({ stack: val });
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.substring(0, 24); // Limit to 24 chars
    onChange({ builderTitle: val });
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

      {/* Team Name Input */}
      <div className="space-y-1">
        <label className="flex items-center gap-1.5 font-bold text-hh-yellow uppercase tracking-wider text-[11px]">
          <Users size={13} />
          TEAM NAME
        </label>
        <div className="relative">
          <input
            type="text"
            value={builderTitle}
            onChange={handleTeamNameChange}
            placeholder="e.g. THE COFFEE CODECS"
            className="w-full bg-hh-darker border border-[#053d24] focus:border-hh-yellow rounded px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-all"
          />
          <span className="absolute right-3 top-3 text-[10px] text-gray-600">
            {builderTitle.length}/24
          </span>
        </div>
      </div>
    </div>
  );
}
