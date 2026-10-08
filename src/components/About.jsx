import { profile } from '../data/profile'
import { SectionTitle } from './Ornaments'

export default function About() {
  return (
    <section className="section" id="work">
      <SectionTitle eyebrow="Chapter I">By Day</SectionTitle>
      <article className="parchment about-card">
        <p className="dropcap">
          Hello, I&rsquo;m <strong>{profile.name}</strong>. {profile.work.blurb}
        </p>
        <dl className="ledger">
          <div>
            <dt>Occupation</dt>
            <dd>{profile.work.field}</dd>
          </div>
          <div>
            <dt>After hours</dt>
            <dd>Reader, fiber artist, collector of moods</dd>
          </div>
          <div>
            <dt>Signature hue</dt>
            <dd>{profile.favoriteColor.name}, always</dd>
          </div>
        </dl>
      </article>
    </section>
  )
}
