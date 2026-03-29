import { useState, useEffect } from 'react';
import { BarChart3, Gauge, Wrench } from 'lucide-react';
import { useClock } from '../hooks/useClock';

interface BootSequenceProps {
  onComplete: (choice: 'briefing' | 'cockpit' | 'operator') => void;
}

const BOOT_LINES = [
  { text: 'Systeme initialisiert', type: 'system' as const, delay: 400 },
  { text: '16 Skills · 8 Agents · 5 MCP Server', type: 'system' as const, delay: 800 },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const { time, date } = useClock();
  const [phase, setPhase] = useState<'boot' | 'greet' | 'choose'>('boot');
  const [progress, setProgress] = useState(0);
  const [bootLines, setBootLines] = useState(0);
  const [greetVisible, setGreetVisible] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(false);

  // Boot progress
  useEffect(() => {
    if (phase !== 'boot') return;
    const i = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(i); setTimeout(() => setPhase('greet'), 200); return 100; }
        return p + 3;
      });
    }, 25);
    return () => clearInterval(i);
  }, [phase]);

  // Greet phase
  useEffect(() => {
    if (phase !== 'greet') return;
    const t1 = setTimeout(() => setBootLines(1), 200);
    const t2 = setTimeout(() => setBootLines(2), 600);
    const t3 = setTimeout(() => setGreetVisible(true), 1200);
    const t4 = setTimeout(() => { setPhase('choose'); setChoicesVisible(true); }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center boot-backdrop">
      <div className="boot-glow-bg" style={{ top: '25%', left: '50%', marginLeft: '-200px', marginTop: '-200px' }} />

      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        {/* Boot progress */}
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

        {/* Greet + Choose */}
        {(phase === 'greet' || phase === 'choose') && (
          <div className="space-y-3">
            {/* System lines */}
            {BOOT_LINES.slice(0, bootLines).map((line, i) => (
              <div key={i} className="text-xs font-mono text-text-muted animate-fade-in">{line.text}</div>
            ))}

            {/* Personal greeting */}
            {greetVisible && (
              <div className="mt-6 animate-fade-in">
                <h1 className="text-3xl font-light text-text-primary text-glow-cyan mb-2">
                  Hallo Mehti, welcome back.
                </h1>
                <p className="text-sm text-text-secondary mb-1">Legen wir los.</p>
                <p className="text-xs text-text-muted font-mono">{date} · {time}</p>
              </div>
            )}

            {/* Three choices */}
            {choicesVisible && (
              <div className="flex justify-center gap-4 mt-10">
                <button
                  onClick={() => onComplete('briefing')}
                  className="vision-btn px-8 py-5 text-center min-w-[180px] animate-fade-in stagger-1"
                >
                  <BarChart3 className="w-6 h-6 text-neon-cyan mx-auto mb-3" />
                  <div className="text-sm font-semibold text-text-primary">Briefing</div>
                  <div className="text-[10px] text-text-muted mt-1">Was war, was kommt</div>
                </button>
                <button
                  onClick={() => onComplete('cockpit')}
                  className="vision-btn px-8 py-5 text-center min-w-[180px] animate-fade-in stagger-2"
                >
                  <Gauge className="w-6 h-6 text-neon-green mx-auto mb-3" />
                  <div className="text-sm font-semibold text-text-primary">Cockpit</div>
                  <div className="text-[10px] text-text-muted mt-1">KPIs und Übersicht</div>
                </button>
                <button
                  onClick={() => onComplete('operator')}
                  className="vision-btn px-8 py-5 text-center min-w-[180px] animate-fade-in stagger-3"
                >
                  <Wrench className="w-6 h-6 text-neon-orange mx-auto mb-3" />
                  <div className="text-sm font-semibold text-text-primary">Arbeitsplatz</div>
                  <div className="text-[10px] text-text-muted mt-1">Direkt loslegen</div>
                </button>
              </div>
            )}

            {/* Skip */}
            <button
              onClick={() => onComplete('cockpit')}
              className="mt-6 text-[10px] text-text-muted hover:text-text-secondary transition-colors font-mono"
            >
              [Überspringen]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
