import { useState } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'

interface TodoModalProps {
  open: boolean
  onClose: () => void
}

export default function TodoModal({ open, onClose }: TodoModalProps) {
  const { toast } = useToast()
  const [task, setTask] = useState('')
  const [prio, setPrio] = useState('h')

  function handleSave() {
    if (!task.trim()) {
      toast('Aufgabe eingeben')
      return
    }
    toast('\u2713 Todo gespeichert: ' + task.slice(0, 30))
    setTask('')
    setPrio('h')
    onClose()
  }

  function handleClose() {
    setTask('')
    setPrio('h')
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
        />
      </div>
      <div className="mfld">
        <div className="mflbl">Deadline</div>
        <input className="inp" type="date" />
      </div>
      <div className="mfld">
        <div className="mflbl">Projekt</div>
        <select className="inp" style={{ cursor: 'pointer' }}>
          <option>{'\u2014'} Kein Projekt {'\u2014'}</option>
          <option>{'\u{1F3E5}'} Hebammenbuero</option>
          <option>{'\u{1F931}'} Stillprobleme</option>
          <option>{'\u{1F3BE}'} TennisCoach</option>
          <option>{'\u{1F50D}'} FindeMeine</option>
          <option>{'\u{1F512}'} Privat</option>
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
        <button className="abtn p" style={{ flex: 1, margin: 0 }} onClick={handleSave}>{'\u2713'} Speichern</button>
        <button className="abtn" style={{ flex: 1, margin: 0 }} onClick={handleClose}>{'\u2715'} Abbrechen</button>
      </div>
    </Modal>
  )
}
