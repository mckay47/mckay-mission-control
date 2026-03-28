import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { ActionButton } from '../components/ui/ActionButton';
import { GlobalKPIBar } from '../components/widgets/GlobalKPIBar';
import { ProjectCard } from '../components/widgets/ProjectCard';
import { QuickActions } from '../components/widgets/QuickActions';
import { PriorityList } from '../components/widgets/PriorityList';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { NotificationCenter } from '../components/widgets/NotificationCenter';
import { projects } from '../data/dummy';

export function CommandCenter() {
  const [launchInput, setLaunchInput] = useState('');
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (launchInput.trim()) {
      setLaunchInput('');
      navigate('/pipeline');
    }
  };

  return (
    <PageContainer>
      {/* Global KPI Bar */}
      <GlobalKPIBar />

      {/* Main grid: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          <section>
            <h2 className="text-lg font-semibold text-text-secondary mb-4">Meine Projekte</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          <TodoEditor />
          <PriorityList />
          <NotificationCenter />
        </div>
      </div>

      {/* Bottom: Compact Launch Input */}
      <div className="mt-6">
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
              label="Neue Idee launchen"
              variant="primary"
              onClick={handleLaunch}
            />
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
