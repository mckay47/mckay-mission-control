import type { PipelineIdeaV2 } from '../types';

export const pipelineIdeasV2: PipelineIdeaV2[] = [
  {
    id: 'steuerberater',
    name: 'Steuerberater App',
    rawTranscript: 'Also ich hab mir überlegt, dass es für Steuerberater auch so ein Tool geben müsste. Die schicken ihren Mandanten ja ständig Erinnerungen wegen Unterlagen und Fristen. Das könnte man komplett automatisieren mit WhatsApp und E-Mail Reminders.',
    structuredVersion: 'SaaS für Steuerberater-Kanzleien:\n- Automatische Dokumenten-Erinnerungen per WhatsApp/E-Mail\n- Fristenverwaltung mit Kalender-Integration\n- Mandanten-Portal für Dokumenten-Upload\n- Dashboard für Kanzlei-KPIs',
    type: 'Industry SaaS',
    createdAt: '2026-03-25',
  },
  {
    id: 'autowerkstatt',
    name: 'Autowerkstatt SaaS',
    rawTranscript: 'Mein Kumpel hat ne Werkstatt und der macht noch alles auf Papier. Online Termine buchen, Fahrzeughistorie digital, automatische Erinnerungen wenn der TÜV fällig ist, digitale Rechnungen. Das wäre mega für kleine Werkstätten.',
    structuredVersion: 'SaaS für KFZ-Werkstätten:\n- Online-Terminbuchung\n- Digitale Fahrzeug- und Reparaturhistorie\n- Automatische Erinnerungen (TÜV, Inspektion, Ölwechsel)\n- Digitale Rechnungen\n- Kundenbewertungen',
    type: 'Industry SaaS',
    createdAt: '2026-03-26',
  },
  {
    id: 'smarthome-x',
    name: 'SmartHome X',
    rawTranscript: 'Stell dir vor eine Art Amazon aber nur für Smart Home. Mit einem Konfigurator wo du dein Haus durchgehst Raum für Raum und dir die passenden Smart Home Produkte zusammenstellst. Bundles, Kompatibilitäts-Check, alles dabei.',
    structuredVersion: 'Smart Home Marketplace:\n- Raum-basierter Produkt-Konfigurator\n- Kompatibilitäts-Check zwischen Geräten\n- Smart Bundles mit Rabatt\n- Installations-Service Vermittlung\n- Vergleichsportal für Ökosysteme',
    type: 'Marketplace',
    createdAt: '2026-03-22',
  },
  {
    id: 'gastro-suite',
    name: 'Gastro Suite',
    rawTranscript: 'Restaurants brauchen auch sowas. Reservierungen, digitale Speisekarte, Bestellungen, Mitarbeiter-Planung, Reviews — alles in einem Tool. Die meisten benutzen 5 verschiedene Apps dafür.',
    structuredVersion: 'All-in-One Restaurant Management:\n- Reservierungssystem\n- Digitale Speisekarte mit QR-Code\n- Bestell-Management\n- Mitarbeiter-Schichtplanung\n- Review-Aggregation',
    type: 'Industry SaaS',
    createdAt: '2026-03-24',
  },
  {
    id: 'immobilien-pro',
    name: 'Immobilien Pro',
    rawTranscript: 'Für Immobilienmakler wäre das auch geil. Die brauchen nen Exposé-Builder, Lead Management, Besichtigungs-Kalender und das alles verbunden. Die meisten haben echt beschissene Tools.',
    structuredVersion: 'Immobilienmakler-Plattform:\n- Exposé-Builder mit Templates\n- Lead-CRM mit Scoring\n- Besichtigungs-Kalender\n- Automatische Portalsynchronisation\n- Eigentümer-Portal',
    type: 'Industry SaaS',
    createdAt: '2026-03-23',
  },
];
