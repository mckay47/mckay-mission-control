import { Check, X } from 'lucide-react';
import type { TodoItem } from '../../data/types';

type Priority = 'high' | 'medium' | 'low';

interface ChecklistItemProps {
  todo?: TodoItem;
  text?: string;
  done?: boolean;
  priority?: Priority;
  onToggle?: () => void;
  onDelete?: () => void;
  className?: string;
}

const priorityIndicatorMap: Record<Priority, string> = {
  high: 'bg-status-critical',
  medium: 'bg-status-attention',
  low: 'bg-neon-cyan',
};

export function ChecklistItem({ todo, text, done, priority, onToggle, onDelete, className = '' }: ChecklistItemProps) {
  const resolvedText = todo?.text ?? text ?? '';
  const resolvedDone = todo?.done ?? done ?? false;
  const resolvedPriority = todo?.priority ?? priority;

  return (
    <div
      className={`flex items-center gap-3 group py-1.5 ${className}`}
      role="checkbox"
      aria-checked={resolvedDone}
    >
      {/* Checkbox */}
      <button
        className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors duration-200 cursor-pointer ${
          resolvedDone
            ? 'bg-neon-cyan/20 border-neon-cyan/40'
            : 'border-glass-border group-hover:border-neon-cyan/30'
        }`}
        onClick={onToggle}
        tabIndex={0}
      >
        {resolvedDone && <Check className="w-3 h-3 text-neon-cyan" />}
      </button>

      {/* Priority indicator */}
      {resolvedPriority && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityIndicatorMap[resolvedPriority]}`} />
      )}

      {/* Text */}
      <span className={`text-sm flex-1 transition-colors duration-200 ${
        resolvedDone ? 'line-through text-text-muted' : 'text-text-primary'
      }`}>
        {resolvedText}
      </span>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-status-critical transition-all cursor-pointer"
          aria-label="Delete item"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
