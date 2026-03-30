import { useToast } from '../components/ui';
import { skills, agents, mcpServers, commands, hooks } from '../data/dummy';

const btnClass =
  'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black';

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
    <div className="grid-cockpit bg-white">
      {/* [1,1] SYSTEM UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SYSTEM UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Status: <span className="text-green-600 font-bold">Online</span></p>
          <p>MCKAY OS v1.0 · Phase 0</p>
          <p>Skills: {skills.length} ({skills.filter((s) => s.status === 'active').length} aktiv)</p>
          <p>Agents: {agents.length} ({agents.filter((a) => a.status === 'active').length} aktiv)</p>
          <p>MCP: {connectedMcp.length}/{mcpServers.length} verbunden</p>
          <p>Tools gesamt: {totalTools}</p>
        </div>
      </div>

      {/* [1,2] SKILLS — CORE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SKILLS — CORE ({coreSkills.length})</h3>
        <div className="space-y-1">
          {coreSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-medium">{s.name}</span>
              <p className="text-xs text-gray-400">{s.purpose.slice(0, 60)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* [1,3] SKILLS — PROJECT TYPES */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SKILLS — PROJECT TYPES ({projectTypeSkills.length})</h3>
        <div className="space-y-1">
          {projectTypeSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-medium">{s.name}</span>
              <p className="text-xs text-gray-400">{s.activateWhen || ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,1] SKILLS — DOMAINS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SKILLS — DOMAINS ({domainSkills.length})</h3>
        <div className="space-y-1">
          {domainSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-medium">{s.name}</span>
              <p className="text-xs text-gray-400">{s.activateWhen || ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,2] SKILLS — INTEGRATIONS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SKILLS — INTEGRATIONS ({integrationSkills.length})</h3>
        <div className="space-y-1">
          {integrationSkills.map((s) => (
            <div key={s.name} className="text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-medium">{s.name}</span>
              <p className="text-xs text-gray-400">{s.activateWhen || ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,3] AGENTS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">AGENTS ({agents.length})</h3>
        <div className="mb-3">
          <p className="text-xs font-bold text-black mb-1">Core ({coreAgents.length}):</p>
          <div className="space-y-1">
            {coreAgents.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-black">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-black mb-1">Specialists ({specialistAgents.length}):</p>
          <div className="space-y-1">
            {specialistAgents.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${a.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-black">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* [3,1] MCP SERVER */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">MCP SERVER ({mcpServers.length})</h3>
        <div className="space-y-2">
          {mcpServers.map((server) => (
            <div key={server.name} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-black">{server.name}</span>
              </div>
              <span className="text-xs text-gray-500">{server.tools} Tools</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">{connectedMcp.length} verbunden · {totalTools} Tools</p>
      </div>

      {/* [3,2] COMMANDS & HOOKS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">COMMANDS ({commands.length}) & HOOKS ({hooks.length})</h3>
        <div className="space-y-1 mb-3">
          {commands.map((cmd) => (
            <div key={cmd.name} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-mono">{cmd.name}</span>
              <span className="text-xs text-gray-500 text-right max-w-[55%]">{cmd.description}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-2">
          {hooks.map((hook) => (
            <div key={hook.name} className="text-sm border-b border-gray-100 pb-1 mb-1">
              <span className="text-black font-medium">{hook.name}</span>
              <p className="text-xs text-gray-400">{hook.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [3,3] QUICK ACTIONS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">QUICK ACTIONS</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Skill recherchieren..."
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black flex-1"
            />
            <button
              onClick={() => showToast('Recherche gestartet')}
              className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
            >
              Go
            </button>
          </div>
          <button
            onClick={() => showToast('Terminal wird geoeffnet')}
            className={btnClass + ' w-full text-left'}
          >
            System-Terminal oeffnen
          </button>
          <button
            onClick={() => showToast('Health-Check gestartet')}
            className={btnClass + ' w-full text-left'}
          >
            Health-Check ausfuehren
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          <p>Letzte Aenderung: heute, 14:32</p>
          <p>Keine Konflikte erkannt</p>
        </div>
      </div>
    </div>
  );
}
