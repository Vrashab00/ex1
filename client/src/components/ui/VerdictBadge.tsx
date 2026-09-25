import React from 'react';
import { Skull, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { AuditVerdict } from '../../types/index.js';

interface VerdictBadgeProps {
  verdict?: AuditVerdict;
  reasoning?: string;
  size?: 'sm' | 'md';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  reasoning,
  size = 'md'
}) => {
  if (!verdict) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans lowercase tracking-wider bg-[#1A1A1A] text-[#666666] border border-[#2A2421]">
        <HelpCircle className="w-3 h-3" />
        unclassified
      </span>
    );
  }

  const isSmall = size === 'sm';

  const config = {
    zombie: {
      label: 'zombie waste',
      icon: Skull,
      bg: 'bg-[#F2A4AA]/10',
      border: 'border-[#F2A4AA]/30',
      text: 'text-[#F2A4AA]',
      dot: 'bg-[#F2A4AA] shadow-[0_0_6px_rgba(242,164,170,0.5)] animate-pulse'
    },
    'needs-review': {
      label: 'needs review',
      icon: AlertTriangle,
      bg: 'bg-[#F4DD9E]/10',
      border: 'border-[#F4DD9E]/30',
      text: 'text-[#F4DD9E]',
      dot: 'bg-[#F4DD9E]'
    },
    'likely-safe': {
      label: 'likely safe',
      icon: ShieldCheck,
      bg: 'bg-[#B2E0A6]/10',
      border: 'border-[#B2E0A6]/30',
      text: 'text-[#B2E0A6]',
      dot: 'bg-[#B2E0A6]'
    }
  }[verdict];

  const Icon = config.icon;

  return (
    <div className="relative group inline-block">
      <span
        className={`inline-flex items-center gap-1.5 ${
          isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
        } rounded-full font-sans font-semibold tracking-wide lowercase ${config.bg} ${config.border} ${config.text} border transition-all duration-200 group-hover:scale-105`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{config.label}</span>
      </span>

      {reasoning && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-xl bg-[#141414] border border-[#3D3430] text-xs text-[#E5E2E1] shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 leading-snug font-sans">
          <p className="font-sans font-bold text-[#FFB59B] mb-1 uppercase tracking-wider text-[10px]">
            AI Verdict Reasoning:
          </p>
          <p className="text-[#A0A0A0]">{reasoning}</p>
        </div>
      )}
    </div>
  );
};
