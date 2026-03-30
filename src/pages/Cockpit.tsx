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

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

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

    setEntries((prev) => [newEntry, ...prev]);
    setInput('');
    setKaniResponse(`Eingeordnet als: ${category}`);
    setTimeout(() => setKaniResponse(null), 4000);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
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

  // Render up to 4 entries in grid cells [2,2], [2,3], [3,1], [3,2]
  const visibleEntries = filteredEntries.slice(0, 4);

  const renderEntry = (entry: PipelineIdeaV2) => {
    const cat = classifyType(entry.type);
    const isOrig = showOriginal[entry.id];
    return (
      <div key={entry.id}>
        <h4 className="text-sm font-bold text-black mb-1">{entry.name}</h4>
        <p className="text-xs text-gray-500 mb-1">
          Typ: {cat} | {entry.createdAt}
        </p>
        <p className="text-xs text-gray-600 mb-2">
          &quot;{(isOrig ? entry.rawTranscript : entry.structuredVersion).slice(0, 100)}
          {(isOrig ? entry.rawTranscript : entry.structuredVersion).length > 100 ? '...' : ''}
          &quot;
        </p>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() =>
              setShowOriginal((prev) => ({ ...prev, [entry.id]: !prev[entry.id] }))
            }
            className={btnSmClass}
          >
            {isOrig ? 'Strukturiert' : 'Original'}
          </button>
          <button onClick={() => showToast('Projekt starten: ' + entry.name)} className={btnSmClass}>
            Projekt starten
          </button>
          <button onClick={() => showToast('Research: ' + entry.name)} className={btnSmClass}>
            Research
          </button>
          <button onClick={() => handleDelete(entry.id)} className={btnSmClass}>
            Loeschen
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1]+[1,2] GEDANKEN TEILEN — span 2 cols */}
      <div className="grid-cell span-2-cols">
        <h3 className="text-sm font-bold text-black mb-3">GEDANKEN TEILEN</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Schreib was du denkst..."
          rows={4}
          className="w-full border border-gray-300 rounded p-3 text-sm text-black bg-white resize-none mb-3"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className={btnClass + ' disabled:opacity-40 disabled:cursor-not-allowed'}
        >
          Absenden
        </button>
      </div>

      {/* [1,3] KANI ANTWORT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">KANI ANTWORT</h3>
        {kaniResponse ? (
          <p className="text-sm text-black">{kaniResponse}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">Warte auf Eingabe...</p>
        )}
      </div>

      {/* [2,1] FILTER TABS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">FILTER</h3>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded border text-xs cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gray-300 border-gray-500 text-black font-bold'
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-black'
              }`}
            >
              {cat === 'alle' ? 'Alle' : cat}: {categoryCounts[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* [2,2] ENTRY 1 */}
      <div className="grid-cell">
        {visibleEntries[0] ? renderEntry(visibleEntries[0]) : <p className="text-sm text-gray-400">Kein Eintrag</p>}
      </div>

      {/* [2,3] ENTRY 2 */}
      <div className="grid-cell">
        {visibleEntries[1] ? renderEntry(visibleEntries[1]) : <p className="text-sm text-gray-400">Kein Eintrag</p>}
      </div>

      {/* [3,1] ENTRY 3 */}
      <div className="grid-cell">
        {visibleEntries[2] ? renderEntry(visibleEntries[2]) : <p className="text-sm text-gray-400">Kein Eintrag</p>}
      </div>

      {/* [3,2] ENTRY 4 */}
      <div className="grid-cell">
        {visibleEntries[3] ? renderEntry(visibleEntries[3]) : <p className="text-sm text-gray-400">Kein Eintrag</p>}
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
