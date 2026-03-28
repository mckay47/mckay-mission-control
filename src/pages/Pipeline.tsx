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
        <GlowBadge text={`${pipelineIdeas.length} Ideen`} color="orange" />
      </div>

      {/* Launch Wizard (full 10-step version) */}
      <section className="mb-8">
        <LaunchWizard />
      </section>

      {/* Pipeline Board */}
      <section>
        <PipelineBoard />
      </section>
    </PageContainer>
  );
}
