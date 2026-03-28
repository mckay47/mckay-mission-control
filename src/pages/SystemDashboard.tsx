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

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Skills */}
        <div className="animate-fade-in stagger-1">
          <SkillInventory />
        </div>

        {/* Right: Agents + MCP */}
        <div className="space-y-6">
          <div className="animate-fade-in stagger-2">
            <AgentMap />
          </div>

          {/* MCP Servers */}
          <div className="animate-fade-in stagger-3">
            <SectionLabel number="03" title="MCP" />
            <GlassCard>
              <div className="space-y-3">
                {mcpServers.map((server) => (
                  <div key={server.name} className="flex items-center gap-3">
                    <StatusDot status={mcpStatusMap[server.status]} />
                    <span className="text-sm text-text-primary font-medium">{server.name}</span>
                    <div className="ml-auto">
                      <GlowBadge color="cyan" className="text-[10px] px-1.5 py-0">
                        {server.tools} tools
                      </GlowBadge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
