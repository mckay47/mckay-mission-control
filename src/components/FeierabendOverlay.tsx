import { useState, useEffect, useCallback } from 'react';
import { Power, CheckCircle, Clock, Coffee } from 'lucide-react';
import { projects, initialTodos } from '../data/dummy';

interface FeierabendOverlayProps {
  onClose: () => void;
}

interface ShutdownLine {
  text: string;
  status: 'pending' | 'running' | 'done';
}

const todayStr = new Date().toLocaleDateString('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function buildShutdownLines(): ShutdownLine[] {
  const openTodos = initialTodos.filter((t) => !t.done);
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'building').length;

  return [
    { text: 'Feierabend-Sequenz gestartet...', status: 'pending' },
    { text: `Tages-Zusammenfassung: ${todayStr}`, status: 'pending' },
    { text: `Projekte aktiv: ${activeProjects}/${totalProjects}`, status: 'pending' },
    { text: `Offene Todos: ${openTodos.length}`, status: 'pending' },
    { text: 'Session-State gespeichert', status: 'pending' },
    { text: 'MEMORY.md aktualisiert', status: 'pending' },
    { text: 'Agents heruntergefahren', status: 'pending' },
    { text: 'MCP-Verbindungen geschlossen', status: 'pending' },
    { text: 'System bereit fuer Ruhemodus', status: 'pending' },
    { text: 'Schoenen Feierabend, Mehti.', status: 'pending' },
  ];
}

export function FeierabendOverlay({ onClose }: FeierabendOverlayProps) {
  const [phase, setPhase] = useState<'confirm' | 'shutdown' | 'done'>('confirm');
  const [lines, setLines] = useState<ShutdownLine[]>(buildShutdownLines);
  const [currentLine, setCurrentLine] = useState(0);

  const runShutdown = useCallback(() => {
    setPhase('shutdown');
    setCurrentLine(0);
  }, []);

  useEffect(() => {
    if (phase !== 'shutdown') return;
    if (currentLine >= lines.length) {
      const timer = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(timer);
    }

    // Mark current as running
    setLines((prev) =>
      prev.map((l, i) => (i === currentLine ? { ...l, status: 'running' } : l))
    );

    // After delay, mark done and advance
    const delay = currentLine === lines.length - 1 ? 800 : 250 + Math.random() * 200;
    const timer = setTimeout(() => {
      setLines((prev) =>
        prev.map((l, i) => (i === currentLine ? { ...l, status: 'done' } : l))
      );
      setCurrentLine((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [phase, currentLine, lines.length]);

  // Confirm phase
  if (phase === 'confirm') {
    const openTodos = initialTodos.filter((t) => !t.done);
    const highPriority = openTodos.filter((t) => t.priority === 'high');

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Power size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">Feierabend?</h2>
              <p className="text-sm text-gray-500">{todayStr}</p>
            </div>
          </div>

          {/* Summary before shutdown */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span className="text-gray-600">
                {openTodos.length} Todos offen
                {highPriority.length > 0 && (
                  <span className="text-red-600 font-medium"> ({highPriority.length} hoch)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle size={14} className="text-gray-400" />
              <span className="text-gray-600">
                {projects.filter((p) => p.status === 'building').length} Projekte in Arbeit
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Coffee size={14} className="text-gray-400" />
              <span className="text-gray-600">KANI speichert den Session-State automatisch</span>
            </div>
          </div>

          {highPriority.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-xs font-bold text-red-700 mb-1">Offene High-Priority:</p>
              {highPriority.slice(0, 3).map((t) => (
                <p key={t.id} className="text-xs text-red-600">- {t.text}</p>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg border border-gray-300 cursor-pointer text-sm text-black font-medium"
            >
              Weiterarbeiten
            </button>
            <button
              onClick={runShutdown}
              className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg cursor-pointer text-sm text-white font-medium transition-colors"
            >
              Feierabend starten
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Shutdown sequence
  if (phase === 'shutdown') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-bold text-black tracking-wide">SHUTDOWN SEQUENCE</h2>
          </div>
          <div className="font-mono text-xs space-y-1.5">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  line.status === 'pending' ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {line.status === 'done' && <span className="text-green-600">[OK]</span>}
                {line.status === 'running' && <span className="text-yellow-600">[..]</span>}
                {line.status === 'pending' && <span className="text-gray-400">[  ]</span>}
                <span className={line.status === 'done' ? 'text-gray-700' : line.status === 'running' ? 'text-black font-medium' : 'text-gray-400'}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Done phase
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="text-center">
        <p className="text-2xl font-bold text-black bg-white rounded-xl px-10 py-8 shadow-2xl border border-gray-200">
          Schoenen Feierabend, Mehti.
        </p>
        <button
          onClick={onClose}
          className="mt-6 bg-white hover:bg-gray-100 px-6 py-2.5 rounded-lg border border-gray-300 cursor-pointer text-sm text-gray-600 font-medium transition-colors"
        >
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}
