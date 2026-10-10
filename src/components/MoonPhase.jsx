import { useEffect, useMemo, useRef, useState } from 'react'
import moonMapUrl from '../assets/moon-map.jpg'
import { elongation, illumination, moonAge, phaseFor, upcomingPhases } from '../lib/moon'
import { SectionTitle } from './Ornaments'

const DAY_MS = 86_400_000

// Decode the lunar surface map (NASA LRO, public domain) once and share its pixels.
let texturePromise
function loadTexture() {
  texturePromise ??= new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, c.width, c.height))
    }
    img.onerror = reject
    img.src = moonMapUrl
  })
  return texturePromise
}

/**
 * Ray-trace the near side of the moon onto a canvas: sample the equirectangular
 * surface map for each pixel of the disc and light it with the Lommel–Seeliger
 * law (why the real full moon looks flat rather than like a shaded ball).
 * The unlit side keeps a faint blue earthshine.
 */
function paintMoon(canvas, elong, tex) {
  const px = canvas.width
  const ctx = canvas.getContext('2d')
  const out = ctx.createImageData(px, px)
  const { data: src, width: tw, height: th } = tex
  const e = (elong * Math.PI) / 180
  const sx = Math.sin(e) // sun direction: +x lights the right limb (waxing, northern sky)
  const sz = -Math.cos(e)
  const r = px / 2

  for (let j = 0; j < px; j++) {
    const ny = (r - j - 0.5) / r
    for (let i = 0; i < px; i++) {
      const nx = (i + 0.5 - r) / r
      const d2 = nx * nx + ny * ny
      if (d2 >= 1) continue
      const nz = Math.sqrt(1 - d2)

      // Bilinear sample of the surface map; near side is centered at longitude 0.
      const u = (0.5 + Math.atan2(nx, nz) / (2 * Math.PI)) * tw - 0.5
      const v = (0.5 - Math.asin(ny) / Math.PI) * th - 0.5
      const x0 = Math.max(0, Math.floor(u))
      const y0 = Math.max(0, Math.floor(v))
      const x1 = Math.min(tw - 1, x0 + 1)
      const y1 = Math.min(th - 1, y0 + 1)
      const fx = u - x0
      const fy = v - y0
      const a = (y0 * tw + x0) * 4
      const b = (y0 * tw + x1) * 4
      const c = (y1 * tw + x0) * 4
      const d = (y1 * tw + x1) * 4

      const mu0 = nx * sx + nz * sz
      const lit = mu0 > 0 ? (2 * mu0) / (mu0 + nz) : 0
      // Soften the terminator a touch so it reads as a curved horizon, not a cut.
      const soft = Math.min(1, Math.max(0, (mu0 + 0.015) / 0.06))
      const shade = 1.05 * lit * soft
      const earth = 0.13

      const o = (j * px + i) * 4
      for (let k = 0; k < 3; k++) {
        const t =
          (src[a + k] * (1 - fx) + src[b + k] * fx) * (1 - fy) +
          (src[c + k] * (1 - fx) + src[d + k] * fx) * fy
        const tint = k === 2 ? 1.35 : k === 1 ? 1.1 : 0.95
        out.data[o + k] = Math.min(255, t * shade + t * earth * tint)
      }
      // Anti-alias the limb.
      out.data[o + 3] = Math.min(255, (1 - Math.sqrt(d2)) * r * 255 * 1.5)
    }
  }
  ctx.putImageData(out, 0, 0)
}

function Moon({ elong, size, className }) {
  const ref = useRef(null)
  const [tex, setTex] = useState(null)

  useEffect(() => {
    let live = true
    loadTexture().then((t) => live && setTex(t))
    return () => {
      live = false
    }
  }, [])

  useEffect(() => {
    if (!tex || !ref.current) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    ref.current.width = ref.current.height = Math.round(size * dpr)
    paintMoon(ref.current, elong, tex)
  }, [elong, size, tex])

  return <canvas ref={ref} className={className} style={{ width: size, height: size }} aria-hidden="true" />
}

const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

