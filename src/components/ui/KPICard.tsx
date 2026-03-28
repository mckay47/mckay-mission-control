import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type AccentColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  color?: AccentColor;
  className?: string;
}

const textGlowMap: Record<AccentColor, string> = {
  cyan: 'text-glow-cyan text-neon-cyan',
  green: 'text-glow-green text-neon-green',
  orange: 'text-glow-orange text-neon-orange',
  pink: 'text-glow-pink text-neon-pink',
  purple: 'text-neon-purple',
};

const iconColorMap: Record<AccentColor, string> = {
  cyan: 'text-neon-cyan glow-cyan',
  green: 'text-neon-green glow-green',
  orange: 'text-neon-orange glow-orange',
  pink: 'text-neon-pink glow-pink',
  purple: 'text-neon-purple glow-purple',
};

export function KPICard({ label, value, change, icon, color = 'cyan', className = '' }: KPICardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <div className={`glass rounded-xl p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-text-secondary">{label}</span>
        {icon && <span className={iconColorMap[color]}>{icon}</span>}
      </div>

      <div className={`tabular-nums text-3xl font-semibold ${textGlowMap[color]}`}>
        {value}
      </div>

      {change && (
        <div className="flex items-center gap-1 mt-2 text-sm">
          {isPositive && <TrendingUp className="w-3.5 h-3.5 text-neon-green" />}
          {isNegative && <TrendingDown className="w-3.5 h-3.5 text-status-risk" />}
          <span className={isPositive ? 'text-neon-green' : isNegative ? 'text-status-risk' : 'text-text-secondary'}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
