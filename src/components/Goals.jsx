import { profile } from '../data/profile'
import { SectionTitle } from './Ornaments'

export default function Goals() {
  return (
    <section className="section" id="goals">
      <SectionTitle eyebrow="Chapter II">Grimoire of Intentions</SectionTitle>
      {profile.goals.map((goal) => (
        <article className="scroll" key={goal.title}>
          <div className="scroll-rod" aria-hidden="true" />
          <div className="scroll-body parchment">
            <p className="scroll-label">I solemnly intend to…</p>
            <h3>{goal.title}</h3>
            <p>{goal.blurb}</p>
            <p className="scroll-status">
              <span className="status-dot" aria-hidden="true" /> {goal.status}
            </p>
            <div className="wax-seal" aria-hidden="true">
              <span>{profile.name[0]}</span>
            </div>
          </div>
          <div className="scroll-rod" aria-hidden="true" />
        </article>
      ))}
    </section>
  )
}
