import { useState } from 'react';
import { Shield, Layers, Globe, Plug, Search, Loader2, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';
import { SectionLabel } from '../ui/SectionLabel';
import { skills, projects } from '../../data/dummy';
import type { SkillCategory } from '../../data/types';
import type { ReactNode } from 'react';

const categoryOrder: SkillCategory[] = ['core', 'project-types', 'domains', 'integrations'];

const categoryLabels: Record<SkillCategory, string> = {
  core: 'Core',
  'project-types': 'Project Types',
  domains: 'Domains',
  integrations: 'Integrations',
};

const categoryIcons: Record<SkillCategory, ReactNode> = {
  core: <Shield className="w-4 h-4 text-neon-cyan" />,
  'project-types': <Layers className="w-4 h-4 text-neon-purple" />,
  domains: <Globe className="w-4 h-4 text-neon-orange" />,
  integrations: <Plug className="w-4 h-4 text-neon-green" />,
};

function getProjectsUsingSkill(skillName: string): string[] {
  return projects
    .filter((p) => p.skills.some((s) => s.includes(skillName)))
    .map((p) => p.name);
}

type SearchState = 'idle' | 'loading' | 'result';

export function SkillInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [resultSkillName, setResultSkillName] = useState('');

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setResultSkillName(trimmed);
    setSearchState('loading');

    setTimeout(() => {
      setSearchState('result');
    }, 1500);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDismissResult = () => {
    setSearchState('idle');
    setSearchQuery('');
    setResultSkillName('');
  };

  const grouped = categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    icon: categoryIcons[category],
    items: skills.filter((s) => s.category === category),
  }));

  return (
    <GlassCard elevated className="animate-fade-in">
      <SectionLabel number="07" title="SKILLS" />

      {/* Search input */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Neuen Skill recherchieren..."
              disabled={searchState === 'loading'}
              className="w-full bg-white/[0.03] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/40 transition-colors disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || searchState === 'loading'}
            className="p-2.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Loading animation */}
        {searchState === 'loading' && (
          <div className="flex items-center justify-center gap-2 mt-4 py-4 animate-fade-in">
            <Loader2 className="w-4 h-4 text-neon-purple animate-spin" />
            <span className="text-sm text-text-secondary">Recherchiere Skill...</span>
          </div>
        )}

        {/* Result card */}
        {searchState === 'result' && (
          <div className="mt-3 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-medium text-neon-green">Ergebnis</span>
            </div>
            <p className="text-sm text-text-secondary">
              Skill <span className="text-text-primary font-medium">{resultSkillName}</span> ist kompatibel mit deinem Setup
            </p>
            <button
              onClick={handleDismissResult}
              className="mt-2 text-[11px] text-text-muted hover:text-text-secondary transition-colors"
            >
              Schliessen
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {grouped.map((group, gi) => (
          <div key={group.category} className={`stagger-${Math.min(gi + 1, 7)} animate-fade-in`}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3">
              {group.icon}
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                {group.label}
              </span>
              <span className="text-[10px] text-text-muted tabular-nums">({group.items.length})</span>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {group.items.map((skill) => {
                const usedBy = getProjectsUsingSkill(skill.name);
                return (
                  <div
                    key={skill.name}
                    className="glass rounded-xl p-3 flex items-start gap-2.5"
                  >
                    <StatusDot
                      status={skill.status === 'active' ? 'healthy' : 'attention'}
                      pulse={skill.status === 'active'}
                      className="mt-1 w-2 h-2"
                    />
                    <div className="min-w-0">
                      <span className="text-sm text-text-primary block truncate">{skill.name}</span>
                      {usedBy.length > 0 && (
                        <span className="text-[10px] text-text-muted truncate block">
                          {usedBy.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
