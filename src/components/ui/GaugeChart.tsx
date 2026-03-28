type GaugeColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

interface GaugeChartProps {
  value: number;
  label?: string;
  color?: GaugeColor;
  size?: number;
  className?: string;
}

const colorHexMap: Record<GaugeColor, string> = {
  cyan: '#00F0FF',
  green: '#00FF88',
  orange: '#FF6B2C',
  pink: '#FF2DAA',
  purple: '#8B5CF6',
  yellow: '#FFD600',
};

const textGlowMap: Record<GaugeColor, string> = {
  cyan: 'text-glow-cyan text-neon-cyan',
  green: 'text-glow-green text-neon-green',
  orange: 'text-glow-orange text-neon-orange',
  pink: 'text-glow-pink text-neon-pink',
  purple: 'text-neon-purple',
  yellow: 'text-neon-yellow',
};

export function GaugeChart({ value, label, color = 'cyan', size = 120, className = '' }: GaugeChartProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const hex = colorHexMap[color];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Filled arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={hex}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-gauge"
            style={{
              filter: `drop-shadow(0 0 6px ${hex}60)`,
            }}
          />
        </svg>

        {/* Center number overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`tabular-nums text-2xl font-semibold ${textGlowMap[color]}`}>
            {clampedValue}
          </span>
        </div>
      </div>

      {label && (
        <span className="text-xs text-text-secondary">{label}</span>
      )}
    </div>
  );
}
