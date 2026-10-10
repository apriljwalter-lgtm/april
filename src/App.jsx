import './App.css'
import Ambience from './components/Ambience'
import Hero from './components/Hero'
import About from './components/About'
import Goals from './components/Goals'
import Bookshelf from './components/Bookshelf'
import Hobbies from './components/Hobbies'
import Music from './components/Music'
import History from './components/History'
import MoonPhase from './components/MoonPhase'
import Footer from './components/Footer'

const NAV = [
  ['top', 'Cover'],
  ['work', 'Work'],
  ['goals', 'Goals'],
  ['shelf', 'Shelf'],
  ['hobbies', 'Hobbies'],
  ['music', 'Music'],
  ['history', 'Fashion'],
  ['moon', 'Moon'],
]

export default function App() {
  return (
    <>
      <Ambience />
      <nav className="nav" aria-label="Sections">
        <a className="nav-brand" href="#top">
          ☾ April
        </a>
        <ul>
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Hero />
        <About />
        <Goals />
        <Bookshelf />
        <Hobbies />
        <Music />
        <History />
        <MoonPhase />
      </main>
      <Footer />
    </>
  )
}
