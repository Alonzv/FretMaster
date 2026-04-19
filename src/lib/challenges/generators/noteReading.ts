import type { Question, Difficulty } from '../types'
import { NOTE_NAMES_SHARP, buildChoices, uid } from '../musicTheory'

// "Read this note on the treble-clef staff" — 4-choice by letter name.
//
// Staff step map (treble clef):
//   0 = C4 (middle C, one ledger below staff)
//   1 = D4, 2 = E4 (bottom line), 3 = F4, 4 = G4 (2nd line)
//   5 = A4, 6 = B4 (middle line), 7 = C5, 8 = D5 (4th line)
//   9 = E5, 10 = F5 (top line), 11 = G5, 12 = A5 (1st space above)

// Natural-note letter per staff step (no accidentals in base mapping).
const STEP_TO_NATURAL: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A']

// Easy   → lines + spaces inside the staff only (steps 2..10), naturals only.
// Medium → full range incl. 1 ledger above/below (steps 0..12), naturals only.
// Hard   → full range + sharps.
const DIFF_CONFIG: Record<Difficulty, { min: number; max: number; sharps: boolean }> = {
  easy:   { min: 2,  max: 10, sharps: false },
  medium: { min: 0,  max: 12, sharps: false },
  hard:   { min: 0,  max: 12, sharps: true  },
}

export function generateNoteReadingQuestion(difficulty: Difficulty): Question {
  const cfg = DIFF_CONFIG[difficulty]
  const step = Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min
  const natural = STEP_TO_NATURAL[step]
  const accidental: '' | '#' | 'b' = cfg.sharps && Math.random() < 0.35 ? '#' : ''

  const correct = accidental === '#' ? `${natural}#` : natural

  const { choices, correctIndex } = buildChoices(correct, [...NOTE_NAMES_SHARP])

  const lineOrSpaceHe = describeStaffPositionHe(step)
  const lineOrSpaceEn = describeStaffPositionEn(step)

  return {
    id: uid(),
    categoryId: 'note_reading',
    difficulty,
    prompt: {
      he: 'איזה תו זה?',
      en: 'What note is this?',
    },
    visual: { kind: 'staff', staffStep: step, accidental },
    choices,
    correctIndex,
    explanation: {
      he: `התו יושב על ${lineOrSpaceHe} של המפתח סול, וזה ${correct}.`,
      en: `The note sits on ${lineOrSpaceEn} of the treble clef, which is ${correct}.`,
    },
    theory: {
      he: 'המפתח סול (treble clef) מסמן את השורה השנייה מלמטה של החמשורה — התו שעליה הוא G. ממנו אפשר לגזור את כל השאר: השורות הן E-G-B-D-F ("Every Good Boy Deserves Fun"), המרווחים ביניהן הם F-A-C-E. סריג בגיטרה אינו משנה את התו — רק כתיב מוזיקלי כן.',
      en: 'The treble clef marks the 2nd line from the bottom of the staff — the note sitting on it is G. From there you can derive the rest: lines are E-G-B-D-F ("Every Good Boy Deserves Fun"), spaces between them spell F-A-C-E. The fret on a guitar doesn\'t change the note — only music notation does.',
    },
  }
}

function describeStaffPositionHe(step: number): string {
  const positions = [
    'קו עזר מתחת לחמשורה',  // 0 middle C
    'מרווח מתחת לחמשורה',    // 1
    'השורה הראשונה (תחתונה)', // 2
    'המרווח הראשון',         // 3
    'השורה השנייה',          // 4
    'המרווח השני',           // 5
    'השורה האמצעית',         // 6
    'המרווח השלישי',         // 7
    'השורה הרביעית',         // 8
    'המרווח הרביעי',         // 9
    'השורה העליונה',         // 10
    'מרווח מעל החמשורה',     // 11
    'קו עזר מעל החמשורה',    // 12
  ]
  return positions[step] ?? 'שורה לא ידועה'
}
function describeStaffPositionEn(step: number): string {
  const positions = [
    'a ledger line below the staff',
    'a space below the staff',
    'the 1st line (bottom)',
    'the 1st space',
    'the 2nd line',
    'the 2nd space',
    'the middle line',
    'the 3rd space',
    'the 4th line',
    'the 4th space',
    'the top line',
    'a space above the staff',
    'a ledger line above the staff',
  ]
  return positions[step] ?? 'an unknown line'
}
