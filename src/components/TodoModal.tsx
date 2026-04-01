import { useState } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'
import { PROJ } from '../lib/data'

interface TodoModalProps {
  open: boolean
  onClose: () => void
}

const PRIO_MAP: Record<string, string> = { h: 'high', m: 'medium', l: 'low' }

export default function TodoModal({ open, onClose }: TodoModalProps) {
  const { toast } = useToast()
  const [task, setTask] = useState('')
  const [prio, setPrio] = useState('h')
  const [due, setDue] = useState('')
  const [project, setProject] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!task.trim()) {
      toast('Aufgabe eingeben')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.trim(),
          priority: PRIO_MAP[prio] || 'medium',
          project,
          due,
        }),
      })
      if (res.ok) {
        toast('\u2713 Todo gespeichert: ' + task.slice(0, 30))
        setTask('')
        setPrio('h')
        setDue('')
        setProject('')
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
    setTask('')
    setPrio('h')
    setDue('')
    setProject('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Neues Todo">
      <div className="mfld">
        <div className="mflbl">Aufgabe</div>
        <input
          className="inp"
          placeholder="Was muss erledigt werden?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
      </div>
      <div className="mfld">
        <div className="mflbl">Deadline</div>
        <input className="inp" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      </div>
      <div className="mfld">
        <div className="mflbl">Projekt</div>
        <select className="inp" style={{ cursor: 'pointer' }} value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">{'\u2014'} Kein Projekt {'\u2014'}</option>
          {PROJ.filter(p => ['Phase 0','Phase 1','Phase 2','Phase 2+','Phase 3','LIVE'].includes(p.phase)).map(p => (
            <option key={p.id} value={p.id}>{p.e} {p.n}</option>
          ))}
        </select>
      </div>
      <div className="mfld">
        <div className="mflbl">Priorit{'\u00e4'}t</div>
        <div style={{ display: 'flex', gap: 5 }}>
          <span className={`fpill${prio === 'h' ? ' act' : ''}`} onClick={() => setPrio('h')}>{'\u{1F534}'} Hoch</span>
          <span className={`fpill${prio === 'm' ? ' act' : ''}`} onClick={() => setPrio('m')}>{'\u{1F7E1}'} Mittel</span>
          <span className={`fpill${prio === 'l' ? ' act' : ''}`} onClick={() => setPrio('l')}>{'\u{1F7E2}'} Niedrig</span>
        </div>
      </div>
      <div className="mrow">
        <button className="abtn p" style={{ flex: 1, margin: 0 }} onClick={handleSave} disabled={saving}>{saving ? '\u23f3' : '\u2713'} Speichern</button>
        <button className="abtn" style={{ flex: 1, margin: 0 }} onClick={handleClose}>{'\u2715'} Abbrechen</button>
      </div>
    </Modal>
  )
}
