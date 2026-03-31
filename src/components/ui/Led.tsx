interface LedProps {
  color: string
  style?: React.CSSProperties
}

export default function Led({ color, style }: LedProps) {
  return <span className={`led ${color}`} style={style} />
}
