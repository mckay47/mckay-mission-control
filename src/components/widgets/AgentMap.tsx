import { Bot } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { AgentCard } from '../ui/AgentCard';
import { agents } from '../../data/dummy';

export function AgentMap() {
  const coreAgents = agents.filter((a) => a.type === 'core');
  const specialists = agents.filter((a) => a.type === 'specialist');

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-5">
        <Bot className="w-5 h-5 text-neon-green" />
        <h2 className="text-base font-semibold text-text-primary">Agent Map</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">{agents.length} agents</span>
      </div>

      <div className="space-y-5">
        {/* Core Agents */}
        <div>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2.5">
            Core
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {coreAgents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>

        {/* Specialist Agents */}
        <div>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2.5">
            Specialists
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {specialists.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
