import React, { useState } from 'react';
import { 
  FileText, 
  Check, 
  Copy, 
  ShieldCheck, 
  ExternalLink,
  Printer
} from 'lucide-react';

interface TermPoint {
  id: string;
  number: string;
  title: string;
  description: string;
  badge: string;
}

const KEY_TERMS_POINTS: TermPoint[] = [
  {
    id: 'point-1',
    number: '01',
    title: 'Read-Only Metrics by Default',
    description: 'FinOps AI connects strictly in read-only mode to analyze CPU, memory, and network telemetry. Automated termination is never executed without your explicit IAM administrative consent.',
    badge: 'IAM Boundary'
  },
  {
    id: 'point-2',
    number: '02',
    title: 'Zero Payload & Secret Access',
    description: 'We never inspect, process, or store customer database records, application memory payloads, private API keys, or internal network traffic.',
    badge: 'Data Privacy'
  },
  {
    id: 'point-3',
    number: '03',
    title: 'Production Safety Freeze Guarantee',
    description: 'All instances tagged with production-tier environments are protected by an automated safety freeze and cannot be shut down without two-factor administrative confirmation.',
    badge: 'Zero Downtime'
  },
  {
    id: 'point-4',
    number: '04',
    title: 'Transparent Pricing & 14-Day ROI Refund',
    description: 'Subscriptions are billed predictably with zero hidden overage fees. If FinOps AI does not identify at least 3x your subscription cost in cloud savings within 14 days, you receive a 100% full refund.',
    badge: 'ROI Guarantee'
  },
  {
    id: 'point-5',
    number: '05',
    title: 'SOC 2 Type II & End-to-End Encryption',
    description: 'All telemetry metrics in transit are secured via TLS 1.3 with AES-256 encryption. Historical telemetry averages are purged after 90 days.',
    badge: 'Security Standard'
  }
];

interface TermsAndConditionsProps {
  onNotify?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onNotify }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleCopyAll = () => {
    const text = KEY_TERMS_POINTS.map(
      (p) => `${p.number}. ${p.title}\n${p.description}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
    if (onNotify) {
      onNotify('info', 'Terms Copied', 'All 5 key terms copied to clipboard.');
    }
  };

  const handleCopySingle = (point: TermPoint) => {
    navigator.clipboard.writeText(`${point.title}: ${point.description}`);
    setCopiedId(point.id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onNotify) {
      onNotify('info', 'Point Copied', `"${point.title}" copied to clipboard.`);
    }
  };

  return (
    <section id="terms-section" className="w-full space-y-5 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#2A2421] pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C49A6C]/10 text-[#C49A6C] border border-[#C49A6C]/30 inline-flex items-center gap-1.5 mb-1.5">
            <FileText className="w-3 h-3" />
            Terms & Conditions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Key Terms & Service Safeguards
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1 max-w-2xl">
            A concise overview of our core principles, security boundaries, and zero-downtime commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#EDEAE5] bg-[#1A1A1A] border border-[#2A2421] hover:bg-[#252525] hover:border-[#C49A6C]/40 transition-colors cursor-pointer"
            title="Copy all terms points"
          >
            {copiedId === 'all' ? (
              <Check className="w-3.5 h-3.5 text-[#B2E0A6]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#C49A6C]" />
            )}
            <span>{copiedId === 'all' ? 'Copied All' : 'Copy Points'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#EDEAE5] bg-[#1A1A1A] border border-[#2A2421] hover:bg-[#252525] hover:border-[#C49A6C]/40 transition-colors cursor-pointer"
            title="Print terms"
          >
            <Printer className="w-3.5 h-3.5 text-[#C49A6C]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Few Points List */}
      <div className="space-y-2.5">
        {KEY_TERMS_POINTS.map((point) => (
          <div
            key={point.id}
            className="p-4 sm:p-5 rounded-xl bg-[#141414] border border-[#2A2421] hover:border-[#C49A6C]/40 hover:bg-[#171514] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3.5 sm:gap-4">
              <span className="font-mono text-sm sm:text-base font-bold text-[#C49A6C] bg-[#1C1A18] border border-[#2A2421] w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                {point.number}
              </span>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    {point.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F1C1A] text-[#C49A6C] border border-[#C49A6C]/30">
                    {point.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopySingle(point)}
              className="self-end sm:self-center p-1.5 rounded-lg text-[#8E8B85] hover:text-[#C49A6C] hover:bg-[#201D1A] transition-colors shrink-0 cursor-pointer"
              title="Copy this point"
            >
              {copiedId === point.id ? (
                <Check className="w-4 h-4 text-[#B2E0A6]" />
              ) : (
                <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Acknowledgment Footer Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2421] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-[#8E8B85]">
          <ShieldCheck className="w-4 h-4 text-[#B2E0A6] shrink-0" />
          <span>Simple, transparent policies designed for enterprise engineering teams.</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setIsAccepted(!isAccepted);
              if (onNotify && !isAccepted) {
                onNotify('success', 'Terms Acknowledged', 'You have marked agreement with FinOps AI terms.');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isAccepted
                ? 'bg-[#B2E0A6]/10 text-[#B2E0A6] border-[#B2E0A6]/40'
                : 'bg-[#1C1A18] text-[#D5D0C8] border-[#2A2421] hover:border-[#C49A6C]/40'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
              isAccepted ? 'bg-[#B2E0A6] border-[#B2E0A6] text-black' : 'border-[#666666]'
            }`}>
              {isAccepted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>{isAccepted ? 'Terms Acknowledged' : 'I Acknowledge Terms'}</span>
          </button>

          <a
            href="mailto:legal@finops.ai?subject=Enterprise%20Inquiry"
            className="text-xs text-[#C49A6C] hover:underline flex items-center gap-1"
          >
            <span>Questions? Contact Legal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
