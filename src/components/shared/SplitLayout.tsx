import type { ReactNode } from 'react'

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
  ratio?: string
}

export function SplitLayout({ left, right, ratio = '55% 45%' }: SplitLayoutProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: ratio, gap: 28, flex: 1, minHeight: 0 }}>
      <div style={{ overflowY: 'auto', padding: '4px 4px 4px 2px' }}>
        {left}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {right}
      </div>
    </div>
  )
}
