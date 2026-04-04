/**
 * Vite Plugin: MCKAY OS Filesystem Bridge
 * - POST /api/todo       → writes todo to ~/mckay-os/todos/
 * - POST /api/idea       → writes idea + AI processing to ~/mckay-os/ideas/
 * - POST /api/idea/:id/research   → sets status to researching
 * - POST /api/idea/:id/to-project → transforms idea to project
 * - POST /api/idea/:id/park       → sets status to parked
 * - Watches ~/mckay-os/ for changes → re-generates data.ts → HMR auto-updates
 * - Registers/deregisters session in ACTIVE_SESSIONS.md
 */

import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync, watch } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { execSync } from 'child_process'

// Load .env.local into process.env (Vite doesn't do this for server plugins)
const envPath = join(import.meta.dirname, '..', '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
  console.log('[mckay] Loaded .env.local')
}
import { processIdea } from './idea-processor.mjs'
import { chatWithKani, researchIdea } from './kani-chat.mjs'

const MCKAY = join(homedir(), 'mckay-os')
const SCRIPT = join(import.meta.dirname, 'generate-data.mjs')

function slugify(str) {
  return str.toLowerCase()
    .replace(/[äöüß]/g, c => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[c] || c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

function regenerate() {
  try {
    execSync(`node "${SCRIPT}"`, { stdio: 'pipe' })
    return true
  } catch (e) {
    console.error('[mckay] regenerate failed:', e.message)
    return false
  }
}

function registerSession() {
  const file = join(MCKAY, 'sync', 'ACTIVE_SESSIONS.md')
  const now = new Date().toISOString().slice(0, 16)
  const content = `---
type: sync
updated: ${now}
---

## Active Sessions

| Session | Directory | Started | Task | Status |
|---|---|---|---|---|
| Dashboard | ~/mckay-os/projects/mission-control | ${now} | Phase C: Live Dashboard | active |
`
  writeFileSync(file, content, 'utf-8')
  console.log('[mckay] Session registered in ACTIVE_SESSIONS.md')
}

function deregisterSession() {
  const file = join(MCKAY, 'sync', 'ACTIVE_SESSIONS.md')
  const now = new Date().toISOString().slice(0, 16)
  const content = `---
type: sync
updated: ${now}
---

## Active Sessions

| Session | Directory | Started | Task | Status |
|---|---|---|---|---|
`
  writeFileSync(file, content, 'utf-8')
  console.log('[mckay] Session deregistered')
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { reject(new Error('Invalid JSON')) }
    })
  })
}

