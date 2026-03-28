import type { TimelineEntry } from '../../data/types';

type DotColor = 'cyan' | 'green' | 'orange' | 'pink' | 'purple';

interface TimelineItemProps {
  entry?: TimelineEntry;
  date?: string;
  title?: string;
  description?: string;
  color?: DotColor;
  isLast?: boolean;
  className?: string;
}

const dotBgMap: Record<DotColor, string> = {
  cyan: 'bg-neon-cyan glow-cyan',
  green: 'bg-neon-green glow-green',
  orange: 'bg-neon-orange glow-orange',
  pink: 'bg-neon-pink glow-pink',
  purple: 'bg-neon-purple glow-purple',
};

export function TimelineItem({ entry, date, title, description, color = 'cyan', isLast = false, className = '' }: TimelineItemProps) {
  const resolvedDate = entry?.date ?? date ?? '';
  const resolvedTitle = entry?.title ?? title ?? '';
  const resolvedDescription = entry?.description ?? description ?? '';

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${dotBgMap[color]}`} />
        {!isLast && (
          <div className="w-px flex-1 bg-glass-border mt-1" />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <span className="text-xs text-text-muted tabular-nums">{resolvedDate}</span>
        <h4 className="text-sm font-medium text-text-primary mt-0.5">{resolvedTitle}</h4>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{resolvedDescription}</p>
      </div>
    </div>
  );
}
