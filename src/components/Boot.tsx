import { useState, useRef, useCallback } from 'react'

interface BootProps {
  onComplete: () => void
}

export default function Boot({ onComplete }: BootProps) {
  const [phase, setPhase] = useState(0)
  const icoRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const altRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const surrRef = useRef<HTMLDivElement>(null)
  const statRef = useRef<HTMLDivElement>(null)
  const innRef = useRef<HTMLDivElement>(null)
  const bootRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef(0)

  const launchDash = useCallback(() => {
    const boot = bootRef.current
    if (!boot) return
    boot.style.opacity = '0'
    boot.style.transform = 'scale(1.045)'
    setTimeout(() => {
      onComplete()
    }, 820)
  }, [onComplete])

  const verifiedPhase = useCallback(() => {
    phaseRef.current = 2
    setPhase(2)
    const ico = icoRef.current
    const main = mainRef.current
    const sub = subRef.current
    const glow = glowRef.current
    const surr = surrRef.current
    const stat = statRef.current
    if (!ico || !main || !sub || !glow || !surr || !stat) return

    glow.style.background = 'radial-gradient(circle,rgba(0,220,130,0.44),transparent 65%)'
    surr.style.boxShadow = '0 32px 90px rgba(0,0,0,0.85),0 12px 32px rgba(0,0,0,0.65),inset 0 2px 4px rgba(255,255,255,0.065),0 0 90px rgba(0,220,130,0.22)'
    ico.textContent = '\u2726'
    ico.style.color = 'rgba(0,232,140,0.96)'
    ico.style.filter = 'drop-shadow(0 0 26px rgba(0,232,140,1))'
    ico.style.transform = 'scale(1)'
    main.textContent = 'VERIFIED!'
    main.style.color = 'rgba(0,232,140,0.92)'
    main.style.textShadow = '0 0 24px rgba(0,232,140,0.45)'
    sub.textContent = 'ACCESS GRANTED'
    sub.style.color = 'rgba(0,232,140,0.5)'
    sub.style.letterSpacing = '0.32em'
    stat.style.opacity = '1'
    setTimeout(launchDash, 2600)
  }, [launchDash])

  const scanPhase = useCallback(() => {
    phaseRef.current = 1
    setPhase(1)
    const ico = icoRef.current
    const main = mainRef.current
    const sub = subRef.current
    const alt = altRef.current
    const glow = glowRef.current
    const surr = surrRef.current
    if (!ico || !main || !sub || !alt || !glow || !surr) return

    alt.style.opacity = '0'
    glow.style.background = 'radial-gradient(circle,rgba(255,180,0,0.38),transparent 70%)'
    glow.style.opacity = '1'
    surr.style.boxShadow = '0 32px 90px rgba(0,0,0,0.85),0 12px 32px rgba(0,0,0,0.65),inset 0 2px 4px rgba(255,255,255,0.065),0 0 70px rgba(255,160,0,0.18)'
    ico.textContent = '\u2b21'
    ico.style.color = 'rgba(255,180,0,0.92)'
    ico.style.filter = 'drop-shadow(0 0 14px rgba(255,180,0,0.9))'
    main.textContent = 'SCANNING'
    main.style.color = 'rgba(255,205,80,0.94)'
    sub.textContent = 'BIOMETRIC VERIFY'
    sub.style.color = 'rgba(255,180,0,0.48)'

    let c = 0
    const iv = setInterval(() => {
      c++
      ico.style.transform = c % 2 ? 'scale(1.14)' : 'scale(1)'
      if (c >= 6) {
        clearInterval(iv)
        verifiedPhase()
      }
    }, 290)
  }, [verifiedPhase])

  const bootTap = useCallback(() => {
    if (phaseRef.current === 0) {
      scanPhase()
    } else if (phaseRef.current === 2) {
      launchDash()
    }
  }, [scanPhase, launchDash])

  const handleMouseDown = () => {
    if (innRef.current) innRef.current.style.transform = 'scale(0.966)'
  }
  const handleMouseUp = () => {
    if (innRef.current) innRef.current.style.transform = ''
  }

  return (
    <div id="boot" ref={bootRef}>
      {/* Ambient background orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '18%', left: '20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,200,232,0.045),transparent 70%)', animation: 'float 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '16%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,232,136,0.03),transparent 70%)', animation: 'float 13s ease-in-out 4s infinite' }} />
      </div>

      <div className="blogo">MCKAY.OPERATING.SYSTEM</div>

      <div
        id="bsurr"
        ref={surrRef}
        onClick={bootTap}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="bpr" style={{ inset: -16 }} />
        <div className="bpr" style={{ inset: -32, animationDelay: '0.9s' }} />
        <div id="binn" ref={innRef}>
          <div id="bglow" ref={glowRef} />
          <div id="bico" ref={icoRef}>{phase === 0 ? '\u25fb' : phase === 1 ? '\u2b21' : '\u2726'}</div>
          <div id="bmain" ref={mainRef}>VERIFY</div>
          <div id="bsub" ref={subRef}>PASSKEY REQUIRED</div>
        </div>
      </div>

      <div id="balt" ref={altRef} onClick={bootTap}>Login with credentials</div>

      <div id="bstat" ref={statRef}>
        <span className="rdot" />
        <span>ACCESS GRANTED</span>
      </div>

      <div className="bfoot">
        <div className="bfl">Made by MCKAY</div>
        <div className="bfr">
          <span className="rdot" />
          System Ready
        </div>
      </div>
    </div>
  )
}
