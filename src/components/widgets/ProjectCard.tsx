import { Link } from 'react-router-dom';
import { Terminal, Clock, Zap, CreditCard, Check } from 'lucide-react';
import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { GlowBadge } from '../ui/GlowBadge';
import { ProgressBar } from '../ui/ProgressBar';
import type { Project } from '../../data/types';

interface ProjectCardProps {
  project: Project;
}

const phaseColorMap: Record<Project['phase'], 'cyan' | 'green' | 'orange' | 'pink' | 'purple'> = {
  'Phase 0': 'cyan',
  'Phase 1': 'purple',
  'Phase 2': 'orange',
  'Phase 3': 'pink',
  Live: 'green',
};

function daysSince(dateStr: string): number {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`;
  return String(tokens);
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`cd ~/mckay-os/projects/${project.id} && claude`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const days = daysSince(project.startDate);

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <GlassCard className="transition-all duration-300 hover:border-white/10 hover:scale-[1.01]">
        {/* Header: Name + Health + Phase */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <StatusDot status={project.health} />
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">
              {project.name}
            </h3>
          </div>
          <GlowBadge color={phaseColorMap[project.phase]}>{project.phase}</GlowBadge>
        </div>

        {/* Domain subtitle */}
        <p className="text-sm text-text-secondary mb-4 ml-[18px]">
          {project.domain}
        </p>

        {/* Progress bar with percentage */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted">Fortschritt</span>
            <span className="text-xs tabular-nums font-medium text-neon-cyan">
              {project.progressPercent}%
            </span>
          </div>
          <ProgressBar value={project.progressPercent} color="cyan" height="md" />
        </div>

        {/* Metrics row: Timer, Tokens, Cost */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span className="tabular-nums">{days} Tage</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Zap className="w-3.5 h-3.5 text-neon-orange" />
            <span className="tabular-nums">{formatTokens(project.tokenUsage)} Tokens</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <CreditCard className="w-3.5 h-3.5 text-neon-green" />
            <span className="tabular-nums">{project.monthlyCost.toFixed(2).replace('.', ',')} EUR/mo</span>
          </div>
        </div>

        {/* Footer: Open Terminal */}
        <div className="pt-3 border-t border-white/5">
          <button
            onClick={handleCopyTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-neon-green">Kopiert!</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                Open Terminal
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </Link>
  );
}
