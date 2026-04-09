// ============================================================
// Category data for Hub / Office / Life / Network pages
// NOT auto-generated — safe from scripts/generate-data.mjs
// ============================================================

import type { EmailGroup } from './types.ts'

export interface CategoryItem {
  id: string
  name: string
  desc: string
  color: string
  glow: string
  badge: string
  emoji: string
  stats: { label: string; value: string }[]
}

// ============================================================
// Office
// ============================================================

export const officeCategories: CategoryItem[] = [
  { id: 'buchhaltung', name: 'Buchhaltung', desc: 'Belege, Datev, Steuerberaterin', color: 'var(--bl)', glow: 'var(--blg)', badge: 'Monatlich', emoji: '\u{1F4CA}', stats: [{ label: 'Letzter Upload', value: '2026-03-28' }, { label: 'Belege', value: '42' }] },
  { id: 'subscriptions', name: 'Subscriptions', desc: 'SaaS, Lizenzen, API-Kosten', color: 'var(--p)', glow: 'var(--pg)', badge: '9 aktiv', emoji: '\u{1F511}', stats: [{ label: 'Monatlich', value: '\u20AC347' }, { label: 'Services', value: '9' }] },
  { id: 'vertraege', name: 'Vertr\u00E4ge', desc: 'Handy, Auto, Lizenzen, Laufzeiten', color: 'var(--a)', glow: 'var(--ag)', badge: '7 aktiv', emoji: '\u{1F4C4}', stats: [{ label: 'Aktiv', value: '7' }, { label: 'N\u00E4chste K\u00FCndigung', value: '2026-06-15' }] },
  { id: 'kunden', name: 'Kunden', desc: 'Hebam Agency, HebamB\u00FCro, aktive Kunden', color: 'var(--g)', glow: 'var(--gg)', badge: '2 Businesses', emoji: '\u{1F465}', stats: [{ label: 'Hebam Agency', value: '~100' }, { label: 'HebamB\u00FCro', value: '12' }] },
  { id: 'business-email', name: 'Business E-Mails', desc: 'Support, Anfragen, R\u00FCckmeldungen', color: 'var(--o)', glow: 'var(--og)', badge: '3 Postf\u00E4cher', emoji: '\u{1F4E7}', stats: [{ label: 'Ungelesen', value: '5' }, { label: 'Heute', value: '2' }] },
]

// ============================================================
// Life
// ============================================================

export const lifeCategories: CategoryItem[] = [
  { id: 'wohnung', name: 'Wohnung', desc: 'Mieter, Hausverwaltung, Nebenkosten', color: 'var(--bl)', glow: 'var(--blg)', badge: 'Vermietet', emoji: '\u{1F3E0}', stats: [{ label: 'Mieter', value: '1' }, { label: 'Kaltmiete', value: '\u20AC750' }] },
  { id: 'familie', name: 'Familie', desc: 'Kinder, Termine, Organisation', color: 'var(--pk)', glow: 'var(--pkg)', badge: '4 Personen', emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}', stats: [{ label: 'N\u00E4chster Termin', value: 'Heute' }, { label: 'Offene Todos', value: '3' }] },
  { id: 'gesundheit', name: 'Gesundheit', desc: 'Fitness, Arzttermine, Wellness', color: 'var(--g)', glow: 'var(--gg)', badge: 'Aktiv', emoji: '\u{1F4AA}', stats: [{ label: 'Gym/Woche', value: '3x' }, { label: 'Streak', value: '12 Tage' }] },
  { id: 'private-todos', name: 'Private Todos', desc: 'Bank, Steuerberater, Erledigungen', color: 'var(--a)', glow: 'var(--ag)', badge: '5 offen', emoji: '\u2705', stats: [{ label: 'Offen', value: '5' }, { label: 'Diese Woche', value: '2' }] },
  { id: 'private-email', name: 'Private E-Mails', desc: 'Pers\u00F6nliche Postf\u00E4cher', color: 'var(--t)', glow: 'var(--tg)', badge: '2 Postf\u00E4cher', emoji: '\u2709\uFE0F', stats: [{ label: 'Ungelesen', value: '12' }, { label: 'Heute', value: '4' }] },
]

