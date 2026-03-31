import type { Project, Agent, Skill, Idea, Todo, Notification, CalendarEntry, MemoryFile } from './types'

export const PROJ: Project[] = [
  { id: 'heb', n: 'Hebammenbuero', e: '\u{1F3E5}', pct: 65, phN: 2, phase: 'Phase 2', health: 'Healthy', col: 'var(--bl)', cr: '68,153,255', tkn: 42, cost: 12.50, days: 47, term: 'Waiting', dom: 'hebammenbuero.de', stack: 'React+Vite \u00b7 Supabase \u00b7 Vercel', model: 'Setup \u20ac499 + \u20ac49/Mo', prompts: 284, last: 'Extended Mockup 6 Seiten', next: 'Validation mit Hebammen', todos: 4, ideas: 6, rev: 240, mkt: '\u20ac180M TAM' },
  { id: 'stl', n: 'Stillprobleme', e: '\u{1F931}', pct: 25, phN: 0, phase: 'Phase 0', health: 'Attention', col: 'var(--a)', cr: '255,184,0', tkn: 12, cost: 3.80, days: 18, term: 'Idle', dom: 'stillprobleme.de', stack: 'Next.js \u00b7 Supabase+PostGIS \u00b7 Stripe', model: 'Freemium + \u20ac29/Mo', prompts: 89, last: 'Launch Protocol ausgef\u00fchrt', next: 'MVP Mockup bauen', todos: 2, ideas: 8, rev: 180, mkt: '\u20ac95M TAM' },
  { id: 'ten', n: 'TennisCoach Pro', e: '\u{1F3BE}', pct: 80, phN: 3, phase: 'Phase 3', health: 'Healthy', col: 'var(--g)', cr: '0,232,136', tkn: 78, cost: 22.40, days: 94, term: 'Running', dom: 'tenniscoach.ai', stack: 'Next.js 16 \u00b7 Supabase \u00b7 Stripe', model: '\u20ac19/Mo \u00b7 \u20ac199 Jahresabo', prompts: 612, last: '27 Routes, DB migrated, Login OK', next: 'Phase 4: Stripe + Chat + Matching', todos: 3, ideas: 4, rev: 600, mkt: '\u20ac320M TAM' },
  { id: 'fnd', n: 'FindeMeine', e: '\u{1F50D}', pct: 100, phN: 4, phase: 'LIVE', health: 'Live', col: 'var(--c)', cr: '0,200,232', tkn: 15, cost: 14.00, days: 180, term: 'Running', dom: 'findemeinehebamme.de', stack: 'Next.js \u00b7 Supabase \u00b7 Google Maps', model: '\u20ac199 Hebammen/J', prompts: 98, last: '~100 Vermittlungen in 10 Wochen', next: 'v2.0 Rebuild auf KANI Stack', todos: 1, ideas: 3, rev: 36, mkt: '\u20ac180M TAM' },
]

