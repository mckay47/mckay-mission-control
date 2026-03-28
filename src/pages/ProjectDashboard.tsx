import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Briefcase } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowBadge } from '../components/ui/GlowBadge';
import { StatusDot } from '../components/ui/StatusDot';
import { RadialGauge } from '../components/ui/RadialGauge';
import { SectionLabel } from '../components/ui/SectionLabel';
import { MilestoneProgress } from '../components/widgets/MilestoneProgress';
import { ProjectActions } from '../components/widgets/ProjectActions';
import { ChatPanel } from '../components/widgets/ChatPanel';
import { ProjectTimeline } from '../components/widgets/ProjectTimeline';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { IdeaParking } from '../components/widgets/IdeaParking';
import { projects } from '../data/dummy';
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
  const [injectedPrompt, setInjectedPrompt] = useState('');

  const handleSendPrompt = (text: string) => {
    setInjectedPrompt(`${text} [${Date.now()}]`);
  };

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
  const laufzeitPercent = Math.min(100, Math.round((laufzeit / 90) * 100));
  const tokenPercent = Math.min(100, Math.round((project.tokenUsage / 200000) * 100));
  const promptPercent = Math.min(100, Math.round((project.promptCount / 500) * 100));
  const costPercent = Math.min(100, Math.round((project.monthlyCost / 100) * 100));
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

        {/* Deploy link */}
        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {project.deployUrl.replace('https://', '')}
          </a>
        )}

        <div className="ml-auto">
          <ProjectActions projectId={project.id} />
        </div>
      </div>

      {/* Metrics: 4 RadialGauges */}
      <div className="animate-fade-in stagger-1 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="!p-4 flex flex-col items-center gap-1">
            <RadialGauge value={laufzeitPercent} label="Laufzeit" size={100} color="cyan" />
            <span className="text-xs text-text-muted tabular-nums mt-1">{laufzeit} Tage</span>
          </GlassCard>
          <GlassCard className="!p-4 flex flex-col items-center gap-1">
            <RadialGauge value={tokenPercent} label="Tokens" size={100} color="green" />
            <span className="text-xs text-text-muted tabular-nums mt-1">{(project.tokenUsage / 1000).toFixed(0)}K</span>
          </GlassCard>
          <GlassCard className="!p-4 flex flex-col items-center gap-1">
            <RadialGauge value={promptPercent} label="Prompts" size={100} color="orange" />
            <span className="text-xs text-text-muted tabular-nums mt-1">{project.promptCount}</span>
          </GlassCard>
          <GlassCard className="!p-4 flex flex-col items-center gap-1">
            <RadialGauge value={costPercent} label="Kosten" size={100} color="pink" />
            <span className="text-xs text-text-muted tabular-nums mt-1">{project.monthlyCost.toFixed(2)} EUR</span>
          </GlassCard>
        </div>
      </div>

      {/* 01 / FORTSCHRITT — MilestoneProgress */}
      <section className="mb-4 animate-fade-in stagger-1">
        <SectionLabel number="01" title="FORTSCHRITT" />
        <MilestoneProgress milestones={project.milestones} expanded />
      </section>

      {/* 02 / TIMELINE — horizontal, compact, right below milestones */}
      <section className="mb-6 animate-fade-in stagger-1">
        <SectionLabel number="02" title="TIMELINE" />
        <ProjectTimeline timeline={project.timeline} horizontal />
      </section>

      {/* Main grid: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 03 / TERMINAL */}
          <section className="animate-fade-in stagger-2">
            <SectionLabel number="03" title="TERMINAL" />
            <div className="min-h-[500px]">
              <ChatPanel projectId={project.id} injectedPrompt={injectedPrompt} />
            </div>
          </section>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* 04 / IDEEN — larger workspace */}
          <section className="animate-fade-in stagger-2">
            <SectionLabel number="04" title="IDEEN" />
            <div className="min-h-[320px]">
              <IdeaParking onSendPrompt={handleSendPrompt} />
            </div>
          </section>

          {/* 05 / AUFGABEN — larger workspace */}
          <section className="animate-fade-in stagger-3">
            <SectionLabel number="05" title="AUFGABEN" />
            <div className="min-h-[400px]">
              <TodoEditor projectId={project.id} onSendPrompt={handleSendPrompt} />
            </div>
          </section>

          {/* 06 / PROJEKT-INFO — combined Skills + Business Model + Market */}
          <section className="animate-fade-in stagger-4">
            <SectionLabel number="06" title="PROJEKT-INFO" />
            <GlassCard>
              <div className="flex items-center gap-2.5 mb-3">
                <Briefcase className="w-4 h-4 text-neon-purple" />
                <h3 className="text-sm font-semibold text-text-secondary">Projekt-Info</h3>
              </div>

              {/* Business Model — 1 line */}
              <div className="mb-3">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Business Model</span>
                <p className="text-sm text-text-primary mt-0.5">{project.businessModel}</p>
              </div>

              {/* Skills — inline badges */}
              <div className="mb-3">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1.5">Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillNames.map((skill) => (
                    <GlowBadge key={skill} text={skill} color="purple" className="text-[10px] !px-2 !py-0" />
                  ))}
                </div>
              </div>

              {/* Market data — inline key numbers */}
              {project.market && (
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1.5">Markt</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    {project.market.marketSize && (
                      <span className="text-text-secondary">
                        <span className="text-neon-cyan tabular-nums">{project.market.marketSize}</span>
                        {' '}Markt
                      </span>
                    )}
                    {project.market.potentialCustomers && (
                      <span className="text-text-secondary">
                        <span className="text-neon-green tabular-nums">{project.market.potentialCustomers}</span>
                        {' '}Kunden
                      </span>
                    )}
                    {project.market.revenueEstimate && (
                      <span className="text-text-secondary">
                        <span className="text-neon-orange tabular-nums">{project.market.revenueEstimate}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
