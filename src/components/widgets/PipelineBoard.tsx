import { GitBranch } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlowBadge } from '../ui/GlowBadge';
import { ProgressBar } from '../ui/ProgressBar';
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
  // Active projects (those being built)
  const activeProjects = projects;

  // Pipeline ideas that are just ideas (step 1)
  const ideaOnly = pipelineIdeas.filter(
    (idea) => idea.stage === 'idea'
  );

  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-5">
        <GitBranch className="w-5 h-5 text-neon-orange" />
        <h2 className="text-base font-semibold text-text-primary">Produkt-Pipeline</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          10 Schritte
        </span>
      </div>

      {/* Horizontal step chain */}
      <div className="flex items-center gap-0.5 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {PRODUCT_STEPS.map((label, i) => {
          // Count how many active projects are at this step
          const atStep = activeProjects.filter((p: Project) => p.currentStep === i + 1);
          const hasItems = atStep.length > 0;

          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center min-w-[52px]">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    hasItems
                      ? 'bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                      : 'bg-white/5 border-white/10 text-text-muted'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[8px] mt-1 text-text-muted text-center leading-tight whitespace-nowrap">
                  {label}
                </span>
                {hasItems && (
                  <div className="flex gap-0.5 mt-1">
                    {atStep.map((p: Project) => (
                      <span
                        key={p.id}
                        className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
                        title={p.name}
                      />
                    ))}
                  </div>
                )}
              </div>
              {i < PRODUCT_STEPS.length - 1 && (
                <div className="w-2 h-px bg-white/10 mt-[-16px]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Active Projects */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
          Aktive Projekte
        </h3>
        <div className="space-y-2">
          {activeProjects.map((project: Project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {project.name}
                  </span>
                  <GlowBadge color="cyan" className="text-[9px] px-1.5 py-0">
                    {project.phase}
                  </GlowBadge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted whitespace-nowrap">
                    Schritt {project.currentStep}: {getStepLabel(project.currentStep)}
                  </span>
                </div>
              </div>
              <div className="w-24 flex-shrink-0">
                <ProgressBar value={project.progressPercent} color="cyan" height="sm" showLabel />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Ideas */}
      {ideaOnly.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
            Ideen (Schritt 1)
          </h3>
          <div className="space-y-2">
            {ideaOnly.map((idea) => (
              <div
                key={idea.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
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
