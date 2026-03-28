import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { Milestone } from '../../data/types';

interface MilestoneProgressProps {
  milestones: Milestone[];
  expanded?: boolean;
}

export function MilestoneProgress({ milestones, expanded = false }: MilestoneProgressProps) {
  const completed = milestones.filter((m) => m.completed).length;
  const total = milestones.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          Fortschritt
        </h3>
        <span className="text-xs text-text-muted tabular-nums">
          {completed}/{total} Meilensteine ({percent}%)
        </span>
      </div>

      {/* Milestone track */}
      <div className={`relative ${expanded ? '' : 'overflow-hidden'}`}>
        {/* Connection line */}
        <div className="absolute top-4 left-4 right-4 h-px bg-white/10" />

        <div className="relative flex items-start justify-between gap-1">
          {milestones.map((milestone, i) => {
            const isCompleted = milestone.completed;
            const isActive = milestone.active;

            return (
              <div
                key={i}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                {/* Dot */}
                <div className="relative z-10 mb-2">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-neon-green/10 border border-neon-green/40 flex items-center justify-center box-glow-green">
                      <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    </div>
                  ) : isActive ? (
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center box-glow-cyan animate-pulse-glow">
                      <Loader2 className="w-4 h-4 text-neon-cyan animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-text-muted" />
                    </div>
                  )}
                </div>

                {/* Label */}
                {expanded && (
                  <span
                    className={`text-[10px] text-center leading-tight ${
                      isCompleted
                        ? 'text-neon-green'
                        : isActive
                          ? 'text-neon-cyan font-medium'
                          : 'text-text-muted'
                    }`}
                  >
                    {milestone.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar underneath */}
      <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-neon-cyan box-glow-cyan transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </GlassCard>
  );
}
