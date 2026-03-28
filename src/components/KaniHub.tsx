import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { useClock } from '../hooks/useClock';

export type HubMode = 'boot' | 'chat' | 'fullscreen';
export type ChatContext = 'welcome' | 'briefing' | 'idea' | 'navigate' | 'idle';

interface KaniMessage {
  id: string;
  text: string;
  isKani: boolean;
  typing?: boolean;
}

interface KaniHubProps {
  mode: HubMode;
  onModeChange: (mode: HubMode) => void;
  onNavigate: (path: string) => void;
  context: ChatContext;
  onContextChange: (ctx: ChatContext) => void;
  children?: React.ReactNode; // Floating panels rendered around the hub
}

const BOOT_LINES = [
  { text: 'Systeme initialisiert...', delay: 0 },
  { text: 'Skills: 16 aktiv · Agents: 8 online · MCP: 5 verbunden', delay: 600 },
];

const WELCOME_MESSAGE = `Willkommen zurück, Mehti.

Gestern haben wir am Mission Control Dashboard gearbeitet und stillprobleme.de gestartet. Guter Tag.

Du hast 6 offene Todos und 3 aktive Projekte. Was möchtest du als erstes tun?`;

const BRIEFING_MESSAGE = `Aktuell haben wir 3 aktive Projekte von 4 insgesamt.

**Hebammenbuero** — 65% Fortschritt, Phase 0 Mockup-Review. Nächster Schritt: Validation mit echten Hebammen.

**Stillprobleme.de** — 25% Fortschritt, Mockup wird gebaut. Frisch gestartet, läuft seit einem Tag.

**TennisCoach Pro** — 80% Fortschritt, Phase 1 Testing. Auth funktioniert, Stripe und Chat stehen noch aus.

**findemeinehebamme.de** ist live und stabil — ~100 Vermittlungen in 10 Wochen.

175K Tokens verbraucht, Monatskosten bei €52,70. Alles im grünen Bereich.

Welches Projekt möchtest du dir ansehen?`;

const IDEA_MESSAGE = `Erzähl mir von deiner Idee — einfach drauf los. Ich strukturiere das danach für dich.`;

const IDEA_STRUCTURED = `Ich habe deine Idee strukturiert:

**Konzept:** [Deine Idee wird hier zusammengefasst]
**Typ:** Industry SaaS
**Zielgruppe:** [Wird identifiziert]
**Business Model:** Setup Fee + Monthly Per-Seat

Soll ich die Idee parken oder direkt als Projekt anlegen?`;

