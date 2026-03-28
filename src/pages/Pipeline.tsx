import { PageContainer } from '../components/layout';
import { SectionLabel } from '../components/ui/SectionLabel';
import { IdeaParkingGlobal } from '../components/widgets/IdeaParkingGlobal';
import { PipelineBoard } from '../components/widgets/PipelineBoard';

export function Pipeline() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neon-orange text-glow-orange">
          Ideen-Pipeline
        </h1>
      </div>

      {/* 01 / NEUE IDEE */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="NEUE IDEE" />
        <IdeaParkingGlobal />
      </section>

      {/* 02 / GEPARKTE IDEEN */}
      <section className="animate-fade-in stagger-2">
        <SectionLabel number="02" title="GEPARKTE IDEEN" />
        <PipelineBoard />
      </section>
    </PageContainer>
  );
}
