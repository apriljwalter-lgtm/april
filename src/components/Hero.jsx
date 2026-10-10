import { profile } from '../data/profile'
import { Candle, Moon } from './Ornaments'

const PHASES = [-0.95, -0.6, -0.3, 0, 0.3, 0.6, 0.95]

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="moon-row" aria-hidden="true">
        {PHASES.map((p) => (
          <Moon key={p} phase={p} />
        ))}
      </div>

      <p className="hero-kicker">Ex Libris · Est. by candlelight</p>
      <h1 className="hero-name">
        <span className="hero-the">the grimoire of</span>
        <span className="hero-signature">{profile.name}</span>
      </h1>
      <p className="hero-tagline">{profile.tagline}</p>

      <div className="hero-candles">
        <Candle height={60} delay={0} />
        <Candle height={90} delay={0.4} />
        <Candle height={50} delay={0.9} />
      </div>

      <a className="hero-scroll" href="#work">
        open the book <span aria-hidden="true">→</span>
      </a>
    </section>
  )
}
