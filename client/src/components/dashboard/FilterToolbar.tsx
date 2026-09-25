import React from 'react';
import { Search, ArrowUpRight, CheckSquare, Trash2, RefreshCw, Activity } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedVerdict: string;
  onVerdictChange: (v: string) => void;
  selectedEnv: string;
  onEnvChange: (e: string) => void;
  selectedProvider: string;
  onProviderChange: (p: string) => void;
  selectedCount: number;
  totalZombiesCount: number;
  onSelectAllZombies: () => void;
  onDeselectAll: () => void;
  onOpenApprovalModal: () => void;
  selectedSavings: number;
  isAuditing: boolean;
  onRunAudit: () => void;
  onOpenTelemetry: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedVerdict,
  onVerdictChange,
  selectedEnv,
  onEnvChange,
  selectedProvider,
  onProviderChange,
  selectedCount,
  totalZombiesCount,
  onSelectAllZombies,
  onDeselectAll,
  onOpenApprovalModal,
  selectedSavings,
  isAuditing,
  onRunAudit,
  onOpenTelemetry
}) => {
  return (
    <div className="space-y-4 pt-2">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-[#141414] border border-[#2A2421] shadow-editorial-card">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search by instance identifier, name, owner, or team tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-[#161616] border border-[#2A2421] rounded-full text-[#F5F3F0] placeholder-[#666666] focus:outline-none focus:border-[#D6551F] transition-all"
          />
        </div>

        {/* Right: Select dropdowns & Run Audit */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Environment Filter */}
          <select
            value={selectedEnv}
            onChange={(e) => onEnvChange(e.target.value)}
            className="px-3.5 py-2 text-xs font-['Space_Grotesk',sans-serif] font-medium bg-[#161616] border border-[#2A2421] rounded-full text-[#A0A0A0] focus:outline-none focus:border-[#D6551F] cursor-pointer"
          >
            <option value="all">ALL ENVIRONMENTS</option>
            <option value="prod">ENV: PROD</option>
            <option value="dev">ENV: DEV</option>
            <option value="qa">ENV: QA</option>
            <option value="staging">ENV: STAGING</option>
            <option value="sandbox">ENV: SANDBOX</option>
          </select>

          {/* Cloud Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => onProviderChange(e.target.value)}
            className="px-3.5 py-2 text-xs font-['Space_Grotesk',sans-serif] font-medium bg-[#161616] border border-[#2A2421] rounded-full text-[#A0A0A0] focus:outline-none focus:border-[#D6551F] cursor-pointer"
          >
            <option value="all">ALL CLOUDS (AWS / GCP / AZURE)</option>
            <option value="aws">AWS</option>
            <option value="gcp">GCP</option>
            <option value="azure">AZURE</option>
          </select>

          {/* Re-run button */}
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="btn-pill-ghost text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D6551F] ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'AUDITING...' : 'RE-AUDIT'}</span>
          </button>

          {/* Telemetry Curves button */}
          <button
            onClick={onOpenTelemetry}
            title="View & connect telemetry curves"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono tracking-wide text-[#C49A6C] border border-[#C49A6C]/30 bg-[#C49A6C]/5 hover:bg-[#C49A6C]/15 hover:border-[#C49A6C]/50 transition-all cursor-pointer shrink-0"
          >
            <Activity className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Telemetry Curves</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Tabs & Batch Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        {/* Verdict Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141414] rounded-full border border-[#2A2421] overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'ALL FLEET' },
            { id: 'zombie', label: 'ZOMBIES ONLY' },
            { id: 'needs-review', label: 'NEEDS REVIEW' },
            { id: 'likely-safe', label: 'LIKELY SAFE' }
          ].map((tab) => {
            const active = selectedVerdict === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onVerdictChange(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-['Space_Grotesk',sans-serif] font-bold tracking-wider transition-all cursor-pointer ${
                  active
                    ? 'bg-[#D6551F] text-[#F5F3F0] shadow-sm'
                    : 'text-[#A0A0A0] hover:text-[#F5F3F0] hover:bg-[#1A1A1A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Batch actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {totalZombiesCount > 0 && (
            <button
              onClick={selectedCount > 0 ? onDeselectAll : onSelectAllZombies}
              className="text-xs font-['Space_Grotesk',sans-serif] font-bold tracking-wider text-[#A0A0A0] hover:text-white px-3.5 py-1.5 rounded-full bg-[#161616] hover:bg-[#1A1A1A] border border-[#2A2421] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#D6551F]" />
              <span>{selectedCount > 0 ? 'DESELECT ALL' : `SELECT ALL ZOMBIES (${totalZombiesCount})`}</span>
            </button>
          )}

          {selectedCount > 0 && (
            <button
              onClick={onOpenApprovalModal}
              className="btn-pill-primary text-xs cursor-pointer shadow-rust-glow"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#0E0E0E]" />
              <span>APPROVE & TERMINATE ({selectedCount})</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#F5F3F0]">
                +${selectedSavings.toLocaleString()}/mo
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
