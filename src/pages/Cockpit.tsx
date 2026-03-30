import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { useClock } from '../hooks/useClock';
import {
  projects,
  skills,
  agents,
  mcpServers,
  initialTodos,
  pipelineIdeasV2,
  priorities,
  commands,
  hooks,
} from '../data/dummy';
import type { PipelineIdeaV2 } from '../data/types';

type Phase = 'boot' | 'login' | 'launch' | 'dashboard';
type View = 'dashboard' | 'briefing' | 'thinktank';
type DetailView = 'none' | 'system' | 'finanzen' | 'agents' | 'projekte' | 'todos';
type EntryCategory = 'alle' | 'Ideen' | 'Research' | 'Strategie' | 'Projekte' | 'Privat';

const btnClass =
  'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black';
const btnSmClass =
  'bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black';

function classifyType(type: string): EntryCategory {
  const lower = type.toLowerCase();
  if (lower.includes('research')) return 'Research';
  if (lower.includes('strateg')) return 'Strategie';
  if (lower.includes('projekt') || lower.includes('project')) return 'Projekte';
  if (lower.includes('privat') || lower.includes('personal')) return 'Privat';
  return 'Ideen';
}

// --- BOOT PHASE ---
function BootPhase({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid-cockpit bg-white">
      {/* 4 empty cells before center */}
      <div /><div /><div /><div />
      <div className="grid-cell flex items-center justify-center">
        <button onClick={onStart} className={btnClass + ' text-lg px-8 py-4'}>
          START
        </button>
      </div>
      <div /><div /><div /><div />
    </div>
  );
}

// --- LOGIN PHASE ---
function LoginPhase({ onVerify }: { onVerify: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className="grid-cockpit bg-white">
      <div /><div /><div /><div />
      <div className="grid-cell flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-black">MCKAY MISSION CONTROL</h1>
        <button onClick={onVerify} className={btnClass + ' text-base px-6 py-3'}>
          Touch ID
        </button>
        <div className="text-sm text-gray-400">oder</div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Benutzername"
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passwort"
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
          />
          <button onClick={onVerify} className={btnClass}>
            Anmelden
          </button>
        </div>
      </div>
      <div /><div /><div /><div />
    </div>
  );
}

// --- LAUNCH PHASE ---
function LaunchPhase({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="grid-cockpit bg-white">
      <div /><div /><div /><div />
      <div className="grid-cell flex flex-col items-center justify-center gap-6">
        <p className="text-lg text-black font-bold">Verifiziert</p>
        <button onClick={onLaunch} className={btnClass + ' text-base px-6 py-3'}>
          System starten
        </button>
      </div>
      <div /><div /><div /><div />
    </div>
  );
}

