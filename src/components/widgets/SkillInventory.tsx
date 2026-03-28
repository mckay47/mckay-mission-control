import { Shield, Layers, Globe, Plug } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { SectionLabel } from '../ui/SectionLabel';
import { skills, projects } from '../../data/dummy';
import type { SkillCategory } from '../../data/types';
import type { ReactNode } from 'react';

const categoryOrder: SkillCategory[] = ['core', 'project-types', 'domains', 'integrations'];

const categoryLabels: Record<SkillCategory, string> = {
  core: 'Core',
  'project-types': 'Project Types',
  domains: 'Domains',
  integrations: 'Integrations',
};

const categoryIcons: Record<SkillCategory, ReactNode> = {
  core: <Shield className="w-4 h-4 text-neon-cyan" />,
  'project-types': <Layers className="w-4 h-4 text-neon-purple" />,
  domains: <Globe className="w-4 h-4 text-neon-orange" />,
  integrations: <Plug className="w-4 h-4 text-neon-green" />,
};

function getProjectsUsingSkill(skillName: string): string[] {
  return projects
    .filter((p) => p.skills.some((s) => s.includes(skillName)))
    .map((p) => p.name);
}

export function SkillInventory() {
  const grouped = categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    icon: categoryIcons[category],
    items: skills.filter((s) => s.category === category),
  }));

  return (
    <GlassCard elevated className="animate-fade-in">
      <SectionLabel number="07" title="SKILLS" />

      <div className="space-y-6">
        {grouped.map((group, gi) => (
          <div key={group.category} className={`stagger-${Math.min(gi + 1, 7)} animate-fade-in`}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3">
              {group.icon}
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                {group.label}
              </span>
              <span className="text-[10px] text-text-muted tabular-nums">({group.items.length})</span>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {group.items.map((skill) => {
                const usedBy = getProjectsUsingSkill(skill.name);
                return (
                  <div
                    key={skill.name}
                    className="glass rounded-xl p-3 flex items-start gap-2.5"
                  >
                    <StatusDot
                      status={skill.status === 'active' ? 'healthy' : 'attention'}
                      pulse={skill.status === 'active'}
                      className="mt-1 w-2 h-2"
                    />
                    <div className="min-w-0">
                      <span className="text-sm text-text-primary block truncate">{skill.name}</span>
                      {usedBy.length > 0 && (
                        <span className="text-[10px] text-text-muted truncate block">
                          {usedBy.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
