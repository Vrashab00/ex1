import React, { useState } from 'react';
import { Trash2, AlertOctagon, Eye, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AugmentedInstance } from '../../types/index.js';
import { ProviderBadge } from '../ui/ProviderBadge.js';
import { VerdictBadge } from '../ui/VerdictBadge.js';
import { ConfidenceRing } from '../ui/ConfidenceRing.js';
import { Sparkline } from '../ui/Sparkline.js';

interface InstanceCardsProps {
  instances: AugmentedInstance[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onInspect: (instance: AugmentedInstance) => void;
  onQuickTerminate: (instance: AugmentedInstance) => void;
  onOpenFeedbackModal: (instance: AugmentedInstance) => void;
}

const getProperServiceName = (inst: AugmentedInstance): string => {
  const name = inst.name.toLowerCase();
  const provider = inst.provider?.toLowerCase() || '';

  if (name.includes('aurora') || name.includes('postgres')) {
    return 'AWS Aurora Postgres';
  }
  if (name.includes('redis')) {
    return 'AWS Redis Cache';
  }
  if (name.includes('memcached')) {
    return 'AWS Memcached';
  }
  if (name.includes('rabbitmq')) {
    return 'AWS RabbitMQ';
  }
  if (name.includes('ingress') || name.includes('gateway')) {
    return 'AWS EC2 Ingress';
  }
  if (name.includes('k8s') || name.includes('worker') || name.includes('spot')) {
    return 'Amazon EKS';
  }
  if (name.includes('gpu') || name.includes('notebook') || name.includes('alex') || name.includes('a2')) {
    return 'GCP A100 GPU';
  }
  if (name.includes('loadgen') || name.includes('gatling')) {
    return 'GCP N2 Cluster';
  }
  if (name.includes('metabase')) {
    return 'GCP Metabase';
  }
  if (name.includes('elastic') || name.includes('single-node') || name.includes('abandoned')) {
    return 'Azure Elasticsearch';
  }
  if (name.includes('cypress') || name.includes('matrix') || name.includes('runner') || name.includes('qa-e2e')) {
    return 'AWS Cypress Runner';
  }
  if (name.includes('warehouse') || name.includes('sync')) {
    return 'AWS Batch Sync';
  }

  if (provider === 'aws') return 'AWS EC2';
  if (provider === 'gcp') return 'GCP Compute';
  if (provider === 'azure') return 'Azure VM';
  return 'Cloud Compute';
};

export const InstanceCards: React.FC<InstanceCardsProps> = ({
  instances,
  selectedIds,
  onToggleSelect,
  onInspect,
  onQuickTerminate,
  onOpenFeedbackModal
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleInstances = isExpanded || instances.length <= 6 ? instances : instances.slice(0, 6);

  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-1 gap-4">
        {visibleInstances.map((instance, idx) => {
        const isSelected = selectedIds.has(instance.id);
        const isTerminated = instance.status === 'terminated';
        const hasPreviousFeedback = !!instance.previousFeedback;
        const isProd = instance.tags.env === 'prod';
        const isZombie = instance.audit?.verdict === 'zombie';
        const rowNum = String(idx + 1).padStart(2, '0');

        return (
          <div
            key={instance.id}
            className={`p-5 rounded-2xl bg-[#141414] border transition-all duration-200 ${
              isSelected
                ? 'border-[#D6551F] bg-[#1C1510]'
                : isTerminated
                ? 'border-[#2A2421]/40 opacity-40 bg-[#0E0E0E]'
                : 'border-[#2A2421] hover:border-[#3D3430]'
            }`}
          >
            {/* Header: Checkbox + Num + Name + Provider */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  disabled={isTerminated}
                  checked={isSelected}
                  onChange={() => onToggleSelect(instance.id)}
                  className="mt-1 rounded border-[#3D3430] bg-[#161616] text-[#D6551F] focus:ring-[#D6551F]/30 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[#666666]">{rowNum}</span>
                    <h3
                      onClick={() => onInspect(instance)}
                      className="font-bold text-base text-[#F5F3F0] font-sans hover:text-[#C49A6C] transition-colors cursor-pointer tracking-tight"
                    >
                      {instance.name}
                    </h3>
                  </div>
                  {isProd && (
                    <div className="mt-1">
                      <span className="px-2 py-0.2 rounded-full bg-[#F3C49F]/10 text-[#F3C49F] border border-[#F3C49F]/30 text-[9px] font-semibold lowercase">
                        production
                      </span>
                    </div>
                  )}
                  {isTerminated && (
                    <div className="mt-1">
                      <span className="px-2 py-0.2 rounded-full bg-[#F2A4AA]/10 text-[#F2A4AA] border border-[#F2A4AA]/30 text-[9px] font-mono lowercase">
                        decommissioned
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {instance.audit && (
                <div className="shrink-0">
                  <ConfidenceRing score={instance.audit.confidence} size={34} strokeWidth={2.5} />
                </div>
              )}
            </div>

            {hasPreviousFeedback && (
              <div className="mt-2 text-[10px] font-mono text-[#F4DD9E] bg-[#F4DD9E]/10 px-2.5 py-1 rounded-full border border-[#F4DD9E]/30 flex items-center gap-1.5 lowercase">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F4DD9E] shrink-0" />
                <span>previously rejected by manager: "{instance.previousFeedback?.reason}"</span>
              </div>
            )}

            {/* Telemetry Sparklines with Proper Cloud Service Name */}
            <div className="my-3 p-2.5 rounded-xl bg-[#161616] border border-[#2A2421] flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-[#EDEAE5] tracking-tight">
                {getProperServiceName(instance)}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-[#8C867F] lowercase tracking-wide">cpu</span>
                  <Sparkline
                    data={instance.cpuHistory}
                    color={isZombie ? 'red' : instance.audit?.verdict === 'needs-review' ? 'yellow' : isProd ? 'orange' : 'green'}
                    label="CPU"
                    unit="%"
                    height={18}
                    width={55}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-[#8C867F] lowercase tracking-wide">ram</span>
                  <Sparkline
                    data={instance.memoryHistory}
                    color={isZombie ? 'red' : instance.audit?.verdict === 'needs-review' ? 'yellow' : isProd ? 'orange' : 'green'}
                    label="RAM"
                    unit="%"
                    height={18}
                    width={55}
                  />
                </div>
              </div>
            </div>

            {/* Verdict and Cost bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2A2421]">
              <div>
                <VerdictBadge verdict={instance.audit?.verdict} size="sm" />
              </div>
              <div className="text-right font-sans">
                <span className="text-base font-bold text-white tracking-tight">
                  ${instance.monthlyCost.toLocaleString()}
                </span>
                <span className="text-xs text-[#A0A0A0] font-mono">/mo</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#2A2421]">
              <button
                onClick={() => onInspect(instance)}
                className="btn-pill-ghost text-[10px] py-1 px-3 lowercase"
              >
                <span>specimen</span>
                <ArrowUpRight className="w-3 h-3 text-[#F3C49F]" />
              </button>

              {!isTerminated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenFeedbackModal(instance)}
                    className="p-1.5 text-[#A0A0A0] hover:text-[#FFB59B] bg-[#161616] rounded-full border border-[#2A2421]"
                    title="Reject AI flag"
                  >
                    <AlertOctagon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onQuickTerminate(instance)}
                    className="btn-pill-ghost text-[10px] py-1 px-3 border-[#F3C49F]/40 text-[#F3C49F] lowercase"
                  >
                    <span>terminate</span>
                    <ArrowUpRight className="w-3 h-3 text-[#F3C49F]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>

      {/* Short List Footer Expander for Mobile Cards */}
      {instances.length > 6 && (
        <div className="p-3 bg-[#141414] rounded-xl border border-[#2A2421] flex items-center justify-between text-xs font-mono">
          <span className="text-[#8E8B85]">
            {visibleInstances.length} of {instances.length} curves
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 rounded-full text-xs font-medium text-[#EDEAE5] bg-[#1A1816] hover:bg-[#EAE2D5] hover:text-[#181614] border border-[#2A2421] transition-all cursor-pointer shadow-sm"
          >
            {isExpanded ? 'Show Fewer ▴' : `Show All (${instances.length}) ▾`}
          </button>
        </div>
      )}
    </div>
  );
};
