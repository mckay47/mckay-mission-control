import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

interface RadialGaugeProps {
  value: number; // 0-100
  label?: string;
  size?: number; // px
  color?: 'cyan' | 'green' | 'orange' | 'pink' | 'purple';
  className?: string;
}

const colorValues: Record<string, string> = {
  cyan: '#00F0FF',
  green: '#00FF88',
  orange: '#FF6B2C',
  pink: '#FF2DAA',
  purple: '#8B5CF6',
};

export function RadialGauge({ value, label, size = 120, color = 'cyan', className = '' }: RadialGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const animated = useAnimatedNumber(clamped, 2000);
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated / 100) * circumference;
  const c = colorValues[color];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gauge-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c} stopOpacity="0.2" />
            <stop offset="100%" stopColor={c} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={`gauge-fill-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c} />
            <stop offset="100%" stopColor={c} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`gauge-glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Metallic outer ring */}
        <circle cx={size/2} cy={size/2} r={r + 4} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx={size/2} cy={size/2} r={r + 2} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Track */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={`url(#gauge-grad-${color})`}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={`url(#gauge-fill-${color})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#gauge-glow-${color})`}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(tick => {
          const angle = (tick / 100) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = size/2 + (r + 6) * Math.cos(rad);
          const y1 = size/2 + (r + 6) * Math.sin(rad);
          const x2 = size/2 + (r + 10) * Math.cos(rad);
          const y2 = size/2 + (r + 10) * Math.sin(rad);
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />;
        })}
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`tabular-nums font-bold ${size > 100 ? 'text-2xl' : 'text-lg'} text-neon-${color} text-glow-${color}`}>
          {animated}%
        </span>
        {label && <span className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
}
