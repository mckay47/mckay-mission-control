import { Kanban } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { PipelineColumn } from '../ui/PipelineColumn';
import { pipelineIdeas } from '../../data/dummy';
import type { PipelineStage } from '../../data/types';

const stages: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'idea', label: 'Ideas', color: 'text-text-secondary' },
  { key: 'research', label: 'Research', color: 'text-neon-cyan' },
  { key: 'strategy', label: 'Strategy', color: 'text-neon-purple' },
  { key: 'confirmed', label: 'Confirmed', color: 'text-neon-orange' },
  { key: 'building', label: 'Building', color: 'text-neon-pink' },
  { key: 'live', label: 'Live', color: 'text-neon-green' },
];

export function PipelineBoard() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-5">
        <Kanban className="w-5 h-5 text-neon-orange" />
        <h2 className="text-base font-semibold text-text-primary">Ideas Pipeline</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {pipelineIdeas.length} ideas
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.key}
            stage={stage.key}
            label={stage.label}
            ideas={pipelineIdeas.filter((idea) => idea.stage === stage.key)}
          />
        ))}
      </div>
    </GlassCard>
  );
}
