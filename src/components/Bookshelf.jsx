import { useState } from 'react'
import { profile } from '../data/profile'
import { Cobweb, SectionTitle } from './Ornaments'
import Curio from './Curios'

const PER_SHELF = 6

// What sits beside the books on each shelf (cycles if more shelves are added).
// `extra` curios are hidden on narrow screens to leave room for the books.
const SHELF_CURIOS = [
  { left: [{ type: 'skull' }], right: [{ type: 'raven', extra: true }] },
  {
    left: [{ type: 'eyeJar' }, { type: 'crystalBall', extra: true }],
    right: [{ type: 'potion' }, { type: 'candle', extra: true }],
  },
]

function toRoman(n) {
  const numerals = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  for (const [value, glyph] of numerals) {
    while (n >= value) {
      out += glyph
      n -= value
    }
  }
  return out
}

export default function Bookshelf() {
  const [active, setActive] = useState(0)
  const book = profile.books[active]

  const shelves = []
  for (let i = 0; i < profile.books.length; i += PER_SHELF) {
    shelves.push(profile.books.slice(i, i + PER_SHELF).map((b, j) => ({ ...b, index: i + j })))
  }

  return (
    <section className="section" id="shelf">
      <SectionTitle eyebrow="Chapter III">The Forbidden Shelf</SectionTitle>
      <p className="section-intro">My favorite books. Pull one from the shelf.</p>

      <div className="bookcase">
        {shelves.map((row, s) => {
          const curios = SHELF_CURIOS[s % SHELF_CURIOS.length]
          return (
            <div className="shelf-wrap" key={s}>
              <div className="shelf">
                <Cobweb className={`shelf-web ${s % 2 ? 'shelf-web-right' : ''}`} />
                {curios.left.map((c) => (
                  <Curio key={c.type} {...c} />
                ))}
                {row.map((b) => (
                  <button
                    key={b.title}
                    type="button"
                    className={`spine ${b.index === active ? 'is-active' : ''}`}
                    style={{ '--spine': b.color, '--h': `${b.height}%` }}
                    onClick={() => setActive(b.index)}
                    onMouseEnter={() => setActive(b.index)}
                    onFocus={() => setActive(b.index)}
                    aria-pressed={b.index === active}
                  >
                    <span className="spine-band" aria-hidden="true" />
                    <span className="spine-title">{b.title}</span>
                    <span className="spine-band" aria-hidden="true" />
                  </button>
                ))}
                {curios.right.map((c) => (
                  <Curio key={c.type} {...c} />
                ))}
              </div>
              <div className="shelf-plank" aria-hidden="true" />
            </div>
          )
        })}
      </div>

      <article className="book-card parchment" aria-live="polite">
        <p className="book-num">Volume {toRoman(active + 1)}</p>
        <h3>{book.title}</h3>
        <p className="book-meta">
          {book.author} · {book.year}
        </p>
      </article>
    </section>
  )
}
