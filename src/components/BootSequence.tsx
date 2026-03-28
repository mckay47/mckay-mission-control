import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'MCKAY MISSION CONTROL', type: 'title' as const, delay: 0 },
  { text: 'Systeme initialisiert', type: 'system' as const, delay: 400 },
  { text: '16 Skills · 8 Agents · 5 MCP Server', type: 'system' as const, delay: 800 },
  { text: '', type: 'spacer' as const, delay: 1200 },
  { text: 'Willkommen zurück, Mehti.', type: 'greeting' as const, delay: 1400 },
  { text: 'Gestern haben wir gut gearbeitet — 3 Projekte aktiv, 6 Todos offen.', type: 'message' as const, delay: 2200 },
  { text: 'Lass uns loslegen.', type: 'message' as const, delay: 3200 },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'greet' | 'fade'>('boot');

  // Progress bar
  useEffect(() => {
    if (phase !== 'boot') return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase('greet');
          return 100;
        }
        return p + 3;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [phase]);

  // Greeting lines
  useEffect(() => {
    if (phase !== 'greet') return;
    if (visibleLines >= BOOT_LINES.length) {
      // All lines shown, wait a beat then fade out
      const timeout = setTimeout(() => setPhase('fade'), 1200);
      return () => clearTimeout(timeout);
    }
    const line = BOOT_LINES[visibleLines];
    const timeout = setTimeout(() => setVisibleLines(v => v + 1), line.delay || 200);
    return () => clearTimeout(timeout);
  }, [phase, visibleLines]);

  // Fade out and complete
  useEffect(() => {
    if (phase !== 'fade') return;
    const timeout = setTimeout(onComplete, 800);
    return () => clearTimeout(timeout);
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center boot-backdrop transition-opacity duration-700 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="boot-glow-bg" style={{ top: '30%', left: '50%', marginLeft: '-200px' }} />

      <div className="relative z-10 w-full max-w-xl px-6 text-center">
        {/* Boot phase — progress */}
        {phase === 'boot' && (
          <div className="animate-fade-in">
            <div className="text-sm font-mono text-neon-cyan text-glow-cyan tracking-[0.3em] mb-8">
              MCKAY MISSION CONTROL
            </div>
            <div className="w-48 mx-auto h-[2px] rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full"
                style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(0,240,255,0.4)', transition: 'width 0.1s' }}
              />
            </div>
            <div className="text-[10px] font-mono text-text-muted mt-3 tabular-nums">{progress}%</div>
          </div>
        )}

        {/* Greeting phase — typing lines */}
        {(phase === 'greet' || phase === 'fade') && (
          <div className="space-y-2">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
              if (line.type === 'spacer') return <div key={i} className="h-4" />;
              return (
                <div
                  key={i}
                  className={`animate-fade-in ${
                    line.type === 'title'
                      ? 'text-sm font-mono text-neon-cyan/60 tracking-[0.3em] mb-4'
                      : line.type === 'system'
                        ? 'text-xs font-mono text-text-muted'
                        : line.type === 'greeting'
                          ? 'text-2xl font-light text-text-primary text-glow-cyan mt-4'
                          : 'text-sm text-text-secondary'
                  }`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        )}

        {/* Skip */}
        {phase !== 'fade' && (
          <button
            onClick={onComplete}
            className="mt-8 text-[10px] text-text-muted hover:text-text-secondary transition-colors font-mono"
          >
            [Überspringen]
          </button>
        )}
      </div>
    </div>
  );
}
