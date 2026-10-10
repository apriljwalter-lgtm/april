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

export default function MoonPhase() {
  const [now, setNow] = useState(() => new Date())
  const [offset, setOffset] = useState(0) // days scrubbed away from tonight

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
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </label>
          <button type="button" className="moon-reset" onClick={() => setOffset(0)} disabled={offset === 0}>
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
