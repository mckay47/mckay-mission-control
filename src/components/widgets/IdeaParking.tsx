import { useState } from 'react';
import { Lightbulb, Plus, ArrowRight, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SectionLabel } from '../ui/SectionLabel';

interface ParkedIdea {
  id: string;
  text: string;
}

interface IdeaParkingProps {
  onSendPrompt?: (text: string) => void;
  onCreateTodo?: (text: string) => void;
}

const initialIdeas: ParkedIdea[] = [
  { id: '1', text: 'Onboarding Wizard mit 6 Steps' },
  { id: '2', text: 'PDF Export fuer Rechnungen' },
  { id: '3', text: 'WhatsApp Benachrichtigungen' },
];

export function IdeaParking({ onSendPrompt, onCreateTodo }: IdeaParkingProps) {
  const [ideas, setIdeas] = useState<ParkedIdea[]>(initialIdeas);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newIdea: ParkedIdea = {
      id: `idea-${Date.now()}`,
      text: trimmed,
    };

    setIdeas((prev) => [newIdea, ...prev]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <SectionLabel number="03" title="IDEA PARKING" />
      <GlassCard>
        <div className="flex items-center gap-2.5 mb-4">
          <Lightbulb className="w-5 h-5 text-neon-orange" />
          <h3 className="text-sm font-semibold text-text-secondary">
            Ideen <span className="text-text-muted">({ideas.length})</span>
          </h3>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Neue Idee fuer dieses Projekt..."
            className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-orange/40 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-neon-orange/10 border border-neon-orange/20 text-neon-orange hover:bg-neon-orange/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Ideas list */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="group flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-neon-orange/20 transition-colors"
            >
              <p className="text-sm text-text-secondary flex-1 truncate">{idea.text}</p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onSendPrompt && (
                  <button
                    onClick={() => onSendPrompt(idea.text)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 transition-all"
                    title="Als Prompt senden"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Prompt
                  </button>
                )}
                {onCreateTodo && (
                  <button
                    onClick={() => onCreateTodo(idea.text)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 transition-all"
                    title="Als Todo erstellen"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Todo
                  </button>
                )}
                <button
                  onClick={() => handleRemove(idea.id)}
                  className="p-1 rounded text-text-muted hover:text-status-critical hover:bg-status-critical/10 transition-colors"
                  title="Entfernen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {ideas.length === 0 && (
            <p className="text-sm text-text-muted text-center py-4">Keine geparkten Ideen</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
