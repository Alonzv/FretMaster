import type { CategoryId } from '../challenges/types'

export interface Topic {
  id: CategoryId
  titleHe: string
  titleEn: string
  descHe: string
  descEn: string
  stage: 1 | 2 | 3
  icon: string          // SVG path, 24×24 viewBox
  color: string         // CSS color for the card accent
  nodeCount: number     // how many nodes in this topic's tree
}

// ── Stage 1 — Foundations ─────────────────────────────────────────────────────

export const TOPICS: Topic[] = [
  {
    id: 'major_scale',
    titleHe: 'הסולם המז׳ורי',
    titleEn: 'Major Scale',
    descHe: 'נוסחה, מפתחות, תווים — הבסיס של הכל',
    descEn: 'Formula, keys, notes — the root of all theory',
    stage: 1,
    icon: 'M12 3l1.45 4.47H18l-3.73 2.71 1.42 4.38L12 11.9l-3.69 2.66 1.42-4.38L6 7.47h4.55L12 3z',
    color: '#7C3AED',
    nodeCount: 25,
  },
  {
    id: 'intervals_theory',
    titleHe: 'אינטרוולים',
    titleEn: 'Intervals',
    descHe: 'מרחקים, איכויות, היפוכים — שפת המוזיקה',
    descEn: 'Distances, qualities, inversions — the language of music',
    stage: 1,
    icon: 'M4 20V4h2v16H4zm14 0V4h2v16h-2zM9 8h6v2H9V8zm0 6h6v2H9v-2z',
    color: '#2563EB',
    nodeCount: 25,
  },
  {
    id: 'chord_construction',
    titleHe: 'טריאדות ואקורדים',
    titleEn: 'Triads & Chords',
    descHe: 'מז׳ור, מינור, מוגדל, מוקטן — הבנייה המלאה',
    descEn: 'Major, minor, augmented, diminished — full construction',
    stage: 1,
    icon: 'M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z',
    color: '#059669',
    nodeCount: 25,
  },
  {
    id: 'circle_of_fifths',
    titleHe: 'מעגל החמישיות',
    titleEn: 'Circle of Fifths',
    descHe: 'מפתחות, סימני דיאז, קרבה הרמונית',
    descEn: 'Keys, accidentals, harmonic relationships',
    stage: 1,
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
    color: '#D97706',
    nodeCount: 25,
  },

  // ── Stage 2 — Intermediate ────────────────────────────────────────────────

  {
    id: 'diatonic_harmony',
    titleHe: 'הרמוניה דיאטונית',
    titleEn: 'Diatonic Harmony',
    descHe: 'אקורדים בתוך הסולם, דרגות, פרוגרסיות',
    descEn: 'Chords within the key, scale degrees, progressions',
    stage: 2,
    icon: 'M3 12h4l3-9 4 18 3-9h4',
    color: '#DC2626',
    nodeCount: 25,
  },
  {
    id: 'caged_system',
    titleHe: 'מערכת CAGED',
    titleEn: 'CAGED System',
    descHe: 'צורות אקורד ומיפוי הצוואר לאורכו',
    descEn: 'Chord shapes and full-neck mapping',
    stage: 2,
    icon: 'M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
    color: '#7C3AED',
    nodeCount: 25,
  },
  {
    id: 'seventh_chords',
    titleHe: 'אקורדי ספטימה',
    titleEn: 'Seventh Chords',
    descHe: 'maj7, dom7, m7, m7b5, dim7 — בניה ושימוש',
    descEn: 'maj7, dom7, m7, m7b5, dim7 — construction & use',
    stage: 2,
    icon: 'M6 3h12v18H6V3zm2 2v14h8V5H8z',
    color: '#0891B2',
    nodeCount: 25,
  },
  {
    id: 'pentatonic_blues',
    titleHe: 'פנטטוני ובלוז',
    titleEn: 'Pentatonic & Blues',
    descHe: 'מינורי, מז׳ורי, סולם בלוז, תיבות נגינה',
    descEn: 'Minor, major, blues scale, box patterns',
    stage: 2,
    icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3z',
    color: '#B45309',
    nodeCount: 25,
  },
  {
    id: 'minor_scales',
    titleHe: 'סולמות מינוריים',
    titleEn: 'Minor Scales',
    descHe: 'טבעי, הרמוני, מלודי — ההבדלים והשימושים',
    descEn: 'Natural, harmonic, melodic — differences & uses',
    stage: 2,
    icon: 'M3 3h2v18H3V3zm16 0h2v18h-2V3zM7 7h2v14H7V7zm4-4h2v18h-2V3zm4 4h2v14h-2V7z',
    color: '#4F46E5',
    nodeCount: 25,
  },

  // ── Stage 3 — Advanced ────────────────────────────────────────────────────

  {
    id: 'modes_theory',
    titleHe: 'מודוסים',
    titleEn: 'Modes',
    descHe: 'Dorian, Phrygian, Lydian, Mixolydian ועוד',
    descEn: 'Dorian, Phrygian, Lydian, Mixolydian & more',
    stage: 3,
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    color: '#6D28D9',
    nodeCount: 25,
  },
  {
    id: 'modal_interchange',
    titleHe: 'החלפת מודוסים',
    titleEn: 'Modal Interchange',
    descHe: 'השאלת אקורדים ממינורי מקביל, בורוינג',
    descEn: 'Borrowing chords from parallel minor, borrowing',
    stage: 3,
    icon: 'M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4',
    color: '#BE185D',
    nodeCount: 25,
  },
  {
    id: 'voice_leading',
    titleHe: 'ניהול קולות וחלוקות',
    titleEn: 'Voice Leading & Inversions',
    descHe: 'היפוכים, תנועה חלקה, תזמור',
    descEn: 'Inversions, smooth voice motion, voicings',
    stage: 3,
    icon: 'M9 3v12.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z',
    color: '#0F766E',
    nodeCount: 25,
  },
  {
    id: 'polyrhythm',
    titleHe: 'פולירית׳ם',
    titleEn: 'Polyrhythm',
    descHe: 'ריתמים מקבילים, טריפלטים, ×3 מול ×2',
    descEn: 'Simultaneous rhythms, triplets, 3-against-2',
    stage: 3,
    icon: 'M4 11h16v2H4v-2zm0-6h16v2H4V5zm0 12h10v2H4v-2z',
    color: '#B45309',
    nodeCount: 25,
  },
  {
    id: 'chord_soloing',
    titleHe: 'סולו על אקורדים',
    titleEn: 'Chord-Tone Soloing',
    descHe: 'ארפג׳יו, תווי אקורד, מסלולים על הצוואר',
    descEn: 'Arpeggios, chord tones, paths across the neck',
    stage: 3,
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 2l-9-5v6l9 5 9-5v-6l-9 5z',
    color: '#7C3AED',
    nodeCount: 25,
  },
]

export function getTopicsByStage(stage: 1 | 2 | 3): Topic[] {
  return TOPICS.filter(t => t.stage === stage)
}
