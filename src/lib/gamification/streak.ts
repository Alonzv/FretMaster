// Daily streak — increments when the user completes any session today.
// Resets if two or more days pass without activity.

const KEY = 'fm_streak_v1'

export interface StreakState {
  count: number           // consecutive days
  longest: number
  lastActivityDate: string  // 'YYYY-MM-DD' or ''
  completedToday: boolean
}

const DEFAULT: StreakState = { count: 0, longest: 0, lastActivityDate: '', completedToday: false }

function toDateStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT }
    const s: StreakState = { ...DEFAULT, ...JSON.parse(raw) }
    // Detect if today has already been registered
    const today = toDateStr()
    s.completedToday = s.lastActivityDate === today
    return s
  } catch {
    return { ...DEFAULT }
  }
}

/** Call after the user successfully completes any scored session. */
export function recordActivity(state: StreakState): StreakState {
  const today = toDateStr()
  if (state.lastActivityDate === today) return state  // already counted today

  const yesterday = toDateStr(new Date(Date.now() - 86_400_000))
  const isConsecutive = state.lastActivityDate === yesterday

  const next: StreakState = {
    count: isConsecutive ? state.count + 1 : 1,
    longest: 0,
    lastActivityDate: today,
    completedToday: true,
  }
  next.longest = Math.max(state.longest, next.count)

  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
