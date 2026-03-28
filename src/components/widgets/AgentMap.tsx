import { Bot, Brain } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SectionLabel } from '../ui/SectionLabel';
import { agents } from '../../data/dummy';

export function AgentMap() {
  const coreAgents = agents.filter((a) => a.type === 'core');
  const specialists = agents.filter((a) => a.type === 'specialist');

  return (
    <GlassCard elevated className="animate-fade-in">
      <SectionLabel number="08" title="AGENTS" />

      {/* Core Agents */}
      <div className="mb-6">
        <span className="hud-label mb-3 block">Core ({coreAgents.length})</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coreAgents.map((agent, i) => (
            <div
              key={agent.name}
              className={`glass rounded-xl p-4 stagger-${Math.min(i + 1, 7)} animate-fade-in`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Bot className="w-5 h-5 text-neon-cyan" />
                  {agent.status === 'active' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse-ring" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                {agent.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Specialist Agents */}
      <div>
        <span className="hud-label mb-3 block">Specialists ({specialists.length})</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specialists.map((agent, i) => (
            <div
              key={agent.name}
              className={`glass rounded-xl p-4 stagger-${Math.min(i + 4, 7)} animate-fade-in`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Brain className="w-5 h-5 text-neon-purple" />
                  {agent.status === 'active' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse-ring" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                {agent.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
