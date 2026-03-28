import { Lightbulb } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlowBadge } from '../components/ui/GlowBadge';
import { LaunchWizard } from '../components/widgets/LaunchWizard';
import { PipelineBoard } from '../components/widgets/PipelineBoard';
import { pipelineIdeas } from '../data/dummy';

export function Pipeline() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Lightbulb className="w-7 h-7 text-neon-orange" />
        <h1 className="text-3xl font-bold text-neon-orange text-glow-orange">Ideas Pipeline</h1>
        <GlowBadge text={`${pipelineIdeas.length} ideas`} color="orange" />
      </div>

      {/* Launch Wizard (full version) */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Launch New Project</h2>
        <LaunchWizard />
      </section>

      {/* Pipeline Board (full kanban) */}
      <section>
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Pipeline Board</h2>
        <PipelineBoard />
      </section>
    </PageContainer>
  );
}
