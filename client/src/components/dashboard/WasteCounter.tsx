import React, { useEffect, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';

interface WasteCounterProps {
  amount: number;
  totalFleetSpend?: number;
}

export const WasteCounter: React.FC<WasteCounterProps> = ({ amount, totalFleetSpend = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1000;
    const startValue = displayValue;
    const endValue = amount;

    setIsPulsing(true);
    const pulseTimer = setTimeout(() => setIsPulsing(false), 700);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * ease));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
    return () => clearTimeout(pulseTimer);
  }, [amount]);

  const wastePercent = totalFleetSpend > 0 ? ((amount / totalFleetSpend) * 100).toFixed(0) : '0';

  return (
    <div className="flex items-center gap-3 bg-[#141414] px-3.5 py-1.5 rounded-full border border-[#2A2421] shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#D6551F] animate-pulse" />
        <span className="text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-[0.12em] text-[#A0A0A0]">
          Identified Waste
        </span>
      </div>

      <div className="h-4 w-px bg-[#2A2421]" />

      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-['Space_Grotesk',sans-serif] text-base sm:text-lg font-bold tracking-tight text-[#F5F3F0] transition-all duration-300 ${
            isPulsing ? 'text-[#D6551F]' : ''
          }`}
        >
          ${displayValue.toLocaleString()}
        </span>
        <span className="text-[11px] text-[#A0A0A0] font-mono">/mo</span>

        <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#2A180F] text-[#FFB59B] border border-[#3E2519]">
          -{wastePercent}% recoverable
        </span>
      </div>
    </div>
  );
};
