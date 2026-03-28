import type { KPI, Notification, TodoItem, Priority, ChatMessage, MemoryEntry } from '../types';

export const globalKPIs: KPI[] = [
  { label: 'Active Projects', value: 3, color: 'cyan' },
  { label: 'Skills Loaded', value: 16, color: 'purple' },
  { label: 'Agents Online', value: 8, color: 'green' },
  { label: 'Pipeline Ideas', value: 9, color: 'orange' },
  { label: 'MCP Servers', value: 5, color: 'pink' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'Hebammenbuero mockup deployed', message: 'Phase 0 mockup is live at hebammenbuero.vercel.app', type: 'success', time: '10 min ago' },
  { id: '2', title: 'Stillprobleme.de launched', message: 'New project scaffolded via /launch protocol', type: 'info', time: '2h ago' },
  { id: '3', title: 'TennisCoach Pro — Phase 4 pending', message: 'Stripe, Chat, Matching, Tournaments still unplanned', type: 'warning', time: '1d ago' },
  { id: '4', title: 'Extended mockup building', message: 'Hebammenbuero: 6 additional pages in progress', type: 'info', time: '3h ago' },
  { id: '5', title: 'Validation needed', message: 'Schedule review with 2-3 real midwives for hebammenbuero', type: 'warning', time: '1d ago' },
];

export const initialTodos: TodoItem[] = [
  { id: '1', text: 'Complete hebammenbuero extended mockup (6 pages)', done: false, priority: 'high' },
  { id: '2', text: 'Validate mockup with 2-3 real midwives', done: false, priority: 'high' },
  { id: '3', text: 'Build stillprobleme.de Phase 0 mockup', done: false, priority: 'high' },
  { id: '4', text: 'Plan TennisCoach Pro Phase 4/5', done: false, priority: 'medium' },
  { id: '5', text: 'Evaluate SmartHome X concept', done: false, priority: 'low' },
  { id: '6', text: 'Research gastronomy SaaS market', done: false, priority: 'low' },
];

export const priorities: Priority[] = [
  { id: '1', text: 'Complete hebammenbuero mockup + midwife validation', project: 'Hebammenbuero', impact: 'high' },
  { id: '2', text: 'Build stillprobleme.de Phase 0', project: 'Stillprobleme.de', impact: 'high' },
  { id: '3', text: 'Plan TennisCoach Pro next phases', project: 'TennisCoach Pro', impact: 'medium' },
];

export const dummyChat: ChatMessage[] = [
  { id: '1', sender: 'user', text: 'Zeig mir den aktuellen Status von allen Projekten', time: '09:15' },
  { id: '2', sender: 'kani', text: 'Hier ist der aktuelle Status:\n\n• Hebammenbuero — Phase 0, Mockup live (23 Seiten)\n• Stillprobleme.de — Phase 0, Mockup wird gebaut\n• TennisCoach Pro — Phase 1, Auth funktioniert\n\nAlle Systeme laufen stabil. 16 Skills aktiv, 8 Agents online.', time: '09:15' },
  { id: '3', sender: 'user', text: 'Gut. Baue als nächstes den Onboarding-Wizard für Hebammenbuero', time: '09:18' },
  { id: '4', sender: 'kani', text: 'Verstanden. Ich plane den Onboarding-Wizard mit 6 Steps:\n1. Willkommen + Rolle wählen\n2. Praxis-Daten\n3. Leistungen konfigurieren\n4. Verfügbarkeit\n5. Zahlungsdaten\n6. Bestätigung\n\nSoll ich starten?', time: '09:18' },
];

export const memoryEntries: MemoryEntry[] = [
  { id: '1', key: 'Last Session', value: '2026-03-28 — Launched stillprobleme.de, built Mission Control plan' },
  { id: '2', key: 'Active Projects', value: 'Hebammenbuero (Phase 0), Stillprobleme.de (Phase 0), TennisCoach Pro (Phase 1)' },
  { id: '3', key: 'Key Decision', value: 'Tech Stack: React + Vite / Supabase / Vercel / n8n / Claude API' },
  { id: '4', key: 'Key Decision', value: 'Video Calls: RED Medical API (healthcare compliance)' },
  { id: '5', key: 'Next Steps', value: 'Complete hebammenbuero mockup, validate with midwives, build stillprobleme mockup' },
  { id: '6', key: 'Business Model', value: 'Setup fee + monthly per-seat. Marketplace: 20% commission.' },
];
