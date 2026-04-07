import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface PipelineMilestone {
  title: string
  status: 'done' | 'active' | 'upcoming'
  color: string
  glow: string
  items: string[]
}

interface PipelineProps {
  label: string
  milestones: PipelineMilestone[]
  summary: string
}

export function Pipeline({ label, milestones, summary }: PipelineProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ margin: '16px 26px 0', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
      {/* Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0' }}>
        <span className="st" style={{ fontSize: 9 }}>{label}</span>
        <div className="pl-track in">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`pl-seg ${m.status === 'active' ? 'active' : ''}`}
              style={{
                flex: 1,
                background: m.status === 'upcoming' ? 'var(--tx3)' : m.color,
                opacity: m.status === 'upcoming' ? 0.12 : m.status === 'active' ? 0.6 : 1,
                boxShadow: m.status === 'active' ? `0 0 12px ${m.glow}` : 'none',
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>
          {summary}
        </span>
        {open ? <ChevronUp size={14} stroke="var(--tx3)" /> : <ChevronDown size={14} stroke="var(--tx3)" />}
      </div>

      {/* Expanded milestones */}
      {open && (
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '12px 0' }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, minWidth: 160 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                background: m.status === 'upcoming' ? 'var(--tx3)' : m.color,
                opacity: m.status === 'upcoming' ? 0.4 : 1,
                boxShadow: m.status !== 'upcoming' ? `0 0 6px ${m.glow}` : 'none',
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: m.status === 'upcoming' ? 'var(--tx)' : m.color,
                }}>
                  {m.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
                  {m.items.map((item, j) => (
                    <div key={j}>● {item}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
