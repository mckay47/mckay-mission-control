import { useState, useEffect } from 'react'

const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

export function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  const day = DAYS[now.getDay()]
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--tx3)' }}>
      {day} {date} {time}
    </span>
  )
}
