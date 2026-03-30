import { useToast } from '../components/ui';
import { skills, agents, mcpServers, commands, hooks } from '../data/dummy';

export function SystemDashboard() {
  const { showToast } = useToast();

  const coreSkills = skills.filter((s) => s.category === 'core');
  const projectTypeSkills = skills.filter((s) => s.category === 'project-types');
  const domainSkills = skills.filter((s) => s.category === 'domains');
  const integrationSkills = skills.filter((s) => s.category === 'integrations');

  const coreAgents = agents.filter((a) => a.type === 'core');
  const specialistAgents = agents.filter((a) => a.type === 'specialist');

  const connectedMcp = mcpServers.filter((s) => s.status === 'connected');
  const totalTools = mcpServers.reduce((sum, s) => sum + s.tools, 0);

  return (
    <div className="grid-cockpit">
      {/* [1,1] SYSTEM UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">SYSTEM UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Status: <span className="text-[#00FF88] font-bold" style={{ textShadow: '0 0 8px rgba(0,255,136,0.4)' }}>Online</span></p>
          <p>MCKAY OS v1.0 &middot; Phase 0</p>
          <p>Skills: <span className="stat-number text-base">{skills.length}</span> <span className="text-[#4A5A7A]">({skills.filter((s) => s.status === 'active').length} aktiv)</span></p>
          <p>Agents: <span className="stat-number text-base">{agents.length}</span> <span className="text-[#4A5A7A]">({agents.filter((a) => a.status === 'active').length} aktiv)</span></p>
          <p>MCP: <span className="stat-number text-base">{connectedMcp.length}</span>/{mcpServers.length} verbunden</p>
          <p>Tools gesamt: <span className="stat-number text-base">{totalTools}</span></p>
        </div>
      </div>

      {/* [1,2] SKILLS — CORE */}
      <div className="grid-cell">
        <h3 className="cell-title">SKILLS — CORE ({coreSkills.length})</h3>
        <div className="space-y-1">
          {coreSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0] font-medium">{s.name}</span>
              <p className="text-xs text-[#4A5A7A]">{s.purpose.slice(0, 60)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* [1,3] SKILLS — PROJECT TYPES */}
      <div className="grid-cell">
        <h3 className="cell-title">SKILLS — PROJECT TYPES ({projectTypeSkills.length})</h3>
        <div className="space-y-1">
          {projectTypeSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0] font-medium">{s.name}</span>
              <p className="text-xs text-[#4A5A7A]">{s.activateWhen || ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,1] SKILLS — DOMAINS */}
      <div className="grid-cell">
        <h3 className="cell-title">SKILLS — DOMAINS ({domainSkills.length})</h3>
        <div className="space-y-1">
          {domainSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0] font-medium">{s.name}</span>
              <p className="text-xs text-[#4A5A7A]">{s.activateWhen || ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,2] SKILLS — INTEGRATIONS */}
      <div className="grid-cell">
        <h3 className="cell-title">SKILLS — INTEGRATIONS ({integrationSkills.length})</h3>
        <div className="space-y-1">
          {integrationSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0] font-medium">{s.name}</span>
              <p className="text-xs text-[#4A5A7A]">{s.activateWhen || ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,3] AGENTS */}
      <div className="grid-cell">
        <h3 className="cell-title">AGENTS ({agents.length})</h3>
        <div className="mb-3">
          <p className="text-xs font-bold text-[#E0E6F0] mb-1">Core ({coreAgents.length}):</p>
          <div className="space-y-1">
            {coreAgents.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-sm">
                <span className="dot-green" />
                <span className="text-[#E0E6F0]">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-[#E0E6F0] mb-1">Specialists ({specialistAgents.length}):</p>
          <div className="space-y-1">
            {specialistAgents.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-sm">
                <span className={a.status === 'active' ? 'dot-green' : 'dot-yellow'} />
                <span className="text-[#E0E6F0]">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* [3,1] MCP SERVER */}
      <div className="grid-cell">
        <h3 className="cell-title">MCP SERVER ({mcpServers.length})</h3>
        <div className="space-y-2">
          {mcpServers.map((server) => (
            <div key={server.name} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
              <div className="flex items-center gap-2">
                <span className={server.status === 'connected' ? 'dot-green' : 'dot-red'} />
                <span className="text-[#E0E6F0]">{server.name}</span>
              </div>
              <span className="text-xs text-[#4A5A7A] font-mono">{server.tools} Tools</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#4A5A7A] mt-2">{connectedMcp.length} verbunden &middot; {totalTools} Tools</p>
      </div>

      {/* [3,2] COMMANDS & HOOKS */}
      <div className="grid-cell">
        <h3 className="cell-title">COMMANDS ({commands.length}) &amp; HOOKS ({hooks.length})</h3>
        <div className="space-y-1 mb-3">
          {commands.map((cmd) => (
            <div key={cmd.name} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
              <span className="text-[#00F0FF] font-mono">{cmd.name}</span>
              <span className="text-xs text-[#4A5A7A] text-right max-w-[55%]">{cmd.description}</span>
            </div>
          ))}
        </div>
        <div className="cell-separator pt-2">
          {hooks.map((hook) => (
            <div key={hook.name} className="text-sm border-b border-white/5 pb-1 mb-1">
              <span className="text-[#E0E6F0] font-medium">{hook.name}</span>
              <p className="text-xs text-[#4A5A7A]">{hook.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [3,3] QUICK ACTIONS */}
      <div className="grid-cell">
        <h3 className="cell-title">QUICK ACTIONS</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Skill recherchieren..."
              className="glass-input flex-1 text-sm"
            />
            <button
              onClick={() => showToast('Recherche gestartet')}
              className="cell-btn-sm"
            >
              Go
            </button>
          </div>
          <button
            onClick={() => showToast('Terminal wird geoeffnet')}
            className="cell-btn w-full text-left"
          >
            System-Terminal oeffnen
          </button>
          <button
            onClick={() => showToast('Health-Check gestartet')}
            className="cell-btn w-full text-left"
          >
            Health-Check ausfuehren
          </button>
        </div>
        <div className="mt-3 text-xs text-[#4A5A7A]">
          <p>Letzte Aenderung: heute, 14:32</p>
          <p>Keine Konflikte erkannt</p>
        </div>
      </div>
    </div>
  );
}
