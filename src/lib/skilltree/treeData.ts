import type { CategoryId, Difficulty } from '../challenges/types'

// ── Node definition ───────────────────────────────────────────────────────────

export interface TreeNode {
  id: string
  categoryId: CategoryId
  difficulty: Difficulty
  titleHe: string
  titleEn: string
  descHe: string
  descEn: string
  /** IDs of nodes that must be complete (stars ≥ 1) before this unlocks. */
  requires: string[]
  xpReward: number
  /** SVG path for the node icon (24x24 viewBox). */
  icon: string
  /** Visual group label shown as a section divider above the first node of each group. */
  group?: { he: string; en: string }
}

// ── Tree nodes — linear Duolingo-style path ───────────────────────────────────

export const TREE_NODES: TreeNode[] = [

  // ═══ FOUNDATIONS ══════════════════════════════════════════════════════════
  {
    id: 'fret_easy',
    categoryId: 'fretboard',
    difficulty: 'easy',
    titleHe: 'פרטבורד — בסיס',
    titleEn: 'Fretboard Basics',
    descHe: 'תווים על מיתרים פתוחים ופרטים ראשונים',
    descEn: 'Notes on open strings and first frets',
    requires: [],
    xpReward: 20,
    icon: 'M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
    group: { he: 'יסודות', en: 'Foundations' },
  },
  {
    id: 'fret_medium',
    categoryId: 'fretboard',
    difficulty: 'medium',
    titleHe: 'פרטבורד — מתקדם',
    titleEn: 'Fretboard Mid',
    descHe: 'מיתרים פנימיים — סול, רה, לה',
    descEn: 'Inner strings — G, D, A',
    requires: ['fret_easy'],
    xpReward: 30,
    icon: 'M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
  },
  {
    id: 'fret_hard',
    categoryId: 'fretboard',
    difficulty: 'hard',
    titleHe: 'פרטבורד — מלא',
    titleEn: 'Full Neck',
    descHe: 'כל 12 התווים על כל הצוואר',
    descEn: 'All 12 notes across the full neck',
    requires: ['fret_medium'],
    xpReward: 45,
    icon: 'M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
  },
  {
    id: 'notes_easy',
    categoryId: 'note_reading',
    difficulty: 'easy',
    titleHe: 'קריאת תווים',
    titleEn: 'Note Reading',
    descHe: 'תווים בתוך החמשה המוסיקלית',
    descEn: 'Notes within the treble clef staff',
    requires: ['fret_easy'],
    xpReward: 25,
    icon: 'M9 3v12.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z',
  },
  {
    id: 'notes_medium',
    categoryId: 'note_reading',
    difficulty: 'medium',
    titleHe: 'קריאת תווים — מתקדם',
    titleEn: 'Note Reading II',
    descHe: 'קווי עזר ומרווחים מחוץ לחמשה',
    descEn: 'Ledger lines and spaces outside the staff',
    requires: ['notes_easy', 'fret_medium'],
    xpReward: 35,
    icon: 'M9 3v12.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z',
  },

  // ═══ INTERVALS ════════════════════════════════════════════════════════════
  {
    id: 'intervals_easy',
    categoryId: 'intervals_theory',
    difficulty: 'easy',
    titleHe: 'אינטרוולים I',
    titleEn: 'Intervals I',
    descHe: 'חצי-טון, טון שלם, טרצות — על תווים טבעיים',
    descEn: 'Semitones, whole steps, thirds — natural notes only',
    requires: ['fret_medium', 'notes_easy'],
    xpReward: 30,
    icon: 'M4 20V4h2v16H4zm14 0V4h2v16h-2zM9 8h6v2H9V8zm0 6h6v2H9v-2z',
    group: { he: 'אינטרוולים', en: 'Intervals' },
  },
  {
    id: 'intervals_medium',
    categoryId: 'intervals_theory',
    difficulty: 'medium',
    titleHe: 'אינטרוולים II',
    titleEn: 'Intervals II',
    descHe: 'כל 12 התווים — כולל דיאזים ובמולים',
    descEn: 'All 12 notes — sharps and flats included',
    requires: ['intervals_easy'],
    xpReward: 40,
    icon: 'M4 20V4h2v16H4zm14 0V4h2v16h-2zM9 8h6v2H9V8zm0 6h6v2H9v-2z',
  },
  {
    id: 'intervals_hard',
    categoryId: 'intervals_theory',
    difficulty: 'hard',
    titleHe: 'אינטרוולים III',
    titleEn: 'Intervals III',
    descHe: 'קווינטות, ספטימות, היפוכים — בלחץ',
    descEn: 'Fifths, sevenths, inversions — under pressure',
    requires: ['intervals_medium'],
    xpReward: 50,
    icon: 'M4 20V4h2v16H4zm14 0V4h2v16h-2zM9 8h6v2H9V8zm0 6h6v2H9v-2z',
  },

  // ═══ CIRCLE OF FIFTHS ═════════════════════════════════════════════════════
  {
    id: 'circle_easy',
    categoryId: 'circle_of_fifths',
    difficulty: 'easy',
    titleHe: 'מעגל החמישיות I',
    titleEn: 'Circle of Fifths I',
    descHe: 'סולמות קרובים — C, G, D, A, F',
    descEn: 'Close keys — C, G, D, A, F',
    requires: ['intervals_easy'],
    xpReward: 35,
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
    group: { he: 'הרמוניה', en: 'Harmony' },
  },
  {
    id: 'circle_medium',
    categoryId: 'circle_of_fifths',
    difficulty: 'medium',
    titleHe: 'מעגל החמישיות II',
    titleEn: 'Circle of Fifths II',
    descHe: 'כל 12 הסולמות, רלטיב מינור, אקורדים דיאטוניים',
    descEn: 'All 12 keys, relative minors, diatonic chords',
    requires: ['circle_easy'],
    xpReward: 45,
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
  },
  {
    id: 'circle_hard',
    categoryId: 'circle_of_fifths',
    difficulty: 'hard',
    titleHe: 'מעגל החמישיות III',
    titleEn: 'Circle of Fifths III',
    descHe: 'אנהרמוניה, מינוריים, מודולציות',
    descEn: 'Enharmonics, minors, modulations',
    requires: ['circle_medium'],
    xpReward: 55,
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
  },

  // ═══ CHORDS ═══════════════════════════════════════════════════════════════
  {
    id: 'chords_easy',
    categoryId: 'chord_construction',
    difficulty: 'easy',
    titleHe: 'אקורדים I',
    titleEn: 'Chords I',
    descHe: 'טריאדות על שורשים טבעיים — מז׳ור, מינור, מוקטן',
    descEn: 'Triads on natural roots — major, minor, dim',
    requires: ['intervals_easy'],
    xpReward: 35,
    icon: 'M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z',
    group: { he: 'אקורדים', en: 'Chords' },
  },
  {
    id: 'chords_medium',
    categoryId: 'chord_construction',
    difficulty: 'medium',
    titleHe: 'אקורדים II',
    titleEn: 'Chords II',
    descHe: 'טריאדות על כל 12 השורשים',
    descEn: 'Triads on all 12 roots',
    requires: ['chords_easy'],
    xpReward: 45,
    icon: 'M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z',
  },
  {
    id: 'chords_hard',
    categoryId: 'chord_construction',
    difficulty: 'hard',
    titleHe: 'אקורדי ספטימה',
    titleEn: 'Seventh Chords',
    descHe: 'maj7, m7, dom7, m7b5 — על כל השורשים',
    descEn: 'maj7, m7, dom7, m7b5 — all roots',
    requires: ['chords_medium', 'circle_easy'],
    xpReward: 60,
    icon: 'M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z',
  },

  // ═══ SCALES ════════════════════════════════════════════════════════════════
  {
    id: 'scales_easy',
    categoryId: 'scale_construction',
    difficulty: 'easy',
    titleHe: 'סולמות I',
    titleEn: 'Scales I',
    descHe: 'מז׳ור ומינור טבעי על שורשים טבעיים',
    descEn: 'Major and natural minor on natural roots',
    requires: ['chords_easy'],
    xpReward: 35,
    icon: 'M3 3h2v18H3V3zm16 0h2v18h-2V3zM7 7h2v14H7V7zm4-4h2v18h-2V3zm4 4h2v14h-2V7z',
    group: { he: 'סולמות', en: 'Scales' },
  },
  {
    id: 'scales_medium',
    categoryId: 'scale_construction',
    difficulty: 'medium',
    titleHe: 'סולמות II',
    titleEn: 'Scales II',
    descHe: 'מז׳ור, מינור, פנטטוני — כל 12 השורשים',
    descEn: 'Major, minor, pentatonic — all 12 roots',
    requires: ['scales_easy'],
    xpReward: 45,
    icon: 'M3 3h2v18H3V3zm16 0h2v18h-2V3zM7 7h2v14H7V7zm4-4h2v18h-2V3zm4 4h2v14h-2V7z',
  },
  {
    id: 'scales_hard',
    categoryId: 'scale_construction',
    difficulty: 'hard',
    titleHe: 'סולמות III — מודוסים',
    titleEn: 'Scales III — Modes',
    descHe: 'פריגי, לידי, מיקסולידי, לוקרי, הרמוני מינור',
    descEn: 'Phrygian, Lydian, Mixolydian, Locrian, harmonic minor',
    requires: ['scales_medium'],
    xpReward: 60,
    icon: 'M3 3h2v18H3V3zm16 0h2v18h-2V3zM7 7h2v14H7V7zm4-4h2v18h-2V3zm4 4h2v14h-2V7z',
  },
]
