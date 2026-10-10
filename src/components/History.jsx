import { profile } from '../data/profile'
import { DressForm, SectionTitle } from './Ornaments'

const ARMS = ['M43 32 Q31 44 30 68 L34 69 Q36 50 45 38 Z', 'M57 32 Q69 44 70 68 L66 69 Q64 50 55 38 Z']

// Dress silhouettes on a 100×160 figure: [garment paths], plus optional headwear/extras.
const SHAPES = {
  medieval: {
    dress: [
      'M42 30 L58 30 L62 40 L60 55 Q74 110 86 156 L14 156 Q26 110 40 55 L38 40 Z',
      // trailing hanging sleeves
      'M40 32 Q30 60 26 96 L32 96 Q36 64 42 40 Z',
      'M60 32 Q70 60 74 96 L68 96 Q64 64 58 40 Z',
    ],
    head: 'M43 14 L68 -2 L57 17 Z',
  },
  elizabethan: {
    dress: ['M40 34 L60 34 L58 64 L50 80 L42 64 Z', 'M18 70 L82 70 L84 77 L78 156 L22 156 L16 77 Z'],
    extra: (
      <>
        <ellipse cx="50" cy="30" rx="15" ry="5" />
        <ellipse cx="50" cy="71" rx="34" ry="4" />
      </>
    ),
  },
  rococo: {
    dress: [
      'M41 34 L59 34 L56 66 L50 78 L44 66 Z',
      'M44 68 Q50 72 56 68 Q88 64 95 82 Q96 120 84 156 L16 156 Q4 120 5 82 Q12 64 44 68 Z',
    ],
    head: 'M41 16 Q33 4 40 -1 Q44 -6 50 -4 Q56 -6 60 -1 Q67 4 59 16 Z',
  },
  regency: {
    dress: ['M42 32 L58 32 L59 46 L41 46 Z', 'M41 46 L59 46 Q64 100 68 156 L32 156 Q36 100 41 46 Z'],
    extra: (
      <>
        <circle cx="40" cy="36" r="4.5" />
        <circle cx="60" cy="36" r="4.5" />
      </>
    ),
  },
  crinoline: {
    dress: [
      'M42 34 L58 34 L55 68 L50 72 L45 68 Z',
      'M45 66 L55 66 Q70 72 80 110 Q90 146 95 156 L5 156 Q10 146 20 110 Q30 72 45 66 Z',
    ],
  },
  bustle: {
    dress: [
      'M43 34 L57 34 L55 68 L45 68 Z',
      'M45 66 L55 66 Q78 64 80 80 Q71 85 73 102 Q77 130 80 156 L26 156 Q30 120 39 92 Q44 74 45 66 Z',
    ],
  },
  edwardian: {
    dress: ['M43 32 L57 32 Q66 44 56 58 L45 60 Z', 'M45 58 L56 58 Q60 110 78 156 L24 156 Q42 110 45 58 Z'],
    head: 'M30 12 Q50 4 70 12 Q50 15 30 12 Z',
  },
  flapper: {
    dress: ['M42 32 L58 32 L60 92 L64 114 L36 114 L40 92 Z', 'M44 114 h4 v42 h-4 Z', 'M52 114 h4 v42 h-4 Z'],
    head: 'M40 19 Q40 6 50 6 Q60 6 60 19 Z',
  },
}

function Silhouette({ shape }) {
  const s = SHAPES[shape]
  if (!s) return null
  return (
    <svg viewBox="0 -6 100 166" className="era-figure" aria-hidden="true">
      <g className="era-fill">
        <circle cx="50" cy="18" r="8.5" />
        <rect x="47.5" y="24" width="5" height="8" />
        {ARMS.map((d) => (
          <path key={d} d={d} className="era-arm" />
        ))}
        {s.dress.map((d) => (
          <path key={d} d={d} />
        ))}
        {s.extra}
        {s.head && <path d={s.head} />}
      </g>
    </svg>
  )
}

export default function History() {
  return (
    <section className="section" id="history">
      <SectionTitle eyebrow="Chapter VI · A Passion of Mine">Through the Ages</SectionTitle>
      <article className="parchment history-intro">
        <DressForm className="history-intro-icon" />
        <div>
          <h3>Why I love fashion history</h3>
          {profile.fashionHistory.intro.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </article>
      <p className="section-intro history-hint">Six centuries of my favorite silhouettes. Scroll sideways through time →</p>
      <ol className="timeline">
        {profile.fashionEras.map((era) => (
          <li className="era" key={era.name}>
            <span className="era-years">{era.years}</span>
            <span className="era-pin" aria-hidden="true" />
            <article className="era-card">
              <Silhouette shape={era.shape} />
              <h3>{era.name}</h3>
              <p className="era-garment">{era.garment}</p>
              <p className="era-note">{era.note}</p>
              {era.shelf && <p className="era-shelf">❦ On my shelf: {era.shelf}</p>}
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
