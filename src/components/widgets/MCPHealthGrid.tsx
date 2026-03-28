import { Server } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { ServerStatusCard } from '../ui/ServerStatusCard';
import { mcpServers } from '../../data/dummy';

export function MCPHealthGrid() {
  const connectedCount = mcpServers.filter((s) => s.status === 'connected').length;

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-5">
        <Server className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-base font-semibold text-text-primary">MCP Servers</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {connectedCount}/{mcpServers.length} connected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mcpServers.map((server) => (
          <ServerStatusCard key={server.name} server={server} />
        ))}
      </div>
    </GlassCard>
  );
}
