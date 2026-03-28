import { Link } from 'react-router-dom';
import { Terminal, ExternalLink } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { GlowBadge } from '../ui/GlowBadge';
import type { Project } from '../../data/types';

interface ProjectCardProps {
  project: Project;
}

const healthColorMap: Record<Project['health'], 'cyan' | 'green' | 'orange' | 'pink'> = {
  healthy: 'green',
  attention: 'orange',
  risk: 'orange',
  critical: 'pink',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const handleCopyTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`cd ~/mckay-os/projects/${project.id} && claude`);
  };

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <GlassCard className="transition-all duration-300 hover:border-white/10 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <StatusDot status={project.health} />
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">
              {project.name}
            </h3>
          </div>
          <GlowBadge color={healthColorMap[project.health]}>{project.phase}</GlowBadge>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-text-secondary border border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-text-muted">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {project.stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <span className="text-text-muted">{stat.label}</span>
              <span className="tabular-nums font-medium text-text-primary">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {project.deployUrl ? (
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-neon-cyan transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {project.deployUrl.replace('https://', '')}
            </a>
          ) : (
            <span className="text-xs text-text-muted">No deployment</span>
          )}

          <button
            onClick={handleCopyTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            Open Terminal
          </button>
        </div>
      </GlassCard>
    </Link>
  );
}