// ============================================================
// Hub (8 Kategorien: Kalender, Todos, E-Mail Übersicht + 5 Postfach-Gruppen)
// ============================================================

export const hubCategories: CategoryItem[] = [
  { id: 'kalender', name: 'Kalender', desc: 'Privat + Business, alle Termine', color: 'var(--g)', glow: 'var(--gg)', badge: 'Google Calendar', emoji: '\u{1F4C5}', stats: [{ label: 'Heute', value: '\u2014' }, { label: 'Diese Woche', value: '\u2014' }] },
  { id: 'todos', name: 'Todos', desc: 'Alles nicht-Projekt: Bank, Arzt, Admin', color: 'var(--o)', glow: 'var(--og)', badge: '\u2014', emoji: '\u{1F4CB}', stats: [{ label: 'Offen', value: '\u2014' }, { label: 'Erledigt', value: '\u2014' }] },
  { id: 'email-hub', name: 'E-Mail \u00DCbersicht', desc: 'Alle 20 Konten auf einen Blick', color: 'var(--bl)', glow: 'var(--blg)', badge: '20 Konten', emoji: '\u{1F4EC}', stats: [{ label: 'Gruppen', value: '5' }, { label: 'Konten', value: '20' }] },
  { id: 'email-persoenlich', name: 'Pers\u00F6nlich', desc: 'Gmail-Konten, privat', color: 'var(--t)', glow: 'var(--tg)', badge: '3 Konten', emoji: '\u{1F464}', stats: [{ label: 'Konten', value: '3' }, { label: 'Ungelesen', value: '\u2014' }] },
  { id: 'email-stillzentrum', name: 'Stillzentrum', desc: 'stillzentrum.com + Gmail', color: 'var(--p)', glow: 'var(--pg)', badge: '5 Konten', emoji: '\u{1F3E5}', stats: [{ label: 'Konten', value: '5' }, { label: 'Ungelesen', value: '\u2014' }] },
  { id: 'email-hebammenbuero', name: 'Hebammenb\u00FCro', desc: 'hebammenbuero.com + .de', color: 'var(--pk)', glow: 'var(--pkg)', badge: '5 Konten', emoji: '\u{1F476}', stats: [{ label: 'Konten', value: '5' }, { label: 'Ungelesen', value: '\u2014' }] },
  { id: 'email-mckay', name: 'MCKAY.AGENCY', desc: 'Agency-Postf\u00E4cher', color: 'var(--c)', glow: 'var(--cg)', badge: '4 Konten', emoji: '\u{1F537}', stats: [{ label: 'Konten', value: '4' }, { label: 'Ungelesen', value: '\u2014' }] },
  { id: 'email-hebammen-agency', name: 'Hebammen.Agency', desc: 'findemeinehebamme.de Betrieb', color: 'var(--g)', glow: 'var(--gg)', badge: '3 Konten', emoji: '\u{1F91D}', stats: [{ label: 'Konten', value: '3' }, { label: 'Ungelesen', value: '\u2014' }] },
]

// ============================================================
// Network
// ============================================================

export const networkCategories: CategoryItem[] = [
  { id: 'kontakte', name: 'Kontakte', desc: 'Kunden, Partner, Dienstleister', color: 'var(--t)', glow: 'var(--tg)', badge: '45 Kontakte', emoji: '\u{1F464}', stats: [{ label: 'Kunden', value: '15' }, { label: 'Partner', value: '8' }] },
  { id: 'events', name: 'Events', desc: 'Meetups, Konferenzen, Termine', color: 'var(--p)', glow: 'var(--pg)', badge: '3 geplant', emoji: '\u{1F3A4}', stats: [{ label: 'Diesen Monat', value: '1' }, { label: 'N\u00E4chstes', value: '15. Apr' }] },
  { id: 'portale', name: 'Portale & Kurse', desc: 'Voice Agent, Marketing, Weiterbildung', color: 'var(--o)', glow: 'var(--og)', badge: '4 aktiv', emoji: '\u{1F393}', stats: [{ label: 'Aktive Kurse', value: '2' }, { label: 'Abgeschlossen', value: '1' }] },
  { id: 'partner', name: 'Partner', desc: 'Business-Partner, Agenturen, Freelancer', color: 'var(--bl)', glow: 'var(--blg)', badge: '6 aktiv', emoji: '\u{1F91D}', stats: [{ label: 'Aktiv', value: '6' }, { label: 'Potentiell', value: '3' }] },
  { id: 'opportunities', name: 'Opportunities', desc: 'Leads, Anfragen, Chancen', color: 'var(--g)', glow: 'var(--gg)', badge: '2 hei\u00DF', emoji: '\u{1F525}', stats: [{ label: 'Pipeline', value: '5' }, { label: 'Hei\u00DF', value: '2' }] },
]

