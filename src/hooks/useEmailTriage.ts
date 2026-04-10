import { useState, useCallback, useRef } from 'react'
import type { TriagedEmail, EmailEnvelope, EmailFullBody, TriageStats, EmailCategory, EmailAttachment } from '../lib/types.ts'
import { emailGroups } from '../lib/categories.ts'

export function useEmailTriage() {
  const [triaged, setTriaged] = useState<Map<string, TriagedEmail[]>>(new Map())
  const [loading, setLoading] = useState(false)
  const [triaging, setTriaging] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<TriagedEmail | null>(null)
  const [fullBody, setFullBody] = useState<EmailFullBody | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [processedCount, setProcessedCount] = useState(() => {
    // Persist per day in localStorage
    const today = new Date().toISOString().slice(0, 10)
    const stored = localStorage.getItem('kani-email-processed')
    if (stored) {
      try { const d = JSON.parse(stored); if (d.date === today) return d.count } catch {}
    }
    return 0
  })
  const incrementProcessed = useCallback(() => {
    setProcessedCount(prev => {
      const next = prev + 1
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem('kani-email-processed', JSON.stringify({ date: today, count: next }))
      return next
    })
  }, [])
  const fetchedAccounts = useRef(new Set<string>())

  // Fetch inbox + triage for a single account
  const fetchAndTriage = useCallback(async (account: string, groupId: string) => {
    setLoading(true)
    try {
      const inboxRes = await fetch(`/api/email/inbox?account=${encodeURIComponent(account)}&limit=30`)
      if (!inboxRes.ok) throw new Error(`Inbox: ${inboxRes.status}`)
      const { emails } = await inboxRes.json() as { emails: EmailEnvelope[] }

      if (emails.length === 0) {
        setTriaged(prev => { const n = new Map(prev); n.set(account, []); return n })
        return
      }

      setTriaging(true)
      const triageRes = await fetch('/api/email/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, emails, groupId }),
      })
      if (!triageRes.ok) throw new Error(`Triage: ${triageRes.status}`)
      const { results } = await triageRes.json() as { results: TriagedEmail[] }

      setTriaged(prev => { const n = new Map(prev); n.set(account, results); return n })
      fetchedAccounts.current.add(account)
    } catch (err) {
      console.error('Triage error:', account, err)
    } finally {
      setLoading(false)
      setTriaging(false)
    }
  }, [])

  // Fetch all accounts in a group
  const fetchGroup = useCallback(async (groupId: string) => {
    const group = emailGroups.find(g => g.id === groupId)
    if (!group) return
    setLoading(true)
    try {
      await Promise.all(
        group.accounts
          .filter(acc => acc.email) // skip empty
          .map(acc => fetchAndTriage(acc.email, groupId))
      )
    } finally {
      setLoading(false)
    }
  }, [fetchAndTriage])

  // Get triaged emails for a specific account or all accounts in a group
  const getEmails = useCallback((groupId: string, filterAccount?: string): TriagedEmail[] => {
    if (filterAccount) return triaged.get(filterAccount) || []
    const group = emailGroups.find(g => g.id === groupId)
    if (!group) return []
    return group.accounts.flatMap(acc => triaged.get(acc.email) || [])
  }, [triaged])

  // Get emails filtered by category
  const getEmailsByCategory = useCallback((groupId: string, category: EmailCategory, filterAccount?: string): TriagedEmail[] => {
    return getEmails(groupId, filterAccount).filter(e => e.triage.category === category)
  }, [getEmails])

  // Get stats
  const getStats = useCallback((groupId: string, filterAccount?: string): TriageStats => {
    const emails = getEmails(groupId, filterAccount)
    return {
      total: emails.length,
      info: emails.filter(e => e.triage.category === 'info').length,
      action: emails.filter(e => e.triage.category === 'action').length,
      spam: emails.filter(e => e.triage.category === 'spam').length,
      invoice: emails.filter(e => e.triage.category === 'invoice').length,
      pending: emails.filter(e => e.triage.category === 'action' && (e.triage.suggested_action === 'reply' || e.triage.suggested_action === 'todo')).length,
    }
  }, [getEmails])

  // Get smart label counts for a group
  const getSmartLabels = useCallback((groupId: string, filterAccount?: string): { label: string; count: number; category: EmailCategory }[] => {
    const emails = getEmails(groupId, filterAccount)
    const labelMap = new Map<string, { count: number; category: EmailCategory }>()
    for (const e of emails) {
      const label = e.triage.smart_label || e.triage.category
      const existing = labelMap.get(label)
      if (existing) {
        existing.count++
      } else {
        labelMap.set(label, { count: 1, category: e.triage.category })
      }
    }
    return Array.from(labelMap.entries())
      .map(([label, data]) => ({ label, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count)
  }, [getEmails])

  // Fetch full email body
  const fetchBody = useCallback(async (account: string, uid: number) => {
    setFullBody(null)
    const res = await fetch(`/api/email/message?account=${encodeURIComponent(account)}&uid=${uid}`)
    if (!res.ok) return
    const body = await res.json() as EmailFullBody
    setFullBody(body)
  }, [])

  // Download attachment
  const downloadAttachment = useCallback((account: string, uid: number, partId: string, filename: string) => {
    const url = `/api/email/attachment/download?account=${encodeURIComponent(account)}&uid=${uid}&part=${encodeURIComponent(partId)}&filename=${encodeURIComponent(filename)}`
    window.open(url, '_blank')
  }, [])

  // Execute IMAP action
  const executeAction = useCallback(async (account: string, uid: number, action: string, target?: string) => {
    const res = await fetch('/api/email/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, uid, action, target }),
    })
    if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
    // Remove from local state
    setTriaged(prev => {
      const n = new Map(prev)
      const list = n.get(account) || []
      n.set(account, list.filter(e => e.envelope.uid !== uid))
      return n
    })
    if (selectedEmail?.envelope.uid === uid) setSelectedEmail(null)
    incrementProcessed()
  }, [selectedEmail, incrementProcessed])

  // Approve and send draft
  const approveDraft = useCallback(async (email: TriagedEmail, draftText: string) => {
    setSending(true)
    try {
      const res = await fetch('/api/email/draft/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account: email.account,
          uid: email.envelope.uid,
          draft: draftText,
          to: email.envelope.from.address,
          subject: `Re: ${email.envelope.subject}`,
          inReplyTo: email.envelope.messageId,
        }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      // Remove from state
      setTriaged(prev => {
        const n = new Map(prev)
        const list = n.get(email.account) || []
        n.set(email.account, list.filter(e => e.envelope.uid !== email.envelope.uid))
        return n
      })
      setSelectedEmail(null)
      setEditDraft('')
      incrementProcessed()
    } finally {
      setSending(false)
    }
  }, [incrementProcessed])

  // Bulk action: delete all spam
  const deleteAllSpam = useCallback(async (groupId: string, filterAccount?: string) => {
    const spamEmails = getEmailsByCategory(groupId, 'spam', filterAccount)
    for (const email of spamEmails) {
      await executeAction(email.account, email.envelope.uid, 'delete')
    }
  }, [getEmailsByCategory, executeAction])

  // Bulk action: move all invoices
  const moveAllInvoices = useCallback(async (groupId: string, filterAccount?: string) => {
    const invoices = getEmailsByCategory(groupId, 'invoice', filterAccount)
    for (const email of invoices) {
      const folder = email.triage.folder_target || 'KANI/Rechnungen'
      await executeAction(email.account, email.envelope.uid, 'move', folder)
    }
  }, [getEmailsByCategory, executeAction])

  // Check if group was already fetched
  const isGroupFetched = useCallback((groupId: string): boolean => {
    const group = emailGroups.find(g => g.id === groupId)
    if (!group) return false
    return group.accounts.some(acc => fetchedAccounts.current.has(acc.email))
  }, [])

  return {
    triaged, loading, triaging, sending,
    selectedEmail, setSelectedEmail,
    fullBody, editDraft, setEditDraft,
    fetchAndTriage, fetchGroup, isGroupFetched,
    getEmails, getEmailsByCategory, getStats,
    fetchBody, downloadAttachment, executeAction,
    approveDraft, deleteAllSpam, moveAllInvoices, getSmartLabels,
    processedCount,
  }
}
