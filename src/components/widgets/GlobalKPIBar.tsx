import { Activity, Cpu, Bot, Lightbulb, Server } from 'lucide-react';
import { KPICard } from '../ui/KPICard';
import { globalKPIs } from '../../data/dummy';
import type { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  'Active Projects': <Activity className="w-5 h-5" />,
  'Skills Loaded': <Cpu className="w-5 h-5" />,
  'Agents Online': <Bot className="w-5 h-5" />,
  'Pipeline Ideas': <Lightbulb className="w-5 h-5" />,
  'MCP Servers': <Server className="w-5 h-5" />,
};

export function GlobalKPIBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
