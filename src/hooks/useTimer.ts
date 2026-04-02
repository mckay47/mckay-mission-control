import { useState, useEffect, useCallback } from 'react'

export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const toggle = useCallback(() => setRunning(r => !r), [])
  const reset = useCallback(() => { setSeconds(0); setRunning(false) }, [])

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const display = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return { display, running, toggle, reset, seconds }
}

export function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = now.getHours() % 12
  const m = now.getMinutes()
  const s = now.getSeconds()

  return {
    hourDeg: h * 30 + m * 0.5,
    minuteDeg: m * 6,
    secondDeg: s * 6,
    timeStr: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    dateStr: now.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }),
  }
}
