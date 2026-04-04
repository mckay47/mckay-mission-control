/**
 * MCKAY OS — KANI Chat Processor
 * Handles chat messages with model routing:
 * - Default: Haiku (cheapest, ~$0.001/msg)
 * - Complex: Sonnet (~$0.01/msg) or Opus (~$0.10/msg)
 * - Auto-detects complexity, notifies user of model switch
 *
 * Spending limit: 20€/month (~$22 USD)
 */

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const MCKAY = join(homedir(), 'mckay-os')
const SPEND_FILE = join(MCKAY, 'finance', 'TOKEN_USAGE.md')
const MONTHLY_LIMIT_USD = 22 // ~20€

// Model configs with cost per 1M tokens
const MODELS = {
  haiku: { id: 'claude-haiku-4-5-20251001', label: 'Haiku', inputCost: 1, outputCost: 5 },
  sonnet: { id: 'claude-sonnet-4-20250514', label: 'Sonnet', inputCost: 3, outputCost: 15 },
  opus: { id: 'claude-opus-4-6', label: 'Opus', inputCost: 15, outputCost: 75 },
}

function getMonthlySpend() {
  try {
    const content = readFileSync(SPEND_FILE, 'utf-8')
    const match = content.match(/Cost: \$(\d+\.?\d*)/)
    return match ? parseFloat(match[1]) : 0
  } catch { return 0 }
}

function detectComplexity(message, context) {
  const lower = message.toLowerCase()
  // Opus triggers: architecture, complex analysis, code review
  if (/architektur|refactor|komplex|analyse.*markt|business.?model|strateg/i.test(lower)) return 'sonnet'
  // Sonnet triggers: code, research, detailed planning
  if (/code|build|implement|recherch|plan|erklär.*detail/i.test(lower)) return 'sonnet'
  // Default: Haiku for everything else
  return 'haiku'
}

const SYSTEM_PROMPT = `Du bist KANI — Mehtis AI-Partner in MCKAY OS.
Du sprichst Deutsch im Dialog. Du bist direkt, konkret, proaktiv.
Du kennst alle Projekte, Ideen und Todos im System.
Wenn du nicht weißt, sag es — erfinde nichts.
Halte Antworten kurz (2-4 Sätze) außer der User will Details.`

/**
 * @param {string} message - User message
 * @param {string} context - Page context (cockpit, projekt:hebammenbuero, thinktank, etc.)
 * @param {Array} history - Previous messages [{role, content}]
 * @returns {Promise<{response: string, model: string, modelSwitch?: string, cost: number, limitReached?: boolean}>}
 */
export async function chatWithKani(message, context = 'cockpit', history = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { response: 'API Key nicht konfiguriert. Bitte ANTHROPIC_API_KEY in .env.local eintragen.', model: 'none', cost: 0 }
  }

  // Check spending limit
  const spent = getMonthlySpend()
  if (spent >= MONTHLY_LIMIT_USD) {
    return { response: `Monatliches Spending Limit erreicht ($${spent.toFixed(2)} / $${MONTHLY_LIMIT_USD}). Limit wird am Monatsende zurückgesetzt.`, model: 'none', cost: 0, limitReached: true }
  }

  const complexity = detectComplexity(message, context)
  const model = MODELS[complexity]
  const wasUpgraded = complexity !== 'haiku'

  const contextInfo = context.startsWith('projekt:')
    ? `Kontext: Projekt "${context.replace('projekt:', '')}" ist geöffnet.`
    : context.startsWith('idee:')
    ? `Kontext: Idee "${context.replace('idee:', '')}" ist geöffnet.`
    : context.startsWith('agent:')
    ? `Kontext: Agent "${context.replace('agent:', '')}" ist geöffnet.`
    : `Kontext: ${context} Seite.`

  const systemMsg = `${SYSTEM_PROMPT}\n\n${contextInfo}\nModell: ${model.label}. Aktuelles Budget: $${(MONTHLY_LIMIT_USD - spent).toFixed(2)} verbleibend.`

  const messages = [
    ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ]

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: model.id,
      max_tokens: 800,
      system: systemMsg,
      messages,
    })

    const text = response.content[0].text
    const inputTokens = response.usage?.input_tokens || 0
    const outputTokens = response.usage?.output_tokens || 0
    const cost = (inputTokens * model.inputCost + outputTokens * model.outputCost) / 1_000_000

    // Build response with model switch notice
    let fullResponse = text
    if (wasUpgraded) {
      fullResponse = `[${model.label}] ${text}`
    }

    return {
      response: fullResponse,
      model: model.label,
      modelSwitch: wasUpgraded ? `Modell: ${model.label} (komplexere Anfrage erkannt)` : undefined,
      cost,
    }
  } catch (err) {
    return { response: `Fehler: ${err.message}`, model: model.label, cost: 0 }
  }
}

/**
 * Research an idea — basic market analysis via Sonnet
 */
export async function researchIdea(ideaTitle, ideaDescription) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { result: 'API Key fehlt.', cost: 0 }

  const spent = getMonthlySpend()
  if (spent >= MONTHLY_LIMIT_USD) return { result: 'Spending Limit erreicht.', cost: 0, limitReached: true }

  const prompt = `Analysiere diese Geschäftsidee kurz und knapp:

Titel: ${ideaTitle}
Beschreibung: ${ideaDescription}

Gib mir in maximal 200 Wörtern:
1. **Markt:** Zielgruppe und geschätzte Marktgröße
2. **Wettbewerb:** 2-3 existierende Lösungen/Konkurrenten
3. **Differenzierung:** Was macht diese Idee anders?
4. **Risiken:** Top 2 Risiken
5. **Empfehlung:** Lohnt sich ein MVP? Ja/Nein mit Begründung.`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODELS.sonnet.id,
      max_tokens: 1000,
      system: 'Du bist ein Business-Analyst. Antworte auf Deutsch, kurz und konkret.',
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].text
    const cost = ((response.usage?.input_tokens || 0) * MODELS.sonnet.inputCost +
                  (response.usage?.output_tokens || 0) * MODELS.sonnet.outputCost) / 1_000_000

    return { result: text, cost }
  } catch (err) {
    return { result: `Research fehlgeschlagen: ${err.message}`, cost: 0 }
  }
}
