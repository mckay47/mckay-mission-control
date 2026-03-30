import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { projects } from '../data/dummy';

export function ProjectDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
              onClick={() => navigate('/projekte')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              &larr; Zurueck zu Projekte
            </button>
          </div>
        </div>
      </div>
    );
  }

  const laufzeit = Math.floor(
    (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const dummyIdeas = [
    'Onboarding Wizard',
    'PDF Export',
    'WhatsApp Integration',
  ];

  const dummyTodos = [
    { text: 'Mockup erweitern', date: '30.03', done: false },
    { text: 'Validation', date: '05.04', done: false },
    { text: 'Phase 1 starten', date: '', done: false },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/projekte')}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black mb-4"
          >
            &larr; Zurueck zu Projekte
          </button>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-bold text-black">PROJEKT: {project.name}</h1>
            <span className="text-sm text-gray-600">
              {project.phase} &middot; ● {project.health === 'healthy' ? 'Healthy' : project.health}
            </span>
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
        </div>

        {/* METRIKEN */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">METRIKEN</h2>
          <p className="text-sm text-gray-700">
            Laufzeit: {laufzeit} Tage | Tokens:{' '}
            {project.tokenUsage >= 1000
              ? `${Math.round(project.tokenUsage / 1000)}K`
              : project.tokenUsage}{' '}
            | Prompts: {project.promptCount} | EUR {project.monthlyCost.toFixed(2)}
          </p>
        </div>

        {/* FORTSCHRITT */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">FORTSCHRITT</h2>
          <div className="flex flex-wrap gap-2">
            {project.milestones.map((m) => (
              <span
                key={m.label}
                className={`px-3 py-1 rounded border text-sm ${
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* TERMINAL */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">TERMINAL</h2>
              <div className="border border-gray-300 rounded p-3 mb-3 min-h-[120px] bg-gray-50">
                <p className="text-sm text-gray-700">KANI: Was soll ich als naechstes bauen?</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Eingabe..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
                />
                <button
                  onClick={() => {
                    if (terminalInput.trim()) {
                      showToast('Nachricht gesendet: ' + terminalInput);
                      setTerminalInput('');
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
                >
                  Senden
                </button>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">TIMELINE</h2>
              <div className="space-y-2">
                {project.timeline.map((entry, i) => (
                  <div key={i} className="text-sm text-gray-700">
                    &bull;{' '}
                    {new Date(entry.date).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    {entry.title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* IDEEN FUER DIESES PROJEKT */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">
                IDEEN FUER DIESES PROJEKT
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder="Neue Idee eingeben..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
                />
              </div>
              <div className="space-y-2">
                {dummyIdeas.map((idea) => (
                  <div key={idea} className="flex items-center justify-between border border-gray-200 rounded p-2">
                    <span className="text-sm text-black">&bull; {idea}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => showToast('Prompt fuer: ' + idea)}
                        className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                      >
                        &rarr; Prompt
                      </button>
                      <button
                        onClick={() => showToast('Todo erstellt fuer: ' + idea)}
                        className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                      >
                        &rarr; Todo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TODOS */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">TODOS</h2>
              <p className="text-sm text-gray-600 mb-3">
                Offen: {dummyTodos.filter((t) => !t.done).length} | Erledigt: 12
              </p>
              <div className="space-y-2">
                {dummyTodos.map((todo, i) => (
                  <div key={i} className="flex items-center justify-between border border-gray-200 rounded p-2">
                    <span className="text-sm text-black">
                      {todo.done ? '[x]' : '[ ]'} {todo.text}
                      {todo.date && ` (${todo.date})`}
                    </span>
                    <button
                      onClick={() => showToast('Prompt fuer: ' + todo.text)}
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                    >
                      &rarr; Prompt
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJEKT-INFO */}
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black mb-2 pb-2 border-b border-gray-200">PROJEKT-INFO</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}
