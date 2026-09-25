import React from 'react';
import { motion } from 'framer-motion';
import { X, Server, Activity, HardDrive, Wifi, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { AugmentedInstance } from '../../types/index.js';
import { ProviderBadge } from '../ui/ProviderBadge.js';
import { VerdictBadge } from '../ui/VerdictBadge.js';
import { ConfidenceRing } from '../ui/ConfidenceRing.js';
import { Sparkline } from '../ui/Sparkline.js';

interface InstanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  instance: AugmentedInstance | null;
}

export const InstanceDetailModal: React.FC<InstanceDetailModalProps> = ({
  isOpen,
  onClose,
  instance
}) => {
  if (!isOpen || !instance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-['Work_Sans',sans-serif]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl rounded-2xl bg-[#141414] border border-[#2A2421] p-6 sm:p-8 text-[#E5E2E1] shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#2A2421]">
          <div>
            <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#D6551F] block mb-1">
              ■ Telemetry & Metadata Specimen
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk',sans-serif] tracking-tight text-[#F5F3F0]">
                {instance.name}
              </h2>
              <ProviderBadge provider={instance.provider} region={instance.region} />
            </div>
            <p className="text-xs text-[#A0A0A0] font-mono mt-1">
              ID: {instance.id} • Type: {instance.instanceType} • Region: {instance.region}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#F5F3F0] p-1.5 rounded-full hover:bg-[#1E1E1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Verdict Box */}
        {instance.audit && (
          <div className="my-5 p-4 rounded-xl bg-[#161616] border border-[#2A2421] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VerdictBadge verdict={instance.audit.verdict} />
                <span className="text-[11px] font-mono text-[#A0A0A0]">
                  RISK: <span className="font-bold text-[#F5F3F0] uppercase">{instance.audit.riskLevel}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#A0A0A0]">Confidence:</span>
                <ConfidenceRing score={instance.audit.confidence} size={30} strokeWidth={2.5} />
              </div>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed font-mono bg-[#111111] p-3 rounded-lg border border-[#221D1B]">
              <span className="text-[#D6551F] font-bold">Reasoning: </span>
              {instance.audit.reasoning}
            </p>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#2A2421]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A0A0A0] font-mono">
              <Activity className="w-3.5 h-3.5 text-[#D6551F]" />
              <span>CPU (Avg / Peak)</span>
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {instance.cpuAvg}% <span className="text-xs text-[#666666] font-normal">/ {instance.cpuPeak}%</span>
            </div>
            <div className="mt-2">
              <Sparkline data={instance.cpuHistory} height={20} width={80} label="CPU" color="rust" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#2A2421]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A0A0A0] font-mono">
              <Activity className="w-3.5 h-3.5 text-[#B48448]" />
              <span>RAM (Avg / Peak)</span>
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {instance.memoryAvg}% <span className="text-xs text-[#666666] font-normal">/ {instance.memoryPeak}%</span>
            </div>
            <div className="mt-2">
              <Sparkline data={instance.memoryHistory} height={20} width={80} label="RAM" color="amber" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#2A2421]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A0A0A0] font-mono">
              <Wifi className="w-3.5 h-3.5 text-[#D6551F]" />
              <span>Network I/O</span>
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {instance.networkIoMbPerDay.toLocaleString()} <span className="text-xs text-[#666666] font-normal">MB</span>
            </div>
            <span className="text-[10px] text-[#666666] block mt-1">
              {instance.networkIoMbPerDay < 100 ? 'Idle traffic' : 'Active egress'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#2A2421]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A0A0A0] font-mono">
              <HardDrive className="w-3.5 h-3.5 text-[#FFB59B]" />
              <span>Monthly Cost</span>
            </div>
            <div className="text-base font-bold font-['Space_Grotesk',sans-serif] text-white mt-1">
              ${instance.monthlyCost.toLocaleString()} <span className="text-xs text-[#666666] font-normal">/mo</span>
            </div>
            <span className="text-[10px] text-[#666666] font-mono block mt-1">
              Status: {instance.status}
            </span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-xl bg-[#161616] border border-[#2A2421] text-xs font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D6551F]" />
            <div>
              <span className="text-[#666666] block text-[9px] uppercase tracking-wider">Last Deployment:</span>
              <span className="text-[#E5E2E1]">{new Date(instance.lastDeployDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D6551F]" />
            <div>
              <span className="text-[#666666] block text-[9px] uppercase tracking-wider">Last Active Traffic:</span>
              <span className="text-[#E5E2E1]">{new Date(instance.lastActiveDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="my-4">
          <h4 className="text-[10px] font-['Space_Grotesk',sans-serif] uppercase text-[#A0A0A0] font-bold mb-2 tracking-wider flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-[#D6551F]" />
            Applied Cloud Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(instance.tags).map(([k, v]) => (
              <span
                key={k}
                className="px-2.5 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2421] text-xs font-mono text-[#D5D2CD]"
              >
                <span className="text-[#D6551F]">{k}</span>: <span>{v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Previous Feedback */}
        {instance.previousFeedback && (
          <div className="my-4 p-3.5 rounded-xl bg-[#221812] border border-[#3E2519] text-[#FFB59B] text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#D6551F]">
              <ShieldAlert className="w-4 h-4" />
              <span>Prior Exemption Registered</span>
            </div>
            <p>
              Preserved by <span className="font-bold text-[#F5F3F0]">{instance.previousFeedback.manager}</span> ({instance.previousFeedback.team}) on {new Date(instance.previousFeedback.createdAt).toLocaleDateString()}:
            </p>
            <p className="italic bg-[#141414] p-2 rounded-lg border border-[#2A2421]">
              "{instance.previousFeedback.reason}"
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[#2A2421]">
          <button
            onClick={onClose}
            className="btn-pill-ghost text-xs cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </motion.div>
    </div>
  );
};
