/**
 * difficultySchema.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central configuration for the FretMaster procedural question engine.
 *
 * Every musical concept is tagged with the exact string that Tonal.js expects,
 * so the Generator Engine can call `Scale.get()`, `Note.transpose()`, and
 * `Chord.get()` directly without any string manipulation.
 *
 * Three difficulty tiers mirror the existing `Difficulty` type in types.ts:
 *   easy   → Beginner   (natural notes, major/minor, consonant intervals, triads)
 *   medium → Intermediate (all 12 roots, 7th chords, pentatonic/blues, all intervals)
 *   hard   → Advanced    (all modes, extended chords, compound intervals)
 */

import type { Difficulty } from '../challenges/types'

// ─────────────────────────────────────────────────────────────────────────────
// Primitive specs — every entry carries both display labels and the exact
// identifier that Tonal.js consumes.
// ─────────────────────────────────────────────────────────────────────────────

export interface IntervalSpec {
  /** Tonal.js interval string, e.g. '3M' = major third, '5P' = perfect fifth.
   *  Prefix with '-' to go downward: '-3M' = major third below. */
  tonal: string
  /** Human-readable abbreviation, e.g. 'M3' */
  shortEn: string
  nameHe: string
  nameEn: string
  semitones: number
}

export interface ScaleSpec {
  /** Tonal.js scale-type name — used as `Scale.get('${root} ${tonal}')`.
   *  Tonal expects lowercase: 'major', 'minor', 'dorian', 'harmonic minor', … */
  tonal: string
  nameHe: string
  nameEn: string
}

export interface ChordSpec {
  /** Appended directly to the root: `Chord.get('${root}${suffix}')`.
   *  Examples: '' (major triad), 'm', 'maj7', 'm7', '7', 'dim7', 'M9' */
  suffix: string
  nameHe: string
  nameEn: string
  /** Number of notes — used to limit degree choices for chord-tone questions */
  toneCount: number
}

export type QuestionTemplateKind =
  | 'scale_degree'   // "What is degree N of [Root] [Scale]?"      → pitchTarget
  | 'interval_above' // "Play a [Interval] above [Note]"            → pitchTarget
  | 'interval_below' // "Play a [Interval] below [Note]"            → pitchTarget
  | 'interval_id'    // "What interval is from [Note] to [Note]?"   → MCQ only
  | 'chord_tone'     // "What is note N of [Root][Chord]?"          → pitchTarget

export interface DifficultyConfig {
  level: Difficulty

  /** Root note names (pitch classes) that Tonal.js accepts, e.g. 'C', 'F#', 'Bb' */
  allowedRoots: string[]

  allowedScales: ScaleSpec[]
  allowedIntervals: IntervalSpec[]
  allowedChords: ChordSpec[]

  /** 1-based scale degrees the engine may ask about (1 = tonic, 7 = leading tone) */
  allowedDegrees: number[]

  allowedTemplates: QuestionTemplateKind[]

