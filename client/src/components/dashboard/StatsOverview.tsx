import React from 'react';
import { ArrowUpRight, BookOpen, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { AuditResponse } from '../../types/index.js';

interface StatsOverviewProps {
  audit: AuditResponse | null;
  totalInstances: number;
  onExploreZombies?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ audit, totalInstances, onExploreZombies }) => {
  const totalSpend = audit?.totalCurrentSpend || 0;
  const waste = audit?.totalMonthlyWaste || 0;
  const zombies = audit?.zombiesCount || 0;
  const safe = audit?.safeCount || 0;

  const wastePct = totalSpend > 0 ? ((waste / totalSpend) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-4">
      {/* Editorial Section Label */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#D6551F] block mb-1">
            Core Fleet Metrics
          </span>
          <h3 className="font-['Space_Grotesk',sans-serif] text-xl font-bold tracking-tight text-[#F5F3F0]">
            Autonomous economic oversight & waste allocation.
          </h3>
        </div>
      </div>

      {/* 4-Card Grid (Matching the Card 01, Card 02 Featured, Card 03 Triad from screenshot!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 01: Standard Charcoal Card */}
        <div className="p-6 rounded-2xl bg-[#161616] border border-[#2A2421] flex flex-col justify-between shadow-editorial-card transition-all duration-200 hover:border-[#3D3430]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666] mb-3">
              <span className="font-bold">01</span>
              <BookOpen className="w-4 h-4 text-[#A0A0A0]" />
            </div>

            <h4 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#F5F3F0] tracking-tight">
              Fleet Spend
            </h4>

            <div className="mt-2 mb-3">
              <span className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white tracking-tight">
                ${totalSpend.toLocaleString()}
              </span>
              <span className="text-xs text-[#A0A0A0] font-mono"> / mo</span>
            </div>

            <p className="text-xs text-[#A0A0A0] font-['Work_Sans',sans-serif] leading-relaxed">
              Total compute envelope across {totalInstances} cloud workloads deployed on AWS, GCP, and Azure.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#2A2421]">
            <span className="btn-pill-ghost text-[11px] py-1 px-3">
              <span>LEDGER</span>
              <ArrowUpRight className="w-3 h-3 text-[#D6551F]" />
            </span>
          </div>
        </div>

        {/* Card 02 (FEATURED IN SOLID BURNT RUST ORANGE - EXACTLY LIKE SCREENSHOT!) */}
        <div className="p-6 rounded-2xl bg-[#D6551F] border border-[#EF6730] text-[#0E0E0E] flex flex-col justify-between shadow-rust-glow transition-all duration-200 hover:scale-[1.01]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#4A1D0B] mb-3">
              <span className="font-bold">02 • FEATURED</span>
              <Sparkles className="w-4 h-4 text-[#0E0E0E]" />
            </div>

            <h4 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#0E0E0E] tracking-tight">
              Recoverable Waste
            </h4>

            <div className="mt-2 mb-3">
              <span className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold text-[#0E0E0E] tracking-tight">
                ${waste.toLocaleString()}
              </span>
              <span className="text-xs text-[#3E1A0C] font-mono font-bold"> / mo</span>
            </div>

            <p className="text-xs text-[#2A1208] font-['Work_Sans',sans-serif] font-medium leading-relaxed">
              Immediate recurring monthly savings achievable by pruning {zombies} confirmed zombie assets ({wastePct}% of fleet).
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#B84515]">
            <button
              onClick={onExploreZombies}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0E0E0E] hover:bg-[#1A1A1A] text-[#F5F3F0] font-['Space_Grotesk',sans-serif] text-[11px] font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
            >
              <span>TARGET RECOVERY</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D6551F]" />
            </button>
          </div>
        </div>

        {/* Card 03: Standard Charcoal Card */}
        <div className="p-6 rounded-2xl bg-[#161616] border border-[#2A2421] flex flex-col justify-between shadow-editorial-card transition-all duration-200 hover:border-[#3D3430]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666] mb-3">
              <span className="font-bold">03</span>
              <Layers className="w-4 h-4 text-[#A0A0A0]" />
            </div>

            <h4 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#F5F3F0] tracking-tight">
              Zombie Assets
            </h4>

            <div className="mt-2 mb-3">
              <span className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white tracking-tight">
                {zombies}
              </span>
              <span className="text-xs text-[#A0A0A0] font-mono"> Flagged Nodes</span>
            </div>

            <p className="text-xs text-[#A0A0A0] font-['Work_Sans',sans-serif] leading-relaxed">
              Abandoned development benches, unattached A100 GPU POCs, and dormant staging nodes idle for &gt;30 days.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#2A2421]">
            <span className="btn-pill-ghost text-[11px] py-1 px-3">
              <span>INVENTORY</span>
              <ArrowUpRight className="w-3 h-3 text-[#D6551F]" />
            </span>
          </div>
        </div>

        {/* Card 04: Standard Charcoal Card */}
        <div className="p-6 rounded-2xl bg-[#161616] border border-[#2A2421] flex flex-col justify-between shadow-editorial-card transition-all duration-200 hover:border-[#3D3430]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666] mb-3">
              <span className="font-bold">04</span>
              <ShieldCheck className="w-4 h-4 text-[#D6551F]" />
            </div>

            <h4 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#F5F3F0] tracking-tight">
              Protected Fleet
            </h4>

            <div className="mt-2 mb-3">
              <span className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white tracking-tight">
                {safe}
              </span>
              <span className="text-xs text-[#A0A0A0] font-mono"> Prod Systems</span>
            </div>

            <p className="text-xs text-[#A0A0A0] font-['Work_Sans',sans-serif] leading-relaxed">
              Mission-critical production databases and ingress routers safeguarded by strict immunity policies.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#2A2421]">
            <span className="btn-pill-ghost text-[11px] py-1 px-3">
              <span>GUARDRAILS</span>
              <ArrowUpRight className="w-3 h-3 text-[#D6551F]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
