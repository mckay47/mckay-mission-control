import { useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SectionLabel } from '../ui/SectionLabel';
import { ActionButton } from '../ui/ActionButton';

interface StructuredOutput {
  bullets: string[];
  todos: string[];
}

function structureThought(raw: string): StructuredOutput {
  const sentences = raw.split(/[.!?\n]+/).map((s) => s.trim()).filter(Boolean);
  const bullets = sentences.slice(0, Math.max(3, sentences.length));
  const todos = bullets.slice(0, 3).map((b) => `TODO: ${b}`);
  return { bullets, todos };
}

export function ThinkTank() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<StructuredOutput | null>(null);
  const [todosGenerated, setTodosGenerated] = useState(false);

  const handleStructure = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setResult(null);
    setTodosGenerated(false);

    setTimeout(() => {
      const structured = structureThought(input);
      setResult(structured);
      setIsProcessing(false);
    }, 1000);
  };

  const handleGenerateTodos = () => {
    setTodosGenerated(true);
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setIsProcessing(false);
    setTodosGenerated(false);
  };

  return (
    <GlassCard elevated scan className="animate-fade-in">
      <SectionLabel number="02" title="THINK TANK" />

      {!result && !isProcessing && (
        <div className="space-y-4 stagger-1 animate-fade-in">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Was hast du heute im Kopf?"
            rows={5}
            className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/40 transition-colors resize-none"
          />
          <ActionButton
            label="Strukturieren"
            icon={<Brain className="w-4 h-4" />}
            onClick={handleStructure}
            disabled={!input.trim()}
          />
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center gap-3 py-12 animate-fade-in">
          <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
          <span className="text-sm text-text-secondary">Analysiere...</span>
        </div>
      )}

      {result && !isProcessing && (
        <div className="space-y-4 animate-fade-in">
          {/* Structured bullets */}
          <div className="space-y-2">
            <span className="hud-label">Strukturiert</span>
            <div className="space-y-1.5 mt-2">
              {result.bullets.map((bullet, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 text-sm text-text-secondary stagger-${Math.min(i + 1, 7)} animate-fade-in`}
                >
                  <span className="text-neon-cyan mt-0.5">--</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Todos */}
          {!todosGenerated && (
            <ActionButton
              label="Todos generieren"
              variant="secondary"
              onClick={handleGenerateTodos}
              className="stagger-5 animate-fade-in"
            />
          )}

          {todosGenerated && (
            <div className="space-y-2 stagger-6 animate-fade-in">
              <span className="hud-label">Generierte Todos</span>
              <div className="space-y-1.5 mt-2">
                {result.todos.map((todo, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-text-primary"
                  >
                    <span className="w-4 h-4 rounded border border-neon-cyan/30 flex-shrink-0" />
                    <span>{todo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Nochmal
          </button>
        </div>
      )}
    </GlassCard>
  );
}
