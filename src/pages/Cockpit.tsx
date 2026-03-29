import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gauge,
  FolderKanban,
  ListTodo,
  FlaskConical,
  Cpu,
  Briefcase,
  ArrowLeft,
  Activity,
  DollarSign,
  Zap,
  Lightbulb,
} from 'lucide-react';
import { PageContainer } from '../components/layout';
import {
  RadialGauge,
  WaveChart,
  StatusDot,
  GlowBadge,
  GlassCard,
  SectionLabel,
  ProgressBar,
  BarChart,
  useToast,
} from '../components/ui';
import { TodoEditor, ProjectCard } from '../components/widgets';
import { projects, globalKPIs, initialTodos } from '../data/dummy';
import { PRODUCT_STEPS } from '../data/types';
import type { Project } from '../data/types';
import { useClock } from '../hooks/useClock';

// ─── Types ────────────────────────────────────────────────────
type MonitorId = 'maschinenraum' | 'projekte' | 'todos' | 'lab' | 'system' | 'office';

interface MonitorTile {
  id: MonitorId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  colorClass: string;
  /** If set, clicking navigates to route instead of expanding */
  route?: string;
  previewKPI: { value: string | number; label: string };
}

// ─── Helpers ──────────────────────────────────────────────────
const phaseColorMap: Record<Project['phase'], 'cyan' | 'green' | 'orange' | 'pink' | 'purple'> = {
  'Phase 0': 'cyan',
  'Phase 1': 'purple',
  'Phase 2': 'orange',
  'Phase 3': 'pink',
  Live: 'green',
};

const buildingProjects = projects.filter((p) => p.status === 'building');
const liveProjects = projects.filter((p) => p.status === 'live');
const openTodos = initialTodos.filter((t) => !t.done).length;
const totalCost = projects.reduce((sum, p) => sum + p.monthlyCost, 0);

// ─── Monitor definitions ──────────────────────────────────────
const monitors: MonitorTile[] = [
  {
    id: 'maschinenraum',
    label: 'Maschinenraum',
    sublabel: 'Echtzeit-Status aller Projekte',
    icon: <Gauge className="w-7 h-7" />,
    colorClass: 'monitor-cyan',
    previewKPI: { value: projects.length, label: 'Projekte' },
  },
  {
    id: 'projekte',
    label: 'Projekte',
    sublabel: 'In Arbeit + Live',
    icon: <FolderKanban className="w-7 h-7" />,
    colorClass: 'monitor-green',
    previewKPI: { value: `${buildingProjects.length} + ${liveProjects.length}`, label: 'Building / Live' },
  },
  {
    id: 'todos',
    label: 'Aufgaben',
    sublabel: 'Offene To-Dos verwalten',
    icon: <ListTodo className="w-7 h-7" />,
    colorClass: 'monitor-orange',
    previewKPI: { value: openTodos, label: 'Offen' },
  },
  {
    id: 'lab',
    label: 'Labor',
    sublabel: 'Pipeline + Ideen',
    icon: <FlaskConical className="w-7 h-7" />,
    colorClass: 'monitor-pink',
    route: '/lab',
    previewKPI: { value: 5, label: 'Pipeline' },
  },
  {
    id: 'system',
    label: 'System',
    sublabel: 'Skills, Agents, MCP',
    icon: <Cpu className="w-7 h-7" />,
    colorClass: 'monitor-purple',
    route: '/system',
    previewKPI: { value: 16, label: 'Skills' },
  },
  {
    id: 'office',
    label: 'Office',
    sublabel: 'Notizen, Compose, Persoenlich',
    icon: <Briefcase className="w-7 h-7" />,
    colorClass: 'monitor-yellow',
    route: '/office',
    previewKPI: { value: '---', label: 'Phase 0' },
  },
];

// ─── Mini KPI data ────────────────────────────────────────────
const miniKPIs = [
  { icon: <Activity className="w-3.5 h-3.5" />, label: 'Projekte', value: `${projects.length}`, color: 'text-neon-cyan' },
  { icon: <DollarSign className="w-3.5 h-3.5" />, label: 'Kosten', value: `€${totalCost.toFixed(0)}/mo`, color: 'text-neon-orange' },
  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Tokens', value: '175K', color: 'text-neon-green' },
  { icon: <Lightbulb className="w-3.5 h-3.5" />, label: 'Pipeline', value: '5', color: 'text-neon-purple' },
];

// ─── Cost bar chart data ──────────────────────────────────────
const costData = projects.map((p) => ({
  label: p.name.length > 10 ? p.name.slice(0, 10) + '...' : p.name,
  value: p.monthlyCost,
  color: p.status === 'live' ? '#00FF88' : '#00F0FF',
}));

// ═══════════════════════════════════════════════════════════════
// COCKPIT COMPONENT
// ═══════════════════════════════════════════════════════════════

