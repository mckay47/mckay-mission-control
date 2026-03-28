import { useState, useEffect } from 'react';
import { Rocket, Loader2, Check, X, PenLine } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

type Step = 'input' | 'processing' | 'result';

interface ProcessingPhase {
  label: string;
  done: boolean;
}

const dummyBrief = {
  name: 'Gastro Suite',
  concept:
    'All-in-one restaurant management platform. Digital menu, reservations, order management, staff scheduling, review aggregation. Multi-tenant, per-restaurant pricing.',
  pricing: 'Setup: 990 EUR | Monthly: 49 EUR/seat | Enterprise: custom',
  stack: 'React + Vite, Supabase, Vercel, Stripe Connect, Google Maps API',
  timeline: 'Phase 0 (Mockup): 2 weeks | Phase 1 (MVP): 6 weeks | Phase 2 (Launch): 4 weeks',
  marketSize: '~72,000 restaurants in Germany with digital potential',
};

export function LaunchWizard() {
  const [step, setStep] = useState<Step>('input');
  const [idea, setIdea] = useState('');
  const [phases, setPhases] = useState<ProcessingPhase[]>([]);

  const handleLaunch = () => {
    if (!idea.trim()) return;
    setStep('processing');
    setPhases([
      { label: 'Research lauft...', done: false },
      { label: 'Strategy lauft...', done: false },
      { label: 'Brief wird erstellt...', done: false },
    ]);
  };

  useEffect(() => {
    if (step !== 'processing') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1 complete
    timers.push(
      setTimeout(() => {
        setPhases((prev) =>
          prev.map((p, i) => (i === 0 ? { ...p, done: true } : p))
        );
      }, 800)
    );

    // Phase 2 complete
    timers.push(
      setTimeout(() => {
        setPhases((prev) =>
          prev.map((p, i) => (i <= 1 ? { ...p, done: true } : p))
        );
      }, 1400)
    );

    // Phase 3 complete + show result
    timers.push(
      setTimeout(() => {
        setPhases((prev) => prev.map((p) => ({ ...p, done: true })));
      }, 1800)
    );

    timers.push(
      setTimeout(() => {
        setStep('result');
      }, 2200)
    );

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleReset = () => {
    setStep('input');
    setIdea('');
    setPhases([]);
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <Rocket className="w-5 h-5 text-neon-pink" />
        <h2 className="text-base font-semibold text-text-primary">Launch Wizard</h2>
        {step !== 'input' && (
          <button
            onClick={handleReset}
            className="ml-auto text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Zuruck
          </button>
        )}
      </div>

      {/* Step 1: Input */}
      {step === 'input' && (
        <div className="space-y-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Beschreibe deine Idee..."
            rows={5}
            className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-pink/40 transition-colors resize-none"
          />
          <button
            onClick={handleLaunch}
            disabled={!idea.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-neon-pink hover:bg-neon-pink/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Rocket className="w-4 h-4" />
            Launch starten
          </button>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 'processing' && (
        <div className="space-y-4 py-6">
          {phases.map((phase, i) => (
            <div key={i} className="flex items-center gap-3">
              {phase.done ? (
                <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-neon-cyan animate-spin flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  phase.done ? 'text-text-primary' : 'text-neon-cyan'
                }`}
              >
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Result / Brief */}
      {step === 'result' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-neon-green/20 space-y-3">
            <h3 className="text-lg font-semibold text-neon-green">{dummyBrief.name}</h3>

            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Konzept</span>
              <p className="text-sm text-text-secondary mt-1">{dummyBrief.concept}</p>
            </div>

            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Pricing</span>
              <p className="text-sm text-text-secondary mt-1">{dummyBrief.pricing}</p>
            </div>

            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Tech Stack</span>
              <p className="text-sm text-text-secondary mt-1">{dummyBrief.stack}</p>
            </div>

            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Timeline</span>
              <p className="text-sm text-text-secondary mt-1">{dummyBrief.timeline}</p>
            </div>

            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Market Size</span>
              <p className="text-sm text-text-secondary mt-1">{dummyBrief.marketSize}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 transition-all"
            >
              <Check className="w-4 h-4" />
              Bestatigen
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-text-primary transition-all"
            >
              <PenLine className="w-4 h-4" />
              Anpassen
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-status-critical/10 border border-status-critical/20 text-status-critical hover:bg-status-critical/20 transition-all ml-auto"
            >
              <X className="w-4 h-4" />
              Ablehnen
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
