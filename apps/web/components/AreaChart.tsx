type Point = { label: string; value: number };

/** Lightweight dependency-free SVG area chart. */
export function AreaChart({
  data,
  height = 220,
  color = "var(--accent)",
}: {
  data: Point[];
  height?: number;
  color?: string;
}) {
  const width = 720;
  const padX = 8;
  const padTop = 16;
  const padBottom = 26;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const pts = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + innerH - (d.value / max) * innerH,
  }));

  const line = smoothPath(pts);
  const area = `${line} L ${padX + innerW} ${padTop + innerH} L ${padX} ${padTop + innerH} Z`;

  const gridLines = [0.25, 0.5, 0.75].map((f) => padTop + innerH * f);
  const labelEvery = Math.max(1, Math.ceil(data.length / 7));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Clicks over time"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {gridLines.map((y) => (
        <line key={y} x1={padX} x2={width - padX} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      ))}
      <line
        x1={padX}
        x2={width - padX}
        y1={padTop + innerH}
        y2={padTop + innerH}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />

      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" />

      {pts.length <= 40 &&
        pts.map((p, i) =>
          data[i]!.value > 0 ? (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" stroke={color} strokeWidth="2" />
          ) : null,
        )}

      {data.map((d, i) =>
        i % labelEvery === 0 ? (
          <text
            key={i}
            x={padX + i * stepX}
            y={height - 8}
            fontSize="10.5"
            fill="var(--text-3)"
            textAnchor="middle"
          >
            {d.label}
          </text>
        ) : null,
      )}

      <text x={width - padX} y={padTop - 4} fontSize="10.5" fill="var(--text-3)" textAnchor="end">
        max {max}
      </text>
    </svg>
  );
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!;
    const cur = pts[i]!;
    const cx = (prev.x + cur.x) / 2;
    d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`;
  }
  return d;
}