export const AGENTS: Agent[] = [
  { n: 'KANI Master', e: '\u2b21', typ: 'Core', st: 'active', mdl: 'Opus', proj: 'All', tkn: '34.2K', cost: '\u20ac1.02', pr: 156, suc: 97, act: 'Mission Control V10 Build', col: 'var(--c)', bg: 'rgba(0,200,232,0.15)' },
  { n: 'Launch Agent', e: '\u{1F680}', typ: 'Core', st: 'active', mdl: 'Sonnet', proj: 'Stillprobleme', tkn: '8.2K', cost: '\u20ac0.24', pr: 42, suc: 98, act: 'stillprobleme.de Scaffold', col: 'var(--g)', bg: 'rgba(0,232,136,0.15)' },
  { n: 'Build Agent', e: '\u2328', typ: 'Core', st: 'active', mdl: 'Opus', proj: 'Mission Control', tkn: '12.1K', cost: '\u20ac0.36', pr: 67, suc: 94, act: 'V10 Foundation Build', col: 'var(--bl)', bg: 'rgba(68,153,255,0.15)' },
  { n: 'Ops Agent', e: '\u2699', typ: 'Core', st: 'ready', mdl: 'Sonnet', proj: 'All', tkn: '4.1K', cost: '\u20ac0.12', pr: 31, suc: 96, act: 'Daily Briefing bereit', col: 'var(--c)', bg: 'rgba(0,200,232,0.12)' },
  { n: 'Research Agent', e: '\u{1F52C}', typ: 'Specialist', st: 'idle', mdl: 'Sonnet', proj: '\u2014', tkn: '1.2K', cost: '\u20ac0.02', pr: 8, suc: 100, act: 'Letzte: Stillprobleme Markt', col: 'var(--a)', bg: 'rgba(255,184,0,0.12)' },
  { n: 'Sales Agent', e: '\u{1F4B0}', typ: 'Specialist', st: 'idle', mdl: 'Sonnet', proj: '\u2014', tkn: '0.5K', cost: '\u20ac0.01', pr: 4, suc: 100, act: 'Positioning Template', col: 'var(--o)', bg: 'rgba(255,119,68,0.12)' },
  { n: 'Strategy Agent', e: '\u{1F3AF}', typ: 'Specialist', st: 'ready', mdl: 'Sonnet', proj: 'All', tkn: '2.3K', cost: '\u20ac0.07', pr: 15, suc: 93, act: 'Portfolio-Analyse', col: 'var(--p)', bg: 'rgba(187,136,255,0.12)' },
  { n: 'Life Agent', e: '\u2600', typ: 'Specialist', st: 'idle', mdl: 'Haiku', proj: '\u2014', tkn: '0.3K', cost: '\u20ac0.00', pr: 6, suc: 100, act: 'Pers\u00f6nliche Tasks', col: 'var(--t3)', bg: 'rgba(255,255,255,0.04)' },
  { n: 'Mockup Brief', e: '\u{1F3A8}', typ: 'Specialist', st: 'ready', mdl: 'Sonnet', proj: 'All', tkn: '1.8K', cost: '\u20ac0.05', pr: 12, suc: 99, act: 'Design System Skill aktiv', col: 'var(--bl)', bg: 'rgba(68,153,255,0.1)' },
]

export const SKILLS: Skill[] = [
  { n: 'business-model', cat: 'Core', st: 1, p: 4, orig: 'MCKAY' },
  { n: 'scaffold-project', cat: 'Core', st: 1, p: 4, orig: 'MCKAY' },
  { n: 'code-quality', cat: 'Core', st: 1, p: 4, orig: 'MCKAY' },
  { n: 'deploy', cat: 'Core', st: 1, p: 2, orig: 'MCKAY' },
  { n: 'booking-system', cat: 'Project', st: 1, p: 2, orig: 'MCKAY' },
  { n: 'marketplace', cat: 'Project', st: 1, p: 3, orig: 'MCKAY' },
  { n: 'multi-tenant', cat: 'Project', st: 1, p: 3, orig: 'MCKAY' },
  { n: 'medical-compliance', cat: 'Domain', st: 1, p: 2, orig: 'MCKAY' },
  { n: 'gdpr-health', cat: 'Domain', st: 1, p: 2, orig: 'MCKAY' },
  { n: 'real-estate', cat: 'Domain', st: 1, p: 1, orig: 'MCKAY' },
  { n: 'voice-ai', cat: 'Domain', st: 1, p: 1, orig: 'MCKAY' },
  { n: 'maps-routing', cat: 'Domain', st: 1, p: 1, orig: '3rd Party' },
  { n: 'supabase-postgres', cat: 'Integration', st: 1, p: 4, orig: '3rd Party' },
  { n: 'react-best-practices', cat: 'Integration', st: 1, p: 4, orig: '3rd Party' },
  { n: 'webhook-patterns', cat: 'Integration', st: 1, p: 2, orig: '3rd Party' },
  { n: 'ui-design', cat: 'Integration', st: 1, p: 3, orig: '3rd Party' },
  { n: 'design-system', cat: 'MCKAY', st: 1, p: 4, orig: 'MCKAY' },
  { n: 'deployment-workflow', cat: 'MCKAY', st: 1, p: 3, orig: 'MCKAY' },
]

