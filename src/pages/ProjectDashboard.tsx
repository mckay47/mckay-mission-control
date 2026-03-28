import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Clock, Cpu, MessageSquare, Euro } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowBadge } from '../components/ui/GlowBadge';
import { GlowNumber } from '../components/ui/GlowNumber';
import { StatusDot } from '../components/ui/StatusDot';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProjectActions } from '../components/widgets/ProjectActions';
import { ChatPanel } from '../components/widgets/ChatPanel';
import { ProjectTimeline } from '../components/widgets/ProjectTimeline';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { projects } from '../data/dummy';
import { PRODUCT_STEPS } from '../data/types';
import type { ProjectPhase } from '../data/types';

const phaseColorMap: Record<string, 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow'> = {
  'Phase 0': 'cyan',
  'Phase 1': 'green',
  'Phase 2': 'orange',
  'Phase 3': 'pink',
  'Live': 'green',
};

function daysSince(dateStr: string): number {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function extractSkillName(fullPath: string): string {
  const parts = fullPath.split('/');
  return parts[parts.length - 1];
}

export function ProjectDashboard() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-neon-orange text-lg font-semibold mb-2">Projekt nicht gefunden</p>
            <p className="text-text-muted text-sm mb-4">
              Kein Projekt mit ID &quot;{id}&quot; im System.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-neon-cyan text-sm hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurueck zum Command Center
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const laufzeit = daysSince(project.startDate);
  const skillNames = project.skills.map(extractSkillName);

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Command Center
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-neon-cyan text-glow-cyan">
          {project.name}
        </h1>
        <GlowBadge text={project.phase} color={phaseColorMap[project.phase as ProjectPhase] ?? 'cyan'} />
        <StatusDot status={project.health} />
        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-cyan transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {project.deployUrl.replace('https://', '')}
          </a>
        )}
        <div className="ml-auto">
          <ProjectActions projectId={project.id} />
        </div>
      </div>

      {/* Metrics bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard className="!p-4 flex flex-col items-center gap-1">
          <Clock className="w-4 h-4 text-text-muted mb-1" />
          <GlowNumber value={laufzeit} size="sm" color="cyan" />
          <span className="text-xs text-text-muted">Laufzeit (Tage)</span>
        </GlassCard>
        <GlassCard className="!p-4 flex flex-col items-center gap-1">
          <Cpu className="w-4 h-4 text-text-muted mb-1" />
          <GlowNumber value={`${(project.tokenUsage / 1000).toFixed(0)}K`} size="sm" color="green" />
          <span className="text-xs text-text-muted">Tokens</span>
        </GlassCard>
        <GlassCard className="!p-4 flex flex-col items-center gap-1">
          <MessageSquare className="w-4 h-4 text-text-muted mb-1" />
          <GlowNumber value={project.promptCount} size="sm" color="orange" />
          <span className="text-xs text-text-muted">Prompts</span>
        </GlassCard>
        <GlassCard className="!p-4 flex flex-col items-center gap-1">
          <Euro className="w-4 h-4 text-text-muted mb-1" />
          <GlowNumber value={`${project.monthlyCost.toFixed(2)}`} size="sm" color="pink" />
          <span className="text-xs text-text-muted">Monatskosten</span>
        </GlassCard>
      </div>

      {/* Progress bar */}
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-secondary">Fortschritt &rarr; Launch</span>
          <span className="text-xs text-text-muted tabular-nums">{project.progressPercent}%</span>
        </div>
        <ProgressBar value={project.progressPercent} color="cyan" height="md" />
        <p className="text-xs text-text-muted mt-2">
          Step {project.currentStep}: {PRODUCT_STEPS[project.currentStep - 1]}
        </p>
      </GlassCard>

      {/* Main grid: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="min-h-[500px]">
            <ChatPanel />
          </div>
          <ProjectTimeline timeline={project.timeline} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <TodoEditor projectId={project.id} />

          {/* Active Skills */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-text-secondary mb-3">
              Aktive Skills <span className="text-text-muted">({skillNames.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillNames.map((skill) => (
                <GlowBadge key={skill} text={skill} color="purple" />
              ))}
            </div>
          </GlassCard>

          {/* Business Model */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Business Model</h3>
            <p className="text-sm text-text-primary">{project.businessModel}</p>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
