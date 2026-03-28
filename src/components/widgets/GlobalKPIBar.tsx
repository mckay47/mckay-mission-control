import { Briefcase, CreditCard, Zap, Lightbulb } from 'lucide-react';
import { KPICard } from '../ui/KPICard';
import { globalKPIs } from '../../data/dummy';
import type { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  'Aktive Projekte': <Briefcase className="w-5 h-5" />,
  'Monatskosten': <CreditCard className="w-5 h-5" />,
  'Tokens gesamt': <Zap className="w-5 h-5" />,
  'Pipeline-Ideen': <Lightbulb className="w-5 h-5" />,
};

export function GlobalKPIBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {globalKPIs.map((kpi) => (
        <KPICard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          color={kpi.color}
          icon={iconMap[kpi.label]}
        />
      ))}
    </div>
  );
}
