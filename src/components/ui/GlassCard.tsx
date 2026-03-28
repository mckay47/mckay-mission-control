import type { ReactNode } from 'react';

type GlowColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple';

interface GlassCardProps {
  children: ReactNode;
  glow?: GlowColor;
  className?: string;
  onClick?: () => void;
}

const glowMap: Record<GlowColor, string> = {
  cyan: 'box-glow-cyan',
  green: 'box-glow-green',
  orange: 'box-glow-orange',
  pink: 'box-glow-pink',
  purple: 'box-glow-purple',
};

export function GlassCard({ children, glow, className = '', onClick }: GlassCardProps) {
  const glowClass = glow ? glowMap[glow] : '';

  return (
    <div
      className={`glass rounded-xl p-5 ${glowClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
