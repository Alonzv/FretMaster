import type { Difficulty, Question, SessionResult, CategoryId } from './types'
import { getCategory } from './categories'

export const SESSION_LENGTH = 10

// XP reward per correct answer by difficulty.
const XP_PER_CORRECT: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 20,
}

// Generates a full session of questions for one category/difficulty.
// Re-rolls if the generator happens to produce the same question twice in a row.
export function buildSession(categoryId: CategoryId, difficulty: Difficulty, length = SESSION_LENGTH): Question[] {
  const cat = getCategory(categoryId)
  if (!cat || !cat.generator) {
    throw new Error(`No generator for category ${categoryId}`)
  }
  const questions: Question[] = []
  let lastPrompt = ''
  let attempts = 0
  while (questions.length < length && attempts < length * 5) {
    const q = cat.generator(difficulty)
    attempts++
    if (q.prompt.en === lastPrompt) continue
    questions.push(q)
    lastPrompt = q.prompt.en
  }
  return questions
}

export function scoreSession(
  categoryId: CategoryId,
  difficulty: Difficulty,
  answers: boolean[],
  startedAt: number,
): SessionResult {
  const correct = answers.filter(Boolean).length
  const total = answers.length
  const accuracy = total > 0 ? correct / total : 0
  const xpEarned = correct * XP_PER_CORRECT[difficulty]
  const stars: 1 | 2 | 3 =
    accuracy >= 0.9 ? 3 :
    accuracy >= 0.7 ? 2 : 1

  return {
    categoryId,
    difficulty,
    total,
    correct,
    xpEarned,
    stars,
    startedAt,
    finishedAt: Date.now(),
  }
}