export default function mckayPlugin() {
  let watcher = null
  let debounceTimer = null

  return {
    name: 'vite-mckay-plugin',

    configureServer(server) {
      // Register session on start
      registerSession()

      // Watch ~/mckay-os/ for external changes (e.g. Terminal 2)
      const watchDirs = ['ideas', 'todos', 'sync', 'finance', 'office', 'config'].map(d => join(MCKAY, d))
      const watchFiles = ['MEMORY.md', 'REGISTRY.md'].map(f => join(MCKAY, f))

      function onExternalChange(filename) {
        // Ignore _INDEX.md changes (we generate those)
        if (filename && filename.includes('_INDEX')) return
        // Debounce: wait 500ms after last change
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          console.log(`[mckay] External change detected: ${filename || 'unknown'}`)
          regenerate()
        }, 500)
      }

      for (const dir of watchDirs) {
        if (existsSync(dir)) {
          try {
            const w = watch(dir, { recursive: false }, (_, filename) => onExternalChange(filename))
            if (!watcher) watcher = []
            watcher.push(w)
          } catch { /* ignore watch errors */ }
        }
      }
      for (const file of watchFiles) {
        if (existsSync(file)) {
          try {
            const w = watch(file, (_, filename) => onExternalChange(filename))
            if (!watcher) watcher = []
            watcher.push(w)
          } catch { /* ignore */ }
        }
      }

      // Deregister on server close
      const cleanup = () => {
        deregisterSession()
        if (watcher) watcher.forEach(w => w.close())
      }
      process.on('SIGINT', () => { cleanup(); process.exit() })
      process.on('SIGTERM', () => { cleanup(); process.exit() })

      // API Middleware
      server.middlewares.use((req, res, next) => {
        // POST /api/todo
        if (req.method === 'POST' && req.url === '/api/todo') {
          parseBody(req).then(data => {
            const { title, priority = 'medium', project = '', due = '' } = data
            if (!title) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'title required' }))
              return
            }
            const id = slugify(title)
            const now = new Date().toISOString().slice(0, 10)
            const content = `---
id: "${id}"
title: "${title.replace(/"/g, '\\"')}"
type: todo
status: open
priority: ${priority}
project: "${project}"
assignee: "mehti"
due: "${due}"
created: "${now}"
updated: "${now}"
tags: []
---

## Description

${title}
`
            const filePath = join(MCKAY, 'todos', `${id}.md`)
            writeFileSync(filePath, content, 'utf-8')
            console.log(`[mckay] Todo written: ${filePath}`)

            // Update index
            updateTodoIndex()

            // Regenerate data.ts → triggers HMR
            regenerate()

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, id, path: filePath }))
          }).catch(err => {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })
          return
        }

        // POST /api/idea — Create idea + AI processing (Stufe 1)
        if (req.method === 'POST' && req.url === '/api/idea') {
          parseBody(req).then(async (data) => {
            const { title, description = '', category = 'projekt', priority = 'medium' } = data
            const rawText = description || title
            if (!rawText) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'title or description required' }))
              return
            }
            const ideaTitle = title || rawText.split(/[.\n]/)[0].slice(0, 80)
            const id = slugify(ideaTitle)
            const now = new Date().toISOString().slice(0, 10)

            // Step 1: Save raw idea immediately (user sees it fast)
            const initialContent = buildIdeaFile({ id, title: ideaTitle, category, priority, now, rawText, status: 'processing' })
            const filePath = join(MCKAY, 'ideas', `${id}.md`)
            writeFileSync(filePath, initialContent, 'utf-8')
            console.log(`[mckay] Idea saved: ${filePath}`)
            updateIdeaIndex()
            regenerate()

            // Step 2: AI processing (async — updates the file when done)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, id, status: 'processing' }))

            try {
              console.log(`[mckay] Processing idea "${ideaTitle}" with AI...`)
              const result = await processIdea(rawText)
              console.log(`[mckay] AI processing done for "${ideaTitle}"`)

              // Step 3: Update file with AI results
              const enrichedContent = buildIdeaFile({
                id, title: ideaTitle, category, priority, now, rawText,
                status: 'new',
                structured: result.structured,
                feedback: result.feedback,
                recommendation: result.recommendation,
              })
              writeFileSync(filePath, enrichedContent, 'utf-8')
              updateIdeaIndex()
              regenerate() // triggers HMR → dashboard auto-updates
              console.log(`[mckay] Idea enriched and saved: ${filePath}`)
            } catch (err) {
              console.error(`[mckay] AI processing failed:`, err.message)
              // Update status to 'new' even if AI fails
              const fallbackContent = buildIdeaFile({ id, title: ideaTitle, category, priority, now, rawText, status: 'new' })
              writeFileSync(filePath, fallbackContent, 'utf-8')
              regenerate()
            }
          }).catch(err => {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })
          return
        }

        // POST /api/idea/:id/research — Stufe 2a
        if (req.method === 'POST' && req.url?.match(/^\/api\/idea\/([^/]+)\/research$/)) {
          const id = req.url.match(/^\/api\/idea\/([^/]+)\/research$/)[1]
          const filePath = join(MCKAY, 'ideas', `${id}.md`)
          if (!existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Idea not found' }))
            return
          }
          const content = readFileSync(filePath, 'utf-8')
          const updated = content.replace(/status: \w+/, 'status: researching')
          writeFileSync(filePath, updated, 'utf-8')
          updateIdeaIndex()
          regenerate()
          console.log(`[mckay] Idea ${id} → researching`)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, id, status: 'researching' }))
          return
        }

        // POST /api/idea/:id/park — Stufe 2c
        if (req.method === 'POST' && req.url?.match(/^\/api\/idea\/([^/]+)\/park$/)) {
          const id = req.url.match(/^\/api\/idea\/([^/]+)\/park$/)[1]
          const filePath = join(MCKAY, 'ideas', `${id}.md`)
          if (!existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Idea not found' }))
            return
          }
          const content = readFileSync(filePath, 'utf-8')
          const updated = content.replace(/status: \w+/, 'status: parked')
          writeFileSync(filePath, updated, 'utf-8')
          updateIdeaIndex()
          regenerate()
          console.log(`[mckay] Idea ${id} → parked`)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, id, status: 'parked' }))
          return
        }

        // POST /api/idea/:id/to-project — Stufe 2b
        if (req.method === 'POST' && req.url?.match(/^\/api\/idea\/([^/]+)\/to-project$/)) {
          const id = req.url.match(/^\/api\/idea\/([^/]+)\/to-project$/)[1]
          const filePath = join(MCKAY, 'ideas', `${id}.md`)
          if (!existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Idea not found' }))
            return
          }

          // Read idea data
          const ideaContent = readFileSync(filePath, 'utf-8')
          const meta = parseFM(ideaContent)
          const projName = id
          const projDir = join(MCKAY, 'projects', projName)
          const now = new Date().toISOString().slice(0, 10)

          // Create project directory + files
          if (!existsSync(projDir)) mkdirSync(projDir, { recursive: true })

          writeFileSync(join(projDir, 'CLAUDE.md'), `# ${meta.title || projName} — Project CLAUDE.md
> MCKAY OS Project | Owner: Mehti Kaymaz | Created: ${now}

---

## 1. Project Overview

**Product:** ${meta.title || projName}
**Type:** TBD
**Status:** Phase 0 — Planning

---

## 2. Description

${ideaContent.split('## Description')[1]?.split('##')[0]?.trim() || meta.title || ''}

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TailwindCSS |
| Database | Supabase |
| Hosting | Vercel |

---

*Generated from idea "${id}" on ${now}*
`, 'utf-8')

          for (const file of ['CONTEXT.md', 'DECISIONS.md', 'TODOS.md', 'IDEAS.md', 'SESSIONS.md']) {
            writeFileSync(join(projDir, file), `---\ntype: project-${file.replace('.md', '').toLowerCase()}\nproject: "${projName}"\nupdated: "${now}"\n---\n\n## ${file.replace('.md', '')}\n\n`, 'utf-8')
          }

          // Update idea status
          const updated = ideaContent.replace(/status: \w+/, 'status: promoted')
          writeFileSync(filePath, updated, 'utf-8')
          updateIdeaIndex()
          regenerate()

          console.log(`[mckay] Idea ${id} → project created at ${projDir}`)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, id, project: projName, path: projDir }))
          return
        }

        // POST /api/idea/:id/research — REAL Research via Claude API
        if (req.method === 'POST' && req.url?.match(/^\/api\/idea\/([^/]+)\/research$/)) {
          const id = req.url.match(/^\/api\/idea\/([^/]+)\/research$/)[1]
          const filePath = join(MCKAY, 'ideas', `${id}.md`)
          if (!existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Idea not found' }))
            return
          }
          // Set status to researching immediately
          const content = readFileSync(filePath, 'utf-8')
          const updated = content.replace(/status: \w+/, 'status: researching')
          writeFileSync(filePath, updated, 'utf-8')
          updateIdeaIndex()
          regenerate()

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, id, status: 'researching' }))

          // Run research async
          const meta = parseFM(content)
          const bodyMatch = content.match(/## (?:Original|Description)\n\n([\s\S]*?)(?=\n## |$)/)
          const desc = bodyMatch ? bodyMatch[1].trim() : meta.title || id

          researchIdea(meta.title || id, desc).then(result => {
            const current = readFileSync(filePath, 'utf-8')
            const now = new Date().toISOString().slice(0, 10)
            let enriched = current.replace(/status: \w+/, 'status: new')
            // Append research results
            if (!enriched.includes('## Research')) {
              enriched += `\n## Research\n\n${result.result}\n\n*Analysiert am ${now} — Kosten: $${result.cost.toFixed(4)}*\n`
            }
            enriched = enriched.replace(/updated: .+/, `updated: "${now}"`)
            writeFileSync(filePath, enriched, 'utf-8')
            updateIdeaIndex()
            regenerate()
            console.log(`[mckay] Research done for "${meta.title}" — $${result.cost.toFixed(4)}`)
          }).catch(err => {
            console.error(`[mckay] Research failed:`, err.message)
          })
          return
        }

        // POST /api/chat — KANI Chat
        if (req.method === 'POST' && req.url === '/api/chat') {
          parseBody(req).then(async (data) => {
            const { message, context = 'cockpit', history = [] } = data
            if (!message) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'message required' }))
              return
            }
            console.log(`[mckay] KANI Chat: "${message.slice(0, 50)}..." (${context})`)
            const result = await chatWithKani(message, context, history)
            console.log(`[mckay] KANI → ${result.model} — $${result.cost.toFixed(4)}`)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(result))
          }).catch(err => {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })
          return
        }

        // POST /api/todo/:id/done — Toggle todo status
        if (req.method === 'POST' && req.url?.match(/^\/api\/todo\/([^/]+)\/done$/)) {
          const id = req.url.match(/^\/api\/todo\/([^/]+)\/done$/)[1]
          const filePath = join(MCKAY, 'todos', `${id}.md`)
          if (existsSync(filePath)) {
            const content = readFileSync(filePath, 'utf-8')
            const isDone = content.includes('status: done')
            const updated = isDone
              ? content.replace(/status: done/, 'status: open')
              : content.replace(/status: \w+/, 'status: done')
            writeFileSync(filePath, updated, 'utf-8')
            updateTodoIndex()
            regenerate()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, id, done: !isDone }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Todo not found' }))
          }
          return
        }

        // POST /api/project — Create new project
        if (req.method === 'POST' && req.url === '/api/project') {
          parseBody(req).then(data => {
            const { name, description = '' } = data
            if (!name) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'name required' }))
              return
            }
            const id = slugify(name)
            const projDir = join(MCKAY, 'projects', id)
            const now = new Date().toISOString().slice(0, 10)

            if (!existsSync(projDir)) mkdirSync(projDir, { recursive: true })

            // Create CLAUDE.md
            writeFileSync(join(projDir, 'CLAUDE.md'), `# ${name} — Project CLAUDE.md\n> MCKAY OS Project | Owner: Mehti Kaymaz | Created: ${now}\n\n## Overview\n\n${description || name}\n\n## Tech Stack\n\n| Layer | Technology |\n|---|---|\n| Frontend | React + Vite + TailwindCSS |\n| Database | Supabase |\n| Hosting | Vercel |\n\n## Status\n\nPhase 0 — Setup\n`, 'utf-8')

            // Create standard project files
            for (const file of ['CONTEXT.md', 'DECISIONS.md', 'TODOS.md', 'IDEAS.md', 'SESSIONS.md', 'MEMORY.md']) {
              const type = file.replace('.md', '').toLowerCase()
              writeFileSync(join(projDir, file), `---\ntype: project-${type}\nproject: "${id}"\nupdated: "${now}"\n---\n\n## ${file.replace('.md', '')}\n\n`, 'utf-8')
            }

            // Add to REGISTRY.md
            const regPath = join(MCKAY, 'REGISTRY.md')
            const reg = readFileSync(regPath, 'utf-8')
            const newRow = `| ${id} | \`projects/${id}\` | Phase 0 (new) | TBD | React+Vite, Supabase, Vercel |`
            const updatedReg = reg.replace(
              /(## PROJECTS\n\n\|.*\n\|.*\n)([\s\S]*?)(\n---)/,
              `$1$2${newRow}\n$3`
            )
            writeFileSync(regPath, updatedReg, 'utf-8')

            regenerate()
            console.log(`[mckay] New project created: ${id}`)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, id, path: projDir }))
          }).catch(err => {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })
          return
        }

        // POST /api/termin — Create new appointment
        if (req.method === 'POST' && req.url === '/api/termin') {
          parseBody(req).then(data => {
            const { title, date, time, duration, type = 'business' } = data
            if (!title || !date || !time) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'title, date, time required' }))
              return
            }
            const calPath = join(MCKAY, 'office', 'CALENDAR_CACHE.md')
            const cal = readFileSync(calPath, 'utf-8')
            const newRow = `| ${date} | ${time} | ${title} | ${type} | ${duration || ''} |`
            const updated = cal.replace(/(.*\|.*\|.*\|.*\|.*\|)\n/, `$1\n${newRow}\n`)
            writeFileSync(calPath, updated, 'utf-8')
            regenerate()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, title }))
          }).catch(err => {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })
          return
        }

        // GET /api/spending — Get current month spending
        if (req.method === 'GET' && req.url === '/api/spending') {
          const spendFile = join(MCKAY, 'finance', 'TOKEN_USAGE.md')
          let spent = 0
          try {
            const content = readFileSync(spendFile, 'utf-8')
            const match = content.match(/Cost: \$(\d+\.?\d*)/)
            if (match) spent = parseFloat(match[1])
          } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ spent, limit: 22, remaining: Math.max(0, 22 - spent), currency: 'USD' }))
          return
        }

        next()
      })
    },
  }
}

