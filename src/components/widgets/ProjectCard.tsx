import { Link } from 'react-router-dom';
import { Terminal, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { GlowBadge } from '../ui/GlowBadge';
import { RadialGauge } from '../ui/RadialGauge';
import { AnimatedNumber } from '../ui/AnimatedNumber';
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

  const handleDeployClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.deployUrl) {
      window.open(project.deployUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const days = daysSince(project.startDate);
  const isLive = project.status === 'live';

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <GlassCard scan className="transition-all duration-300 hover:border-white/10 hover:scale-[1.01] animate-fade-in">
        {/* Top: RadialGauge + Name/Domain/Phase */}
        <div className="flex items-center gap-4 mb-4">
          <RadialGauge
            value={project.progressPercent}
            size={90}
            color={phaseColorMap[project.phase]}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusDot status={project.health} />
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-neon-cyan transition-colors truncate">
                {project.name}
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-1.5 truncate">
              {project.domain}
            </p>
            <div className="flex items-center gap-2">
              <GlowBadge color={phaseColorMap[project.phase]}>{project.phase}</GlowBadge>
              {isLive && <GlowBadge color="green">LIVE</GlowBadge>}
            </div>
          </div>
        </div>

        {/* Milestone dots */}
        {project.milestones.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {project.milestones.map((ms) => (
              <div
                key={ms.label}
                title={ms.label}
                className={`w-2 h-2 rounded-full transition-all ${
                  ms.completed
                    ? 'bg-neon-green shadow-[0_0_6px_rgba(0,255,136,0.5)]'
                    : ms.active
                      ? 'bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.5)] animate-pulse'
                      : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-1.5 mb-3 text-sm text-text-secondary">
          <span className="hud-label">Laeuft seit</span>
          <AnimatedNumber value={days} size="sm" color="cyan" suffix=" Tagen" className="text-sm font-semibold" />
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-4 mb-2 text-sm">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span className="hud-label">Tokens</span>
            <span className="tabular-nums text-neon-green text-glow-green">
              {formatTokens(project.tokenUsage)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span className="hud-label">Kosten</span>
            <span className="tabular-nums text-neon-orange text-glow-orange">
              {project.monthlyCost.toFixed(2).replace('.', ',')} EUR/mo
            </span>
          </div>
        </div>

        {/* Market revenue estimate */}
        {project.market && (
          <p className="text-[11px] text-text-muted mb-4 truncate">
            {project.market.revenueEstimate}
          </p>
        )}

        {/* Footer: Terminal or Deploy link based on status */}
        <div className="pt-3 border-t border-white/5">
          {isLive ? (
            <button
              onClick={handleDeployClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live ansehen
            </button>
          ) : (
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
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
