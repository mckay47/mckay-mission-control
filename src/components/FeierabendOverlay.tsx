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
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
        <div className="glass-elevated rounded-2xl p-8 max-w-lg w-full mx-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,45,85,0.15)' }}>
              <Power size={20} className="text-[#FF2D55]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#E0E6F0]">Feierabend?</h2>
              <p className="text-sm text-[#7B8DB5]">{todayStr}</p>
            </div>
          </div>

          {/* Summary before shutdown */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Clock size={14} className="text-[#4A5A7A]" />
              <span className="text-[#7B8DB5]">
                {openTodos.length} Todos offen
                {highPriority.length > 0 && (
                  <span className="text-[#FF2D55] font-medium"> ({highPriority.length} hoch)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle size={14} className="text-[#4A5A7A]" />
              <span className="text-[#7B8DB5]">
                {projects.filter((p) => p.status === 'building').length} Projekte in Arbeit
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Coffee size={14} className="text-[#4A5A7A]" />
              <span className="text-[#7B8DB5]">KANI speichert den Session-State automatisch</span>
            </div>
          </div>

          {highPriority.length > 0 && (
            <div className="rounded-lg p-3 mb-6" style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.2)' }}>
              <p className="text-xs font-bold text-[#FF2D55] mb-1">Offene High-Priority:</p>
              {highPriority.slice(0, 3).map((t) => (
                <p key={t.id} className="text-xs text-[#FF2D55]/80">- {t.text}</p>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="cell-btn px-5 py-2.5 text-sm font-medium"
            >
              Weiterarbeiten
            </button>
            <button
              onClick={runShutdown}
              className="px-5 py-2.5 rounded-xl cursor-pointer text-sm text-white font-medium transition-all"
              style={{ background: 'rgba(255,45,85,0.8)', border: '1px solid rgba(255,45,85,0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,45,85,1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,45,85,0.8)'; }}
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
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="glass-elevated rounded-2xl p-8 max-w-lg w-full mx-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#FF2D55] animate-pulse" />
            <h2 className="text-sm font-bold text-[#00F0FF] tracking-wide font-mono uppercase" style={{ letterSpacing: '0.12em' }}>
              SHUTDOWN SEQUENCE
            </h2>
          </div>
          <div className="font-mono text-xs space-y-1.5">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  line.status === 'pending' ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {line.status === 'done' && <span className="text-[#00FF88]">[OK]</span>}
                {line.status === 'running' && <span className="text-[#FFD600]">[..]</span>}
                {line.status === 'pending' && <span className="text-[#4A5A7A]">[  ]</span>}
                <span className={
                  line.status === 'done'
                    ? 'text-[#7B8DB5]'
                    : line.status === 'running'
                      ? 'text-[#E0E6F0] font-medium'
                      : 'text-[#4A5A7A]'
                }>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="text-center">
        <p className="text-2xl font-bold text-[#00F0FF] text-glow-cyan">
          Schoenen Feierabend, Mehti.
        </p>
        <button
          onClick={onClose}
          className="mt-6 cell-btn px-6 py-2.5 text-sm font-medium"
        >
          Zurueck zum Cockpit
        </button>
      </div>
    </div>
  );
}
