import type { ReactNode } from 'react';

type BadgeColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

interface GlowBadgeProps {
  text?: string;
  children?: ReactNode;
  color?: BadgeColor;
  className?: string;
}

const badgeStyles: Record<BadgeColor, string> = {
  cyan: 'border-neon-cyan/40 text-neon-cyan box-glow-cyan',
  green: 'border-neon-green/40 text-neon-green box-glow-green',
  orange: 'border-neon-orange/40 text-neon-orange box-glow-orange',
  pink: 'border-neon-pink/40 text-neon-pink box-glow-pink',
  purple: 'border-neon-purple/40 text-neon-purple box-glow-purple',
  yellow: 'border-neon-yellow/40 text-neon-yellow',
};

export function GlowBadge({ text, children, color = 'cyan', className = '' }: GlowBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-glass-bg ${badgeStyles[color]} ${className}`}
    >
      {children ?? text}
    </span>
  );
}
