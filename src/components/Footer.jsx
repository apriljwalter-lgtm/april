import { profile } from '../data/profile'
import { Divider, Moon } from './Ornaments'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <Moon phase={0.6} />
      <h2 className="footer-finis">Finis</h2>
      <Divider />
      <p className="footer-sign">
        Thus ends the grimoire of <span>{profile.name}</span>.
      </p>
      <p className="footer-small">Close the book gently · blow out the candles · mind the spiders</p>
      <p className="footer-small">© {YEAR} {profile.name}</p>
    </footer>
  )
}
