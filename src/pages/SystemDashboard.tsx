import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusDot } from '../components/ui/StatusDot';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { GlowBadge } from '../components/ui/GlowBadge';
import { SkillInventory } from '../components/widgets/SkillInventory';
import { AgentMap } from '../components/widgets/AgentMap';
import { mcpServers } from '../data/dummy';
import type { MCPStatus } from '../data/types';

const mcpStatusMap: Record<MCPStatus, 'healthy' | 'attention' | 'risk' | 'critical'> = {
  connected: 'healthy',
  disconnected: 'attention',
  error: 'critical',
};

export function SystemDashboard() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neon-purple text-glow-purple mb-2">System</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <AnimatedNumber value={16} color="purple" size="sm" /> Skills
          </span>
          <span>&middot;</span>
          <span className="flex items-center gap-1.5">
            <AnimatedNumber value={8} color="green" size="sm" /> Agents
          </span>
          <span>&middot;</span>
          <span className="flex items-center gap-1.5">
            <AnimatedNumber value={5} color="cyan" size="sm" /> MCP Servers
          </span>
        </div>
      </div>

      {/* Two-column grid: Skills + Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Skills with search input */}
        <div className="animate-fade-in stagger-1">
          <SectionLabel number="01" title="SKILLS" />
          <SkillInventory />
          <GlassCard className="mt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Neuen Skill recherchieren..."
                className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/40 transition-colors"
              />
              <button className="vision-btn px-4 py-2.5 text-sm text-neon-purple">
                Suchen
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right: Agents */}
        <div className="animate-fade-in stagger-2">
          <SectionLabel number="02" title="AGENTS" />
          <AgentMap />
        </div>
      </div>

      {/* Bottom: MCP Servers */}
      <section className="animate-fade-in stagger-3">
        <SectionLabel number="03" title="MCP SERVERS" />
        <GlassCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mcpServers.map((server) => (
              <div
                key={server.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <StatusDot status={mcpStatusMap[server.status]} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text-primary font-medium block truncate">
                    {server.name}
                  </span>
                  <span className="text-[10px] text-text-muted">{server.description}</span>
                </div>
                <GlowBadge color="cyan" className="text-[10px] px-1.5 py-0">
                  {server.tools} tools
                </GlowBadge>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </PageContainer>
  );
}
