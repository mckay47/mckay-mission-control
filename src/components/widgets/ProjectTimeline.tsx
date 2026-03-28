import { Clock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { TimelineItem } from '../ui/TimelineItem';
import type { TimelineEntry } from '../../data/types';

interface ProjectTimelineProps {
  timeline: TimelineEntry[];
  title?: string;
  horizontal?: boolean;
}

export function ProjectTimeline({ timeline, title = 'Timeline', horizontal = false }: ProjectTimelineProps) {
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (horizontal) {
    return (
      <GlassCard className="!py-4">
        <div className="flex items-center gap-2.5 mb-3">
          <Clock className="w-4 h-4 text-neon-cyan" />
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <span className="text-xs text-text-muted tabular-nums ml-auto">{sorted.length} Eintraege</span>
        </div>

        <div className="overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-start gap-0 min-w-max relative">
            {/* Horizontal line */}
            <div className="absolute top-[7px] left-3 right-3 h-px bg-white/10" />

            {sorted.map((entry, i) => (
              <div
                key={`${entry.date}-${i}`}
                className="relative flex flex-col items-start min-w-[160px] max-w-[200px] px-3"
              >
                {/* Dot */}
                <div className="w-3.5 h-3.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center mb-2 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                </div>
                <span className="text-[10px] text-text-muted tabular-nums">{entry.date}</span>
                <h4 className="text-xs font-medium text-text-primary mt-0.5 leading-tight">{entry.title}</h4>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-snug line-clamp-2">{entry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-5">
        <Clock className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      </div>

      <div className="relative pl-4">
        {/* Vertical timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />

        <div className="space-y-1">
          {sorted.map((entry, i) => (
            <TimelineItem key={`${entry.date}-${i}`} entry={entry} />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
