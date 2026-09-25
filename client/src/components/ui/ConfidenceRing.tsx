import React from 'react';

interface ConfidenceRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  score = 0,
  size = 36,
  strokeWidth = 3
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = 'text-[#F3C49F] stroke-[#F3C49F]';
  if (clampedScore >= 85) {
    colorClass = 'text-[#F3C49F] stroke-[#F3C49F]';
  } else if (clampedScore < 70) {
    colorClass = 'text-[#F4DD9E] stroke-[#F4DD9E]';
  }

  return (
    <div
      className="relative inline-flex items-center justify-center group"
      title={`AI Confidence Score: ${clampedScore}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#2A2421"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-700 ease-out`}
        />
      </svg>
      <span className="absolute text-[11px] font-mono font-bold text-[#F5F3F0]">
        {Math.round(clampedScore)}
      </span>
    </div>
  );
};
