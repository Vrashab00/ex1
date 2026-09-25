import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { AugmentedInstance } from '../../types/index.js';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instance: AugmentedInstance | null;
  onSubmit: (feedback: {
    instanceId: string;
    reason: string;
    team: string;
    manager: string;
    action: 'reject_zombie' | 'whitelist' | 'schedule_review';
  }) => Promise<void>;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  instance,
  onSubmit
}) => {
  const [manager, setManager] = useState('Alex Rivera (Platform Lead)');
  const [team, setTeam] = useState(instance?.tags.team || 'Engineering');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'reject_zombie' | 'whitelist' | 'schedule_review'>('reject_zombie');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !instance) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        instanceId: instance.id,
        reason: reason.trim(),
        team: team.trim(),
        manager: manager.trim(),
        action
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Work_Sans',sans-serif]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-lg rounded-2xl bg-[#141414] border border-[#2A2421] p-6 sm:p-8 text-[#E5E2E1] shadow-2xl"
      >
        <div className="flex items-start justify-between pb-5 border-b border-[#2A2421]">
          <div>
            <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#D6551F] block mb-1">
              ■ Manager Override Protocol
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk',sans-serif] tracking-tight text-[#F5F3F0]">
              Register Exemption Justification
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
              Train agent memory on business intent for <span className="text-[#FFB59B]">{instance.name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#F5F3F0] p-1.5 rounded-full hover:bg-[#1E1E1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-5">
          <div>
            <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
              Reviewer / Engineering Manager:
            </label>
            <input
              type="text"
              required
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] focus:outline-none focus:border-[#D6551F]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
              Team / Cost Center:
            </label>
            <input
              type="text"
              required
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] focus:outline-none focus:border-[#D6551F]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
              Preservation Justification (Why is this instance required?):
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Critical quarterly reporting worker. Low daytime CPU is expected by design."
              className="w-full px-3 py-2 text-xs font-mono bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] placeholder-[#555555] focus:outline-none focus:border-[#D6551F] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
              Policy Action:
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-['Space_Grotesk',sans-serif] bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] focus:outline-none focus:border-[#D6551F] cursor-pointer"
            >
              <option value="reject_zombie">Reject flag & tag "Treat Cautiously" in future audits</option>
              <option value="whitelist">Permanent Whitelist (Immunize from zombie classification)</option>
              <option value="schedule_review">Snooze & re-audit in 30 days</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-[#221812] border border-[#3E2519] text-[#FFB59B] text-xs font-mono leading-relaxed">
            ℹ️ This feedback is permanently indexed in the autonomous agent's memory. Subsequent audits will cite this explanation to prevent repeated false positives.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2421]">
            <button
              type="button"
              onClick={onClose}
              className="btn-pill-ghost text-xs cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="btn-pill-primary text-xs cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'RECORDING...' : 'REGISTER EXEMPTION'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
