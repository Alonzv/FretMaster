import type { Question, Difficulty } from '../types'
import {
  NOTE_NAMES_SHARP,
  pitchClass,
  randomOf,
  buildChoices,
  uid,
} from '../musicTheory'

// "Which notes are in D major?" — 4-choice, answer is a full scale as a note list.
//
// Easy   → major + natural minor on natural roots.
// Medium → major + natural minor + minor pentatonic on all 12 roots.
// Hard   → all 7 modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian).

interface ScaleShape {
  suffix: string
  labelHe: string
  labelEn: string
  steps: number[]
}

const BASE_SCALES: ScaleShape[] = [
  { suffix: ' major',        labelHe: 'מז׳ור',         labelEn: 'major',         steps: [0, 2, 4, 5, 7, 9, 11] },
  { suffix: ' minor',        labelHe: 'מינור טבעי',    labelEn: 'natural minor', steps: [0, 2, 3, 5, 7, 8, 10] },
]

const PLUS_PENTATONIC: ScaleShape[] = [
  { suffix: ' minor pentatonic', labelHe: 'פנטטוני מינור', labelEn: 'minor pentatonic', steps: [0, 3, 5, 7, 10] },
]

const MODES: ScaleShape[] = [
  { suffix: ' Ionian',     labelHe: 'יוני (Ionian)',     labelEn: 'Ionian',     steps: [0, 2, 4, 5, 7, 9, 11] },
  { suffix: ' Dorian',     labelHe: 'דוריאן',            labelEn: 'Dorian',     steps: [0, 2, 3, 5, 7, 9, 10] },
  { suffix: ' Phrygian',   labelHe: 'פריגי (Phrygian)',  labelEn: 'Phrygian',   steps: [0, 1, 3, 5, 7, 8, 10] },
  { suffix: ' Lydian',     labelHe: 'לידי (Lydian)',     labelEn: 'Lydian',     steps: [0, 2, 4, 6, 7, 9, 11] },
  { suffix: ' Mixolydian', labelHe: 'מיקסולידי',         labelEn: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10] },
  { suffix: ' Aeolian',    labelHe: 'אאולי (Aeolian)',   labelEn: 'Aeolian',    steps: [0, 2, 3, 5, 7, 8, 10] },
  { suffix: ' Locrian',    labelHe: 'לוקרי (Locrian)',   labelEn: 'Locrian',    steps: [0, 1, 3, 5, 6, 8, 10] },
]

const NATURAL_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const ALL_ROOTS = [...NOTE_NAMES_SHARP]

export function generateScaleConstructionQuestion(difficulty: Difficulty): Question {
  const shapes =
    difficulty === 'hard'   ? MODES :
    difficulty === 'medium' ? [...BASE_SCALES, ...PLUS_PENTATONIC] :
                              BASE_SCALES
  const roots = difficulty === 'easy' ? NATURAL_ROOTS : ALL_ROOTS

  const root  = randomOf(roots)
  const shape = randomOf(shapes)

  const notes = shape.steps.map(s => NOTE_NAMES_SHARP[(pitchClass(root) + s) % 12])
  const correct = notes.join(' · ')

  const pool: string[] = []
  for (const r of roots) {
    for (const s of shapes) {
      const ns = s.steps.map(st => NOTE_NAMES_SHARP[(pitchClass(r) + st) % 12]).join(' · ')
      if (ns !== correct) pool.push(ns)
    }
  }

  const { choices, correctIndex } = buildChoices(correct, pool)

  const scaleLabelHe = `${root}${shape.suffix.replace(/minor/g, 'מינור').replace(/major/g, 'מז׳ור').replace(/natural/g, 'טבעי').replace(/pentatonic/g, 'פנטטוני')}`
  const scaleLabelEn = `${root}${shape.suffix}`

  return {
    id: uid(),
    categoryId: 'scale_construction',
    difficulty,
    prompt: {
      he: `אילו תווים מרכיבים את הסולם ${scaleLabelHe}?`,
      en: `Which notes make up the ${scaleLabelEn} scale?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `${scaleLabelHe} = ${shape.labelHe}, בנוי מתווים: ${notes.join(', ')}.`,
      en: `${scaleLabelEn} = ${shape.labelEn}, built from: ${notes.join(', ')}.`,
    },
    theory: {
      he: 'סולם מז׳ור נבנה לפי תבנית של טון-טון-חצי-טון-טון-טון-חצי (W-W-H-W-W-W-H). מינור טבעי הוא אותו הדבר אבל מתחיל מהדרגה השישית. פנטטוני הוא סולם של 5 תווים בלבד — הוא "בטוח" כי אין בו חצאי-טונים דיסוננטיים. מודוסים הם וריאציות שמקבלים כשמתחילים את סולם המז׳ור מדרגה אחרת.',
      en: 'A major scale follows the pattern whole-whole-half-whole-whole-whole-half (W-W-H-W-W-W-H). Natural minor is the same pattern starting from the 6th degree. Pentatonic is a 5-note scale — it is "safe" because it has no clashing semitones. Modes are variations you get when you start the major scale from a different degree.',
    },
  }
}