export const IDEAS: Idea[] = [
  { n: 'Steuerberater App', cat: 'Projekt-Idee', st: 'Research', date: '15.03', txt: 'SaaS f\u00fcr Steuerberater \u2014 Mandantenportal, Dokumentenverwaltung, KI-Assistent', f: 4, pot: 5, c: 3, spd: 3, r: 2, res: 'l\u00e4uft', rec: 'Direkt planen', col: 'var(--bl)' },
  { n: 'Gastro Suite', cat: 'Projekt-Idee', st: 'Planung', date: '22.03', txt: 'Komplettl\u00f6sung f\u00fcr Restaurants \u2014 Reservierung, Speisekarte, Lieferdienst', f: 4, pot: 5, c: 3, spd: 4, r: 2, res: 'Report verf\u00fcgbar', rec: 'Direkt planen', col: 'var(--g)' },
  { n: 'SmartHome X', cat: 'Projekt-Idee', st: 'Geparkt', date: '08.03', txt: 'KI-gesteuerte Smart-Home App mit Energieoptimierung', f: 3, pot: 4, c: 4, spd: 2, r: 3, res: 'nicht gestartet', rec: 'Research first', col: 'var(--a)' },
  { n: 'Autowerkstatt', cat: 'Projekt-Idee', st: 'Neu', date: '28.03', txt: 'Digitale Werkstattverwaltung \u2014 Termine, Rechnungen, Kundenportal', f: 4, pot: 4, c: 2, spd: 5, r: 1, res: 'nicht gestartet', rec: 'Research first', col: 'var(--o)' },
  { n: 'Immobilien Pro', cat: 'Projekt-Idee', st: 'Geparkt', date: '10.03', txt: 'KI-Assistent f\u00fcr Makler \u2014 Expos\u00e9 Generator, Lead-Capture', f: 3, pot: 5, c: 4, spd: 2, r: 3, res: 'nicht gestartet', rec: 'Parken', col: 'var(--t3)' },
  { n: 'Haiku Model-Routing', cat: 'Strategie', st: 'Aktiv', date: '25.03', txt: 'Haiku f\u00fcr 60% der Tasks nutzen \u2014 massive Kostenreduktion', f: 5, pot: 4, c: 1, spd: 5, r: 1, res: 'Report verf\u00fcgbar', rec: 'Direkt planen', col: 'var(--c)' },
  { n: 'Instagram Memory', cat: 'Research', st: 'Research', date: '20.03', txt: 'Video \u2192 Memory-Eintr\u00e4ge via yt-dlp + Whisper + Claude', f: 4, pot: 4, c: 3, spd: 3, r: 2, res: 'l\u00e4uft', rec: 'Research first', col: 'var(--p)' },
]

export const TODOS: Todo[] = [
  { id: 1, txt: 'Mission Control V10 fertigstellen', proj: '', prio: 'h', due: 'Heute', done: false, ov: false },
  { id: 2, txt: 'Hebammenbuero Validation mit Hebammen', proj: 'heb', prio: 'h', due: 'Diese Woche', done: false, ov: false },
  { id: 3, txt: 'Stillprobleme MVP Mockup bauen', proj: 'stl', prio: 'm', due: 'Morgen', done: false, ov: false },
  { id: 4, txt: 'TennisCoach Phase 4 Stripe Integration', proj: 'ten', prio: 'h', due: 'Diese Woche', done: false, ov: false },
  { id: 5, txt: 'FindeMeine v2 GitHub Repo erstellen', proj: 'fnd', prio: 'm', due: '02.04.', done: false, ov: false },
  { id: 6, txt: 'MCKAY Inbox Postfach-Inventur (20 Postf\u00e4cher)', proj: '', prio: 'm', due: '\u00dcberf\u00e4llig', done: false, ov: true },
  { id: 7, txt: 'REGISTRY.md aktualisiert', proj: '', prio: 'l', due: '', done: true, ov: false },
  { id: 8, txt: 'Design System Skill erstellt', proj: '', prio: 'm', due: '', done: true, ov: false },
  { id: 9, txt: 'Deployment Workflow dokumentiert', proj: '', prio: 'l', due: '', done: true, ov: false },
]

