import { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlowBadge } from '../ui/GlowBadge';
import { RadialGauge } from '../ui/RadialGauge';
import { SectionLabel } from '../ui/SectionLabel';
import { pipelineIdeasV2, projects } from '../../data/dummy';
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
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIdea((prev) => (prev === id ? null : id));
  };

  return (
    <div className="animate-fade-in">
      {/* Active Projects */}
      <div className="mb-8">
        <SectionLabel number="02" title="PRODUKT-PIPELINE" />
        <GlassCard elevated>
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
        </GlassCard>
      </div>

      {/* Pipeline Ideas V2 — 2 column grid with proper cards */}
      {pipelineIdeasV2.length > 0 && (
        <div>
          <SectionLabel number="03" title={`GEPARKTE IDEEN (${pipelineIdeasV2.length})`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pipelineIdeasV2.map((idea) => {
              const isExpanded = expandedIdea === idea.id;
              const summaryLines = idea.structuredVersion.split('\n').filter(Boolean).slice(0, 3);

              return (
                <GlassCard key={idea.id} className="flex flex-col">
                  {/* Header: Name + Type badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-text-primary">{idea.name}</h3>
                    <GlowBadge color={typeBadgeColor[idea.type] ?? 'purple'} className="text-[9px] !px-2 !py-0 flex-shrink-0">
                      {idea.type}
                    </GlowBadge>
                  </div>

                  {/* Structured summary — 2-3 lines */}
                  <div className="mb-2">
                    {summaryLines.map((line, i) => (
                      <p key={i} className="text-xs text-text-secondary leading-relaxed truncate">
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Expandable raw transcript */}
                  <button
                    onClick={() => toggleExpand(idea.id)}
                    className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors mb-3 self-start"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Details ausblenden
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Details anzeigen
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mb-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                        Original-Transkript
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed italic">
                        &quot;{idea.rawTranscript}&quot;
                      </p>
                    </div>
                  )}

                  {/* Footer: date + actions */}
                  <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-text-muted tabular-nums">{idea.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 transition-all font-medium"
                      >
                        <Rocket className="w-3 h-3" />
                        Als Projekt starten
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-text-muted hover:text-status-critical hover:bg-status-critical/10 transition-all"
                        title="Loeschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
