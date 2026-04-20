// Hearts system — max 5, lose 1 per wrong answer, refill 1 per 30 minutes.
// Stored in localStorage; no server sync needed (local-first).

export const MAX_HEARTS = 3
const REFILL_MS = 20 * 60 * 1000  // 20 minutes per heart
const KEY = 'fm_hearts_v1'

export interface HeartsState {
  current: number       // 0 – MAX_HEARTS
  lastLostAt: number    // timestamp of the last heart loss (for refill calc)
}

const DEFAULT: HeartsState = { current: MAX_HEARTS, lastLostAt: 0 }

// ── Persistence ──────────────────────────────────────────────────────────────

export function loadHearts(): HeartsState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT }
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT }
  }
}

function saveHearts(s: HeartsState): void {
  localStorage.setItem(KEY, JSON.stringify(s))
}

// ── Computed helpers ─────────────────────────────────────────────────────────

/** Apply passive refill: returns updated state without side-effects. */
export function applyRefill(state: HeartsState, now = Date.now()): HeartsState {
  if (state.current >= MAX_HEARTS) return state
  if (state.lastLostAt === 0) return { current: MAX_HEARTS, lastLostAt: 0 }
  const elapsed   = now - state.lastLostAt
  const refilled  = Math.floor(elapsed / REFILL_MS)
  if (refilled <= 0) return state
  const next = Math.min(MAX_HEARTS, state.current + refilled)
  // Advance lastLostAt by the number of full refill periods consumed.
  const newLastLost = next >= MAX_HEARTS ? 0 : state.lastLostAt + refilled * REFILL_MS
  return { current: next, lastLostAt: newLastLost }
}

/** ms until the next heart refills. Returns 0 if already full. */
export function msUntilNextHeart(state: HeartsState, now = Date.now()): number {
  if (state.current >= MAX_HEARTS) return 0
  if (state.lastLostAt === 0) return 0
  const elapsed  = now - state.lastLostAt
  const nextTick = REFILL_MS - (elapsed % REFILL_MS)
  return nextTick
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function loseHeart(state: HeartsState, now = Date.now()): HeartsState {
  const fresh = applyRefill(state, now)
  const next: HeartsState = {
    current: Math.max(0, fresh.current - 1),
    lastLostAt: fresh.current >= MAX_HEARTS
      ? now           // first loss after full — start the clock
      : fresh.lastLostAt,
  }
  saveHearts(next)
  return next
}

export function refillAllHearts(): HeartsState {
  const full: HeartsState = { current: MAX_HEARTS, lastLostAt: 0 }
  saveHearts(full)
  return full
}

export function loadAndRefill(): HeartsState {
  const raw    = loadHearts()
  const fresh  = applyRefill(raw)
  if (fresh.current !== raw.current) saveHearts(fresh)
  return fresh
}
