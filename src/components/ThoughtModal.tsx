import { useState } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'

interface ThoughtModalProps {
  open: boolean
  onClose: () => void
}

const CATEGORIES = [
  { val: 'projekt', lbl: '\u25c8 Projekt-Idee' },
  { val: 'feature', lbl: '\u2699 Feature' },
  { val: 'research', lbl: '\u{1F52C} Research' },
  { val: 'strategie', lbl: '\u{1F3AF} Strategie' },
  { val: 'tool', lbl: '\u{1F6E0} Tool' },
  { val: 'privat', lbl: '\u{1F512} Privat' },
]

export default function ThoughtModal({ open, onClose }: ThoughtModalProps) {
  const { toast } = useToast()
  const [thought, setThought] = useState('')
  const [category, setCategory] = useState('projekt')
  const [saving, setSaving] = useState(false)

  async function handleSend() {
    if (!thought.trim()) {
      toast('Gedanken eingeben')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: thought.trim().split('\n')[0].slice(0, 80),
          description: thought.trim(),
          category,
          priority: 'medium',
        }),
      })
      if (res.ok) {
        toast('\u2b21 Gedanke im Thinktank gespeichert')
        setThought('')
        setCategory('projekt')
        onClose()
      } else {
        toast('\u26a0 Fehler beim Speichern')
      }
    } catch {
      toast('\u26a0 API nicht erreichbar')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setThought('')
    setCategory('projekt')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Gedanke \u2192 Thinktank">
      <div className="mfld">
        <div className="mflbl">Dein Gedanke</div>
        <textarea
          className="inp"
          rows={5}
          placeholder="Einfach rausschreiben \u2014 wird als Idee im Filesystem gespeichert..."
          style={{ resize: 'none' }}
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
      </div>
      <div className="mfld">
        <div className="mflbl">Kategorie</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {CATEGORIES.map(c => (
            <span key={c.val} className={`fpill${category === c.val ? ' act' : ''}`} onClick={() => setCategory(c.val)}>{c.lbl}</span>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 12, lineHeight: 1.6 }}>
        Speichert als Markdown-Datei in ~/mckay-os/ideas/ {'\u00b7'} Dashboard aktualisiert automatisch via HMR
      </div>
      <div className="mrow">
        <button className="abtn p" style={{ flex: 1, margin: 0 }} onClick={handleSend} disabled={saving}>{saving ? '\u23f3' : '\u2b21'} Speichern</button>
        <button className="abtn" style={{ flex: 1, margin: 0 }} onClick={handleClose}>{'\u2715'} Abbrechen</button>
      </div>
    </Modal>
  )
}
