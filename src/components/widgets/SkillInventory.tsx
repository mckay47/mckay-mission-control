import { Cpu } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SkillCard } from '../ui/SkillCard';
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
      <div className="flex items-center gap-2.5 mb-5">
        <Cpu className="w-5 h-5 text-neon-purple" />
        <h2 className="text-base font-semibold text-text-primary">
          Skills Inventory
        </h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">{skills.length} loaded</span>
      </div>

      <div className="space-y-5">
        {grouped.map((group) => (
          <div key={group.category}>
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2.5">
              {group.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {group.items.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
