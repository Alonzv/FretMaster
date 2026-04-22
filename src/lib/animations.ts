// ── Shared animation utilities — Bauhaus geometric edition ──────────────────

/** Spawn a "+XP" particle that floats up and fades */
export function spawnXPParticle(x: number, y: number, amount: number) {
  const el = document.createElement('div')
  el.className = 'fm-xp-particle'
  el.textContent = `+${amount} XP`
  el.style.left = `${x - 24}px`
  el.style.top  = `${y - 12}px`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1200)
}

// Bauhaus primary palette — blue, yellow, red, white
const GEO_COLORS = ['#2B50E8', '#F5C200', '#E83020', '#F0EDE8', '#2B50E8', '#F5C200']

// Shape types: 0 = square, 1 = rotated square (diamond), 2 = triangle (clip-path)
type GeoShape = 0 | 1 | 2

function makeGeoEl(
  x: number,
  y: number,
  color: string,
  shape: GeoShape,
  size: number,
  tx: number,
  ty: number,
  rot: number,
  dur: number,
) {
  const el = document.createElement('div')
  el.className = 'fm-geo-piece'
  el.style.left   = `${x}px`
  el.style.top    = `${y}px`
  el.style.width  = `${size}px`
  el.style.height = `${size}px`
  el.style.background = color
  el.style.setProperty('--tx', `${tx}px`)
  el.style.setProperty('--ty', `${ty}px`)
  el.style.setProperty('--rot', `${rot}deg`)
  el.style.setProperty('--duration', `${dur}s`)

  if (shape === 1) {
    el.style.transform = 'rotate(45deg)'
  } else if (shape === 2) {
    el.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
    el.style.background = color
  }

  document.body.appendChild(el)
  setTimeout(() => el.remove(), (dur + 0.1) * 1000)
}

/** Geometric burst — spawns squares, diamonds and triangles in Bauhaus palette */
export function spawnConfetti(
  cx: number,
  cy: number,
  count = 52,
  spread = 260,
) {
  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2
    const dist   = 40 + Math.random() * spread
    const tx     = Math.cos(angle) * dist
    const ty     = Math.sin(angle) * dist + 80
    const rot    = Math.round(Math.random() * 4) * 90  // snap to 90° increments (Bauhaus)
    const dur    = 0.8 + Math.random() * 0.7
    const size   = 5 + Math.random() * 9
    const color  = GEO_COLORS[Math.floor(Math.random() * GEO_COLORS.length)]
    const shape  = Math.floor(Math.random() * 3) as GeoShape

    makeGeoEl(cx, cy, color, shape, size, tx, ty, rot, dur)
  }
}

/** Full-screen geometric burst from the middle of the viewport */
export function celebrateConfetti(count = 80) {
  spawnConfetti(window.innerWidth / 2, window.innerHeight / 3, count, 400)
}
