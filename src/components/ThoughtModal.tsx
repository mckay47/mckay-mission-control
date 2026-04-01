import { useState } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'

interface ThoughtModalProps {
  open: boolean
  onClose: () => void
}

export default function ThoughtModal({ open, onClose }: ThoughtModalProps) {
  const { toast } = useToast()
  const [thought, setThought] = useState('')

  function handleSend() {
    if (!thought.trim()) {
      toast('Gedanken eingeben')
      return
    }
    toast('\u2b21 Gedanke an KANI gesendet')
    setThought('')
    onClose()
  }

  function handleClose() {
    setThought('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Gedanke \u2192 Thinktank">
      <div className="mfld">
        <div className="mflbl">Dein Gedanke</div>
        <textarea
          className="inp"
          rows={5}
          placeholder="Einfach rausschreiben \u2014 KANI kategorisiert automatisch..."
          style={{ resize: 'none' }}
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
      </div>
      <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 12, lineHeight: 1.6 }}>
        KANI analysiert: Kategorie {'\u00b7'} Business-Potenzial {'\u00b7'} N{'\u00e4'}chste Schritte {'\u00b7'} Synergie-Check
      </div>
      <div className="mrow">
        <button className="abtn p" style={{ flex: 1, margin: 0 }} onClick={handleSend}>{'\u2b21'} An KANI senden</button>
        <button className="abtn" style={{ flex: 1, margin: 0 }} onClick={handleClose}>{'\u2715'} Abbrechen</button>
      </div>
    </Modal>
  )
}
