export const colors = {
  bg: { primary: '#0A0A0F', elevated: '#0F0F18', surface: '#14142B' },
  glass: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)' },
  neon: {
    cyan: '#00F0FF',
    orange: '#FF6B2C',
    pink: '#FF2DAA',
    green: '#00FF88',
    purple: '#8B5CF6',
    yellow: '#FFD600',
  },
  status: {
    healthy: '#00FF88',
    attention: '#FFD600',
    risk: '#FF6B2C',
    critical: '#FF2D55',
  },
  text: { primary: '#F0F0F5', secondary: '#8888AA', muted: '#555577' },
} as const;

export const fonts = {
  sans: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export type NeonColor = keyof typeof colors.neon;
export type StatusColor = keyof typeof colors.status;
