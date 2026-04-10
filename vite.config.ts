import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error — plugin is .mjs, no declaration file
import mckayPlugin from './scripts/vite-mckay-plugin.mjs'
import { spawn, type ChildProcess } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'
import { existsSync, mkdirSync, appendFileSync, writeFileSync, readFileSync, readdirSync } from 'fs'
import type { Plugin, ViteDevServer } from 'vite'
import { createClient } from '@supabase/supabase-js'
// @ts-expect-error — imapflow types
import { ImapFlow } from 'imapflow'
import { createTransport } from 'nodemailer'
import Anthropic from '@anthropic-ai/sdk'

// ============================================================
// Process Registry — tracks all active Claude CLI processes
// ============================================================

interface ActiveProcess {
  proc: ChildProcess
  terminalId: string
  cwd: string
  startedAt: number
}

const activeProcesses = new Map<string, ActiveProcess>()

// Tracks which terminals have an ongoing Claude session (for --continue)
const sessionStarted = new Set<string>()

// ============================================================
// Session History — server-side buffer for terminal reconnect
// ============================================================

interface HistoryMessage {
  role: 'user' | 'assistant'
  text: string
  ts: number
}

const sessionHistory = new Map<string, HistoryMessage[]>()

function addToHistory(terminalId: string, role: 'user' | 'assistant', text: string) {
  if (!sessionHistory.has(terminalId)) sessionHistory.set(terminalId, [])
  sessionHistory.get(terminalId)!.push({ role, text, ts: Date.now() })

  // Persist to disk (project terminals only)
  const projectMatch = terminalId.match(/^project:(.+)$/)
  if (projectMatch) {
    try {
      const logPath = join(homedir(), 'mckay-os', 'projects', projectMatch[1], '.terminal-log.jsonl')
      appendFileSync(logPath, JSON.stringify({ role, text: text.substring(0, 5000), ts: Date.now() }) + '\n')
    } catch { /* non-critical */ }
  }
}

function getHistory(terminalId: string): HistoryMessage[] {
  // Try memory first
  if (sessionHistory.has(terminalId)) return sessionHistory.get(terminalId)!

  // Try disk
  const projectMatch = terminalId.match(/^project:(.+)$/)
  if (projectMatch) {
    try {
      const logPath = join(homedir(), 'mckay-os', 'projects', projectMatch[1], '.terminal-log.jsonl')
      if (existsSync(logPath)) {
        const lines = readFileSync(logPath, 'utf-8').trim().split('\n').filter(Boolean)
        const messages = lines.map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
        sessionHistory.set(terminalId, messages)
        return messages
      }
    } catch { /* non-critical */ }
  }
  return []
}

function clearHistory(terminalId: string) {
  sessionHistory.delete(terminalId)
  const projectMatch = terminalId.match(/^project:(.+)$/)
  if (projectMatch) {
    try {
      const logPath = join(homedir(), 'mckay-os', 'projects', projectMatch[1], '.terminal-log.jsonl')
      if (existsSync(logPath)) writeFileSync(logPath, '')
    } catch { /* non-critical */ }
  }
}

