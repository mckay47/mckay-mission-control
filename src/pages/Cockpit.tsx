import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Terminal, Check } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { StatusDot } from '../components/ui/StatusDot';
import { GlowBadge } from '../components/ui/GlowBadge';
import { RadialGauge } from '../components/ui/RadialGauge';
import { GlobalKPIBar } from '../components/widgets/GlobalKPIBar';
import { useClock } from '../hooks/useClock';
import { projects } from '../data/dummy';
import type { Project } from '../data/types';

const phaseColorMap: Record<Project['phase'], 'cyan' | 'green' | 'orange' | 'pink' | 'purple'> = {
  'Phase 0': 'cyan',
  'Phase 1': 'purple',
  'Phase 2': 'orange',
  'Phase 3': 'pink',
  Live: 'green',
};

export function Cockpit() {
  const [launchInput, setLaunchInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { time, date } = useClock();

  const buildingProjects = projects.filter((p) => p.status === 'building');
  const liveProjects = projects.filter((p) => p.status === 'live');

  const handleLaunch = () => {
    if (launchInput.trim()) {
      setLaunchInput('');
      navigate('/lab');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleLaunch();
    }
  };

  const handleCopyTerminal = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`cd ~/mckay-os/projects/${projectId} && claude`);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <PageContainer>
      {/* Welcome header + live clock */}
      <div className="mb-6">
        <h1 className="text-3xl font-light text-text-primary text-glow-cyan mb-1">
          Willkommen, Mehti
        </h1>
        <p className="text-sm text-text-muted tabular-nums">
          {date} &middot; {time}
        </p>
      </div>

      {/* 01 / KPIs */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="KPIs" />
        <GlobalKPIBar />
      </section>

      {/* 02 / PROJEKTE */}
      <section className="mb-8 animate-fade-in stagger-2">
        <SectionLabel number="02" title="PROJEKTE" />

        {/* In Arbeit — compact 4-column grid */}
        <div className="mb-5">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
            In Arbeit ({buildingProjects.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {buildingProjects.map((project) => (
              <GlassCard
                key={project.id}
                className="!p-3.5 cursor-pointer hover:border-neon-cyan/20 hover:scale-[1.01] transition-all group"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                {/* Top: gauge + name */}
                <div className="flex items-center gap-3 mb-2">
                  <RadialGauge
                    value={project.progressPercent}
                    size={48}
                    color={phaseColorMap[project.phase]}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <StatusDot status={project.health} />
                      <span className="text-sm font-semibold text-text-primary group-hover:text-neon-cyan transition-colors truncate">
                        {project.name}
                      </span>
                    </div>
                    <GlowBadge color={phaseColorMap[project.phase]} className="text-[9px] !px-1.5 !py-0">
                      {project.phase}
                    </GlowBadge>
                  </div>
                </div>

                {/* Domain + terminal shortcut */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted truncate">{project.domain}</span>
                  <button
                    onClick={(e) => handleCopyTerminal(e, project.id)}
                    className="p-1 rounded text-text-muted hover:text-neon-cyan transition-colors flex-shrink-0"
                    title="Terminal-Befehl kopieren"
                  >
                    {copiedId === project.id ? (
                      <Check className="w-3 h-3 text-neon-green" />
                    ) : (
                      <Terminal className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Live — horizontal badge row */}
        {liveProjects.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
              Live ({liveProjects.length})
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {liveProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-glass-bg border border-neon-green/20 hover:border-neon-green/40 hover:bg-neon-green/5 transition-all group"
                >
                  <StatusDot status="healthy" />
                  <span className="text-sm font-medium text-text-primary group-hover:text-neon-green transition-colors">
                    {project.name}
                  </span>
                  {project.market?.revenueEstimate && (
                    <span className="text-[10px] text-neon-green/70 tabular-nums hidden sm:inline">
                      {project.market.revenueEstimate}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 03 / NEUE IDEE */}
      <section className="mb-8 animate-fade-in stagger-3">
        <SectionLabel number="03" title="NEUE IDEE" />
        <GlassCard>
          <div className="flex items-start gap-4">
            <Rocket className="w-5 h-5 text-neon-orange shrink-0 mt-2" />
            <textarea
              value={launchInput}
              onChange={(e) => setLaunchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Beschreibe deine naechste Projekt-Idee..."
              rows={2}
              className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted font-mono resize-none"
            />
            <button
              onClick={handleLaunch}
              disabled={!launchInput.trim()}
              className="vision-btn px-4 py-2.5 text-sm text-neon-orange disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Idee aufnehmen
            </button>
          </div>
        </GlassCard>
      </section>
    </PageContainer>
  );
}
