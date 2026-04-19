import type { Question, Difficulty } from '../types'
import {
  NOTE_NAMES_SHARP,
  pitchClass,
  randomOf,
  buildChoices,
  uid,
} from '../musicTheory'

// "Which notes are in Fmaj7?" — 4-choice, answer is a comma-separated note list.
//
// Easy   → basic triads on natural roots (C, D, E, F, G, A, B).
// Medium → triads on all 12 roots.
// Hard   → 7th chords (maj7, m7, dom7, m7b5) on all 12 roots.

interface ChordShape {
  suffix: string
  labelHe: string
  labelEn: string
  intervals: number[]         // semitone offsets from root
}

const TRIADS: ChordShape[] = [
  { suffix: '',  labelHe: 'מז׳ור',   labelEn: 'major',  intervals: [0, 4, 7] },
  { suffix: 'm', labelHe: 'מינור',    labelEn: 'minor',  intervals: [0, 3, 7] },
  { suffix: '°', labelHe: 'מוקטן',    labelEn: 'dim',    intervals: [0, 3, 6] },
]

const SEVENTHS: ChordShape[] = [
  { suffix: 'maj7', labelHe: 'מז׳ור 7', labelEn: 'maj7', intervals: [0, 4, 7, 11] },
  { suffix: 'm7',   labelHe: 'מינור 7', labelEn: 'm7',   intervals: [0, 3, 7, 10] },
  { suffix: '7',    labelHe: 'דומיננטי 7', labelEn: 'dom7', intervals: [0, 4, 7, 10] },
  { suffix: 'm7b5', labelHe: 'חצי-מוקטן',  labelEn: 'm7b5', intervals: [0, 3, 6, 10] },
]

const NATURAL_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const ALL_ROOTS = [...NOTE_NAMES_SHARP]

export function generateChordConstructionQuestion(difficulty: Difficulty): Question {
  const shapes = difficulty === 'hard' ? SEVENTHS : TRIADS
  const roots  = difficulty === 'easy' ? NATURAL_ROOTS : ALL_ROOTS

  const root  = randomOf(roots)
  const shape = randomOf(shapes)

  const notes = shape.intervals.map(i => NOTE_NAMES_SHARP[(pitchClass(root) + i) % 12])
  const correct = notes.join(' · ')

  // Distractor pool: same root with different shapes + different roots with same shape.
  const pool: string[] = []
  for (const r of roots) {
    for (const s of shapes) {
      const ns = s.intervals.map(i => NOTE_NAMES_SHARP[(pitchClass(r) + i) % 12]).join(' · ')
      if (ns !== correct) pool.push(ns)
    }
  }

  const { choices, correctIndex } = buildChoices(correct, pool)

  const chordLabel = `${root}${shape.suffix}`

  return {
    id: uid(),
    categoryId: 'chord_construction',
    difficulty,
    prompt: {
      he: `אילו תווים מרכיבים את האקורד ${chordLabel}?`,
      en: `Which notes make up the ${chordLabel} chord?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `${chordLabel} = ${root} ${shape.labelHe}, בנוי מ: ${notes.join(', ')}.`,
      en: `${chordLabel} = ${root} ${shape.labelEn}, built from: ${notes.join(', ')}.`,
    },
    theory: {
      he: 'אקורדים נבנים על-ידי ערמה של טרצות מעל התו הבסיס. אקורד מז׳ור = טרצה גדולה + טרצה קטנה (0-4-7). אקורד מינור = טרצה קטנה + טרצה גדולה (0-3-7). אקורד מוקטן = שתי טרצות קטנות (0-3-6). אקורדי ספטימה מוסיפים עוד טרצה מעל הטריאד.',
      en: 'Chords are built by stacking thirds on top of a root note. Major = major 3rd + minor 3rd (0-4-7). Minor = minor 3rd + major 3rd (0-3-7). Diminished = two minor thirds (0-3-6). Seventh chords add one more third on top of the triad.',
    },
  }
}
