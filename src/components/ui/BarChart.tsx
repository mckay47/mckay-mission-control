interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  className?: string;
}

export function BarChart({ data, height = 120, className = '' }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((d, i) => {
        const barH = (d.value / max) * 100;
        const c = d.color || '#00F0FF';
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] tabular-nums text-text-muted">{d.value}</span>
            <div className="w-full relative" style={{ height: height - 30 }}>
              <div
                className="absolute bottom-0 w-full rounded-t animate-bar-grow"
                style={{
                  height: `${barH}%`,
                  background: `linear-gradient(to top, ${c}33, ${c}aa)`,
                  boxShadow: `0 0 12px ${c}33`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </div>
            <span className="text-[9px] text-text-muted truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