export const NOTIFS: Notification[] = [
  { typ: 'sofort', ico: '\u26a1', tit: 'Mission Control V10 Build l\u00e4uft', sub: 'build-agent aktiv auf dev Branch', t: 'Jetzt' },
  { typ: 'wichtig', ico: '\u26a0', tit: 'MCKAY Inbox Inventur \u00fcberf\u00e4llig', sub: 'Seit 3 Tagen ausstehend', t: 'Gestern' },
  { typ: 'wichtig', ico: '\u26a0', tit: 'Hebammenbuero Validation steht aus', sub: 'Termine mit echten Hebammen planen', t: '28.03.' },
  { typ: 'info', ico: '\u2713', tit: 'TennisCoach Phase 0 COMPLETE', sub: '27 Routes \u00b7 DB migrated \u00b7 Login OK', t: '09:41' },
  { typ: 'wichtig', ico: '\u26a0', tit: 'Token-Budget bei 35%', sub: '~18 Tage bis Reset', t: '09:15' },
  { typ: 'optional', ico: '\u{1F4A1}', tit: 'KANI Synergie entdeckt', sub: 'Hebamme + Stillprobleme: 80% Code-Overlap', t: '09:00' },
  { typ: 'review', ico: '\u{1F4CA}', tit: 'Stillprobleme 3 Tage inaktiv', sub: 'Letzter Commit: vor 3 Tagen', t: 'Gestern' },
]

export const CAL: CalendarEntry[] = [
  { t: '10:00', n: 'Hebammenbuero Validation Call', s: 'Test-Session mit 2 Hebammen \u00b7 45min', today: true },
  { t: '14:00', n: 'TennisCoach Phase 4 Planning', s: 'Stripe + Chat + Matching \u00b7 30min', today: true },
  { t: '16:30', n: 'Steuerberater Research Call', s: 'Marktsondierung \u00b7 60min', today: false },
  { t: 'Mo 09:00', n: 'Wochenplanung', s: 'KANI Briefing \u00b7 20min', today: false },
  { t: 'Di 11:00', n: 'MCKAY.AGENCY Strategy', s: 'Portfolio Review \u00b7 45min', today: false },
]

export const MEM: MemoryFile[] = [
  { ico: '\u{1F9E0}', n: 'MEMORY.md', m: 'Heute \u00b7 4.2KB \u00b7 12 Sektionen', b: 'Aktuell' },
  { ico: '\u{1F4CB}', n: 'REGISTRY.md', m: 'Skills:18 \u00b7 Agents:9 \u00b7 Heute', b: 'Sync' },
  { ico: '\u{1F9EC}', n: 'DNA.md', m: 'v3.2 \u00b7 28.03.2026', b: 'Stabil' },
  { ico: '\u{1F4C1}', n: 'Hebamme/CLAUDE.md', m: 'Phase 2 \u00b7 Gestern \u00b7 2.1KB', b: 'Aktiv' },
  { ico: '\u{1F4C1}', n: 'Tennis/CLAUDE.md', m: 'Phase 3 \u00b7 Heute \u00b7 3.4KB', b: 'Aktiv' },
  { ico: '\u{1F4C1}', n: 'FindeMeine/CLAUDE.md', m: 'Live \u00b7 Gestern \u00b7 1.8KB', b: 'Live' },
  { ico: '\u{1F4AC}', n: 'chat-exports/', m: '47 Files \u00b7 Heute', b: '47' },
  { ico: '\u270d', n: 'Communication Style.md', m: 'v2.1 \u00b7 28.03.2026', b: 'Aktiv' },
]

export const SCCAT: Record<string, string> = {
  Core: 'var(--c)',
  MCKAY: 'var(--p)',
  Integration: 'var(--bl)',
  Project: 'var(--a)',
  Domain: 'var(--g)',
}
