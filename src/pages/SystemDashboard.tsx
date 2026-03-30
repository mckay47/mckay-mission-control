import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { skills, agents, mcpServers } from '../data/dummy';

export function SystemDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const coreSkills = skills.filter((s) => s.category === 'core');
  const projectTypeSkills = skills.filter((s) => s.category === 'project-types');
  const domainSkills = skills.filter((s) => s.category === 'domains');
  const integrationSkills = skills.filter((s) => s.category === 'integrations');

  const coreAgents = agents.filter((a) => a.type === 'core');
  const specialistAgents = agents.filter((a) => a.type === 'specialist');

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">SYSTEM</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
          >
            &larr; Zurueck
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">QUICK ACTIONS</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-black">Neuen Skill recherchieren:</span>
            <input
              type="text"
              placeholder="________"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black w-48"
            />
            <button
              onClick={() => showToast('Recherche gestartet')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Recherchieren
            </button>
          </div>
          <div className="mt-3">
            <button
              onClick={() => showToast('Terminal wird geoeffnet')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              System-Terminal oeffnen
            </button>
          </div>
        </div>

        {/* Two-column: Skills + Agents/MCP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: SKILLS */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">
              SKILLS ({skills.length})
            </h2>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-black mb-2">Core ({coreSkills.length}):</h3>
              <div className="space-y-1">
                {coreSkills.map((s) => (
                  <p key={s.name} className="text-sm text-gray-700">
                    &bull; {s.name} ●
                  </p>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-black mb-2">Project Types ({projectTypeSkills.length}):</h3>
              <div className="space-y-1">
                {projectTypeSkills.map((s) => (
                  <p key={s.name} className="text-sm text-gray-700">
                    &bull; {s.name} ●
                  </p>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-black mb-2">Domains ({domainSkills.length}):</h3>
              <div className="space-y-1">
                {domainSkills.map((s) => (
                  <p key={s.name} className="text-sm text-gray-700">
                    &bull; {s.name} ●
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-2">Integrations ({integrationSkills.length}):</h3>
              <div className="space-y-1">
                {integrationSkills.map((s) => (
                  <p key={s.name} className="text-sm text-gray-700">
                    &bull; {s.name} ●
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Agents + MCP */}
          <div className="space-y-4">
            {/* AGENTS */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">
                AGENTS ({agents.length})
              </h2>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-black mb-2">Core:</h3>
                <div className="space-y-1">
                  {coreAgents.map((a) => (
                    <p key={a.name} className="text-sm text-gray-700">
                      &bull; {a.name} ●
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-black mb-2">Specialists:</h3>
                <div className="space-y-1">
                  {specialistAgents.map((a) => (
                    <p key={a.name} className="text-sm text-gray-700">
                      &bull; {a.name} ●
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* MCP SERVERS */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">
                MCP SERVER ({mcpServers.length})
              </h2>
              <div className="space-y-2">
                {mcpServers.map((server) => (
                  <div key={server.name} className="flex items-center justify-between border border-gray-200 rounded p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">&bull; {server.name}</span>
                      <span className="text-xs text-gray-500">● {server.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">({server.tools})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
