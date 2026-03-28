import { useState, useRef, useEffect } from 'react';
import { Terminal, Send } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { dummyChat } from '../../data/dummy';
import type { ChatMessage } from '../../data/types';

const kaniResponses = [
  'Verstanden. Ich analysiere die Anfrage und bereite den Plan vor.',
  'Erledigt. Alle Systeme laufen stabil. Soll ich weitermachen?',
  'Gute Idee. Ich starte den Prozess und melde mich mit Ergebnissen.',
  'Drei Tasks identifiziert. Ich arbeite sie der Reihe nach ab.',
  'Analyse abgeschlossen. Hier sind meine Empfehlungen...',
];

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(dummyChat);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate KANI response after 1 second
    setTimeout(() => {
      const randomResponse = kaniResponses[Math.floor(Math.random() * kaniResponses.length)];
      const kaniMessage: ChatMessage = {
        id: `kani-${Date.now()}`,
        sender: 'kani',
        text: randomResponse,
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, kaniMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <GlassCard className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
        <Terminal className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-base font-semibold text-text-primary">KANI Terminal</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs text-text-muted">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                msg.sender === 'user'
                  ? 'bg-neon-cyan/10 border border-neon-cyan/20 text-text-primary'
                  : 'bg-white/[0.03] border border-white/5 text-text-secondary'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[10px] mt-1.5 ${
                  msg.sender === 'user' ? 'text-neon-cyan/50 text-right' : 'text-text-muted'
                }`}
              >
                {msg.sender === 'kani' && (
                  <span className="text-neon-purple mr-1.5">KANI</span>
                )}
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht an KANI..."
          className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/40 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}
