import { useState, useCallback, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';

interface ChatMsg {
  id: string;
  text: string;
  isKani: boolean;
  time: string;
}

const INITIAL_MESSAGES: ChatMsg[] = [
  { id: '1', isKani: true, text: 'Hey Mehti, ich bin bereit. Was soll ich für dich tun?', time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) },
];

const RESPONSES = [
  'Verstanden, ich kümmere mich darum.',
  'Gute Idee. Soll ich dazu einen Plan erstellen?',
  'Ich schaue mir das an. Einen Moment.',
  'Alles klar. Ich habe das notiert.',
  'Interessant. Lass mich das recherchieren.',
];

export function KaniPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, text: input, isKani: false, time: now }]);
    setInput('');

    setTimeout(() => {
      const resp = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      setMessages(prev => [...prev, {
        id: `k-${Date.now()}`,
        text: resp,
        isKani: true,
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 800);
  }, [input]);

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 vision-btn p-4 rounded-full animate-pulse-ring"
          title="KANI öffnen"
        >
          <MessageSquare className="w-5 h-5 text-neon-cyan" />
        </button>
      )}

      {/* Side panel */}
      {isOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-[380px] z-50 glass-elevated border-l border-white/6 flex flex-col animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
              <span className="text-sm font-semibold text-text-primary">KANI</span>
              <span className="text-[10px] text-text-muted font-mono">ONLINE</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isKani ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  msg.isKani
                    ? 'glass text-text-secondary'
                    : 'bg-neon-cyan/10 border border-neon-cyan/20 text-text-primary'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] text-text-muted mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/6">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Schreib KANI..."
                rows={2}
                className="flex-1 bg-white/3 border border-white/6 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none outline-none focus:border-neon-cyan/30 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
