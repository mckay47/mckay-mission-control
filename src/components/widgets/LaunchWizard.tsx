import { useState } from 'react';
import { Rocket, Check, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SectionLabel } from '../ui/SectionLabel';
import { ActionButton } from '../ui/ActionButton';

type WizardState = 'idle' | 'analyzing' | 'done';

export function LaunchWizard() {
  const [idea, setIdea] = useState('');
  const [state, setState] = useState<WizardState>('idle');

  const handleLaunch = () => {
    if (!idea.trim()) return;
    setState('analyzing');

    setTimeout(() => {
      setState('done');
    }, 2000);
  };

  const handleReset = () => {
    setIdea('');
    setState('idle');
  };

  return (
    <GlassCard elevated className="animate-fade-in">
      <SectionLabel number="05" title="LAUNCH WIZARD" />

      {state === 'idle' && (
        <div className="space-y-4 stagger-1 animate-fade-in">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Beschreibe deine Idee freestyle..."
            rows={5}
            className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-pink/40 transition-colors resize-none"
          />
          <ActionButton
            label="Idee launchen"
            icon={<Rocket className="w-4 h-4" />}
            onClick={handleLaunch}
            disabled={!idea.trim()}
            className="w-full justify-center box-glow-cyan"
          />
        </div>
      )}

      {state === 'analyzing' && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-neon-cyan/30" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-text-secondary">Analysiere</span>
            <span className="text-neon-cyan animate-pulse">...</span>
          </div>
        </div>
      )}

      {state === 'done' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-xl bg-neon-green/5 border border-neon-green/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-5 h-5 text-neon-green" />
              <h3 className="text-base font-semibold text-neon-green">Launch vorbereitet</h3>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              Deine Idee wurde strukturiert und ist bereit fuer den naechsten Schritt.
            </p>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-left">
              <p className="text-sm text-text-primary whitespace-pre-wrap">{idea}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Neuen Launch starten
          </button>
        </div>
      )}
    </GlassCard>
  );
}
