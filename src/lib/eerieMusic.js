// An original, procedurally generated haunted lullaby (Web Audio API, no audio files):
// a music box in D minor over a low drone, eerie wind, and a distant bell.

const BPM = 73
const BEAT = 60 / BPM

// Each bar of the 3/4 lullaby: melody as [midi note, beats], plus a bass root.
const BARS = [
  { mel: [[69, 1], [74, 1], [77, 1]], bass: 50 },
  { mel: [[76, 2], [74, 1]], bass: 50 },
  { mel: [[73, 1], [74, 1], [76, 1]], bass: 45 },
  { mel: [[69, 3]], bass: 45 },
  { mel: [[70, 1], [74, 1], [77, 1]], bass: 46 },
  { mel: [[79, 1], [77, 1], [76, 1]], bass: 43 },
  { mel: [[77, 1], [76, 1], [74, 1]], bass: 50 },
  { mel: [[73, 3]], bass: 45 },
  { mel: [[74, 1], [77, 1], [81, 1]], bass: 50 },
  { mel: [[82, 1], [81, 1], [79, 1]], bass: 43 },
  { mel: [[77, 1], [76, 1], [74, 1]], bass: 50 },
  { mel: [[76, 3]], bass: 45 },
  { mel: [[69, 1], [70, 1], [73, 1]], bass: 45 },
  { mel: [[74, 1], [77, 1], [76, 1]], bass: 50 },
  { mel: [[74, 1], [73, 1], [69, 1]], bass: 45 },
  { mel: [[74, 3]], bass: 50 },
]

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12)

function makeImpulse(ctx, seconds, decay) {
  const len = ctx.sampleRate * seconds
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay
  }
  return buf
}

function makeNoise(ctx, seconds) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function lfo(ctx, rate, depth, target) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = rate
  gain.gain.value = depth
  osc.connect(gain).connect(target)
  osc.start()
}

export function createEerieMusic() {
  const ctx = new AudioContext()

  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const reverb = ctx.createConvolver()
  reverb.buffer = makeImpulse(ctx, 4.5, 2.6)
  const wet = ctx.createGain()
  wet.gain.value = 0.55
  reverb.connect(wet).connect(master)

  // Music box bus: dry + a ghostly echo, all washed through the reverb.
  const box = ctx.createGain()
  box.gain.value = 0.8
  box.connect(master)
  box.connect(reverb)
  const echo = ctx.createDelay(3)
  echo.delayTime.value = BEAT * 1.5
  const feedback = ctx.createGain()
  feedback.gain.value = 0.2
  box.connect(echo)
  echo.connect(feedback).connect(echo)
  echo.connect(reverb)

  // Low drone on D and A, slowly breathing through a filter.
  const droneFilter = ctx.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = 260
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.045
  droneFilter.connect(droneGain).connect(master)
  droneGain.connect(reverb)
  for (const [f, detune] of [
    [hz(38), -2],
    [hz(38), 2],
    [hz(45), 0],
  ]) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = f
    osc.detune.value = detune
    osc.connect(droneFilter)
    osc.start()
  }
  lfo(ctx, 0.05, 140, droneFilter.frequency)

  // Wind: band-passed noise sweeping slowly up and down.
  const wind = ctx.createBufferSource()
  wind.buffer = makeNoise(ctx, 4)
  wind.loop = true
  const windFilter = ctx.createBiquadFilter()
  windFilter.type = 'bandpass'
  windFilter.frequency.value = 500
  windFilter.Q.value = 9
  const windGain = ctx.createGain()
  windGain.gain.value = 0.05
  wind.connect(windFilter).connect(windGain).connect(master)
  windGain.connect(reverb)
  lfo(ctx, 0.07, 320, windFilter.frequency)
  lfo(ctx, 0.11, 0.03, windGain.gain)
  wind.start()

  // A music-box tine: bright strike, long fade, and a warped-tape wobble in pitch.
  function tine(midi, time, level = 0.16) {
    const wobble = 4 * Math.sin(time * 1.4) // a faint old-tape drift, never out of tune
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(level, time + 0.006)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 2.6)
    env.connect(box)
    for (const [mult, amp] of [
      [1, 1],
      [2, 0.12],
      [3, 0.06],
    ]) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.frequency.value = hz(midi) * mult
      osc.detune.value = wobble
      g.gain.value = amp
      osc.connect(g).connect(env)
      osc.start(time)
      osc.stop(time + 2.7)
    }
  }

  // A distant church bell: inharmonic partials with a slow decay.
  function bell(time) {
    const base = hz(50)
    for (const [mult, amp] of [
      [0.5, 0.5],
      [1, 0.35],
      [1.189, 0.25],
      [1.498, 0.18],
      [2, 0.14],
      [3, 0.08],
    ]) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.frequency.value = base * mult
      g.gain.setValueAtTime(0.0001, time)
      g.gain.exponentialRampToValueAtTime(amp * 0.12, time + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, time + 7)
      osc.connect(g)
      g.connect(reverb)
      g.connect(master)
      osc.start(time)
      osc.stop(time + 7.1)
    }
  }

  let bar = 0
  let loop = 0
  let nextBar = 0
  let timer = 0
  let stopTimer = 0

  function scheduleBar(i, t) {
    const { mel, bass } = BARS[i]
    // Every other pass sinks an octave, like the box is winding down.
    const shift = loop % 2 ? -12 : 0
    let beat = 0
    for (const [note, len] of mel) {
      tine(note + shift, t + beat * BEAT)
      beat += len
    }
    tine(bass, t, 0.1)
    tine(bass + 7, t + BEAT, 0.05)
    if (i === 0 && loop % 2 === 0) bell(t)
  }

  function tick() {
    while (nextBar < ctx.currentTime + 0.4) {
      scheduleBar(bar, nextBar)
      nextBar += 3 * BEAT
      bar = (bar + 1) % BARS.length
      if (bar === 0) loop++
    }
  }

  function onVisibility() {
    if (document.hidden) ctx.suspend()
    else if (timer) ctx.resume()
  }
  document.addEventListener('visibilitychange', onVisibility)

  return {
    async start() {
      clearTimeout(stopTimer)
      await ctx.resume()
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0.75, now + 2.5)
      if (!timer) {
        nextBar = now + 0.15
        timer = setInterval(tick, 50)
        tick()
      }
    },
    stop() {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 1.2)
      clearInterval(timer)
      timer = 0
      stopTimer = setTimeout(() => ctx.suspend(), 1300)
    },
  }
}
