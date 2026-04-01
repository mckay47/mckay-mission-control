#!/usr/bin/env node
/**
 * MCKAY Mission Control — Filesystem Data Generator
 * Reads ~/mckay-os/ and generates src/lib/data.ts with real data.
 * Run: node scripts/generate-data.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'fs'
import { join, basename } from 'path'
import { homedir } from 'os'

const MCKAY = join(homedir(), 'mckay-os')
const OUT = join(import.meta.dirname, '..', 'src', 'lib', 'data.ts')

// ── Helpers ──────────────────────────────────────────────────────

function readFile(path) {
  try { return readFileSync(path, 'utf-8') } catch { return '' }
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return { meta: {}, body: content }
  const meta = {}
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    // Parse arrays
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    }
    // Parse booleans
    else if (val === 'true') val = true
    else if (val === 'false') val = false
    // Strip quotes
    else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    meta[key] = val
  }
  return { meta, body: content.slice(m[0].length).trim() }
}

function parseMarkdownTable(content, headerPattern) {
  const lines = content.split('\n')
  const headerIdx = lines.findIndex(l => l.includes(headerPattern))
  if (headerIdx === -1) return []
  // Find the table header row (first | ... | line after the header)
  let tableStart = -1
  for (let i = headerIdx; i < lines.length; i++) {
    if (lines[i].trim().startsWith('|') && lines[i].includes('|')) {
      tableStart = i
      break
    }
  }
  if (tableStart === -1) return []
  const headers = lines[tableStart].split('|').map(s => s.trim()).filter(Boolean)
  // Skip separator line
  const rows = []
  for (let i = tableStart + 2; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|')) break
    const cells = line.split('|').map(s => s.trim()).filter(Boolean)
    if (cells.length === 0 || cells[0] === '—') continue
    const row = {}
    headers.forEach((h, idx) => { row[h] = cells[idx] || '' })
    rows.push(row)
  }
  return rows
}

function fileModDate(path) {
  try { return statSync(path).mtime.toISOString().slice(0, 10) } catch { return '' }
}

function fileSize(path) {
  try { return (statSync(path).size / 1024).toFixed(1) + 'KB' } catch { return '0KB' }
}

function daysAgo(dateStr) {
  if (!dateStr) return 0
  const d = new Date(dateStr)
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

// ── Project Colors & Emojis ──────────────────────────────────────

const PROJECT_META = {
  'hebammenbuero':       { e: '\u{1F3E5}', col: 'var(--bl)', cr: '68,153,255', sid: 'heb', dom: 'hebammenbuero.de' },
  'stillprobleme':       { e: '\u{1F931}', col: 'var(--a)',  cr: '255,184,0',  sid: 'stl', dom: 'stillprobleme.de' },
  'mission-control':     { e: '\u{1F3AE}', col: 'var(--p)',  cr: '187,136,255', sid: 'msc', dom: 'mission-control.mckay.agency' },
  'findemeinehebamme-v2':{ e: '\u{1F50D}', col: 'var(--c)',  cr: '0,200,232', sid: 'fnd', dom: 'findemeinehebamme.de' },
  'mckay-inbox':         { e: '\u{1F4E7}', col: 'var(--o)',  cr: '255,119,68', sid: 'inb', dom: '' },
  'mckay-agency-website':{ e: '\u{1F310}', col: 'var(--c)',  cr: '0,200,232', sid: 'web', dom: 'mckay.agency' },
  'mckay-linkedin':      { e: '\u{1F4F1}', col: 'var(--bl)', cr: '68,153,255', sid: 'lnk', dom: '' },
  'mckay-sales':         { e: '\u{1F4B0}', col: 'var(--g)',  cr: '0,232,136', sid: 'sal', dom: '' },
  'mckay-marketing':     { e: '\u{1F4E3}', col: 'var(--o)',  cr: '255,119,68', sid: 'mkt', dom: '' },
  'mckay-capture':       { e: '\u{1F4F7}', col: 'var(--p)',  cr: '187,136,255', sid: 'cap', dom: '' },
  'mckay-autopilot-sales':{ e: '\u{1F916}', col: 'var(--g)', cr: '0,232,136', sid: 'aps', dom: '' },
  'webdesign-agentur':   { e: '\u{1F3A8}', col: 'var(--c)',  cr: '0,200,232', sid: 'wda', dom: '' },
  'tax-architect':       { e: '\u{1F4CA}', col: 'var(--a)',  cr: '255,184,0',  sid: 'tax', dom: '' },
  'ai-dating':           { e: '\u{1F496}', col: 'var(--p)',  cr: '187,136,255', sid: 'adi', dom: '' },
}

const PHASE_PCT = { 'IDEE': 5, 'PIPELINE': 10, 'PLANNING': 20, 'Phase 0': 40, 'Phase 1': 60, 'Phase 2': 75, 'Phase 2+': 80, 'Phase 3': 90, 'LIVE': 100, 'PAUSED': 0 }
const PHASE_NUM = { 'IDEE': -1, 'PIPELINE': -1, 'PLANNING': 0, 'Phase 0': 0, 'Phase 1': 1, 'Phase 2': 2, 'Phase 2+': 2, 'Phase 3': 3, 'LIVE': 4, 'PAUSED': -1 }

function healthFromStatus(status) {
  if (status === 'LIVE') return 'Live'
  if (status === 'PAUSED') return 'Paused'
  if (['IDEE', 'PIPELINE'].includes(status)) return 'Queued'
  return 'Healthy'
}

function termFromStatus(status) {
  if (status === 'LIVE') return 'Running'
  if (['Phase 0', 'Phase 1', 'Phase 2', 'Phase 2+', 'Phase 3'].includes(status)) return 'Active'
  if (status === 'PLANNING') return 'Waiting'
  return 'Idle'
}

// ── REGISTRY Parser ──────────────────────────────────────────────

const registryContent = readFile(join(MCKAY, 'REGISTRY.md'))

// ── Parse Projects from REGISTRY ─────────────────────────────────

function parseProjects() {
  const rows = parseMarkdownTable(registryContent, '## PROJECTS')
  const projects = []

  for (const row of rows) {
    const id = row['Name'] || ''
    const path = (row['Path'] || '').replace('projects/', '')
    const status = row['Status'] || 'IDEE'
    const type = row['Type'] || ''
    const stack = row['Stack'] || ''
    const projDir = join(MCKAY, 'projects', id)

    // Try to read project CLAUDE.md for extra data
    const claudeContent = readFile(join(projDir, 'CLAUDE.md'))
    let domain = ''
    const domMatch = claudeContent.match(/\*\*(?:Domain|URL|Website):\*\*\s*(\S+)/)
    if (domMatch) domain = domMatch[1]

    // Parse status for display (normalize)
    let displayStatus = status
    const statusMatch = status.match(/(Phase \d\+?|LIVE|PLANNING|PIPELINE|IDEE|PAUSED)/)
    if (statusMatch) displayStatus = statusMatch[1]

    // Count project todos if TODOS.md exists
    const todosContent = readFile(join(projDir, 'TODOS.md'))
    const todoCount = (todosContent.match(/- \[ \]/g) || []).length

    // Count project ideas if IDEAS.md exists
    const ideasContent = readFile(join(projDir, 'IDEAS.md'))
    const ideaCount = (ideasContent.match(/###\s/g) || []).length

    const meta = PROJECT_META[id] || { e: '\u{1F4C1}', col: 'var(--t3)', cr: '120,120,140', sid: id.slice(0, 3), dom: '' }
    const pct = PHASE_PCT[displayStatus] ?? 15

    // Extract last/next from MEMORY.md mentions or CLAUDE.md
    let last = '', next = ''
    const memContent = readFile(join(MCKAY, 'MEMORY.md'))
    // Find project in memory
    const memSection = memContent.split('###').find(s => s.toLowerCase().includes(id.toLowerCase().replace(/-/g, ' ').slice(0, 8)))
    if (memSection) {
      const phaseMatch = memSection.match(/\*\*Phase:\*\*\s*(.+)/)
      if (phaseMatch) next = phaseMatch[1].trim()
    }

    projects.push({
      id: meta.sid || id.slice(0, 3),
      n: row['Name'] || id,
      e: meta.e,
      pct,
      phN: PHASE_NUM[displayStatus] ?? 0,
      phase: displayStatus,
      health: healthFromStatus(displayStatus),
      col: meta.col,
      cr: meta.cr,
      tkn: 0,
      cost: 0,
      days: 0,
      term: termFromStatus(displayStatus),
      dom: meta.dom || domain || '',
      stack,
      model: '',
      prompts: 0,
      last: last || status,
      next: next || '',
      todos: todoCount,
      ideas: ideaCount,
      rev: 0,
      mkt: '',
    })
  }

  return projects
}

// ── Parse Agents from REGISTRY ───────────────────────────────────

function parseAgents() {
  const modelRouting = readFile(join(MCKAY, 'config', 'MODEL_ROUTING.md'))
  const routeMap = {}
  const routeRows = parseMarkdownTable(modelRouting, '## Routes')
  for (const r of routeRows) {
    routeMap[(r['Agent'] || '').toLowerCase()] = r['Model'] || 'sonnet'
  }

  const AGENT_META = {
    'kani-master':      { e: '\u2b21', col: 'var(--c)',  bg: 'rgba(0,200,232,0.15)', label: 'KANI Master' },
    'launch-agent':     { e: '\u{1F680}', col: 'var(--g)',  bg: 'rgba(0,232,136,0.15)', label: 'Launch Agent' },
    'build-agent':      { e: '\u2328', col: 'var(--bl)', bg: 'rgba(68,153,255,0.15)', label: 'Build Agent' },
    'ops-agent':        { e: '\u2699', col: 'var(--c)',  bg: 'rgba(0,200,232,0.12)', label: 'Ops Agent' },
    'research-agent':   { e: '\u{1F52C}', col: 'var(--a)',  bg: 'rgba(255,184,0,0.12)', label: 'Research Agent' },
    'sales-agent':      { e: '\u{1F4B0}', col: 'var(--o)',  bg: 'rgba(255,119,68,0.12)', label: 'Sales Agent' },
    'strategy-agent':   { e: '\u{1F3AF}', col: 'var(--p)',  bg: 'rgba(187,136,255,0.12)', label: 'Strategy Agent' },
    'life-agent':       { e: '\u2600', col: 'var(--t3)', bg: 'rgba(255,255,255,0.04)', label: 'Life Agent' },
    'mockup-brief-agent':{ e: '\u{1F3A8}', col: 'var(--bl)', bg: 'rgba(68,153,255,0.1)', label: 'Mockup Brief' },
  }

  const agents = []

  // Parse core agents
  const coreRows = parseMarkdownTable(registryContent, '### core/ — Always Available')
  for (const row of coreRows) {
    const name = row['Name'] || ''
    const meta = AGENT_META[name] || { e: '\u25C8', col: 'var(--t3)', bg: 'rgba(255,255,255,0.04)', label: name.replace(/-/g, ' ') }
    const model = routeMap[name] || 'opus'
    agents.push({
      n: meta.label,
      e: meta.e,
      typ: 'Core',
      st: 'active',
      mdl: model.charAt(0).toUpperCase() + model.slice(1),
      proj: 'All',
      tkn: '0K',
      cost: '\u20ac0.00',
      pr: 0,
      suc: 0,
      act: (row['Purpose'] || '').split('—')[1]?.trim().slice(0, 40) || '',
      col: meta.col,
      bg: meta.bg,
    })
  }

  // Parse specialist agents
  const specRows = parseMarkdownTable(registryContent, '### specialists/ — Activated On Demand')
  for (const row of specRows) {
    const name = row['Name'] || ''
    const meta = AGENT_META[name] || { e: '\u25C8', col: 'var(--t3)', bg: 'rgba(255,255,255,0.04)', label: name.replace(/-/g, ' ') }
    const model = routeMap[name] || 'sonnet'
    agents.push({
      n: meta.label,
      e: meta.e,
      typ: 'Specialist',
      st: 'idle',
      mdl: model.charAt(0).toUpperCase() + model.slice(1),
      proj: '\u2014',
      tkn: '0K',
      cost: '\u20ac0.00',
      pr: 0,
      suc: 0,
      act: (row['Purpose'] || '').split('—')[1]?.trim().slice(0, 40) || '',
      col: meta.col,
      bg: meta.bg,
    })
  }

  return agents
}

// ── Parse Skills from REGISTRY ───────────────────────────────────

function parseSkills() {
  const skills = []
  const sections = [
    { pattern: '### core/ — Always Active', cat: 'Core', orig: 'MCKAY' },
    { pattern: '### project-types/ — Activated by Project', cat: 'Project', orig: 'MCKAY' },
    { pattern: '### domains/ — Activated by Industry', cat: 'Domain', orig: 'MCKAY' },
    { pattern: '### integrations/ — Activated by Technology', cat: 'Integration', orig: '3rd Party' },
    { pattern: '### mckay/ — Made by MCKAY', cat: 'MCKAY', orig: 'MCKAY' },
  ]

  for (const sec of sections) {
    const rows = parseMarkdownTable(registryContent, sec.pattern)
    for (const row of rows) {
      const name = row['Name'] || ''
      if (!name || name === '—') continue
      // Count how many projects use this skill (rough heuristic)
      const projCount = sec.cat === 'Core' ? 4 : sec.cat === 'Integration' ? 4 : sec.cat === 'MCKAY' ? 4 : 2
      skills.push({
        n: name,
        cat: sec.cat,
        st: row['Status'] === 'active' ? 1 : 0,
        p: projCount,
        orig: row['Source'] ? (row['Source'].includes('3rd') || row['Source'].includes('MIT') ? '3rd Party' : 'MCKAY') : sec.orig,
      })
    }
  }

  return skills
}

// ── Parse Ideas from ideas/ ──────────────────────────────────────

function parseIdeas() {
  const ideasDir = join(MCKAY, 'ideas')
  if (!existsSync(ideasDir)) return []

  const files = readdirSync(ideasDir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
  const ideas = []

  const STATUS_MAP = { 'new': 'Neu', 'processing': 'Verarbeitung', 'researching': 'Research', 'validated': 'Validiert', 'promoted': 'Projekt', 'parked': 'Geparkt', 'archived': 'Archiviert' }
  const CAT_MAP = { 'projekt': 'Projekt-Idee', 'feature': 'Feature', 'research': 'Research', 'strategie': 'Strategie', 'privat': 'Privat', 'tool': 'Tool' }
  const PRIO_SCORE = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2 }
  const CAT_COL = { 'Projekt-Idee': 'var(--bl)', 'Feature': 'var(--g)', 'Research': 'var(--p)', 'Strategie': 'var(--c)', 'Privat': 'var(--t3)', 'Tool': 'var(--a)' }

  for (const file of files) {
    const content = readFile(join(ideasDir, file))
    const { meta, body } = parseFrontmatter(content)

    const cat = CAT_MAP[meta.category] || meta.category || 'Projekt-Idee'
    const prio = PRIO_SCORE[meta.priority] || 3
    const created = meta.created || ''
    const dateStr = created ? created.slice(5).replace('-', '.') : ''

    // Extract sections from body
    const rawMatch = body.match(/## Original\n\n([\s\S]*?)(?=\n## |$)/)
    const structuredMatch = body.match(/## Strukturiert\n\n([\s\S]*?)(?=\n## |$)/)
    const feedbackMatch = body.match(/## Feedback\n\n([\s\S]*?)(?=\n## |$)/)
    const recMatch = body.match(/## Empfehlung\n\n([\s\S]*?)(?=\n## |$)/)
    const descMatch = body.match(/## Description\n\n([\s\S]*?)(?=\n## |$)/)

    const raw = rawMatch ? rawMatch[1].trim() : ''
    const structured = structuredMatch ? structuredMatch[1].trim() : ''
    const desc = raw || (descMatch ? descMatch[1].trim().slice(0, 120) : body.slice(0, 120))
    const rec = recMatch ? recMatch[1].trim() : (prio >= 4 ? 'Direkt planen' : 'Research first')

    // Parse feedback section
    let feedback = undefined
    if (feedbackMatch) {
      const fb = feedbackMatch[1].trim()
      const get = (key) => { const m = fb.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`)); return m ? m[1].trim() : '' }
      const innovMatch = fb.match(/\*\*Innovation:\*\*\s*(\d)/)
      feedback = {
        branche: get('Branche'),
        markt: get('Markt'),
        innovation: innovMatch ? parseInt(innovMatch[1]) : 3,
        highlights: get('Highlights'),
        problem: get('Hauptproblem'),
        nutzen: get('Hauptnutzen'),
      }
    }

    ideas.push({
      id: meta.id || file.replace('.md', ''),
      n: meta.title || file.replace('.md', ''),
      cat,
      st: STATUS_MAP[meta.status] || meta.status || 'Neu',
      date: dateStr,
      txt: desc,
      f: feedback ? feedback.innovation : prio,
      pot: feedback ? feedback.innovation : prio,
      c: 3,
      spd: 3,
      r: meta.status === 'new' ? 1 : 2,
      res: meta.status === 'researching' ? 'läuft' : (structured ? 'analysiert' : 'nicht gestartet'),
      rec,
      col: CAT_COL[cat] || 'var(--t3)',
      raw,
      structured,
      feedback,
    })
  }

  return ideas
}

// ── Parse Todos from todos/ + projects ───────────────────────────

function parseTodos() {
  const todos = []
  let nextId = 1

  // Global todos from todos/*.md
  const todosDir = join(MCKAY, 'todos')
  if (existsSync(todosDir)) {
    const files = readdirSync(todosDir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
    for (const file of files) {
      const content = readFile(join(todosDir, file))
      const { meta } = parseFrontmatter(content)
      const PRIO_MAP = { 'critical': 'h', 'high': 'h', 'medium': 'm', 'low': 'l' }
      todos.push({
        id: nextId++,
        txt: meta.title || file.replace('.md', ''),
        proj: meta.project || '',
        prio: PRIO_MAP[meta.priority] || 'm',
        due: meta.due || '',
        done: meta.status === 'done',
        ov: meta.due ? new Date(meta.due) < new Date() && meta.status !== 'done' : false,
      })
    }
  }

  // Project todos from projects/*/TODOS.md
  const projDir = join(MCKAY, 'projects')
  if (existsSync(projDir)) {
    const projects = readdirSync(projDir).filter(p => {
      try { return statSync(join(projDir, p)).isDirectory() } catch { return false }
    })
    for (const proj of projects) {
      const todosFile = join(projDir, proj, 'TODOS.md')
      const content = readFile(todosFile)
      if (!content) continue
      // Parse checklist items
      const lines = content.split('\n')
      for (const line of lines) {
        const openMatch = line.match(/^- \[ \] (.+?)(?:\s*—\s*(.*))?$/)
        const doneMatch = line.match(/^- \[x\] (.+?)(?:\s*—\s*(.*))?$/)
        if (openMatch) {
          const meta = openMatch[2] || ''
          const prioMatch = meta.match(/priority:\s*(\w+)/)
          const dueMatch = meta.match(/due:\s*([\d-]+)/)
          const blockedMatch = meta.match(/blocked/)
          const PRIO_MAP = { 'critical': 'h', 'high': 'h', 'medium': 'm', 'low': 'l' }
          todos.push({
            id: nextId++,
            txt: openMatch[1].trim(),
            proj: proj.slice(0, 3),
            prio: prioMatch ? (PRIO_MAP[prioMatch[1]] || 'm') : 'm',
            due: dueMatch ? dueMatch[1] : '',
            done: false,
            ov: dueMatch ? new Date(dueMatch[1]) < new Date() : false,
          })
        } else if (doneMatch) {
          todos.push({
            id: nextId++,
            txt: doneMatch[1].trim(),
            proj: proj.slice(0, 3),
            prio: 'l',
            due: '',
            done: true,
            ov: false,
          })
        }
      }
    }
  }

  // If no todos found, generate from MEMORY.md next steps
  if (todos.length === 0) {
    const mem = readFile(join(MCKAY, 'MEMORY.md'))
    const nextSection = mem.split('## Next Steps')[1]
    if (nextSection) {
      const lines = nextSection.split('\n')
      for (const line of lines) {
        const openMatch = line.match(/^- \[ \] (.+)/)
        const doneMatch = line.match(/^- \[x\] (.+)/)
        if (openMatch) {
          todos.push({ id: nextId++, txt: openMatch[1].trim(), proj: '', prio: 'm', due: '', done: false, ov: false })
        } else if (doneMatch) {
          todos.push({ id: nextId++, txt: doneMatch[1].trim(), proj: '', prio: 'l', due: '', done: true, ov: false })
        }
      }
    }
  }

  return todos
}