function updateTodoIndex() {
  const dir = join(MCKAY, 'todos')
  const files = readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
  const entries = []
  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf-8')
    const meta = parseFM(content)
    if (meta.title) {
      entries.push(`| ${meta.id || file.replace('.md', '')} | ${meta.title} | ${meta.priority || 'medium'} | ${meta.project || ''} | ${meta.due || ''} |`)
    }
  }
  const now = new Date().toISOString().slice(0, 16)
  const index = `---
type: index
generated: ${now}
count: ${entries.length}
---

## Todos

### Open

| ID | Title | Priority | Project | Due |
|---|---|---|---|---|
${entries.join('\n')}
`
  writeFileSync(join(dir, '_INDEX.md'), index, 'utf-8')
}

function updateIdeaIndex() {
  const dir = join(MCKAY, 'ideas')
  const files = readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
  const entries = []
  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf-8')
    const meta = parseFM(content)
    if (meta.title) {
      entries.push(`| ${meta.id || file.replace('.md', '')} | ${meta.title} | ${meta.status || 'new'} | ${meta.category || ''} | ${meta.priority || 'medium'} | ${meta.created || ''} |`)
    }
  }
  const now = new Date().toISOString().slice(0, 16)
  const index = `---
type: index
generated: ${now}
count: ${entries.length}
---

## Ideas

| ID | Title | Status | Category | Priority | Created |
|---|---|---|---|---|---|
${entries.join('\n')}
`
  writeFileSync(join(dir, '_INDEX.md'), index, 'utf-8')
}

function parseFM(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const meta = {}
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    meta[key] = val
  }
  return meta
}

function buildIdeaFile({ id, title, category, priority, now, rawText, status, structured, feedback, recommendation }) {
  let body = `## Original

${rawText}
`

  if (structured) {
    body += `
## Strukturiert

${structured}
`
  }

  if (feedback) {
    body += `
## Feedback

- **Branche:** ${feedback.branche}
- **Markt:** ${feedback.markt}
- **Innovation:** ${feedback.innovation}/5
- **Highlights:** ${feedback.highlights}
- **Hauptproblem:** ${feedback.problem}
- **Hauptnutzen:** ${feedback.nutzen}
`
  }

  if (recommendation) {
    body += `
## Empfehlung

${recommendation}
`
  }

  if (!structured && !feedback) {
    body += `
## Next Steps

- [ ] KANI Analyse ausstehend
`
  }

  return `---
id: "${id}"
title: "${title.replace(/"/g, '\\"')}"
type: idea
status: ${status}
category: "${category}"
priority: ${priority}
source: "dashboard"
created: "${now}"
updated: "${now}"
tags: []
project: ""
---

${body}`
}

