import { profile } from '../data/profile'
import { DressForm, SectionTitle } from './Ornaments'

function BookIcon() {
  return (
    <svg viewBox="0 0 64 48" className="hobby-icon" aria-hidden="true">
      <path d="M32 10 C24 4 12 4 4 8 V44 C12 40 24 40 32 46 Z" fill="#e8dcc2" stroke="#b8954a" strokeWidth="1.5" />
      <path d="M32 10 C40 4 52 4 60 8 V44 C52 40 40 40 32 46 Z" fill="#e8dcc2" stroke="#b8954a" strokeWidth="1.5" />
      <g stroke="#8a7a62" strokeWidth="1">
        <path d="M10 16 h16 M10 22 h16 M10 28 h12 M38 16 h16 M38 22 h16 M38 28 h14" />
      </g>
      <path d="M44 6 v20 l3 -3 l3 3 v-21" fill="#7b4bb8" />
    </svg>
  )
}

// A little heart, stitched in X's on the embroidery hoop
const HEART = ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..']

function YarnIcon() {
  return (
    <svg viewBox="0 0 100 48" className="hobby-icon hobby-icon-wide" aria-hidden="true">
      {/* yarn ball with a crochet hook tucked in */}
      <circle cx="26" cy="28" r="16" fill="#7b4bb8" />
      <g stroke="#c9a7ff" strokeWidth="1.4" fill="none">
        <path d="M12 22 C20 18 32 20 40 28" />
        <path d="M11 30 C20 24 34 28 40 34" />
        <path d="M16 40 C22 30 32 30 36 40" />
        <path d="M18 14 C24 22 24 32 20 42" />
      </g>
      <path d="M4 46 L36 6" stroke="#b8954a" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M36 6 q3 -4 5 -1 q1 2 -3 3" stroke="#b8954a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M40 36 C46 42 50 44 56 42" stroke="#9b6fd1" strokeWidth="1.6" fill="none" />

      {/* cross-stitch hoop */}
      <rect x="74" y="2" width="6" height="6" rx="1" fill="#8a6236" />
      <circle cx="77" cy="25" r="18" fill="#e8dcc2" stroke="#8a6236" strokeWidth="3.5" />
      <g stroke="#7b4bb8" strokeWidth="1.2" strokeLinecap="round">
        {HEART.flatMap((row, r) =>
          [...row].map((cell, c) => {
            if (cell !== 'X') return null
            const x = 67 + c * 4
            const y = 15 + r * 4
            return <path key={`${r}-${c}`} d={`M${x} ${y} l3.2 3.2 M${x + 3.2} ${y} l-3.2 3.2`} />
          }),
        )}
      </g>
    </svg>
  )
}

const ICONS = { book: BookIcon, yarn: YarnIcon, dressForm: DressForm }

export default function Hobbies() {
  return (
    <section className="section" id="hobbies">
      <SectionTitle eyebrow="Chapter IV">Idle Hands &amp; Busy Minds</SectionTitle>
      <div className="card-grid">
        {profile.hobbies.map((h) => {
          const Icon = ICONS[h.icon]
          return (
            <article className="hobby-card" key={h.name}>
              <Icon />
              <h3>{h.name}</h3>
              <p>{h.blurb}</p>
              {h.link && (
                <a className="hobby-link" href={h.link}>
                  Take the tour through the ages →
                </a>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
