/**
 * questionGenerator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Procedural question engine for FretMaster.
 *
 * Entry point: `generateQuestion(difficulty)` → GeneratedQuestion
 *
 * The engine:
 *   1. Reads the DifficultyConfig for the requested level.
 *   2. Randomly picks an allowed QuestionTemplateKind.
 *   3. Randomly selects root, scale/interval/chord from the allowed pools.
 *   4. Uses Tonal.js to compute the musically-correct answer.
 *   5. Returns a GeneratedQuestion — a standard Question extended with an
 *      optional PitchTarget, which the PitchEngine can consume directly.
 *
 * PitchTarget interface maps exactly to PitchEngine output:
 *   pitchEngine.ts returns { note, octave, cents }
 *   PitchTarget   stores { noteClass, midiNumber, chroma, toleranceCents }
 *   Match:  detected.note === target.noteClass   (enharmonic-safe via chroma)
 *           detected.octave === Note.get(noteWithOctave).oct
 */

import { Note, Scale, Chord } from 'tonal'
import type { Difficulty } from '../challenges/types'
import type { Question, Bilingual } from '../challenges/types'
import {
  DIFFICULTY_SCHEMA,
  type DifficultyConfig,
  type QuestionTemplateKind,
} from './difficultySchema'

// ─────────────────────────────────────────────────────────────────────────────
// PitchTarget — the bridge between question answers and the pitch engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Describes the exact pitch the player must produce to answer a question.
 * All fields are pre-computed by Tonal.js so the UI never re-derives them.
 */
export interface PitchTarget {
  /** Pitch class (no octave), e.g. 'E', 'Bb'.
   *  Matches `PitchResult.note` from pitchEngine.ts directly. */
  noteClass: string

  /** Scientific pitch notation including octave, e.g. 'E4'.
   *  Used to reconstruct context and display the target on a fretboard. */
  noteWithOctave: string

  /** MIDI note number 0–127, e.g. 64 for E4.
   *  Use for precise octave-aware matching: detected MIDI ± toleranceCents. */
  midiNumber: number

  /** Semitone within the octave (chroma), 0–11.
   *  Use for pitch-class-only matching (octave-agnostic):
   *  `detected.chroma === target.chroma` */
  chroma: number

  /** Allowed deviation in cents (100 cents = 1 semitone).
   *  Default: 50 (quarter-tone) — suitable for microphone pitch detection. */
  toleranceCents: number
}

// ─────────────────────────────────────────────────────────────────────────────
// GeneratedQuestion — extends the app's standard Question
// ─────────────────────────────────────────────────────────────────────────────

