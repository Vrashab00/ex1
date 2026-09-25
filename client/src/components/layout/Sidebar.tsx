import React from 'react';
import { LayoutDashboard, History, ShieldAlert, Sliders, ArrowUpRight, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  zombieCount: number;
  feedbackCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  zombieCount,
  feedbackCount
}) => {
  const navItems = [
    {
      id: 'dashboard',
      num: '01',
      label: 'Fleet Dashboard',
      icon: LayoutDashboard,
      badge: zombieCount > 0 ? `${zombieCount} ZOMBIES` : undefined,
      badgeColor: 'bg-[#d6551f] text-white'
    },
    {
      id: 'audit-log',
      num: '02',
      label: 'Action Log',
      icon: History,
      badge: undefined
    },
    {
      id: 'feedback',
      num: '03',
      label: 'Manager Overrides',
      icon: ShieldAlert,
      badge: feedbackCount > 0 ? `${feedbackCount}` : undefined,
      badgeColor: 'bg-[#2A2421] text-[#FFB59B] border border-[#3D3430]'
    },
    {
      id: 'settings',
      num: '04',
      label: 'FinOps Guardrails',
      icon: Sliders,
      badge: undefined
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0E0E0E] border-r border-[#2A2421] flex flex-col justify-between p-5 h-screen sticky top-0 font-['Work_Sans',sans-serif]">
      <div>
        {/* Brand / Monograph Header */}
        <div className="px-1 py-2 mb-8 border-b border-[#2A2421] pb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D6551F]" />
            <span className="font-['Space_Grotesk',sans-serif] text-lg font-bold tracking-tight text-[#F5F3F0] uppercase">
              FinOps
            </span>
            <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold text-[#D6551F] tracking-widest uppercase ml-auto">
              VOL. IV
            </span>
          </div>
          <span className="text-[10px] text-[#A0A0A0] font-['Space_Grotesk',sans-serif] tracking-[0.14em] uppercase block mt-1.5 font-medium">
            Autonomous FinOps Agent
          </span>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#666666] px-3 mb-2">
            Navigation Menu
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-['Space_Grotesk',sans-serif] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#181818] text-[#F5F3F0] border border-[#D6551F] shadow-sm'
                      : 'text-[#A0A0A0] hover:text-[#F5F3F0] hover:bg-[#141414] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-[#666666]">{item.num}</span>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6551F]' : 'text-[#444444]'}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Selected Affiliations & Status Box */}
      <div className="pt-4 border-t border-[#2A2421] space-y-3">
        <div className="text-[9px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.14em] uppercase text-[#666666]">
          Connected Architecture
        </div>
        <div className="p-3 rounded-lg bg-[#141414] border border-[#2A2421] text-[11px] font-mono text-[#A0A0A0] space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#F5F3F0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6551F] animate-pulse" />
              Agent Stream
            </span>
            <span className="text-[10px] text-[#D6551F] font-bold">ONLINE</span>
          </div>
          <div className="text-[10px] text-[#666666] pt-1">
            AWS • GCP • Azure Mesh
          </div>
        </div>
      </div>
    </aside>
  );
};