// ============================================================
// Email account groups (20 accounts in 5 groups)
// All managed via Outlook, custom domains hosted at Strato.de
// ============================================================

export const emailGroups: EmailGroup[] = [
  {
    id: 'persoenlich', name: 'Pers\u00F6nlich', color: 'var(--t)', glow: 'var(--tg)', emoji: '\u{1F464}', badge: '3 Konten',
    desc: 'Private Gmail-Konten',
    accounts: [
      { email: 'mehtikaymaz@gmail.com', provider: 'gmail' },
      { email: 'mckaykay0711@gmail.com', provider: 'gmail' },
      { email: 'cryptomkay@gmail.com', provider: 'gmail' },
    ],
    stats: [{ label: 'Konten', value: '3' }, { label: 'Provider', value: 'Gmail' }],
  },
  {
    id: 'stillzentrum', name: 'Stillzentrum', color: 'var(--p)', glow: 'var(--pg)', emoji: '\u{1F3E5}', badge: '5 Konten',
    desc: 'stillzentrum.com + Gmail',
    accounts: [
      { email: 'kontakt@stillzentrum.com', provider: 'strato' },
      { email: 'office@stillzentrum.com', provider: 'strato' },
      { email: 'm.kaymaz@stillzentrum.com', provider: 'strato' },
      { email: 'organisation@stillzentrum.com', provider: 'strato' },
      { email: 'Stillzentrum.ulm@gmail.com', provider: 'gmail' },
    ],
    stats: [{ label: 'Konten', value: '5' }, { label: 'Provider', value: 'Strato + Gmail' }],
  },
  {
    id: 'hebammenbuero', name: 'Hebammenb\u00FCro', color: 'var(--pk)', glow: 'var(--pkg)', emoji: '\u{1F476}', badge: '5 Konten',
    desc: 'hebammenbuero.com + hebammenb\u00FCro.de',
    accounts: [
      { email: 'm.kaymaz@hebammenbuero.com', provider: 'strato' },
      { email: 'hello@hebammenbuero.com', provider: 'strato' },
      { email: 'office@hebammenbuero.com', provider: 'strato' },
      { email: 'hello@hebammenb\u00FCro.de', provider: 'strato' },
      { email: 'm.kaymaz@hebammenb\u00FCro.de', provider: 'strato' },
    ],
    stats: [{ label: 'Konten', value: '5' }, { label: 'Provider', value: 'Strato' }],
  },
  {
    id: 'mckay-agency', name: 'MCKAY.AGENCY', color: 'var(--c)', glow: 'var(--cg)', emoji: '\u{1F537}', badge: '4 Konten',
    desc: 'Agency-Postf\u00E4cher',
    accounts: [
      { email: 'hello@mckay.agency', provider: 'strato' },
      { email: 'bills@mckay.agency', provider: 'strato' },
      { email: '1@mckay.agency', provider: 'strato' },
      { email: 'm.kaymaz@mckay.agency', provider: 'strato' },
    ],
    stats: [{ label: 'Konten', value: '4' }, { label: 'Provider', value: 'Strato' }],
  },
  {
    id: 'hebammen-agency', name: 'Hebammen.Agency', color: 'var(--g)', glow: 'var(--gg)', emoji: '\u{1F91D}', badge: '3 Konten',
    desc: 'findemeinehebamme.de Betrieb',
    accounts: [
      { email: 'hello@hebammen.agency', provider: 'strato' },
      { email: 'm.kaymaz@hebammen.agency', provider: 'strato' },
      { email: 'support@hebammen.agency', provider: 'strato' },
    ],
    stats: [{ label: 'Konten', value: '3' }, { label: 'Provider', value: 'Strato' }],
  },
]
