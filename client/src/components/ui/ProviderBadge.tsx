import React from 'react';
import { CloudProvider } from '../../types/index.js';

interface ProviderBadgeProps {
  provider: CloudProvider;
  region?: string;
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ provider, region }) => {
  const meta = {
    aws: {
      name: 'AWS',
      bg: 'bg-[#221812]',
      border: 'border-[#3E2519]',
      text: 'text-[#FFB59B]'
    },
    gcp: {
      name: 'GCP',
      bg: 'bg-[#181818]',
      border: 'border-[#2A2421]',
      text: 'text-[#D5D2CD]'
    },
    azure: {
      name: 'AZURE',
      bg: 'bg-[#161A22]',
      border: 'border-[#242A38]',
      text: 'text-[#9AC5FF]'
    }
  }[provider];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-['Space_Grotesk',sans-serif] font-bold tracking-wider border ${meta.bg} ${meta.border} ${meta.text}`}
      title={`${meta.name} (${region || 'global'})`}
    >
      <span>{meta.name}</span>
      {region && <span className="text-[#666666] font-mono text-[9px] hidden sm:inline">[{region}]</span>}
    </span>
  );
};
