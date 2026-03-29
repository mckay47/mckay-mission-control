import { PageContainer } from '../components/layout';
import { SectionLabel } from '../components/ui/SectionLabel';
import { WelcomeBriefing } from '../components/widgets/WelcomeBriefing';
import { PriorityList } from '../components/widgets/PriorityList';
import { NotificationCenter } from '../components/widgets/NotificationCenter';
import { ThinkTank } from '../components/widgets/ThinkTank';

export function Briefing() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neon-cyan text-glow-cyan">Briefing</h1>
        <p className="text-sm text-text-muted mt-1">Was war, was kommt, was jetzt zu tun ist</p>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Daily Briefing with project status + recommendations */}
        <div className="lg:col-span-2 animate-fade-in stagger-1">
          <SectionLabel number="01" title="DAILY BRIEFING" />
          <WelcomeBriefing />
        </div>

        {/* Right: Priorities + Notifications stacked */}
        <div className="space-y-6">
          <div className="animate-fade-in stagger-2">
            <SectionLabel number="02" title="PRIORITIES" />
            <PriorityList />
          </div>

          <div className="animate-fade-in stagger-3">
            <SectionLabel number="03" title="NOTIFICATIONS" />
            <NotificationCenter />
          </div>
        </div>
      </div>

      {/* Think Tank — full width below */}
      <section className="mt-8 animate-fade-in stagger-4">
        <SectionLabel number="04" title="THINK TANK" />
        <ThinkTank />
      </section>
    </PageContainer>
  );
}
