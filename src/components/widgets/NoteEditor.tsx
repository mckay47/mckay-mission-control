import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const initialContent = `# Session Notes — 2026-03-28

## Priorities
- Hebammenbuero extended mockup (6 additional pages)
- Validate mockup with 2-3 real midwives
- Build stillprobleme.de Phase 0 mockup

## Decisions
- Mission Control becomes the MCKAY.AGENCY CI direction
- Sci-Fi Command Center aesthetic — dark mode, glassmorphism, neon accents
- All dummy data sourced from real MCKAY OS files

## Ideas
- Consider voice AI integration for midwife onboarding
- Gastro Suite as next pipeline candidate
- SmartHome X needs more market research before proceeding

## Open Questions
- Pricing model for Stillprobleme.de: commission vs. subscription?
- Which midwives to contact for validation?
`;

export function NoteEditor() {
  const [content, setContent] = useState(initialContent);

  return (
    <GlassCard className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
        <StickyNote className="w-5 h-5 text-neon-yellow" />
        <h2 className="text-base font-semibold text-text-primary">Notizen</h2>
        <span className="ml-auto text-xs text-text-muted">
          {content.split('\n').length} Zeilen
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3 text-sm text-text-secondary font-mono leading-relaxed focus:outline-none focus:border-neon-cyan/30 transition-colors resize-none scrollbar-thin"
        spellCheck={false}
      />
    </GlassCard>
  );
}
