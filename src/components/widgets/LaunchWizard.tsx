import { useState, useEffect, useCallback } from 'react';
import { Rocket, Check, PenLine, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { PRODUCT_STEPS } from '../../data/types';

type WizardState = 'idle' | 'running' | 'paused';

const dummyStructuredPrompt = `Projekt: Gastro Suite
Typ: Industry SaaS
Modell: Setup 990 EUR + 49 EUR/Seat/Monat

Kernmodule:
- Digitale Speisekarte mit QR-Code
- Reservierungssystem mit Warteliste
- Bestellmanagement (Tisch + Take-Away)
- Personalplanung & Schichtplan
- Bewertungs-Aggregation (Google, TripAdvisor)

Tech Stack: React + Vite, Supabase, Vercel, Stripe Connect
Zielmarkt: ~72.000 Restaurants in Deutschland`;

export function LaunchWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>('idle');
  const [idea, setIdea] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const advanceToStep = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      for (let i = 0; i < step; i++) next.add(i);
      return next;
    });
    setCurrentStep(step);
  }, []);

  // Automated progression for steps 3-9
  useEffect(() => {
    if (wizardState !== 'running' || currentStep < 3 || currentStep > 9) return;

    const timer = setTimeout(() => {
      if (currentStep < 9) {
        advanceToStep(currentStep + 1);
      } else {
        // Final step reached
        setCompletedSteps((prev) => {
          const next = new Set(prev);
          next.add(9);
          return next;
        });
        setWizardState('paused');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [wizardState, currentStep, advanceToStep]);

  const handleStart = () => {
    if (!idea.trim()) return;
    setWizardState('running');
    advanceToStep(1);
  };

  const handleApproveStructured = () => {
    advanceToStep(2);
  };

  const handleConfirm = () => {
    advanceToStep(3);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setWizardState('idle');
    setIdea('');
    setCompletedSteps(new Set());
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <Rocket className="w-5 h-5 text-neon-pink" />
        <h2 className="text-base font-semibold text-text-primary">Launch Wizard</h2>
        {wizardState !== 'idle' && (
          <button
            onClick={handleReset}
            className="ml-auto text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Zurueck
          </button>
        )}
      </div>

      {/* 10-Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {PRODUCT_STEPS.map((label, i) => {
          const isCompleted = completedSteps.has(i);
          const isCurrent = currentStep === i && wizardState !== 'idle';
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={i} className="flex items-center">
              {/* Step node */}
              <div className="flex flex-col items-center min-w-[40px]">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-neon-green/20 border-neon-green/40 text-neon-green'
                      : isCurrent
                        ? 'bg-neon-pink/20 border-neon-pink/60 text-neon-pink shadow-[0_0_12px_rgba(255,45,170,0.4)]'
                        : 'bg-white/5 border-white/10 text-text-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span
                  className={`text-[8px] mt-1 text-center leading-tight whitespace-nowrap ${
                    isCurrent ? 'text-neon-pink' : isFuture ? 'text-text-muted' : 'text-text-secondary'
                  }`}
                >
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {i < PRODUCT_STEPS.length - 1 && (
                <div
                  className={`w-3 h-px mt-[-12px] ${
                    isCompleted ? 'bg-neon-green/40' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 0: Idea Input */}
      {currentStep === 0 && wizardState === 'idle' && (
        <div className="space-y-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Beschreibe deine Idee..."
            rows={5}
            className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-pink/40 transition-colors resize-none"
          />
          <button
            onClick={handleStart}
            disabled={!idea.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-neon-pink hover:bg-neon-pink/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Rocket className="w-4 h-4" />
            Launch starten
          </button>
        </div>
      )}

      {/* Step 1: Structured Prompt */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-neon-cyan/20">
            <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2">
              Strukturierter Prompt
            </h3>
            <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
              {dummyStructuredPrompt}
            </pre>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleApproveStructured}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 transition-all"
            >
              <Check className="w-4 h-4" />
              Freigeben
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-text-primary transition-all"
            >
              <PenLine className="w-4 h-4" />
              Anpassen
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-neon-orange/20 text-center">
            <h3 className="text-lg font-semibold text-neon-orange mb-2">Freigabe</h3>
            <p className="text-sm text-text-secondary mb-4">
              Soll der Launch-Prozess gestartet werden? Alle 10 Schritte werden durchlaufen.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 transition-all"
              >
                <Check className="w-4 h-4" />
                Bestaetigen
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg bg-status-critical/10 border border-status-critical/20 text-status-critical hover:bg-status-critical/20 transition-all"
              >
                <X className="w-4 h-4" />
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps 3-9: Progress */}
      {currentStep >= 3 && (
        <div className="space-y-3 py-2">
          {PRODUCT_STEPS.slice(3).map((label, i) => {
            const stepIndex = i + 3;
            const isComplete = completedSteps.has(stepIndex);
            const isActive = currentStep === stepIndex && wizardState === 'running';

            return (
              <div key={stepIndex} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border transition-all ${
                    isComplete
                      ? 'bg-neon-green/20 border-neon-green/40 text-neon-green'
                      : isActive
                        ? 'bg-neon-pink/20 border-neon-pink/40 text-neon-pink animate-pulse'
                        : 'bg-white/5 border-white/10 text-text-muted'
                  }`}
                >
                  {isComplete ? <Check className="w-3 h-3" /> : stepIndex + 1}
                </div>
                <span
                  className={`text-sm ${
                    isComplete ? 'text-text-primary' : isActive ? 'text-neon-pink' : 'text-text-muted'
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="ml-auto text-[10px] text-neon-pink animate-pulse">
                    Laeuft...
                  </span>
                )}
                {isComplete && (
                  <Check className="ml-auto w-3.5 h-3.5 text-neon-green" />
                )}
              </div>
            );
          })}

          {wizardState === 'paused' && completedSteps.size === 10 && (
            <div className="mt-4 p-3 rounded-lg bg-neon-green/5 border border-neon-green/20 text-center">
              <p className="text-sm text-neon-green font-medium">
                Launch abgeschlossen!
              </p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Neuen Launch starten
              </button>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
