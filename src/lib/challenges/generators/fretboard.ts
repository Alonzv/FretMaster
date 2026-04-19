import type { Question, Difficulty } from '../types'
import {
  NOTE_NAMES_SHARP,
  noteAt,
  randomOf,
  buildChoices,
  uid,
} from '../musicTheory'

// Easy   → outer strings (1, 2, 6) that students memorize first, frets 0–5.
// Medium → all strings, frets 0–7.
// Hard   → all strings, frets 0–12 (includes sharps / octave register).
const DIFF_CONFIG: Record<Difficulty, { strings: number[]; minFret: number; maxFret: number }> = {
  easy:   { strings: [1, 2, 6],            minFret: 0, maxFret: 5  },
  medium: { strings: [1, 2, 3, 4, 5, 6],   minFret: 0, maxFret: 7  },
  hard:   { strings: [1, 2, 3, 4, 5, 6],   minFret: 0, maxFret: 12 },
}

const STRING_NAMES_HE = ['', 'ראשון (מי גבוה)', 'שני (סי)', 'שלישי (סול)', 'רביעי (רה)', 'חמישי (לה)', 'שישי (מי בס)']
const STRING_NAMES_EN = ['', '1st (high e)',     '2nd (B)',   '3rd (G)',      '4th (D)',     '5th (A)',    '6th (low E)']

export function generateFretboardQuestion(difficulty: Difficulty): Question {
  const cfg = DIFF_CONFIG[difficulty]
  const stringNum = randomOf(cfg.strings) as 1 | 2 | 3 | 4 | 5 | 6
  const fret = Math.floor(Math.random() * (cfg.maxFret - cfg.minFret + 1)) + cfg.minFret
  const correct = noteAt(stringNum, fret)

  const { choices, correctIndex } = buildChoices(correct, [...NOTE_NAMES_SHARP])

  const openNote = noteAt(stringNum, 0)

  return {
    id: uid(),
    categoryId: 'fretboard',
    difficulty,
    prompt: {
      he: `איזה תו נמצא על המיתר ה${STRING_NAMES_HE[stringNum]}, סריג ${fret}?`,
      en: `What note is on the ${STRING_NAMES_EN[stringNum]} string, fret ${fret}?`,
    },
    visual: { kind: 'fret', string: stringNum, fret },
    choices,
    correctIndex,
    explanation: {
      he: fret === 0
        ? `המיתר הפתוח הוא ${openNote}.`
        : `המיתר הפתוח הוא ${openNote}. כל סריג עולה בחצי-טון, לכן אחרי ${fret} סריגים מגיעים ל-${correct}.`,
      en: fret === 0
        ? `The open string is ${openNote}.`
        : `The open string is ${openNote}. Each fret raises the pitch by a semitone, so after ${fret} frets you reach ${correct}.`,
    },
    theory: {
      he: 'כל מיתר פתוח נותן תו בסיס (E–A–D–G–B–E מהעבה לדק). כל סריג מוסיף חצי-טון. אין חצאי-טונים בין E ל-F ובין B ל-C, לכן הרווחים על הצוואר לא תמיד סימטריים. שיטת לימוד טובה היא לזכור קודם את התווים בסריגים 0, 3, 5, 7, 12 על המיתר השישי והחמישי — משם אפשר לנווט את כל השאר.',
      en: 'Each open string produces a base note (E–A–D–G–B–E from thick to thin). Every fret adds a semitone. There is no semitone between E–F or B–C, so intervals along the neck are not fully symmetric. A solid learning path is to memorize frets 0, 3, 5, 7, 12 on the 6th and 5th strings first — everything else can be navigated from there.',
    },
  }
}
