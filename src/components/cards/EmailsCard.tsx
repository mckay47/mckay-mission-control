export default function EmailsCard() {
  return (
    <div className="card emails">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon orange" /><span className="card-title">E-MAILS</span></div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        gap: 10,
      }}>
        {/* Mail icon */}
        <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>

        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Gmail nicht verbunden</span>
        <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>Integration in Phase F</span>

        <button
          disabled
          style={{
            marginTop: 6,
            padding: '7px 16px',
            borderRadius: 8,
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--text-muted)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          Gmail verbinden
        </button>
      </div>
    </div>
  )
}
