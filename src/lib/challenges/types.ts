// Difficulty of an individual question / challenge session
export type Difficulty = 'easy' | 'medium' | 'hard'

// Stable identifiers for every challenge category in the app.
// Keep them stable — they are used as keys in the Supabase progress table.
export type CategoryId =
  | 'fretboard'
  | 'note_reading'
  | 'intervals_theory'
  | 'circle_of_fifths'
  | 'chord_construction'
  | 'scale_construction'
  | 'chords_in_key'
  // Phase 2 (ear training)
  | 'intervals_ear'
  | 'chord_quality'
  | 'chord_progressions'
  | 'scale_id'
  // Phase 3 (Pitchy.js)
  | 'play_interval'
  | 'find_note_fretboard'
  // Genre theory
  | 'genre_blues'
  | 'genre_rock'
  | 'genre_jazz'
  | 'genre_country'
  | 'genre_metal'
  | 'genre_folk'
  | 'genre_funk'

export interface CategoryMeta {
  id: CategoryId
  titleHe: string
  titleEn: string
  descHe: string
  descEn: string
  phase: 1 | 2 | 3
  // Icon path (SVG path `d` attribute, 24x24 viewBox).
  icon: string
}

// A bilingual string: each question stores both languages so the UI can swap freely.
export interface Bilingual {
  he: string
  en: string
}

// A single multiple-choice question produced by a generator.
export interface Question {
  id: string
  categoryId: CategoryId
  difficulty: Difficulty
  prompt: Bilingual
  // Optional visual payload (e.g. fretboard position to draw).
  visual?: QuestionVisual
  // Optional audio payload (Phase 2).
  audio?: QuestionAudio
  choices: Bilingual[]
  correctIndex: number
  explanation: Bilingual
  theory: Bilingual
}

export type QuestionVisual =
  | {
      kind: 'fret'
      // Guitar string, 1 = high e (thin), 6 = low E (thick).
      string: 1 | 2 | 3 | 4 | 5 | 6
      // Fret 0 means open string.
      fret: number
    }
  | {
      kind: 'staff'
      // Staff step: 0 = middle C, +1 per white-key step upward.
      staffStep: number
      accidental?: '' | '#' | 'b'
    }

export interface QuestionAudio {
  kind: 'notes' | 'chord' | 'progression'
  // Note names in scientific pitch notation, e.g. "C4".
  notes: string[]
}

// A completed session (10 questions by default).
export interface SessionResult {
  categoryId: CategoryId
  difficulty: Difficulty
  total: number
  correct: number
  xpEarned: number
  stars: 1 | 2 | 3
  startedAt: number
  finishedAt: number
}

// Per-category aggregated progress (stored locally + synced to Supabase).
export interface CategoryProgress {
  categoryId: CategoryId
  sessionsPlayed: number
  bestAccuracy: number
  totalCorrect: number
  totalAnswered: number
  xp: number
  // medium unlocks after 2×3★ on easy; hard after 2×3★ on medium.
  unlockedDifficulty: Difficulty
  mastery: 'none' | 'bronze' | 'silver' | 'gold'
}

export type QuestionGenerator = (difficulty: Difficulty) => Question
