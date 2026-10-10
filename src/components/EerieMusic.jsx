import { useRef, useState } from 'react'
import { createEerieMusic } from '../lib/eerieMusic'

// Toggle for the haunted lullaby. Music only ever starts from a click on this button.
export default function EerieMusic() {
  const [playing, setPlaying] = useState(false)
  const engine = useRef(null)

  const toggle = () => {
    if (playing) {
      engine.current?.stop()
    } else {
      engine.current ??= createEerieMusic()
      engine.current.start()
    }
    setPlaying(!playing)
  }

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? 'is-playing' : ''}`}
      aria-pressed={playing}
      onClick={toggle}
      title={playing ? 'Stop the music' : 'Play an eerie lullaby'}
    >
      <span className="music-note" aria-hidden="true">
        ♫
      </span>
      <span className="music-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="music-label">{playing ? 'Hush the music' : 'Play eerie music'}</span>
      <span className="music-label-short">{playing ? 'Hush' : 'Music'}</span>
    </button>
  )
}
