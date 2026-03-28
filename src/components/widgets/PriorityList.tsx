import { Target } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlowBadge } from '../ui/GlowBadge';
import { priorities } from '../../data/dummy';

const impactColorMap: Record<string, 'pink' | 'orange' | 'cyan'> = {
  high: 'pink',
  medium: 'orange',
  low: 'cyan',
};

export function PriorityList() {
  const sorted = [...priorities].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.impact] - order[b.impact];
  });

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-4">
        <Target className="w-5 h-5 text-neon-pink" />
        <h2 className="text-base font-semibold text-text-primary">Top Priorities</h2>
      </div>

      <div className="space-y-3">
        {sorted.map((priority) => (
          <div
            key={priority.id}
            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{priority.text}</p>
              {priority.project && (
                <p className="text-xs text-text-muted mt-1">{priority.project}</p>
              )}
            </div>
            <GlowBadge color={impactColorMap[priority.impact]}>
              {priority.impact}
            </GlowBadge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
