interface WaveChartProps {
  color?: string;
  height?: number;
  className?: string;
}

export function WaveChart({ color = '#00F0FF', height = 80, className = '' }: WaveChartProps) {
  const w = 800;
  const generateWave = (amplitude: number, frequency: number, phase: number) => {
    const points: string[] = [];
    for (let x = 0; x <= w * 2; x += 4) {
      const y = height / 2 + amplitude * Math.sin((x * frequency * Math.PI) / w + phase);
      points.push(`${x},${y}`);
    }
    return `${points.join(' ')} ${w * 2},${height} 0,${height}`;
  };

  return (
    <div className={`overflow-hidden ${className}`} style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <polygon
          points={generateWave(height * 0.2, 2, 0)}
          fill={color}
          fillOpacity="0.03"
          className="animate-wave"
        />
        <polygon
          points={generateWave(height * 0.15, 3, 1)}
          fill={color}
          fillOpacity="0.06"
          className="animate-wave"
          style={{ animationDuration: '8s', animationDirection: 'reverse' }}
        />
        <polygon
          points={generateWave(height * 0.1, 4, 2)}
          fill={color}
          fillOpacity="0.1"
          className="animate-wave"
          style={{ animationDuration: '4s' }}
        />
      </svg>
    </div>
  );
}
