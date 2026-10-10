// A papery page-turn: a swoosh of air as the leaf lifts and sweeps over, a little
// crinkle, and a soft flap as it settles. Generated with the Web Audio API.

let ctx
let noise

function audio() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  ctx ??= new Ctx()
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function burst(t, length, { type, freq, q = 1, level, attack = 0.005, sweepTo }) {
  const src = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  src.buffer = noise
  filter.type = type
  filter.Q.value = q
  filter.frequency.setValueAtTime(freq, t)
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t + length)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(level, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length)
  src.connect(filter).connect(gain).connect(ctx.destination)
  src.start(t, Math.random() * 0.5, length + 0.05)
}

/** Play a page turn lasting about `seconds` (matched to the flip animation). */
export function playPageTurn(seconds = 1.1) {
  if (!audio()) return
  const t = ctx.currentTime + 0.01
  // the swoosh: rises as the page lifts, falls as it sweeps over
  burst(t, seconds * 0.45, { type: 'bandpass', freq: 700, q: 0.7, level: 0.22, attack: seconds * 0.22, sweepTo: 3200 })
  burst(t + seconds * 0.3, seconds * 0.45, { type: 'bandpass', freq: 2600, q: 0.7, level: 0.16, attack: 0.08, sweepTo: 900 })
  // paper crinkle
  for (let i = 0; i < 5; i++) {
    burst(t + Math.random() * seconds * 0.55, 0.025, { type: 'highpass', freq: 3500 + Math.random() * 2500, level: 0.06 })
  }
  // the soft flap as it lands
  burst(t + seconds * 0.78, 0.09, { type: 'lowpass', freq: 1100, level: 0.32, attack: 0.004 })
}
