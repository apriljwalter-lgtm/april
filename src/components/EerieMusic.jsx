import { useEffect, useRef, useState } from 'react'
import { createEerieMusic } from '../lib/eerieMusic'

const PREF_KEY = 'grimoire-music'

function readPref() {
  try {
    return localStorage.getItem(PREF_KEY) === 'on'
  } catch {
    return false
  }
}

function writePref(on) {
  try {
    localStorage.setItem(PREF_KEY, on ? 'on' : 'off')
  } catch {
    // storage blocked — the toggle still works for this visit
  }
}

// Floating toggle for the haunted lullaby. Browsers only allow sound after a click,
// so returning visitors who left it on hear it again on their first interaction.
export default function EerieMusic() {
  const [playing, setPlaying] = useState(false)
  const engine = useRef(null)

  const play = () => {
    engine.current ??= createEerieMusic()
    engine.current.start()
    setPlaying(true)
  }

  const toggle = () => {
    if (playing) {
      engine.current?.stop()
      setPlaying(false)
      writePref(false)
    } else {
      play()
      writePref(true)
    }
  }

  useEffect(() => {
    if (!readPref()) return
    const disarm = () => {
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
    function resume(e) {
      disarm()
      // The toggle button handles its own clicks, and once it has been used it's in charge.
      if (engine.current || e.target.closest?.('.music-toggle')) return
      play()
    }
    window.addEventListener('pointerdown', resume)
    window.addEventListener('keydown', resume)
    return disarm
  }, [])

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? 'is-playing' : ''}`}
      aria-pressed={playing}
      onClick={toggle}
    >
      <span className="music-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {playing ? 'Hush the music' : 'Eerie music'}
    </button>
  )
}
