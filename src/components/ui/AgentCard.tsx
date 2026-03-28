import { Bot } from 'lucide-react';
import { StatusDot } from './StatusDot';
import { GlowBadge } from './GlowBadge';
import type { Agent, AgentType } from '../../data/types';

interface AgentCardProps {
  agent?: Agent;
  name?: string;
  type?: AgentType;
  purpose?: string;
  status?: 'active' | 'inactive';
  triggers?: string;
  className?: string;
}

const typeBadgeColor: Record<AgentType, 'cyan' | 'purple'> = {
  core: 'cyan',
  specialist: 'purple',
};

export function AgentCard({ agent, name, type, purpose, status, triggers, className = '' }: AgentCardProps) {
  const resolvedName = agent?.name ?? name ?? '';
  const resolvedType = agent?.type ?? type ?? 'core';
  const resolvedPurpose = agent?.purpose ?? purpose ?? '';
  const resolvedStatus = agent?.status ?? status ?? 'active';
  const resolvedTriggers = agent?.triggers ?? triggers ?? '';
  const isActive = resolvedStatus === 'active';

  return (
    <div className={`glass rounded-lg p-4 animate-slide-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-glass-bg ${isActive ? 'glow-purple' : ''}`}>
          <Bot className="w-4 h-4 text-neon-purple" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-text-primary truncate">{resolvedName}</h4>
            <StatusDot status={isActive ? 'healthy' : 'attention'} pulse={isActive} />
          </div>

          <GlowBadge text={resolvedType} color={typeBadgeColor[resolvedType]} className="mb-2" />

          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-2">{resolvedPurpose}</p>

          {resolvedTriggers && (
            <span className="text-xs text-text-muted">
              Trigger: {resolvedTriggers}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