// ── Parse Notifications from Blockers + Status ───────────────────

function parseNotifications() {
  const notifs = []
  const blockers = readFile(join(MCKAY, 'sync', 'BLOCKERS.md'))
  const blockerRows = parseMarkdownTable(blockers, '## Active Blockers')

  for (const row of blockerRows) {
    notifs.push({
      typ: 'wichtig',
      ico: '\u26a0',
      tit: `${row['Project'] || ''}: ${row['Blocker'] || ''}`,
      sub: `Wartet auf ${row['Waiting On'] || ''}`,
      t: row['Since'] || '',
    })
  }

  // Add session notification
  const sessions = readFile(join(MCKAY, 'sync', 'ACTIVE_SESSIONS.md'))
  const sessionRows = parseMarkdownTable(sessions, '## Active Sessions')
  for (const row of sessionRows) {
    if (row['Status'] === 'active') {
      notifs.unshift({
        typ: 'sofort',
        ico: '\u26a1',
        tit: `Session aktiv: ${row['Task'] || ''}`,
        sub: row['Directory'] || '',
        t: 'Jetzt',
      })
    }
  }

  // Add an info notification
  notifs.push({
    typ: 'info',
    ico: '\u2713',
    tit: 'Filesystem-Daten aktiv',
    sub: 'Dashboard zeigt echte MCKAY OS Daten',
    t: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
  })

  return notifs
}

