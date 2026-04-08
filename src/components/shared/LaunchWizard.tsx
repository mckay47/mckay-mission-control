import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMissionControl } from '../../lib/MissionControlProvider'
import { supabase } from '../../lib/supabase'
import { Rocket, Search, FileText, CheckCircle, XCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

interface LaunchWizardProps {
  open: boolean
  onClose: () => void
  ideaId?: string
  ideaName?: string
  ideaDescription?: string
}

type Step = 'describe' | 'research' | 'brief' | 'review' | 'created'

const STEPS: { key: Step; label: string; icon: typeof Rocket }[] = [
  { key: 'describe', label: 'Beschreibung', icon: FileText },
  { key: 'research', label: 'Research', icon: Search },
  { key: 'brief', label: 'Brief', icon: FileText },
  { key: 'review', label: 'Review', icon: CheckCircle },
  { key: 'created', label: 'Fertig', icon: Rocket },
]

export default function LaunchWizard({ open, onClose, ideaId, ideaName, ideaDescription }: LaunchWizardProps) {
  const navigate = useNavigate()
  const { launchSessions } = useMissionControl()
  const [step, setStep] = useState<Step>('describe')
  const [name, setName] = useState(ideaName || '')
  const [description, setDescription] = useState(ideaDescription || '')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)

  // Pre-fill when props change
  useEffect(() => {
    if (ideaName) setName(ideaName)
    if (ideaDescription) setDescription(ideaDescription)
  }, [ideaName, ideaDescription])

  // Watch launch session for realtime updates (research → brief transition)
  useEffect(() => {
    if (!sessionId) return
    const session = launchSessions.find((s) => s.id === sessionId)
    if (!session) return

    if (session.status === 'brief' && step === 'research') {
      setStep('brief')
      setLoading(false)
    }
    if (session.error) {
      setError(session.error)
      setStep('describe')
      setLoading(false)
    }
  }, [launchSessions, sessionId, step])

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setStep('describe')
      setSessionId(null)
      setError('')
      setLoading(false)
      setCreatedProjectId(null)
      setName(ideaName || '')
      setDescription(ideaDescription || '')
    }
  }, [open, ideaName, ideaDescription])

  if (!open) return null

  const currentSession = launchSessions.find((s) => s.id === sessionId)
  const stepIndex = STEPS.findIndex((s) => s.key === step)

  async function startResearch() {
    if (!name.trim()) { setError('Name ist erforderlich'); return }
    setError('')
    setLoading(true)

    // Create launch session in Supabase
    const { data: row, error: dbErr } = await supabase.from('launch_sessions').insert({
      idea_id: ideaId || null,
      status: 'describe',
      name: name.trim(),
      description: description.trim(),
    }).select().single()

    if (dbErr || !row) {
      setError(dbErr?.message || 'Fehler beim Erstellen der Session')
      setLoading(false)
      return
    }

    setSessionId(row.id)
    setStep('research')

    // Trigger async research
    await fetch('/api/launch/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        launch_session_id: row.id,
        name: name.trim(),
        description: description.trim(),
      }),
    })
  }

  async function skipResearch() {
    if (!name.trim()) { setError('Name ist erforderlich'); return }
    setStep('review')
  }

  async function confirmProject() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        idea_id: ideaId || null,
        launch_session_id: sessionId || null,
        stack: (currentSession?.strategy_brief as Record<string, string>)?.stack || undefined,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setCreatedProjectId(data.id)
      setStep('created')
    } else {
      setError(data.error || 'Fehler beim Erstellen')
    }
    setLoading(false)
  }

  async function rejectProject() {
    if (sessionId) {
      await supabase.from('launch_sessions').update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      }).eq('id', sessionId)
    }
    onClose()
  }

  const research = currentSession?.research_output as Record<string, string> | undefined
  const brief = currentSession?.strategy_brief as Record<string, string> | undefined

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && step !== 'research') onClose() }}
    >
      <div
        className="ghost-card"
        style={{
          width: 640, maxHeight: '85vh', overflow: 'auto',
          padding: 32, borderRadius: 20,
          background: 'var(--el)', border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= stepIndex ? 'var(--a)' : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Rocket size={20} stroke="var(--a)" />
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)' }}>
            {step === 'created' ? 'Projekt erstellt!' : 'Launch Wizard'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--tx3)', marginLeft: 'auto' }}>
            {STEPS[stepIndex]?.label}
          </span>
        </div>

        {error && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,45,85,0.12)', color: 'var(--r)', fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Step 1: Describe */}
        {step === 'describe' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--tx3)', display: 'block', marginBottom: 6 }}>PROJEKT-NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. TennisCoach Pro"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--tx)', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--tx3)', display: 'block', marginBottom: 6 }}>BESCHREIBUNG</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibe die Idee in 2-3 Sätzen..."
                rows={4}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, resize: 'vertical',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--tx)', fontSize: 13, outline: 'none', lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                onClick={startResearch}
                disabled={loading}
                className="btn3d"
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 10,
                  background: 'var(--a)', color: '#000', fontWeight: 700, fontSize: 13,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Search size={14} /> Research starten
              </button>
              <button
                onClick={skipResearch}
                className="btn3d"
                style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--tx2)', fontWeight: 600, fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                }}
              >
                Überspringen <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Research in progress */}
        {step === 'research' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader2 size={32} stroke="var(--a)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginTop: 16 }}>
              KANI analysiert die Idee...
            </div>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 8 }}>
              Markt, Wettbewerb, Zielgruppe, Tech-Stack, Monetarisierung
            </div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 16, fontFamily: "'JetBrains Mono', monospace" }}>
              {name}
            </div>
          </div>
        )}

        {/* Step 3: Strategy Brief */}
        {step === 'brief' && research && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Zusammenfassung', value: research.summary },
              { label: 'Markt', value: research.market },
              { label: 'Wettbewerb', value: research.competition },
              { label: 'Zielgruppe', value: research.audience },
              { label: 'Tech-Stack', value: research.techStack },
              { label: 'Monetarisierung', value: research.monetization },
              { label: 'Machbarkeit', value: research.feasibility },
              { label: 'Risiken', value: research.risks },
            ].filter(r => r.value).map((r) => (
              <div key={r.label} className="ghost-card" style={{ padding: '10px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', letterSpacing: 1, marginBottom: 4 }}>{r.label.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>{r.value}</div>
              </div>
            ))}

            {research.recommendation && (
              <div
                style={{
                  padding: '12px 16px', borderRadius: 10, marginTop: 4,
                  background: research.recommendation.toString().startsWith('GO')
                    ? 'rgba(0,255,136,0.08)' : research.recommendation.toString().startsWith('STOP')
                    ? 'rgba(255,45,85,0.08)' : 'rgba(255,107,44,0.08)',
                  border: `1px solid ${research.recommendation.toString().startsWith('GO')
                    ? 'rgba(0,255,136,0.2)' : research.recommendation.toString().startsWith('STOP')
                    ? 'rgba(255,45,85,0.2)' : 'rgba(255,107,44,0.2)'}`,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', letterSpacing: 1, marginBottom: 4 }}>EMPFEHLUNG</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{research.recommendation}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                onClick={() => setStep('review')}
                className="btn3d"
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 10,
                  background: 'var(--g)', color: '#000', fontWeight: 700, fontSize: 13,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <ArrowRight size={14} /> Weiter zur Review
              </button>
              <button
                onClick={rejectProject}
                className="btn3d"
                style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: 'rgba(255,45,85,0.1)', color: 'var(--r)', fontWeight: 600, fontSize: 13,
                  border: '1px solid rgba(255,45,85,0.2)', cursor: 'pointer',
                }}
              >
                <XCircle size={14} /> Ablehnen
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review + Confirm */}
        {step === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--tx3)', display: 'block', marginBottom: 6 }}>PROJEKT-NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--tx)', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--tx3)', display: 'block', marginBottom: 6 }}>BESCHREIBUNG</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, resize: 'vertical',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--tx)', fontSize: 13, outline: 'none', lineHeight: 1.6,
                }}
              />
            </div>

            {brief?.stack && (
              <div className="ghost-card" style={{ padding: '10px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', letterSpacing: 1, marginBottom: 4 }}>TECH-STACK</div>
                <div style={{ fontSize: 12, color: 'var(--tx2)' }}>{brief.stack}</div>
              </div>
            )}

            {brief?.recommendation && (
              <div className="ghost-card" style={{ padding: '10px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', letterSpacing: 1, marginBottom: 4 }}>KANI EMPFEHLUNG</div>
                <div style={{ fontSize: 12, color: 'var(--tx2)' }}>{brief.recommendation}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                onClick={() => sessionId ? setStep('brief') : setStep('describe')}
                className="btn3d"
                style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--tx2)', fontWeight: 600, fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <ArrowLeft size={14} /> Zurück
              </button>
              <button
                onClick={confirmProject}
                disabled={loading}
                className="btn3d"
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 10,
                  background: 'var(--g)', color: '#000', fontWeight: 700, fontSize: 13,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1.5s linear infinite' }} /> : <Rocket size={14} />}
                Projekt erstellen
              </button>
              <button
                onClick={rejectProject}
                className="btn3d"
                style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: 'rgba(255,45,85,0.1)', color: 'var(--r)', fontWeight: 600, fontSize: 13,
                  border: '1px solid rgba(255,45,85,0.2)', cursor: 'pointer',
                }}
              >
                <XCircle size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Created */}
        {step === 'created' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle size={48} stroke="var(--g)" style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.4))' }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', marginTop: 16 }}>
              {name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 6 }}>
              Projekt wurde erstellt und ist bereit für Phase 0
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
              <button
                onClick={() => { onClose(); navigate(`/project/${createdProjectId}`) }}
                className="btn3d"
                style={{
                  padding: '10px 24px', borderRadius: 10,
                  background: 'var(--a)', color: '#000', fontWeight: 700, fontSize: 13,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Projekt öffnen <ArrowRight size={14} />
              </button>
              <button
                onClick={onClose}
                className="btn3d"
                style={{
                  padding: '10px 24px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--tx2)', fontWeight: 600, fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                }}
              >
                Schließen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
