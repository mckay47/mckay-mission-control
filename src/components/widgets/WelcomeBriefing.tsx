import { Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { RadialGauge } from '../ui/RadialGauge';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionLabel } from '../ui/SectionLabel';
import { useClock } from '../../hooks/useClock';
import { projects } from '../../data/dummy';
import { PRODUCT_STEPS } from '../../data/types';

function getStepLabel(step: number): string {
  return PRODUCT_STEPS[step - 1] ?? 'Unbekannt';
}

const recommendations = [
  'Hebammenbuero Mockup finalisieren und Validation mit 2-3 Hebammen starten',
  'Stillprobleme.de Phase 0 abschliessen — Marktpotenzial validieren',
  'TennisCoach Pro Phase 4/5 planen: Stripe, Chat, Matching',
];

export function WelcomeBriefing() {
  const { date } = useClock();

  const totalCost = projects.reduce((sum, p) => sum + p.monthlyCost, 0);
  const pipelineCount = 5;

  return (
    <GlassCard elevated className="animate-fade-in">
      {/* Welcome */}
      <h1 className="text-3xl font-light text-text-primary text-glow-cyan mb-1 stagger-1 animate-fade-in">
        Willkommen zurueck, Mehti.
      </h1>
      <p className="text-sm text-text-muted mb-6 stagger-2 animate-fade-in">{date}</p>

      <SectionLabel number="01" title="BRIEFING" className="stagger-3 animate-fade-in" />

      {/* Mini Gauges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center stagger-3 animate-fade-in">
          <RadialGauge value={30} label="Projekte" size={80} color="cyan" />
          <span className="text-xs text-text-secondary mt-1 tabular-nums">3 / 10</span>
        </div>
        <div className="flex flex-col items-center stagger-4 animate-fade-in">
          <RadialGauge value={75} label="Tokens" size={80} color="green" />
          <span className="text-xs text-text-secondary mt-1 tabular-nums">175K</span>
        </div>
        <div className="flex flex-col items-center stagger-5 animate-fade-in">
          <RadialGauge value={53} label="Kosten" size={80} color="orange" />
          <span className="text-xs text-text-secondary mt-1 tabular-nums">{totalCost.toFixed(2).replace('.', ',')} EUR</span>
        </div>
        <div className="flex flex-col items-center stagger-6 animate-fade-in">
          <RadialGauge value={25} label="Ideen" size={80} color="purple" />
          <span className="text-xs text-text-secondary mt-1 tabular-nums">{pipelineCount} / 20</span>
        </div>
      </div>

      {/* Projects Status */}
      <div className="space-y-4 mb-8">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className={`p-4 rounded-xl bg-white/[0.02] border border-white/5 stagger-${Math.min(i + 4, 7)} animate-fade-in`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-text-primary">{project.name}</h3>
              <span className="text-xs tabular-nums font-medium text-neon-cyan">
                {project.progressPercent}%
              </span>
            </div>
            <ProgressBar value={project.progressPercent} color="cyan" height="sm" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-text-muted">
                Schritt {project.currentStep}: {getStepLabel(project.currentStep)}
              </span>
              <span className="text-[11px] text-text-muted">
                {project.phase}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="stagger-7 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-neon-orange" />
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            Empfehlung fuer heute
          </span>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-sm text-text-secondary"
            >
              <span className="text-neon-cyan tabular-nums text-xs mt-0.5">{i + 1}.</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
