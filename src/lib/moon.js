// Low-precision lunar ephemeris (after Meeus, "Astronomical Algorithms").
// Good to well under an hour for phase timing — plenty for a website.

const DAY_MS = 86_400_000
const J2000_MS = Date.UTC(2000, 0, 1, 12)
const RAD = Math.PI / 180

export const SYNODIC_DAYS = 29.530588853

const norm360 = (deg) => ((deg % 360) + 360) % 360

/** Sun–Moon elongation in degrees: 0 = new, 90 = first quarter, 180 = full, 270 = last quarter. */
export function elongation(date) {
  const d = (date.getTime() - J2000_MS) / DAY_MS

  // Sun
  const Ms = (357.5291 + 0.98560028 * d) * RAD
  const Ls = 280.4665 + 0.98564736 * d
  const sunLon = Ls + 1.915 * Math.sin(Ms) + 0.02 * Math.sin(2 * Ms)

  // Moon
  const Lm = 218.3165 + 13.17639648 * d
  const Mm = (134.9634 + 13.06499295 * d) * RAD
  const D = (297.8502 + 12.19074912 * d) * RAD
  const F = (93.272 + 13.2293502 * d) * RAD
  const moonLon =
    Lm +
    6.289 * Math.sin(Mm) +
    1.274 * Math.sin(2 * D - Mm) +
    0.658 * Math.sin(2 * D) +
    0.214 * Math.sin(2 * Mm) -
    0.186 * Math.sin(Ms) -
    0.114 * Math.sin(2 * F)

  return norm360(moonLon - sunLon)
}

export const illumination = (elong) => (1 - Math.cos(elong * RAD)) / 2

export const PHASES = [
  { name: 'New Moon', at: 0, lore: 'The dark of the moon. Rest, dream, and plant intentions in the quiet.' },
  { name: 'Waxing Crescent', lore: 'A sliver of silver. Gather what you need and take the first small step.' },
  { name: 'First Quarter', at: 90, lore: 'Half lit, half hidden. A time for courage, decisions, and pushing through.' },
  { name: 'Waxing Gibbous', lore: 'Nearly there. Refine, tend, and adjust the work in progress.' },
  { name: 'Full Moon', at: 180, lore: 'The moon at her brightest. Celebrate, charge your crystals, see clearly.' },
  { name: 'Waning Gibbous', lore: 'The light softens. Share what you’ve learned and give thanks.' },
  { name: 'Last Quarter', at: 270, lore: 'Half in shadow again. Release, forgive, and clear the shelves.' },
  { name: 'Waning Crescent', lore: 'The last thin smile before dark. Reflect, recover, and rest.' },
]

/** Named phase for an elongation. Principal phases get roughly a day's window either side. */
export function phaseFor(elong) {
  const near = (target, width) => Math.abs(((elong - target + 540) % 360) - 180) <= width
  if (near(0, 9)) return PHASES[0]
  if (near(90, 6)) return PHASES[2]
  if (near(180, 9)) return PHASES[4]
  if (near(270, 6)) return PHASES[6]
  if (elong < 90) return PHASES[1]
  if (elong < 180) return PHASES[3]
  if (elong < 270) return PHASES[5]
  return PHASES[7]
}

/** Next moment after `from` when the elongation reaches `target` degrees. */
export function nextPhaseTime(from, target) {
  // How far the moon still has to travel, mapped onto (0, 360]
  const remaining = (e) => norm360(target - e) || 360
  const step = 6 * 3_600_000
  let t = from.getTime()
  let prev = remaining(elongation(from))
  // Step forward until we wrap past the target, then bisect.
  for (let i = 0; i < 160; i++) {
    const r = remaining(elongation(new Date(t + step)))
    if (r > prev) break
    prev = r
    t += step
  }
  // Before the crossing `remaining` keeps shrinking toward 0; after it, it jumps back near 360.
  let lo = t
  let hi = t + step
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (remaining(elongation(new Date(mid))) > prev) hi = mid
    else lo = mid
  }
  return new Date(hi)
}

/** The next four principal phases after `from`, in date order. */
export function upcomingPhases(from) {
  return PHASES.filter((p) => p.at !== undefined)
    .map((p) => ({ ...p, date: nextPhaseTime(from, p.at) }))
    .sort((a, b) => a.date - b.date)
}

/** Days since the last new moon. */
export const moonAge = (elong) => (elong / 360) * SYNODIC_DAYS
