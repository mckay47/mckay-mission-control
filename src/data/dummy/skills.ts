import type { Skill } from '../types';

export const skills: Skill[] = [
  { name: 'business-model', category: 'core', status: 'active', purpose: 'Proposes and structures the right business model — pricing, tiers, revenue logic' },
  { name: 'scaffold-project', category: 'core', status: 'active', purpose: 'Creates folder structure, CLAUDE.md, GitHub repo, Supabase project, Vercel deployment' },
  { name: 'code-quality', category: 'core', status: 'active', purpose: 'Enforces code standards — clean components, no dead code, senior engineer bar' },
  { name: 'deploy', category: 'core', status: 'active', purpose: 'Handles Vercel deployment — env vars, preview vs production, post-deploy checks' },
  { name: 'booking-system', category: 'project-types', status: 'active', purpose: 'Booking and reservation logic — availability, slots, confirmations, reminders', activateWhen: 'Project has bookings or reservations' },
  { name: 'marketplace', category: 'project-types', status: 'active', purpose: 'Two-sided marketplace logic — listings, matching, transactions, reviews', activateWhen: 'Project has marketplace features' },
  { name: 'multi-tenant', category: 'project-types', status: 'active', purpose: 'Multi-tenant architecture — tenant isolation, role-based access, per-tenant config', activateWhen: 'Project has multiple user roles' },
  { name: 'medical-compliance', category: 'domains', status: 'active', purpose: 'Health sector compliance — data handling, access logs, consent flows, audit trails', activateWhen: 'Project in health/medical sector' },
  { name: 'gdpr-health', category: 'domains', status: 'active', purpose: 'GDPR for health data — consent management, data minimization, right to erasure', activateWhen: 'Project processes personal health data' },
  { name: 'real-estate', category: 'domains', status: 'active', purpose: 'Real estate domain — property listings, exposé generation, lead capture', activateWhen: 'Project involves real estate' },
  { name: 'voice-ai', category: 'domains', status: 'active', purpose: 'VAPI integration — voice agent config, call flows, transcripts, handoff logic', activateWhen: 'Project needs voice AI' },
  { name: 'maps-routing', category: 'domains', status: 'active', purpose: 'Google Maps API — geocoding, route optimization, distance matrix, map UI', activateWhen: 'Project needs maps or routes' },
  { name: 'supabase-postgres', category: 'integrations', status: 'active', purpose: 'Postgres best practices — indexes, RLS policies, query optimization, schema design', activateWhen: 'Project uses Supabase' },
  { name: 'react-best-practices', category: 'integrations', status: 'active', purpose: 'React performance — waterfall elimination, bundle size, accessibility', activateWhen: 'Project uses React' },
  { name: 'webhook-patterns', category: 'integrations', status: 'active', purpose: 'Webhook security — signature verification, idempotency, retry logic', activateWhen: 'Project handles webhooks' },
  { name: 'ui-design', category: 'integrations', status: 'active', purpose: 'Design intelligence — color palettes, typography, spacing, dashboard patterns', activateWhen: 'UI components or design decisions' },
];
