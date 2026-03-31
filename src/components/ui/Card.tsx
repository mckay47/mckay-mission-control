import type { ReactNode, CSSProperties, MouseEvent } from 'react'

interface CardProps {
  title: string
  badge: string
  badgeClass: string
  scan?: boolean
  style?: CSSProperties
  onClick?: (e: MouseEvent) => void
  children: ReactNode
  className?: string
  id?: string
}

export default function Card({ title, badge, badgeClass, scan, style, onClick, children, className, id }: CardProps) {
  return (
    <div className={`card${className ? ' ' + className : ''}`} id={id} style={style} onClick={onClick}>
      {scan && <div className="scanl" />}
      <div className="ch">
        <span className="ct">{title}</span>
        <span className={`bdg ${badgeClass}`}>{badge}</span>
      </div>
      <div className="cb">
        {children}
      </div>
    </div>
  )
}