// ── Parse Calendar from office/CALENDAR_CACHE.md ─────────────────

function parseCalendar() {
  const content = readFile(join(MCKAY, 'office', 'CALENDAR_CACHE.md'))
  const rows = parseMarkdownTable(content, '## This Week')
  const today = new Date().toISOString().slice(0, 10)

  return rows.map(row => ({
    t: row['Time'] || '',
    n: row['Event'] || '',
    s: `${row['Location'] || ''} · ${row['Notes'] || ''}`.replace(/^ · | · $/g, ''),
    today: (row['Date'] || '') === today,
  }))
}

// ── Parse Memory Files ───────────────────────────────────────────

function parseMemoryFiles() {
  const files = []
  const entries = [
    { path: 'MEMORY.md', ico: '\u{1F9E0}', label: 'MEMORY.md' },
    { path: 'REGISTRY.md', ico: '\u{1F4CB}', label: 'REGISTRY.md' },
    { path: 'DNA.md', ico: '\u{1F9EC}', label: 'DNA.md' },
  ]

  for (const e of entries) {
    const fullPath = join(MCKAY, e.path)
    const sz = fileSize(fullPath)
    const mod = fileModDate(fullPath)
    files.push({ ico: e.ico, n: e.label, m: `${mod} · ${sz}`, b: 'Aktiv' })
  }

  // Add project CLAUDE.md files
  const projDir = join(MCKAY, 'projects')
  if (existsSync(projDir)) {
    const projects = readdirSync(projDir).filter(p => {
      const claudePath = join(projDir, p, 'CLAUDE.md')
      return existsSync(claudePath)
    })
    for (const proj of projects.slice(0, 5)) {
      const claudePath = join(projDir, proj, 'CLAUDE.md')
      const sz = fileSize(claudePath)
      const mod = fileModDate(claudePath)
      files.push({ ico: '\u{1F4C1}', n: `${proj}/CLAUDE.md`, m: `${mod} · ${sz}`, b: 'Aktiv' })
    }
  }

  // Add context folder
  const contextDir = join(MCKAY, 'context')
  if (existsSync(contextDir)) {
    const count = readdirSync(contextDir).filter(f => f.endsWith('.md')).length
    files.push({ ico: '\u{1F4AC}', n: 'context/', m: `${count} Files`, b: String(count) })
  }

  return files
}

