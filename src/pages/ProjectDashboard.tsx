import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../components/ui';
import { projects, initialTodos, dummyChat } from '../data/dummy';
import type { ChatMessage, TodoItem } from '../data/types';

const btnClass =
  'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black';
const btnSmClass =
  'bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black';

export function ProjectDashboard() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const project = projects.find((p) => p.id === id);

  const [messages, setMessages] = useState<ChatMessage[]>(dummyChat);
  const [terminalInput, setTerminalInput] = useState('');
  const [ideaInput, setIdeaInput] = useState('');
  const [ideas, setIdeas] = useState(['Onboarding Wizard', 'PDF Export', 'WhatsApp Integration']);
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos.filter((t) => t.projectId === id));
  const [newTodo, setNewTodo] = useState('');
  const [dialog, setDialog] = useState<{ type: string; data?: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="border border-gray-300 rounded-lg p-8">
            <p className="text-lg font-bold text-black mb-2">Projekt nicht gefunden</p>
            <p className="text-sm text-gray-600 mb-4">Kein Projekt mit ID &quot;{id}&quot;</p>
            <button onClick={() => window.close()} className={btnClass}>Fenster schliessen</button>
          </div>
        </div>
      </div>
    );
  }

  const laufzeit = Math.floor(
    (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const nextMilestone =
    project.milestones.find((m) => m.active)?.label ||
    project.milestones.find((m) => !m.completed)?.label ||
    'Fertig';
  const lastTimeline = project.timeline[project.timeline.length - 1];
  const openTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);

  const sendMessage = () => {
    if (!terminalInput.trim()) return;
    const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: terminalInput, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setTerminalInput('');
    setTimeout(() => {
      const kaniMsg: ChatMessage = {
        id: `k-${Date.now()}`,
        sender: 'kani',
        text: 'Verstanden. Ich arbeite daran.',
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, kaniMsg]);
    }, 800);
  };

  const addIdea = () => {
    if (!ideaInput.trim()) return;
    setDialog({ type: 'confirm-idea', data: ideaInput });
  };

  const confirmIdea = () => {
    if (dialog?.data) {
      setIdeas((prev) => [dialog.data!, ...prev]);
      setIdeaInput('');
      showToast('Idee gespeichert: ' + dialog.data);
    }
    setDialog(null);
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: TodoItem = { id: `t-${Date.now()}`, text: newTodo, done: false, projectId: id };
    setTodos((prev) => [todo, ...prev]);
    setNewTodo('');
    showToast('Todo hinzugefuegt');
  };

  const toggleTodo = (todoId: string) => {
    setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)));
  };

  const ideaToPrompt = (idea: string) => {
    setTerminalInput(`Baue folgendes Feature fuer ${project.name}: ${idea}`);
    showToast('Prompt vorbereitet — im Terminal bearbeiten und absenden');
  };

  const todoToPrompt = (text: string) => {
    setTerminalInput(`Arbeite an folgendem Todo fuer ${project.name}: ${text}`);
    showToast('Prompt vorbereitet — im Terminal bearbeiten und absenden');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dialog Modal */}
      {dialog && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            {dialog.type === 'confirm-idea' && (
              <>
                <h3 className="font-bold text-black mb-2">Idee speichern?</h3>
                <p className="text-sm text-gray-600 mb-4">&quot;{dialog.data}&quot;</p>
                <p className="text-xs text-gray-400 mb-4">
                  Die Idee wird zur Ideenliste hinzugefuegt. Du kannst sie spaeter als Prompt ins Terminal uebernehmen.
                </p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setDialog(null)} className={btnClass}>Abbrechen</button>
                  <button onClick={confirmIdea} className={btnClass + ' !bg-black !text-white'}>Speichern</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Dieses Fenster kann geschlossen werden — der Prozess laeuft weiter. Vom Cockpit aus wieder oeffnen.
        </p>
        <button onClick={() => window.close()} className="text-xs text-gray-400 hover:text-black">
          [✕ Schliessen]
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-black">PROJEKT: {project.name}</h1>
            <p className="text-sm text-gray-600">
              {project.phase} &middot; {project.health} &middot; {project.progressPercent}%
            </p>
          </div>
          <div className="flex items-center gap-2">
            {project.deployUrl && (
              <a href={project.deployUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                {project.deployUrl.replace('https://', '')}
              </a>
            )}
            <button
              onClick={() => {
                setPaused((prev) => !prev);
                showToast(paused ? 'Projekt fortgesetzt: ' + project.name : 'Projekt pausiert: ' + project.name);
              }}
              className={`${btnClass} ${paused ? '!bg-yellow-100 !border-yellow-400' : ''}`}
            >
              {paused ? 'Fortsetzen' : 'Pausieren'}
            </button>
            <button onClick={() => showToast('Aktionen-Menu kommt bald')} className={btnClass}>Aktionen ▾</button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
            {laufzeit} Tage Laufzeit
          </span>
          <span className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
            {project.tokenUsage >= 1000 ? `${Math.round(project.tokenUsage / 1000)}K` : project.tokenUsage} Tokens
          </span>
          <span className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
            {project.promptCount} Prompts
          </span>
          <span className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
            EUR {project.monthlyCost.toFixed(2)}/mo
          </span>
        </div>

        {/* Milestones */}
        <div className="mt-3 flex flex-wrap gap-1">
          {project.milestones.map((m) => (
            <span
              key={m.label}
              className={`px-2 py-0.5 rounded border text-xs ${
                m.completed
                  ? 'bg-gray-200 border-gray-400 text-black'
                  : m.active
                    ? 'bg-yellow-100 border-yellow-400 text-black font-bold'
                    : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {m.completed ? '✓' : m.active ? '●' : '○'} {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Paused Banner */}
      {paused && (
        <div className="mx-6 mt-3 border border-yellow-400 bg-yellow-50 rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-yellow-800">Projekt pausiert</p>
            <p className="text-xs text-yellow-600">Alle Arbeiten an diesem Projekt sind gestoppt. Klicke &quot;Fortsetzen&quot; um weiterzumachen.</p>
          </div>
          <button
            onClick={() => {
              setPaused(false);
              showToast('Projekt fortgesetzt: ' + project.name);
            }}
            className={btnClass + ' !bg-yellow-200 !border-yellow-400'}
          >
            Fortsetzen
          </button>
        </div>
      )}

      {/* Main: 2/3 terminal + 1/3 sidebar */}
      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Left — TERMINAL */}
        <div className="lg:w-2/3 p-4 flex flex-col border-r border-gray-200">
          <div className="border border-gray-300 rounded-lg p-4 flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">
              TERMINAL — {project.name}
            </h2>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-3 mb-3 bg-gray-50 space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`text-sm ${msg.sender === 'kani' ? 'text-gray-700' : 'text-black font-medium'}`}>
                  <span className="text-xs text-gray-400 mr-1">[{msg.time}]</span>
                  <span className="font-bold">{msg.sender === 'kani' ? 'KANI' : 'Mehti'}:</span>{' '}
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder={paused ? 'Projekt ist pausiert...' : 'Eingabe...'}
                disabled={paused}
                className={`flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black ${paused ? 'opacity-50 cursor-not-allowed' : ''}`}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <button onClick={sendMessage} disabled={paused} className={`${btnClass} ${paused ? 'opacity-50 cursor-not-allowed' : ''}`}>Senden</button>
            </div>

            {/* Context */}
            <div className="mt-3 text-xs text-gray-500 flex gap-4">
              {lastTimeline && <span>Zuletzt: {lastTimeline.title}</span>}
              <span>Naechster Step: {nextMilestone}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="border border-gray-300 rounded-lg p-4 mt-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">TIMELINE</h2>
            <div className="space-y-1">
              {project.timeline.map((t, i) => (
                <div key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-gray-400 w-16">{t.date.slice(5)}</span>
                  <span className="font-medium text-black">{t.title}</span>
                  <span className="text-gray-400">— {t.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — SIDEBAR */}
        <div className="lg:w-1/3 p-4 overflow-y-auto space-y-4">
          {/* IDEEN */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">
              IDEEN ({ideas.length})
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                placeholder="Neue Idee..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black"
                onKeyDown={(e) => { if (e.key === 'Enter') addIdea(); }}
              />
              <button onClick={addIdea} className={btnSmClass}>+ Hinzufuegen</button>
            </div>
            <div className="space-y-2">
              {ideas.map((idea, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1">
                  <span className="text-black">{idea}</span>
                  <div className="flex gap-1">
                    <button onClick={() => ideaToPrompt(idea)} className={btnSmClass}>→ Prompt</button>
                    <button onClick={() => showToast('Todo erstellt: ' + idea)} className={btnSmClass}>→ Todo</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TODOS */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">
              TODOS — {openTodos.length} offen · {doneTodos.length} erledigt
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Neues Todo..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black"
                onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
              />
              <button onClick={addTodo} className={btnSmClass}>+ Hinzufuegen</button>
            </div>
            <div className="space-y-1">
              {openTodos.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={false} onChange={() => toggleTodo(t.id)} className="cursor-pointer" />
                    <span className="text-black">{t.text}</span>
                    {t.deadline && <span className="text-xs text-gray-400">({t.deadline})</span>}
                  </div>
                  <button onClick={() => todoToPrompt(t.text)} className={btnSmClass}>→ Prompt</button>
                </div>
              ))}
              {doneTodos.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-400 cursor-pointer">
                    {doneTodos.length} erledigte anzeigen
                  </summary>
                  {doneTodos.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <input type="checkbox" checked onChange={() => toggleTodo(t.id)} className="cursor-pointer" />
                      <span className="line-through">{t.text}</span>
                    </div>
                  ))}
                </details>
              )}
            </div>
          </div>

          {/* PROJEKT-INFO */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">PROJEKT-INFO</h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Business:</strong> {project.businessModel}</p>
              {project.market && (
                <>
                  <p><strong>Markt:</strong> {project.market.marketSize}</p>
                  <p><strong>Kunden:</strong> {project.market.potentialCustomers}</p>
                  <p><strong>Umsatz:</strong> {project.market.revenueEstimate}</p>
                  {project.market.profitEstimate && <p><strong>Gewinn:</strong> {project.market.profitEstimate}</p>}
                </>
              )}
              <p><strong>Skills:</strong> {project.skills.length} aktiv</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
