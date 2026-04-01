/**
 * MCKAY OS — Idea Processor
 * Stufe 1: Strukturiert den Rohtext + generiert erstes Business-Feedback
 * Uses Claude API (Sonnet) if ANTHROPIC_API_KEY is set, otherwise dummy responses.
 */

import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Du bist KANI, der AI-Business-Partner von Mehti Kaymaz (MCKAY.AGENCY).
Mehti gibt dir eine Geschäftsidee als Freitext. Deine Aufgabe:

1. STRUKTURIERE den Text: Gleicher Inhalt, bessere Struktur. Nichts weglassen, nichts erfinden. Nutze klare Absätze und Bullet Points.

2. GIB FEEDBACK als JSON mit exakt diesen Feldern:
- branche: Die Hauptbranche (z.B. "Gesundheitswesen", "Gastronomie", "Tech/SaaS")
- markt: Kurze Markteinschätzung (1-2 Sätze)
- innovation: Innovationsgrad 1-5 (1=existiert schon überall, 5=völlig neu)
- highlights: Die 2-3 stärksten Aspekte der Idee
- problem: Das größte Risiko oder Problem
- nutzen: Der Hauptnutzen für die Zielgruppe

Antworte EXAKT in diesem Format (keine Abweichung):

## Strukturiert

[Strukturierter Text hier]

## Feedback

\`\`\`json
{
  "branche": "...",
  "markt": "...",
  "innovation": 3,
  "highlights": "...",
  "problem": "...",
  "nutzen": "..."
}
\`\`\`

## Empfehlung

[1 Satz: Was Mehti als nächstes tun sollte]`

/**
 * Process an idea through Claude API or dummy
 * @param {string} rawText - The raw idea text from the user
 * @returns {Promise<{structured: string, feedback: object, recommendation: string}>}
 */
export async function processIdea(rawText) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (apiKey) {
    return processWithAPI(rawText, apiKey)
  } else {
    console.log('[mckay] No ANTHROPIC_API_KEY — using intelligent dummy response')
    return processWithDummy(rawText)
  }
}

async function processWithAPI(rawText, apiKey) {
  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: rawText }],
  })

  const text = response.content[0].text
  return parseAIResponse(text, rawText)
}

function processWithDummy(rawText) {
  // Extract keywords for smart dummy
  const lower = rawText.toLowerCase()
  const isHealth = /hebamme|arzt|gesund|pflege|medizin|still|baby/i.test(lower)
  const isFood = /gastro|restaurant|essen|food|küche|lieferdi/i.test(lower)
  const isTech = /app|plattform|software|saas|tool|system|ai|ki/i.test(lower)
  const isRealEstate = /immobili|makler|wohnung|haus|miete/i.test(lower)

  let branche = 'Tech/SaaS'
  if (isHealth) branche = 'Gesundheitswesen'
  else if (isFood) branche = 'Gastronomie'
  else if (isRealEstate) branche = 'Immobilien'

  const firstSentence = rawText.split(/[.!?\n]/)[0] || rawText.slice(0, 80)
  const words = rawText.split(/\s+/).length

  const structured = `### Kernidee\n${firstSentence}.\n\n### Details\n${rawText.length > 100 ? rawText : rawText + '\n\n(Kurzbeschreibung — weitere Details empfohlen)'}`

  const feedback = {
    branche,
    markt: `Relevanter ${branche}-Markt mit Digitalisierungspotenzial. Genauere Analyse empfohlen.`,
    innovation: words > 50 ? 4 : 3,
    highlights: `Klare Problemerkennung, ${branche}-Fokus, Potenzial für MCKAY Stack`,
    problem: 'Marktsättigung und bestehende Lösungen müssen geprüft werden',
    nutzen: `Vereinfachung und Digitalisierung für ${branche}-Zielgruppe`,
  }

  const recommendation = words > 80
    ? 'Idee ist detailliert genug für einen Research-Durchlauf. Empfehlung: Research Agent starten.'
    : 'Idee noch knapp formuliert. Empfehlung: Details ergänzen oder Research starten für Marktvalidierung.'

  return { structured, feedback, recommendation }
}

function parseAIResponse(text, rawText) {
  // Parse structured section
  const structuredMatch = text.match(/## Strukturiert\n\n([\s\S]*?)(?=\n## Feedback)/)
  const structured = structuredMatch ? structuredMatch[1].trim() : text

  // Parse feedback JSON
  let feedback = {
    branche: 'Unbekannt',
    markt: 'Analyse ausstehend',
    innovation: 3,
    highlights: 'Wird ermittelt',
    problem: 'Wird ermittelt',
    nutzen: 'Wird ermittelt',
  }
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
  if (jsonMatch) {
    try {
      feedback = JSON.parse(jsonMatch[1])
    } catch { /* keep defaults */ }
  }

  // Parse recommendation
  const recMatch = text.match(/## Empfehlung\n\n([\s\S]*?)$/)
  const recommendation = recMatch ? recMatch[1].trim() : 'Research empfohlen'

  return { structured, feedback, recommendation }
}
