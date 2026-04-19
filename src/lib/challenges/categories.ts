import type { CategoryId, CategoryMeta, QuestionGenerator } from './types'
import { generateFretboardQuestion }         from './generators/fretboard'
import { generateIntervalTheoryQuestion }    from './generators/intervals'
import { generateCircleOfFifthsQuestion }    from './generators/circleOfFifths'
import { generateNoteReadingQuestion }       from './generators/noteReading'
import { generateChordConstructionQuestion } from './generators/chordConstruction'
import { generateScaleConstructionQuestion } from './generators/scaleConstruction'

// Every category registered in the app. Phase 2/3 entries have `generator: null` and
// render as "coming soon" in the UI.
export interface CategoryEntry extends CategoryMeta {
  generator: QuestionGenerator | null
}

export const CATEGORIES: CategoryEntry[] = [
  // ── Phase 1: theory, multiple-choice ────────────────────────────────────
  {
    id: 'fretboard',
    titleHe: 'הפרטבורד',
    titleEn: 'Fretboard',
    descHe: 'זיהוי תווים על הצוואר',
    descEn: 'Identify notes across the neck',
    phase: 1,
    icon: 'M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
    generator: generateFretboardQuestion,
  },
  {
    id: 'note_reading',
    titleHe: 'קריאת תווים',
    titleEn: 'Note Reading',
    descHe: 'זיהוי תווים על החמשה',
    descEn: 'Read notes on the staff',
    phase: 1,
    icon: 'M9 3v12.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z',
    generator: generateNoteReadingQuestion,
  },
  {
    id: 'intervals_theory',
    titleHe: 'אינטרוולים',
    titleEn: 'Intervals',
    descHe: 'מרחקים בין תווים',
    descEn: 'Distances between notes',
    phase: 1,
    icon: 'M4 20V4h2v16H4zm14 0V4h2v16h-2zM9 8h6v2H9V8zm0 6h6v2H9v-2z',
    generator: generateIntervalTheoryQuestion,
  },
  {
    id: 'circle_of_fifths',
    titleHe: 'מעגל החמישיות',
    titleEn: 'Circle of Fifths',
    descHe: 'סולמות, אקורדים, קרבה הרמונית',
    descEn: 'Keys, chords, harmonic relationships',
    phase: 1,
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
    generator: generateCircleOfFifthsQuestion,
  },
  {
    id: 'chord_construction',
    titleHe: 'בניית אקורדים',
    titleEn: 'Chord Construction',
    descHe: 'אילו תווים יש בכל אקורד',
    descEn: 'Which notes make up each chord',
    phase: 1,
    icon: 'M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z',
    generator: generateChordConstructionQuestion,
  },
  {
    id: 'scale_construction',
    titleHe: 'בניית סולמות',
    titleEn: 'Scale Construction',
    descHe: 'אילו תווים יש בכל סולם',
    descEn: 'Which notes make up each scale',
    phase: 1,
    icon: 'M3 3h2v18H3V3zm16 0h2v18h-2V3zM7 7h2v14H7V7zm4-4h2v18h-2V3zm4 4h2v14h-2V7z',
    generator: generateScaleConstructionQuestion,
  },

  // ── Phase 1: additional theory (not yet shipped) ────────────────────────
  {
    id: 'chords_in_key',
    titleHe: 'אקורדים בסולם',
    titleEn: 'Chords in a Key',
    descHe: 'איזה אקורד בדרגה איזו',
    descEn: 'Which chord sits on which degree',
    phase: 1,
    icon: 'M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z',
    generator: null,
  },

  // ── Phase 2: ear training ───────────────────────────────────────────────
  {
    id: 'intervals_ear',
    titleHe: 'אינטרוולים לאוזן',
    titleEn: 'Intervals by Ear',
    descHe: 'שמע שני תווים — מה האינטרוול?',
    descEn: 'Hear two notes — what is the interval?',
    phase: 2,
    icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
    generator: null,
  },
  {
    id: 'chord_quality',
    titleHe: 'איכות אקורד',
    titleEn: 'Chord Quality',
    descHe: 'מז׳ור / מינור / מוקטן / מוגדל',
    descEn: 'Major / minor / diminished / augmented',
    phase: 2,
    icon: 'M6 3h12v18H6V3zm2 2v14h8V5H8z',
    generator: null,
  },
  {
    id: 'chord_progressions',
    titleHe: 'פרוגרסיות אקורדים',
    titleEn: 'Chord Progressions',
    descHe: 'שמע פרוגרסיה — זהה את הדרגות',
    descEn: 'Hear a progression — name the degrees',
    phase: 2,
    icon: 'M3 12h4l3-9 4 18 3-9h4',
    generator: null,
  },
  {
    id: 'scale_id',
    titleHe: 'זיהוי סולם',
    titleEn: 'Scale ID',
    descHe: 'מז׳ור, מינור, פנטטוני, מודוסים',
    descEn: 'Major, minor, pentatonic, modes',
    phase: 2,
    icon: 'M4 11h16v2H4v-2zm0-6h16v2H4V5zm0 12h10v2H4v-2z',
    generator: null,
  },

  // ── Phase 3: play-with-guitar (Pitchy.js) ───────────────────────────────
  {
    id: 'play_interval',
    titleHe: 'נגן אינטרוול',
    titleEn: 'Play the Interval',
    descHe: 'נגן בגיטרה את האינטרוול המבוקש',
    descEn: 'Play the requested interval on the guitar',
    phase: 3,
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 2l-9-5v6l9 5 9-5v-6l-9 5z',
    generator: null,
  },
  {
    id: 'find_note_fretboard',
    titleHe: 'מצא תו בצוואר',
    titleEn: 'Find the Note',
    descHe: 'נגן תו ספציפי על מיתר ספציפי',
    descEn: 'Play a specific note on a specific string',
    phase: 3,
    icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zm-9 3a3 3 0 1 0-3-3 3 3 0 0 0 3 3z',
    generator: null,
  },
]

export function getCategory(id: CategoryId): CategoryEntry | undefined {
  return CATEGORIES.find(c => c.id === id)
}
