import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error — plugin is .mjs, no declaration file
import mckayPlugin from './scripts/vite-mckay-plugin.mjs'
import { spawn, type ChildProcess } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'
import type { Plugin, ViteDevServer } from 'vite'
import { createClient } from '@supabase/supabase-js'

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

function resolveCwd(cwd: string): string {
  return cwd.startsWith('~') ? join(homedir(), cwd.slice(1)) : cwd
}

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

          const isNewSession = !sessionStarted.has(terminalId)
          sessionStarted.add(terminalId)

          const claudeArgs = isNewSession
            ? ['-p', prompt, '--output-format', 'text']
            : ['--continue', '-p', prompt, '--output-format', 'text']

          const proc = spawn('claude', claudeArgs, {
            cwd,
            env: { ...process.env },
            stdio: ['ignore', 'pipe', 'pipe'],
          })

          // Register in process registry
          activeProcesses.set(terminalId, { proc, terminalId, cwd, startedAt: Date.now() })

          let responseText = ''

          proc.stdout.on('data', (data: Buffer) => {
            const chunk = data.toString()
            responseText += chunk
            res.write(chunk)
          })

          proc.stderr.on('data', () => {
            // stderr silenced — claude CLI warnings are noise
          })

          proc.on('close', () => {
            activeProcesses.delete(terminalId)
            res.end()

            // Auto-log to activity_log
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
      // GET /api/kani/status — List active terminal processes
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || req.url !== '/api/kani/status') return next()

        const now = Date.now()
        const activeTerminals = Array.from(activeProcesses.values()).map(p => ({
          terminalId: p.terminalId,
          cwd: p.cwd,
          runningFor: Math.round((now - p.startedAt) / 1000),
        }))

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ activeTerminals }))
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
      // POST /api/kani/reset — Clear session state for a terminal
      // --------------------------------------------------------
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/kani/reset') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { terminalId } = JSON.parse(body)
            if (terminalId) sessionStarted.delete(terminalId)
            else sessionStarted.clear()
          } catch { sessionStarted.clear() }
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
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
