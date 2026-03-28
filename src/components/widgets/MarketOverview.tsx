import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { MarketData } from '../../data/types';

interface MarketOverviewProps {
  market: MarketData;
}

const dataRows: {
  key: keyof MarketData;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { key: 'marketSize', label: 'Marktgroesse', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'text-neon-cyan' },
  { key: 'potentialCustomers', label: 'Potenzielle Kunden', icon: <Users className="w-3.5 h-3.5" />, color: 'text-neon-green' },
  { key: 'revenueEstimate', label: 'Umsatzprognose', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-neon-orange' },
  { key: 'profitEstimate', label: 'Gewinnprognose', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-neon-pink' },
];

export function MarketOverview({ market }: MarketOverviewProps) {
  return (
    <GlassCard>
      <h3 className="text-sm font-semibold text-text-secondary mb-3">Markt</h3>
      <div className="space-y-2.5">
        {dataRows.map((row) => {
          const value = market[row.key];
          if (!value) return null;
          return (
            <div key={row.key} className="flex items-start gap-2.5">
              <span className={`mt-0.5 ${row.color}`}>{row.icon}</span>
              <div className="min-w-0">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                  {row.label}
                </span>
                <span className="text-sm text-text-primary">{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
