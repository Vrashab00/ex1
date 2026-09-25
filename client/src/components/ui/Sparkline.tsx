import React, { useState } from 'react';

interface SparklineProps {
  data: number[];
  color?: 'red' | 'yellow' | 'green' | 'orange' | 'rust' | 'amber' | 'neutral';
  height?: number;
  width?: number;
  label?: string;
  unit?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [],
  color = 'orange',
  height = 30,
  width = 100,
  label = 'Metric',
  unit = '%'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number } | null>(null);

  if (!data || data.length === 0) {
    return <span className="text-xs text-[#666666] font-mono">No data</span>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data, 1);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 4;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 8) + 4;
    const y = height - paddingY - ((val - min) / range) * (height - paddingY * 2);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  const colorConfig = {
    red: {
      stroke: '#F2A4AA',
      gradientStart: 'rgba(242, 164, 170, 0.18)',
      gradientStop: 'rgba(242, 164, 170, 0.0)'
    },
    yellow: {
      stroke: '#F4DD9E',
      gradientStart: 'rgba(244, 221, 158, 0.18)',
      gradientStop: 'rgba(244, 221, 158, 0.0)'
    },
    green: {
      stroke: '#B2E0A6',
      gradientStart: 'rgba(178, 224, 166, 0.18)',
      gradientStop: 'rgba(178, 224, 166, 0.0)'
    },
    orange: {
      stroke: '#F3C49F',
      gradientStart: 'rgba(243, 196, 159, 0.18)',
      gradientStop: 'rgba(243, 196, 159, 0.0)'
    },
    rust: {
      stroke: '#F3C49F',
      gradientStart: 'rgba(243, 196, 159, 0.18)',
      gradientStop: 'rgba(243, 196, 159, 0.0)'
    },
    amber: {
      stroke: '#F4DD9E',
      gradientStart: 'rgba(244, 221, 158, 0.18)',
      gradientStop: 'rgba(244, 221, 158, 0.0)'
    },
    neutral: {
      stroke: '#C2BEB7',
      gradientStart: 'rgba(194, 190, 183, 0.18)',
      gradientStop: 'rgba(194, 190, 183, 0.0)'
    }
  }[color];

  const avg = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);

  return (
    <div
      className="relative flex items-center gap-2 group cursor-pointer"
      onMouseLeave={() => setHoveredPoint(null)}
    >
      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={`grad-${color}-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorConfig.gradientStart} />
              <stop offset="100%" stopColor={colorConfig.gradientStop} />
            </linearGradient>
          </defs>

          <path d={areaD} fill={`url(#grad-${color}-${label})`} />

          <path
            d={pathD}
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.x === pt.x ? 3.5 : 1.2}
              fill={hoveredPoint?.x === pt.x ? '#F5F3F0' : colorConfig.stroke}
              className="transition-all duration-150"
              onMouseEnter={() => setHoveredPoint(pt)}
            />
          ))}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute z-20 -top-7 -translate-x-1/2 px-1.5 py-0.5 bg-[#0E0E0E] border border-[#2A2421] rounded text-[10px] font-mono text-[#F5F3F0] whitespace-nowrap shadow-lg pointer-events-none"
            style={{ left: hoveredPoint.x }}
          >
            {hoveredPoint.val.toFixed(1)}{unit}
          </div>
        )}
      </div>
    </div>
  );
};
