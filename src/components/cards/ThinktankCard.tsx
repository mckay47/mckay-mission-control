export default function ThinktankCard() {
  return (
    <div className="card thinktank">
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-icon pink" />
          <span className="card-title">THINKTANK</span>
        </div>
        <div className="pills">
          <div className="pill">
            <span className="pill-dot" style={{ background: 'var(--cyan)' }} />
            <span style={{ color: 'var(--cyan)' }}>4</span> Research
          </div>
          <div className="pill">
            <span className="pill-dot" style={{ background: 'var(--green)' }} />
            <span style={{ color: 'var(--green)' }}>2</span> Ready
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 12, padding: '16px 18px', alignItems: 'stretch' }}>
        <textarea
          placeholder="Neue Idee eingeben... KANI analysiert automatisch"
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 14px',
            color: 'var(--text-primary)',
            fontSize: 11,
            fontFamily: 'var(--font-ui)',
            resize: 'none',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--pink)'
            e.currentTarget.style.boxShadow = '0 0 20px var(--pink-glow)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            background: 'linear-gradient(135deg, var(--pink), var(--purple))',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            boxShadow: '0 0 20px var(--pink-glow)',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 35px var(--pink-glow), 0 0 60px var(--purple-glow)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px var(--pink-glow)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Analyze
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
