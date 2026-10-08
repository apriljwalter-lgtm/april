import { profile } from '../data/profile'
import { SectionTitle } from './Ornaments'

export default function Music() {
  return (
    <section className="section" id="music">
      <SectionTitle eyebrow="Chapter V">Hymns for the Haunted</SectionTitle>
      <p className="section-intro">The bands on heavy rotation. Hover to drop the needle.</p>
      <ul className="records">
        {profile.bands.map((band) => (
          <li className="record" key={band.name}>
            <div className="vinyl" style={{ '--label': band.label }}>
              <div className="vinyl-label">
                <span>{band.name}</span>
              </div>
            </div>
            <p className="record-name">{band.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
