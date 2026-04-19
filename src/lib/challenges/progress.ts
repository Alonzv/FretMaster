import type { CategoryId, CategoryProgress, Difficulty, SessionResult } from './types'
import { CATEGORIES } from './categories'
import { supabase } from '../supabase'

const STORAGE_KEY = 'fm_progress_v1'

// Default progress record for a category the user has never touched.
function emptyProgress(categoryId: CategoryId): CategoryProgress {
  return {
    categoryId,
    sessionsPlayed: 0,
    bestAccuracy: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    xp: 0,
    unlockedDifficulty: 'easy',
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

  // Update accuracy / totals / xp.
  const next: CategoryProgress = {
    ...prev,
    sessionsPlayed: prev.sessionsPlayed + 1,
    bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
    totalCorrect: prev.totalCorrect + result.correct,
    totalAnswered: prev.totalAnswered + result.total,
    xp: prev.xp + result.xpEarned,
    unlockedDifficulty: prev.unlockedDifficulty,
    mastery: prev.mastery,
  }

  // Unlock higher difficulty after 2 sessions at 3★ on the current level.
  if (result.stars === 3) {
    const starCount = countThreeStarSessions(prev, result)
    if (starCount >= 2) {
      if (result.difficulty === 'easy' && next.unlockedDifficulty === 'easy') {
        next.unlockedDifficulty = 'medium'
      } else if (result.difficulty === 'medium' && next.unlockedDifficulty === 'medium') {
        next.unlockedDifficulty = 'hard'
      }
    }
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

// We don't persist a full session history locally (it would balloon), so we approximate
// "2 × 3★" by counting current-session 3★ plus a heuristic: if best accuracy was already
// ≥ 0.9 in this difficulty, we consider the user to have achieved it before.
function countThreeStarSessions(prev: CategoryProgress, _result: SessionResult): number {
  const thisOne = 1
  const prior = prev.bestAccuracy >= 0.9 ? 1 : 0
  return thisOne + prior
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

// Difficulty gating UI helper.
export function isDifficultyUnlocked(progress: CategoryProgress, difficulty: Difficulty): boolean {
  const order: Difficulty[] = ['easy', 'medium', 'hard']
  return order.indexOf(difficulty) <= order.indexOf(progress.unlockedDifficulty)
}
