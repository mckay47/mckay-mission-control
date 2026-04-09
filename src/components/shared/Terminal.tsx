import { useState, useRef, useEffect } from 'react'
import { Send, Square } from 'lucide-react'
import { StatusLed } from '../ui/StatusLed.tsx'
import { useKaniStream } from '../../hooks/useKaniStream.ts'

export interface TermLine {
  type: 'prompt' | 'output' | 'success' | 'warning' | 'error'
  text: string
  promptLabel?: string
}

interface TerminalProps {
  title: string
  statusLabel?: string
  statusColor?: string
  statusGlow?: string
  lines?: TermLine[]
  placeholder?: string
  inputValue?: string
  onClearInput?: () => void
  onSend?: () => void
  onInputChange?: (value: string) => void
  onThinkingChange?: (thinking: boolean) => void
  // Live mode props
  mode?: 'live' | 'clipboard'
  cwd?: string
  terminalId?: string
}

export function Terminal({
  title, statusLabel = 'Running', statusColor = 'var(--g)', statusGlow = 'var(--gg)',
  lines: externalLines, placeholder, inputValue: externalInputValue,
  onClearInput, onSend, onInputChange, onThinkingChange,
  mode = 'clipboard', cwd = '~/mckay-os', terminalId = 'unknown',
}: TerminalProps) {

  // Live mode streaming
  const stream = useKaniStream({ cwd, terminalId })

  // Internal input state for live mode (when not controlled externally)
  const [internalInput, setInternalInput] = useState('')
  const inputValue = externalInputValue !== undefined ? externalInputValue : internalInput
  const handleInputChange = (value: string) => {
    if (onInputChange) onInputChange(value)
    else setInternalInput(value)
  }

  // Clipboard mode state
  const [clipboardLines, setClipboardLines] = useState<TermLine[]>([])
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when external prompt is injected (e.g. Quick Action buttons)
  useEffect(() => {
    if (externalInputValue && inputRef.current) {
      inputRef.current.focus()
    }
  }, [externalInputValue])

  // Report thinking state to parent
  useEffect(() => {
    onThinkingChange?.(stream.isThinking)
  }, [stream.isThinking, onThinkingChange])

  // Combine lines based on mode
  const allLines = mode === 'live'
    ? [...(externalLines || []), ...stream.lines]
    : [...(externalLines || []), ...clipboardLines]

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [allLines.length])

  // Effective status for live mode
  const effectiveStatusLabel = mode === 'live' && stream.isThinking ? 'Thinking...' : statusLabel
  const effectiveStatusColor = mode === 'live' && stream.isThinking ? 'var(--a)' : statusColor
  const effectiveStatusGlow = mode === 'live' && stream.isThinking ? 'var(--ag)' : statusGlow

  const handleSend = async () => {
    if (!inputValue) return

    if (mode === 'live') {
      // Live mode: send to Claude CLI via backend
      const prompt = inputValue
      if (onInputChange) onInputChange('')
      else setInternalInput('')
      onSend?.()
      await stream.sendPrompt(prompt)
    } else {
      // Clipboard mode (original behavior)
      try {
        await navigator.clipboard.writeText(inputValue)
      } catch {
        // Clipboard may not be available
      }

      setClipboardLines(prev => [
        ...prev,
        { type: 'prompt', text: inputValue },
        { type: 'success', text: '\u2191 In Clipboard kopiert' },
      ])

      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      setCopied(true)
      copiedTimer.current = setTimeout(() => setCopied(false), 2000)

      onSend?.()
    }
  }

  const handleAbort = () => {
    stream.abort()
  }

  return (
    <div className="cf" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--r)' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--a)' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--g)' }} />
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, color: effectiveStatusColor }}>
          <StatusLed color={effectiveStatusColor} glow={effectiveStatusGlow} animate={stream.isThinking || statusLabel === 'Running'} size={7} />
          {effectiveStatusLabel}
        </div>
      </div>

      {/* Body */}
      <div className="term-body" ref={bodyRef}>
        {allLines.map((l, i) => (
          <div className="tl" key={i}>
            {l.type === 'prompt' && <span className="tp">{l.promptLabel || '~$'}</span>}
            <span className={
              l.type === 'prompt' ? '' :
              l.type === 'success' ? 'th' :
              l.type === 'warning' ? 'tw' :
              l.type === 'error' ? 'te' : 'to'
            }>{l.text}</span>
          </div>
        ))}
        {stream.isThinking && (
          <div className="tl">
            <span className="tp">~$</span>
            <span className="to" style={{ animation: 'lp 1s ease-in-out infinite', '--lc': 'var(--a)' } as React.CSSProperties}>thinking...</span>
          </div>
        )}
        {!stream.isThinking && (
          <div className="tl">
            <span className="tp">~$</span>
            <span className="to" style={{ animation: 'lp 1s ease-in-out infinite', '--lc': 'rgba(200,200,208,0.3)' } as React.CSSProperties}>&#9610;</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 18px', display: 'flex', gap: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <input
          ref={inputRef}
          className="in"
          style={{
            flex: 1, padding: '12px 18px', border: 'none', outline: 'none', fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            color: inputValue ? 'var(--g)' : 'var(--tx)',
            borderRadius: 14,
          }}
          value={inputValue || ''}
          placeholder={placeholder || 'mckay.os/kani → ...'}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && inputValue && !stream.isThinking) { handleSend() } }}
          disabled={stream.isThinking}
        />
        {inputValue && onClearInput && (
          <button
            onClick={onClearInput}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent',
              color: 'var(--tx3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontFamily: 'inherit',
            }}
          >
            ×
          </button>
        )}
        {stream.isThinking ? (
          <button
            onClick={handleAbort}
            style={{
              width: 42, height: 42, borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg, var(--r), var(--o))',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px var(--rg)',
              transition: 'all 0.3s',
            }}
          >
            <Square size={14} fill="#fff" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            style={{
              width: 42, height: 42, borderRadius: '50%', border: 'none',
              background: inputValue ? 'linear-gradient(135deg, var(--g), var(--t))' : 'linear-gradient(135deg, var(--p), var(--bl))',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: inputValue ? '0 4px 12px var(--gg)' : '0 4px 12px var(--pg)',
              transition: 'all 0.3s',
            }}
          >
            <Send size={16} />
          </button>
        )}
        {copied && (
          <span style={{
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
            color: 'var(--g)', whiteSpace: 'nowrap', alignSelf: 'center',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            Kopiert ✓
          </span>
        )}
      </div>
    </div>
  )
}
