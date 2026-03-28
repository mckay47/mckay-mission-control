import { GlassCard } from '../ui/GlassCard';
import { GlowBadge } from '../ui/GlowBadge';
import { RadialGauge } from '../ui/RadialGauge';
import { SectionLabel } from '../ui/SectionLabel';
import { pipelineIdeas, projects } from '../../data/dummy';
import { PRODUCT_STEPS } from '../../data/types';
import type { Project } from '../../data/types';

const typeBadgeColor: Record<string, 'cyan' | 'green' | 'orange' | 'pink' | 'purple'> = {
  'Industry SaaS': 'cyan',
  'Marketplace': 'pink',
};

function getStepLabel(step: number): string {
  return PRODUCT_STEPS[step - 1] ?? 'Unbekannt';
}

export function PipelineBoard() {
  const activeProjects = projects;
  const parkedIdeas = pipelineIdeas.filter(
    (idea) => idea.stage === 'idea'
  );

  return (
    <GlassCard elevated className="animate-fade-in">
      <SectionLabel number="06" title="PRODUKT-PIPELINE" />

      {/* Active Projects */}
      <div className="mb-6">
        <span className="hud-label mb-3 block">Aktive Projekte</span>
        <div className="space-y-3">
          {activeProjects.map((project: Project, i: number) => (
            <div
              key={project.id}
              className={`flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 stagger-${Math.min(i + 1, 7)} animate-fade-in`}
            >
              <RadialGauge
                value={project.progressPercent}
                size={60}
                color="cyan"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {project.name}
                  </span>
                  <GlowBadge color="cyan" className="text-[9px] px-1.5 py-0">
                    {project.phase}
                  </GlowBadge>
                </div>
                <span className="text-[11px] text-text-muted">
                  Schritt {project.currentStep}: {getStepLabel(project.currentStep)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parked Ideas */}
      {parkedIdeas.length > 0 && (
        <div>
          <span className="hud-label mb-3 block">Geparkte Ideen</span>
          <div className="space-y-2">
            {parkedIdeas.map((idea, i) => (
              <div
                key={idea.id}
                className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 stagger-${Math.min(i + 4, 7)} animate-fade-in`}
              >
                <span className="text-sm text-text-primary flex-1 truncate">
                  {idea.name}
                </span>
                <GlowBadge color={typeBadgeColor[idea.type] ?? 'purple'} className="text-[9px] px-1.5 py-0">
                  {idea.type}
                </GlowBadge>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
