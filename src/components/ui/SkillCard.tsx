import { StatusDot } from './StatusDot';
import { GlowBadge } from './GlowBadge';
import type { Skill, SkillCategory } from '../../data/types';

interface SkillCardProps {
  skill?: Skill;
  name?: string;
  category?: SkillCategory;
  purpose?: string;
  active?: boolean;
  className?: string;
}

const categoryColorMap: Record<SkillCategory, 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow'> = {
  core: 'cyan',
  'project-types': 'purple',
  domains: 'orange',
  integrations: 'green',
};

export function SkillCard({ skill, name, category, purpose, active, className = '' }: SkillCardProps) {
  const resolvedName = skill?.name ?? name ?? '';
  const resolvedCategory = skill?.category ?? category ?? 'core';
  const resolvedPurpose = skill?.purpose ?? purpose ?? '';
  const skillIsActive = skill ? skill.status === 'active' : true;
  const resolvedActive = active ?? skillIsActive;

  return (
    <div className={`glass rounded-lg p-4 animate-slide-in ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-text-primary truncate">{resolvedName}</h4>
        <StatusDot status={resolvedActive ? 'healthy' : 'risk'} pulse={resolvedActive} />
      </div>

      <GlowBadge text={resolvedCategory} color={categoryColorMap[resolvedCategory]} className="mb-2" />

      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{resolvedPurpose}</p>
    </div>
  );
}
