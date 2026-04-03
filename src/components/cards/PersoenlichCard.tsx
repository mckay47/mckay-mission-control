export default function PersoenlichCard() {
  return (
    <div className="card persoenlich">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon pink" /><span className="card-title">PERS{'\u00d6'}NLICH</span></div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 10, overflow: 'hidden' }}>
        {/* 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {/* Private Todos — empty state */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            padding: 12,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                background: 'rgba(255,45,170,0.12)',
                color: 'var(--pink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: 1 }}>Private Todos</span>
            </div>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Keine privaten Todos</span>
            </div>
          </div>

          {/* Health — empty state */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            padding: 12,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                background: 'rgba(239,68,68,0.12)',
                color: 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: 1 }}>Health</span>
            </div>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>Health-Tracking nicht verbunden</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
