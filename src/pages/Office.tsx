import { Calendar, Clock } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { StatusDot } from '../components/ui/StatusDot';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { ComposePanel } from '../components/widgets/ComposePanel';
import { NoteEditor } from '../components/widgets/NoteEditor';

const dummyCalendar = [
  { time: '09:00', title: 'Daily Review — MCKAY OS', type: 'work' as const },
  { time: '10:30', title: 'Hebammenbuero Mockup Review', type: 'work' as const },
  { time: '12:00', title: 'Mittagspause', type: 'personal' as const },
  { time: '14:00', title: 'TennisCoach Pro — Phase 4 Planung', type: 'work' as const },
  { time: '16:00', title: 'Kinder abholen', type: 'personal' as const },
  { time: '20:00', title: 'Stillprobleme.de Strategie', type: 'work' as const },
];

const typeColors: Record<string, 'healthy' | 'attention'> = {
  work: 'healthy',
  personal: 'attention',
};

export function Office() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neon-pink text-glow-pink">Office</h1>
        <p className="text-sm text-text-muted mt-1">Aufgaben &middot; Kalender &middot; Nachrichten</p>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 01 / AUFGABEN */}
        <div className="animate-fade-in stagger-1">
          <SectionLabel number="01" title="AUFGABEN" />
          <TodoEditor />
        </div>

        {/* 02 / KALENDER */}
        <div className="animate-fade-in stagger-2">
          <SectionLabel number="02" title="KALENDER" />
          <GlassCard className="h-full">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
              <Calendar className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-base font-semibold text-text-primary">Heute</h2>
              <span className="ml-auto text-xs text-text-muted tabular-nums">
                {dummyCalendar.length} Termine
              </span>
            </div>

            <div className="space-y-2">
              {dummyCalendar.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <StatusDot status={typeColors[entry.type]} pulse={false} />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Clock className="w-3 h-3 text-text-muted shrink-0" />
                    <span className="text-xs text-text-muted tabular-nums shrink-0">
                      {entry.time}
                    </span>
                    <span className="text-sm text-text-secondary truncate">
                      {entry.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-center">
              <span className="text-xs text-text-muted">
                Kalender-Integration kommt bald
              </span>
            </div>
          </GlassCard>
        </div>

        {/* 03 / NACHRICHTEN */}
        <div className="animate-fade-in stagger-3">
          <SectionLabel number="03" title="NACHRICHTEN" />
          <ComposePanel />
        </div>
      </div>

      {/* Notizen — full width */}
      <section className="animate-fade-in stagger-4">
        <SectionLabel number="04" title="NOTIZEN" />
        <div className="min-h-[300px]">
          <NoteEditor />
        </div>
      </section>
    </PageContainer>
  );
}