// --- DETAIL: SYSTEM STATUS ---
function SystemDetailView({
  onBack,
}: {
  onBack: () => void;
}) {
  const connectedMcp = mcpServers.filter((s) => s.status === 'connected');
  const disconnectedMcp = mcpServers.filter((s) => s.status !== 'connected');
  const totalTools = mcpServers.reduce((sum, s) => sum + s.tools, 0);
  const uptime = '99.7%';

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] SYSTEM UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SYSTEM UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Status: <span className="text-green-600 font-bold">Online</span></p>
          <p>Uptime: {uptime}</p>
          <p>MCKAY OS v1.0</p>
          <p>Build: Phase 0 (Mockup)</p>
        </div>
      </div>

      {/* [1,2] MCP SERVER */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">MCP SERVER ({mcpServers.length})</h3>
        <div className="space-y-2">
          {mcpServers.map((server) => (
            <div key={server.name} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-black font-medium">{server.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <span className="text-xs">{server.tools} Tools</span>
                <span className="text-xs">{server.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {connectedMcp.length} verbunden · {disconnectedMcp.length} getrennt · {totalTools} Tools gesamt
        </div>
      </div>

      {/* [2,1] HOOKS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">HOOKS ({hooks.length})</h3>
        <div className="space-y-2">
          {hooks.map((hook) => (
            <div key={hook.name} className="text-sm border-b border-gray-100 pb-2">
              <p className="text-black font-medium">{hook.name}</p>
              <p className="text-xs text-gray-500">Event: {hook.event}</p>
              <p className="text-xs text-gray-400">{hook.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,2] COMMANDS */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">COMMANDS ({commands.length})</h3>
        <div className="space-y-1">
          {commands.map((cmd) => (
            <div key={cmd.name} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-mono font-medium">{cmd.name}</span>
              <span className="text-xs text-gray-500 text-right max-w-[60%]">{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,1] UMGEBUNGEN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">UMGEBUNGEN</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><span>Local</span><span className="text-green-600">aktiv</span></div>
          <div className="flex justify-between"><span>Staging (dev)</span><span className="text-yellow-600">bereit</span></div>
          <div className="flex justify-between"><span>Production (main)</span><span className="text-green-600">live</span></div>
        </div>
      </div>

      {/* [3,2] TECH STACK */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TECH STACK</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>React + Vite + TailwindCSS</p>
          <p>Supabase (Auth + DB)</p>
          <p>Vercel (Hosting)</p>
          <p>n8n / Make (Automation)</p>
          <p>Claude API (AI)</p>
        </div>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="grid-cell flex flex-col justify-end">
        <button onClick={onBack} className={btnClass}>
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}

// --- DETAIL: FINANZEN ---
function FinanzenDetailView({
  onBack,
}: {
  onBack: () => void;
}) {
  const totalTokens = projects.reduce((sum, p) => sum + p.tokenUsage, 0);
  const totalCost = projects.reduce((sum, p) => sum + p.monthlyCost, 0);
  const totalPrompts = projects.reduce((sum, p) => sum + p.promptCount, 0);
  const limit = 500000;
  const usagePercent = Math.round((totalTokens / limit) * 100);

  const sortedByCost = [...projects].sort((a, b) => b.monthlyCost - a.monthlyCost);
  const sortedByTokens = [...projects].sort((a, b) => b.tokenUsage - a.tokenUsage);

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] TOKEN UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TOKEN UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Verbraucht: <span className="font-bold text-black">{Math.round(totalTokens / 1000)}K</span> / {limit / 1000}K</p>
          <p>Auslastung: <span className={`font-bold ${usagePercent > 80 ? 'text-red-600' : usagePercent > 50 ? 'text-yellow-600' : 'text-green-600'}`}>{usagePercent}%</span></p>
          <div className="w-full h-3 bg-gray-200 rounded-full mt-2">
            <div className={`h-full rounded-full ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(usagePercent, 100)}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Prompts gesamt: {totalPrompts}</p>
        </div>
      </div>

      {/* [1,2] KOSTEN UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">KOSTEN UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Monatskosten: <span className="font-bold text-black">EUR {totalCost.toFixed(2)}</span></p>
          <p>Durchschnitt/Projekt: EUR {(totalCost / projects.length).toFixed(2)}</p>
          <p>Hochrechnung/Jahr: EUR {(totalCost * 12).toFixed(2)}</p>
        </div>
      </div>

      {/* [1,3] BUDGET STATUS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">BUDGET STATUS</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Budget: EUR 200/Monat</p>
          <p>Verbraucht: EUR {totalCost.toFixed(2)}</p>
          <p>Uebrig: <span className="font-bold text-green-600">EUR {(200 - totalCost).toFixed(2)}</span></p>
          <div className="w-full h-3 bg-gray-200 rounded-full mt-2">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((totalCost / 200) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* [2,1]+[2,2] KOSTEN PRO PROJEKT */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">KOSTEN PRO PROJEKT</h3>
        <div className="space-y-2">
          {sortedByCost.map((p) => {
            const costPercent = totalCost > 0 ? Math.round((p.monthlyCost / totalCost) * 100) : 0;
            return (
              <div key={p.id} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-black font-medium">{p.name}</span>
                  <span className="text-gray-600">EUR {p.monthlyCost.toFixed(2)} ({costPercent}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${costPercent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,3] TOKENS PRO PROJEKT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TOKENS PRO PROJEKT</h3>
        <div className="space-y-2">
          {sortedByTokens.map((p) => (
            <div key={p.id} className="flex justify-between text-sm border-b border-gray-100 pb-1">
              <span className="text-black">{p.name}</span>
              <span className="text-gray-500 font-mono">{p.tokenUsage >= 1000 ? `${Math.round(p.tokenUsage / 1000)}K` : p.tokenUsage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,1] PROMPTS PRO PROJEKT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">PROMPTS PRO PROJEKT</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex justify-between text-sm border-b border-gray-100 pb-1">
              <span className="text-black">{p.name}</span>
              <span className="text-gray-500 font-mono">{p.promptCount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,2] EFFIZIENZ */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">EFFIZIENZ</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {projects.filter((p) => p.promptCount > 0).map((p) => {
            const tokensPerPrompt = Math.round(p.tokenUsage / p.promptCount);
            const costPerPrompt = (p.monthlyCost / p.promptCount).toFixed(3);
            return (
              <div key={p.id} className="border-b border-gray-100 pb-1">
                <p className="text-black font-medium">{p.name}</p>
                <p className="text-xs">{tokensPerPrompt} Tokens/Prompt · EUR {costPerPrompt}/Prompt</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="grid-cell flex flex-col justify-end">
        <button onClick={onBack} className={btnClass}>
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}

// --- DETAIL: AGENTS & SKILLS ---
function AgentsDetailView({
  onBack,
  navigate,
}: {
  onBack: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const coreAgents = agents.filter((a) => a.type === 'core');
  const specialistAgents = agents.filter((a) => a.type === 'specialist');
  const coreSkills = skills.filter((s) => s.category === 'core');
  const projectTypeSkills = skills.filter((s) => s.category === 'project-types');
  const domainSkills = skills.filter((s) => s.category === 'domains');
  const integrationSkills = skills.filter((s) => s.category === 'integrations');
  const activeSkills = skills.filter((s) => s.status === 'active');

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] AGENTS — CORE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">AGENTS — CORE ({coreAgents.length})</h3>
        <div className="space-y-2">
          {coreAgents.map((a) => (
            <div key={a.name} className="text-sm border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-black font-medium">{a.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{a.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [1,2] AGENTS — SPECIALISTS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">AGENTS — SPECIALISTS ({specialistAgents.length})</h3>
        <div className="space-y-2">
          {specialistAgents.map((a) => (
            <div key={a.name} className="text-sm border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${a.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-black font-medium">{a.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{a.triggers}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [1,3] ZUSAMMENFASSUNG */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">ZUSAMMENFASSUNG</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>{agents.length} Agents ({coreAgents.length} Core + {specialistAgents.length} Specialists)</p>
          <p>{activeSkills.length} Skills aktiv</p>
          <p>{coreSkills.length} Core · {projectTypeSkills.length} Project Types</p>
          <p>{domainSkills.length} Domains · {integrationSkills.length} Integrations</p>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/system')} className={btnSmClass}>
            System-Detail oeffnen
          </button>
        </div>
      </div>

      {/* [2,1] SKILLS — CORE */}
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

      {/* [2,2] SKILLS — PROJECT TYPES */}
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

      {/* [2,3] SKILLS — DOMAINS */}
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

      {/* [3,1] SKILLS — INTEGRATIONS */}
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

      {/* [3,2] MCP SERVER QUICK */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">MCP SERVER ({mcpServers.length})</h3>
        <div className="space-y-1">
          {mcpServers.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${s.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-black">{s.name}</span>
              </div>
              <span className="text-xs text-gray-500">{s.tools} Tools</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="grid-cell flex flex-col justify-end">
        <button onClick={onBack} className={btnClass}>
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}

// --- DETAIL: PROJEKTE ---
function ProjekteDetailView({
  onBack,
  showToast,
}: {
  onBack: () => void;
  showToast: (msg: string) => void;
}) {
  const activeProjects = projects.filter((p) => p.status === 'building');
  const liveProjects = projects.filter((p) => p.status === 'live');
  const totalRevenue = projects.reduce((sum, p) => {
    const estimate = p.market?.revenueEstimate || '';
    const match = estimate.match(/[\d.]+/);
    return sum + (match ? parseFloat(match[0].replace('.', '')) : 0);
  }, 0);

  const openProject = (id: string) => {
    window.open(`/project/${id}`, '_blank', 'width=1200,height=800');
  };

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] PORTFOLIO UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">PORTFOLIO UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Projekte gesamt: <span className="font-bold text-black">{projects.length}</span></p>
          <p>In Entwicklung: {activeProjects.length}</p>
          <p>Live: {liveProjects.length}</p>
          <p>Pipeline Ideen: {pipelineIdeasV2.length}</p>
          <p className="text-xs text-gray-400 mt-2">Umsatzpotenzial: EUR {totalRevenue.toLocaleString('de-DE')}/Jahr</p>
        </div>
      </div>

      {/* [1,2]+[1,3] PROJECT CARDS */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">PROJEKTE</h3>
        <div className="space-y-3">
          {projects.map((p) => {
            const laufzeit = Math.floor(
              (new Date().getTime() - new Date(p.startDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            return (
              <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.health === 'healthy' ? 'bg-green-500' : p.health === 'attention' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className="text-black font-bold">{p.name}</span>
                    <span className="text-xs text-gray-400">{p.phase}</span>
                  </div>
                  <button
                    onClick={() => p.status === 'live' ? showToast('Live: ' + p.name) : openProject(p.id)}
                    className={btnSmClass}
                  >
                    {p.status === 'live' ? 'Ansehen' : 'Oeffnen'}
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mb-2">
                  <span>{laufzeit} Tage</span>
                  <span>{p.progressPercent}%</span>
                  <span>{p.promptCount} Prompts</span>
                  <span>EUR {p.monthlyCost.toFixed(2)}/mo</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className={`h-full rounded-full ${p.health === 'healthy' ? 'bg-green-500' : p.health === 'attention' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${p.progressPercent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,1] MILESTONES */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">MILESTONES</h3>
        <div className="space-y-3">
          {projects.filter((p) => p.status === 'building').map((p) => {
            const activeMilestone = p.milestones.find((m) => m.active)?.label || 'n/a';
            const completedCount = p.milestones.filter((m) => m.completed).length;
            return (
              <div key={p.id} className="text-sm">
                <p className="text-black font-medium mb-1">{p.name}</p>
                <p className="text-xs text-gray-500 mb-1">Aktuell: {activeMilestone} ({completedCount}/{p.milestones.length})</p>
                <div className="flex gap-1">
                  {p.milestones.map((m) => (
                    <span
                      key={m.label}
                      title={m.label}
                      className={`h-3 flex-1 rounded-sm ${
                        m.completed ? 'bg-green-400' : m.active ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,3] BUSINESS MODELS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">BUSINESS MODELS</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="text-sm border-b border-gray-100 pb-1">
              <span className="text-black font-medium">{p.name}</span>
              <p className="text-xs text-gray-500">{p.businessModel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [3,1] PIPELINE */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">IDEEN PIPELINE ({pipelineIdeasV2.length})</h3>
        <div className="space-y-2">
          {pipelineIdeasV2.map((idea) => (
            <div key={idea.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
              <div>
                <span className="text-black font-medium">{idea.name}</span>
                <span className="text-xs text-gray-400 ml-2">{idea.type}</span>
              </div>
              <span className="text-xs text-gray-400">{idea.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="grid-cell flex flex-col justify-end">
        <button onClick={onBack} className={btnClass}>
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}

// --- DETAIL: TODOS ---
function TodosDetailView({
  onBack,
  setView,
  showToast,
}: {
  onBack: () => void;
  setView: (v: View) => void;
  showToast: (msg: string) => void;
}) {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodoText, setNewTodoText] = useState('');

  const openTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);
  const highPriority = openTodos.filter((t) => t.priority === 'high');
  const medPriority = openTodos.filter((t) => t.priority === 'medium');
  const lowPriority = openTodos.filter((t) => t.priority === 'low' || !t.priority);

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo = { id: `t-${Date.now()}`, text: newTodoText, done: false };
    setTodos((prev) => [newTodo, ...prev]);
    setNewTodoText('');
    showToast('Todo hinzugefuegt');
  };

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] TODO UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TODO UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Offen: <span className="font-bold text-black">{openTodos.length}</span></p>
          <p>Erledigt: <span className="text-green-600">{doneTodos.length}</span></p>
          <p className="text-red-600 font-medium">Hoch: {highPriority.length}</p>
          <p className="text-yellow-600">Mittel: {medPriority.length}</p>
          <p className="text-gray-400">Niedrig: {lowPriority.length}</p>
        </div>
      </div>

      {/* [1,2] NEUES TODO */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">NEUES TODO</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Todo eingeben..."
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
            onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
          />
          <button onClick={addTodo} className={btnClass}>
            + Hinzufuegen
          </button>
        </div>
      </div>

      {/* [1,3] PRIORITAETEN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">PRIORITAETEN</h3>
        <div className="space-y-2">
          {priorities.map((p) => (
            <div key={p.id} className="text-sm border-b border-gray-100 pb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${p.impact === 'high' ? 'bg-red-500' : p.impact === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                <span className="text-black">{p.text}</span>
              </div>
              {p.project && <p className="text-xs text-gray-400 ml-4">{p.project}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* [2,1]+[2,2] OFFENE TODOS */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">OFFENE TODOS ({openTodos.length})</h3>
        <div className="space-y-1">
          {openTodos.map((t) => {
            const proj = projects.find((p) => p.id === t.projectId);
            return (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={false} onChange={() => toggleTodo(t.id)} className="cursor-pointer" />
                  <span className={`w-1.5 h-1.5 rounded-full ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                  <span className="text-black">{t.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  {proj && <span className="text-xs text-gray-400">{proj.name}</span>}
                  {t.deadline && <span className="text-xs text-gray-400">{t.deadline}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,3] ERLEDIGTE TODOS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">ERLEDIGT ({doneTodos.length})</h3>
        <div className="space-y-1">
          {doneTodos.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm text-gray-400 border-b border-gray-100 pb-1">
              <input type="checkbox" checked onChange={() => toggleTodo(t.id)} className="cursor-pointer" />
              <span className="line-through">{t.text}</span>
            </div>
          ))}
          {doneTodos.length === 0 && <p className="text-sm text-gray-400 italic">Keine erledigten Todos</p>}
        </div>
      </div>

      {/* [3,1] TODOS PRO PROJEKT */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">TODOS PRO PROJEKT</h3>
        <div className="grid grid-cols-2 gap-3">
          {projects.map((p) => {
            const projectTodos = openTodos.filter((t) => t.projectId === p.id);
            return (
              <div key={p.id} className="text-sm">
                <p className="text-black font-medium">{p.name} ({projectTodos.length})</p>
                {projectTodos.slice(0, 2).map((t) => (
                  <p key={t.id} className="text-xs text-gray-500">- {t.text}</p>
                ))}
                {projectTodos.length === 0 && <p className="text-xs text-gray-400 italic">Keine offenen Todos</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="grid-cell flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-black mb-3">AKTIONEN</h3>
          <div className="space-y-2">
            <button onClick={() => setView('briefing')} className={btnClass + ' w-full text-left'}>
              Briefing
            </button>
            <button onClick={() => setView('thinktank')} className={btnClass + ' w-full text-left'}>
              Thinktank
            </button>
          </div>
        </div>
        <button onClick={onBack} className={btnClass + ' mt-4'}>
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}

// --- DASHBOARD VIEW ---
function DashboardView({
  setView,
  navigate,
  showToast,
}: {
  setView: (v: View) => void;
  navigate: ReturnType<typeof useNavigate>;
  showToast: (msg: string) => void;
}) {
  const [detail, setDetail] = useState<DetailView>('none');
  const activeSkills = skills.filter((s) => s.status === 'active');
  const activeAgents = agents.filter((a) => a.status === 'active');
  const connectedMcp = mcpServers.filter((s) => s.status === 'connected');
  const totalTokens = projects.reduce((sum, p) => sum + p.tokenUsage, 0);
  const totalCost = projects.reduce((sum, p) => sum + p.monthlyCost, 0);
  const topTodos = initialTodos.filter((t) => !t.done).slice(0, 5);

  const openProject = (id: string) => {
    window.open(`/project/${id}`, '_blank', 'width=1200,height=800');
  };

  const goBack = () => setDetail('none');

  // Render detail views
  if (detail === 'system') return <SystemDetailView onBack={goBack} />;
  if (detail === 'finanzen') return <FinanzenDetailView onBack={goBack} />;
  if (detail === 'agents') return <AgentsDetailView onBack={goBack} navigate={navigate} />;
  if (detail === 'projekte') return <ProjekteDetailView onBack={goBack} showToast={showToast} />;
  if (detail === 'todos') return <TodosDetailView onBack={goBack} setView={setView} showToast={showToast} />;

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] SYSTEM STATUS — clickable */}
      <div className="grid-cell cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail('system')}>
        <h3 className="text-sm font-bold text-black mb-3">SYSTEM STATUS</h3>
        <p className="text-sm text-gray-600">Status: <span className="text-green-600 font-bold">Online</span></p>
        <p className="text-sm text-gray-600">{connectedMcp.length} MCP verbunden</p>
        <p className="text-xs text-gray-400 mt-2">Klicken fuer Details</p>
      </div>

      {/* [1,2] TOKEN & KOSTEN — clickable */}
      <div className="grid-cell cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail('finanzen')}>
        <h3 className="text-sm font-bold text-black mb-3">FINANZEN</h3>
        <p className="text-sm text-gray-600">
          Tokens: {Math.round(totalTokens / 1000)}K / 500K ({Math.round((totalTokens / 500000) * 100)}%)
        </p>
        <p className="text-sm text-gray-600">Monatskosten: EUR {totalCost.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mt-2">Klicken fuer Details</p>
      </div>

      {/* [1,3] AGENTS & SKILLS — clickable */}
      <div className="grid-cell cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail('agents')}>
        <h3 className="text-sm font-bold text-black mb-3">AGENTS &amp; SKILLS</h3>
        <p className="text-sm text-gray-600">{activeAgents.length} Agents arbeiten</p>
        <p className="text-sm text-gray-600">{activeSkills.length} Skills aktiv</p>
        <p className="text-sm text-gray-600">{connectedMcp.length} MCP verbunden</p>
        <p className="text-xs text-gray-400 mt-2">Klicken fuer Details</p>
      </div>

      {/* [2,1] PROJEKTE — clickable */}
      <div className="grid-cell cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail('projekte')}>
        <h3 className="text-sm font-bold text-black mb-3">PROJEKTE</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-black">
                {p.name} &middot; {p.phase} &middot; {p.progressPercent}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (p.status === 'live') {
                    showToast('Live-Projekt: ' + p.name);
                  } else {
                    openProject(p.id);
                  }
                }}
                className={btnSmClass}
              >
                {p.status === 'live' ? 'Ansehen' : 'Oeffnen'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Klicken fuer Portfolio-Uebersicht</p>
      </div>

      {/* [2,2] PROJEKT-STATUS & TODOS — clickable */}
      <div className="grid-cell cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail('todos')}>
        <h3 className="text-sm font-bold text-black mb-3">PROJEKT-STATUS &amp; TODOS</h3>
        <div className="space-y-2 mb-3">
          {topTodos.map((t) => {
            const proj = projects.find((p) => p.id === t.projectId);
            return (
              <div key={t.id} className="text-sm text-gray-600">
                [{proj?.name || 'Allgemein'}] {t.text}
                {t.deadline && <span className="text-xs text-gray-400 ml-1">({t.deadline})</span>}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400">Klicken fuer Todo-Manager</p>
      </div>

      {/* [2,3] IDEEN PIPELINE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">IDEEN PIPELINE</h3>
        <div className="space-y-2 mb-3">
          {pipelineIdeasV2.map((idea) => (
            <div key={idea.id} className="text-sm text-gray-600">
              {idea.name} &middot; {idea.type}
            </div>
          ))}
        </div>
        <button onClick={() => setView('thinktank')} className={btnSmClass}>
          + Neue Idee
        </button>
      </div>

      {/* [3,1] ACTION: BRIEFING */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">ACTION: BRIEFING</h3>
        <p className="text-sm text-gray-600 mb-3">Was war gestern, was kommt heute</p>
        <button onClick={() => setView('briefing')} className={btnClass}>
          Briefing oeffnen
        </button>
      </div>

      {/* [3,2] ACTION: THINKTANK */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">ACTION: THINKTANK</h3>
        <p className="text-sm text-gray-600 mb-3">Gedanken teilen und strukturieren</p>
        <button onClick={() => setView('thinktank')} className={btnClass}>
          Thinktank oeffnen
        </button>
      </div>

      {/* [3,3] ACTIONS: SYSTEM & OFFICE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">ACTIONS: SYSTEM &amp; OFFICE</h3>
        <div className="space-y-2">
          <button onClick={() => navigate('/system')} className={btnClass + ' w-full text-left'}>
            System
          </button>
          <button onClick={() => navigate('/office')} className={btnClass + ' w-full text-left'}>
            Office
          </button>
        </div>
      </div>
    </div>
  );
}

// --- BRIEFING VIEW ---
function BriefingView({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] GESTERN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">GESTERN</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>12 Todos erledigt</p>
          <p>3 Projekte bearbeitet: Hebammenbuero, TennisCoach, Mission Control</p>
          <p>Fortschritt: +8% gesamt</p>
          <p>2 neue Ideen erstellt</p>
        </div>
      </div>

      {/* [1,2] + [2,2] EMPFEHLUNG — spans 2 rows */}
      <div className="grid-cell span-2-rows">
        <h3 className="text-sm font-bold text-black mb-3">EMPFEHLUNG</h3>
        <p className="text-sm text-gray-600 mb-3">Empfohlene Reihenfolge:</p>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mb-6">
          <li>
            <span className="font-bold">Hebammenbuero</span> — Mockup Review
          </li>
          <li>
            <span className="font-bold">Stillprobleme</span> — Mockup bauen
          </li>
          <li>
            <span className="font-bold">TennisCoach</span> — Phase 4 planen
          </li>
        </ol>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setView('dashboard')} className={btnClass}>
            Cockpit
          </button>
          <button onClick={() => setView('thinktank')} className={btnClass}>
            Thinktank
          </button>
        </div>
      </div>

      {/* [1,3] HEUTE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">HEUTE</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>6 Todos geplant</p>
          <p>Projekte: Hebammenbuero, Stillprobleme</p>
          <p>Termine: 14:00 Designer, 16:00 Testing</p>
          <p>Ziel: +15% Fortschritt</p>
        </div>
      </div>

      {/* [2,1] PROJEKTE GESTERN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">PROJEKTE GESTERN</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Hebammenbuero: Mockup erweitert (+8%)</p>
          <p>TennisCoach: Auth fertig gebaut (+5%)</p>
        </div>
      </div>

      {/* [2,2] is covered by EMPFEHLUNG span */}

      {/* [2,3] TERMINE HEUTE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TERMINE HEUTE</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>09:00 Standup mit KANI</p>
          <p>11:00 Hebammenbuero Review</p>
          <p>14:00 Call mit Designer</p>
          <p>16:00 TennisCoach Testing</p>
        </div>
      </div>

      {/* [3,1] KANI INSIGHT 1 */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">KANI INSIGHT</h3>
        <p className="text-sm text-gray-600 italic">
          &quot;Hebammenbuero + Stillprobleme teilen 80% der Skills&quot;
        </p>
      </div>

      {/* [3,2] KANI INSIGHT 2 */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">KANI INSIGHT</h3>
        <p className="text-sm text-gray-600 italic">
          &quot;TennisCoach: Stripe dauert ~2 Tage&quot;
        </p>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="grid-cell flex flex-col justify-end">
        <button onClick={() => setView('dashboard')} className={btnClass}>
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}

// --- THINKTANK VIEW ---

const categoryActiveStyles: Record<EntryCategory, string> = {
  alle: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10 shadow-[0_0_12px_rgba(0,240,255,0.1)]',
  Ideen: 'border-neon-green/50 text-neon-green bg-neon-green/10 shadow-[0_0_12px_rgba(0,255,136,0.1)]',
  Research: 'border-neon-purple/50 text-neon-purple bg-neon-purple/10 shadow-[0_0_12px_rgba(139,92,246,0.1)]',
  Strategie: 'border-neon-orange/50 text-neon-orange bg-neon-orange/10 shadow-[0_0_12px_rgba(255,107,44,0.1)]',
  Projekte: 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10 shadow-[0_0_12px_rgba(0,240,255,0.1)]',
  Privat: 'border-neon-pink/50 text-neon-pink bg-neon-pink/10 shadow-[0_0_12px_rgba(255,45,170,0.1)]',
};

const categoryBorderColors: Record<EntryCategory, string> = {
  alle: 'border-neon-cyan/30',
  Ideen: 'border-neon-green/30',
  Research: 'border-neon-purple/30',
  Strategie: 'border-neon-orange/30',
  Projekte: 'border-neon-cyan/30',
  Privat: 'border-neon-pink/30',
};

const categoryTextColors: Record<EntryCategory, string> = {
  alle: 'text-neon-cyan',
  Ideen: 'text-neon-green',
  Research: 'text-neon-purple',
  Strategie: 'text-neon-orange',
  Projekte: 'text-neon-cyan',
  Privat: 'text-neon-pink',
};

function ThinktankView({ setView }: { setView: (v: View) => void }) {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<PipelineIdeaV2[]>([
    ...pipelineIdeasV2,
    {
      id: 'healthcare-eco',
      name: 'Healthcare Ecosystem',
      rawTranscript: 'Alle Healthcare-Projekte zu einem Oekosystem verbinden...',
      structuredVersion:
        'Alle Healthcare-Projekte zu einem Oekosystem verbinden — Hebammenbuero, Stillprobleme, findemeinehebamme als zusammenhaengendes System.',
      type: 'Strategie',
      createdAt: '2026-03-20',
    },
    {
      id: 'zahnarzt',
      name: 'Zahnarzt',
      rawTranscript: 'Termin machen, naechste Woche',
      structuredVersion: 'Termin machen, naechste Woche',
      type: 'Privat',
      createdAt: '2026-03-27',
    },
  ]);
  const [activeCategory, setActiveCategory] = useState<EntryCategory>('alle');
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const [kaniResponse, setKaniResponse] = useState<string | null>(null);
  const [kaniProcessing, setKaniProcessing] = useState(false);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setKaniProcessing(true);

    const category = trimmed.toLowerCase().includes('strateg')
      ? 'Strategie'
      : trimmed.toLowerCase().includes('research')
        ? 'Research'
        : 'Ideen';

    const newEntry: PipelineIdeaV2 = {
      id: `entry-${Date.now()}`,
      name: trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : ''),
      rawTranscript: trimmed,
      structuredVersion: `Eingabe wird von KANI analysiert...\n\nOriginal: "${trimmed.slice(0, 100)}"`,
      type:
        category === 'Strategie'
          ? 'Strategie'
          : category === 'Research'
            ? 'Research'
            : 'Industry SaaS',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setEntries((prev) => [newEntry, ...prev]);
      setInput('');
      setKaniProcessing(false);
      setKaniResponse(`Eingeordnet als: ${category}\nEintrag wurde zur Sammlung hinzugefuegt.`);
      setTimeout(() => setKaniResponse(null), 6000);
    }, 600);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('Eintrag geloescht');
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<EntryCategory, number> = {
      alle: entries.length,
      Ideen: 0,
      Research: 0,
      Strategie: 0,
      Projekte: 0,
      Privat: 0,
    };
    for (const e of entries) {
      const cat = classifyType(e.type);
      counts[cat]++;
    }
    return counts;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (activeCategory === 'alle') return entries;
    return entries.filter((e) => classifyType(e.type) === activeCategory);
  }, [entries, activeCategory]);

  const categories: EntryCategory[] = ['alle', 'Ideen', 'Research', 'Strategie', 'Projekte', 'Privat'];

  const visibleEntries = filteredEntries.slice(0, 4);

  const renderEntry = (entry: PipelineIdeaV2, index: number) => {
    const cat = classifyType(entry.type);
    const isOrig = showOriginal[entry.id];
    const colorClass = categoryTextColors[cat];
    const borderColor = categoryBorderColors[cat];
    const content = isOrig ? entry.rawTranscript : entry.structuredVersion;

    return (
      <div key={entry.id} className={`animate-fade-in stagger-${Math.min(index + 2, 7)}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-text-primary leading-tight">{entry.name}</h4>
          <span className={`text-[10px] font-mono uppercase tracking-wider ${colorClass} shrink-0`}>
            {cat}
          </span>
        </div>
        <p className="text-[11px] font-mono text-text-muted mb-2">
          {entry.createdAt}
        </p>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">
          {content.slice(0, 120)}
          {content.length > 120 ? '...' : ''}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() =>
              setShowOriginal((prev) => ({ ...prev, [entry.id]: !prev[entry.id] }))
            }
            className={`px-2 py-1 rounded-md border ${borderColor} text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-white/[0.02]`}
          >
            {isOrig ? 'Strukturiert' : 'Original'}
          </button>
          <button
            onClick={() => showToast('Projekt starten: ' + entry.name)}
            className="px-2 py-1 rounded-md border border-neon-cyan/20 text-[11px] text-neon-cyan/80 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors cursor-pointer bg-white/[0.02]"
          >
            Projekt
          </button>
          <button
            onClick={() => showToast('Research: ' + entry.name)}
            className="px-2 py-1 rounded-md border border-neon-purple/20 text-[11px] text-neon-purple/80 hover:text-neon-purple hover:border-neon-purple/40 transition-colors cursor-pointer bg-white/[0.02]"
          >
            Research
          </button>
          <button
            onClick={() => handleDelete(entry.id)}
            className="px-2 py-1 rounded-md border border-status-critical/20 text-[11px] text-status-critical/60 hover:text-status-critical hover:border-status-critical/40 transition-colors cursor-pointer bg-white/[0.02]"
          >
            Loeschen
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid-cockpit bg-bg-primary">
      {/* [1,1]+[1,2] GEDANKEN TEILEN — span 2 cols */}
      <div className="monitor-tile monitor-cyan p-5 span-2-cols">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="hud-label"><span>01</span> / GEDANKEN TEILEN</span>
            <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/20 to-transparent" />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Schreib was du denkst — KANI strukturiert es automatisch..."
            rows={4}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/40 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all resize-none mb-4"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || kaniProcessing}
              className="physical-btn px-5 py-2.5 text-sm font-medium text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {kaniProcessing ? 'Analysiere...' : 'Absenden'}
            </button>
            <span className="text-[10px] font-mono text-text-muted">
              Enter zum Senden · Shift+Enter fuer neue Zeile
            </span>
          </div>
        </div>
      </div>

      {/* [1,3] KANI ANTWORT */}
      <div className="monitor-tile monitor-purple p-5">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="hud-label"><span>02</span> / KANI ANTWORT</span>
            <div className="flex-1 h-px bg-gradient-to-r from-neon-purple/20 to-transparent" />
          </div>
          {kaniProcessing ? (
            <div className="flex items-center gap-3 py-6 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse-glow" />
              <span className="text-sm text-text-secondary">Analysiere Eingabe...</span>
            </div>
          ) : kaniResponse ? (
            <div className="animate-fade-in">
              <div className="inset-display">
                {kaniResponse.split('\n').map((line, i) => (
                  <p key={i} className="text-sm text-neon-purple leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
                <span className="text-[10px] font-mono text-text-muted">Verarbeitet</span>
              </div>
            </div>
          ) : (
            <div className="py-6">
              <p className="text-sm text-text-muted italic">Warte auf Eingabe...</p>
              <div className="mt-4 space-y-2">
                <p className="text-[11px] text-text-muted">Tipps:</p>
                <p className="text-[11px] text-text-muted">&bull; Ideen werden automatisch kategorisiert</p>
                <p className="text-[11px] text-text-muted">&bull; &quot;strateg&quot; im Text = Strategie</p>
                <p className="text-[11px] text-text-muted">&bull; &quot;research&quot; im Text = Research</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* [2,1] FILTER TABS */}
      <div className="monitor-tile monitor-green p-5">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="hud-label"><span>03</span> / FILTER</span>
            <div className="flex-1 h-px bg-gradient-to-r from-neon-green/20 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all duration-200 ${
                    isActive
                      ? categoryActiveStyles[cat]
                      : 'border-glass-border text-text-muted hover:text-text-secondary hover:border-glass-highlight bg-white/[0.02]'
                  }`}
                >
                  {cat === 'alle' ? 'Alle' : cat}
                  <span className="ml-1.5 text-[10px] opacity-70">{categoryCounts[cat]}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-glass-border">
            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
              <span>Gesamt: {entries.length} Eintraege</span>
              <span>Anzeige: {filteredEntries.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* [2,2] ENTRY 1 */}
      <div className="monitor-tile monitor-cyan p-5">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          {visibleEntries[0] ? (
            renderEntry(visibleEntries[0], 0)
          ) : (
            <p className="text-sm text-text-muted italic py-4">Kein Eintrag</p>
          )}
        </div>
      </div>

      {/* [2,3] ENTRY 2 */}
      <div className="monitor-tile monitor-cyan p-5">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          {visibleEntries[1] ? (
            renderEntry(visibleEntries[1], 1)
          ) : (
            <p className="text-sm text-text-muted italic py-4">Kein Eintrag</p>
          )}
        </div>
      </div>

      {/* [3,1] ENTRY 3 */}
      <div className="monitor-tile monitor-cyan p-5">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          {visibleEntries[2] ? (
            renderEntry(visibleEntries[2], 2)
          ) : (
            <p className="text-sm text-text-muted italic py-4">Kein Eintrag</p>
          )}
        </div>
      </div>

      {/* [3,2] ENTRY 4 */}
      <div className="monitor-tile monitor-cyan p-5">
        <div className="monitor-glow-inner" />
        <div className="relative z-10">
          {visibleEntries[3] ? (
            renderEntry(visibleEntries[3], 3)
          ) : (
            <p className="text-sm text-text-muted italic py-4">Kein Eintrag</p>
          )}
        </div>
      </div>

      {/* [3,3] NAVIGATION */}
      <div className="monitor-tile monitor-orange p-5 flex flex-col justify-between">
        <div className="monitor-glow-inner" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="hud-label"><span>04</span> / NAVIGATION</span>
              <div className="flex-1 h-px bg-gradient-to-r from-neon-orange/20 to-transparent" />
            </div>
            <div className="space-y-2 text-[11px] font-mono text-text-muted">
              <p>{filteredEntries.length} sichtbar von {entries.length}</p>
              <p>{categoryCounts['Ideen']} Ideen · {categoryCounts['Strategie']} Strategien</p>
              <p>{categoryCounts['Research']} Research · {categoryCounts['Privat']} Privat</p>
            </div>
          </div>
          <button
            onClick={() => setView('dashboard')}
            className="physical-btn w-full px-4 py-3 text-sm font-medium text-neon-orange border border-neon-orange/30 hover:border-neon-orange/60 transition-all cursor-pointer mt-4"
          >
            Zurueck zum Cockpit
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COCKPIT COMPONENT ---
export function Cockpit() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { time, date } = useClock();
  void time;
  void date;

  const [phase, setPhase] = useState<Phase>('boot');
  const [view, setView] = useState<View>('dashboard');

  // Boot sequence phases
  if (phase === 'boot') {
    return <BootPhase onStart={() => setPhase('login')} />;
  }
  if (phase === 'login') {
    return <LoginPhase onVerify={() => setPhase('launch')} />;
  }
  if (phase === 'launch') {
    return <LaunchPhase onLaunch={() => setPhase('dashboard')} />;
  }

  // Dashboard phase — switch between views
  if (view === 'briefing') {
    return <BriefingView setView={setView} />;
  }
  if (view === 'thinktank') {
    return <ThinktankView setView={setView} />;
  }

  return <DashboardView setView={setView} navigate={navigate} showToast={showToast} />;
}
