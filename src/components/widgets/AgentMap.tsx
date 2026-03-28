import { Bot, Brain } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SectionLabel } from '../ui/SectionLabel';
import { agents, projects } from '../../data/dummy';
import type { Agent } from '../../data/types';

/**
 * Determine which projects an agent is active in.
 * - Core agents (kani-master, launch-agent, build-agent, ops-agent) are active in ALL projects.
 * - Specialist agents match by domain keywords in project skills:
 *   - research-agent  -> projects with 'research' in any skill or business-model
 *   - strategy-agent  -> projects with 'business-model' in any skill
 *   - sales-agent     -> projects with 'deploy' in any skill (go-to-market)
 *   - life-agent      -> no project association
 */
function getAgentProjects(agent: Agent): string[] {
  if (agent.type === 'core') {
    return projects.map((p) => p.name);
  }

  const nameLC = agent.name.toLowerCase();

  if (nameLC.includes('research')) {
    return projects
      .filter((p) => p.skills.some((s) => s.includes('business-model') || s.includes('market')))
      .map((p) => p.name);
  }

  if (nameLC.includes('strategy')) {
    return projects
      .filter((p) => p.skills.some((s) => s.includes('business-model')))
      .map((p) => p.name);
  }

  if (nameLC.includes('sales')) {
    return projects
      .filter((p) => p.skills.some((s) => s.includes('deploy') || s.includes('marketplace')))
      .map((p) => p.name);
  }

  // life-agent or unknown specialists — no project association
  return [];
}

function AgentCard({ agent, index, iconColor }: { agent: Agent; index: number; iconColor: 'cyan' | 'purple' }) {
  const agentProjects = getAgentProjects(agent);
  const Icon = iconColor === 'cyan' ? Bot : Brain;

  return (
    <div
      className={`glass rounded-xl p-4 stagger-${Math.min(index + 1, 7)} animate-fade-in`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <Icon className={`w-5 h-5 ${iconColor === 'cyan' ? 'text-neon-cyan' : 'text-neon-purple'}`} />
          {agent.status === 'active' && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse-ring" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
      </div>
      <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 mb-2">
        {agent.purpose}
      </p>
      {agentProjects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {agentProjects.map((name) => (
            <span
              key={name}
              className="inline-block px-1.5 py-0.5 text-[9px] rounded bg-white/5 border border-white/8 text-text-muted truncate max-w-[100px]"
              title={name}
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

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
            <AgentCard key={agent.name} agent={agent} index={i} iconColor="cyan" />
          ))}
        </div>
      </div>

      {/* Specialist Agents */}
      <div>
        <span className="hud-label mb-3 block">Specialists ({specialists.length})</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specialists.map((agent, i) => (
            <AgentCard key={agent.name} agent={agent} index={i + 3} iconColor="purple" />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
