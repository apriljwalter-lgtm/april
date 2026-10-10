import { useRef, useState } from 'react'
import { profile } from '../data/profile'
import { SectionTitle } from './Ornaments'

function Vinyl({ band, className = '' }) {
  return (
    <div className={`vinyl ${className}`} style={{ '--label': band.label }}>
      <div className="vinyl-label">
        <span>{band.name}</span>
      </div>
    </div>
  )
}

// Top-down turntable on a 400×320 plinth. The platter is centered at (165, 160).
function Deck({ playing }) {
  return (
    <svg viewBox="0 0 400 320" className="deck-art" aria-hidden="true">
      <defs>
        <linearGradient id="walnut" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a3a22" />
          <stop offset="0.5" stopColor="#3f2716" />
          <stop offset="1" stopColor="#2c1a0e" />
        </linearGradient>
        <radialGradient id="chrome" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#f1ece2" />
          <stop offset="0.6" stopColor="#9a948a" />
          <stop offset="1" stopColor="#4c4842" />
        </radialGradient>
      </defs>

      {/* walnut plinth with a little grain */}
      <rect x="2" y="2" width="396" height="316" rx="14" fill="url(#walnut)" stroke="#b8954a" strokeOpacity="0.5" />
      <g stroke="#000" strokeOpacity="0.18" fill="none">
        <path d="M10 40 C120 30 260 52 390 38" />
        <path d="M10 120 C140 110 250 136 390 118" />
        <path d="M10 214 C120 226 280 200 390 220" />
        <path d="M10 290 C150 280 260 300 390 288" />
      </g>

      {/* platter, strobe dots, felt mat */}
      <circle cx="165" cy="160" r="140" fill="#1a1a1c" />
      <circle cx="165" cy="160" r="138" fill="url(#chrome)" />
      <g className={`strobe ${playing ? 'is-spinning' : ''}`}>
        <circle cx="165" cy="160" r="134" fill="none" stroke="#2a2a2c" strokeWidth="5" strokeDasharray="2 3.2" />
      </g>
      <circle cx="165" cy="160" r="130" fill="#141215" />
      <circle cx="165" cy="160" r="4" fill="url(#chrome)" />

      {/* speed selector + power lamp */}
      <circle cx="34" cy="284" r="16" fill="url(#chrome)" />
      <path d="M34 270 v8" stroke="#3a3330" strokeWidth="3" strokeLinecap="round" />
      <text x="34" y="312" textAnchor="middle" fontSize="9" fill="#e8dcc2" fontFamily="IM Fell English, serif">
        33⅓
      </text>
      <circle cx="34" cy="246" r="4.5" className={`lamp ${playing ? 'is-on' : ''}`} />
    </svg>
  )
}

function Tonearm({ playing }) {
  return (
    <svg viewBox="0 0 400 320" className="deck-arm" aria-hidden="true">
      <circle cx="350" cy="50" r="22" fill="#26201c" stroke="#b8954a" strokeOpacity="0.5" />
      <g className={`arm ${playing ? 'is-down' : ''}`}>
        <rect x="380" y="34" width="14" height="32" rx="3" fill="#3a3330" /> {/* counterweight */}
        <path d="M350 50 L350 250 L338 274" stroke="url(#chrome)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M350 50 H382" stroke="url(#chrome)" strokeWidth="5" strokeLinecap="round" />
        <rect x="326" y="268" width="22" height="14" rx="2" transform="rotate(-25 337 275)" fill="#2b2522" stroke="#9a948a" />
      </g>
      <circle cx="350" cy="50" r="9" fill="url(#chrome)" />
      {/* arm rest */}
      <rect x="357" y="222" width="9" height="22" rx="3" fill="#2b2522" />
    </svg>
  )
}

export default function Music() {
  const { bands } = profile
  const [playing, setPlaying] = useState(null)
  const [drag, setDrag] = useState(null)
  const platterRef = useRef(null)

  const overPlatter = (x, y) => {
    const r = platterRef.current?.getBoundingClientRect()
    if (!r) return false
    return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) < r.width * 0.6
  }

  const startDrag = (e, name, from) => {
    if (e.button !== 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({
      name,
      from,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      size: rect.width,
      moved: false,
      over: false,
    })
  }

  const moveDrag = (e) => {
    if (!drag) return
    setDrag({
      ...drag,
      x: e.clientX,
      y: e.clientY,
      moved: drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 6,
      over: overPlatter(e.clientX, e.clientY),
    })
  }

  const endDrag = () => {
    if (!drag) return
    if (!drag.moved) {
      // A plain tap: crate records go on the deck, the deck's record comes off.
      setPlaying(drag.from === 'crate' ? drag.name : null)
    } else if (drag.over) {
      setPlaying(drag.name)
    } else if (drag.from === 'deck') {
      setPlaying(null)
    }
    setDrag(null)
  }

  const dragProps = (name, from) => ({
    onPointerDown: (e) => startDrag(e, name, from),
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onPointerCancel: () => setDrag(null),
    // Keyboard users: Enter/Space toggles (pointer clicks are handled above, detail > 0).
    onClick: (e) => e.detail === 0 && setPlaying(from === 'crate' ? name : null),
  })

  const nowPlaying = bands.find((b) => b.name === playing)
  const dragged = drag?.moved && bands.find((b) => b.name === drag.name)

  return (
    <section className="section" id="music">
      <SectionTitle eyebrow="Chapter V">Hymns for the Haunted</SectionTitle>
      <p className="section-intro">The bands on heavy rotation. Drag a record onto the turntable to drop the needle.</p>

      <div className="listening-room">
        <ul className="crate" aria-label="Record crate">
          {bands.map((band) => (
            <li className="record" key={band.name}>
              {band.name === playing ? (
                <div className="sleeve" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  className={`record-btn ${drag?.moved && drag.name === band.name ? 'is-lifted' : ''}`}
                  aria-label={`Play ${band.name}`}
                  {...dragProps(band.name, 'crate')}
                >
                  <Vinyl band={band} />
                </button>
              )}
              <p className="record-name">{band.name}</p>
            </li>
          ))}
        </ul>

        <div className="turntable">
          <div className={`deck ${drag?.moved && drag.over ? 'is-target' : ''}`}>
            <Deck playing={!!nowPlaying} />
            <div className="platter-slot" ref={platterRef}>
              {nowPlaying && (
                <button
                  type="button"
                  className={`record-btn on-deck ${drag?.moved && drag.from === 'deck' ? 'is-lifted' : ''}`}
                  aria-label={`Stop ${nowPlaying.name}`}
                  {...dragProps(nowPlaying.name, 'deck')}
                >
                  <Vinyl band={nowPlaying} className="is-spinning" key={nowPlaying.name} />
                </button>
              )}
            </div>
            <Tonearm playing={!!nowPlaying} />
          </div>
          <p className="now-playing" aria-live="polite">
            {nowPlaying ? (
              <>
                Now spinning: <strong>{nowPlaying.name}</strong>
              </>
            ) : (
              'The needle waits…'
            )}
          </p>
        </div>
      </div>

      {dragged && (
        <div
          className="vinyl-ghost"
          style={{ left: drag.x - drag.dx, top: drag.y - drag.dy, width: drag.size }}
          aria-hidden="true"
        >
          <Vinyl band={dragged} />
        </div>
      )}
    </section>
  )
}
