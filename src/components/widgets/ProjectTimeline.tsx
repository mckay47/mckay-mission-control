import { Clock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { TimelineItem } from '../ui/TimelineItem';
import type { TimelineEntry } from '../../data/types';

interface ProjectTimelineProps {
  timeline: TimelineEntry[];
  title?: string;
}

export function ProjectTimeline({ timeline, title = 'Timeline' }: ProjectTimelineProps) {
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
