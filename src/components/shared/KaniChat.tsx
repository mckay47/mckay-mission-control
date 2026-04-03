import { useState } from 'react'

interface KaniChatProps {
  open: boolean
  onClose: () => void
}

interface Message {
  id: number
  role: 'k' | 'u'
  text: string
}

const initialMessages: Message[] = [
  { id: 1, role: 'k', text: 'Hallo Mehti. Was soll ich tun?' },
  { id: 2, role: 'u', text: 'Status Hebammenbuero?' },
  { id: 3, role: 'k', text: 'Phase 0, 40%. 12 Todos, 1 overdue. Build-Agent arbeitet am Extended Mockup.' },
]

export default function KaniChat({ open, onClose }: KaniChatProps) {
  const [messages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    // Phase 0: dummy — just clear input
    setInput('')
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
      <div className="kc-b">
        {messages.map((msg) => (
          <div key={msg.id} className={`cm ${msg.role} in`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="kc-i">
        <input
          className="ki in"
          placeholder="Prompt an KANI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="ks" onClick={handleSend}>
          <svg viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