export function Cockpit() {
  const [activeMonitor, setActiveMonitor] = useState<MonitorId | null>(null);
  const navigate = useNavigate();
  const { time, date } = useClock();
  useToast(); // available for future use

  // ── Handle tile click ───────────────────────────────────────
  const handleTileClick = (tile: MonitorTile) => {
    if (tile.route) {
      navigate(tile.route);
    } else {
      setActiveMonitor(tile.id);
    }
  };

  // ── Back to grid ────────────────────────────────────────────
  const handleBack = () => setActiveMonitor(null);

  // ═══════════════════════════════════════════════════════════
  // MASCHINENRAUM — fullscreen content
  // ═══════════════════════════════════════════════════════════
  const renderMaschinenraum = () => (
    <div className="animate-zoom-in">
      <SectionLabel number="01" title="MASCHINENRAUM" />

      {/* Overview metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {globalKPIs.map((kpi) => (
          <GlassCard key={kpi.label} className="text-center py-4">
            <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold tabular-nums text-neon-${kpi.color} text-glow-${kpi.color}`}>
              {kpi.value}
            </p>
            {kpi.change && (
              <span className="text-[10px] text-neon-green mt-0.5 inline-block">{kpi.change}</span>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Projects with gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {projects.map((project) => (
          <GlassCard
            key={project.id}
            scan
            className="cursor-pointer hover:border-white/10 transition-all"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className="flex items-start gap-4">
              <RadialGauge
                value={project.progressPercent}
                size={90}
                color={phaseColorMap[project.phase]}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot status={project.health} />
                  <h3 className="text-base font-semibold text-text-primary truncate">{project.name}</h3>
                  <GlowBadge color={phaseColorMap[project.phase]} className="text-[10px] !px-1.5 !py-0">
                    {project.phase}
                  </GlowBadge>
                </div>
                <p className="text-xs text-text-muted mb-2">{project.domain}</p>

                {/* Step progress */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-text-muted">
                      Step {project.currentStep}/10 — {PRODUCT_STEPS[project.currentStep - 1]}
                    </span>
                    <span className="text-[10px] tabular-nums text-neon-cyan">{project.progressPercent}%</span>
                  </div>
                  <ProgressBar value={project.progressPercent} color={phaseColorMap[project.phase]} height="sm" />
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-text-muted">
                    Tokens: <span className="text-neon-green tabular-nums">{project.tokenUsage >= 1000 ? `${Math.round(project.tokenUsage / 1000)}K` : project.tokenUsage}</span>
                  </span>
                  <span className="text-text-muted">
                    Kosten: <span className="text-neon-orange tabular-nums">{project.monthlyCost.toFixed(2).replace('.', ',')} EUR</span>
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Wave visualization + cost chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">System-Aktivitaet</h3>
          <WaveChart color="#00F0FF" height={100} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Kosten pro Projekt (EUR/mo)</h3>
          <BarChart data={costData} height={100} />
        </GlassCard>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // PROJEKTE — fullscreen content (In Arbeit + Live split)
  // ═══════════════════════════════════════════════════════════
  const renderProjekte = () => (
    <div className="animate-zoom-in">
      <SectionLabel number="02" title="PROJEKTE" />

      {/* In Arbeit */}
      <div className="mb-8">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
          In Arbeit ({buildingProjects.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {buildingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Live */}
      {liveProjects.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
            Live ({liveProjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {liveProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // TODOS — fullscreen content
  // ═══════════════════════════════════════════════════════════
  const renderTodos = () => (
    <div className="animate-zoom-in max-w-3xl">
      <SectionLabel number="03" title="AUFGABEN" />
      <TodoEditor />
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // FULLSCREEN WRAPPER
  // ═══════════════════════════════════════════════════════════
  const renderFullscreen = () => {
    const activeTile = monitors.find((m) => m.id === activeMonitor);
    if (!activeTile) return null;

    let content: React.ReactNode = null;
    switch (activeMonitor) {
      case 'maschinenraum':
        content = renderMaschinenraum();
        break;
      case 'projekte':
        content = renderProjekte();
        break;
      case 'todos':
        content = renderTodos();
        break;
      default:
        return null;
    }

    return (
      <div>
        {/* Back button */}
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-glass-bg border border-glass-border hover:border-white/15 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-text-muted group-hover:text-neon-cyan transition-colors" />
          <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
            Zurueck zum Cockpit
          </span>
        </button>

        {content}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // 6-TILE GRID VIEW
  // ═══════════════════════════════════════════════════════════
  const renderGrid = () => (
    <div>
      {/* Welcome */}
      <div className="mb-6 animate-fade-in stagger-1">
        <h1 className="text-3xl font-light text-text-primary text-glow-cyan mb-1">
          Cockpit
        </h1>
        <p className="text-sm text-text-muted tabular-nums">
          {date} &middot; {time}
        </p>
      </div>

      {/* Mini-KPI bar — always visible */}
      <div className="flex items-center gap-5 mb-8 animate-fade-in stagger-2">
        {miniKPIs.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-1.5">
            <span className={`${kpi.color} opacity-60`}>{kpi.icon}</span>
            <span className="text-[11px] text-text-muted">{kpi.label}</span>
            <span className={`text-xs font-semibold tabular-nums ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* 3x2 monitor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {monitors.map((tile, i) => (
          <div
            key={tile.id}
            className={`monitor-tile ${tile.colorClass} p-6 min-h-[200px] flex flex-col justify-between animate-fade-in stagger-${Math.min(i + 2, 7)}`}
            onClick={() => handleTileClick(tile)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleTileClick(tile)}
          >
            {/* Inner glow */}
            <div className="monitor-glow-inner" />

            {/* Top: icon + label */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-text-secondary opacity-80">{tile.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{tile.label}</h2>
                  <p className="text-[11px] text-text-muted">{tile.sublabel}</p>
                </div>
              </div>
            </div>

            {/* Bottom: preview KPI */}
            <div className="relative z-10 mt-4">
              <span className="text-3xl font-bold tabular-nums text-text-primary">
                {tile.previewKPI.value}
              </span>
              <span className="text-xs text-text-muted ml-2">{tile.previewKPI.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <PageContainer>
      {activeMonitor ? renderFullscreen() : renderGrid()}
    </PageContainer>
  );
}
