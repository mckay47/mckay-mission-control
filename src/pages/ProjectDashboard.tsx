import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../components/ui';
import { projects, initialTodos, dummyChat } from '../data/dummy';
import type { ChatMessage, TodoItem } from '../data/types';

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080C18' }}>
        <div className="glass-elevated rounded-2xl p-8 max-w-md text-center">
          <p className="text-lg font-bold text-[#E0E6F0] mb-2">Projekt nicht gefunden</p>
          <p className="text-sm text-[#7B8DB5] mb-4">Kein Projekt mit ID &quot;{id}&quot;</p>
          <button onClick={() => window.close()} className="cell-btn">Fenster schliessen</button>
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
    <div className="min-h-screen" style={{ background: '#080C18', backgroundImage: 'url(/bg-cockpit.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Dialog Modal */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-elevated rounded-2xl p-6 max-w-md w-full mx-4">
            {dialog.type === 'confirm-idea' && (
              <>
                <h3 className="font-bold text-[#E0E6F0] mb-2">Idee speichern?</h3>
                <p className="text-sm text-[#7B8DB5] mb-4">&quot;{dialog.data}&quot;</p>
                <p className="text-xs text-[#4A5A7A] mb-4">
                  Die Idee wird zur Ideenliste hinzugefuegt. Du kannst sie spaeter als Prompt ins Terminal uebernehmen.
                </p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setDialog(null)} className="cell-btn">Abbrechen</button>
                  <button onClick={confirmIdea} className="cell-btn" style={{ background: 'rgba(0,240,255,0.15)', borderColor: 'rgba(0,240,255,0.3)', color: '#00F0FF' }}>Speichern</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="px-6 py-2 flex items-center justify-between" style={{ background: 'rgba(10,17,32,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs text-[#4A5A7A]">
          Dieses Fenster kann geschlossen werden — der Prozess laeuft weiter. Vom Cockpit aus wieder oeffnen.
        </p>
        <button onClick={() => window.close()} className="text-xs text-[#4A5A7A] hover:text-[#00F0FF] transition-colors cursor-pointer">
          [x Schliessen]
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-[#E0E6F0]">PROJEKT: <span className="text-[#00F0FF]">{project.name}</span></h1>
            <p className="text-sm text-[#7B8DB5]">
              {project.phase} &middot; {project.health} &middot; <span className="stat-number text-sm">{project.progressPercent}%</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {project.deployUrl && (
              <a href={project.deployUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors">
                {project.deployUrl.replace('https://', '')}
              </a>
            )}
            <button
              onClick={() => {
                setPaused((prev) => !prev);
                showToast(paused ? 'Projekt fortgesetzt: ' + project.name : 'Projekt pausiert: ' + project.name);
              }}
              className={`cell-btn ${paused ? '!bg-[rgba(255,107,44,0.15)] !border-[rgba(255,107,44,0.3)] !text-[#FF6B2C]' : ''}`}
            >
              {paused ? 'Fortsetzen' : 'Pausieren'}
            </button>
            <button onClick={() => showToast('Aktionen-Menu kommt bald')} className="cell-btn">Aktionen</button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span className="glass-inner px-3 py-1 text-[#E0E6F0] font-mono text-xs">
            <span className="stat-number text-sm">{laufzeit}</span> Tage
          </span>
          <span className="glass-inner px-3 py-1 text-[#E0E6F0] font-mono text-xs">
            <span className="stat-number text-sm">{project.tokenUsage >= 1000 ? `${Math.round(project.tokenUsage / 1000)}K` : project.tokenUsage}</span> Tokens
          </span>
          <span className="glass-inner px-3 py-1 text-[#E0E6F0] font-mono text-xs">
            <span className="stat-number text-sm">{project.promptCount}</span> Prompts
          </span>
          <span className="glass-inner px-3 py-1 text-[#E0E6F0] font-mono text-xs">
            EUR <span className="stat-number text-sm">{project.monthlyCost.toFixed(2)}</span>/mo
          </span>
        </div>

        {/* Milestones */}
        <div className="mt-3 flex flex-wrap gap-1">
          {project.milestones.map((m) => (
            <span
              key={m.label}
              className={`px-2 py-0.5 rounded-lg border text-xs font-mono ${
                m.completed
                  ? 'bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.3)] text-[#00FF88]'
                  : m.active
                    ? 'bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)] text-[#00F0FF] font-bold'
                    : 'bg-white/[0.02] border-white/[0.08] text-[#4A5A7A]'
              }`}
            >
              {m.completed ? 'OK' : m.active ? '>>' : '--'} {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Paused Banner */}
      {paused && (
        <div className="mx-6 mt-3 rounded-xl px-4 py-3 flex items-center justify-between attention-border" style={{ background: 'rgba(255,107,44,0.1)', border: '1px solid rgba(255,107,44,0.3)' }}>
          <div>
            <p className="text-sm font-bold text-[#FF6B2C]">Projekt pausiert</p>
            <p className="text-xs text-[#FF6B2C]/70">Alle Arbeiten an diesem Projekt sind gestoppt. Klicke &quot;Fortsetzen&quot; um weiterzumachen.</p>
          </div>
          <button
            onClick={() => {
              setPaused(false);
              showToast('Projekt fortgesetzt: ' + project.name);
            }}
            className="cell-btn !border-[rgba(255,107,44,0.4)] !text-[#FF6B2C] hover:!bg-[rgba(255,107,44,0.15)]"
          >
            Fortsetzen
          </button>
        </div>
      )}

      {/* Main: 2/3 terminal + 1/3 sidebar */}
      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Left — TERMINAL */}
        <div className="lg:w-2/3 p-4 flex flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="terminal-panel p-4 flex-1 flex flex-col">
            <h2 className="cell-title">
              TERMINAL — {project.name}
            </h2>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto rounded-xl p-3 mb-3 space-y-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`text-sm ${msg.sender === 'kani' ? 'text-[#7B8DB5]' : 'text-[#E0E6F0] font-medium'}`}>
                  <span className="text-xs text-[#4A5A7A] mr-1 font-mono">[{msg.time}]</span>
                  <span className={`font-bold ${msg.sender === 'kani' ? 'text-[#8B5CF6]' : 'text-[#00F0FF]'}`}>{msg.sender === 'kani' ? 'KANI' : 'Mehti'}:</span>{' '}
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
                className="flex-1 glass-input"
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <button onClick={sendMessage} disabled={paused} className={`cell-btn ${paused ? 'opacity-50 cursor-not-allowed' : ''}`}>Senden</button>
            </div>

            {/* Context */}
            <div className="mt-3 text-xs text-[#4A5A7A] flex gap-4 font-mono">
              {lastTimeline && <span>Zuletzt: {lastTimeline.title}</span>}
              <span>Naechster Step: {nextMilestone}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-inner mt-4 p-4">
            <h2 className="cell-title">TIMELINE</h2>
            <div className="space-y-1">
              {project.timeline.map((t, i) => (
                <div key={i} className="text-xs text-[#7B8DB5] flex gap-2">
                  <span className="text-[#4A5A7A] w-16 font-mono">{t.date.slice(5)}</span>
                  <span className="font-medium text-[#E0E6F0]">{t.title}</span>
                  <span className="text-[#4A5A7A]">— {t.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — SIDEBAR */}
        <div className="lg:w-1/3 p-4 overflow-y-auto space-y-4">
          {/* IDEEN */}
          <div className="glass-inner p-4">
            <h2 className="cell-title">
              IDEEN ({ideas.length})
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                placeholder="Neue Idee..."
                className="flex-1 glass-input text-sm"
                onKeyDown={(e) => { if (e.key === 'Enter') addIdea(); }}
              />
              <button onClick={addIdea} className="cell-btn-sm">+ Hinzufuegen</button>
            </div>
            <div className="space-y-2">
              {ideas.map((idea, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-1">
                  <span className="text-[#E0E6F0]">{idea}</span>
                  <div className="flex gap-1">
                    <button onClick={() => ideaToPrompt(idea)} className="cell-btn-sm">Prompt</button>
                    <button onClick={() => showToast('Todo erstellt: ' + idea)} className="cell-btn-sm">Todo</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TODOS */}
          <div className="glass-inner p-4">
            <h2 className="cell-title">
              TODOS — {openTodos.length} offen &middot; {doneTodos.length} erledigt
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Neues Todo..."
                className="flex-1 glass-input text-sm"
                onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
              />
              <button onClick={addTodo} className="cell-btn-sm">+ Hinzufuegen</button>
            </div>
            <div className="space-y-1">
              {openTodos.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={false} onChange={() => toggleTodo(t.id)} className="cursor-pointer accent-[#00F0FF]" />
                    <span className="text-[#E0E6F0]">{t.text}</span>
                    {t.deadline && <span className="text-xs text-[#4A5A7A]">({t.deadline})</span>}
                  </div>
                  <button onClick={() => todoToPrompt(t.text)} className="cell-btn-sm">Prompt</button>
                </div>
              ))}
              {doneTodos.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-[#4A5A7A] cursor-pointer hover:text-[#7B8DB5] transition-colors">
                    {doneTodos.length} erledigte anzeigen
                  </summary>
                  {doneTodos.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-sm text-[#4A5A7A] mt-1">
                      <input type="checkbox" checked onChange={() => toggleTodo(t.id)} className="cursor-pointer" />
                      <span className="line-through">{t.text}</span>
                    </div>
                  ))}
                </details>
              )}
            </div>
          </div>

          {/* PROJEKT-INFO */}
          <div className="glass-inner p-4">
            <h2 className="cell-title">PROJEKT-INFO</h2>
            <div className="space-y-1 text-sm text-[#7B8DB5]">
              <p><strong className="text-[#E0E6F0]">Business:</strong> {project.businessModel}</p>
              {project.market && (
                <>
                  <p><strong className="text-[#E0E6F0]">Markt:</strong> {project.market.marketSize}</p>
                  <p><strong className="text-[#E0E6F0]">Kunden:</strong> {project.market.potentialCustomers}</p>
                  <p><strong className="text-[#E0E6F0]">Umsatz:</strong> {project.market.revenueEstimate}</p>
                  {project.market.profitEstimate && <p><strong className="text-[#E0E6F0]">Gewinn:</strong> {project.market.profitEstimate}</p>}
                </>
              )}
              <p><strong className="text-[#E0E6F0]">Skills:</strong> {project.skills.length} aktiv</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
