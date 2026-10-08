import { profile } from '../data/profile'
import { SectionTitle } from './Ornaments'

function PotionBottle({ color }) {
  return (
    <svg viewBox="0 0 120 170" className="potion" aria-hidden="true">
      <defs>
        <clipPath id="flask">
          <path d="M48 40 V62 C22 74 12 96 12 118 C12 146 34 164 60 164 C86 164 108 146 108 118 C108 96 98 74 72 62 V40 Z" />
        </clipPath>
      </defs>
      <rect x="44" y="8" width="32" height="20" rx="4" fill="#6b4a2e" />
      <rect x="42" y="26" width="36" height="14" rx="3" fill="#8a7a62" opacity="0.6" />
      <g clipPath="url(#flask)">
        <rect x="0" y="0" width="120" height="170" fill="rgba(232,220,194,0.08)" />
        <path className="potion-liquid" d="M0 96 Q30 86 60 96 T120 96 V170 H0 Z" fill={color} />
        <circle className="bubble b1" cx="44" cy="140" r="4" fill="#c9a7ff" />
        <circle className="bubble b2" cx="70" cy="150" r="3" fill="#c9a7ff" />
        <circle className="bubble b3" cx="58" cy="130" r="2.5" fill="#e8dcc2" />
      </g>
      <path
        d="M48 40 V62 C22 74 12 96 12 118 C12 146 34 164 60 164 C86 164 108 146 108 118 C108 96 98 74 72 62 V40 Z"
        fill="none"
        stroke="#e8dcc2"
        strokeWidth="2.5"
      />
      <path d="M26 104 C24 116 28 130 36 140" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
      <rect x="34" y="112" width="52" height="22" rx="2" fill="#e8dcc2" />
      <text x="60" y="127" textAnchor="middle" fontSize="9" fontFamily="IM Fell English, serif" fill="#2a1d14">
        No. 7 · Purple
      </text>
    </svg>
  )
}

function Symbol({ kind }) {
  if (kind === 'moon') {
    return (
      <svg viewBox="0 0 60 60" className="tarot-symbol" aria-hidden="true">
        <path d="M38 8 a22 22 0 1 0 14 38 a18 18 0 1 1 -14 -38 z" fill="#c9a7ff" />
        <path d="M14 12 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#b8954a" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 60 60" className="tarot-symbol" aria-hidden="true">
      <path d="M48 6 C30 12 18 28 14 50 C24 36 36 24 48 6 Z" fill="#e8dcc2" />
      <path d="M48 6 C38 20 28 34 14 50" stroke="#b8954a" strokeWidth="1.5" fill="none" />
      <path d="M10 54 l6 -6" stroke="#b8954a" strokeWidth="2" />
      <ellipse cx="44" cy="52" rx="10" ry="4" fill="#2a1f36" stroke="#b8954a" />
    </svg>
  )
}

export default function Aesthetic() {
  const { favoriteColor, aesthetics } = profile
  return (
    <section className="section" id="vibes">
      <SectionTitle eyebrow="Chapter VI">Vibes &amp; Hexes</SectionTitle>
      <div className="vibes">
        <figure className="potion-card">
          <PotionBottle color={favoriteColor.hex} />
          <figcaption>
            Favorite color: <strong>{favoriteColor.name}</strong>
            <span className="swatches" aria-hidden="true">
              {['#3d1f5c', '#6b3fa0', '#7b4bb8', '#9b6fd1', '#c9a7ff'].map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
          </figcaption>
        </figure>

        <div className="tarot-row">
          {aesthetics.map((a, i) => (
            <article className="tarot" key={a.name}>
              <p className="tarot-num">{['XVIII', 'XIX'][i] ?? 'XX'}</p>
              <Symbol kind={a.symbol} />
              <h3>{a.name}</h3>
              <p>{a.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
