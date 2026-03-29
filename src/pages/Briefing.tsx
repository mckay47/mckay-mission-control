import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Lightbulb, CalendarClock, Zap, BarChart3 } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BarChart } from '../components/ui/BarChart';
import { projects, initialTodos } from '../data/dummy';

type TimeFilter = 'gestern' | 'letzte-woche' | 'letzter-monat';

const filterLabels: Record<TimeFilter, string> = {
  'gestern': 'Gestern',
  'letzte-woche': 'Letzte Woche',
  'letzter-monat': 'Letzter Monat',
};

const buildingProjects = projects.filter((p) => p.status === 'building');

const projectTodoData = buildingProjects.map((p) => ({
  label: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
  value: initialTodos.filter((t) => t.projectId === p.id).length,
  color: p.id === 'hebammenbuero' ? '#00F0FF' : p.id === 'tenniscoach-pro' ? '#00FF88' : '#FF6B2C',
}));

const projectProgress: { name: string; change: number; color: 'cyan' | 'green' | 'orange' }[] = [
  { name: 'Hebammenbuero', change: 8, color: 'cyan' },
  { name: 'TennisCoach Pro', change: 5, color: 'green' },
  { name: 'Stillprobleme.de', change: 3, color: 'orange' },
];

const topProjects = [
  {
    name: 'Hebammenbuero',
    revenue: '240.000/Jahr',
    margin: '75%',
    why: 'Mockup fast fertig, Validation geplant, groesster Markt',
  },
  {
    name: 'TennisCoach Pro',
    revenue: '600.000/Jahr',
    margin: '75%',
    why: 'Backend fertig, Testing-Phase, hoechstes Umsatzpotenzial',
  },
  {
    name: 'Stillprobleme.de',
    revenue: '395.000/Jahr',
    margin: '80%',
    why: '80% Skill-Overlap mit Hebammenbuero, schneller Aufbau',
  },
];

const nextDeadlines = [
  { date: '30.03.', text: 'Hebammenbuero Mockup erweitern' },
  { date: '02.04.', text: 'Stillprobleme.de Phase 0 Mockup' },
  { date: '05.04.', text: 'Validation mit Hebammen' },
  { date: '10.04.', text: 'TennisCoach Pro Phase 4/5 planen' },
];

const insights = [
  {
    icon: <Zap className="w-5 h-5 text-neon-cyan" />,
    text: 'Hebammenbuero und Stillprobleme teilen 80% der Skills — parallele Entwicklung spart 40% Zeit',
  },
  {
    icon: <CalendarClock className="w-5 h-5 text-neon-orange" />,
    text: 'TennisCoach Pro: Stripe-Integration dauert ca. 2 Tage — frueh einplanen',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-neon-green" />,
    text: 'Token-Verbrauch 20% unter Durchschnitt — effiziente Prompts zahlen sich aus',
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-neon-purple" />,
    text: 'Pipeline hat 5 Ideen — Gastro Suite und Immobilien Pro zeigen staerkstes Potenzial',
  },
];

export function Briefing() {
  const [filter, setFilter] = useState<TimeFilter>('letzte-woche');
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <SectionLabel number="" title="BRIEFING" className="!mb-2" />
        <p className="text-sm text-text-muted">Was war, was kommt, was KANI denkt</p>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in stagger-1">
        {(Object.keys(filterLabels) as TimeFilter[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`physical-btn px-4 py-2 text-sm transition-all ${
              filter === key
                ? '!border-neon-cyan/30 text-neon-cyan box-glow-cyan'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {filterLabels[key]}
          </button>
        ))}
      </div>

      {/* 01 / RUECKBLICK */}
      <section className="mb-8 animate-fade-in stagger-2">
        <SectionLabel number="01" title="RUECKBLICK" />
        <GlassCard elevated>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Stats + progress bars */}
            <div>
              {/* Key metrics */}
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <AnimatedNumber value={12} color="green" size="sm" />
                  <p className="text-xs text-text-muted mt-1">Todos erledigt diese Woche</p>
                </div>
                <div>
                  <AnimatedNumber value={3} color="cyan" size="sm" />
                  <p className="text-xs text-text-muted mt-1">Projekte bearbeitet</p>
                </div>
              </div>

              {/* Per-project progress */}
              <div className="space-y-3">
                {projectProgress.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text-secondary">{p.name}</span>
                      <span className="flex items-center gap-1 text-xs text-neon-green tabular-nums">
                        <TrendingUp className="w-3 h-3" />
                        +{p.change}%
                      </span>
                    </div>
                    <ProgressBar value={p.change * 8} color={p.color} height="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Bar chart */}
            <div>
              <span className="hud-label block mb-3"><span>TODO</span> / PRO PROJEKT</span>
              <div className="inset-display">
                <BarChart data={projectTodoData} height={160} />
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 02 / AUSBLICK */}
      <section className="mb-8 animate-fade-in stagger-3">
        <SectionLabel number="02" title="AUSBLICK" />
        <GlassCard elevated>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top projects by potential */}
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-3">
                Top-Projekte nach Potenzial
              </span>
              <div className="space-y-3">
                {topProjects.map((p, i) => (
                  <div
                    key={p.name}
                    className="glass rounded-xl p-3 flex items-start gap-3 scan-line-container"
                  >
                    <span className="text-xs text-neon-cyan tabular-nums font-bold mt-0.5">
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-text-primary">{p.name}</span>
                        <span className="text-[10px] text-neon-green tabular-nums">
                          EUR {p.revenue}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {p.margin} Marge
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">{p.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next deadlines */}
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-3">
                Naechste Deadlines
              </span>
              <div className="space-y-2">
                {nextDeadlines.map((d, i) => (
                  <div
                    key={i}
                    className="inset-display flex items-center gap-3 !py-2.5"
                  >
                    <CalendarClock className="w-3.5 h-3.5 text-neon-orange shrink-0" />
                    <span className="text-xs text-neon-orange tabular-nums font-medium w-12 shrink-0">
                      {d.date}
                    </span>
                    <span className="text-sm text-text-secondary truncate">{d.text}</span>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="mt-4 p-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-xs font-medium text-neon-cyan">Empfehlung</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Hebammenbuero Mockup priorisieren — EUR 240K/Jahr Potenzial bei niedrigstem Restaufwand
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 03 / KANI INSIGHTS */}
      <section className="mb-8 animate-fade-in stagger-4">
        <SectionLabel number="03" title="KANI INSIGHTS" />
        <GlassCard elevated>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="glass rounded-xl p-4 flex items-start gap-3 scan-line-container"
              >
                <div className="shrink-0 mt-0.5">{insight.icon}</div>
                <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Bottom navigation */}
      <div className="flex items-center justify-center gap-4 animate-fade-in stagger-5">
        <button
          onClick={() => navigate('/')}
          className="physical-btn px-6 py-3 text-sm text-neon-cyan hover:box-glow-cyan"
        >
          Cockpit
        </button>
        <button
          onClick={() => navigate('/operator')}
          className="physical-btn px-6 py-3 text-sm text-neon-orange hover:box-glow-orange"
        >
          Arbeitsplatz
        </button>
        <button
          onClick={() => navigate('/lab')}
          className="physical-btn px-6 py-3 text-sm text-neon-purple hover:box-glow-purple"
        >
          Lab
        </button>
      </div>
    </PageContainer>
  );
}
