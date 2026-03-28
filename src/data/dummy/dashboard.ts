import type { KPI, Notification, TodoItem, Priority, ChatMessage } from '../types';

export const globalKPIs: KPI[] = [
  { label: 'Aktive Projekte', value: 3, color: 'cyan' },
  { label: 'Monatskosten', value: '€52.70', color: 'orange' },
  { label: 'Tokens gesamt', value: '175K', color: 'green' },
  { label: 'Pipeline-Ideen', value: 5, color: 'purple' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'Hebammenbuero Mockup deployed', message: 'Phase 0 live unter hebammenbuero.vercel.app', type: 'success', time: '10 min' },
  { id: '2', title: 'Stillprobleme.de gestartet', message: 'Neues Projekt via /launch erstellt', type: 'info', time: '2h' },
  { id: '3', title: 'TennisCoach Pro — Phase 4 steht aus', message: 'Stripe, Chat, Matching noch ungeplant', type: 'warning', time: '1d' },
  { id: '4', title: 'Validation nötig', message: 'Review mit 2-3 echten Hebammen einplanen', type: 'warning', time: '1d' },
];

export const initialTodos: TodoItem[] = [
  { id: '1', text: 'Hebammenbuero Mockup erweitern (6 Seiten)', done: false, priority: 'high', deadline: '2026-03-30', projectId: 'hebammenbuero' },
  { id: '2', text: 'Validation mit 2-3 echten Hebammen', done: false, priority: 'high', deadline: '2026-04-05', projectId: 'hebammenbuero' },
  { id: '3', text: 'Stillprobleme.de Phase 0 Mockup bauen', done: false, priority: 'high', deadline: '2026-04-02', projectId: 'stillprobleme' },
  { id: '4', text: 'TennisCoach Pro Phase 4/5 planen', done: false, priority: 'medium', deadline: '2026-04-10', projectId: 'tenniscoach-pro' },
  { id: '5', text: 'SmartHome X Konzept evaluieren', done: false, priority: 'low' },
  { id: '6', text: 'Gastro SaaS Markt recherchieren', done: false, priority: 'low' },
];

export const priorities: Priority[] = [
  { id: '1', text: 'Hebammenbuero Mockup + Hebammen-Validation', project: 'Hebammenbuero', impact: 'high' },
  { id: '2', text: 'Stillprobleme.de Phase 0 bauen', project: 'Stillprobleme.de', impact: 'high' },
  { id: '3', text: 'TennisCoach Pro nächste Phasen planen', project: 'TennisCoach Pro', impact: 'medium' },
];

export const dummyChat: ChatMessage[] = [
  { id: '1', sender: 'user', text: 'Zeig mir den aktuellen Status von allen Projekten', time: '09:15' },
  { id: '2', sender: 'kani', text: 'Hier ist der aktuelle Status:\n\n• Hebammenbuero — Phase 0, Mockup live (23 Seiten)\n• Stillprobleme.de — Phase 0, Mockup wird gebaut\n• TennisCoach Pro — Phase 1, Auth funktioniert\n\nAlle Systeme laufen stabil. 16 Skills aktiv, 8 Agents online.', time: '09:15' },
  { id: '3', sender: 'user', text: 'Gut. Baue als nächstes den Onboarding-Wizard für Hebammenbuero', time: '09:18' },
  { id: '4', sender: 'kani', text: 'Verstanden. Ich plane den Onboarding-Wizard mit 6 Steps:\n1. Willkommen + Rolle wählen\n2. Praxis-Daten\n3. Leistungen konfigurieren\n4. Verfügbarkeit\n5. Zahlungsdaten\n6. Bestätigung\n\nSoll ich starten?', time: '09:18' },
];
