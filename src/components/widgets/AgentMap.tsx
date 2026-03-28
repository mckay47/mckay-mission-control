import { Bot } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { agents } from '../../data/dummy';

export function AgentMap() {
  const coreAgents = agents.filter((a) => a.type === 'core');
  const specialists = agents.filter((a) => a.type === 'specialist');

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-4">
        <Bot className="w-5 h-5 text-neon-green" />
        <h2 className="text-base font-semibold text-text-primary">Agents</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">{agents.length} online</span>
      </div>

      <div className="space-y-3">
        {/* Core */}
        <div>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">
            Core ({coreAgents.length})
          </h3>
          <div className="space-y-1">
            {coreAgents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 py-0.5">
                <StatusDot
                  status={agent.status === 'active' ? 'healthy' : 'attention'}
                  pulse={false}
                  className="w-1.5 h-1.5"
                />
                <span className="text-sm text-text-primary">{agent.name}</span>
                <span className="text-[10px] text-text-muted truncate ml-auto">
                  {agent.purpose.split(' — ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialists */}
        <div>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">
            Specialists ({specialists.length})
          </h3>
          <div className="space-y-1">
            {specialists.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 py-0.5">
                <StatusDot
                  status={agent.status === 'active' ? 'healthy' : 'attention'}
                  pulse={false}
                  className="w-1.5 h-1.5"
                />
                <span className="text-sm text-text-primary">{agent.name}</span>
                <span className="text-[10px] text-text-muted truncate ml-auto">
                  {agent.purpose.split(' — ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
