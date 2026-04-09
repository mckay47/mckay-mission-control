import { useState, useRef, useCallback, useEffect } from 'react'
import type { TermLine } from '../components/shared/Terminal.tsx'

interface UseKaniStreamOptions {
  cwd: string
  terminalId: string
}

export function useKaniStream({ cwd, terminalId }: UseKaniStreamOptions) {
  const [lines, setLines] = useState<TermLine[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // Load history from server on mount
  useEffect(() => {
    if (loaded) return
    setLoaded(true)

    fetch(`/api/kani/history/${encodeURIComponent(terminalId)}`)
      .then(res => res.json())
      .then((data: { history: { role: string; text: string }[]; isActive: boolean }) => {
        if (data.history && data.history.length > 0) {
          const restored: TermLine[] = []
          for (const msg of data.history) {
            if (msg.role === 'user') {
              restored.push({ type: 'prompt', text: msg.text })
            } else {
              // Split assistant response into lines, filter [SIGNAL] lines
              const outputLines = msg.text.split('\n')
              for (const line of outputLines) {
                if (line.trim().startsWith('[SIGNAL]')) continue
                restored.push({ type: 'output', text: line })
              }
            }
          }
          setLines(restored)
        }
        if (data.isActive) {
          setIsThinking(true)
          // Process is still running — we can't reconnect to its stream
          // but we show the indicator and poll for completion
          pollForCompletion(terminalId)
        }
      })
      .catch(() => { /* first load, no history */ })
  }, [terminalId, loaded])

  // Poll for process completion if we reconnected mid-execution
  function pollForCompletion(tid: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/kani/history/${encodeURIComponent(tid)}`)
        const data = await res.json()
        if (!data.isActive) {
          clearInterval(interval)
          setIsThinking(false)
          // Reload full history to get the final response
          if (data.history && data.history.length > 0) {
            const restored: TermLine[] = []
            for (const msg of data.history) {
              if (msg.role === 'user') {
                restored.push({ type: 'prompt', text: msg.text })
              } else {
                const outputLines = msg.text.split('\n')
                for (const line of outputLines) {
                  if (line.trim().startsWith('[SIGNAL]')) continue
                  restored.push({ type: 'output', text: line })
                }
              }
            }
            setLines(restored)
          }
        }
      } catch {
        clearInterval(interval)
        setIsThinking(false)
      }
    }, 2000)
  }

  const sendPrompt = useCallback(async (prompt: string) => {
    // Add user prompt line
    setLines(prev => [...prev, { type: 'prompt', text: prompt }])
    setIsThinking(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/kani/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, cwd, terminalId }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        try { await navigator.clipboard.writeText(prompt) } catch {}
        setLines(prev => [...prev, { type: 'warning', text: 'Server nicht erreichbar — in Clipboard kopiert' }])
        setIsThinking(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let firstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lineBreaks = buffer.split('\n')
        buffer = lineBreaks.pop() || ''

        for (const line of lineBreaks) {
          // Filter out [SIGNAL] lines — they're for the dashboard, not the user
          if (line.trim().startsWith('[SIGNAL]')) continue
          firstChunk = false
          setLines(prev => [...prev, { type: 'output', text: line }])
        }
      }

      // Flush remaining buffer (also filter signals)
      if (buffer && !buffer.trim().startsWith('[SIGNAL]')) {
        setLines(prev => [...prev, { type: 'output', text: buffer }])
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setLines(prev => [...prev, { type: 'warning', text: 'Abgebrochen' }])
      } else {
        try { await navigator.clipboard.writeText(prompt) } catch {}
        setLines(prev => [...prev, { type: 'error', text: `Fehler: ${(err as Error).message}` }])
      }
    } finally {
      setIsThinking(false)
      abortRef.current = null
    }
  }, [cwd, terminalId])

  const abort = useCallback(() => {
    // Abort the client-side fetch
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    // Kill the server-side Claude CLI process
    fetch('/api/kani/abort', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ terminalId }),
    }).catch(() => {})
  }, [terminalId])

  const clearLines = useCallback(() => {
    setLines([])
    // Reset server-side session so next message starts a fresh Claude conversation
    fetch('/api/kani/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ terminalId }),
    }).catch(() => {})
  }, [terminalId])

  // Abort on unmount — but DON'T kill the server process
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [])

  return { lines, isThinking, sendPrompt, abort, clearLines }
}
