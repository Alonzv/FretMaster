import type { CategoryId, CategoryProgress, Difficulty, SessionResult } from './types'
import { CATEGORIES } from './categories'
import { supabase } from '../supabase'

const STORAGE_KEY = 'fm_progress_v1'

// Default progress record for a category the user has never touched.
// Note: difficulty locking has been removed — every difficulty is always available.
// `unlockedDifficulty` is kept for back-compat with stored data; nothing reads it for gating.
function emptyProgress(categoryId: CategoryId): CategoryProgress {
  return {
    categoryId,
    sessionsPlayed: 0,
    bestAccuracy: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    xp: 0,
    unlockedDifficulty: 'hard',
    mastery: 'none',
  }
}

// Load all progress records from localStorage (fast, offline-safe). Supabase sync is
// best-effort and happens in the background.
export function loadAllProgress(): Record<CategoryId, CategoryProgress> {
  const base = {} as Record<CategoryId, CategoryProgress>
  for (const c of CATEGORIES) base[c.id] = emptyProgress(c.id)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const stored = JSON.parse(raw) as Partial<Record<CategoryId, CategoryProgress>>
    for (const id of Object.keys(stored) as CategoryId[]) {
      if (stored[id]) base[id] = { ...emptyProgress(id), ...stored[id] } as CategoryProgress
    }
  } catch {
    // ignore — return defaults
  }
  return base
}

function saveAllProgress(all: Record<CategoryId, CategoryProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

// Apply a finished session to the stored progress map and return the updated map.
// Handles unlock logic and mastery upgrades.
export function applySessionResult(
  all: Record<CategoryId, CategoryProgress>,
  result: SessionResult,
): Record<CategoryId, CategoryProgress> {
  const prev = all[result.categoryId] ?? emptyProgress(result.categoryId)
  const accuracy = result.total > 0 ? result.correct / result.total : 0

  // Update accuracy / totals / xp. All difficulties are always unlocked.
  const next: CategoryProgress = {
    ...prev,
    sessionsPlayed: prev.sessionsPlayed + 1,
    bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
    totalCorrect: prev.totalCorrect + result.correct,
    totalAnswered: prev.totalAnswered + result.total,
    xp: prev.xp + result.xpEarned,
    unlockedDifficulty: 'hard',
    mastery: prev.mastery,
  }

  // Mastery tiers based on cumulative 3★ sessions and XP.
  if (next.xp >= 2000) next.mastery = 'gold'
  else if (next.xp >= 800) next.mastery = 'silver'
  else if (next.xp >= 200) next.mastery = 'bronze'

  const updated = { ...all, [result.categoryId]: next }
  saveAllProgress(updated)

  // Fire-and-forget Supabase sync.
  void syncProgressToSupabase(result.categoryId, next)
  return updated
}

// Best-effort sync — failures are swallowed so the app keeps working offline.
async function syncProgressToSupabase(categoryId: CategoryId, progress: CategoryProgress) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('category_progress').upsert({
      user_id: user.id,
      category_id: categoryId,
      sessions_played:    progress.sessionsPlayed,
      best_accuracy:      progress.bestAccuracy,
      total_correct:      progress.totalCorrect,
      total_answered:     progress.totalAnswered,
      xp:                 progress.xp,
      unlocked_difficulty: progress.unlockedDifficulty,
      mastery:            progress.mastery,
      updated_at:         new Date().toISOString(),
    }, { onConflict: 'user_id,category_id' })
  } catch {
    // offline or table missing — ignore
  }
}

// Aggregate XP across all categories.
export function totalXP(all: Record<CategoryId, CategoryProgress>): number {
  return Object.values(all).reduce((sum, p) => sum + p.xp, 0)
}

// Difficulty gating UI helper. Locking has been removed — every difficulty is always
// available. Kept as a function so existing callers don't break.
export function isDifficultyUnlocked(_progress: CategoryProgress, _difficulty: Difficulty): boolean {
  return true
}
