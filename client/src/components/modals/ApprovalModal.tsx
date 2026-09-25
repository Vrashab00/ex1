import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { AugmentedInstance } from '../../types/index.js';
import { ProviderBadge } from '../ui/ProviderBadge.js';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  instances: AugmentedInstance[];
  totalFleetSpend: number;
  onConfirm: (instanceIds: string[], reason: string, forceProduction: boolean) => Promise<void>;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  instances,
  totalFleetSpend,
  onConfirm
}) => {
  const [operatorReason, setOperatorReason] = useState('Approved autonomous FinOps zombie cleanup');
  const [prodConfirmed, setProdConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalSavings = instances.reduce((sum, i) => sum + i.monthlyCost, 0);
  const projectedFleetSpend = Math.max(0, totalFleetSpend - totalSavings);
  const savingsPct = totalFleetSpend > 0 ? ((totalSavings / totalFleetSpend) * 100).toFixed(1) : '0';

  const hasProdInstances = instances.some(i => i.tags.env === 'prod' || i.tags.protected === 'true');
  const isSubmitDisabled = isSubmitting || (hasProdInstances && !prodConfirmed);

  const handleApprove = async () => {
    if (isSubmitDisabled) return;
    setIsSubmitting(true);
    try {
      await onConfirm(
        instances.map(i => i.id),
        operatorReason,
        prodConfirmed
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              ■ Human-in-the-Loop Verification
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk',sans-serif] tracking-tight text-[#F5F3F0]">
              Decommission Approval & Execution
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
              Reviewing {instances.length} flagged specimen(s) for permanent termination
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#F5F3F0] p-1.5 rounded-full hover:bg-[#1E1E1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff-style Before / After Cost Impact */}
        <div className="my-5 p-4 rounded-xl bg-[#161616] border border-[#2A2421] space-y-3">
          <h3 className="text-[10px] font-['Space_Grotesk',sans-serif] uppercase font-bold text-[#A0A0A0] tracking-widest">
            Cost Impact Projection (Before vs After)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2421]">
              <span className="text-[10px] font-['Space_Grotesk',sans-serif] text-[#666666] block uppercase tracking-wider">
                Current Fleet Spend
              </span>
              <span className="text-lg font-bold font-['Space_Grotesk',sans-serif] text-[#F5F3F0]">
                ${totalFleetSpend.toLocaleString()}/mo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2421]">
              <span className="text-[10px] font-['Space_Grotesk',sans-serif] text-[#666666] block uppercase tracking-wider">
                Projected Run-Rate
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold font-['Space_Grotesk',sans-serif] text-[#F5F3F0]">
                  ${projectedFleetSpend.toLocaleString()}/mo
                </span>
                <span className="text-xs text-[#D6551F] font-mono">(-{savingsPct}%)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#D6551F] text-[#0E0E0E]">
              <span className="text-[10px] font-['Space_Grotesk',sans-serif] text-[#2A1208] block uppercase font-bold tracking-wider">
                Net Recurring Savings
              </span>
              <span className="text-lg font-extrabold font-['Space_Grotesk',sans-serif] text-[#0E0E0E]">
                +${totalSavings.toLocaleString()}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Instance List */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-['Space_Grotesk',sans-serif] uppercase font-bold text-[#A0A0A0] tracking-widest">
            Flagged Specimen Candidates ({instances.length})
          </h3>

          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {instances.map((instance) => {
              const isProd = instance.tags.env === 'prod' || instance.tags.protected === 'true';

              return (
                <div
                  key={instance.id}
                  className={`p-3 rounded-xl border ${
                    isProd
                      ? 'bg-[#2A140B] border-[#D6551F]'
                      : 'bg-[#161616] border-[#2A2421]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F5F3F0] font-['Space_Grotesk',sans-serif]">
                        {instance.name}
                      </span>
                      <ProviderBadge provider={instance.provider} region={instance.region} />
                      {isProd && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-['Space_Grotesk',sans-serif] font-bold bg-[#D6551F] text-black">
                          PROD CRITICAL
                        </span>
                      )}
                    </div>
                    <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-[#FFB59B]">
                      -${instance.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>

                  {instance.audit && (
                    <p className="text-[11px] text-[#A0A0A0] mt-1.5 leading-relaxed bg-[#111111] p-2 rounded-lg border border-[#221D1B] font-mono">
                      <span className="text-[#D6551F] font-bold">Reasoning: </span>
                      {instance.audit.reasoning}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Production Safety Gate */}
        {hasProdInstances && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#2A140B] border border-[#D6551F] text-[#FFB59B]">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#D6551F] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#F5F3F0]">
                  Critical Safety Barrier: Production Workload
                </h4>
                <p className="text-xs text-[#FFB59B]/90 leading-relaxed font-['Work_Sans',sans-serif]">
                  One or more chosen instances are tagged with <span className="font-mono font-bold">env: prod</span>. Accidental decommission will disrupt customer traffic.
                </p>

                <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={prodConfirmed}
                    onChange={(e) => setProdConfirmed(e.target.checked)}
                    className="rounded border-[#D6551F] bg-[#161616] text-[#D6551F] focus:ring-[#D6551F]/30 cursor-pointer"
                  />
                  <span className="text-xs font-['Space_Grotesk',sans-serif] font-bold text-[#F5F3F0]">
                    I explicitly confirm that I intend to terminate production workload(s).
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Operator Note */}
        <div className="mt-4">
          <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
            Audit Trail Justification Entry:
          </label>
          <input
            type="text"
            value={operatorReason}
            onChange={(e) => setOperatorReason(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] focus:outline-none focus:border-[#D6551F]"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2A2421]">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-pill-ghost text-xs cursor-pointer"
          >
            CANCEL
          </button>

          <button
            onClick={handleApprove}
            disabled={isSubmitDisabled}
            className="btn-pill-primary text-xs cursor-pointer disabled:opacity-40"
          >
            <span>
              {isSubmitting
                ? 'EXECUTING DECOMMISSION...'
                : `APPROVE & TERMINATE (${instances.length})`}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
