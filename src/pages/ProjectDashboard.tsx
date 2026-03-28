import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowBadge } from '../components/ui/GlowBadge';
import { StatusDot } from '../components/ui/StatusDot';
import { KPICard } from '../components/ui/KPICard';
import { ProjectActions } from '../components/widgets/ProjectActions';
import { ChatPanel } from '../components/widgets/ChatPanel';
import { ProjectTimeline } from '../components/widgets/ProjectTimeline';
import { MemoryViewer } from '../components/widgets/MemoryViewer';
import { projects } from '../data/dummy';
// types imported via dummy data

const phaseColorMap: Record<string, 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow'> = {
  'Phase 0': 'cyan',
  'Phase 1': 'green',
  'Phase 2': 'orange',
  'Phase 3': 'pink',
  'Live': 'green',
};

const kpiColorCycle: Array<'cyan' | 'green' | 'orange' | 'pink'> = ['cyan', 'green', 'orange', 'pink'];

export function ProjectDashboard() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-neon-orange text-lg font-semibold mb-2">Project not found</p>
            <p className="text-text-muted text-sm mb-4">
              No project with ID &quot;{id}&quot; exists in the system.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-neon-cyan text-sm hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Command Center
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

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
        <GlowBadge text={project.phase} color={phaseColorMap[project.phase] ?? 'cyan'} />
        <StatusDot status={project.health} />
        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-cyan transition-colors ml-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {project.deployUrl.replace('https://', '')}
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-6 max-w-3xl">{project.description}</p>

      {/* Action bar */}
      <div className="mb-6">
        <ProjectActions projectId={project.id} />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {project.stats.map((stat, i) => (
          <KPICard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={kpiColorCycle[i % kpiColorCycle.length]}
          />
        ))}
      </div>

      {/* Main grid: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <ChatPanel />
          <ProjectTimeline timeline={project.timeline} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <MemoryViewer />

          {/* Active Skills */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-text-secondary mb-4">Active Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <GlowBadge key={skill} text={skill} color="purple" />
              ))}
            </div>
          </GlassCard>

          {/* Tech Stack */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-text-secondary mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <GlowBadge key={tech} text={tech} color="cyan" />
              ))}
            </div>
          </GlassCard>

          {/* Roles */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-text-secondary mb-4">Roles</h3>
            <div className="flex flex-wrap gap-2">
              {project.roles.map((role) => (
                <GlowBadge key={role} text={role} color="green" />
              ))}
            </div>
          </GlassCard>

          {/* Business Model */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-text-secondary mb-4">Business Model</h3>
            <p className="text-sm text-text-primary">{project.businessModel}</p>
            {project.marketSize && (
              <p className="text-xs text-text-muted mt-2">Market: {project.marketSize}</p>
            )}
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
