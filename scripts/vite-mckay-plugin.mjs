/**
 * Vite Plugin: MCKAY OS Filesystem Bridge
 * - POST /api/todo   → writes todo to ~/mckay-os/todos/
 * - POST /api/idea   → writes idea to ~/mckay-os/ideas/
 * - Watches ~/mckay-os/ for changes → re-generates data.ts → HMR auto-updates
 * - Registers/deregisters session in ACTIVE_SESSIONS.md
 */

import { writeFileSync, readFileSync, readdirSync, existsSync, watch } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { execSync } from 'child_process'

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

        // POST /api/idea
        if (req.method === 'POST' && req.url === '/api/idea') {
          parseBody(req).then(data => {
            const { title, description = '', category = 'projekt', priority = 'medium' } = data
            if (!title && !description) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'title or description required' }))
              return
            }
            const ideaTitle = title || description.slice(0, 60)
            const id = slugify(ideaTitle)
            const now = new Date().toISOString().slice(0, 10)
            const content = `---
id: "${id}"
title: "${ideaTitle.replace(/"/g, '\\"')}"
type: idea
status: new
category: "${category}"
priority: ${priority}
source: "dashboard"
created: "${now}"
updated: "${now}"
tags: []
project: ""
---

## Description

${description || ideaTitle}

## Why

[Noch nicht definiert]

## Next Steps

- [ ] Bewerten und kategorisieren
`
            const filePath = join(MCKAY, 'ideas', `${id}.md`)
            writeFileSync(filePath, content, 'utf-8')
            console.log(`[mckay] Idea written: ${filePath}`)

            // Update index
            updateIdeaIndex()

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

