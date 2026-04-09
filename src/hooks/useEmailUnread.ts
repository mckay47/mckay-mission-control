import { useState, useEffect, useCallback } from 'react'

const POLL_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useEmailUnread() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/email/unread')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCounts(data.counts || {})
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email fetch failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCounts()
    const interval = setInterval(fetchCounts, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchCounts])

  // Helper: get total unread for a list of emails
  const getGroupUnread = useCallback((emails: string[]) => {
    let total = 0
    let hasData = false
    for (const email of emails) {
      const count = counts[email]
      if (count !== undefined && count >= 0) {
        total += count
        hasData = true
      }
    }
    return hasData ? total : null
  }, [counts])

  // Helper: get unread for single email (-1 = error/no password, undefined = not loaded)
  const getUnread = useCallback((email: string) => counts[email], [counts])

  return { counts, loading, error, getGroupUnread, getUnread, refetch: fetchCounts }
}
