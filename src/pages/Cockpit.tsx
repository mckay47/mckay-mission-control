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
    <div className="grid-cockpit boot-bg">
      {/* 4 empty cells before center */}
      <div /><div /><div /><div />
      <div className="grid-cell flex items-center justify-center" style={{ background: 'rgba(10,17,32,0.5)' }}>
        <button onClick={onStart} className="vision-btn text-lg px-8 py-4 text-[#00F0FF] font-bold tracking-wider cursor-pointer">
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
    <div className="grid-cockpit boot-bg">
      <div /><div /><div /><div />
      <div className="grid-cell flex flex-col items-center justify-center gap-6" style={{ background: 'rgba(10,17,32,0.6)' }}>
        <h1 className="text-2xl font-bold text-[#00F0FF] text-glow-cyan tracking-wider">MCKAY MISSION CONTROL</h1>
        <button onClick={onVerify} className="vision-btn text-base px-6 py-3 text-[#E0E6F0] font-medium cursor-pointer">
          Touch ID
        </button>
        <div className="text-sm text-[#4A5A7A]">oder</div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Benutzername"
            className="glass-input"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passwort"
            className="glass-input"
          />
          <button onClick={onVerify} className="vision-btn px-4 py-2 text-[#E0E6F0] text-sm font-medium cursor-pointer">
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
    <div className="grid-cockpit boot-bg">
      <div /><div /><div /><div />
      <div className="grid-cell flex flex-col items-center justify-center gap-6" style={{ background: 'rgba(10,17,32,0.5)' }}>
        <p className="text-lg text-[#00FF88] font-bold" style={{ textShadow: '0 0 12px rgba(0,255,136,0.4)' }}>Verifiziert</p>
        <button onClick={onLaunch} className="vision-btn text-base px-6 py-3 text-[#00F0FF] font-medium cursor-pointer">
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
    <div className="grid-cockpit">
      {/* [1,1] SYSTEM UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">SYSTEM UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Status: <span className="text-[#00FF88] font-bold" style={{ textShadow: '0 0 8px rgba(0,255,136,0.4)' }}>Online</span></p>
          <p>Uptime: <span className="stat-number text-base">{uptime}</span></p>
          <p>MCKAY OS v1.0</p>
          <p>Build: Phase 0 (Mockup)</p>
        </div>
      </div>

      {/* [1,2] MCP SERVER */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">MCP SERVER ({mcpServers.length})</h3>
        <div className="space-y-2">
          {mcpServers.map((server) => (
            <div key={server.name} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
              <div className="flex items-center gap-2">
                <span className={server.status === 'connected' ? 'dot-green' : 'dot-red'} />
                <span className="text-[#E0E6F0] font-medium">{server.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[#4A5A7A]">
                <span className="text-xs font-mono">{server.tools} Tools</span>
                <span className="text-xs">{server.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-[#4A5A7A] font-mono">
          {connectedMcp.length} verbunden &middot; {disconnectedMcp.length} getrennt &middot; {totalTools} Tools gesamt
        </div>
      </div>

      {/* [2,1] HOOKS */}
      <div className="grid-cell">
        <h3 className="cell-title">HOOKS ({hooks.length})</h3>
        <div className="space-y-2">
          {hooks.map((hook) => (
            <div key={hook.name} className="text-sm border-b border-white/5 pb-2">
              <p className="text-[#E0E6F0] font-medium">{hook.name}</p>
              <p className="text-xs text-[#4A5A7A]">Event: {hook.event}</p>
              <p className="text-xs text-[#4A5A7A]">{hook.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [2,2] COMMANDS */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">COMMANDS ({commands.length})</h3>
        <div className="space-y-1">
          {commands.map((cmd) => (
            <div key={cmd.name} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
              <span className="text-[#00F0FF] font-mono font-medium">{cmd.name}</span>
              <span className="text-xs text-[#4A5A7A] text-right max-w-[60%]">{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,1] UMGEBUNGEN */}
      <div className="grid-cell">
        <h3 className="cell-title">UMGEBUNGEN</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <div className="flex justify-between"><span>Local</span><span className="text-[#00FF88]" style={{ textShadow: '0 0 6px rgba(0,255,136,0.3)' }}>aktiv</span></div>
          <div className="flex justify-between"><span>Staging (dev)</span><span className="text-[#FFD600]" style={{ textShadow: '0 0 6px rgba(255,214,0,0.3)' }}>bereit</span></div>
          <div className="flex justify-between"><span>Production (main)</span><span className="text-[#00FF88]" style={{ textShadow: '0 0 6px rgba(0,255,136,0.3)' }}>live</span></div>
        </div>
      </div>

      {/* [3,2] TECH STACK */}
      <div className="grid-cell">
        <h3 className="cell-title">TECH STACK</h3>
        <div className="space-y-1 text-sm text-[#7B8DB5]">
          <p>React + Vite + TailwindCSS</p>
          <p>Supabase (Auth + DB)</p>
          <p>Vercel (Hosting)</p>
          <p>n8n / Make (Automation)</p>
          <p>Claude API (AI)</p>
        </div>
      </div>

      {/* [3,3] DEPLOYMENT STATUS */}
      <div className="grid-cell">
        <h3 className="cell-title">DEPLOYMENT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Branch: <span className="font-mono text-[#00F0FF]">dev → main</span></p>
          <p>Letzter Deploy: heute, 14:32</p>
          <p>Vercel Status: <span className="text-[#00FF88] font-bold" style={{ textShadow: '0 0 6px rgba(0,255,136,0.3)' }}>Ready</span></p>
          <p>Build Time: <span className="font-mono text-[#E0E6F0]">18s</span></p>
        </div>
        <button onClick={onBack} className="cell-btn mt-4">
          Zurueck
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

  const barColor = usagePercent > 80 ? '#FF2D55' : usagePercent > 50 ? '#FFD600' : '#00FF88';

  return (
    <div className="grid-cockpit">
      {/* [1,1] TOKEN UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">TOKEN UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Verbraucht: <span className="stat-number text-lg">{Math.round(totalTokens / 1000)}K</span> / {limit / 1000}K</p>
          <p>Auslastung: <span className="stat-number text-lg" style={{ color: barColor, textShadow: `0 0 12px ${barColor}60` }}>{usagePercent}%</span></p>
          <div className="cell-bar mt-2">
            <div className="cell-bar-fill" style={{ width: `${Math.min(usagePercent, 100)}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}80)` }} />
          </div>
          <p className="text-xs text-[#4A5A7A] mt-1 font-mono">Prompts gesamt: {totalPrompts}</p>
        </div>
      </div>

      {/* [1,2] KOSTEN UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">KOSTEN UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Monatskosten: <span className="stat-number text-lg">EUR {totalCost.toFixed(2)}</span></p>
          <p>Durchschnitt/Projekt: EUR {(totalCost / projects.length).toFixed(2)}</p>
          <p>Hochrechnung/Jahr: EUR {(totalCost * 12).toFixed(2)}</p>
        </div>
      </div>

      {/* [1,3] BUDGET STATUS */}
      <div className="grid-cell">
        <h3 className="cell-title">BUDGET STATUS</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Budget: EUR 200/Monat</p>
          <p>Verbraucht: EUR {totalCost.toFixed(2)}</p>
          <p>Uebrig: <span className="stat-number text-lg">EUR {(200 - totalCost).toFixed(2)}</span></p>
          <div className="cell-bar mt-2">
            <div className="cell-bar-fill" style={{ width: `${Math.min((totalCost / 200) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* [2,1]+[2,2] KOSTEN PRO PROJEKT */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">KOSTEN PRO PROJEKT</h3>
        <div className="space-y-2">
          {sortedByCost.map((p) => {
            const costPercent = totalCost > 0 ? Math.round((p.monthlyCost / totalCost) * 100) : 0;
            return (
              <div key={p.id} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-[#E0E6F0] font-medium">{p.name}</span>
                  <span className="text-[#7B8DB5] font-mono">EUR {p.monthlyCost.toFixed(2)} ({costPercent}%)</span>
                </div>
                <div className="cell-bar">
                  <div className="cell-bar-fill" style={{ width: `${costPercent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,3] TOKENS PRO PROJEKT */}
      <div className="grid-cell">
        <h3 className="cell-title">TOKENS PRO PROJEKT</h3>
        <div className="space-y-2">
          {sortedByTokens.map((p) => (
            <div key={p.id} className="flex justify-between text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0]">{p.name}</span>
              <span className="text-[#00F0FF] font-mono" style={{ textShadow: '0 0 8px rgba(0,240,255,0.3)' }}>{p.tokenUsage >= 1000 ? `${Math.round(p.tokenUsage / 1000)}K` : p.tokenUsage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,1] PROMPTS PRO PROJEKT */}
      <div className="grid-cell">
        <h3 className="cell-title">PROMPTS PRO PROJEKT</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex justify-between text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0]">{p.name}</span>
              <span className="text-[#00F0FF] font-mono" style={{ textShadow: '0 0 8px rgba(0,240,255,0.3)' }}>{p.promptCount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,2] EFFIZIENZ */}
      <div className="grid-cell">
        <h3 className="cell-title">EFFIZIENZ</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          {projects.filter((p) => p.promptCount > 0).map((p) => {
            const tokensPerPrompt = Math.round(p.tokenUsage / p.promptCount);
            const costPerPrompt = (p.monthlyCost / p.promptCount).toFixed(3);
            return (
              <div key={p.id} className="border-b border-white/5 pb-1">
                <p className="text-[#E0E6F0] font-medium">{p.name}</p>
                <p className="text-xs font-mono">{tokensPerPrompt} Tokens/Prompt &middot; EUR {costPerPrompt}/Prompt</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* [3,3] KOSTENPROGNOSE */}
      <div className="grid-cell">
        <h3 className="cell-title">PROGNOSE</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Naechster Monat: <span className="font-mono text-[#E0E6F0]">EUR {(totalCost * 1.1).toFixed(2)}</span></p>
          <p>Trend: <span className="text-[#FFD600] font-medium" style={{ textShadow: '0 0 6px rgba(255,214,0,0.3)' }}>+10% (geschaetzt)</span></p>
          <p className="text-xs text-[#4A5A7A] mt-2">Basierend auf aktuellem Verbrauch und geplanten Projekten</p>
          <p className="text-xs text-[#4A5A7A]">Stillprobleme.de Start erwartet hoehere Token-Nutzung</p>
        </div>
        <button onClick={onBack} className="cell-btn mt-4">
          Zurueck
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
    <div className="grid-cockpit">
      {/* [1,1] AGENTS — CORE */}
      <div className="grid-cell">
        <h3 className="cell-title">AGENTS — CORE ({coreAgents.length})</h3>
        <div className="space-y-2">
          {coreAgents.map((a) => (
            <div key={a.name} className="text-sm border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="dot-green" />
                <span className="text-[#E0E6F0] font-medium">{a.name}</span>
              </div>
              <p className="text-xs text-[#4A5A7A] mt-1">{a.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [1,2] AGENTS — SPECIALISTS */}
      <div className="grid-cell">
        <h3 className="cell-title">AGENTS — SPECIALISTS ({specialistAgents.length})</h3>
        <div className="space-y-2">
          {specialistAgents.map((a) => (
            <div key={a.name} className="text-sm border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className={a.status === 'active' ? 'dot-green' : 'dot-yellow'} />
                <span className="text-[#E0E6F0] font-medium">{a.name}</span>
              </div>
              <p className="text-xs text-[#4A5A7A] mt-1">{a.triggers}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [1,3] ZUSAMMENFASSUNG */}
      <div className="grid-cell">
        <h3 className="cell-title">ZUSAMMENFASSUNG</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p><span className="stat-number text-base">{agents.length}</span> Agents ({coreAgents.length} Core + {specialistAgents.length} Specialists)</p>
          <p><span className="stat-number text-base">{activeSkills.length}</span> Skills aktiv</p>
          <p>{coreSkills.length} Core &middot; {projectTypeSkills.length} Project Types</p>
          <p>{domainSkills.length} Domains &middot; {integrationSkills.length} Integrations</p>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/system')} className="cell-btn-sm">
            System-Detail oeffnen
          </button>
        </div>
      </div>

      {/* [2,1] SKILLS — CORE */}
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

      {/* [2,2] SKILLS — PROJECT TYPES */}
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

      {/* [2,3] SKILLS — DOMAINS */}
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

      {/* [3,1] SKILLS — INTEGRATIONS */}
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

      {/* [3,2] MCP SERVER QUICK */}
      <div className="grid-cell">
        <h3 className="cell-title">MCP SERVER ({mcpServers.length})</h3>
        <div className="space-y-1">
          {mcpServers.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
              <div className="flex items-center gap-2">
                <span className={s.status === 'connected' ? 'dot-green' : 'dot-red'} />
                <span className="text-[#E0E6F0]">{s.name}</span>
              </div>
              <span className="text-xs text-[#4A5A7A] font-mono">{s.tools} Tools</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,3] SKILL NUTZUNG */}
      <div className="grid-cell">
        <h3 className="cell-title">SKILL NUTZUNG</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Am meisten genutzt:</p>
          <div className="space-y-1">
            <p className="text-[#E0E6F0] font-medium">code-quality <span className="text-xs text-[#4A5A7A]">— jeder Build</span></p>
            <p className="text-[#E0E6F0] font-medium">scaffold-project <span className="text-xs text-[#4A5A7A]">— 3x</span></p>
            <p className="text-[#E0E6F0] font-medium">booking-system <span className="text-xs text-[#4A5A7A]">— 2x</span></p>
          </div>
          <p className="text-xs text-[#4A5A7A] mt-2">Keine inaktiven Skills erkannt</p>
        </div>
        <button onClick={onBack} className="cell-btn mt-3">
          Zurueck
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
    <div className="grid-cockpit">
      {/* [1,1] PORTFOLIO UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">PORTFOLIO UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Projekte gesamt: <span className="stat-number text-lg">{projects.length}</span></p>
          <p>In Entwicklung: <span className="stat-number text-base">{activeProjects.length}</span></p>
          <p>Live: <span className="stat-number text-base">{liveProjects.length}</span></p>
          <p>Pipeline Ideen: <span className="stat-number text-base">{pipelineIdeasV2.length}</span></p>
          <p className="text-xs text-[#4A5A7A] mt-2 font-mono">Umsatzpotenzial: EUR {totalRevenue.toLocaleString('de-DE')}/Jahr</p>
        </div>
      </div>

      {/* [1,2]+[1,3] PROJECT CARDS */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">PROJEKTE</h3>
        <div className="space-y-3">
          {projects.map((p) => {
            const laufzeit = Math.floor(
              (new Date().getTime() - new Date(p.startDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            const healthColor = p.health === 'healthy' ? '#00FF88' : p.health === 'attention' ? '#FFD600' : '#FF2D55';
            return (
              <div key={p.id} className="glass-inner p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: healthColor, boxShadow: `0 0 6px ${healthColor}` }} />
                    <span className="text-[#E0E6F0] font-bold">{p.name}</span>
                    <span className="text-xs text-[#4A5A7A]">{p.phase}</span>
                  </div>
                  <button
                    onClick={() => p.status === 'live' ? showToast('Live: ' + p.name) : openProject(p.id)}
                    className="cell-btn-sm"
                  >
                    {p.status === 'live' ? 'Ansehen' : 'Oeffnen'}
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-[#4A5A7A] mb-2 font-mono">
                  <span>{laufzeit} Tage</span>
                  <span className="text-[#00F0FF]" style={{ textShadow: '0 0 6px rgba(0,240,255,0.3)' }}>{p.progressPercent}%</span>
                  <span>{p.promptCount} Prompts</span>
                  <span>EUR {p.monthlyCost.toFixed(2)}/mo</span>
                </div>
                <div className="cell-bar">
                  <div className="cell-bar-fill" style={{ width: `${p.progressPercent}%`, background: `linear-gradient(90deg, ${healthColor}, ${healthColor}80)` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,1]+[2,2] MILESTONES */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">MILESTONES</h3>
        <div className="space-y-3">
          {projects.filter((p) => p.status === 'building').map((p) => {
            const activeMilestone = p.milestones.find((m) => m.active)?.label || 'n/a';
            const completedCount = p.milestones.filter((m) => m.completed).length;
            return (
              <div key={p.id} className="text-sm">
                <p className="text-[#E0E6F0] font-medium mb-1">{p.name}</p>
                <p className="text-xs text-[#4A5A7A] mb-1 font-mono">Aktuell: {activeMilestone} ({completedCount}/{p.milestones.length})</p>
                <div className="flex gap-1">
                  {p.milestones.map((m) => (
                    <span
                      key={m.label}
                      title={m.label}
                      className="h-3 flex-1 rounded-sm"
                      style={{
                        background: m.completed ? '#00FF88' : m.active ? '#00F0FF' : 'rgba(255,255,255,0.06)',
                        boxShadow: m.completed ? '0 0 4px rgba(0,255,136,0.3)' : m.active ? '0 0 4px rgba(0,240,255,0.3)' : 'none',
                      }}
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
        <h3 className="cell-title">BUSINESS MODELS</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="text-sm border-b border-white/5 pb-1">
              <span className="text-[#E0E6F0] font-medium">{p.name}</span>
              <p className="text-xs text-[#4A5A7A]">{p.businessModel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [3,1]+[3,2] PIPELINE */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">IDEEN PIPELINE ({pipelineIdeasV2.length})</h3>
        <div className="space-y-2">
          {pipelineIdeasV2.map((idea) => (
            <div key={idea.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
              <div>
                <span className="text-[#E0E6F0] font-medium">{idea.name}</span>
                <span className="text-xs text-[#4A5A7A] ml-2">{idea.type}</span>
              </div>
              <span className="text-xs text-[#4A5A7A] font-mono">{idea.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* [3,3] NAECHSTES PROJEKT */}
      <div className="grid-cell">
        <h3 className="cell-title">NAECHSTES PROJEKT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p className="text-[#00F0FF] font-medium" style={{ textShadow: '0 0 8px rgba(0,240,255,0.3)' }}>findemeinehebamme-v2</p>
          <p>Status: PLANNING</p>
          <p>Typ: Marketplace</p>
          <p className="text-xs text-[#4A5A7A] mt-2">Wartet auf Abschluss von Hebammenbuero Phase 0 und Stillprobleme Phase 0</p>
        </div>
        <button onClick={onBack} className="cell-btn mt-3">
          Zurueck
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
    <div className="grid-cockpit">
      {/* [1,1] TODO UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">TODO UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Offen: <span className="stat-number text-lg">{openTodos.length}</span></p>
          <p>Erledigt: <span className="text-[#00FF88] font-mono" style={{ textShadow: '0 0 6px rgba(0,255,136,0.3)' }}>{doneTodos.length}</span></p>
          <p className="text-[#FF2D55] font-medium">Hoch: {highPriority.length}</p>
          <p className="text-[#FFD600]">Mittel: {medPriority.length}</p>
          <p className="text-[#4A5A7A]">Niedrig: {lowPriority.length}</p>
        </div>
      </div>

      {/* [1,2] NEUES TODO */}
      <div className="grid-cell">
        <h3 className="cell-title">NEUES TODO</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Todo eingeben..."
            className="glass-input"
            onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
          />
          <button onClick={addTodo} className="cell-btn">
            + Hinzufuegen
          </button>
        </div>
      </div>

      {/* [1,3] PRIORITAETEN */}
      <div className="grid-cell">
        <h3 className="cell-title">PRIORITAETEN</h3>
        <div className="space-y-2">
          {priorities.map((p) => (
            <div key={p.id} className="text-sm border-b border-white/5 pb-1">
              <div className="flex items-center gap-2">
                <span className={p.impact === 'high' ? 'dot-red' : p.impact === 'medium' ? 'dot-yellow' : 'dot-cyan'} />
                <span className="text-[#E0E6F0]">{p.text}</span>
              </div>
              {p.project && <p className="text-xs text-[#4A5A7A] ml-4">{p.project}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* [2,1]+[2,2] OFFENE TODOS */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">OFFENE TODOS ({openTodos.length})</h3>
        <div className="space-y-1">
          {openTodos.map((t) => {
            const proj = projects.find((p) => p.id === t.projectId);
            return (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={false} onChange={() => toggleTodo(t.id)} className="cursor-pointer accent-[#00F0FF]" />
                  <span className={t.priority === 'high' ? 'dot-red' : t.priority === 'medium' ? 'dot-yellow' : 'dot-cyan'} />
                  <span className="text-[#E0E6F0]">{t.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  {proj && <span className="text-xs text-[#4A5A7A]">{proj.name}</span>}
                  {t.deadline && <span className="text-xs text-[#4A5A7A] font-mono">{t.deadline}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* [2,3] ERLEDIGTE TODOS */}
      <div className="grid-cell">
        <h3 className="cell-title">ERLEDIGT ({doneTodos.length})</h3>
        <div className="space-y-1">
          {doneTodos.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm text-[#4A5A7A] border-b border-white/5 pb-1">
              <input type="checkbox" checked onChange={() => toggleTodo(t.id)} className="cursor-pointer" />
              <span className="line-through">{t.text}</span>
            </div>
          ))}
          {doneTodos.length === 0 && <p className="text-sm text-[#4A5A7A] italic">Keine erledigten Todos</p>}
        </div>
      </div>

      {/* [3,1]+[3,2] TODOS PRO PROJEKT */}
      <div className="grid-cell span-2-cols">
        <h3 className="cell-title">TODOS PRO PROJEKT</h3>
        <div className="grid grid-cols-2 gap-3">
          {projects.map((p) => {
            const projectTodos = openTodos.filter((t) => t.projectId === p.id);
            return (
              <div key={p.id} className="text-sm">
                <p className="text-[#E0E6F0] font-medium">{p.name} (<span className="text-[#00F0FF]">{projectTodos.length}</span>)</p>
                {projectTodos.slice(0, 2).map((t) => (
                  <p key={t.id} className="text-xs text-[#4A5A7A]">- {t.text}</p>
                ))}
                {projectTodos.length === 0 && <p className="text-xs text-[#4A5A7A] italic">Keine offenen Todos</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* [3,3] DEADLINES */}
      <div className="grid-cell">
        <h3 className="cell-title">NAECHSTE DEADLINES</h3>
        <div className="space-y-2">
          {openTodos.filter((t) => t.deadline).sort((a, b) => (a.deadline || '').localeCompare(b.deadline || '')).slice(0, 4).map((t) => {
            const daysLeft = Math.ceil((new Date(t.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysLeft < 0;
            const isUrgent = daysLeft <= 2 && !isOverdue;
            return (
              <div key={t.id} className="text-sm border-b border-white/5 pb-1">
                <p className="text-[#E0E6F0]">{t.text}</p>
                <p className={`text-xs font-mono ${isOverdue ? 'text-[#FF2D55] font-bold' : isUrgent ? 'text-[#FFD600] font-medium' : 'text-[#4A5A7A]'}`} style={isOverdue ? { textShadow: '0 0 6px rgba(255,45,85,0.3)' } : isUrgent ? { textShadow: '0 0 6px rgba(255,214,0,0.3)' } : {}}>
                  {isOverdue ? `${Math.abs(daysLeft)} Tage ueberfaellig` : `${daysLeft} Tage uebrig`}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 space-y-2">
          <button onClick={() => setView('briefing')} className="cell-btn-sm w-full text-left">
            Briefing oeffnen
          </button>
          <button onClick={onBack} className="cell-btn-sm w-full text-left">
            Zurueck
          </button>
        </div>
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
    <div className="grid-cockpit">
      {/* [1,1] SYSTEM STATUS — clickable */}
      <div className="grid-cell cursor-pointer" onClick={() => setDetail('system')}>
        <h3 className="cell-title">SYSTEM STATUS</h3>
        <p className="text-sm text-[#7B8DB5]">Status: <span className="text-[#00FF88] font-bold" style={{ textShadow: '0 0 8px rgba(0,255,136,0.4)' }}>Online</span></p>
        <p className="text-sm text-[#7B8DB5]"><span className="stat-number text-base">{connectedMcp.length}</span> MCP verbunden</p>
        <p className="text-xs text-[#4A5A7A] mt-2 font-mono">Klicken fuer Details</p>
      </div>

      {/* [1,2] TOKEN & KOSTEN — clickable */}
      <div className="grid-cell cursor-pointer" onClick={() => setDetail('finanzen')}>
        <h3 className="cell-title">FINANZEN</h3>
        <p className="text-sm text-[#7B8DB5]">
          Tokens: <span className="stat-number text-base">{Math.round(totalTokens / 1000)}K</span> / 500K (<span className="text-[#00F0FF] font-mono">{Math.round((totalTokens / 500000) * 100)}%</span>)
        </p>
        <p className="text-sm text-[#7B8DB5]">Monatskosten: <span className="stat-number text-base">EUR {totalCost.toFixed(2)}</span></p>
        <p className="text-xs text-[#4A5A7A] mt-2 font-mono">Klicken fuer Details</p>
      </div>

      {/* [1,3] AGENTS & SKILLS — clickable */}
      <div className="grid-cell cursor-pointer" onClick={() => setDetail('agents')}>
        <h3 className="cell-title">AGENTS &amp; SKILLS</h3>
        <p className="text-sm text-[#7B8DB5]"><span className="stat-number text-base">{activeAgents.length}</span> Agents arbeiten</p>
        <p className="text-sm text-[#7B8DB5]"><span className="stat-number text-base">{activeSkills.length}</span> Skills aktiv</p>
        <p className="text-sm text-[#7B8DB5]"><span className="stat-number text-base">{connectedMcp.length}</span> MCP verbunden</p>
        <p className="text-xs text-[#4A5A7A] mt-2 font-mono">Klicken fuer Details</p>
      </div>

      {/* [2,1] PROJEKTE — clickable */}
      <div className="grid-cell cursor-pointer" onClick={() => setDetail('projekte')}>
        <h3 className="cell-title">PROJEKTE</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-[#E0E6F0]">
                {p.name} &middot; {p.phase} &middot; <span className="text-[#00F0FF] font-mono" style={{ textShadow: '0 0 6px rgba(0,240,255,0.3)' }}>{p.progressPercent}%</span>
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
                className="cell-btn-sm"
              >
                {p.status === 'live' ? 'Ansehen' : 'Oeffnen'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#4A5A7A] mt-2 font-mono">Klicken fuer Portfolio-Uebersicht</p>
      </div>

      {/* [2,2] PROJEKT-STATUS & TODOS — clickable */}
      <div className="grid-cell cursor-pointer" onClick={() => setDetail('todos')}>
        <h3 className="cell-title">PROJEKT-STATUS &amp; TODOS</h3>
        <div className="space-y-2 mb-3">
          {topTodos.map((t) => {
            const proj = projects.find((p) => p.id === t.projectId);
            return (
              <div key={t.id} className="text-sm text-[#7B8DB5]">
                <span className="text-[#4A5A7A]">[{proj?.name || 'Allgemein'}]</span> {t.text}
                {t.deadline && <span className="text-xs text-[#4A5A7A] ml-1 font-mono">({t.deadline})</span>}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[#4A5A7A] font-mono">Klicken fuer Todo-Manager</p>
      </div>

      {/* [2,3] IDEEN PIPELINE */}
      <div className="grid-cell">
        <h3 className="cell-title">IDEEN PIPELINE</h3>
        <div className="space-y-2 mb-3">
          {pipelineIdeasV2.map((idea) => (
            <div key={idea.id} className="text-sm text-[#7B8DB5]">
              <span className="text-[#E0E6F0]">{idea.name}</span> &middot; <span className="text-[#4A5A7A]">{idea.type}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setView('thinktank')} className="cell-btn-sm">
          + Neue Idee
        </button>
      </div>

      {/* [3,1] ACTION: BRIEFING */}
      <div className="grid-cell">
        <h3 className="cell-title">ACTION: BRIEFING</h3>
        <p className="text-sm text-[#7B8DB5] mb-3">Was war gestern, was kommt heute</p>
        <button onClick={() => setView('briefing')} className="cell-btn">
          Briefing oeffnen
        </button>
      </div>

      {/* [3,2] ACTION: THINKTANK */}
      <div className="grid-cell">
        <h3 className="cell-title">ACTION: THINKTANK</h3>
        <p className="text-sm text-[#7B8DB5] mb-3">Gedanken teilen und strukturieren</p>
        <button onClick={() => setView('thinktank')} className="cell-btn">
          Thinktank oeffnen
        </button>
      </div>

      {/* [3,3] KANI STATUS */}
      <div className="grid-cell">
        <h3 className="cell-title">KANI STATUS</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <div className="flex items-center gap-2">
            <span className="dot-green" />
            <span className="text-[#E0E6F0] font-medium">Online</span>
          </div>
          <p>Letzte Aktion: <span className="text-[#E0E6F0] font-mono">vor 3 Min</span></p>
          <p>Session: <span className="stat-number text-base">2h 14m</span></p>
          <p>Kontext: <span className="stat-number text-base">47%</span> belegt</p>
          <p className="text-xs text-[#4A5A7A] mt-2 font-mono">MCKAY OS v1.0 &middot; Phase 0</p>
        </div>
      </div>
    </div>
  );
}

// --- BRIEFING VIEW ---
function BriefingView({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="grid-cockpit">
      {/* [1,1] GESTERN */}
      <div className="grid-cell">
        <h3 className="cell-title">GESTERN</h3>
        <div className="space-y-1 text-sm text-[#7B8DB5]">
          <p><span className="stat-number text-base">12</span> Todos erledigt</p>
          <p>3 Projekte bearbeitet: Hebammenbuero, TennisCoach, Mission Control</p>
          <p>Fortschritt: <span className="text-[#00FF88] font-mono" style={{ textShadow: '0 0 6px rgba(0,255,136,0.3)' }}>+8%</span> gesamt</p>
          <p>2 neue Ideen erstellt</p>
        </div>
      </div>

      {/* [1,2] + [2,2] EMPFEHLUNG — spans 2 rows */}
      <div className="grid-cell span-2-rows">
        <h3 className="cell-title">EMPFEHLUNG</h3>
        <p className="text-sm text-[#7B8DB5] mb-3">Empfohlene Reihenfolge:</p>
        <ol className="list-decimal list-inside text-sm text-[#7B8DB5] space-y-2 mb-6">
          <li>
            <span className="font-bold text-[#E0E6F0]">Hebammenbuero</span> — Mockup Review
          </li>
          <li>
            <span className="font-bold text-[#E0E6F0]">Stillprobleme</span> — Mockup bauen
          </li>
          <li>
            <span className="font-bold text-[#E0E6F0]">TennisCoach</span> — Phase 4 planen
          </li>
        </ol>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setView('dashboard')} className="cell-btn">
            Cockpit
          </button>
          <button onClick={() => setView('thinktank')} className="cell-btn">
            Thinktank
          </button>
        </div>
      </div>

      {/* [1,3] HEUTE */}
      <div className="grid-cell">
        <h3 className="cell-title">HEUTE</h3>
        <div className="space-y-1 text-sm text-[#7B8DB5]">
          <p><span className="stat-number text-base">6</span> Todos geplant</p>
          <p>Projekte: Hebammenbuero, Stillprobleme</p>
          <p>Termine: 14:00 Designer, 16:00 Testing</p>
          <p>Ziel: <span className="text-[#00F0FF] font-mono" style={{ textShadow: '0 0 6px rgba(0,240,255,0.3)' }}>+15%</span> Fortschritt</p>
        </div>
      </div>

      {/* [2,1] PROJEKTE GESTERN */}
      <div className="grid-cell">
        <h3 className="cell-title">PROJEKTE GESTERN</h3>
        <div className="space-y-1 text-sm text-[#7B8DB5]">
          <p>Hebammenbuero: Mockup erweitert (<span className="text-[#00FF88]">+8%</span>)</p>
          <p>TennisCoach: Auth fertig gebaut (<span className="text-[#00FF88]">+5%</span>)</p>
        </div>
      </div>

      {/* [2,2] is covered by EMPFEHLUNG span */}

      {/* [2,3] TERMINE HEUTE */}
      <div className="grid-cell">
        <h3 className="cell-title">TERMINE HEUTE</h3>
        <div className="space-y-1 text-sm text-[#7B8DB5]">
          <p><span className="text-[#00F0FF] font-mono">09:00</span> Standup mit KANI</p>
          <p><span className="text-[#00F0FF] font-mono">11:00</span> Hebammenbuero Review</p>
          <p><span className="text-[#00F0FF] font-mono">14:00</span> Call mit Designer</p>
          <p><span className="text-[#00F0FF] font-mono">16:00</span> TennisCoach Testing</p>
        </div>
      </div>

      {/* [3,1] KANI INSIGHT 1 */}
      <div className="grid-cell">
        <h3 className="cell-title">KANI INSIGHT</h3>
        <p className="text-sm text-[#8B5CF6] italic" style={{ textShadow: '0 0 12px rgba(139,92,246,0.3)' }}>
          &quot;Hebammenbuero + Stillprobleme teilen 80% der Skills&quot;
        </p>
      </div>

      {/* [3,2] KANI INSIGHT 2 */}
      <div className="grid-cell">
        <h3 className="cell-title">KANI INSIGHT</h3>
        <p className="text-sm text-[#8B5CF6] italic" style={{ textShadow: '0 0 12px rgba(139,92,246,0.3)' }}>
          &quot;TennisCoach: Stripe dauert ~2 Tage&quot;
        </p>
      </div>

      {/* [3,3] FOKUS-TIMER */}
      <div className="grid-cell">
        <h3 className="cell-title">FOKUS</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Heutiger Fokus:</p>
          <p className="text-[#00F0FF] font-bold text-lg" style={{ textShadow: '0 0 16px rgba(0,240,255,0.4)' }}>Hebammenbuero</p>
          <p>Mockup Review + Validation</p>
          <p className="text-xs text-[#4A5A7A] mt-3 font-mono">Empfohlen: 3h Fokuszeit</p>
          <p className="text-xs text-[#4A5A7A] font-mono">Ablenkungen vermeiden bis 14:00</p>
        </div>
        <div className="mt-3 space-y-2">
          <button onClick={() => setView('dashboard')} className="cell-btn w-full">
            Zurueck
          </button>
          <button onClick={() => setView('thinktank')} className="cell-btn-sm w-full">
            Thinktank
          </button>
        </div>
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
              Enter zum Senden &middot; Shift+Enter fuer neue Zeile
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
              <p>{categoryCounts['Ideen']} Ideen &middot; {categoryCounts['Strategie']} Strategien</p>
              <p>{categoryCounts['Research']} Research &middot; {categoryCounts['Privat']} Privat</p>
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
