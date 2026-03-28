import type { ReactNode } from 'react';

type GlowColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple';

interface GlassCardProps {
  children: ReactNode;
  glow?: GlowColor;
  elevated?: boolean;
  scan?: boolean;
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

export function GlassCard({ children, glow, elevated, scan, className = '', onClick }: GlassCardProps) {
  const base = elevated ? 'glass-elevated' : 'glass';
  const glowClass = glow ? glowMap[glow] : '';
  const scanClass = scan ? 'scan-line-container' : '';

  return (
    <div
      className={`${base} rounded-2xl p-5 ${glowClass} ${scanClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
