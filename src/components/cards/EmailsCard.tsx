import { useState } from 'react'

const TABS = [
  { id: 'privat', label: 'Privat', count: 8, color: 'var(--orange)', hasUnread: true },
  { id: 'hebammen', label: 'Hebammen', count: 3, color: 'var(--green)', hasUnread: false },
  { id: 'projekte', label: 'Projekte', count: 1, color: 'var(--purple)', hasUnread: false },
]

const EMAILS: Record<string, { sender: string; avatar: string; avatarGrad: string; subject: string; preview: string; time: string; unread: boolean }[]> = {
  privat: [
    { sender: 'Support', avatar: 'S', avatarGrad: 'linear-gradient(135deg, var(--orange), #FF8F5C)', subject: 'Support Anfrage', preview: 'Ticket #4821 — Neue Anfrage von Kunde M...', time: '10m', unread: true },
    { sender: 'Kunde Schmidt', avatar: 'K', avatarGrad: 'linear-gradient(135deg, var(--blue), var(--cyan))', subject: 'Kunde Schmidt', preview: 'Vertragsentwurf wurde aktualisiert...', time: '1h', unread: true },
    { sender: 'Newsletter', avatar: 'N', avatarGrad: 'linear-gradient(135deg, var(--purple), var(--pink))', subject: 'Newsletter', preview: 'Wöchentlicher Tech-Digest KW14...', time: '3h', unread: false },
  ],
  hebammen: [
    { sender: 'Hebamme Müller', avatar: 'M', avatarGrad: 'linear-gradient(135deg, var(--green), var(--cyan))', subject: 'Terminbestätigung', preview: 'Termin für nächste Woche bestätigt...', time: '25m', unread: true },
    { sender: 'Portal', avatar: 'P', avatarGrad: 'linear-gradient(135deg, var(--green), #34D399)', subject: 'Neue Buchung', preview: 'Buchung #892 eingegangen...', time: '2h', unread: true },
    { sender: 'System', avatar: 'S', avatarGrad: 'linear-gradient(135deg, var(--green), var(--blue))', subject: 'Wochenbericht', preview: '12 neue Registrierungen diese Woche...', time: '5h', unread: false },
  ],
  projekte: [
    { sender: 'Vercel', avatar: 'V', avatarGrad: 'linear-gradient(135deg, var(--purple), var(--pink))', subject: 'Deploy erfolgreich', preview: 'mission-control — Production deploy...', time: '45m', unread: true },
  ],
}

export default function EmailsCard() {
  const [activeTab, setActiveTab] = useState('privat')
  const emails = EMAILS[activeTab] || []

  return (
    <div className="card emails">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon orange" /><span className="card-title">E-MAILS</span></div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--orange)', textShadow: '0 0 10px rgba(255,107,44,0.4)' }}>12 unread</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 12, overflow: 'hidden' }}>
        {/* Inbox Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: `1px solid ${isActive ? tab.color : 'var(--border)'}`,
                  background: isActive
                    ? `linear-gradient(135deg, ${tab.color}15 0%, transparent 100%)`
                    : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: isActive ? `${tab.color}20` : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? tab.color : 'var(--text-muted)',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: isActive ? tab.color : 'var(--text-secondary)',
                    textShadow: isActive ? `0 0 10px ${tab.color}60` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }}>{tab.count}</span>
                  <span style={{
                    fontSize: 8,
                    color: isActive ? tab.color : 'var(--text-muted)',
                    fontWeight: 500,
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }}>{tab.label}</span>
                </div>
                {tab.hasUnread && (
                  <span style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--red)',
                    boxShadow: '0 0 10px var(--red)',
                    animation: 'dotPulse 1.5s ease-in-out infinite',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Email List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
          {emails.map((email, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                background: email.unread ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.15)',
                borderLeft: email.unread ? '2px solid var(--orange)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                opacity: email.unread ? 1 : 0.6,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: email.avatarGrad,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>{email.avatar}</div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: email.unread ? 600 : 400,
                  color: email.unread ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{email.subject}</div>
                <div style={{
                  fontSize: 8,
                  color: 'var(--text-muted)',
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{email.preview}</div>
              </div>

              {/* Time */}
              <span style={{
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                flexShrink: 0,
              }}>{email.time}</span>

              {/* Unread indicator */}
              {email.unread && (
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--orange)',
                  boxShadow: '0 0 8px var(--orange)',
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
