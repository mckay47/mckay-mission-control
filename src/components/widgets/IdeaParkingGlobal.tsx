import { useState } from 'react';
import { Lightbulb, Plus, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface GlobalIdea {
  id: string;
  text: string;
  createdAt: string;
}

const initialIdeas: GlobalIdea[] = [
  { id: '1', text: 'Voice AI fuer Hebammen-Onboarding', createdAt: '2026-03-28' },
  { id: '2', text: 'WhatsApp Bot fuer Terminerinnerungen', createdAt: '2026-03-27' },
  { id: '3', text: 'KI-gestuetzte Rechnungserkennung', createdAt: '2026-03-26' },
];

export function IdeaParkingGlobal() {
  const [ideas, setIdeas] = useState<GlobalIdea[]>(initialIdeas);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newIdea: GlobalIdea = {
      id: `global-idea-${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIdeas((prev) => [newIdea, ...prev]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <GlassCard elevated>
      <div className="flex items-center gap-2.5 mb-4">
        <Lightbulb className="w-5 h-5 text-neon-orange" />
        <h3 className="text-base font-semibold text-text-primary">Neue Idee aufnehmen</h3>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {ideas.length} geparkt
        </span>
      </div>

      {/* Prominent input area */}
      <div className="mb-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Beschreibe deine Idee freestyle... Was ist das Problem? Wer braucht es? Was macht es besonders?"
          rows={5}
          className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-orange/40 focus:bg-white/[0.05] transition-all resize-none leading-relaxed"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="mt-3 w-full vision-btn px-6 py-3 flex items-center justify-center gap-2.5 text-sm font-medium text-neon-orange disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Idee aufnehmen
        </button>
      </div>

      {/* Saved ideas */}
      {ideas.length > 0 && (
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-2">
            Zuletzt geparkt
          </span>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-orange/20 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-neon-orange/50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary truncate">{idea.text}</p>
                  <span className="text-[10px] text-text-muted tabular-nums">{idea.createdAt}</span>
                </div>
                <button
                  onClick={() => handleRemove(idea.id)}
                  className="p-1 rounded text-text-muted hover:text-status-critical hover:bg-status-critical/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Entfernen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
