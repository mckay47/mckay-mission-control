#!/usr/bin/env node
/**
 * MCKAY Mission Control — Project CLAUDE.md Generator
 * Creates or updates CLAUDE.md for each project in ~/mckay-os/projects/
 *
 * Safe rules:
 *  - NEVER deletes existing CLAUDE.md content
 *  - Only creates or updates the <!-- AUTO-CONTEXT --> section
 *  - Custom content outside that section is always preserved
 *
 * Run: node scripts/generate-project-claude-md.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const MCKAY       = join(homedir(), 'mckay-os')
const PROJECTS    = join(MCKAY, 'projects')
const REGISTRY    = join(MCKAY, 'REGISTRY.md')
const SYNC_DIR    = join(MCKAY, 'sync')

// ── Helpers ──────────────────────────────────────────────────────────────────

function read(path) {
  try { return readFileSync(path, 'utf-8') } catch { return '' }
}

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

/** Parse REGISTRY.md project table → Map<name, {status, stack, type}> */
function parseRegistry() {
  const content = read(REGISTRY)
  const map = {}

  // Find the ## PROJECTS section
  const projectSection = content.split(/^## /m).find(s => s.startsWith('PROJECTS'))
  if (!projectSection) return map

  const lines = projectSection.split('\n')
  let headers = []
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!inTable && trimmed.startsWith('|') && trimmed.includes('Name')) {
      headers = trimmed.split('|').map(s => s.trim()).filter(Boolean)
      inTable = true
      continue
    }
    if (inTable && trimmed.startsWith('|---')) continue
    if (inTable && trimmed.startsWith('|')) {
      const cells = trimmed.split('|').map(s => s.trim()).filter(Boolean)
      if (cells.length === 0) continue
      const row = {}
      headers.forEach((h, i) => { row[h] = cells[i] || '' })
      const name = row['Name'] || ''
      if (name && name !== '—') {
        map[name] = {
          status: row['Status'] || '',
          stack:  row['Stack']  || '',
          type:   row['Type']   || '',
          path:   row['Path']   || '',
        }
      }
    } else if (inTable && trimmed && !trimmed.startsWith('|')) {
      break // end of table
    }
  }

  return map
}

/** Parse open todos from TODOS.md */
function parseTodos(projectDir) {
  const content = read(join(projectDir, 'TODOS.md'))
  const open = []
  for (const line of content.split('\n')) {
    const m = line.match(/^- \[ \] (.+?)(?:\s*—.*)?$/)
    if (m && open.length < 6) open.push(m[1].trim())
  }
  return open
}

/** Parse last session summary from SESSIONS.md */
function parseLastSession(projectDir) {
  const content = read(join(projectDir, 'SESSIONS.md'))
  const m = content.match(/### (\d{4}-\d{2}-\d{2})\s*\n([\s\S]*?)(?=\n### \d{4}|$)/)
  if (!m) return null
  const summary = m[2].trim().split('\n').find(l => l.trim().length > 10) || ''
  return { date: m[1], summary: summary.replace(/^[-*#]+\s*/, '').slice(0, 150) }
}

/** Extract repo path if already present in existing CLAUDE.md */
function extractRepoPatch(content) {
  const m = content.match(/\*\*Repo:\*\*\s*(\S+)/)
  return m ? m[1] : null
}

// ── Generate the auto-context block ──────────────────────────────────────────

const START_MARKER = '<!-- AUTO-CONTEXT:START -->'
const END_MARKER   = '<!-- AUTO-CONTEXT:END -->'

function buildAutoContext(name, registry, todos, lastSession, existingRepo) {
  const repoLine = existingRepo
    ? `**Repo:** ${existingRepo}`
    : `**Repo:** ~/path/to/code  ← Bitte einmalig ausfüllen`

  const lines = [
    START_MARKER,
    '## Auto-Generated Context',
    `> Updated: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
    '',
    `**Project:** ${name}`,
    `**Status:** ${registry?.status || '—'}`,
    `**Stack:** ${registry?.stack || '—'}`,
    repoLine,
    '',
  ]

  if (todos.length > 0) {
    lines.push('**Open Todos:**')
    todos.forEach(t => lines.push(`- [ ] ${t}`))
    lines.push('')
  }

  if (lastSession) {
    lines.push(`**Last Session:** ${lastSession.date}`)
    if (lastSession.summary) lines.push(`> ${lastSession.summary}`)
    lines.push('')
  }

  lines.push('**KANI Working Rules:**')
  lines.push('1. When editing code: use the **Repo** path above for all file operations')
  lines.push('2. End EVERY response with exactly one signal line:')
  lines.push(`   \`[SIGNAL] project:${name} — what you did (1 sentence)\``)
  lines.push('   This signal is automatically forwarded to KANI Cockpit.')
  lines.push('3. Write memories at session end if anything noteworthy was learned.')
  lines.push('')
  lines.push(END_MARKER)

  return lines.join('\n')
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(PROJECTS)) {
  console.log('  ~/mckay-os/projects/ not found — skipping CLAUDE.md generation')
  process.exit(0)
}

ensureDir(SYNC_DIR)

const registry = parseRegistry()
const dirs = readdirSync(PROJECTS).filter(d => {
  try { return statSync(join(PROJECTS, d)).isDirectory() } catch { return false }
})

let created = 0
let updated = 0

for (const name of dirs) {
  const projectDir = join(PROJECTS, name)
  const claudePath = join(projectDir, 'CLAUDE.md')

  const reg       = registry[name] || null
  const todos     = parseTodos(projectDir)
  const lastSess  = parseLastSession(projectDir)
  const existing  = read(claudePath)
  const repoHint  = extractRepoPatch(existing)
  const autoBlock = buildAutoContext(name, reg, todos, lastSess, repoHint)

  if (!existing) {
    // Fresh CLAUDE.md
    const content = [
      `# ${name}`,
      `> KANI Project Context`,
      '',
      autoBlock,
    ].join('\n')
    writeFileSync(claudePath, content, 'utf-8')
    created++
    console.log(`  Created: projects/${name}/CLAUDE.md`)
  } else {
    // Preserve existing content, just replace/append auto-context block
    const startIdx = existing.indexOf(START_MARKER)
    const endIdx   = existing.indexOf(END_MARKER)

    let updated_content
    if (startIdx !== -1 && endIdx !== -1) {
      updated_content = (
        existing.slice(0, startIdx).trimEnd() +
        '\n\n' + autoBlock + '\n' +
        existing.slice(endIdx + END_MARKER.length).trimStart()
      )
    } else {
      updated_content = existing.trimEnd() + '\n\n' + autoBlock + '\n'
    }

    writeFileSync(claudePath, updated_content, 'utf-8')
    updated++
    console.log(`  Updated: projects/${name}/CLAUDE.md`)
  }
}

console.log(`  Project CLAUDE.md files: ${created} created, ${updated} updated`)
