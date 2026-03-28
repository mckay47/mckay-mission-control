type BarColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

interface ProgressBarProps {
  value: number;
  color?: BarColor;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const barColorMap: Record<BarColor, string> = {
  cyan: 'bg-neon-cyan',
  green: 'bg-neon-green',
  orange: 'bg-neon-orange',
  pink: 'bg-neon-pink',
  purple: 'bg-neon-purple',
  yellow: 'bg-neon-yellow',
};

const barGlowMap: Record<BarColor, string> = {
  cyan: 'box-glow-cyan',
  green: 'box-glow-green',
  orange: 'box-glow-orange',
  pink: 'box-glow-pink',
  purple: 'box-glow-purple',
  yellow: '',
};

const heightMap: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({ value, color = 'cyan', height = 'md', showLabel = false, className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 rounded-full bg-glass-bg overflow-hidden ${heightMap[height]}`}>
        <div
          className={`${heightMap[height]} rounded-full transition-all duration-700 ease-out ${barColorMap[color]} ${barGlowMap[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="tabular-nums text-xs text-text-secondary w-8 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
