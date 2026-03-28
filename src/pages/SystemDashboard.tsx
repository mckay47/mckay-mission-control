import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusDot } from '../components/ui/StatusDot';
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
      <div className="flex flex-wrap items-baseline gap-3 mb-8">
        <h1 className="text-3xl font-bold text-neon-purple">System</h1>
        <span className="text-sm text-text-muted">
          16 Skills &middot; 8 Agents &middot; 5 MCP Servers
        </span>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Skills */}
        <div>
          <SkillInventory />
        </div>

        {/* Right: Agents + MCP */}
        <div className="space-y-6">
          <AgentMap />

          {/* MCP Servers — simple inline list */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-text-secondary mb-4">MCP Servers</h3>
            <div className="space-y-3">
              {mcpServers.map((server) => (
                <div key={server.name} className="flex items-center gap-3">
                  <StatusDot status={mcpStatusMap[server.status]} />
                  <span className="text-sm text-text-primary font-medium">{server.name}</span>
                  <span className="ml-auto text-xs text-text-muted tabular-nums">
                    {server.tools} tools
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
