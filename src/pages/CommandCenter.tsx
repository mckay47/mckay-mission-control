import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, RefreshCw, Rocket } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { StatusDot } from '../components/ui/StatusDot';
import { WelcomeBriefing } from '../components/widgets/WelcomeBriefing';
import { ProjectCard } from '../components/widgets/ProjectCard';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { PriorityList } from '../components/widgets/PriorityList';
import { NotificationCenter } from '../components/widgets/NotificationCenter';
import { projects } from '../data/dummy';
import { useClock } from '../hooks/useClock';

const quickActions = [
  { id: 'brief', label: '/brief', desc: 'Daily Briefing', icon: FileText },
  { id: 'status', label: '/status', desc: 'Status Check', icon: Activity },
  { id: 'launch', label: '/launch', desc: 'Neues Projekt', icon: Rocket },
  { id: 'sync', label: '/sync', desc: 'Memory Sync', icon: RefreshCw },
];

export function CommandCenter() {
  const [launchInput, setLaunchInput] = useState('');
  const navigate = useNavigate();
  const { time, date } = useClock();

  const buildingProjects = projects.filter((p) => p.status === 'building');
  const liveProjects = projects.filter((p) => p.status === 'live');

  const handleLaunch = () => {
    if (launchInput.trim()) {
      setLaunchInput('');
      navigate('/pipeline');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleLaunch();
    }
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

      {/* Quick Actions row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.id === 'launch') navigate('/pipeline');
              else if (action.id === 'status') navigate('/system');
            }}
            className="vision-btn px-4 py-2.5 flex items-center gap-2.5 text-sm"
          >
            <action.icon className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono text-neon-cyan">{action.label}</span>
            <span className="text-text-muted hidden sm:inline">{action.desc}</span>
          </button>
        ))}
      </div>

      {/* 01 / BRIEFING */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="BRIEFING" />
        <WelcomeBriefing />
      </section>

      {/* 02 / PROJEKTE */}
      <section className="mb-8 animate-fade-in stagger-2">
        <SectionLabel number="02" title="PROJEKTE" />

        {/* In Arbeit */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
            In Arbeit ({buildingProjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Live */}
        {liveProjects.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
              Live ({liveProjects.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {liveProjects.map((project) => (
                <GlassCard
                  key={project.id}
                  className="!p-4 cursor-pointer hover:border-neon-green/20 transition-all"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <StatusDot status={project.health} />
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {project.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{project.domain}</span>
                    {project.market?.revenueEstimate && (
                      <span className="text-neon-green tabular-nums">
                        {project.market.revenueEstimate}
                      </span>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 03 / AUFGABEN */}
      <section className="mb-8 animate-fade-in stagger-3">
        <SectionLabel number="03" title="AUFGABEN" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: TodoEditor (global) */}
          <TodoEditor />

          {/* Right: PriorityList + NotificationCenter stacked */}
          <div className="space-y-6">
            <PriorityList />
            <NotificationCenter />
          </div>
        </div>
      </section>

      {/* 04 / NEUE IDEE */}
      <section className="mb-8 animate-fade-in stagger-4">
        <SectionLabel number="04" title="NEUE IDEE" />
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
