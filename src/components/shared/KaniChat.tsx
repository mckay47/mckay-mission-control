import { useState, useRef, useEffect } from 'react'

interface KaniChatProps {
  open: boolean
  onClose: () => void
  context?: string
}

interface Message {
  id: number
  role: 'k' | 'u'
  text: string
  modelTag?: string
}

interface ChatResponse {
  message: string
  modelSwitch?: string
  limitReached?: boolean
}

let nextId = 2

export default function KaniChat({ open, onClose, context = 'cockpit' }: KaniChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'k', text: 'Hallo Mehti. Was soll ich tun?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { id: nextId++, role: 'u', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data: ChatResponse = await res.json()

      const kaniMsg: Message = {
        id: nextId++,
        role: 'k',
        text: data.message,
        modelTag: data.modelSwitch || undefined,
      }
      setMessages((prev) => [...prev, kaniMsg])

      if (data.limitReached) {
        setMessages((prev) => [
          ...prev,
          { id: nextId++, role: 'k', text: 'Limit erreicht. Bitte spaeter erneut versuchen.', modelTag: undefined },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'k', text: 'Verbindungsfehler. Bitte erneut versuchen.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`kcc cf${open ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="kc-h">
        <div className="kc-a">
          <svg viewBox="0 0 24 24">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          </svg>
        </div>
        <div>
          <div className="kc-n">KANI Terminal</div>
          <div className="kc-st">
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--g)',
                boxShadow: '0 0 6px var(--gg)',
                display: 'inline-block',
              }}
            />
            Online
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: 'var(--tx3)',
            fontSize: 18,
            cursor: 'pointer',
            fontFamily: 'inherit',
            lineHeight: 1,
          }}
          aria-label="Close KANI Chat"
        >
          &times;
        </button>
      </div>

      {/* Chat body */}
      <div className="kc-b" ref={bodyRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`cm ${msg.role} in`}>
            {msg.modelTag && (
              <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--bl)', marginRight: 4 }}>
                [{msg.modelTag}]
              </span>
            )}
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="cm k in" style={{ opacity: 0.5 }}>
            ...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="kc-i">
        <input
          className="ki in"
          placeholder="Prompt an KANI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="ks" onClick={handleSend} disabled={loading}>
          <svg viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