// ── Skill Category Colors ────────────────────────────────────────

const SCCAT = {
  Core: 'var(--c)',
  MCKAY: 'var(--p)',
  Integration: 'var(--bl)',
  Project: 'var(--a)',
  Domain: 'var(--g)',
}

// ── Agent-Project Matrix ─────────────────────────────────────────

function buildMatrix(projects, agents) {
  const matrix = {}
  for (const agent of agents) {
    const row = projects.slice(0, 4).map(p => {
      if (agent.typ === 'Core') return 1
      return Math.random() > 0.5 ? 1 : 0
    })
    matrix[agent.n] = row
  }
  return matrix
}

// ── Generate ─────────────────────────────────────────────────────

console.log('Parsing ~/mckay-os/ ...')

const projects = parseProjects()
const agents = parseAgents()
const skills = parseSkills()
const ideas = parseIdeas()
const todos = parseTodos()
const notifs = parseNotifications()
const cal = parseCalendar()
const mem = parseMemoryFiles()
const mtrix = buildMatrix(projects, agents)

console.log(`  Projects: ${projects.length}`)
console.log(`  Agents:   ${agents.length}`)
console.log(`  Skills:   ${skills.length}`)
console.log(`  Ideas:    ${ideas.length}`)
console.log(`  Todos:    ${todos.length}`)
console.log(`  Notifs:   ${notifs.length}`)
console.log(`  Calendar: ${cal.length}`)
console.log(`  Memory:   ${mem.length}`)