export function KaniHub({ mode, onModeChange, onNavigate, context, onContextChange, children }: KaniHubProps) {
  const { time, date } = useClock();
  const [messages, setMessages] = useState<KaniMessage[]>([]);
  const [input, setInput] = useState('');
  const [bootDone, setBootDone] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Boot sequence
  useEffect(() => {
    if (mode !== 'boot') return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, { id: `boot-${i}`, text: line.text, isKani: true }]);
      }, line.delay));
    });

    timers.push(setTimeout(() => {
      setBootDone(true);
      addKaniMessage(WELCOME_MESSAGE);
      onContextChange('welcome');
    }, 1500));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const addKaniMessage = useCallback((text: string) => {
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `kani-${Date.now()}`, text, isKani: true }]);
      setTyping(false);
    }, 800);
  }, []);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: `user-${Date.now()}`, text, isKani: false }]);
    setInput('');

    // Handle responses based on context
    if (context === 'welcome' || context === 'idle') {
      const lower = text.toLowerCase();
      if (lower.includes('brief') || lower.includes('übersicht') || lower.includes('status')) {
        onContextChange('briefing');
        addKaniMessage(BRIEFING_MESSAGE);
      } else if (lower.includes('idee') || lower.includes('neu')) {
        onContextChange('idea');
        addKaniMessage(IDEA_MESSAGE);
      } else if (lower.includes('hebammen')) {
        addKaniMessage('Okay, ich öffne Hebammenbuero für dich.');
        setTimeout(() => {
          onModeChange('fullscreen');
          onNavigate('/project/hebammenbuero');
        }, 1200);
      } else if (lower.includes('still') || lower.includes('problem')) {
        addKaniMessage('Okay, ich öffne Stillprobleme.de für dich.');
        setTimeout(() => {
          onModeChange('fullscreen');
          onNavigate('/project/stillprobleme');
        }, 1200);
      } else if (lower.includes('tennis')) {
        addKaniMessage('Okay, ich öffne TennisCoach Pro für dich.');
        setTimeout(() => {
          onModeChange('fullscreen');
          onNavigate('/project/tenniscoach-pro');
        }, 1200);
      } else if (lower.includes('system') || lower.includes('skill') || lower.includes('agent')) {
        addKaniMessage('Okay, ich öffne die Systemübersicht.');
        setTimeout(() => {
          onModeChange('fullscreen');
          onNavigate('/system');
        }, 1200);
      } else {
        addKaniMessage('Verstanden. Kann ich dir bei einem bestimmten Projekt helfen, oder möchtest du das Briefing sehen?');
      }
    } else if (context === 'briefing') {
      onContextChange('navigate');
      addKaniMessage('Welches Projekt möchtest du öffnen? Oder sag mir einfach was du vorhast.');
    } else if (context === 'idea') {
      // User just pitched an idea
      addKaniMessage(IDEA_STRUCTURED);
      onContextChange('idle');
    } else {
      addKaniMessage('Verstanden. Was möchtest du als nächstes tun?');
      onContextChange('idle');
    }
  }, [input, context, addKaniMessage, onContextChange, onModeChange, onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'briefing':
        onContextChange('briefing');
        setMessages(prev => [...prev, { id: `user-${Date.now()}`, text: 'Zeig mir das Briefing', isKani: false }]);
        addKaniMessage(BRIEFING_MESSAGE);
        break;
      case 'idea':
        onContextChange('idea');
        setMessages(prev => [...prev, { id: `user-${Date.now()}`, text: 'Ich hab eine neue Idee', isKani: false }]);
        addKaniMessage(IDEA_MESSAGE);
        break;
      case 'continue':
        addKaniMessage('Okay, welches Projekt soll ich öffnen?');
        onContextChange('navigate');
        break;
      case 'status':
        onModeChange('fullscreen');
        onNavigate('/system');
        break;
    }
  }, [addKaniMessage, onContextChange, onModeChange, onNavigate]);

  // Return to chat from fullscreen
  const handleReturnToChat = useCallback(() => {
    onModeChange('chat');
    addKaniMessage('Wieder da. Was möchtest du als nächstes tun?');
    onContextChange('idle');
  }, [onModeChange, addKaniMessage, onContextChange]);

  // Fullscreen mode: just show the back button overlay
  if (mode === 'fullscreen') {
    return (
      <button
        onClick={handleReturnToChat}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 vision-btn px-6 py-3 flex items-center gap-2 text-sm text-text-primary hover:text-neon-cyan transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Zurück zu KANI</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 boot-backdrop" />

      {/* Decorative glow */}
      <div className="boot-glow-bg" style={{ top: '25%', left: '50%', marginLeft: '-200px', marginTop: '-200px' }} />

      {/* Floating panels around the chat */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>

      {/* Central chat area */}
      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col" style={{ maxHeight: '80vh' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-xs font-mono text-neon-cyan/60 tracking-[0.3em] mb-1">
            MCKAY MISSION CONTROL
          </div>
          <div className="text-xs text-text-muted font-mono">
            {date} · {time}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[200px] max-h-[50vh] px-2">
          {messages.map(msg => (
            <div key={msg.id} className={`animate-fade-in ${msg.isKani ? 'text-center' : 'text-center'}`}>
              {msg.isKani ? (
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line max-w-lg mx-auto">
                  {msg.text}
                </div>
              ) : (
                <div className="inline-block glass rounded-2xl px-4 py-2 text-sm text-neon-cyan max-w-md">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="text-center animate-fade-in">
              <span className="text-sm text-text-muted">
                <span className="animate-pulse-glow">●</span>
                <span className="animate-pulse-glow" style={{ animationDelay: '0.2s' }}> ●</span>
                <span className="animate-pulse-glow" style={{ animationDelay: '0.4s' }}> ●</span>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick action buttons (shown in welcome/idle context) */}
        {bootDone && (context === 'welcome' || context === 'navigate' || context === 'idle') && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {context === 'welcome' && (
              <>
                <button onClick={() => handleQuickAction('briefing')} className="vision-btn px-4 py-3 text-left">
                  <div className="text-xs font-semibold text-text-primary">Daily Briefing</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Projekt-Status und KPIs</div>
                </button>
                <button onClick={() => handleQuickAction('continue')} className="vision-btn px-4 py-3 text-left">
                  <div className="text-xs font-semibold text-text-primary">Weiter arbeiten</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Projekt öffnen</div>
                </button>
                <button onClick={() => handleQuickAction('idea')} className="vision-btn px-4 py-3 text-left">
                  <div className="text-xs font-semibold text-text-primary">Neue Idee</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Idee aufnehmen und parken</div>
                </button>
                <button onClick={() => handleQuickAction('status')} className="vision-btn px-4 py-3 text-left">
                  <div className="text-xs font-semibold text-text-primary">System Check</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Skills, Agents, Server</div>
                </button>
              </>
            )}
            {context === 'navigate' && (
              <>
                {['hebammenbuero', 'stillprobleme', 'tenniscoach-pro'].map(id => (
                  <button
                    key={id}
                    onClick={() => {
                      onModeChange('fullscreen');
                      onNavigate(`/project/${id}`);
                    }}
                    className="vision-btn px-4 py-3 text-left"
                  >
                    <div className="text-xs font-semibold text-text-primary">
                      {id === 'hebammenbuero' ? 'Hebammenbuero' : id === 'stillprobleme' ? 'Stillprobleme.de' : 'TennisCoach Pro'}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => { onModeChange('fullscreen'); onNavigate('/'); }}
                  className="vision-btn px-4 py-3 text-left"
                >
                  <div className="text-xs font-semibold text-text-primary">Command Center</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Alle Projekte und KPIs</div>
                </button>
              </>
            )}
          </div>
        )}

        {/* Input area */}
        {bootDone && (
          <div className="glass-elevated rounded-2xl p-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={context === 'idea' ? 'Erzähl mir von deiner Idee...' : 'Schreib KANI...'}
              rows={2}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none outline-none font-sans"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-xl text-neon-cyan hover:bg-white/5 transition-colors disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
