import { PageContainer } from '../components/layout';
import { SectionLabel } from '../components/ui/SectionLabel';
import { IdeaParkingGlobal } from '../components/widgets/IdeaParkingGlobal';
import { PipelineBoard } from '../components/widgets/PipelineBoard';

export function Lab() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neon-orange text-glow-orange">
          Lab
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Ideen entwickeln, strukturieren und in die Pipeline bringen
        </p>
      </div>

      {/* 01 / NEUE IDEE — prominent input */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="NEUE IDEE" />
        <IdeaParkingGlobal />
      </section>

      {/* 02+03 / PIPELINE + GEPARKTE IDEEN */}
      <section className="animate-fade-in stagger-2">
        <PipelineBoard />
      </section>
    </PageContainer>
  );
}