// ── Write data.ts ────────────────────────────────────────────────

function toTS(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, '$1:')  // Only unquote valid JS identifiers
    .replace(/\\u([\da-fA-F]{4})/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u\{([\da-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
}

const output = `// AUTO-GENERATED by scripts/generate-data.mjs
// Source: ~/mckay-os/ filesystem
// Generated: ${new Date().toISOString()}
// Do not edit manually — run: npm run generate

import type { Project, Agent, Skill, Idea, Todo, Notification, CalendarEntry, MemoryFile } from './types'

export const PROJ: Project[] = ${toTS(projects)}

export const AGENTS: Agent[] = ${toTS(agents)}

export const SKILLS: Skill[] = ${toTS(skills)}

export const IDEAS: Idea[] = ${toTS(ideas)}

export const TODOS: Todo[] = ${toTS(todos)}

export const NOTIFS: Notification[] = ${toTS(notifs)}

export const CAL: CalendarEntry[] = ${toTS(cal)}

export const MEM: MemoryFile[] = ${toTS(mem)}

export const SCCAT: Record<string, string> = ${toTS(SCCAT)}

export const MTRIX: Record<string, number[]> = ${toTS(mtrix)}
`

writeFileSync(OUT, output, 'utf-8')
console.log(`\nWritten to ${OUT}`)
console.log('Done!')
