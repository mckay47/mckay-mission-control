import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { ActionButton } from '../components/ui/ActionButton';
import { GlobalKPIBar } from '../components/widgets/GlobalKPIBar';
import { ProjectCard } from '../components/widgets/ProjectCard';
import { QuickActions } from '../components/widgets/QuickActions';
import { TerminalManager } from '../components/widgets/TerminalManager';
import { PriorityList } from '../components/widgets/PriorityList';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { NotificationCenter } from '../components/widgets/NotificationCenter';
import { projects } from '../data/dummy';

export function CommandCenter() {
  const [launchInput, setLaunchInput] = useState('');

  return (
    <PageContainer>
      {/* Global KPI Bar */}
      <GlobalKPIBar />

      {/* Main grid: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          <section>
            <h2 className="text-lg font-semibold text-text-secondary mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold text-text-secondary mb-4">Quick Actions</h2>
            <QuickActions />
          </section>

          {/* Active Terminals */}
          <section>
            <h2 className="text-lg font-semibold text-text-secondary mb-4">Active Terminals</h2>
            <TerminalManager />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <PriorityList />
          <TodoEditor />
          <NotificationCenter />
        </div>
      </div>

      {/* Bottom: Compact Launch Input */}
      <div className="mt-6">
        <GlassCard>
          <div className="flex items-center gap-4">
            <Rocket className="w-5 h-5 text-neon-orange shrink-0" />
            <input
              type="text"
              value={launchInput}
              onChange={(e) => setLaunchInput(e.target.value)}
              placeholder="/launch — describe your next project idea..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted font-mono"
            />
            <ActionButton
              label="Launch"
              variant="primary"
              onClick={() => setLaunchInput('')}
            />
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
