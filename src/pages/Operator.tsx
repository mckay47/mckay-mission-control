import { useNavigate } from 'react-router-dom';
import { FolderOpen, AlertTriangle } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { StatusDot } from '../components/ui/StatusDot';
import { GlowBadge } from '../components/ui/GlowBadge';
import { RadialGauge } from '../components/ui/RadialGauge';
import { projects, initialTodos } from '../data/dummy';
import { PRODUCT_STEPS } from '../data/types';
import type { ProjectPhase } from '../data/types';

const phaseColorMap: Record<string, 'cyan' | 'green' | 'orange' | 'pink' | 'purple'> = {
  'Phase 0': 'cyan',
  'Phase 1': 'purple',
  'Phase 2': 'orange',
  'Phase 3': 'pink',
  Live: 'green',
};

const buildingProjects = projects.filter((p) => p.status === 'building');

export function Operator() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neon-orange text-glow-orange">Arbeitsplatz</h1>
        <p className="text-sm text-text-muted mt-1">Projekt waehlen und direkt loslegen</p>
      </div>

      {/* Project grid */}
      <section className="animate-fade-in stagger-1">
        <SectionLabel number="01" title="PROJEKTE" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildingProjects.map((project, i) => {
            const openTodos = initialTodos.filter(
              (t) => t.projectId === project.id && !t.done
            ).length;
            const lastTimeline = project.timeline[project.timeline.length - 1];
            const nextStep =
              project.currentStep > 1
                ? PRODUCT_STEPS[project.currentStep - 2]
                : PRODUCT_STEPS[0];
            const isAttention = project.health === 'attention';

            return (
              <GlassCard
                key={project.id}
                elevated
                className={`relative transition-all hover:scale-[1.01] ${
                  isAttention
                    ? 'attention-border'
                    : ''
                } stagger-${i + 1} animate-fade-in`}
              >
                {/* Attention banner */}
                {isAttention && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neon-orange/20">
                    <AlertTriangle className="w-4 h-4 text-neon-orange" />
                    <span className="text-xs font-medium text-neon-orange">
                      KANI wartet auf deine Freigabe
                    </span>
                  </div>
                )}

                {/* Top: Gauge + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <RadialGauge
                    value={project.progressPercent}
                    size={64}
                    color={phaseColorMap[project.phase as ProjectPhase] ?? 'cyan'}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <GlowBadge
                        color={phaseColorMap[project.phase as ProjectPhase] ?? 'cyan'}
                        className="text-[10px] !px-2 !py-0"
                      >
                        {project.phase}
                      </GlowBadge>
                      <StatusDot status={project.health} />
                    </div>
                  </div>
                </div>

                {/* Info lines */}
                <div className="space-y-2 mb-5">
                  {lastTimeline && (
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider w-16 shrink-0 mt-0.5">
                        Zuletzt
                      </span>
                      <span className="text-xs text-text-secondary truncate">
                        {lastTimeline.title}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider w-16 shrink-0 mt-0.5">
                      Naechster
                    </span>
                    <span className="text-xs text-text-secondary truncate">
                      {nextStep}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider w-16 shrink-0 mt-0.5">
                      Todos
                    </span>
                    <span className={`text-xs tabular-nums ${openTodos > 0 ? 'text-neon-orange' : 'text-text-muted'}`}>
                      {openTodos} offen
                    </span>
                  </div>
                </div>

                {/* Open button */}
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="w-full vision-btn px-4 py-3 flex items-center justify-center gap-2.5 text-sm font-medium text-neon-cyan"
                >
                  <FolderOpen className="w-4 h-4" />
                  Projekt oeffnen
                </button>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Empty state */}
      {buildingProjects.length === 0 && (
        <GlassCard className="text-center py-16 animate-fade-in">
          <p className="text-text-muted text-sm">Keine aktiven Projekte vorhanden.</p>
          <p className="text-text-muted text-xs mt-2">
            Starte ein neues Projekt im{' '}
            <button onClick={() => navigate('/lab')} className="text-neon-cyan hover:underline">
              Lab
            </button>
            .
          </p>
        </GlassCard>
      )}
    </PageContainer>
  );
}
