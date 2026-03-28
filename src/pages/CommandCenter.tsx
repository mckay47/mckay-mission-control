import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { WaveChart } from '../components/ui/WaveChart';
import { ActionButton } from '../components/ui/ActionButton';
import { WelcomeBriefing } from '../components/widgets/WelcomeBriefing';
import { ThinkTank } from '../components/widgets/ThinkTank';
import { ProjectCard } from '../components/widgets/ProjectCard';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { NotificationCenter } from '../components/widgets/NotificationCenter';
import { projects } from '../data/dummy';
import { useClock } from '../hooks/useClock';

export function CommandCenter() {
  const [launchInput, setLaunchInput] = useState('');
  const navigate = useNavigate();
  const { time, date } = useClock();

  const handleLaunch = () => {
    if (launchInput.trim()) {
      setLaunchInput('');
      navigate('/pipeline');
    }
  };

  return (
    <PageContainer>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-text-primary text-glow-cyan mb-1">
          Willkommen zurueck, Mehti.
        </h1>
        <p className="text-sm text-text-muted tabular-nums">
          {date} &middot; {time}
        </p>
      </div>

      {/* 01 / BRIEFING */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="BRIEFING" />
        <WelcomeBriefing />
      </section>

      {/* 02 / THINK TANK */}
      <section className="mb-8 animate-fade-in stagger-2">
        <SectionLabel number="02" title="THINK TANK" />
        <ThinkTank />
      </section>

      {/* 03 / PROJEKTE */}
      <section className="mb-8 animate-fade-in stagger-3">
        <SectionLabel number="03" title="PROJEKTE" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Bottom row: TODOS + NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in stagger-4">
        <div>
          <SectionLabel number="04" title="TODOS" />
          <TodoEditor />
        </div>
        <div>
          <SectionLabel number="05" title="NOTIFICATIONS" />
          <NotificationCenter />
        </div>
      </div>

      {/* 06 / NEUE IDEE */}
      <section className="mb-8 animate-fade-in stagger-5">
        <SectionLabel number="06" title="NEUE IDEE" />
        <GlassCard>
          <div className="flex items-start gap-4">
            <Rocket className="w-5 h-5 text-neon-orange shrink-0 mt-2" />
            <textarea
              value={launchInput}
              onChange={(e) => setLaunchInput(e.target.value)}
              placeholder="Beschreibe deine naechste Projekt-Idee..."
              rows={2}
              className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted font-mono resize-none"
            />
            <ActionButton
              label="Idee launchen"
              variant="primary"
              onClick={handleLaunch}
            />
          </div>
        </GlassCard>
      </section>

      {/* Decorative wave */}
      <div className="animate-fade-in stagger-6">
        <WaveChart height={60} color="#00F0FF" className="opacity-30" />
      </div>
    </PageContainer>
  );
}
