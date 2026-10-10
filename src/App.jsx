import { useState } from 'react'
import './App.css'
import Ambience from './components/Ambience'
import Book from './components/Book'
import { chapterFromHash } from './lib/chapters'
import Hero from './components/Hero'
import About from './components/About'
import Goals from './components/Goals'
import Bookshelf from './components/Bookshelf'
import Hobbies from './components/Hobbies'
import Music from './components/Music'
import History from './components/History'
import MoonPhase from './components/MoonPhase'
import Footer from './components/Footer'
import EerieMusic from './components/EerieMusic'

// Each chapter is one page of the book, in reading order.
const CHAPTERS = [
  { id: 'top', label: 'Cover', content: <Hero /> },
  { id: 'work', label: 'Work', content: <About /> },
  { id: 'goals', label: 'Goals', content: <Goals /> },
  { id: 'shelf', label: 'Shelf', content: <Bookshelf /> },
  { id: 'hobbies', label: 'Hobbies', content: <Hobbies /> },
  { id: 'music', label: 'Music', content: <Music /> },
  { id: 'history', label: 'Fashion', content: <History /> },
  {
    id: 'moon',
    label: 'Moon',
    content: (
      <>
        <MoonPhase />
        <Footer />
      </>
    ),
  },
]

export default function App() {
  const [page, setPage] = useState(() => chapterFromHash(CHAPTERS))

  return (
    <div className="app">
      <Ambience />
      <nav className="nav" aria-label="Chapters">
        <a className="nav-brand" href="#top">
          ☾ April
        </a>
        <ul>
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} aria-current={i === page ? 'page' : undefined}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Book chapters={CHAPTERS} onPageChange={setPage} />
      <EerieMusic />
    </div>
  )
}
