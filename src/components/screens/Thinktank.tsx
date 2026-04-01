import { useState } from 'react'
import Card from '../ui/Card'
import { IDEAS } from '../../lib/data'
import { useToast } from '../Toast'
import type { Idea } from '../../lib/types'

export default function Thinktank() {
  const { toast } = useToast()
  const [thought, setThought] = useState('')
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState('Alle')

  const filtered = filter === 'Alle' ? IDEAS : IDEAS.filter(i => i.st === filter)
  const statusCounts = {
    total: IDEAS.length,
    neu: IDEAS.filter(i => i.st === 'Neu' || i.st === 'Verarbeitung').length,
    research: IDEAS.filter(i => i.st === 'Research').length,
    projekt: IDEAS.filter(i => i.st === 'Projekt').length,
    geparkt: IDEAS.filter(i => i.st === 'Geparkt').length,
  }

  async function handleSend() {
    if (!thought.trim()) { toast('Gedanken eingeben'); return }
    setSending(true)
    try {
      const res = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: thought.trim().split(/[.\n]/)[0].slice(0, 80),
          description: thought.trim(),
          category: 'projekt',
          priority: 'medium',
        }),
      })
      if (res.ok) {
        toast('\u2b21 Gedanke gespeichert — KANI analysiert...')
        setThought('')
      } else {
        toast('\u26a0 Fehler beim Speichern')
      }
    } catch {
      toast('\u26a0 API nicht erreichbar')
    } finally {
      setSending(false)
    }
  }

  async function handleAction(idea: Idea, action: 'research' | 'to-project' | 'park') {
    const labels = { research: 'Research gestartet', 'to-project': 'Projekt wird erstellt', park: 'Idee geparkt' }
    try {
      const res = await fetch(`/api/idea/${idea.id}/${action}`, { method: 'POST' })
      if (res.ok) {
        toast(`\u2713 ${labels[action]}: ${idea.n}`)
      } else {
        toast('\u26a0 Fehler')
      }
    } catch {
      toast('\u26a0 API nicht erreichbar')
    }
  }

  return (
    <>
      {/* Gedanke teilen — col 1/5, row 1/2 */}
      <Card title="Gedanke teilen" badge={sending ? 'KANI denkt...' : 'Eingabe'} badgeClass={sending ? 'bp' : 'bo'} style={{ gridColumn: '1/5', gridRow: '1/2' }}>
        <div className="lbl" style={{ marginBottom: 8, flexShrink: 0 }}>Workflow: Gedanke {'\u2192'} KANI {'\u2192'} Feedback {'\u2192'} Aktion</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexShrink: 0 }}>
          <div style={{ textAlign: 'center', flex: 1, padding: 8, background: 'rgba(0,200,232,0.08)', border: '1px solid rgba(0,200,232,0.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 16 }}>{'\u{1F4AC}'}</div>
            <div style={{ fontSize: 9, color: 'var(--c)', marginTop: 3 }}>1. Gedanke</div>
          </div>
          <div style={{ fontSize: 16, color: 'var(--t3)' }}>{'\u2192'}</div>
          <div style={{ textAlign: 'center', flex: 1, padding: 8, background: sending ? 'rgba(187,136,255,0.15)' : 'rgba(187,136,255,0.08)', border: '1px solid rgba(187,136,255,0.2)', borderRadius: 10, transition: 'background 0.3s' }}>
            <div style={{ fontSize: 16 }}>{sending ? '\u23f3' : '\u2B21'}</div>
            <div style={{ fontSize: 9, color: 'var(--p)', marginTop: 3 }}>{sending ? 'Analysiert...' : '2. KANI'}</div>
          </div>
          <div style={{ fontSize: 16, color: 'var(--t3)' }}>{'\u2192'}</div>
          <div style={{ textAlign: 'center', flex: 1, padding: 8, background: 'rgba(0,232,136,0.08)', border: '1px solid rgba(0,232,136,0.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 16 }}>{'\u25C8'}</div>
            <div style={{ fontSize: 9, color: 'var(--g)', marginTop: 3 }}>3. Ergebnis</div>
          </div>
        </div>
        <textarea
          className="inp"
          rows={5}
          placeholder="Einfach rausschreiben — KANI strukturiert, bewertet und empfiehlt..."
          style={{ resize: 'none', marginBottom: 8, flexShrink: 0, fontSize: 13 }}
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
        <button className="abtn p" onClick={handleSend} disabled={sending}>{sending ? '\u23f3 KANI analysiert...' : '\u2B21 An KANI senden'}</button>
      </Card>

      {/* Pipeline Stats — col 5/7, row 1/2 */}
      <Card title="Pipeline" badge={`${statusCounts.total} Ideen`} badgeClass="bg" style={{ gridColumn: '5/7', gridRow: '1/2' }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 38, fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>{statusCounts.total}</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>Ideen total</div>
        {([['Neu', statusCounts.neu, 'c'], ['Research', statusCounts.research, 'a'], ['Projekt', statusCounts.projekt, 'g'], ['Geparkt', statusCounts.geparkt, 't3']] as const).map(s => (
          <div key={s[0]} className="dr">
            <span className="led" style={{ width: 7, height: 7, background: `var(--${s[2]})`, boxShadow: 'none', animation: 'none' }} />
            <span className="dl" style={{ fontSize: 13 }}>{s[0]}</span>
            <span style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: `var(--${s[2]})` }}>{s[1]}</span>
          </div>
        ))}
      </Card>

      {/* Filter — col 7/13, row 1/2 */}
      <Card title="Letzte Analyse" badge="KANI" badgeClass="bp" style={{ gridColumn: '7/13', gridRow: '1/2' }}>
        {(() => {
          const latest = IDEAS.find(i => i.structured || i.feedback)
          if (!latest) return (
            <div style={{ color: 'var(--t3)', fontSize: 13, padding: 20, textAlign: 'center' }}>
              Noch keine Idee analysiert.{'\n'}Teile deinen ersten Gedanken!
            </div>
          )
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--c)' }}>{latest.n}</div>
              {latest.structured && (
                <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, padding: '8px 10px', background: 'rgba(187,136,255,0.07)', borderRadius: 8, border: '1px solid rgba(187,136,255,0.18)', maxHeight: 80, overflow: 'auto' }}>
                  {latest.structured.slice(0, 200)}{latest.structured.length > 200 ? '...' : ''}
                </div>
              )}
              {latest.feedback && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, flexShrink: 0 }}>
                  <div className="sbox"><div className="sbv tc" style={{ fontSize: 20 }}>{latest.feedback.innovation}/5</div><div className="sbl">Innovation</div></div>
                  <div className="sbox"><div className="sbv" style={{ fontSize: 11, color: 'var(--t1)' }}>{latest.feedback.branche}</div><div className="sbl">Branche</div></div>
                  <div className="sbox"><div className="sbv tg" style={{ fontSize: 11 }}>{latest.feedback.nutzen.slice(0, 30)}</div><div className="sbl">Nutzen</div></div>
                </div>
              )}
              {latest.rec && (
                <div style={{ fontSize: 11, color: 'var(--c)', padding: '7px 10px', background: 'rgba(0,200,232,0.07)', borderRadius: 8, border: '1px solid rgba(0,200,232,0.18)' }}>{'\u2192'} {latest.rec}</div>
              )}
            </div>
          )
        })()}
      </Card>

      {/* Filter Row */}
      <div style={{ gridColumn: '1/13', display: 'flex', gap: 5, padding: '0 4px' }}>
        {['Alle', 'Neu', 'Research', 'Projekt', 'Geparkt', 'Verarbeitung'].map(f => (
          <span key={f} className={`fpill${filter === f ? ' act' : ''}`} onClick={() => setFilter(f)} style={{ cursor: 'pointer' }}>{f}</span>
        ))}
      </div>

      {/* Idea Cards — row 2+ */}
      {filtered.slice(0, 8).map((idea, i) => {
        const cols = Math.min(filtered.length, 4)
        const colStart = (i % cols) * Math.floor(12 / cols) + 1
        const colSpan = Math.floor(12 / cols)
        const row = Math.floor(i / cols) + 3
        const stBadge = idea.st === 'Projekt' ? 'bg' : idea.st === 'Research' ? 'ba' : idea.st === 'Neu' ? 'bb' : idea.st === 'Verarbeitung' ? 'bp' : 'br'

        return (
          <Card key={idea.id || idea.n} title={idea.n} badge={idea.st} badgeClass={stBadge} style={{ gridColumn: `${colStart}/${colStart + colSpan}`, gridRow: `${row}/${row + 1}` }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexShrink: 0 }}>
              <div style={{ width: 6, height: 36, borderRadius: 3, background: idea.col, flexShrink: 0, opacity: 0.7 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--fh)', fontSize: 13, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.n}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{idea.cat} {'\u00b7'} {idea.date}</div>
              </div>
            </div>

            {/* Original Text */}
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 8, flexShrink: 0, maxHeight: 50, overflow: 'hidden' }}>{idea.txt}</div>

            {/* AI Feedback (if available) */}
            {idea.feedback && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginBottom: 8 }}>
                <div style={{ textAlign: 'center', flex: 1, background: 'var(--inp)', borderRadius: 6, padding: '5px 3px', border: '1px solid var(--b)' }}>
                  <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 800, color: 'var(--c)' }}>{idea.feedback.innovation}</div>
                  <div style={{ fontSize: 7, color: 'var(--t3)' }}>Innov.</div>
                </div>
                <div style={{ flex: 2, background: 'var(--inp)', borderRadius: 6, padding: '5px 6px', border: '1px solid var(--b)', overflow: 'hidden' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t1)' }}>{idea.feedback.branche}</div>
                  <div style={{ fontSize: 8, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.feedback.highlights?.slice(0, 40)}</div>
                </div>
              </div>
            )}

            {/* Structured preview (if available) */}
            {idea.structured && (
              <div style={{ fontSize: 11, color: 'var(--p)', marginBottom: 8, padding: '6px 8px', background: 'rgba(187,136,255,0.06)', borderRadius: 6, border: '1px solid rgba(187,136,255,0.15)', maxHeight: 40, overflow: 'hidden' }}>
                {idea.structured.slice(0, 100)}{idea.structured.length > 100 ? '...' : ''}
              </div>
            )}

            {/* Processing indicator */}
            {idea.st === 'Verarbeitung' && (
              <div style={{ fontSize: 11, color: 'var(--p)', marginBottom: 8, padding: '8px 10px', background: 'rgba(187,136,255,0.08)', borderRadius: 8, border: '1px solid rgba(187,136,255,0.2)', textAlign: 'center' }}>
                {'\u23f3'} KANI analysiert...
              </div>
            )}

            {/* Recommendation */}
            {idea.rec && idea.st !== 'Verarbeitung' && (
              <div style={{ fontSize: 10, color: 'var(--c)', marginBottom: 8, flexShrink: 0, padding: '5px 8px', background: 'rgba(0,200,232,0.06)', borderRadius: 6, border: '1px solid rgba(0,200,232,0.15)' }}>{'\u2192'} {idea.rec}</div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginTop: 'auto' }}>
              {idea.st !== 'Geparkt' && idea.st !== 'Projekt' && idea.st !== 'Verarbeitung' && (
                <>
                  <button className="abtn s" style={{ margin: 0, flex: 1, fontSize: 10 }} onClick={() => handleAction(idea, 'research')}>{'\u{1F52C}'} Research</button>
                  <button className="abtn p" style={{ margin: 0, flex: 1, fontSize: 10 }} onClick={() => handleAction(idea, 'to-project')}>{'\u25C8'} Projekt</button>
                  <button className="abtn" style={{ margin: 0, flex: 0, fontSize: 10, padding: '0 8px' }} onClick={() => handleAction(idea, 'park')}>{'\u23f8'}</button>
                </>
              )}
              {idea.st === 'Geparkt' && (
                <button className="abtn s" style={{ margin: 0, flex: 1, fontSize: 10 }} onClick={() => handleAction(idea, 'research')}>{'\u{1F52C}'} Reaktivieren</button>
              )}
            </div>
          </Card>
        )
      })}
    </>
  )
}
