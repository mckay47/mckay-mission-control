type NeonColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

interface GlowNumberProps {
  value: string | number;
  color?: NeonColor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const textGlowMap: Record<NeonColor, string> = {
  cyan: 'text-glow-cyan text-neon-cyan',
  green: 'text-glow-green text-neon-green',
  orange: 'text-glow-orange text-neon-orange',
  pink: 'text-glow-pink text-neon-pink',
  purple: 'text-neon-purple',
  yellow: 'text-neon-yellow',
};

const sizeMap: Record<string, string> = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-5xl',
  xl: 'text-7xl',
};

export function GlowNumber({ value, color = 'cyan', size = 'lg', className = '' }: GlowNumberProps) {
  return (
    <span className={`tabular-nums font-semibold ${sizeMap[size]} ${textGlowMap[color]} ${className}`}>
      {value}
    </span>
  );
}
