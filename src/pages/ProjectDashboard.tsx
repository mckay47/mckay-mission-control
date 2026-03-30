import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../components/ui';
import { projects, initialTodos, dummyChat } from '../data/dummy';

const btnClass =
  'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black';
const btnSmClass =
  'bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black';

export function ProjectDashboard() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const project = projects.find((p) => p.id === id);

  const [terminalInput, setTerminalInput] = useState('');
  const [ideaInput, setIdeaInput] = useState('');

  if (!project) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="border border-gray-300 rounded-lg p-8">
            <p className="text-lg font-bold text-black mb-2">Projekt nicht gefunden</p>
            <p className="text-sm text-gray-600 mb-4">
              Kein Projekt mit ID &quot;{id}&quot; im System.
            </p>
            <button
              onClick={() => window.close()}
              className={btnClass}
            >
              Fenster schliessen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const laufzeit = Math.floor(
    (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const projectTodos = initialTodos.filter((t) => t.projectId === project.id && !t.done);
  const lastTimeline = project.timeline[project.timeline.length - 1];
  const nextMilestone =
    project.milestones.find((m) => m.active)?.label ||
    project.milestones.find((m) => !m.completed)?.label ||
    'Fertig';

  const dummyIdeas = ['Onboarding Wizard', 'PDF Export', 'WhatsApp Integration'];

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-2">
        <p className="text-xs text-gray-500">
          Dieses Fenster kann geschlossen werden — der Prozess laeuft weiter. Vom Cockpit aus wieder oeffnen.
        </p>
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
          {project.deployUrl && (
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              {project.deployUrl.replace('https://', '')}
            </a>
          )}
        </div>

        {/* Metrics bar */}
        <div className="mt-3 text-sm text-gray-600">
          Laufzeit: {laufzeit} Tage | Tokens:{' '}
          {project.tokenUsage >= 1000
            ? `${Math.round(project.tokenUsage / 1000)}K`
            : project.tokenUsage}{' '}
          | Prompts: {project.promptCount} | EUR {project.monthlyCost.toFixed(2)}
        </div>

        {/* Milestones */}
        <div className="mt-3 flex flex-wrap gap-2">
          {project.milestones.map((m) => (
            <span
              key={m.label}
              className={`px-2 py-0.5 rounded border text-xs ${
                m.completed
                  ? 'bg-gray-200 border-gray-400 text-black'
                  : m.active
                    ? 'bg-yellow-100 border-yellow-400 text-black font-bold'
                    : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {m.completed ? '>' : m.active ? '●' : '○'} {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Main content: 2/3 left (terminal) + 1/3 right */}
      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Left 2/3 — TERMINAL */}
        <div className="lg:w-2/3 p-4 flex flex-col border-r border-gray-200">
          <div className="border border-gray-300 rounded-lg p-4 flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">TERMINAL</h2>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-3 mb-3 bg-gray-50 space-y-2">
              {dummyChat.map((msg) => (
                <div key={msg.id} className={`text-sm ${msg.sender === 'kani' ? 'text-gray-700' : 'text-black font-medium'}`}>
                  <span className="text-xs text-gray-400 mr-1">[{msg.time}]</span>
                  <span className="font-bold">{msg.sender === 'kani' ? 'KANI' : 'Mehti'}:</span>{' '}
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Eingabe..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && terminalInput.trim()) {
                    showToast('Nachricht gesendet: ' + terminalInput);
                    setTerminalInput('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (terminalInput.trim()) {
                    showToast('Nachricht gesendet: ' + terminalInput);
                    setTerminalInput('');
                  }
                }}
                className={btnClass}
              >
                Senden
              </button>
            </div>

            {/* Last / Next */}
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              {lastTimeline && <p>Zuletzt: {lastTimeline.title}</p>}
              <p>Naechster Step: {nextMilestone}</p>
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="lg:w-1/3 p-4 overflow-y-auto space-y-4">
          {/* IDEEN */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">IDEEN</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                placeholder="Neue Idee..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              {dummyIdeas.map((idea) => (
                <div key={idea} className="flex items-center justify-between text-sm">
                  <span className="text-black">{idea}</span>
                  <button
                    onClick={() => showToast('Prompt fuer: ' + idea)}
                    className={btnSmClass}
                  >
                    Prompt
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TODOS */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">TODOS</h2>
            <div className="space-y-2">
              {projectTodos.length > 0 ? (
                projectTodos.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <span className="text-black">
                      [ ] {t.text}
                      {t.deadline && <span className="text-xs text-gray-400 ml-1">({t.deadline})</span>}
                    </span>
                    <button
                      onClick={() => showToast('Prompt fuer: ' + t.text)}
                      className={btnSmClass}
                    >
                      Prompt
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Keine offenen Todos</p>
              )}
            </div>
          </div>

          {/* PROJEKT-INFO */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-bold text-black mb-2 pb-2 border-b border-gray-200">PROJEKT-INFO</h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Business: {project.businessModel}</p>
              {project.market && (
                <>
                  <p>Markt: {project.market.potentialCustomers}</p>
                  <p>Umsatz: {project.market.revenueEstimate}</p>
                </>
              )}
              <p>Skills: {project.skills.length} aktiv</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => window.close()}
            className={btnClass + ' w-full'}
          >
            Fenster schliessen
          </button>
        </div>
      </div>
    </div>
  );
}