  /** Octave used as the "home base" when computing pitch targets.
   *  3 → C3–B3 range, comfortable mid-register for guitar. */
  defaultOctave: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Complete interval catalog (Tonal.js format)
// ─────────────────────────────────────────────────────────────────────────────

/** All intervals the engine knows about, from a major 2nd to a major 9th. */
export const ALL_INTERVALS: IntervalSpec[] = [
  { tonal: '2M',  shortEn: 'M2',  nameHe: 'סקונדה גדולה',       nameEn: 'Major 2nd',        semitones: 2  },
  { tonal: '3m',  shortEn: 'm3',  nameHe: 'טרצה קטנה',           nameEn: 'Minor 3rd',        semitones: 3  },
  { tonal: '3M',  shortEn: 'M3',  nameHe: 'טרצה גדולה',          nameEn: 'Major 3rd',        semitones: 4  },
  { tonal: '4P',  shortEn: 'P4',  nameHe: 'קוורטה זכה',          nameEn: 'Perfect 4th',      semitones: 5  },
  { tonal: '4A',  shortEn: 'TT',  nameHe: 'טריטון',               nameEn: 'Tritone',          semitones: 6  },
  { tonal: '5P',  shortEn: 'P5',  nameHe: 'קווינטה זכה',         nameEn: 'Perfect 5th',      semitones: 7  },
  { tonal: '6m',  shortEn: 'm6',  nameHe: 'סקסטה קטנה',          nameEn: 'Minor 6th',        semitones: 8  },
  { tonal: '6M',  shortEn: 'M6',  nameHe: 'סקסטה גדולה',         nameEn: 'Major 6th',        semitones: 9  },
  { tonal: '7m',  shortEn: 'm7',  nameHe: 'ספטימה קטנה',         nameEn: 'Minor 7th',        semitones: 10 },
  { tonal: '7M',  shortEn: 'M7',  nameHe: 'ספטימה גדולה',        nameEn: 'Major 7th',        semitones: 11 },
  { tonal: '8P',  shortEn: 'P8',  nameHe: 'אוקטבה',              nameEn: 'Perfect Octave',   semitones: 12 },
  // Augmented / diminished (hard only)
  { tonal: '2m',  shortEn: 'm2',  nameHe: 'סקונדה קטנה',         nameEn: 'Minor 2nd',        semitones: 1  },
  { tonal: '5A',  shortEn: 'A5',  nameHe: 'קווינטה מוגדלת',      nameEn: 'Augmented 5th',    semitones: 8  },
  { tonal: '5d',  shortEn: 'd5',  nameHe: 'קווינטה מוקטנת',      nameEn: 'Diminished 5th',   semitones: 6  },
  // Compound (hard only)
  { tonal: '9M',  shortEn: 'M9',  nameHe: 'נונה גדולה',          nameEn: 'Major 9th',        semitones: 14 },
  { tonal: '9m',  shortEn: 'm9',  nameHe: 'נונה קטנה',           nameEn: 'Minor 9th',        semitones: 13 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Scale catalog
// ─────────────────────────────────────────────────────────────────────────────

const SCALE_MAJOR:          ScaleSpec = { tonal: 'major',           nameHe: 'מז׳ור',               nameEn: 'Major'           }
const SCALE_MINOR:          ScaleSpec = { tonal: 'minor',           nameHe: 'מינור טבעי',          nameEn: 'Natural Minor'   }
const SCALE_HARMONIC_MINOR: ScaleSpec = { tonal: 'harmonic minor',  nameHe: 'מינור הרמוני',       nameEn: 'Harmonic Minor'  }
const SCALE_MELODIC_MINOR:  ScaleSpec = { tonal: 'melodic minor',   nameHe: 'מינור מלודי',        nameEn: 'Melodic Minor'   }
const SCALE_PENTATONIC_MAJ: ScaleSpec = { tonal: 'major pentatonic',nameHe: 'פנטטוני מז׳ור',       nameEn: 'Major Pentatonic'}
const SCALE_PENTATONIC_MIN: ScaleSpec = { tonal: 'minor pentatonic',nameHe: 'פנטטוני מינור',       nameEn: 'Minor Pentatonic'}
const SCALE_BLUES:          ScaleSpec = { tonal: 'blues',           nameHe: 'בלוז',                nameEn: 'Blues'           }
const SCALE_DORIAN:         ScaleSpec = { tonal: 'dorian',          nameHe: 'דוריאן',              nameEn: 'Dorian'          }
const SCALE_PHRYGIAN:       ScaleSpec = { tonal: 'phrygian',        nameHe: 'פריגי',               nameEn: 'Phrygian'        }
const SCALE_LYDIAN:         ScaleSpec = { tonal: 'lydian',          nameHe: 'לידי',                nameEn: 'Lydian'          }
const SCALE_MIXOLYDIAN:     ScaleSpec = { tonal: 'mixolydian',      nameHe: 'מיקסולידי',           nameEn: 'Mixolydian'      }
const SCALE_LOCRIAN:        ScaleSpec = { tonal: 'locrian',         nameHe: 'לוקרי',               nameEn: 'Locrian'         }
const SCALE_ALTERED:        ScaleSpec = { tonal: 'altered',         nameHe: 'אלטרד',               nameEn: 'Altered'         }
const SCALE_WHOLE_TONE:     ScaleSpec = { tonal: 'whole tone',      nameHe: 'טונים שלמים',         nameEn: 'Whole Tone'      }
const SCALE_DIMINISHED:     ScaleSpec = { tonal: 'diminished',      nameHe: 'מוקטן (מלא-חצי)',     nameEn: 'Diminished'      }

// ─────────────────────────────────────────────────────────────────────────────
// Chord catalog
// ─────────────────────────────────────────────────────────────────────────────

const CHORD_MAJOR:    ChordSpec = { suffix: 'M',    nameHe: 'מז׳ור',          nameEn: 'Major',            toneCount: 3 }
const CHORD_MINOR:    ChordSpec = { suffix: 'm',    nameHe: 'מינור',           nameEn: 'Minor',            toneCount: 3 }
const CHORD_DIM:      ChordSpec = { suffix: 'dim',  nameHe: 'מוקטן',           nameEn: 'Diminished',       toneCount: 3 }
const CHORD_AUG:      ChordSpec = { suffix: 'aug',  nameHe: 'מוגדל',           nameEn: 'Augmented',        toneCount: 3 }
const CHORD_MAJ7:     ChordSpec = { suffix: 'maj7', nameHe: 'מז׳ור ספטימה',   nameEn: 'Major 7th',        toneCount: 4 }
const CHORD_MIN7:     ChordSpec = { suffix: 'm7',   nameHe: 'מינור ספטימה',   nameEn: 'Minor 7th',        toneCount: 4 }
const CHORD_DOM7:     ChordSpec = { suffix: '7',    nameHe: 'דומיננטי ספטימה', nameEn: 'Dominant 7th',     toneCount: 4 }
const CHORD_HALF_DIM: ChordSpec = { suffix: 'm7b5', nameHe: 'חצי-מוקטן',      nameEn: 'Half-Diminished',  toneCount: 4 }
const CHORD_DIM7:     ChordSpec = { suffix: 'dim7', nameHe: 'מוקטן מלא',       nameEn: 'Diminished 7th',   toneCount: 4 }
const CHORD_MAJ9:     ChordSpec = { suffix: 'M9',   nameHe: 'מז׳ור תשיעית',   nameEn: 'Major 9th',        toneCount: 5 }
const CHORD_MIN9:     ChordSpec = { suffix: 'm9',   nameHe: 'מינור תשיעית',   nameEn: 'Minor 9th',        toneCount: 5 }
const CHORD_DOM9:     ChordSpec = { suffix: '9',    nameHe: 'דומיננטי תשיעית', nameEn: 'Dominant 9th',     toneCount: 5 }
const CHORD_DOM11:    ChordSpec = { suffix: '11',   nameHe: 'דומיננטי אחד-עשרה', nameEn: 'Dominant 11th',  toneCount: 5 }
const CHORD_MAJ13:    ChordSpec = { suffix: 'M13',  nameHe: 'מז׳ור שלוש-עשרה', nameEn: 'Major 13th',      toneCount: 6 }

// ─────────────────────────────────────────────────────────────────────────────
// Root note pools
// ─────────────────────────────────────────────────────────────────────────────

/** C D E F G A B — no accidentals, ideal for beginners */
const NATURAL_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/** All 12 pitch classes — Tonal.js prefers flats for a few keys */
const ALL_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

// ─────────────────────────────────────────────────────────────────────────────
// Interval sub-sets (by semitones) for shorthand reference
// ─────────────────────────────────────────────────────────────────────────────

const byShort = (...shorts: string[]) =>
  ALL_INTERVALS.filter(i => shorts.includes(i.shortEn))

const INTERVALS_EASY   = byShort('M2', 'M3', 'P4', 'P5', 'M6', 'P8')
const INTERVALS_MEDIUM = byShort('M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8')
const INTERVALS_HARD   = ALL_INTERVALS

// ─────────────────────────────────────────────────────────────────────────────
// THE DIFFICULTY SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const DIFFICULTY_SCHEMA: Record<Difficulty, DifficultyConfig> = {

  // ── EASY (Beginner) ────────────────────────────────────────────────────────
  // Natural note roots only. Major + natural minor. Consonant intervals (no tritone).
  // Triads only. Scale degrees 1, 3, 5 (chord tones — most recognizable).
  easy: {
    level: 'easy',
    allowedRoots:     NATURAL_ROOTS,
    allowedScales:    [SCALE_MAJOR, SCALE_MINOR],
    allowedIntervals: INTERVALS_EASY,
    allowedChords:    [CHORD_MAJOR, CHORD_MINOR],
    allowedDegrees:   [1, 3, 5],
    allowedTemplates: ['scale_degree', 'interval_above', 'chord_tone'],
    defaultOctave:    3,
  },

  // ── MEDIUM (Intermediate) ──────────────────────────────────────────────────
  // All 12 roots. Pentatonic, blues, harmonic minor. Tritone + all diatonic.
  // 7th chords. All 7 scale degrees. Downward intervals + identification.
  medium: {
    level: 'medium',
    allowedRoots:     ALL_ROOTS,
    allowedScales:    [
      SCALE_MAJOR, SCALE_MINOR, SCALE_HARMONIC_MINOR,
      SCALE_PENTATONIC_MAJ, SCALE_PENTATONIC_MIN, SCALE_BLUES,
    ],
    allowedIntervals: INTERVALS_MEDIUM,
    allowedChords:    [CHORD_MAJOR, CHORD_MINOR, CHORD_DIM, CHORD_MAJ7, CHORD_MIN7, CHORD_DOM7, CHORD_HALF_DIM],
    allowedDegrees:   [1, 2, 3, 4, 5, 6, 7],
    allowedTemplates: ['scale_degree', 'interval_above', 'interval_below', 'interval_id', 'chord_tone'],
    defaultOctave:    3,
  },

  // ── HARD (Advanced) ────────────────────────────────────────────────────────
  // All 12 roots. All 7 modes + melodic minor + exotic. All intervals incl.
  // compound and augmented/diminished. Extended chords (9th, 11th, 13th).
  hard: {
    level: 'hard',
    allowedRoots:     ALL_ROOTS,
    allowedScales:    [
      SCALE_MAJOR, SCALE_MINOR, SCALE_HARMONIC_MINOR, SCALE_MELODIC_MINOR,
      SCALE_DORIAN, SCALE_PHRYGIAN, SCALE_LYDIAN, SCALE_MIXOLYDIAN, SCALE_LOCRIAN,
      SCALE_PENTATONIC_MAJ, SCALE_PENTATONIC_MIN, SCALE_BLUES,
      SCALE_ALTERED, SCALE_WHOLE_TONE, SCALE_DIMINISHED,
    ],
    allowedIntervals: INTERVALS_HARD,
    allowedChords:    [
      CHORD_MAJOR, CHORD_MINOR, CHORD_DIM, CHORD_AUG,
      CHORD_MAJ7, CHORD_MIN7, CHORD_DOM7, CHORD_HALF_DIM, CHORD_DIM7,
      CHORD_MAJ9, CHORD_MIN9, CHORD_DOM9, CHORD_DOM11, CHORD_MAJ13,
    ],
    allowedDegrees:   [1, 2, 3, 4, 5, 6, 7],
    allowedTemplates: ['scale_degree', 'interval_above', 'interval_below', 'interval_id', 'chord_tone'],
    defaultOctave:    3,
  },
}
