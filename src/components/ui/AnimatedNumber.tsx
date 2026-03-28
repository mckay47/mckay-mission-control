import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  color?: 'cyan' | 'green' | 'orange' | 'pink' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  duration?: number;
  className?: string;
}

const sizeMap = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl', xl: 'text-7xl' };
const glowMap = {
  cyan: 'text-neon-cyan text-glow-cyan',
  green: 'text-neon-green text-glow-green',
  orange: 'text-neon-orange text-glow-orange',
  pink: 'text-neon-pink text-glow-pink',
  purple: 'text-neon-purple text-glow-purple',
};

export function AnimatedNumber({
  value, prefix = '', suffix = '', color = 'cyan', size = 'md', duration = 1500, className = '',
}: AnimatedNumberProps) {
  const animated = useAnimatedNumber(value, duration);

  return (
    <span className={`tabular-nums font-bold ${sizeMap[size]} ${glowMap[color]} animate-count ${className}`}>
      {prefix}{animated.toLocaleString('de-DE')}{suffix}
    </span>
  );
}
