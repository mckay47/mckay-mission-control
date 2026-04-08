import { useState, useRef, useCallback, useEffect } from 'react'
import type { TermLine } from '../components/shared/Terminal.tsx'

interface UseKaniStreamOptions {
  cwd: string
  terminalId: string
}

export function useKaniStream({ cwd, terminalId }: UseKaniStreamOptions) {
  const [lines, setLines] = useState<TermLine[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

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
        // Fallback: copy to clipboard
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
          if (firstChunk) {
            setLines(prev => [...prev, { type: 'output', text: line }])
            firstChunk = false
          } else {
            setLines(prev => [...prev, { type: 'output', text: line }])
          }
        }
      }

      // Flush remaining buffer
      if (buffer) {
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
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  const clearLines = useCallback(() => {
    setLines([])
    // Reset server-side session so next message starts a fresh Claude conversation
    fetch('/api/kani/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ terminalId }),
    }).catch(() => {})
  }, [terminalId])

  // Abort on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [])

  return { lines, isThinking, sendPrompt, abort, clearLines }
}
