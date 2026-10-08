// Small shared decorative pieces used across sections.

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <span className="divider-glyph">✦ ☾ ✦</span>
      <span className="divider-line" />
    </div>
  )
}

export function SectionTitle({ eyebrow, children }) {
  return (
    <header className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{children}</h2>
      <Divider />
    </header>
  )
}

export function Candle({ height = 70, delay = 0 }) {
  return (
    <svg
      className="candle"
      viewBox={`0 0 40 ${height + 40}`}
      width="40"
      height={height + 40}
      aria-hidden="true"
      style={{ animationDelay: `${delay}s` }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="candle-glow" cx="20" cy="22" r="20" fill="url(#glow)" />
      <path
        className="candle-flame"
        d="M20 6 C26 16 25 24 20 30 C15 24 14 16 20 6 Z"
        fill="#ffcf6b"
      />
      <path d="M20 16 C22 21 22 25 20 28 C18 25 18 21 20 16 Z" fill="#fff4d0" />
      <line x1="20" y1="28" x2="20" y2="34" stroke="#2a1d14" strokeWidth="1.5" />
      <rect x="10" y="34" width="20" height={height} rx="2" fill="#e8dcc2" />
      <path d={`M12 34 q2 10 0 18 M27 34 q1 6 0 12`} stroke="#d6c7a8" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Cobweb({ className = '' }) {
  const spokes = [0, 18, 36, 54, 72, 90]
  const rings = [30, 60, 95, 135]
  const pt = (r, deg) => {
    const a = (deg * Math.PI) / 180
    return [r * Math.cos(a), r * Math.sin(a)]
  }
  return (
    <svg className={`cobweb ${className}`} viewBox="0 0 160 160" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.8" fill="none">
        {spokes.map((deg) => {
          const [x, y] = pt(160, deg)
          return <line key={deg} x1="0" y1="0" x2={x} y2={y} />
        })}
        {rings.map((r) => (
          <path
            key={r}
            d={spokes
              .map((deg, i) => {
                const [x, y] = pt(r, deg)
                if (i === 0) return `M${x} ${y}`
                const [px, py] = pt(r * 0.86, deg - 9)
                return `Q${px} ${py} ${x} ${y}`
              })
              .join(' ')}
          />
        ))}
      </g>
    </svg>
  )
}

export function Moon({ phase }) {
  // phase: -1 (new) .. 0 (full) .. 1 (new) — offset of the shadow circle
  const offset = phase * 24
  const id = `moon-${String(phase).replace('.', '_').replace('-', 'n')}`
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="white" />
          {phase !== 0 && <circle cx={12 + offset} cy="12" r="10" fill="black" />}
        </mask>
      </defs>
      <circle cx="12" cy="12" r="10" fill="#2a1f36" />
      <circle cx="12" cy="12" r="10" fill="#e8dcc2" mask={`url(#${id})`} />
    </svg>
  )
}
