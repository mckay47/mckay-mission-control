import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
}

export default function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, description: description.trim() }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data: { id: string } = await res.json()
      setName('')
      setDescription('')
      onClose()
      navigate(`/projekte/${data.id}`)
    } catch {
      // silently fail — API not yet wired
    } finally {
      setSubmitting(false)
    }
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="cf"
        style={{
          width: 440,
          maxWidth: '90vw',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700 }}>Neues Projekt</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>Projekt-Name *</label>
          <input
            className="in"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. TennisApp"
            required
            autoFocus
            style={{
              padding: '10px 14px',
              fontSize: 13,
              borderRadius: 10,
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>Beschreibung</label>
          <textarea
            className="in"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kurze Beschreibung des Projekts..."
            rows={3}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              borderRadius: 10,
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              background: 'var(--bg)',
              color: 'var(--tx2)',
              boxShadow: '2px 2px 6px var(--shdr), -2px -2px 6px var(--shl)',
            }}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            style={{
              padding: '10px 20px',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              border: 'none',
              borderRadius: 10,
              cursor: name.trim() && !submitting ? 'pointer' : 'not-allowed',
              background: 'var(--g)',
              color: '#fff',
              boxShadow: '0 3px 8px var(--gg)',
              opacity: name.trim() && !submitting ? 1 : 0.5,
            }}
          >
            {submitting ? '...' : 'Projekt anlegen'}
          </button>
        </div>
      </form>
    </div>
  )
}
