import { useState, useMemo } from 'react';
import { FlaskConical, Send, Rocket, Search, Trash2, ParkingCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { GlowBadge } from '../components/ui/GlowBadge';
import { useToast } from '../components/ui';
import { pipelineIdeasV2 } from '../data/dummy';
import type { PipelineIdeaV2 } from '../data/types';

type EntryCategory = 'alle' | 'Ideen' | 'Research' | 'Strategie' | 'Projekte' | 'Privat';

const categoryColors: Record<string, 'cyan' | 'green' | 'orange' | 'pink' | 'purple'> = {
  'Industry SaaS': 'cyan',
  'Marketplace': 'orange',
  'Research': 'green',
  'Strategie': 'purple',
  'Projekte': 'pink',
  'Privat': 'pink',
  'Ideen': 'cyan',
};

function classifyType(type: string): EntryCategory {
  const lower = type.toLowerCase();
  if (lower.includes('research')) return 'Research';
  if (lower.includes('strateg')) return 'Strategie';
  if (lower.includes('projekt') || lower.includes('project')) return 'Projekte';
  if (lower.includes('privat') || lower.includes('personal')) return 'Privat';
  return 'Ideen';
}

export function Lab() {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<PipelineIdeaV2[]>(pipelineIdeasV2);
  const [activeCategory, setActiveCategory] = useState<EntryCategory>('alle');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [kaniResponse, setKaniResponse] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const category = trimmed.toLowerCase().includes('strateg')
      ? 'Strategie'
      : trimmed.toLowerCase().includes('research')
        ? 'Research'
        : 'Ideen';

    const newEntry: PipelineIdeaV2 = {
      id: `entry-${Date.now()}`,
      name: trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : ''),
      rawTranscript: trimmed,
      structuredVersion: `Eingabe wird von KANI analysiert und strukturiert...\n\nOriginal: "${trimmed.slice(0, 100)}"`,
      type: category === 'Strategie' ? 'Strategie' : category === 'Research' ? 'Research' : 'Industry SaaS',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setEntries((prev) => [newEntry, ...prev]);
    setInput('');
    setKaniResponse(`Habe ich als "${category}" eingeordnet. Du findest den Eintrag jetzt in der Liste.`);
    setTimeout(() => setKaniResponse(null), 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handlePark = (id: string) => {
    showToast('Idee geparkt');
    handleDelete(id);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<EntryCategory, number> = {
      alle: entries.length,
      Ideen: 0,
      Research: 0,
      Strategie: 0,
      Projekte: 0,
      Privat: 0,
    };
    for (const e of entries) {
      const cat = classifyType(e.type);
      counts[cat]++;
    }
    return counts;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (activeCategory === 'alle') return entries;
    return entries.filter((e) => classifyType(e.type) === activeCategory);
  }, [entries, activeCategory]);

  const categories: EntryCategory[] = ['alle', 'Ideen', 'Research', 'Strategie', 'Projekte', 'Privat'];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <FlaskConical className="w-7 h-7 text-neon-purple" />
        <div>
          <h1 className="text-3xl font-bold text-neon-purple text-glow-purple">Lab</h1>
          <p className="text-sm text-text-muted mt-0.5">Gedanken teilen, strukturieren, handeln</p>
        </div>
      </div>

      {/* 01 / GEDANKEN TEILEN */}
      <section className="mb-8 animate-fade-in stagger-1">
        <SectionLabel number="01" title="GEDANKEN TEILEN" />
        <GlassCard elevated>
          <div className="terminal-panel !border-0 !rounded-xl mb-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Teile deine Gedanken — Idee, Strategie, Frage, alles..."
              rows={6}
              className="w-full bg-transparent px-5 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all resize-none leading-relaxed"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="physical-btn px-6 py-3 flex items-center justify-center gap-2.5 text-sm font-medium text-neon-purple w-full disabled:opacity-30 disabled:cursor-not-allowed hover:box-glow-purple"
          >
            <Send className="w-4 h-4" />
            Absenden
          </button>

          {/* KANI response */}
          {kaniResponse && (
            <div className="mt-4 p-3 rounded-xl bg-neon-green/5 border border-neon-green/20 animate-fade-in">
              <span className="text-xs font-medium text-neon-green block mb-1">KANI</span>
              <p className="text-sm text-text-secondary">{kaniResponse}</p>
            </div>
          )}
        </GlassCard>
      </section>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in stagger-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`physical-btn px-3 py-1.5 text-xs transition-all ${
              activeCategory === cat
                ? '!border-neon-purple/30 text-neon-purple box-glow-purple'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {cat === 'alle' ? 'Alle' : cat}: {categoryCounts[cat]}
          </button>
        ))}
      </div>

      {/* 02 / EINTRAEGE */}
      <section className="animate-fade-in stagger-3">
        <SectionLabel number="02" title="EINTRAEGE" />
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const badgeColor = categoryColors[entry.type] || 'cyan';

            return (
              <GlassCard key={entry.id} className="!p-4 scan-line-container">
                {/* Top row: name, type, date */}
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-text-primary flex-1 truncate">
                    {entry.name}
                  </h3>
                  <GlowBadge color={badgeColor} className="text-[10px] !px-2 !py-0 shrink-0">
                    {entry.type}
                  </GlowBadge>
                  <span className="text-[10px] text-text-muted tabular-nums shrink-0">
                    {entry.createdAt}
                  </span>
                </div>

                {/* Structured version — always visible */}
                <p className="text-xs text-text-secondary leading-relaxed mb-2 whitespace-pre-line line-clamp-3">
                  {entry.structuredVersion}
                </p>

                {/* Raw transcript — collapsible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors mb-3"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Original-Text {isExpanded ? 'ausblenden' : 'anzeigen'}
                </button>
                {isExpanded && (
                  <div className="mb-3 inset-display animate-fade-in">
                    <p className="text-xs text-text-muted leading-relaxed italic font-mono">
                      {entry.rawTranscript}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => showToast('Modul noch nicht aktiviert')}
                    className="physical-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-neon-cyan hover:box-glow-cyan"
                  >
                    <Rocket className="w-3 h-3" />
                    Projekt starten
                  </button>
                  <button
                    onClick={() => showToast('Modul noch nicht aktiviert')}
                    className="physical-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-neon-green hover:box-glow-green"
                  >
                    <Search className="w-3 h-3" />
                    Research starten
                  </button>
                  <button
                    onClick={() => handlePark(entry.id)}
                    className="physical-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-text-muted hover:text-text-secondary"
                  >
                    <ParkingCircle className="w-3 h-3" />
                    Parken
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="physical-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-text-muted hover:text-status-critical ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    Loeschen
                  </button>
                </div>
              </GlassCard>
            );
          })}

          {filteredEntries.length === 0 && (
            <GlassCard className="text-center py-12">
              <p className="text-sm text-text-muted">Keine Eintraege in dieser Kategorie</p>
            </GlassCard>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
