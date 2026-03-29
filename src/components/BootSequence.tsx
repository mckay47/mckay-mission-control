import { useState, useEffect } from 'react';
import { useClock } from '../hooks/useClock';

interface BootSequenceProps {
  onComplete: (choice: 'briefing' | 'cockpit' | 'operator') => void;
}

// SVG illustrations for each choice
function BriefingSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-20 mb-3">
      <rect x="10" y="10" width="100" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="25" x2="60" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="33" x2="50" y2="33" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="20" y1="41" x2="55" y2="41" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <rect x="70" y="20" width="30" height="20" rx="2" fill="currentColor" opacity="0.08" />
      <circle cx="85" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <rect x="70" y="45" width="12" height="15" rx="1" fill="currentColor" opacity="0.1" />
      <rect x="85" y="45" width="12" height="15" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="20" y="50" width="40" height="12" rx="2" fill="currentColor" opacity="0.06" />
    </svg>
  );
}

function CockpitSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-20 mb-3">
      <circle cx="60" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="60" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <circle cx="60" cy="40" r="3" fill="currentColor" opacity="0.4" />
      <line x1="60" y1="22" x2="60" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="52" x2="60" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="42" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="72" y1="40" x2="78" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="10" y="10" width="20" height="12" rx="2" fill="currentColor" opacity="0.08" />
      <rect x="90" y="10" width="20" height="12" rx="2" fill="currentColor" opacity="0.08" />
      <rect x="10" y="58" width="20" height="12" rx="2" fill="currentColor" opacity="0.08" />
      <rect x="90" y="58" width="20" height="12" rx="2" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

function ArbeitsplatzSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-20 mb-3">
      <rect x="15" y="35" width="90" height="3" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="20" y="10" width="22" height="25" rx="3" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.5" />
      <rect x="48" y="10" width="22" height="25" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <rect x="76" y="10" width="22" height="25" rx="3" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="31" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <circle cx="59" cy="20" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="87" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <rect x="30" y="45" width="60" height="25" rx="3" fill="currentColor" opacity="0.06" />
      <line x1="35" y1="53" x2="75" y2="53" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="35" y1="58" x2="65" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="35" y1="63" x2="70" y2="63" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

const BOOT_STEPS = [
  'Systeme werden initialisiert...',
  'Skills werden geladen... 16 aktiv',
  'Agents werden aktiviert... 8 online',
  'MCP Server verbinden... 5 verbunden',
  'Alle Systeme bereit.',
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const { time, date } = useClock();
  const [phase, setPhase] = useState<'loading' | 'steps' | 'greet' | 'choose'>('loading');
  const [progress, setProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [greetPhase, setGreetPhase] = useState(0); // 0=none, 1=hallo, 2=legen wir los
  const [showCards, setShowCards] = useState(false);

  // Loading bar — slow
  useEffect(() => {
    if (phase !== 'loading') return;
    const i = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(i); setTimeout(() => setPhase('steps'), 500); return 100; }
        return p + 1.5;
      });
    }, 40);
    return () => clearInterval(i);
  }, [phase]);

  // System steps
  useEffect(() => {
    if (phase !== 'steps') return;
    if (visibleSteps >= BOOT_STEPS.length) {
      setTimeout(() => setPhase('greet'), 800);
      return;
    }
    const t = setTimeout(() => setVisibleSteps(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [phase, visibleSteps]);

  // Greeting
  useEffect(() => {
    if (phase !== 'greet') return;
    const t1 = setTimeout(() => setGreetPhase(1), 300);
    const t2 = setTimeout(() => setGreetPhase(2), 2000);
    const t3 = setTimeout(() => { setPhase('choose'); setShowCards(true); }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center boot-backdrop">
      {/* Ambient glow */}
      <div className="boot-glow-bg" style={{ top: '20%', left: '50%', marginLeft: '-200px', marginTop: '-200px' }} />
      <div className="boot-glow-bg" style={{ top: '60%', left: '30%', marginLeft: '-200px', marginTop: '-200px', animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-3xl px-8 text-center">

        {/* Phase: Loading */}
        {phase === 'loading' && (
          <div className="animate-fade-in">
            <div className="text-base font-mono text-neon-cyan text-glow-cyan tracking-[0.4em] mb-10">
              MCKAY MISSION CONTROL
            </div>
            <div className="w-64 mx-auto h-[2px] rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00F0FF, #00FF88)',
                  boxShadow: '0 0 20px rgba(0,240,255,0.5)',
                  transition: 'width 0.1s',
                }}
              />
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-4 tabular-nums">{progress}%</div>
          </div>
        )}

        {/* Phase: System steps */}
        {phase === 'steps' && (
          <div className="space-y-2">
            <div className="text-xs font-mono text-neon-cyan/40 tracking-[0.3em] mb-6">MCKAY MISSION CONTROL</div>
            {BOOT_STEPS.slice(0, visibleSteps).map((step, i) => (
              <div key={i} className="text-xs font-mono text-text-muted animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="text-neon-green mr-2">✓</span>{step}
              </div>
            ))}
          </div>
        )}

        {/* Phase: Greeting */}
        {(phase === 'greet' || phase === 'choose') && (
          <div>
            {greetPhase >= 1 && (
              <div className="animate-fade-in mb-2">
                <h1 className="text-4xl font-light text-text-primary mb-1" style={{ textShadow: '0 0 40px rgba(0,240,255,0.3)' }}>
                  Hallo Mehti, Welcome back.
                </h1>
                <p className="text-xs text-text-muted font-mono mt-3">{date} · {time}</p>
              </div>
            )}
            {greetPhase >= 2 && (
              <div className="animate-fade-in mt-6">
                <p className="text-3xl font-light text-neon-cyan text-glow-cyan">
                  Legen wir los.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Phase: Choose — 3 SVG cards */}
        {showCards && (
          <div className="grid grid-cols-3 gap-6 mt-12">
            <button
              onClick={() => onComplete('briefing')}
              className="vision-btn p-6 text-center group animate-fade-in stagger-1 text-neon-cyan"
            >
              <BriefingSVG />
              <div className="text-sm font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">Briefing</div>
              <div className="text-[10px] text-text-muted mt-1">Was war, was kommt</div>
            </button>
            <button
              onClick={() => onComplete('cockpit')}
              className="vision-btn p-6 text-center group animate-fade-in stagger-2 text-neon-green"
            >
              <CockpitSVG />
              <div className="text-sm font-semibold text-text-primary group-hover:text-neon-green transition-colors">Cockpit</div>
              <div className="text-[10px] text-text-muted mt-1">KPIs und Monitore</div>
            </button>
            <button
              onClick={() => onComplete('operator')}
              className="vision-btn p-6 text-center group animate-fade-in stagger-3 text-neon-orange"
            >
              <ArbeitsplatzSVG />
              <div className="text-sm font-semibold text-text-primary group-hover:text-neon-orange transition-colors">Arbeitsplatz</div>
              <div className="text-[10px] text-text-muted mt-1">Projekte bearbeiten</div>
            </button>
          </div>
        )}

        {/* Skip */}
        {phase !== 'choose' && (
          <button
            onClick={() => onComplete('cockpit')}
            className="mt-10 text-[10px] text-text-muted/40 hover:text-text-muted transition-colors font-mono"
          >
            [Überspringen]
          </button>
        )}
      </div>
    </div>
  );
}
