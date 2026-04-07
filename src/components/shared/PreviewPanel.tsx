import type { ReactNode } from 'react'
import { StatusLed } from '../ui/StatusLed.tsx'

interface Tab {
  label: string
  content: ReactNode
}

interface PreviewPanelProps {
  title: string
  ledColor: string
  ledGlow: string
  badge?: { label: string; bg: string; color: string }
  pipeline?: ReactNode
  tabs: Tab[]
  activeTab: number
  onTabChange: (i: number) => void
  accentColor?: string
  footer?: ReactNode
  headerAction?: ReactNode
}

export function PreviewPanel({ title, ledColor, ledGlow, badge, pipeline, tabs, activeTab, onTabChange, accentColor, footer, headerAction }: PreviewPanelProps) {
  const accent = accentColor || 'var(--bl)'

  return (
    <>
      <div className="st" style={{ marginBottom: 16, padding: '0 2px' }}>
        {title.includes('Preview') ? title.toUpperCase().replace('PREVIEW', 'Preview') : title + ' Preview'}
      </div>
      <div className="preview" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusLed color={ledColor} glow={ledGlow} animate />
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {headerAction}
            {badge && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            )}
          </div>
        </div>

        {pipeline}

        <div style={{ display: 'flex', gap: 2, padding: '16px 26px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {tabs.map((t, i) => (
            <button
              key={i}
              className={`tab ${i === activeTab ? 'active' : ''}`}
              onClick={() => onTabChange(i)}
              style={i === activeTab ? { color: accent, background: `${accent}11` } as React.CSSProperties : undefined}
            >
              {t.label}
              {i === activeTab && <span style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: accent, borderRadius: 2 }} />}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: '22px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tabs[activeTab]?.content}
        </div>

        {footer}
      </div>
    </>
  )
}

export function TcLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>{children}</div>
}

export function TcText({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6, ...style }}>{children}</div>
}

export function TcStatRow({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', gap: 14 }}>{children}</div>
}

export function TcStat({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="ghost-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '14px 18px', borderRadius: 14, flex: 1, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{label}</div>
    </div>
  )
}
