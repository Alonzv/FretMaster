// ── XP & Level system ─────────────────────────────────────────────────────────

const KEY = 'fm_xp_v1'

export interface XPState {
  total: number
}

export interface Level {
  level: number
  title: string
  titleHe: string
  minXP: number
  maxXP: number   // XP needed to reach next level (0 = max level)
}

const LEVELS: Level[] = [
  { level: 1,  title: 'Beginner',    titleHe: 'מתחיל',      minXP: 0,    maxXP: 100  },
  { level: 2,  title: 'Apprentice',  titleHe: 'חניך',        minXP: 100,  maxXP: 250  },
  { level: 3,  title: 'Player',      titleHe: 'נגן',         minXP: 250,  maxXP: 500  },
  { level: 4,  title: 'Musician',    titleHe: 'מוזיקאי',     minXP: 500,  maxXP: 900  },
  { level: 5,  title: 'Advanced',    titleHe: 'מתקדם',       minXP: 900,  maxXP: 1500 },
  { level: 6,  title: 'Expert',      titleHe: 'מומחה',       minXP: 1500, maxXP: 2500 },
  { level: 7,  title: 'Virtuoso',    titleHe: 'וירטואוז',    minXP: 2500, maxXP: 4000 },
  { level: 8,  title: 'Master',      titleHe: 'מאסטר',       minXP: 4000, maxXP: 6000 },
  { level: 9,  title: 'Legend',      titleHe: 'אגדה',        minXP: 6000, maxXP: 0    },
]

export function loadXP(): XPState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { total: 0 }
  } catch {
    return { total: 0 }
  }
}

export function saveXP(state: XPState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function addXP(amount: number): XPState {
  const prev = loadXP()
  const next = { total: prev.total + amount }
  saveXP(next)
  return next
}

export function getLevel(totalXP: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

/** XP progress within current level (0–1). */
export function getLevelProgress(totalXP: number): number {
  const lv = getLevel(totalXP)
  if (lv.maxXP === 0) return 1  // max level
  const inLevel = totalXP - lv.minXP
  const needed  = lv.maxXP - lv.minXP
  return Math.min(1, inLevel / needed)
}

/** XP needed to reach next level. */
export function xpToNextLevel(totalXP: number): number {
  const lv = getLevel(totalXP)
  if (lv.maxXP === 0) return 0
  return lv.maxXP - totalXP
}
