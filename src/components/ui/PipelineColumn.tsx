import type { ReactNode } from 'react';
import type { PipelineIdea, PipelineStage } from '../../data/types';
import { GlowBadge } from './GlowBadge';

type StageColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

interface PipelineColumnProps {
  title?: string;
  label?: string;
  stage?: PipelineStage;
  count?: number;
  ideas?: PipelineIdea[];
  color?: StageColor;
  children?: ReactNode;
  className?: string;
}

const borderTopMap: Record<StageColor, string> = {
  cyan: 'border-t-neon-cyan',
  green: 'border-t-neon-green',
  orange: 'border-t-neon-orange',
  pink: 'border-t-neon-pink',
  purple: 'border-t-neon-purple',
  yellow: 'border-t-neon-yellow',
};

const badgeMap: Record<StageColor, string> = {
  cyan: 'bg-neon-cyan/10 text-neon-cyan',
  green: 'bg-neon-green/10 text-neon-green',
  orange: 'bg-neon-orange/10 text-neon-orange',
  pink: 'bg-neon-pink/10 text-neon-pink',
  purple: 'bg-neon-purple/10 text-neon-purple',
  yellow: 'bg-neon-yellow/10 text-neon-yellow',
};

const stageColorMap: Record<PipelineStage, StageColor> = {
  idea: 'yellow',
  research: 'cyan',
  strategy: 'purple',
  confirmed: 'orange',
  building: 'pink',
  live: 'green',
};

export function PipelineColumn({ title, label, stage, count, ideas, color, children, className = '' }: PipelineColumnProps) {
  const resolvedTitle = title ?? label ?? '';
  const resolvedColor = color ?? (stage ? stageColorMap[stage] : 'cyan');
  const resolvedCount = count ?? ideas?.length ?? 0;

  return (
    <div className={`flex flex-col min-w-[240px] ${className}`}>
      {/* Header */}
      <div className={`glass rounded-t-xl border-t-2 ${borderTopMap[resolvedColor]} px-4 py-3 flex items-center justify-between`}>
        <span className="text-sm font-medium text-text-primary">{resolvedTitle}</span>
        <span className={`tabular-nums text-xs font-medium px-2 py-0.5 rounded-full ${badgeMap[resolvedColor]}`}>
          {resolvedCount}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex flex-col gap-2 p-2 flex-1 rounded-b-xl bg-glass-bg/50">
        {children}
        {ideas?.map((idea) => (
          <div key={idea.id} className="glass rounded-lg p-3">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-sm font-medium text-text-primary">{idea.name}</h4>
              <GlowBadge text={idea.type} color={resolvedColor} />
            </div>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{idea.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
