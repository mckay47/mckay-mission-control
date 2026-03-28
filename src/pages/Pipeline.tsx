import { Lightbulb } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlowBadge } from '../components/ui/GlowBadge';
import { SectionLabel } from '../components/ui/SectionLabel';
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

      {/* Launch Wizard */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="LAUNCH" />
        <LaunchWizard />
      </section>

      {/* Pipeline Board */}
      <section className="animate-fade-in stagger-2">
        <SectionLabel number="02" title="PIPELINE" />
        <PipelineBoard />
      </section>
    </PageContainer>
  );
}
