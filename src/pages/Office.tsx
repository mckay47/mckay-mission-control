import { useState } from 'react';
import { Calendar, Clock, Mail, Reply, ParkingCircle, Lock } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { StatusDot } from '../components/ui/StatusDot';
import { useToast } from '../components/ui';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { NoteEditor } from '../components/widgets/NoteEditor';

type CalendarView = 'tag' | 'woche' | 'monat';
type TodoMode = 'privat' | 'projekte';

const dummyCalendar = [
  { time: '09:00', title: 'Standup mit KANI', type: 'work' as const },
  { time: '11:00', title: 'Hebammenbuero Review', type: 'work' as const },
  { time: '14:00', title: 'Call mit Designer', type: 'work' as const },
  { time: '16:00', title: 'TennisCoach Pro Testing', type: 'work' as const },
];

const dummyEmails = [
  {
    id: '1',
    from: 'Rechtsanwalt',
    subject: 'Vertrag Unterschrift',
    preview: 'Bitte pruefen und unterzeichnen Sie den beigefuegten Vertragsentwurf...',
    auto: false,
  },
  {
    id: '2',
    from: 'Hetzner',
    subject: 'Angebot Hosting',
    preview: 'Vielen Dank fuer Ihre Anfrage. Im Anhang finden Sie unser Angebot...',
    auto: false,
  },
  {
    id: '3',
    from: 'TechCrunch',
    subject: 'Newsletter — AI Startup Trends',
    preview: 'Die neuesten Trends im AI Startup Oekosystem...',
    auto: true,
  },
  {
    id: '4',
    from: 'Stripe',
    subject: 'Monatliche Abrechnung',
    preview: 'Ihre Abrechnung fuer Maerz 2026 ist jetzt verfuegbar...',
    auto: true,
  },
];

const futureModules = [
  { name: 'E-Mail Agent', icon: Mail },
  { name: 'Kontakte', icon: Mail },
  { name: 'Finanzen', icon: Mail },
  { name: 'Dokumente', icon: Mail },
];

const typeColors: Record<string, 'healthy' | 'attention'> = {
  work: 'healthy',
  personal: 'attention',
};

export function Office() {
  const { showToast } = useToast();
  const [calendarView, setCalendarView] = useState<CalendarView>('tag');
  const [todoMode, setTodoMode] = useState<TodoMode>('privat');

  const handleCalendarViewChange = (view: CalendarView) => {
    if (view !== 'tag') {
      showToast('Modul noch nicht aktiviert');
      return;
    }
    setCalendarView(view);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neon-pink text-glow-pink">Office</h1>
        <p className="text-sm text-text-muted mt-1">Persoenlicher Arbeitsbereich</p>
      </div>

      {/* KPI bar */}
      <div className="flex items-center gap-6 mb-8 animate-fade-in stagger-1">
        <div className="flex items-center gap-2">
          <AnimatedNumber value={dummyCalendar.length} color="cyan" size="sm" />
          <span className="text-xs text-text-muted">Termine heute</span>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedNumber value={dummyEmails.filter((e) => !e.auto).length} color="orange" size="sm" />
          <span className="text-xs text-text-muted">Mails offen</span>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedNumber value={5} color="pink" size="sm" />
          <span className="text-xs text-text-muted">Todos privat</span>
        </div>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 01 / AUFGABEN */}
        <div className="animate-fade-in stagger-2">
          <SectionLabel number="01" title="AUFGABEN" />
          {/* Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setTodoMode('privat')}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                todoMode === 'privat'
                  ? 'glass-elevated border-neon-pink/30 text-neon-pink'
                  : 'glass border-white/8 text-text-muted hover:text-text-secondary'
              }`}
            >
              Privat
            </button>
            <button
              onClick={() => setTodoMode('projekte')}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                todoMode === 'projekte'
                  ? 'glass-elevated border-neon-cyan/30 text-neon-cyan'
                  : 'glass border-white/8 text-text-muted hover:text-text-secondary'
              }`}
            >
              Projekte
            </button>
          </div>
          {/* Show different Todo views based on mode */}
          {todoMode === 'projekte' ? (
            <TodoEditor />
          ) : (
            <TodoEditor />
          )}
        </div>

        {/* 02 / KALENDER */}
        <div className="animate-fade-in stagger-3">
          <SectionLabel number="02" title="KALENDER" />
          <GlassCard className="h-full">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
              <Calendar className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-base font-semibold text-text-primary">
                Heute &middot; 29. Maerz 2026
              </h2>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2 mb-4">
              {(['tag', 'woche', 'monat'] as CalendarView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => handleCalendarViewChange(view)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                    calendarView === view
                      ? 'glass-elevated border-neon-cyan/30 text-neon-cyan'
                      : 'glass border-white/8 text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>

            {/* Calendar entries */}
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

        {/* 03 / POSTEINGANG */}
        <div className="animate-fade-in stagger-4">
          <SectionLabel number="03" title="POSTEINGANG" />
          <GlassCard className="h-full">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
              <Mail className="w-5 h-5 text-neon-orange" />
              <h2 className="text-base font-semibold text-text-primary">E-Mails</h2>
              <span className="ml-auto text-xs text-text-muted tabular-nums">
                {dummyEmails.length} Nachrichten
              </span>
            </div>

            <div className="space-y-2">
              {dummyEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-3 rounded-lg border transition-all ${
                    email.auto
                      ? 'bg-white/[0.01] border-white/3 opacity-50'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-text-primary">
                      {email.subject}
                    </span>
                    {email.auto && (
                      <span className="text-[9px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                        auto
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted mb-0.5">von {email.from}</p>
                  <p className="text-xs text-text-muted truncate mb-2">{email.preview}</p>
                  {!email.auto && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast('Modul noch nicht aktiviert')}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 transition-all"
                      >
                        <Reply className="w-3 h-3" />
                        Antworten
                      </button>
                      <button
                        onClick={() => showToast('Modul noch nicht aktiviert')}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-white/5 border border-white/8 text-text-muted hover:text-text-secondary transition-all"
                      >
                        <ParkingCircle className="w-3 h-3" />
                        Parken
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 04 / NOTIZEN — full width */}
      <section className="mb-8 animate-fade-in stagger-5">
        <SectionLabel number="04" title="NOTIZEN" />
        <div className="min-h-[300px]">
          <NoteEditor />
        </div>
      </section>

      {/* Future modules */}
      <section className="animate-fade-in stagger-6">
        <SectionLabel number="05" title="KOMMENDE MODULE" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {futureModules.map((mod) => (
            <GlassCard key={mod.name} className="!p-4 text-center opacity-40">
              <Lock className="w-5 h-5 text-text-muted mx-auto mb-2" />
              <span className="text-xs text-text-muted block">{mod.name}</span>
              <span className="text-[10px] text-text-muted mt-1 block">Kommt bald</span>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
