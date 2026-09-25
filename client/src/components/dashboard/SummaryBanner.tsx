import React, { useEffect, useState } from 'react';
import { ArrowUpRight, FastForward, CheckCircle2 } from 'lucide-react';

interface SummaryBannerProps {
  summary: string;
  providerUsed?: string;
  generatedAt?: string;
  zombieCount?: number;
  totalWaste?: number;
}

export const SummaryBanner: React.FC<SummaryBannerProps> = ({
  summary,
  providerUsed = 'Built-in Engine',
  generatedAt,
  zombieCount = 0,
  totalWaste = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!summary) {
      setDisplayedText('');
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    const words = summary.split(' ');
    const interval = setInterval(() => {
      index++;
      if (index <= words.length) {
        setDisplayedText(words.slice(0, index).join(' '));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [summary]);

  const handleSkipTyping = () => {
    setDisplayedText(summary);
    setIsTyping(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-[#2A2421] p-6 sm:p-8 shadow-editorial-card">
      <div className="relative space-y-4 max-w-4xl">
        {/* Commanding Headline */}
        <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F3F0] leading-tight">
          Eliminating dormant digital deadweight across cloud clusters.
        </h2>

        {/* Streaming text */}
        <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-normal min-h-[50px] font-sans">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-[#D6551F] animate-pulse align-middle" />
          )}
        </p>

        {/* Fast-forward action only while streaming */}
        {isTyping && (
          <div className="pt-1">
            <button
              onClick={handleSkipTyping}
              className="btn-pill-ghost text-xs cursor-pointer lowercase"
            >
              <span>fast-forward</span>
              <FastForward className="w-3.5 h-3.5 text-[#F3C49F]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
