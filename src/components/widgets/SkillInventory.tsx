import { Cpu } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { skills } from '../../data/dummy';
import type { SkillCategory } from '../../data/types';

const categoryOrder: SkillCategory[] = ['core', 'project-types', 'domains', 'integrations'];

const categoryLabels: Record<SkillCategory, string> = {
  core: 'Core',
  'project-types': 'Project Types',
  domains: 'Domains',
  integrations: 'Integrations',
};

export function SkillInventory() {
  const grouped = categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    items: skills.filter((s) => s.category === category),
  }));

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-4">
        <Cpu className="w-5 h-5 text-neon-purple" />
        <h2 className="text-base font-semibold text-text-primary">Skills</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">{skills.length} geladen</span>
      </div>

      <div className="space-y-3">
        {grouped.map((group) => (
          <div key={group.category}>
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">
              {group.label} ({group.items.length})
            </h3>
            <div className="space-y-1">
              {group.items.map((skill) => (
                <div key={skill.name} className="flex items-center gap-2 py-0.5">
                  <StatusDot
                    status={skill.status === 'active' ? 'healthy' : 'attention'}
                    pulse={false}
                    className="w-1.5 h-1.5"
                  />
                  <span className="text-sm text-text-primary">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
