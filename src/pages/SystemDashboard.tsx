import { Cpu, Bot, Server, Terminal, Shield } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowBadge } from '../components/ui/GlowBadge';
import { GlowNumber } from '../components/ui/GlowNumber';
import { SkillInventory } from '../components/widgets/SkillInventory';
import { AgentMap } from '../components/widgets/AgentMap';
import { MCPHealthGrid } from '../components/widgets/MCPHealthGrid';
import { FolderTree } from '../components/widgets/FolderTree';
import { commands, hooks } from '../data/dummy';

export function SystemDashboard() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-6 mb-8">
        <h1 className="text-3xl font-bold text-neon-purple">System Dashboard</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            <GlowNumber value={16} size="sm" color="cyan" />
            <span className="text-xs text-text-muted">Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-neon-green" />
            <GlowNumber value={8} size="sm" color="green" />
            <span className="text-xs text-text-muted">Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-neon-pink" />
            <GlowNumber value={5} size="sm" color="pink" />
            <span className="text-xs text-text-muted">MCP Servers</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Skills</h2>
        <SkillInventory />
      </section>

      {/* Agents */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Agents</h2>
        <AgentMap />
      </section>

      {/* MCP Servers */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-text-secondary mb-4">MCP Servers</h2>
        <MCPHealthGrid />
      </section>

      {/* Commands & Hooks side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Commands */}
        <section>
          <h2 className="text-lg font-semibold text-text-secondary mb-4">Commands</h2>
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-2 pr-4 text-text-muted font-medium">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5" />
                        Command
                      </div>
                    </th>
                    <th className="text-left py-2 pr-4 text-text-muted font-medium">Description</th>
                    <th className="text-left py-2 text-text-muted font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commands.map((cmd) => (
                    <tr key={cmd.name} className="border-b border-glass-border/50 last:border-0">
                      <td className="py-2.5 pr-4">
                        <span className="font-mono text-neon-cyan">{cmd.name}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-text-secondary">{cmd.description}</td>
                      <td className="py-2.5">
                        <GlowBadge
                          text={cmd.status}
                          color={cmd.status === 'active' ? 'green' : 'yellow'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>

        {/* Hooks */}
        <section>
          <h2 className="text-lg font-semibold text-text-secondary mb-4">Hooks</h2>
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-2 pr-4 text-text-muted font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        Hook
                      </div>
                    </th>
                    <th className="text-left py-2 pr-4 text-text-muted font-medium">Event</th>
                    <th className="text-left py-2 text-text-muted font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {hooks.map((hook) => (
                    <tr key={hook.name} className="border-b border-glass-border/50 last:border-0">
                      <td className="py-2.5 pr-4">
                        <span className="font-mono text-neon-orange">{hook.name}</span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <GlowBadge text={hook.event} color="purple" />
                      </td>
                      <td className="py-2.5 text-text-secondary">{hook.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Folder Structure */}
      <section>
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Folder Structure</h2>
        <FolderTree />
      </section>
    </PageContainer>
  );
}
