import { useTimer, useClock } from '../../hooks/useTimer'

export default function Header() {
  const timer = useTimer(2 * 3600 + 34 * 60 + 12)
  const clock = useClock()

  return (
    <div className="header">
      <div className="logo-group">
        <div className="logo">
          <div className="logo-ring outer" />
          <div className="logo-ring inner" />
          <div className="logo-core">
            <svg viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
          </div>
        </div>
        <span className="brand">MCKAY</span>
      </div>

      <div className="nav-pills">
        <div className="nav-pill">
          <div className="nav-pill-icon green">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
          </div>
          <span className="nav-pill-value">4</span>
          <span className="nav-pill-label">Autopilot</span>
        </div>
        <div className="nav-pill badge-dot" data-count="2">
          <div className="nav-pill-icon orange">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <span className="nav-pill-value" style={{ color: 'var(--orange)' }}>2</span>
          <span className="nav-pill-label">Attention</span>
        </div>
        <div className="nav-pill">
          <div className="nav-pill-icon purple">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <span className="nav-pill-value">5</span>
          <span className="nav-pill-label">Agents</span>
        </div>
        <div className="nav-pill badge-dot" data-count="12">
          <div className="nav-pill-icon cyan">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /></svg>
          </div>
          <span className="nav-pill-value">12</span>
          <span className="nav-pill-label">E-Mails</span>
        </div>
      </div>

      <div className="header-spacer" />

      <div className="capture-btn">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        <span>Capture</span>
        <kbd>{'\u2318'}K</kbd>
      </div>

      <div className={`work-timer${timer.running ? '' : ' paused'}`}>
        <div className="timer-indicator">
          <span className="timer-dot" />
          <span className="timer-label">{timer.running ? 'Active' : 'Paused'}</span>
        </div>
        <span className="timer-time">{timer.display}</span>
        <button className="timer-btn" onClick={timer.toggle}>
          {timer.running ? (
            <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          )}
        </button>
      </div>

      <div className="analog-clock">
        <div className="clock-hand hour" style={{ transform: `rotate(${clock.hourDeg}deg)` }} />
        <div className="clock-hand minute" style={{ transform: `rotate(${clock.minuteDeg}deg)` }} />
        <div className="clock-hand second" style={{ transform: `rotate(${clock.secondDeg}deg)` }} />
        <div className="clock-center" />
      </div>
    </div>
  )
}
