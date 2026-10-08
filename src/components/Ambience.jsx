import { Cobweb } from './Ornaments'

// Deterministic "random" positions so motes don't jump between renders.
const MOTES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 2 + (i % 3),
  duration: 9 + (i % 7) * 2,
  delay: -((i * 1.7) % 12),
}))

const BATS = [
  { top: 14, duration: 22, delay: 2, scale: 1 },
  { top: 22, duration: 28, delay: 9, scale: 0.7 },
  { top: 9, duration: 34, delay: 17, scale: 0.55 },
]

function Bat() {
  return (
    <svg viewBox="0 0 60 24" width="60" height="24">
      <path
        className="bat-wings"
        d="M30 8 C26 2 18 0 8 4 C12 6 12 9 10 12 C14 10 18 11 20 14 C22 11 26 11 30 16 C34 11 38 11 40 14 C42 11 46 10 50 12 C48 9 48 6 52 4 C42 0 34 2 30 8 Z"
        fill="#0b0610"
      />
      <circle cx="28" cy="9" r="0.9" fill="#c94f4f" />
      <circle cx="32" cy="9" r="0.9" fill="#c94f4f" />
    </svg>
  )
}

export default function Ambience() {
  return (
    <div className="ambience" aria-hidden="true">
      <Cobweb className="cobweb-tl" />
      <Cobweb className="cobweb-tr" />

      <div className="spider">
        <span className="spider-thread" />
        <svg viewBox="0 0 40 40" width="34" height="34" className="spider-body">
          <g stroke="#0b0610" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M16 18 L6 10 L2 16 M16 21 L4 20 L0 26 M16 24 L6 28 L4 36 M17 26 L10 34 L10 40" />
            <path d="M24 18 L34 10 L38 16 M24 21 L36 20 L40 26 M24 24 L34 28 L36 36 M23 26 L30 34 L30 40" />
          </g>
          <ellipse cx="20" cy="24" rx="6" ry="7" fill="#0b0610" />
          <circle cx="20" cy="15" r="4" fill="#0b0610" />
          <circle cx="18.5" cy="14.5" r="0.9" fill="#c9a7ff" />
          <circle cx="21.5" cy="14.5" r="0.9" fill="#c9a7ff" />
        </svg>
      </div>

      {BATS.map((b, i) => (
        <div
          key={i}
          className="bat"
          style={{
            top: `${b.top}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            '--scale': b.scale,
          }}
        >
          <Bat />
        </div>
      ))}

      {MOTES.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