// ============================================================
// Auto-sync TODOS.md → Supabase after terminal prompt
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addFeedEntry(projectId: string, prompt: string, responseText: string, sb: any) {
  try {
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

    // Determine feed type + text from prompt and response
    let type: 'success' | 'info' | 'warning' | 'error' = 'info'
    let text = ''

    const promptLower = prompt.toLowerCase()
    if (promptLower.includes('deploy')) {
      type = responseText.toLowerCase().includes('error') ? 'error' : 'success'
      text = `Deploy: ${responseText.split('\n')[0]?.substring(0, 80) || 'ausgeführt'}`
    } else if (promptLower.includes('test') || promptLower.includes('typescript') || promptLower.includes('build')) {
      type = responseText.toLowerCase().includes('error') || responseText.toLowerCase().includes('fehler') ? 'warning' : 'success'
      text = `Build/Test: ${responseText.split('\n')[0]?.substring(0, 80) || 'ausgeführt'}`
    } else if (promptLower.includes('session beenden') || promptLower.includes('feierabend')) {
      type = 'info'
      text = 'Session beendet — MEMORY + TODOS aktualisiert'
    } else if (promptLower.includes('todo')) {
      type = 'info'
      text = `Todos: ${responseText.split('\n')[0]?.substring(0, 80) || 'aktualisiert'}`
    } else {
      // Generic: use first line of response as feed text
      const firstLine = responseText.split('\n').find(l => l.trim().length > 10)
      text = `KANI: ${firstLine?.substring(0, 80) || prompt.substring(0, 60)}`
    }

    // Prepend to feed array (max 20 entries)
    const newEntry = { text, time, type }

    sb.from('projects').select('feed').eq('id', projectId).single().then(({ data }: { data: { feed: unknown[] } | null }) => {
      const currentFeed = (data?.feed || []) as { text: string; time: string; type: string }[]
      const updatedFeed = [newEntry, ...currentFeed].slice(0, 20)
      sb.from('projects').update({ feed: updatedFeed }).eq('id', projectId).then(() => {})
    })
  } catch { /* non-critical */ }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function syncTodosToSupabase(projectId: string, sb: any) {
  try {
    const todosPath = join(homedir(), 'mckay-os', 'projects', projectId, 'TODOS.md')
    if (!existsSync(todosPath)) return

    const content = readFileSync(todosPath, 'utf-8')
    const lines = content.split('\n')
    const todos: { title: string; priority: string; status: string; description: string; project_id: string; sort_order: number }[] = []
    let sortOrder = 0

    for (const line of lines) {
      // Match: - [x] **P1** Title or - [ ] **P2** Title
      const match = line.match(/^- \[([ x])\]\s+\*\*(\w+)\*\*\s+(.+)$/)
      if (match) {
        const done = match[1] === 'x'
        const priority = match[2]
        const title = match[3].trim()
        todos.push({
          title,
          priority,
          status: done ? 'done' : 'open',
          description: '',
          project_id: projectId,
          sort_order: sortOrder++,
        })
      }
    }

    if (todos.length === 0) return

    // Delete existing todos for this project and insert fresh
    sb.from('todos').delete().eq('project_id', projectId).then(() => {
      sb.from('todos').insert(todos).then(() => {})
    })
  } catch { /* non-critical */ }
}

// ============================================================
// SIGNALS — Cross-terminal activity log
// ============================================================

const SIGNALS_PATH = join(homedir(), 'mckay-os', 'sync', 'SIGNALS.md')
const SIGNALS_DIR  = join(homedir(), 'mckay-os', 'sync')

function ensureSignalsFile() {
  if (!existsSync(SIGNALS_DIR)) mkdirSync(SIGNALS_DIR, { recursive: true })
  if (!existsSync(SIGNALS_PATH)) {
    appendFileSync(SIGNALS_PATH, '# SIGNALS — Cross-Terminal Activity Log\n\n')
  }
}

function writeSignal(terminalId: string, signal: string) {
  try {
    ensureSignalsFile()
    const now = new Date()
    const ts = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`
    appendFileSync(SIGNALS_PATH, `${ts} | ${terminalId} | ${signal.trim()}\n`)
  } catch {
    // non-critical — don't crash the server
  }
}

function extractSignals(text: string): string[] {
  const signals: string[] = []
  for (const line of text.split('\n')) {
    const m = line.match(/\[SIGNAL\]\s+(.+)/i)
    if (m) signals.push(m[1].trim())
  }
  return signals
}

function resolveCwd(cwd: string): string {
  return cwd.startsWith('~') ? join(homedir(), cwd.slice(1)) : cwd
}

// Resolve claude CLI path — launchd doesn't inherit full shell PATH
const CLAUDE_PATH = (() => {
  const candidates = [
    '/opt/homebrew/bin/claude',
    '/opt/homebrew/Cellar/node/25.8.2/bin/claude',
    '/usr/local/bin/claude',
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return 'claude'
})()

// Ensure spawn env has node + homebrew in PATH (launchd strips it)
function spawnEnv(): NodeJS.ProcessEnv {
  const extra = '/opt/homebrew/bin:/opt/homebrew/Cellar/node/25.8.2/bin:/usr/local/bin'
  const current = process.env.PATH || '/usr/bin:/bin'
  return { ...process.env, PATH: `${extra}:${current}` }
}

function resolveClaudePath(): string { return CLAUDE_PATH }

// ============================================================
// KANI Terminal Plugin — Claude CLI streaming + process mgmt
// ============================================================

function kaniTerminal(): Plugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serverSupabase: any = null

  return {
    name: 'kani-terminal',

    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      const url = env.VITE_SUPABASE_URL
      const key = env.VITE_SUPABASE_ANON_KEY
      if (url && key) {
        serverSupabase = createClient(url, key)
      }
    },

    configureServer(server: ViteDevServer) {

      // --------------------------------------------------------
      // POST /api/kani/prompt — Execute Claude CLI prompt
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/prompt') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          let prompt: string
          let cwd: string
          let terminalId: string
          try {
            const parsed = JSON.parse(body)
            prompt = parsed.prompt
            cwd = resolveCwd(parsed.cwd || join(homedir(), 'mckay-os'))
            terminalId = parsed.terminalId || 'unknown'
          } catch {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Invalid JSON')
            return
          }

          if (!prompt) {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Missing prompt')
            return
          }

          // Kill existing process for this terminal (prevent orphans)
          const existing = activeProcesses.get(terminalId)
          if (existing) {
            existing.proc.kill('SIGTERM')
            activeProcesses.delete(terminalId)
          }

          res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
          })
          // Flush headers immediately so browser knows response is streaming
          res.write(' \n')

          const isNewSession = !sessionStarted.has(terminalId)
          sessionStarted.add(terminalId)

          const claudeArgs = isNewSession
            ? ['-p', prompt, '--output-format', 'text']
            : ['--continue', '-p', prompt, '--output-format', 'text']

          const proc = spawn(resolveClaudePath(), claudeArgs, {
            cwd,
            env: spawnEnv(),
            stdio: ['ignore', 'pipe', 'pipe'],
          })

          // Register in process registry
          activeProcesses.set(terminalId, { proc, terminalId, cwd, startedAt: Date.now() })

          // Add user prompt to history
          addToHistory(terminalId, 'user', prompt)

          let responseText = ''

          let resEnded = false
          res.on('close', () => {
            resEnded = true
            // Don't kill the process on browser disconnect — it should continue in background.
            // The process is only killed explicitly via the abort button (which sends a separate request)
            // or when a new prompt is sent to the same terminal (existing process is replaced).
          })

          proc.on('error', (err) => {
            activeProcesses.delete(terminalId)
            const msg = `[spawn error] ${err.message}`
            if (!resEnded) {
              try { res.write(msg); res.end() } catch { /* */ }
            }
          })

          proc.stdout.on('data', (data: Buffer) => {
            const chunk = data.toString()
            responseText += chunk
            if (!resEnded) {
              try { res.write(chunk) } catch { resEnded = true }
            }
          })

          proc.stderr.on('data', () => {
            // stderr silenced — claude CLI warnings are noise
          })

          proc.on('close', () => {
            activeProcesses.delete(terminalId)
            try { res.end() } catch { /* browser may have disconnected */ }

            // Save response to history
            if (responseText) addToHistory(terminalId, 'assistant', responseText)

            // Extract and write [SIGNAL] lines to SIGNALS.md (project terminals only)
            if (terminalId.startsWith('project:') || terminalId.startsWith('idea:')) {
              const signals = extractSignals(responseText)
              for (const signal of signals) {
                writeSignal(terminalId, signal)
              }
            }

            // Auto-log to activity_log + auto-create notification
            if (serverSupabase) {
              const projectMatch = terminalId.match(/^project:(.+)$/)
              serverSupabase.from('activity_log').insert({
                project_id: projectMatch ? projectMatch[1] : null,
                terminal_id: terminalId,
                type: 'prompt',
                prompt,
                text: `[${terminalId}] ${prompt}`,
                response_preview: responseText.substring(0, 500),
                time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
              }).then(() => {})

              // Auto-create notification for [SIGNAL] lines
              const signals = extractSignals(responseText)
              for (const signal of signals) {
                serverSupabase.from('notifications').insert({
                  typ: 'review',
                  title: signal,
                  subtitle: terminalId,
                  source: `signal:${terminalId}`,
                  project_id: projectMatch ? projectMatch[1] : null,
                  terminal_id: terminalId,
                }).then(() => {})
              }

              // Auto-sync TODOS.md + Live Feed → Supabase (project terminals only)
              if (projectMatch) {
                syncTodosToSupabase(projectMatch[1], serverSupabase)
                addFeedEntry(projectMatch[1], prompt, responseText, serverSupabase)
              }
            }
          })

          proc.on('error', (err) => {
            activeProcesses.delete(terminalId)
            res.write(`[error] ${err.message}\n`)
            res.end()
          })

          // Timeout after 2 minutes
          const timeout = setTimeout(() => {
            proc.kill()
            res.write('\n[timeout] KANI hat zu lange gebraucht\n')
            res.end()
          }, 120000)

          proc.on('close', () => clearTimeout(timeout))
        })
      })

      // --------------------------------------------------------
      // GET /api/email/unread — Fetch unread counts via IMAP
      // --------------------------------------------------------

      // Cache: { [email]: count }, refreshed every 5 min
      let emailCache: { data: Record<string, number>; ts: number } = { data: {}, ts: 0 }
      const EMAIL_CACHE_TTL = 5 * 60 * 1000

      // Force refresh endpoint
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/email/refresh') return next()
        emailCache = { data: {}, ts: 0 }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Cache cleared')
      })

      const emailErrors: Record<string, string> = {}

      // Email triage cache
      const triageCache = new Map<string, any>() // key: "account:uid"

      function findCredentials(email: string): { host: string; port: number; password: string; provider: string } | null {
        const credPath = join(process.cwd(), '.email-credentials.json')
        if (!existsSync(credPath)) return null
        const creds = JSON.parse(readFileSync(credPath, 'utf-8'))
        for (const provider of ['strato', 'gmail'] as const) {
          const cfg = creds[provider]
          if (!cfg?.accounts) continue
          for (const acc of cfg.accounts) {
            if (acc.email === email && acc.password) {
              return { host: cfg.host, port: cfg.port, password: acc.password, provider }
            }
          }
        }
        return null
      }

      async function connectImap(email: string) {
        const cred = findCredentials(email)
        if (!cred) throw new Error(`No credentials for ${email}`)
        const client = new ImapFlow({
          host: cred.host, port: cred.port, secure: true,
          auth: { user: email, pass: cred.password },
          logger: false
        })
        await client.connect()
        return { client, cred }
      }

      function getSmtpConfig(provider: string, email: string, password: string) {
        if (provider === 'gmail' || email.endsWith('@gmail.com')) {
          return { service: 'gmail', auth: { user: email, pass: password } }
        }
        return { host: 'smtp.strato.de', port: 465, secure: true, auth: { user: email, pass: password } }
      }

      let anthropicClient: Anthropic | null = null
      function getAnthropic(): Anthropic {
        if (!anthropicClient) {
          const envRaw = readFileSync(join(process.cwd(), '.env.local'), 'utf-8')
          const lines: Record<string, string> = {}
          for (const line of envRaw.split('\n')) {
            const eq = line.indexOf('=')
            if (eq > 0 && !line.startsWith('#')) lines[line.substring(0, eq).trim()] = line.substring(eq + 1).trim()
          }
          anthropicClient = new Anthropic({ apiKey: lines.ANTHROPIC_API_KEY })
        }
        return anthropicClient
      }

      function buildTriagePrompt(emails: any[], account: string): string {
        return `Du bist KANI, der KI-Assistent von Mehti Kaymaz. Klassifiziere folgende E-Mails für das Konto ${account}.

Antworte NUR mit einem JSON-Array. Für jede E-Mail ein Objekt:
{
  "uid": <uid>,
  "category": "info" | "action" | "spam" | "invoice",
  "summary": "einzeilige deutsche Zusammenfassung",
  "urgency": "low" | "medium" | "high",
  "suggested_action": "note" | "reply" | "todo" | "delete" | "archive" | "file_invoice",
  "draft_reply": "...",
  "todo_text": "...",
  "sender_context": { "name": "...", "role": "vermutete Rolle", "relationship": "Kunde/Partner/Service/Newsletter/Familie/Unbekannt" }
}

Regeln:
- Newsletter, Werbung, Marketing, Promotions → "spam", suggested_action "delete"
- Rechnungen, Quittungen, Zahlungsbestätigungen → "invoice", suggested_action "file_invoice"
- Erfordert Antwort oder Handlung von Mehti → "action", suggested_action "reply" oder "todo"
- Reine Info, Bestätigungen, Statusupdates → "info", suggested_action "note" oder "archive"
- draft_reply NUR wenn suggested_action = "reply" — auf Deutsch, professionell, im Namen von Mehti Kaymaz
- todo_text NUR wenn suggested_action = "todo" — kurze Aufgabenbeschreibung

E-Mails:
${emails.map((e: any) => `---
UID: ${e.uid}
Von: ${e.from?.name || ''} <${e.from?.address || ''}>
An: ${e.to?.map((t: any) => t.address).join(', ') || ''}
Betreff: ${e.subject}
Datum: ${e.date}
Vorschau: ${e.snippet}
---`).join('\n')}

Antworte NUR mit dem JSON-Array.`
      }

      async function fetchUnreadCount(host: string, port: number, email: string, password: string): Promise<number> {
        if (!password) { emailErrors[email] = 'no password'; return -1 }
        try {
          const client = new ImapFlow({ host, port, secure: true, auth: { user: email, pass: password }, logger: false })
          await client.connect()
          const lock = await client.getMailboxLock('INBOX')
          try {
            const status = await client.status('INBOX', { unseen: true })
            return status.unseen ?? 0
          } finally {
            lock.release()
            await client.logout()
          }
        } catch (err) {
          emailErrors[email] = (err as Error).message || 'unknown error'
          return -1
        }
      }

      async function refreshEmailCache() {
        const credPath = join(process.cwd(), '.email-credentials.json')
        if (!existsSync(credPath)) return
        const creds = JSON.parse(readFileSync(credPath, 'utf-8'))
        const results: Record<string, number> = {}
        const tasks: Promise<void>[] = []

        for (const provider of ['strato', 'gmail'] as const) {
          const cfg = creds[provider]
          if (!cfg?.accounts) continue
          for (const acc of cfg.accounts) {
            if (!acc.password) { results[acc.email] = -1; continue }
            tasks.push(
              fetchUnreadCount(cfg.host, cfg.port, acc.email, acc.password)
                .then(count => { results[acc.email] = count })
            )
          }
        }

        await Promise.allSettled(tasks)
        emailCache.data = results
        emailCache.ts = Date.now()
      }

      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || req.url !== '/api/email/unread') return next()

        ;(async () => {
          // Return cache if fresh
          if (Date.now() - emailCache.ts < EMAIL_CACHE_TTL && Object.keys(emailCache.data).length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ counts: emailCache.data, cached: true, errors: emailErrors }))
            return
          }

          try {
            await refreshEmailCache()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ counts: emailCache.data, cached: false, errors: emailErrors }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: (err as Error).message, counts: {} }))
          }
        })()
      })

      // --------------------------------------------------------
      // GET /api/email/inbox — Fetch email headers from IMAP
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/api/email/inbox')) return next()
        const url = new URL(req.url, 'http://localhost')
        const account = url.searchParams.get('account')
        const limit = parseInt(url.searchParams.get('limit') || '30')
        if (!account) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'account required' })); return }

        ;(async () => {
          try {
            const { client } = await connectImap(account)
            const lock = await client.getMailboxLock('INBOX')
            try {
              const uids = await client.search({ seen: false }, { uid: true })
              if (uids.length === 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ emails: [] }))
                return
              }
              const targetUids = uids.slice(-limit)
              const emails: any[] = []
              for await (const msg of client.fetch(targetUids, { uid: true, envelope: true, flags: true, bodyStructure: true, source: { start: 0, maxLength: 1000 } }, { uid: true })) {
                const env = msg.envelope
                let snippet = ''
                if (msg.source) {
                  const srcStr = msg.source.toString('utf-8')
                  const bodyStart = srcStr.indexOf('\r\n\r\n')
                  if (bodyStart > -1) {
                    snippet = srcStr.substring(bodyStart + 4, bodyStart + 504)
                      .replace(/<[^>]*>/g, '')
                      .replace(/\s+/g, ' ')
                      .trim()
                      .substring(0, 200)
                  }
                }
                emails.push({
                  uid: msg.uid,
                  messageId: env.messageId || '',
                  from: { name: env.from?.[0]?.name || '', address: env.from?.[0]?.address || '' },
                  to: (env.to || []).map((t: any) => ({ name: t.name || '', address: t.address || '' })),
                  subject: env.subject || '(Kein Betreff)',
                  date: env.date ? new Date(env.date).toISOString() : new Date().toISOString(),
                  snippet,
                  seen: (msg.flags || new Set()).has('\\Seen'),
                })
              }
              emails.sort((a: any, b: any) => b.date.localeCompare(a.date))
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ emails }))
            } finally {
              lock.release()
              await client.logout()
            }
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: (err as Error).message, emails: [] }))
          }
        })()
      })

      // --------------------------------------------------------
      // GET /api/email/message — Fetch full email body
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/api/email/message')) return next()
        const url = new URL(req.url, 'http://localhost')
        const account = url.searchParams.get('account')
        const uid = url.searchParams.get('uid')
        if (!account || !uid) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'account and uid required' })); return }

        ;(async () => {
          try {
            const { client } = await connectImap(account)
            const lock = await client.getMailboxLock('INBOX')
            try {
              const msg = await client.fetchOne(uid, { uid: true, envelope: true, source: true }, { uid: true })
              const env = msg.envelope
              const srcStr = msg.source ? msg.source.toString('utf-8') : ''

              // Parse multipart MIME properly
              let textPlain = ''
              let textHtml = ''

              function decodeBase64(str: string): string {
                try { return Buffer.from(str.replace(/\s/g, ''), 'base64').toString('utf-8') } catch { return str }
              }
              function decodeQP(str: string): string {
                return str.replace(/=\r?\n/g, '').replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
              }

              // Find all MIME parts
              const boundaryMatch = srcStr.match(/boundary="?([^"\r\n;]+)"?/i)
              if (boundaryMatch) {
                const boundary = boundaryMatch[1]
                const parts = srcStr.split('--' + boundary)
                for (const part of parts) {
                  const headerEnd = part.indexOf('\r\n\r\n')
                  if (headerEnd < 0) continue
                  const headers = part.substring(0, headerEnd).toLowerCase()
                  let content = part.substring(headerEnd + 4).replace(/--\s*$/, '').trim()

                  // Handle nested multipart — recurse one level
                  const nestedBoundary = headers.match(/boundary="?([^"\r\n;]+)"?/i)
                  if (nestedBoundary) {
                    const nestedParts = content.split('--' + nestedBoundary[1])
                    for (const np of nestedParts) {
                      const nh = np.indexOf('\r\n\r\n')
                      if (nh < 0) continue
                      const nHeaders = np.substring(0, nh).toLowerCase()
                      let nContent = np.substring(nh + 4).replace(/--\s*$/, '').trim()
                      if (nHeaders.includes('base64')) nContent = decodeBase64(nContent)
                      else if (nHeaders.includes('quoted-printable')) nContent = decodeQP(nContent)
                      if (nHeaders.includes('text/plain') && !textPlain) textPlain = nContent
                      if (nHeaders.includes('text/html') && !textHtml) textHtml = nContent
                    }
                    continue
                  }

                  if (headers.includes('base64')) content = decodeBase64(content)
                  else if (headers.includes('quoted-printable')) content = decodeQP(content)
                  if (headers.includes('text/plain') && !textPlain) textPlain = content
                  if (headers.includes('text/html') && !textHtml) textHtml = content
                }
              } else {
                // Simple non-multipart email
                const bodyStart = srcStr.indexOf('\r\n\r\n')
                if (bodyStart > -1) {
                  let body = srcStr.substring(bodyStart + 4)
                  const headerSection = srcStr.substring(0, bodyStart).toLowerCase()
                  if (headerSection.includes('base64')) body = decodeBase64(body)
                  else if (headerSection.includes('quoted-printable')) body = decodeQP(body)
                  if (headerSection.includes('text/html')) {
                    textHtml = body
                  } else {
                    textPlain = body
                  }
                }
              }

              // If only HTML, strip tags for plain text
              if (!textPlain && textHtml) {
                textPlain = textHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
              }

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                uid: msg.uid,
                account,
                subject: env.subject || '',
                from: { name: env.from?.[0]?.name || '', address: env.from?.[0]?.address || '' },
                date: env.date ? new Date(env.date).toISOString() : '',
                textPlain: textPlain.substring(0, 5000),
                textHtml: textHtml.substring(0, 10000),
              }))
            } finally {
              lock.release()
              await client.logout()
            }
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: (err as Error).message }))
          }
        })()
      })

      // --------------------------------------------------------
      // POST /api/email/triage — AI-classify emails via Claude Haiku
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/email/triage') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { account, emails, groupId } = JSON.parse(body)
              if (!account || !emails?.length) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'account and emails required' })); return }

              const uncached = emails.filter((e: any) => !triageCache.has(`${account}:${e.uid}`))

              if (uncached.length > 0) {
                for (let i = 0; i < uncached.length; i += 6) {
                  const batch = uncached.slice(i, i + 6)
                  const prompt = buildTriagePrompt(batch, account)

                  const response = await getAnthropic().messages.create({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 4000,
                    messages: [{ role: 'user', content: prompt }],
                  })

                  let jsonText = (response.content[0] as any).text || ''
                  jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```/g, '').trim()

                  try {
                    const classifications = JSON.parse(jsonText)
                    for (const cls of classifications) {
                      const envelope = batch.find((e: any) => e.uid === cls.uid)
                      if (!envelope) continue
                      const triaged = {
                        envelope,
                        triage: {
                          category: cls.category,
                          summary: cls.summary,
                          urgency: cls.urgency,
                          suggested_action: cls.suggested_action,
                          draft_reply: cls.draft_reply || undefined,
                          todo_text: cls.todo_text || undefined,
                          sender_context: cls.sender_context || undefined,
                        },
                        account,
                        groupId: groupId || '',
                      }
                      triageCache.set(`${account}:${cls.uid}`, triaged)
                    }
                  } catch (parseErr) {
                    console.error('Triage parse error:', parseErr, 'Raw:', jsonText.substring(0, 200))
                  }
                }
              }

              const results = emails
                .map((e: any) => triageCache.get(`${account}:${e.uid}`))
                .filter(Boolean)

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ results }))
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: (err as Error).message, results: [] }))
            }
          })()
        })
      })

      // --------------------------------------------------------
      // POST /api/email/action — IMAP actions (read, delete, move, flag)
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/email/action') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { account, uid, action, target } = JSON.parse(body)
              if (!account || !uid || !action) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'account, uid, action required' })); return }

              const { client } = await connectImap(account)
              const lock = await client.getMailboxLock('INBOX')
              try {
                const uidStr = String(uid)
                switch (action) {
                  case 'read':
                    await client.messageFlagsAdd(uidStr, ['\\Seen'], { uid: true })
                    break
                  case 'unread':
                    await client.messageFlagsRemove(uidStr, ['\\Seen'], { uid: true })
                    break
                  case 'delete':
                    await client.messageDelete(uidStr, { uid: true })
                    break
                  case 'move':
                    if (!target) throw new Error('target folder required for move')
                    try { await client.mailboxCreate(target) } catch { /* already exists */ }
                    await client.messageMove(uidStr, target, { uid: true })
                    break
                  case 'flag':
                    await client.messageFlagsAdd(uidStr, ['\\Flagged'], { uid: true })
                    break
                  default:
                    throw new Error(`Unknown action: ${action}`)
                }
                triageCache.delete(`${account}:${uid}`)
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: true }))
              } finally {
                lock.release()
                await client.logout()
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: (err as Error).message }))
            }
          })()
        })
      })

      // --------------------------------------------------------
      // POST /api/email/send — Send email via SMTP
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/email/send') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { account, to, subject, body: emailBody, inReplyTo, references } = JSON.parse(body)
              if (!account || !to || !subject || !emailBody) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'account, to, subject, body required' })); return }

              const cred = findCredentials(account)
              if (!cred) throw new Error(`No credentials for ${account}`)

              const smtpConfig = getSmtpConfig(cred.provider, account, cred.password)
              const transporter = createTransport(smtpConfig)

              const mailOptions: any = {
                from: account,
                to,
                subject,
                text: emailBody,
              }
              if (inReplyTo) mailOptions.inReplyTo = inReplyTo
              if (references) mailOptions.references = references

              const info = await transporter.sendMail(mailOptions)
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, messageId: info.messageId }))
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: (err as Error).message }))
            }
          })()
        })
      })

      // --------------------------------------------------------
      // POST /api/email/draft/approve — Approve KANI draft + send + archive
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/email/draft/approve') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { account, uid, draft, to, subject, inReplyTo } = JSON.parse(body)
              if (!account || !uid || !draft || !to) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'account, uid, draft, to required' })); return }

              // 1. Send via SMTP
              const cred = findCredentials(account)
              if (!cred) throw new Error(`No credentials for ${account}`)
              const smtpConfig = getSmtpConfig(cred.provider, account, cred.password)
              const transporter = createTransport(smtpConfig)
              await transporter.sendMail({
                from: account,
                to,
                subject: subject || 'Re:',
                text: draft,
                inReplyTo: inReplyTo || undefined,
              })

              // 2. Mark original as read + move to Bearbeitet
              const { client } = await connectImap(account)
              const lock = await client.getMailboxLock('INBOX')
              try {
                const uidStr = String(uid)
                await client.messageFlagsAdd(uidStr, ['\\Seen'], { uid: true })
                try { await client.mailboxCreate('KANI/Bearbeitet') } catch { /* exists */ }
                await client.messageMove(uidStr, 'KANI/Bearbeitet', { uid: true })
              } finally {
                lock.release()
                await client.logout()
              }

              // 3. Remove from cache
              triageCache.delete(`${account}:${uid}`)

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true }))
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: (err as Error).message }))
            }
          })()
        })
      })

      // --------------------------------------------------------
      // Google Calendar — Shared auth helper with token cache
      // --------------------------------------------------------
      let calTokenCache: { token: string; envHash: string; expiresAt: number } | null = null

      async function getCalendarAccessToken(): Promise<string> {
        // Read env fresh from disk every time to detect .env.local changes
        const envRaw = readFileSync(join(process.cwd(), '.env.local'), 'utf-8')
        const envLines: Record<string, string> = {}
        for (const line of envRaw.split('\n')) {
          const eq = line.indexOf('=')
          if (eq > 0 && !line.startsWith('#')) envLines[line.substring(0, eq).trim()] = line.substring(eq + 1).trim()
        }
        const clientId = envLines.VITE_GOOGLE_CLIENT_ID
        const clientSecret = envLines.VITE_GOOGLE_CLIENT_SECRET
        const refreshToken = envLines.GOOGLE_REFRESH_TOKEN
        if (!clientId || !clientSecret || !refreshToken) {
          throw new Error('Google Calendar not configured')
        }
        // Cache key = hash of refresh token (detects scope upgrades via new token)
        const envHash = refreshToken.substring(0, 20)
        if (calTokenCache && calTokenCache.envHash === envHash && Date.now() < calTokenCache.expiresAt) {
          return calTokenCache.token
        }
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        })
        const tokenData = await tokenRes.json()
        if (!tokenData.access_token) throw new Error('Failed to get access token')
        calTokenCache = { token: tokenData.access_token, envHash, expiresAt: Date.now() + 50 * 60 * 1000 }
        return tokenData.access_token
      }

      // --------------------------------------------------------
      // GET /api/calendar/calendars — List subscribed calendars
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || req.url !== '/api/calendar/calendars') return next()

        ;(async () => {
          try {
            const token = await getCalendarAccessToken()
            const listRes = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
              headers: { Authorization: `Bearer ${token}` },
            })
            const listData = await listRes.json()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const calendars = (listData.items || [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((c: any) => c.accessRole !== 'freeBusyReader')
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((c: any) => ({
                id: c.id,
                name: c.summaryOverride || c.summary || c.id,
                backgroundColor: c.backgroundColor || '#4285f4',
                foregroundColor: c.foregroundColor || '#ffffff',
                primary: !!c.primary,
                accessRole: c.accessRole || 'reader',
                selected: c.selected !== false,
              }))
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ calendars }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: (err as Error).message, calendars: [] }))
          }
        })()
      })

      // --------------------------------------------------------
      // GET /api/calendar/events — Fetch Google Calendar events
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/api/calendar/events')) return next()

        const url = new URL(req.url, 'http://localhost')
        const timeMin = url.searchParams.get('timeMin') || new Date().toISOString()
        const timeMax = url.searchParams.get('timeMax') || new Date(Date.now() + 30 * 86400000).toISOString()
        const calendarId = url.searchParams.get('calendarId') || loadEnv('development', process.cwd(), '').GOOGLE_CALENDAR_ID || 'primary'
        const q = url.searchParams.get('q') || undefined

        ;(async () => {
          try {
            const token = await getCalendarAccessToken()
            const params: Record<string, string> = { timeMin, timeMax, singleEvents: 'true', orderBy: 'startTime', maxResults: '250' }
            if (q) params.q = q
            const calUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` + new URLSearchParams(params)
            const calRes = await fetch(calUrl, {
              headers: { Authorization: `Bearer ${token}` },
            })
            const calData = await calRes.json()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const events = (calData.items || []).map((item: any) => ({
              id: item.id,
              title: item.summary || '(Kein Titel)',
              start: item.start?.dateTime || item.start?.date || '',
              end: item.end?.dateTime || item.end?.date || '',
              allDay: !item.start?.dateTime,
              location: item.location || '',
              description: (item.description || '').substring(0, 200),
              calendarId,
              color: item.colorId || '',
            }))
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ events }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: (err as Error).message, events: [] }))
          }
        })()
      })

      // --------------------------------------------------------
      // POST /api/calendar/events/create — Create a calendar event
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/calendar/events/create') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { calendarId, title, start, end, description, location, allDay } = JSON.parse(body)
              if (!title) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'title required' })); return }
              const token = await getCalendarAccessToken()
              const targetCal = calendarId || 'primary'
              const event: Record<string, unknown> = { summary: title, description: description || '', location: location || '' }
              if (allDay) {
                event.start = { date: start.split('T')[0] }
                event.end = { date: (end || start).split('T')[0] }
              } else {
                event.start = { dateTime: start, timeZone: 'Europe/Berlin' }
                event.end = { dateTime: end, timeZone: 'Europe/Berlin' }
              }
              const createRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCal)}/events`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
              })
              const created = await createRes.json()
              if (!createRes.ok) { res.writeHead(createRes.status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: created.error?.message || 'Create failed' })); return }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, event: { id: created.id, title: created.summary, start: created.start?.dateTime || created.start?.date || '', end: created.end?.dateTime || created.end?.date || '', allDay: !created.start?.dateTime } }))
            } catch (err) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: (err as Error).message })) }
          })()
        })
      })

      // --------------------------------------------------------
      // POST /api/calendar/events/update — Update a calendar event
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/calendar/events/update') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { calendarId, eventId, title, start, end, description, location, allDay } = JSON.parse(body)
              if (!eventId) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'eventId required' })); return }
              const token = await getCalendarAccessToken()
              const targetCal = calendarId || 'primary'
              const patch: Record<string, unknown> = {}
              if (title !== undefined) patch.summary = title
              if (description !== undefined) patch.description = description
              if (location !== undefined) patch.location = location
              if (start !== undefined) {
                patch.start = allDay ? { date: start.split('T')[0] } : { dateTime: start, timeZone: 'Europe/Berlin' }
              }
              if (end !== undefined) {
                patch.end = allDay ? { date: end.split('T')[0] } : { dateTime: end, timeZone: 'Europe/Berlin' }
              }
              const patchRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCal)}/events/${encodeURIComponent(eventId)}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
              })
              const updated = await patchRes.json()
              if (!patchRes.ok) { res.writeHead(patchRes.status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: updated.error?.message || 'Update failed' })); return }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true }))
            } catch (err) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: (err as Error).message })) }
          })()
        })
      })

      // --------------------------------------------------------
      // POST /api/calendar/events/delete — Delete a calendar event
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/calendar/events/delete') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { calendarId, eventId } = JSON.parse(body)
              if (!eventId) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'eventId required' })); return }
              const token = await getCalendarAccessToken()
              const targetCal = calendarId || 'primary'
              const delRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCal)}/events/${encodeURIComponent(eventId)}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
              if (!delRes.ok && delRes.status !== 204) {
                const errData = await delRes.json().catch(() => ({}))
                res.writeHead(delRes.status, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: (errData as { error?: { message?: string } }).error?.message || 'Delete failed' }))
                return
              }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true }))
            } catch (err) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: (err as Error).message })) }
          })()
        })
      })

      // --------------------------------------------------------
      // POST /api/todos/sync-to-file — Write Supabase todos back to TODOS.md
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/todos/sync-to-file') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          let projectId: string
          try {
            projectId = JSON.parse(body).project_id
          } catch {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Invalid JSON')
            return
          }

          if (!projectId || !serverSupabase) {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Missing project_id or no Supabase connection')
            return
          }

          try {
            const { data: todos } = await serverSupabase
              .from('todos')
              .select('*')
              .eq('project_id', projectId)
              .order('sort_order')

            if (!todos) {
              res.writeHead(200, { 'Content-Type': 'text/plain' })
              res.end('No todos found')
              return
            }

            const todosPath = join(homedir(), 'mckay-os', 'projects', projectId, 'TODOS.md')

            // Read existing file to preserve header
            let header = `# ${projectId} — TODOS\n> Auto-synced from Mission Control\n\n`
            if (existsSync(todosPath)) {
              const existing = readFileSync(todosPath, 'utf-8')
              const headerEnd = existing.indexOf('## ')
              if (headerEnd > 0) header = existing.substring(0, headerEnd)
            }

            const openTodos = todos.filter((t: { status: string }) => t.status !== 'done')
            const doneTodos = todos.filter((t: { status: string }) => t.status === 'done')

            let md = header
            md += '## Active\n\n'
            for (const t of openTodos) {
              md += `- [ ] **${t.priority}** ${t.title}\n`
            }
            md += '\n## Done\n\n'
            for (const t of doneTodos) {
              md += `- [x] **${t.priority}** ${t.title}\n`
            }

            writeFileSync(todosPath, md)
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end('OK')
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end(`Error: ${(err as Error).message}`)
          }
        })
      })

      // --------------------------------------------------------
      // POST /api/kani/session-end-single — End one terminal session
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/session-end-single') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          let terminalId: string
          try {
            const parsed = JSON.parse(body)
            terminalId = parsed.terminalId
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
            return
          }

          if (!terminalId) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'terminalId required' }))
            return
          }

          // Ensure session is tracked (may have been lost on server restart)
          sessionStarted.add(terminalId)

          // Kill existing process
          const existing = activeProcesses.get(terminalId)
          if (existing) {
            existing.proc.kill('SIGTERM')
            activeProcesses.delete(terminalId)
          }

          const SESSION_END_PROMPT =
            'Session wird beendet. Führe das Session-End-Protokoll durch: ' +
            '1) MEMORY.md dieses Projekts aktualisieren (Letzte Session + Next Steps) ' +
            '2) TODOS.md prüfen und aktualisieren ' +
            '3) Alle Änderungen committen und pushen ' +
            'Antworte nur mit: [SESSION_END] ✓'

          const cwd = terminalId.startsWith('project:')
            ? join(homedir(), 'mckay-os', 'projects', terminalId.replace('project:', ''))
            : join(homedir(), 'mckay-os')

          addToHistory(terminalId, 'user', '[SESSION END] Feierabend-Protokoll gestartet')

          const proc = spawn(resolveClaudePath(), ['--continue', '-p', SESSION_END_PROMPT, '--output-format', 'text'], {
            cwd,
            env: spawnEnv(),
            stdio: ['ignore', 'pipe', 'pipe'],
          })

          activeProcesses.set(terminalId, { proc, terminalId, cwd, startedAt: Date.now() })

          let output = ''
          proc.stdout.on('data', (data: Buffer) => { output += data.toString() })

          proc.on('error', (err) => {
            activeProcesses.delete(terminalId)
            sessionStarted.delete(terminalId)
            writeSignal(terminalId, `SESSION_END ERROR: ${err.message}`)
          })

          proc.on('close', () => {
            activeProcesses.delete(terminalId)
            sessionStarted.delete(terminalId)
            addToHistory(terminalId, 'assistant', output || '[SESSION_END] ✓')
            writeSignal(terminalId, 'SESSION_END ✓')

            if (serverSupabase) {
              serverSupabase.from('activity_log').insert({
                terminal_id: terminalId,
                type: 'session_end',
                text: `[${terminalId}] Session beendet (Feierabend)`,
                response_preview: output.substring(0, 500),
                time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
              }).then(() => {})
              serverSupabase.from('notifications').insert({
                typ: 'info',
                title: `Feierabend: ${terminalId.replace('project:', '')}`,
                subtitle: 'Session-End Protokoll abgeschlossen',
                source: `session-end:${terminalId}`,
                terminal_id: terminalId,
              }).then(() => {})
            }
          })

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, terminalId }))
        })
      })

      // --------------------------------------------------------
      // GET /api/kani/history/:terminalId — Get session history
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/api/kani/history/')) return next()

        const terminalId = decodeURIComponent(req.url.replace('/api/kani/history/', ''))
        const history = getHistory(terminalId)
        const isActive = activeProcesses.has(terminalId)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ terminalId, history, isActive }))
      })

      // --------------------------------------------------------
      // GET /api/kani/status — List all terminal sessions with thinking state
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || req.url !== '/api/kani/status') return next()

        const now = Date.now()

        // Discover terminals with persisted history on disk (survives server restart)
        try {
          const projectsDir = join(homedir(), 'mckay-os', 'projects')
          if (existsSync(projectsDir)) {
            for (const name of readdirSync(projectsDir)) {
              const logPath = join(projectsDir, name, '.terminal-log.jsonl')
              if (existsSync(logPath)) {
                const tid = `project:${name}`
                // Load history into memory if not already there
                if (!sessionHistory.has(tid)) getHistory(tid)
                // Mark as having a session so it shows up
                if (sessionHistory.has(tid) && sessionHistory.get(tid)!.length > 0) {
                  sessionStarted.add(tid)
                }
              }
            }
          }
        } catch { /* non-critical scan */ }

        // Return ALL terminals that have an active session, not just currently running ones
        const allTerminals = Array.from(sessionStarted).map(terminalId => {
          const proc = activeProcesses.get(terminalId)
          const isThinking = !!proc
          const runningFor = proc ? Math.round((now - proc.startedAt) / 1000) : 0
          const cwd = proc?.cwd || ''

          // Extract last non-empty output line from session history
          let lastOutputLine = ''
          const history = sessionHistory.get(terminalId)
          if (history && history.length > 0) {
            // Walk backwards through history to find the last assistant message
            for (let i = history.length - 1; i >= 0; i--) {
              if (history[i].role === 'assistant' && history[i].text.trim()) {
                // Get last non-empty, non-signal line from the response
                const lines = history[i].text.split('\n')
                for (let j = lines.length - 1; j >= 0; j--) {
                  const line = lines[j].trim()
                  if (line && !line.startsWith('[SIGNAL]')) {
                    lastOutputLine = line
                    break
                  }
                }
                break
              }
            }
          }

          return { terminalId, cwd, runningFor, isThinking, lastOutputLine }
        })

        // Also include actively running processes that might not be in sessionStarted yet
        for (const [terminalId, proc] of activeProcesses) {
          if (!sessionStarted.has(terminalId)) {
            allTerminals.push({
              terminalId,
              cwd: proc.cwd,
              runningFor: Math.round((now - proc.startedAt) / 1000),
              isThinking: true,
              lastOutputLine: '',
            })
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ activeTerminals: allTerminals }))
      })

      // --------------------------------------------------------
      // POST /api/kani/session-end — Send session-end prompt to all active sessions
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/session-end') return next()

        const SESSION_END_PROMPT =
          'Session wird beendet. Führe das Session-End-Protokoll durch: ' +
          '1) MEMORY.md dieses Projekts aktualisieren (Letzte Session + Next Steps) ' +
          '2) TODOS.md prüfen und aktualisieren ' +
          '3) Alle Änderungen committen und pushen ' +
          'Antworte nur mit: [SESSION_END] ✓'

        const dispatched: string[] = []

        for (const terminalId of sessionStarted) {
          const existing = activeProcesses.get(terminalId)
          if (existing) {
            existing.proc.kill('SIGTERM')
            activeProcesses.delete(terminalId)
          }

          const cwd = terminalId.startsWith('project:')
            ? join(homedir(), 'mckay-os', 'projects', terminalId.replace('project:', ''))
            : join(homedir(), 'mckay-os')

          const proc = spawn(resolveClaudePath(), ['--continue', '-p', SESSION_END_PROMPT, '--output-format', 'text'], {
            cwd,
            env: spawnEnv(),
            stdio: ['ignore', 'pipe', 'pipe'],
          })

          activeProcesses.set(terminalId, { proc, terminalId, cwd, startedAt: Date.now() })
          dispatched.push(terminalId)

          let output = ''
          proc.stdout.on('data', (data: Buffer) => { output += data.toString() })

          proc.on('error', (err) => {
            activeProcesses.delete(terminalId)
            writeSignal(terminalId, `SESSION_END ERROR: ${err.message}`)
          })

          proc.on('close', () => {
            activeProcesses.delete(terminalId)
            writeSignal(terminalId, 'SESSION_END ✓')
            if (serverSupabase) {
              serverSupabase.from('activity_log').insert({
                terminal_id: terminalId,
                type: 'session_end',
                text: `[${terminalId}] Session beendet`,
                response_preview: output.substring(0, 500),
                time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
              }).then(() => {})
              // Auto-notification for session end
              serverSupabase.from('notifications').insert({
                typ: 'info',
                title: `Session beendet: ${terminalId}`,
                source: `session-end:${terminalId}`,
                terminal_id: terminalId,
              }).then(() => {})
            }
          })
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ dispatched }))
      })

      // --------------------------------------------------------
      // POST /api/kani/kill — Kill terminal processes
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/kill') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          let targetId: string | undefined
          try {
            if (body) {
              const parsed = JSON.parse(body)
              targetId = parsed.terminalId
            }
          } catch {
            // No body = kill all
          }

          const killed: string[] = []

          if (targetId) {
            const entry = activeProcesses.get(targetId)
            if (entry) {
              entry.proc.kill('SIGTERM')
              activeProcesses.delete(targetId)
              killed.push(targetId)
            }
          } else {
            for (const [id, entry] of activeProcesses) {
              entry.proc.kill('SIGTERM')
              killed.push(id)
            }
            activeProcesses.clear()
          }

          if (serverSupabase && killed.length > 0) {
            serverSupabase.from('activity_log').insert({
              terminal_id: 'system',
              type: 'kill',
              text: `Prozesse gestoppt: ${killed.join(', ')}`,
              time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            }).then(() => {})
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ killed }))
        })
      })

      // --------------------------------------------------------
      // POST /api/kani/abort — Kill active process for a terminal (Stop button)
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/abort') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { terminalId } = JSON.parse(body)
            const existing = activeProcesses.get(terminalId)
            if (existing) {
              existing.proc.kill('SIGTERM')
              activeProcesses.delete(terminalId)
            }
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, killed: !!existing }))
          } catch {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Invalid JSON')
          }
        })
      })

      // --------------------------------------------------------
      // POST /api/kani/reset — Clear session state for a terminal
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/reset') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { terminalId } = JSON.parse(body)
            if (terminalId) {
              sessionStarted.delete(terminalId)
              clearHistory(terminalId)
            } else {
              sessionStarted.clear()
              sessionHistory.clear()
            }
          } catch { sessionStarted.clear(); sessionHistory.clear() }
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
        })
      })

      // --------------------------------------------------------
      // POST /api/notification — Create notification
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/notification') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            if (!serverSupabase) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Supabase not configured' }))
              return
            }
            const { data: row, error } = await serverSupabase.from('notifications').insert({
              typ: parsed.typ || 'info',
              title: parsed.title || '',
              subtitle: parsed.subtitle || '',
              source: parsed.source || '',
              project_id: parsed.project_id || null,
              idea_id: parsed.idea_id || null,
              terminal_id: parsed.terminal_id || null,
              metadata: parsed.metadata || {},
            }).select().single()

            if (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: error.message }))
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, id: row.id }))
            }
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
          }
        })
      })

      // --------------------------------------------------------
      // PATCH /api/notification/:id — Mark read / dismiss
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'PATCH' || !req.url?.startsWith('/api/notification/')) return next()

        const id = req.url.replace('/api/notification/', '')
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            if (!serverSupabase) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Supabase not configured' }))
              return
            }
            const update: Record<string, unknown> = {}
            if (parsed.is_read !== undefined) update.is_read = parsed.is_read
            if (parsed.dismissed !== undefined) update.dismissed = parsed.dismissed

            const { error } = await serverSupabase.from('notifications').update(update).eq('id', id)
            if (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: error.message }))
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true }))
            }
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
          }
        })
      })

      // --------------------------------------------------------
      // POST /api/project — Create project (Supabase + folder scaffold)
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/project') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            if (!serverSupabase) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Supabase not configured' }))
              return
            }

            const name = parsed.name?.trim()
            if (!name) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Name is required' }))
              return
            }

            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            const color = parsed.color || 'var(--bl)'
            const glow = color.replace(')', 'g)')

            // Insert into Supabase
            const { error: dbError } = await serverSupabase.from('projects').insert({
              id: slug,
              name,
              description: parsed.description || '',
              color,
              glow,
              emoji: parsed.emoji || '📦',
              phase: 'Setup',
              health: 'active',
              progress: 0,
              stack: parsed.stack || 'React+Vite, TailwindCSS, Supabase',
              pipeline: [
                { label: 'Mockup', status: 'active', color, glow },
                { label: 'Foundation', status: 'upcoming', color: 'var(--tx3)', glow: 'transparent' },
                { label: 'Features', status: 'upcoming', color: 'var(--tx3)', glow: 'transparent' },
                { label: 'Launch', status: 'upcoming', color: 'var(--tx3)', glow: 'transparent' },
              ],
            })

            if (dbError) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: dbError.message }))
              return
            }

            // Scaffold folder structure
            const projectDir = join(homedir(), 'mckay-os', 'projects', slug)
            if (!existsSync(projectDir)) {
              mkdirSync(projectDir, { recursive: true })
              writeFileSync(join(projectDir, 'CLAUDE.md'), `# ${name} — Project CLAUDE.md\n> Created: ${new Date().toISOString().slice(0, 10)}\n\n## Overview\n${parsed.description || 'TBD'}\n`)
              writeFileSync(join(projectDir, 'TODOS.md'), `---\ntype: project-todos\nproject: "${slug}"\nupdated: ${new Date().toISOString().slice(0, 10)}\n---\n\n## Active\n\n## Done\n`)
              writeFileSync(join(projectDir, 'MEMORY.md'), `# ${name} — Project Memory\n> Created: ${new Date().toISOString().slice(0, 10)}\n\n## Letzte Session\n\nErste Session.\n\n## Next Steps\n\n1. Phase 0 Mockup starten\n`)
              writeFileSync(join(projectDir, 'DECISIONS.md'), `# ${name} — Decisions Log\n\n| Date | Decision | Reason |\n|------|----------|--------|\n`)
            }

            // Update idea status if converting from idea
            if (parsed.idea_id) {
              await serverSupabase.from('ideas').update({ status: 'Projekt', st: 'Projekt' }).eq('id', parsed.idea_id)
            }

            // Update launch session if exists
            if (parsed.launch_session_id) {
              await serverSupabase.from('launch_sessions').update({
                status: 'created',
                project_id: slug,
                updated_at: new Date().toISOString(),
              }).eq('id', parsed.launch_session_id)
            }

            // Create notification
            await serverSupabase.from('notifications').insert({
              typ: 'info',
              title: `Neues Projekt: ${name}`,
              subtitle: slug,
              source: 'launch',
              project_id: slug,
            })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ id: slug, success: true }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // --------------------------------------------------------
      // POST /api/launch/research — Trigger KANI research for idea
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/launch/research') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            if (!serverSupabase) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Supabase not configured' }))
              return
            }

            const sessionId = parsed.launch_session_id
            const name = parsed.name || 'Unbekannt'
            const description = parsed.description || ''

            // Update session status to 'research'
            await serverSupabase.from('launch_sessions').update({
              status: 'research',
              updated_at: new Date().toISOString(),
            }).eq('id', sessionId)

            // Respond immediately — research runs async
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true }))

            // Spawn Claude CLI for research (async, fire-and-forget)
            const researchPrompt = [
              `Analysiere diese Geschäftsidee und erstelle ein strukturiertes Research-Dokument.`,
              `Projektname: ${name}`,
              `Beschreibung: ${description}`,
              ``,
              `Antworte NUR als valides JSON mit exakt dieser Struktur:`,
              `{`,
              `  "summary": "2-3 Sätze Zusammenfassung",`,
              `  "market": "Marktanalyse und Potenzial",`,
              `  "competition": "Wettbewerb und Differenzierung",`,
              `  "audience": "Zielgruppe und Personas",`,
              `  "techStack": "Empfohlener Tech-Stack",`,
              `  "monetization": "Monetarisierungsstrategie",`,
              `  "feasibility": "Machbarkeit (1-10) mit Begründung",`,
              `  "risks": "Top 3 Risiken",`,
              `  "recommendation": "GO / PIVOT / STOP mit Begründung"`,
              `}`,
            ].join('\n')

            const proc = spawn(resolveClaudePath(), ['-p', researchPrompt, '--output-format', 'text'], {
              cwd: join(homedir(), 'mckay-os'),
              env: spawnEnv(),
              stdio: ['ignore', 'pipe', 'pipe'],
            })

            let output = ''
            proc.stdout.on('data', (data: Buffer) => { output += data.toString() })

            proc.on('close', async () => {
              // Try to parse JSON from output
              let researchOutput: Record<string, unknown> = {}
              let strategyBrief: Record<string, unknown> = {}
              try {
                const jsonMatch = output.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                  researchOutput = JSON.parse(jsonMatch[0])
                  strategyBrief = {
                    goal: researchOutput.summary || '',
                    audience: researchOutput.audience || '',
                    stack: researchOutput.techStack || '',
                    market: researchOutput.market || '',
                    monetization: researchOutput.monetization || '',
                    recommendation: researchOutput.recommendation || '',
                  }
                }
              } catch {
                researchOutput = { raw: output, parseError: true }
              }

              // Update launch session with results
              await serverSupabase.from('launch_sessions').update({
                status: 'brief',
                research_output: researchOutput,
                strategy_brief: strategyBrief,
                updated_at: new Date().toISOString(),
              }).eq('id', sessionId)

              // Create notification
              await serverSupabase.from('notifications').insert({
                typ: 'review',
                title: `Research fertig: ${name}`,
                subtitle: 'Strategy Brief bereit zur Review',
                source: `launch:${sessionId}`,
              })
            })

            proc.on('error', async () => {
              await serverSupabase.from('launch_sessions').update({
                status: 'describe',
                error: 'Claude CLI konnte nicht gestartet werden',
                updated_at: new Date().toISOString(),
              }).eq('id', sessionId)
            })

            // Timeout after 3 minutes for research
            setTimeout(() => {
              if (!proc.killed) {
                proc.kill()
                serverSupabase.from('launch_sessions').update({
                  status: 'describe',
                  error: 'Research Timeout (3min)',
                  updated_at: new Date().toISOString(),
                }).eq('id', sessionId).then(() => {})
              }
            }, 180000)

          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
          }
        })
      })

      // --------------------------------------------------------
      // POST /api/kani/log — Write to activity_log
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/log') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)

            if (!serverSupabase) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Supabase not configured' }))
              return
            }

            const { error } = await serverSupabase.from('activity_log').insert({
              project_id: parsed.project_id || null,
              terminal_id: parsed.terminal_id || 'system',
              type: parsed.type || 'info',
              text: parsed.text || '',
              prompt: parsed.prompt || '',
              response_preview: parsed.response_preview || '',
              time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            })

            if (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: error.message }))
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true }))
            }
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mckayPlugin(), kaniTerminal()],
})