export interface GeneratedQuestion extends Question {
  /**
   * Present only when the question asks the player to produce a specific pitch
   * (scale_degree, interval_above, interval_below, chord_tone templates).
   * Absent for pure MCQ questions (interval_id).
   */
  pitchTarget?: PitchTarget
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal utilities
// ─────────────────────────────────────────────────────────────────────────────

function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Build a PitchTarget from a Tonal.js scientific-notation string.
 * Falls back gracefully if Tonal cannot parse the note.
 */
function buildPitchTarget(noteWithOctave: string, toleranceCents = 50): PitchTarget {
  const n = Note.get(noteWithOctave)
  if (n.empty) {
    // Fallback: strip octave and use chroma 0 — should not happen in practice
    const pc = Note.pitchClass(noteWithOctave) || noteWithOctave
    return { noteClass: pc, noteWithOctave, midiNumber: 0, chroma: 0, toleranceCents }
  }
  return {
    noteClass: n.pc,
    noteWithOctave: n.name,
    midiNumber: n.midi ?? 0,
    chroma: n.chroma,
    toleranceCents,
  }
}

/**
 * Pick `count` distinct items from `pool`, excluding `exclude`.
 * Returns a shallow-shuffled subset.
 */
function pickDistinct<T>(pool: T[], count: number, exclude: T[] = []): T[] {
  const copy = pool.filter(x => !exclude.includes(x))
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

/**
 * Shuffle 4 choices (correct + 3 distractors), return shuffled array and
 * the new index of the correct answer.
 */
function shuffleChoices(
  correct: Bilingual,
  distractors: Bilingual[],
): { choices: Bilingual[]; correctIndex: number } {
  const all = [correct, ...distractors.slice(0, 3)]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return { choices: all, correctIndex: all.findIndex(c => c.en === correct.en) }
}

/** Hebrew ordinal suffix for degrees 1–7 */
const DEGREE_LABELS_HE: Record<number, string> = {
  1: 'ראשונה', 2: 'שנייה', 3: 'שלישית',
  4: 'רביעית', 5: 'חמישית', 6: 'שישית', 7: 'שביעית',
}
const DEGREE_LABELS_EN: Record<number, string> = {
  1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th',
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator — Scale Degree
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "What is the Nth degree of [Root] [Scale]?"
 *
 * Uses `Scale.get('${root} ${scale.tonal}').notes` to get all scale notes,
 * then picks degree N as the correct answer. Distractors are other notes
 * from all 12 chromatic pitches that are NOT the correct answer.
 */
function generateScaleDegreeQuestion(
  config: DifficultyConfig,
  difficulty: Difficulty,
): GeneratedQuestion {
  const root   = randomOf(config.allowedRoots)
  const scale  = randomOf(config.allowedScales)
  const degree = randomOf(config.allowedDegrees)

  const scaleData  = Scale.get(`${root} ${scale.tonal}`)
  const scaleNotes = scaleData.notes

  // Guard: if Tonal returns an empty scale (unknown type), fall back gracefully
  if (!scaleNotes.length) {
    return generateScaleDegreeQuestion(config, difficulty) // retry
  }

  // Degrees are 1-based; clamp to actual note count for pentatonic (5 notes)
  const idx = Math.min(degree - 1, scaleNotes.length - 1)
  const correctNote = scaleNotes[idx]

  // Distractors: other chromatic notes that are not the correct answer
  const allNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
  const distNotes = pickDistinct(allNotes, 3, [correctNote])
  const correct: Bilingual = { he: correctNote, en: correctNote }
  const { choices, correctIndex } = shuffleChoices(correct, distNotes.map(n => ({ he: n, en: n })))

  // PitchTarget: root octave from config
  const targetWithOctave = `${correctNote}${config.defaultOctave}`
  const pitchTarget = buildPitchTarget(targetWithOctave)

  const scaleName = `${root} ${scale.nameEn}`
  const scaleNameHe = `${root} ${scale.nameHe}`
  const degreeHe = DEGREE_LABELS_HE[degree] ?? `${degree}`
  const degreeEn = DEGREE_LABELS_EN[degree] ?? `${degree}`

  return {
    id: uid(),
    categoryId: 'engine_scale_degree',
    difficulty,
    prompt: {
      he: `מהי הדרגה ה${degreeHe} בסולם ${scaleNameHe}?`,
      en: `What is the ${degreeEn} degree of the ${scaleName} scale?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `הדרגה ה${degreeHe} של ${scaleNameHe} היא ${correctNote}. תווי הסולם הם: ${scaleNotes.join(' · ')}.`,
      en: `The ${degreeEn} degree of ${scaleName} is ${correctNote}. Scale notes: ${scaleNotes.join(' · ')}.`,
    },
    theory: {
      he: `${scale.nameHe} נבנה לפי תבנית קבועה של טונים וחצאי-טונים מעל תו הבסיס ${root}. כל תו בסולם מכונה "דרגה" — הדרגה הראשונה היא תמיד תו הבסיס, ושאר הדרגות נגזרות ממנו.`,
      en: `${scale.nameEn} is built from a fixed pattern of whole and half steps starting from ${root}. Each note is called a "degree" — degree 1 is always the root, and the rest are derived from it.`,
    },
    pitchTarget,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator — Interval (above / below / identification)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Three modes:
 *  'above' → "Play a [Interval] above [Note]"   — pitchTarget set
 *  'below' → "Play a [Interval] below [Note]"   — pitchTarget set
 *  'id'    → "What interval is from [A] to [B]?" — MCQ, no pitchTarget
 */
function generateIntervalQuestion(
  config: DifficultyConfig,
  difficulty: Difficulty,
  direction: 'above' | 'below' | 'id',
): GeneratedQuestion {
  const interval = randomOf(config.allowedIntervals)
  const root     = randomOf(config.allowedRoots)
  const rootWithOct = `${root}${config.defaultOctave}`

  if (direction === 'id') {
    // For identification: pick a second random root, compute interval, ask MCQ
    const noteA = randomOf(config.allowedRoots)
    let   noteB = randomOf(config.allowedRoots)
    while (noteB === noteA) noteB = randomOf(config.allowedRoots)

    const semA = Note.chroma(noteA) ?? 0
    const semB = Note.chroma(noteB) ?? 0
    const dist = ((semB - semA) + 12) % 12

    // Find matching interval by semitone distance
    const matched = config.allowedIntervals.find(i => i.semitones === dist)
      ?? config.allowedIntervals[0]

    const correct: Bilingual = { he: matched.nameHe, en: matched.nameEn }
    const distractors = pickDistinct(config.allowedIntervals, 3, [matched])
      .map(i => ({ he: i.nameHe, en: i.nameEn }))
    const { choices, correctIndex } = shuffleChoices(correct, distractors)

    return {
      id: uid(),
      categoryId: 'engine_interval',
      difficulty,
      prompt: {
        he: `מה המרווח מ-${noteA} ל-${noteB}?`,
        en: `What interval is from ${noteA} to ${noteB}?`,
      },
      choices,
      correctIndex,
      explanation: {
        he: `המרחק מ-${noteA} ל-${noteB} הוא ${dist} חצאי-טונים, שמתאים ל${matched.nameHe} (${matched.shortEn}).`,
        en: `From ${noteA} to ${noteB} is ${dist} semitones, which is a ${matched.nameEn} (${matched.shortEn}).`,
      },
      theory: {
        he: `מרווח הוא המרחק בין שני תווים. סופרים חצאי-טונים (סריגים בגיטרה) בין התו הנמוך לתו הגבוה. ${matched.nameHe} = ${dist} חצאי-טונים.`,
        en: `An interval is the distance between two notes, measured in semitones (frets on a guitar). ${matched.nameEn} = ${dist} semitones.`,
      },
    }
  }

  // above / below: transpose and compute target note
  const tonalInterval = direction === 'below'
    ? `-${interval.tonal}`
    : interval.tonal

  const targetWithOct = Note.transpose(rootWithOct, tonalInterval)

  // Guard: Tonal may return empty string for invalid combos
  if (!targetWithOct || Note.get(targetWithOct).empty) {
    return generateIntervalQuestion(config, difficulty, direction) // retry
  }

  const targetNote = Note.pitchClass(targetWithOct)
  const correct: Bilingual = { he: targetNote, en: targetNote }

  // Distractors: adjacent pitches (±1, ±2, ±3 semitones from target, not repeating)
  const allNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
  const distractors = pickDistinct(allNotes, 3, [targetNote])
    .map(n => ({ he: n, en: n }))
  const { choices, correctIndex } = shuffleChoices(correct, distractors)

  const dirHe = direction === 'above' ? 'מעל' : 'מתחת ל-'
  const dirEn = direction === 'above' ? 'above' : 'below'

  return {
    id: uid(),
    categoryId: 'engine_interval',
    difficulty,
    prompt: {
      he: `נגן ${interval.nameHe} (${interval.shortEn}) ${dirHe}${root}`,
      en: `Play a ${interval.nameEn} (${interval.shortEn}) ${dirEn} ${root}`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `${interval.nameHe} ${dirHe}${root} הוא ${targetNote}. ${interval.semitones} חצאי-טונים ${direction === 'above' ? 'למעלה' : 'למטה'} מ-${root} = ${targetNote}.`,
      en: `A ${interval.nameEn} ${dirEn} ${root} is ${targetNote}. ${root} ${direction === 'above' ? '+' : '-'}${interval.semitones} semitones = ${targetNote}.`,
    },
    theory: {
      he: `${interval.nameHe} מורכב מ-${interval.semitones} חצאי-טונים. כדי למצוא אותו בגיטרה, ספור ${interval.semitones} סריגים ${direction === 'above' ? 'למעלה' : 'למטה'} מ-${root}.`,
      en: `A ${interval.nameEn} spans ${interval.semitones} semitones. On the guitar, count ${interval.semitones} frets ${dirEn} from ${root}.`,
    },
    pitchTarget: buildPitchTarget(targetWithOct),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator — Chord Tone
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "What is the Nth note of [Root][Chord]?"
 *
 * Uses `Chord.get('${root}${chord.suffix}').notes` to get chord tones,
 * then picks tone N as the correct answer.
 */
function generateChordToneQuestion(
  config: DifficultyConfig,
  difficulty: Difficulty,
): GeneratedQuestion {
  const root  = randomOf(config.allowedRoots)
  const chord = randomOf(config.allowedChords)

  const chordData  = Chord.get(`${root}${chord.suffix}`)
  const chordNotes = chordData.notes

  // Guard: unknown chord type → retry
  if (!chordNotes.length) {
    return generateChordToneQuestion(config, difficulty)
  }

  // Pick a random tone from the chord (index 0 = root, 1 = 3rd, etc.)
  const toneIdx    = Math.floor(Math.random() * chordNotes.length)
  const correctNote = chordNotes[toneIdx]
  const toneOrdinal = toneIdx + 1

  const correct: Bilingual = { he: correctNote, en: correctNote }
  const allNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
  const distractors = pickDistinct(allNotes, 3, [correctNote])
    .map(n => ({ he: n, en: n }))
  const { choices, correctIndex } = shuffleChoices(correct, distractors)

  const chordLabel   = `${root}${chord.suffix}`
  const degreeHe     = DEGREE_LABELS_HE[toneOrdinal] ?? `${toneOrdinal}`
  const degreeEn     = DEGREE_LABELS_EN[toneOrdinal] ?? `${toneOrdinal}`

  const targetWithOct = `${correctNote}${config.defaultOctave}`
  const pitchTarget   = buildPitchTarget(targetWithOct)

  return {
    id: uid(),
    categoryId: 'engine_chord_tone',
    difficulty,
    prompt: {
      he: `מהו התו ה${degreeHe} באקורד ${chordLabel}?`,
      en: `What is the ${degreeEn} note of a ${chordLabel} chord?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `האקורד ${chordLabel} (${chord.nameHe}) מורכב מ: ${chordNotes.join(' · ')}. התו ה${degreeHe} הוא ${correctNote}.`,
      en: `The ${chordLabel} chord (${chord.nameEn}) contains: ${chordNotes.join(' · ')}. The ${degreeEn} note is ${correctNote}.`,
    },
    theory: {
      he: `אקורד ${chord.nameHe} נבנה על-ידי ערמת טרצות מעל התו הבסיס ${root}. ${chord.nameHe} = ${chordNotes.join(' - ')}.`,
      en: `A ${chord.nameEn} chord is built by stacking thirds above root ${root}. ${chord.nameEn}: ${chordNotes.join(' - ')}.`,
    },
    pitchTarget,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate one procedural question at the requested difficulty level.
 *
 * The engine randomly selects from all templates allowed at that level.
 * Every call produces a different question (random root, scale, interval,
 * chord, and degree) using Tonal.js for musically-correct computation.
 *
 * @example
 * ```ts
 * const q = generateQuestion('easy')
 * console.log(q.prompt.en)       // "What is the 3rd degree of the G major scale?"
 * console.log(q.pitchTarget)     // { noteClass: 'B', noteWithOctave: 'B3', midiNumber: 47, chroma: 11, toleranceCents: 50 }
 * ```
 */
export function generateQuestion(difficulty: Difficulty): GeneratedQuestion {
  const config   = DIFFICULTY_SCHEMA[difficulty]
  const template = randomOf(config.allowedTemplates) as QuestionTemplateKind

  switch (template) {
    case 'scale_degree':
      return generateScaleDegreeQuestion(config, difficulty)

    case 'interval_above':
      return generateIntervalQuestion(config, difficulty, 'above')

    case 'interval_below':
      return generateIntervalQuestion(config, difficulty, 'below')

    case 'interval_id':
      return generateIntervalQuestion(config, difficulty, 'id')

    case 'chord_tone':
      return generateChordToneQuestion(config, difficulty)

    default:
      return generateScaleDegreeQuestion(config, difficulty)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Matching utility — for use by the pitch detection layer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether a detected pitch matches a PitchTarget.
 *
 * Two matching modes:
 *  - Octave-aware  (strict):   MIDI numbers match within toleranceCents
 *  - Pitch-class   (loose):    only chroma (0–11) matches, octave ignored
 *
 * Use strict mode for pitch exercises where the octave matters.
 * Use loose  mode for "name the note" exercises where any octave is fine.
 */
export function matchesPitchTarget(
  detected: { note: string; octave: number; cents: number },
  target: PitchTarget,
  mode: 'strict' | 'loose' = 'loose',
): boolean {
  const detectedChroma = Note.chroma(detected.note) ?? -1
  if (detectedChroma !== target.chroma) return false   // pitch class must match

  if (mode === 'loose') return true

  // Strict: check octave + cents offset
  const detectedMidi = (detected.octave + 1) * 12 + detectedChroma
  const midiDiff     = Math.abs(detectedMidi - target.midiNumber)
  const centsDiff    = midiDiff * 100 + Math.abs(detected.cents)
  return centsDiff <= target.toleranceCents
}
