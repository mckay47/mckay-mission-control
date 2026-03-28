import { GlassCard } from '../ui/GlassCard';
import { RadialGauge } from '../ui/RadialGauge';
import { AnimatedNumber } from '../ui/AnimatedNumber';

interface KPIItem {
  label: string;
  gaugeValue: number;
  displayValue: number;
  prefix?: string;
  suffix?: string;
  color: 'cyan' | 'green' | 'orange' | 'purple';
}

const kpiData: KPIItem[] = [
  { label: 'Aktive Projekte', gaugeValue: 30, displayValue: 3, suffix: ' / 10', color: 'cyan' },
  { label: 'Tokens gesamt', gaugeValue: 75, displayValue: 175, suffix: 'K', color: 'green' },
  { label: 'Monatskosten', gaugeValue: 53, displayValue: 52, prefix: '\u20AC', suffix: ',70', color: 'orange' },
  { label: 'Pipeline-Ideen', gaugeValue: 25, displayValue: 5, suffix: ' / 20', color: 'purple' },
];

export function GlobalKPIBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, i) => (
        <GlassCard key={kpi.label} className={`flex flex-col items-center py-6 stagger-${Math.min(i + 1, 7)} animate-fade-in`}>
          <RadialGauge value={kpi.gaugeValue} label={kpi.label} size={100} color={kpi.color} />
          <div className="mt-3">
            <AnimatedNumber
              value={kpi.displayValue}
              prefix={kpi.prefix}
              suffix={kpi.suffix}
              color={kpi.color}
              size="sm"
            />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
