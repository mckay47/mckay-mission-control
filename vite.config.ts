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
      // GET /api/calendar/events — Fetch Google Calendar events
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/api/calendar/events')) return next()

        const url = new URL(req.url, 'http://localhost')
        const timeMin = url.searchParams.get('timeMin') || new Date().toISOString()
        const timeMax = url.searchParams.get('timeMax') || new Date(Date.now() + 30 * 86400000).toISOString()

        const env = loadEnv('development', process.cwd(), '')
        const clientId = env.VITE_GOOGLE_CLIENT_ID
        const clientSecret = env.VITE_GOOGLE_CLIENT_SECRET
        const refreshToken = env.GOOGLE_REFRESH_TOKEN
        const calendarId = env.GOOGLE_CALENDAR_ID || 'primary'

        if (!clientId || !clientSecret || !refreshToken) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Google Calendar not configured. Add credentials to .env.local', events: [] }))
          return
        }

        // Get access token from refresh token, then fetch events
        ;(async () => {
          try {
            // Step 1: Exchange refresh token for access token
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
            if (!tokenData.access_token) {
              res.writeHead(401, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Failed to get access token', details: tokenData, events: [] }))
              return
            }

            // Step 2: Fetch calendar events
            const calUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` + new URLSearchParams({
              timeMin,
              timeMax,
              singleEvents: 'true',
              orderBy: 'startTime',
              maxResults: '100',
            })
            const calRes = await fetch(calUrl, {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            })
            const calData = await calRes.json()

            // Step 3: Transform to our CalendarEvent format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const events = (calData.items || []).map((item: any) => ({
              id: item.id,
              title: item.summary || '(Kein Titel)',
              start: item.start?.dateTime || item.start?.date || '',
              end: item.end?.dateTime || item.end?.date || '',
              allDay: !item.start?.dateTime,
              location: item.location || '',
              description: (item.description || '').substring(0, 200),
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
