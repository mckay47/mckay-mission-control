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
} from '../data/dummy';
import type { PipelineIdeaV2 } from '../data/types';

type Phase = 'boot' | 'login' | 'launch' | 'dashboard';
type View = 'dashboard' | 'briefing' | 'thinktank';
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
  const activeSkills = skills.filter((s) => s.status === 'active');
  const activeAgents = agents.filter((a) => a.status === 'active');
  const connectedMcp = mcpServers.filter((s) => s.status === 'connected');
  const totalTokens = projects.reduce((sum, p) => sum + p.tokenUsage, 0);
  const totalCost = projects.reduce((sum, p) => sum + p.monthlyCost, 0);
  const topTodos = initialTodos.filter((t) => !t.done).slice(0, 5);

  const openProject = (id: string) => {
    window.open(`/project/${id}`, '_blank', 'width=1200,height=800');
  };

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] SYSTEM STATUS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">SYSTEM STATUS</h3>
        <p className="text-sm text-gray-600">Online</p>
        <p className="text-sm text-gray-600">Aktive Fenster: 2</p>
      </div>

      {/* [1,2] TOKEN & KOSTEN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TOKEN &amp; KOSTEN</h3>
        <p className="text-sm text-gray-600">
          Tokens: {Math.round(totalTokens / 1000)}K / 500K ({Math.round((totalTokens / 500000) * 100)}%)
        </p>
        <p className="text-sm text-gray-600">Monatskosten: EUR {totalCost.toFixed(2)}</p>
      </div>

      {/* [1,3] AGENTS & SKILLS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">AGENTS &amp; SKILLS</h3>
        <p className="text-sm text-gray-600">{activeAgents.length} Agents arbeiten</p>
        <p className="text-sm text-gray-600">{activeSkills.length} Skills aktiv</p>
        <p className="text-sm text-gray-600">{connectedMcp.length} MCP verbunden</p>
      </div>

      {/* [2,1] PROJEKTE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">PROJEKTE</h3>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-black">
                {p.name} &middot; {p.phase} &middot; {p.progressPercent}%
              </span>
              <button
                onClick={() => {
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
      </div>

      {/* [2,2] PROJEKT-STATUS & TODOS */}
      <div className="grid-cell">
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
        <p className="text-xs text-gray-500">Projekt-Ideen in Pipeline: {pipelineIdeasV2.length}</p>
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
