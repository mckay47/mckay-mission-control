import { useState, useCallback, useEffect } from 'react'

interface UseTerminalSessionOptions {
  terminalId: string
  cwd: string
}

export function useTerminalSession({ terminalId, cwd }: UseTerminalSessionOptions) {
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
  const [terminalBusy, setTerminalBusy] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [shuttingDown, setShuttingDown] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // Detect existing session on mount (e.g. user navigated away and came back)
  useEffect(() => {
    if (!terminalId) return
    Promise.all([
      fetch(`/api/kani/history/${encodeURIComponent(terminalId)}`).then(r => r.json()).catch(() => null),
      fetch('/api/kani/status').then(r => r.json()).catch(() => null),
    ]).then(([historyData, statusData]) => {
      const hasHistory = historyData?.history?.length > 0
      const hasActiveProcess = statusData?.activeTerminals?.some((t: { terminalId: string }) => t.terminalId === terminalId)
      if (hasHistory || hasActiveProcess) {
        setSessionActive(true)
      }
    })
  }, [terminalId])

  const activate = useCallback((initialPrompt?: string) => {
    setSessionActive(true)
    if (initialPrompt) {
      setPendingPrompt(initialPrompt)
    }
  }, [])

  const shutdown = useCallback(() => {
    setShuttingDown(true)
    setPendingPrompt(
      'Session beenden: 1) MEMORY.md aktualisieren (Letzte Session + Next Steps) 2) TODOS.md prüfen und abhaken 3) Alle Änderungen committen und pushen 4) Antworte mit [SESSION_END] ✓'
    )
  }, [])

  const newSession = useCallback(() => {
    setRefreshing(true)
    setPendingPrompt(
      'Zwischenspeichern: 1) MEMORY.md kurz aktualisieren (aktueller Stand) 2) Antworte nur mit: [CHECKPOINT] ✓'
    )
  }, [])

  const onThinkingChange = useCallback((thinking: boolean) => {
    setTerminalBusy(thinking)

    // Detect shutdown completion — wait for reset, then remount clean
    if (!thinking && shuttingDown) {
      fetch('/api/kani/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terminalId }),
      }).finally(() => {
        setShuttingDown(false)
        setSessionActive(false)
        setSessionKey(k => k + 1)
      })
    }

    // Detect refresh/new-session completion — wait for reset, then re-activate
    if (!thinking && refreshing) {
      fetch('/api/kani/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terminalId }),
      }).finally(() => {
        setRefreshing(false)
        setSessionKey(k => k + 1)
        setTimeout(() => {
          setPendingPrompt(
            'Lies MEMORY.md und TODOS.md dieses Projekts. Fasse kurz zusammen: Wo sind wir stehen geblieben? Was steht als nächstes an? Zeige die offenen Todos.'
          )
        }, 200)
      })
    }
  }, [terminalId, shuttingDown, refreshing])

  const onSend = useCallback(() => {
    setPendingPrompt(null)
  }, [])

  return {
    sessionActive,
    terminalBusy,
    shuttingDown,
    refreshing,
    sessionKey,
    pendingPrompt,
    setPendingPrompt,
    activate,
    shutdown,
    newSession,
    onThinkingChange,
    onSend,
  }
}
