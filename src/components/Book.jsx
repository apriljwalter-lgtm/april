import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { chapterFromHash } from '../lib/chapters'
import { playPageTurn } from '../lib/pageTurnSound'
import { Bat } from './Ambience'

const TURN_MS = 1100
const FLURRY_MS = 2400

const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii']

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Flight paths for a flurry of bats bursting out of the turning page, fanning upward
// and away in the direction the page is turning.
function makeFlurry(forward) {
  return Array.from({ length: 14 }, () => {
    const angle = (0.15 + Math.random() * 0.7) * Math.PI
    const dist = 55 + Math.random() * 45
    return {
      x: 35 + Math.random() * 30,
      y: 45 + Math.random() * 25,
      dx: Math.cos(angle) * dist * (forward ? 1 : -1),
      dy: -Math.sin(angle) * dist - 10,
      size: 0.6 + Math.random() * 1.1,
      delay: Math.random() * 0.35,
      dur: 1.1 + Math.random() * 0.7,
      flap: 0.12 + Math.random() * 0.1,
    }
  })
}

function BatFlurry({ bats }) {
  return (
    <div className="bat-flurry" aria-hidden="true">
      {bats.map((b, i) => (
        <span
          key={i}
          className="flurry-bat"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            '--dx': `${b.dx}vw`,
            '--dy': `${b.dy}vh`,
            '--size': b.size,
            '--flap': `${b.flap}s`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        >
          <Bat />
        </span>
      ))}
    </div>
  )
}

/**
 * Shows one chapter at a time and turns the page (a 3D flip around the spine on the left)
 * when you move between them. Chapter links anywhere on the page (#work, #moon…) turn to
 * that page, the browser's back/forward buttons work, and ←/→ keys flip pages.
 */
export default function Book({ chapters, onPageChange, children }) {
  const [current, setCurrent] = useState(() => chapterFromHash(chapters))
  const [turn, setTurn] = useState(null) // { from, to, forward }
  const [flurry, setFlurry] = useState(null) // { id, bats } — bats outlive the turn itself
  const leaves = useRef([])
  // Latest positions for event handlers: where we are, where we're headed, and any
  // destination requested mid-turn.
  const nav = useRef({ current, target: current, turning: false, queued: null })

  const startTurn = useEffectEvent((from, to) => {
    const forward = to > from
    leaves.current[to]?.scrollTo(0, 0)
    nav.current.turning = true
    setTurn({ from, to, forward })
    onPageChange?.(to)
    if (!prefersReducedMotion()) {
      setFlurry({ id: Date.now(), bats: makeFlurry(forward) })
      playPageTurn(TURN_MS / 1000)
    }
  })

  const goTo = useEffectEvent((i) => {
    const n = nav.current
    if (i < 0 || i >= chapters.length || i === n.target) return
    n.target = i
    if (n.turning) n.queued = i
    else startTurn(n.current, i)
  })

  // Land the page once the flip has played, then head on if another page was requested.
  useEffect(() => {
    if (!turn) return
    const id = setTimeout(
      () => {
        const n = nav.current
        n.current = turn.to
        n.turning = false
        setCurrent(turn.to)
        setTurn(null)
        leaves.current[turn.to]?.focus({ preventScroll: true })
        if (n.queued != null && n.queued !== turn.to) startTurn(turn.to, n.queued)
        n.queued = null
      },
      prefersReducedMotion() ? 0 : TURN_MS,
    )
    return () => clearTimeout(id)
  }, [turn])

  useEffect(() => {
    if (!flurry) return
    const id = setTimeout(() => setFlurry(null), FLURRY_MS)
    return () => clearTimeout(id)
  }, [flurry])

  // Chapter links, back/forward buttons, and arrow keys.
  useEffect(() => {
    const visit = (i) => {
      if (i === nav.current.target || !chapters[i]) return
      window.history.pushState(null, '', `#${chapters[i].id}`)
      goTo(i)
    }
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]')
      if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const i = chapters.findIndex((c) => `#${c.id}` === link.getAttribute('href'))
      if (i < 0) return
      e.preventDefault()
      visit(i)
    }
    const onPop = () => goTo(chapterFromHash(chapters))
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight') visit(nav.current.target + 1)
      if (e.key === 'ArrowLeft') visit(nav.current.target - 1)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPop)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('keydown', onKey)
    }
  }, [chapters])

  const leafClass = (i) => {
    if (turn) {
      if (turn.forward && i === turn.from) return 'leaf is-turning-away'
      if (!turn.forward && i === turn.to) return 'leaf is-turning-back'
      if (i === (turn.forward ? turn.to : turn.from)) return 'leaf is-under'
      return null
    }
    return i === current ? 'leaf' : null
  }

  const shown = turn ? turn.to : current
  const prev = chapters[shown - 1]
  const next = chapters[shown + 1]

  return (
    <div className="book">
      <div className="pages">
        {chapters.map((c, i) => {
          const cls = leafClass(i)
          return (
            <div key={c.id} className={cls ?? 'leaf'} hidden={!cls} style={{ '--ms': `${TURN_MS}ms` }}>
              <div
                className="leaf-front"
                ref={(el) => (leaves.current[i] = el)}
                tabIndex={-1}
                aria-label={c.label}
              >
                {c.content}
              </div>
              <div className="leaf-back" aria-hidden="true" />
              <div className="leaf-shade" aria-hidden="true" />
            </div>
          )
        })}

        {/* Click the edge of the page, or its folded corner, to turn it like a real book. */}
        {prev && (
          <a className="page-edge page-edge-prev" href={`#${prev.id}`} aria-label={`Turn back to ${prev.label}`}>
            <span className="page-edge-arrow" aria-hidden="true">‹</span>
            <span className="dog-ear" aria-hidden="true" />
          </a>
        )}
        {next && (
          <a className="page-edge page-edge-next" href={`#${next.id}`} aria-label={`Turn the page to ${next.label}`}>
            <span className="page-edge-arrow" aria-hidden="true">›</span>
            <span className="dog-ear" aria-hidden="true" />
          </a>
        )}
      </div>

      {flurry && <BatFlurry key={flurry.id} bats={flurry.bats} />}

      <nav className="pager" aria-label="Turn the page">
        <a className="pager-btn" href={prev ? `#${prev.id}` : undefined} aria-disabled={!prev}>
          <span aria-hidden="true">‹</span> {prev ? prev.label : ''}
        </a>
        <div className="pager-middle">
          <span className="folio" aria-live="polite">
            {shown === 0 ? 'Cover' : `— ${ROMAN[shown] ?? shown} —`}
          </span>
          {children}
        </div>
        <a className="pager-btn pager-next" href={next ? `#${next.id}` : undefined} aria-disabled={!next}>
          {next ? next.label : ''} <span aria-hidden="true">›</span>
        </a>
      </nav>
    </div>
  )
}
