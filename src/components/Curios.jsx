// Creepy little objects that sit on the bookshelves between the books.
import { useEffect, useState } from 'react'
import { Candle } from './Ornaments'

function Skull() {
  return (
    <svg viewBox="0 0 60 64" className="curio-skull">
      <path
        d="M30 4 C14 4 6 16 6 28 C6 38 12 44 16 46 V58 H44 V46 C48 44 54 38 54 28 C54 16 46 4 30 4 Z"
        fill="#d9cbb0"
      />
      <path d="M30 4 l-2 6 l3 4 l-2 5" stroke="#8a7a62" strokeWidth="1" fill="none" />
      <ellipse cx="20" cy="30" rx="6" ry="7" fill="#120b18" />
      <ellipse cx="40" cy="30" rx="6" ry="7" fill="#120b18" />
      <circle className="skull-eye" cx="20" cy="31" r="1.8" fill="#c9a7ff" />
      <circle className="skull-eye" cx="40" cy="31" r="1.8" fill="#c9a7ff" />
      <path d="M30 36 l-3 7 h6 z" fill="#120b18" />
      <g stroke="#120b18" strokeWidth="1.2">
        <path d="M18 50 H42 M22 47 V58 M27 47 V58 M32 47 V58 M37 47 V58" />
      </g>
    </svg>
  )
}

function croak() {
  const synth = window.speechSynthesis
  if (!synth) return
  synth.cancel()
  const line = new SpeechSynthesisUtterance('Nevermore')
  line.pitch = 0.2
  line.rate = 0.6
  synth.speak(line)
}

// Quoth the raven… (click him)
function Raven() {
  const [quoths, setQuoths] = useState(0)
  const speaking = quoths > 0

  useEffect(() => {
    if (!quoths) return
    const id = setTimeout(() => setQuoths(0), 2600)
    return () => clearTimeout(id)
  }, [quoths])

  return (
    <button
      type="button"
      className={`raven-btn ${speaking ? 'is-speaking' : ''}`}
      aria-label="Ask the raven a question"
      onClick={() => {
        setQuoths((n) => n + 1)
        croak()
      }}
    >
      {speaking && (
        <span className="raven-quote" key={quoths} role="status">
          Nevermore.
        </span>
      )}
      <svg viewBox="0 0 70 80" className="curio-raven" aria-hidden="true">
        <path d="M20 54 L4 76 L14 71 L12 79 L28 60 Z" fill="#0b0610" />
        <path d="M22 60 C14 46 20 28 36 24 C48 22 54 32 52 44 C50 56 40 64 22 60 Z" fill="#0b0610" />
        <path d="M26 40 C34 36 44 40 48 50" stroke="#2a1f36" strokeWidth="1.5" fill="none" />
        <g className="raven-head">
          <circle cx="46" cy="20" r="10" fill="#0b0610" />
          <path className="raven-beak-top" d="M54 15 L68 21 L54 21 Z" fill="#1a1420" />
          <path className="raven-beak-bottom" d="M54 21 L68 21 L54 24 Z" fill="#1a1420" />
          <circle cx="48" cy="18" r="1.6" fill="#c9a7ff" />
        </g>
        <path d="M32 62 V74 M40 60 V74 M28 74 H36 M36 74 H44" stroke="#3a2a20" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function EyeJar() {
  return (
    <svg viewBox="0 0 50 80" className="curio-jar">
      <rect x="8" y="4" width="34" height="9" rx="2" fill="#6b4a2e" />
      <rect x="6" y="12" width="38" height="64" rx="8" fill="rgba(232,220,194,0.08)" stroke="rgba(232,220,194,0.55)" strokeWidth="1.5" />
      <rect x="8" y="26" width="34" height="48" rx="6" fill="rgba(110,160,90,0.4)" />
      <g className="jar-eye">
        <circle cx="25" cy="44" r="9" fill="#f3ecdc" />
        <path d="M17 40 q3 1 4 3 M33 49 q-3 0 -4 -2 M19 50 q2 -1 4 -1" stroke="#b03a3a" strokeWidth="0.6" fill="none" />
        <circle cx="27" cy="43" r="4.2" fill="#7b4bb8" />
        <circle cx="27" cy="43" r="2" fill="#000" />
        <circle cx="28.2" cy="41.8" r="0.8" fill="#fff" />
      </g>
      <rect x="11" y="58" width="28" height="11" rx="1" fill="#e8dcc2" />
      <text x="25" y="66" textAnchor="middle" fontSize="5.5" fontFamily="IM Fell English, serif" fill="#2a1d14">
        OCULUS
      </text>
    </svg>
  )
}

function CrystalBall() {
  return (
    <svg viewBox="0 0 60 70" className="curio-crystal">
      <defs>
        <radialGradient id="crystalGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e9dcff" />
          <stop offset="45%" stopColor="#9b6fd1" />
          <stop offset="100%" stopColor="#2a1240" />
        </radialGradient>
        <clipPath id="crystalClip">
          <circle cx="30" cy="30" r="21" />
        </clipPath>
      </defs>
      <circle className="crystal-glow" cx="30" cy="30" r="22" fill="url(#crystalGrad)" />
      <g clipPath="url(#crystalClip)">
        <g className="crystal-mist" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M14 34 C20 24 30 40 38 28 C42 22 46 26 48 30" />
          <path d="M16 22 C24 18 28 26 36 20" />
        </g>
      </g>
      <ellipse cx="22" cy="20" rx="6" ry="3.5" fill="#fff" opacity="0.5" transform="rotate(-30 22 20)" />
      <path d="M14 66 L20 50 H40 L46 66 Z" fill="#b8954a" />
      <path d="M20 50 H40" stroke="#6b4a2e" strokeWidth="2" />
      <rect x="10" y="64" width="40" height="4" rx="1" fill="#8a6236" />
    </svg>
  )
}

const CURIOS = {
  skull: Skull,
  raven: Raven,
  eyeJar: EyeJar,
  crystalBall: CrystalBall,
  candle: () => <Candle height={24} delay={0.6} />,
  potion: () => <span className="shelf-bottle" />,
}

export default function Curio({ type, extra = false }) {
  const Item = CURIOS[type]
  return (
    <span className={`curio ${extra ? 'curio-extra' : ''}`} aria-hidden={type === 'raven' ? undefined : true}>
      <Item />
    </span>
  )
}
