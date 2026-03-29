import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { StatusDot } from '../components/ui/StatusDot';
import { GlowBadge } from '../components/ui/GlowBadge';
import { RadialGauge } from '../components/ui/RadialGauge';
import { ChatPanel } from '../components/widgets/ChatPanel';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { IdeaParking } from '../components/widgets/IdeaParking';
import { projects } from '../data/dummy';
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
  const [selectedProjectId, setSelectedProjectId] = useState(buildingProjects[0]?.id ?? '');
  const [injectedPrompt, setInjectedPrompt] = useState('');

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSendPrompt = (text: string) => {
    setInjectedPrompt(`${text} [${Date.now()}]`);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neon-orange text-glow-orange">Arbeitsplatz</h1>
        <p className="text-sm text-text-muted mt-1">Direkt loslegen — Projekt waehlen und arbeiten</p>
      </div>

      {/* 01 / PROJEKT WAEHLEN — horizontal selector */}
      <section className="mb-6 animate-fade-in stagger-1">
        <SectionLabel number="01" title="PROJEKT WAEHLEN" />
        <div className="flex flex-wrap items-center gap-3">
          {buildingProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                selectedProjectId === project.id
                  ? 'glass-elevated border-neon-cyan/30 box-glow-cyan'
                  : 'glass hover:border-white/10'
              }`}
            >
              <RadialGauge
                value={project.progressPercent}
                size={40}
                color={phaseColorMap[project.phase as ProjectPhase] ?? 'cyan'}
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <StatusDot status={project.health} />
                  <span className={`text-sm font-semibold ${
                    selectedProjectId === project.id ? 'text-neon-cyan' : 'text-text-primary'
                  }`}>
                    {project.name}
                  </span>
                </div>
                <GlowBadge
                  color={phaseColorMap[project.phase as ProjectPhase] ?? 'cyan'}
                  className="text-[9px] !px-1.5 !py-0 mt-0.5"
                >
                  {project.phase}
                </GlowBadge>
              </div>
            </button>
          ))}

          {/* Link to full project dashboard */}
          {selectedProject && (
            <button
              onClick={() => navigate(`/project/${selectedProjectId}`)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-text-muted hover:text-neon-cyan transition-colors"
            >
              <span>Zum Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Main workspace: 2/3 Terminal + 1/3 Sidebar */}
      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Terminal — 2/3 */}
          <div className="lg:col-span-2 animate-fade-in stagger-2">
            <SectionLabel number="02" title="TERMINAL" />
            <div className="min-h-[500px]">
              <ChatPanel projectId={selectedProjectId} injectedPrompt={injectedPrompt} />
            </div>
          </div>

          {/* Right: Todo + Ideas — 1/3 */}
          <div className="space-y-6">
            <div className="animate-fade-in stagger-3">
              <SectionLabel number="03" title="AUFGABEN" />
              <div className="min-h-[300px]">
                <TodoEditor projectId={selectedProjectId} onSendPrompt={handleSendPrompt} />
              </div>
            </div>

            <div className="animate-fade-in stagger-4">
              <SectionLabel number="04" title="IDEEN" />
              <div className="min-h-[250px]">
                <IdeaParking onSendPrompt={handleSendPrompt} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No project selected fallback */}
      {!selectedProject && (
        <GlassCard className="text-center py-16 animate-fade-in">
          <p className="text-text-muted text-sm">Kein aktives Projekt vorhanden.</p>
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
