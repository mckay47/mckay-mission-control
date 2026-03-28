import { useState, useEffect, useCallback } from 'react';
import { Rocket, BarChart3, FileText, ArrowRight } from 'lucide-react';

interface BootSequenceProps {
  onComplete: (choice: string) => void;
}

const GREETING_LINES = [
  'Systeme werden initialisiert...',
  'Skills geladen: 16 aktiv',
  'Agents online: 8 bereit',
  'MCP Server: 5 verbunden',
  '',
  'Willkommen zurück, Mehti.',
  '',
  'Gestern haben wir den Mission Control Mockup finalisiert',
  'und stillprobleme.de gestartet. Guter Tag.',
  '',
  'Für heute stehen 6 offene Todos an.',
  'Was möchtest du als erstes tun?',
];

const CHOICES = [
  { id: 'brief', icon: BarChart3, label: 'Daily Briefing', desc: 'Übersicht aller Projekte und KPIs' },
  { id: 'continue', icon: ArrowRight, label: 'Weiter arbeiten', desc: 'Dort weitermachen wo wir aufgehört haben' },
  { id: 'idea', icon: Rocket, label: 'Neue Idee', desc: 'Eine neue Projekt-Idee aufnehmen' },
  { id: 'status', icon: FileText, label: 'Status Check', desc: 'Schneller Health-Check aller Systeme' },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<'boot' | 'typing' | 'choices'>('boot');
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  // Boot phase — progress bar
  useEffect(() => {
    if (phase !== 'boot') return;
    const interval = setInterval(() => {
      setBootProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('typing'), 300);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Typing phase — reveal lines character by character
  useEffect(() => {
    if (phase !== 'typing') return;

    if (visibleLines >= GREETING_LINES.length) {
      setTimeout(() => {
        setPhase('choices');
        setShowChoices(true);
      }, 400);
      return;
    }

    const line = GREETING_LINES[visibleLines];
    if (line === '') {
      // Empty line — just pause briefly
      const timeout = setTimeout(() => {
        setVisibleLines(v => v + 1);
        setCurrentChar(0);
      }, 200);
      return () => clearTimeout(timeout);
    }

    if (currentChar >= line.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(v => v + 1);
        setCurrentChar(0);
      }, visibleLines < 4 ? 100 : 300);
      return () => clearTimeout(timeout);
    }

    const speed = visibleLines < 4 ? 15 : 30; // System lines faster
    const timeout = setTimeout(() => setCurrentChar(c => c + 1), speed);
    return () => clearTimeout(timeout);
  }, [phase, visibleLines, currentChar]);

  const handleChoice = useCallback((id: string) => {
    onComplete(id);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center boot-backdrop">
      {/* Decorative glow */}
      <div className="boot-glow-bg" style={{ top: '30%', left: '50%', marginLeft: '-200px' }} />

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Boot phase */}
        {phase === 'boot' && (
          <div className="text-center animate-fade-in">
            <div className="text-sm font-mono text-neon-cyan text-glow-cyan tracking-[0.3em] mb-8">
              MCKAY MISSION CONTROL
            </div>
            <div className="w-64 mx-auto h-[2px] rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all duration-100"
                style={{ width: `${bootProgress}%`, boxShadow: '0 0 12px rgba(0,240,255,0.4)' }}
              />
            </div>
            <div className="text-xs font-mono text-text-muted mt-3 tabular-nums">
              {bootProgress}%
            </div>
          </div>
        )}

        {/* Typing phase */}
        {(phase === 'typing' || phase === 'choices') && (
          <div className="space-y-0">
            {GREETING_LINES.slice(0, visibleLines + (phase === 'choices' ? 0 : 1)).map((line, i) => {
              const isCurrentLine = i === visibleLines && phase === 'typing';
              const isSystem = i < 4;
              const isEmpty = line === '';

              if (isEmpty) return <div key={i} className="h-4" />;

              return (
                <div
                  key={i}
                  className={`text-center ${
                    isSystem
                      ? 'text-xs font-mono text-text-muted'
                      : i === 5
                        ? 'text-2xl font-light text-text-primary mt-2 mb-1'
                        : 'text-base text-text-secondary'
                  }`}
                >
                  {isCurrentLine ? (
                    <span>
                      {line.slice(0, currentChar)}
                      <span className="typing-cursor" />
                    </span>
                  ) : (
                    line
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Choice buttons */}
        {showChoices && (
          <div className="grid grid-cols-2 gap-4 mt-10">
            {CHOICES.map((choice, i) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className={`vision-btn p-5 text-left cursor-pointer animate-fade-in stagger-${i + 1}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <choice.icon className="w-5 h-5 text-neon-cyan" />
                  <span className="text-sm font-semibold text-text-primary">{choice.label}</span>
                </div>
                <p className="text-xs text-text-muted">{choice.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Skip hint */}
        {phase !== 'choices' && (
          <div className="text-center mt-8">
            <button
              onClick={() => onComplete('brief')}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors font-mono"
            >
              [Überspringen]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