// A shadowy witch who rides across the moon while you scrub through the days.
function Witch({ offset, dir, flying }) {
  const t = (offset + 15) / 30 // 0 → 1 across the slider
  const style = {
    left: `${-12 + t * 124}%`,
    top: `${58 - Math.sin(Math.PI * t) * 46}%`,
    '--tilt': `${Math.cos(Math.PI * t) * -14 * dir}deg`,
    '--face': dir,
  }
  return (
    <div className={`witch ${flying ? 'is-flying' : ''}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 120 80" className="witch-art">
        <g className="witch-bob">
          {/* broom */}
          <path d="M18 57 L116 49" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 50 Q12 52 22 54 L22 61 Q10 64 -2 70 Q6 62 0 50 Z" />
          <path d="M3 54 L20 57 M2 63 L20 59" stroke="#2a1f36" strokeWidth="1" />
          {/* cape and hair streaming behind */}
          <path className="witch-cape" d="M56 31 Q38 32 24 44 Q36 44 32 52 Q42 46 48 51 Q46 42 58 38 Z" />
          <path className="witch-cape" d="M65 21 Q54 20 46 27 Q55 25 62 28 Z" />
          {/* body, arm, leg and boot */}
          <path d="M48 56 Q46 40 56 30 Q64 26 70 32 Q74 44 71 55 Z" />
          <path d="M66 36 Q76 42 88 49" stroke="currentColor" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M60 55 L73 60 L71 67 L78 68" stroke="currentColor" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* head, nose, and a hat with a crooked tip */}
          <circle cx="70" cy="24" r="6" />
          <path d="M75 23 L83 27 L75 27.5 Z" />
          <ellipse cx="68" cy="18.5" rx="13" ry="2.6" transform="rotate(-8 68 18.5)" />
          <path d="M59 18 L77 16 Q68 8 50 1 Q60 9 59 18 Z" />
        </g>
      </svg>
    </div>
  )
}

export default function MoonPhase() {
  const [now, setNow] = useState(() => new Date())
  const [offset, setOffset] = useState(0) // days scrubbed away from tonight
  const [flight, setFlight] = useState({ dir: 1, flying: false })
  const landTimer = useRef(0)

  const scrubTo = (next) => {
    if (next === offset) return
    setFlight({ dir: next > offset ? 1 : -1, flying: true })
    clearTimeout(landTimer.current)
    landTimer.current = setTimeout(() => setFlight((f) => ({ ...f, flying: false })), 1300)
    setOffset(next)
  }

  useEffect(() => () => clearTimeout(landTimer.current), [])

  // Keep "tonight" fresh if the page is left open.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10 * 60_000)
    return () => clearInterval(id)
  }, [])

  const when = useMemo(() => new Date(now.getTime() + offset * DAY_MS), [now, offset])
  const elong = elongation(when)
  const phase = phaseFor(elong)
  const lit = illumination(elong)
  const upcoming = useMemo(() => upcomingPhases(now), [now])

  return (
    <section className="section" id="moon">
      <SectionTitle eyebrow="Chapter VII">The Moon Tonight</SectionTitle>
      <p className="section-intro">Calculated live from where the moon really is right now.</p>

      <div className="moon-layout">
        <figure className="moon-figure" style={{ '--glow': (0.15 + lit * 0.55).toFixed(2) }}>
          <Moon elong={elong} size={300} className="moon-canvas" />
          <Witch offset={offset} dir={flight.dir} flying={flight.flying} />
        </figure>

        <div className="moon-info" aria-live="polite">
          <p className="moon-when">{offset === 0 ? 'Tonight' : fmtDate(when)}</p>
          <h3 className="moon-name">{phase.name}</h3>
          <p className="moon-lore">{phase.lore}</p>
          <dl className="moon-stats">
            <div>
              <dt>Illuminated</dt>
              <dd>{Math.round(lit * 100)}%</dd>
            </div>
            <div>
              <dt>Moon age</dt>
              <dd>{moonAge(elong).toFixed(1)} days</dd>
            </div>
          </dl>

          <label className="moon-scrub">
            <span>Wander through the cycle</span>
            <input
              type="range"
              min={-15}
              max={15}
              step={0.25}
              value={offset}
              onChange={(e) => scrubTo(Number(e.target.value))}
            />
          </label>
          <button type="button" className="moon-reset" onClick={() => scrubTo(0)} disabled={offset === 0}>
            Return to tonight
          </button>
        </div>
      </div>

      <ol className="moon-upcoming" aria-label="Upcoming moon phases">
        {upcoming.map((p) => (
          <li key={p.name}>
            <Moon elong={p.at} size={56} className="moon-mini" />
            <p className="moon-upcoming-name">{p.name}</p>
            <p className="moon-upcoming-date">
              {fmtDate(p.date)} · {fmtTime(p.date)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
