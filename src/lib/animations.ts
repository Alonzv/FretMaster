// ── Shared animation utilities ─────────────────────────────────────────────

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

/** Confetti burst — spawns N coloured pieces from a centre point */
export function spawnConfetti(
  cx: number,
  cy: number,
  count = 52,
  spread = 260,
) {
  const COLORS = [
    '#8FAD79','#C49A52','#C46858','#64B5F6','#CE93D8',
    '#A5D6A7','#FFCC80','#EF9A9A','#80DEEA','#FFAB91',
  ]
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'fm-confetti-piece'
    const angle  = Math.random() * Math.PI * 2
    const dist   = 40 + Math.random() * spread
    const tx     = Math.cos(angle) * dist
    const ty     = Math.sin(angle) * dist + 80     // slightly downward bias
    const rot    = (Math.random() - 0.5) * 720
    const dur    = 0.9 + Math.random() * 0.8
    el.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      --tx: ${tx}px; --ty: ${ty}px; --rot: ${rot}deg; --duration: ${dur}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      width: ${5 + Math.random() * 6}px;
      height: ${5 + Math.random() * 6}px;
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), (dur + 0.1) * 1000)
  }
}

/** Full-screen confetti burst from the middle of the viewport */
export function celebrateConfetti(count = 80) {
  spawnConfetti(window.innerWidth / 2, window.innerHeight / 3, count, 400)
}
