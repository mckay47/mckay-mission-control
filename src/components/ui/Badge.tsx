interface BadgeProps {
  text: string
  colorClass: string
  style?: React.CSSProperties
}

export default function Badge({ text, colorClass, style }: BadgeProps) {
  return <span className={`bdg ${colorClass}`} style={style}>{text}</span>
}
