import React from 'react';

export const SkeletonTable: React.FC = () => {
  return (
    <div className="w-full bg-[#141414] rounded-2xl border border-[#2A2421] overflow-hidden shadow-2xl p-6">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2421] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[#1F1B18] animate-pulse" />
          <div className="w-48 h-5 rounded-md bg-[#1F1B18] animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-24 h-8 rounded-full bg-[#1F1B18] animate-pulse" />
          <div className="w-32 h-8 rounded-full bg-[#1F1B18] animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl bg-[#1A1816]/70 border border-[#2A2421]/60 animate-pulse"
          >
            <div className="flex items-center gap-4 w-1/3">
              <div className="w-4 h-4 rounded bg-[#2A2421]" />
              <div className="space-y-2">
                <div className="w-44 h-4 rounded bg-[#2A2421]" />
                <div className="w-28 h-3 rounded bg-[#2A2421]/60" />
              </div>
            </div>

            <div className="w-32 h-7 rounded-full bg-[#2A2421]/80" />
            <div className="w-28 h-8 rounded bg-[#2A2421]" />
            <div className="w-24 h-5 rounded bg-[#2A2421]" />
            <div className="w-10 h-10 rounded-full bg-[#2A2421]" />
            <div className="w-24 h-8 rounded-full bg-[#2A2421]" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[#D6551F] text-[11px] font-mono tracking-widest uppercase animate-pulse">
        <span className="w-2 h-2 rounded-full bg-[#D6551F] animate-ping" />
        ■ AUTONOMOUS AGENT AUDITING TELEMETRY & WORKLOAD HEURISTICS...
      </div>
    </div>
  );
};
