import type { Question, Difficulty } from '../types'
import { NOTE_NAMES_SHARP, buildChoices, buildBilingualChoices, randomOf, uid } from '../musicTheory'

// Staff step map (treble clef):
//   0 = C4 (middle C, one ledger below staff)
//   1 = D4, 2 = E4 (bottom line), 3 = F4, 4 = G4 (2nd line)
//   5 = A4, 6 = B4 (middle line), 7 = C5, 8 = D5 (4th line)
//   9 = E5, 10 = F5 (top line), 11 = G5, 12 = A5 (1st space above)

const STEP_TO_NATURAL: string[] = ['C','D','E','F','G','A','B','C','D','E','F','G','A']

const DIFF_CONFIG: Record<Difficulty, { min: number; max: number; sharps: boolean }> = {
  easy:   { min: 2,  max: 10, sharps: false },
  medium: { min: 0,  max: 12, sharps: false },
  hard:   { min: 0,  max: 12, sharps: true  },
}

const LINE_LABELS_HE = [
  'קו עזר מתחת לחמשורה', 'מרווח מתחת לחמשורה',
  'השורה הראשונה (תחתונה)', 'המרווח הראשון', 'השורה השנייה',
  'המרווח השני', 'השורה האמצעית', 'המרווח השלישי', 'השורה הרביעית',
  'המרווח הרביעי', 'השורה העליונה', 'מרווח מעל החמשורה', 'קו עזר מעל החמשורה',
]
const LINE_LABELS_EN = [
  'a ledger line below the staff', 'a space below the staff',
  'the 1st line (bottom)', 'the 1st space', 'the 2nd line',
  'the 2nd space', 'the middle line', '3rd space', 'the 4th line',
  'the 4th space', 'the top line', 'a space above the staff', 'a ledger line above the staff',
]

// Lines E-G-B-D-F (steps 2,4,6,8,10) and spaces F-A-C-E (3,5,7,9) for mnemonic questions
const LINE_NOTES  = ['E','G','B','D','F']
const SPACE_NOTES = ['F','A','C','E']

// Shape 1: standard "identify the note on the staff" (visual)
function visualQ(difficulty: Difficulty): Question {
  const cfg = DIFF_CONFIG[difficulty]
  const step = Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min
  const natural = STEP_TO_NATURAL[step]
  const accidental: '' | '#' | 'b' = cfg.sharps && Math.random() < 0.35 ? '#' : ''
  const correct = accidental === '#' ? `${natural}#` : natural
  const { choices, correctIndex } = buildChoices(correct, [...NOTE_NAMES_SHARP])
  return {
    id: uid(), categoryId: 'note_reading', difficulty,
    prompt: { he: 'איזה תו זה?', en: 'What note is this?' },
    visual: { kind: 'staff', staffStep: step, accidental },
    choices, correctIndex,
    explanation: {
      he: `התו יושב על ${LINE_LABELS_HE[step]} של המפתח סול, וזה ${correct}.`,
      en: `The note sits on ${LINE_LABELS_EN[step]} of the treble clef — that is ${correct}.`,
    },
    theory: THEORY,
  }
}

// Shape 2: "which staff line / space does note X sit on?"
function positionQ(difficulty: Difficulty): Question {
  // pick a note and ask which position
  const cfg = DIFF_CONFIG[difficulty]
  const pool: number[] = []
  for (let s = cfg.min; s <= cfg.max; s++) pool.push(s)
  const step = randomOf(pool)
  const natural = STEP_TO_NATURAL[step]

  const correctLabel = { he: LINE_LABELS_HE[step], en: LINE_LABELS_EN[step] }
  // 3 distractor positions (different steps)
  const otherSteps = pool.filter(s => s !== step)
  const picked: number[] = []
  while (picked.length < 3 && otherSteps.length > 0) {
    const idx = Math.floor(Math.random() * otherSteps.length)
    picked.push(otherSteps.splice(idx, 1)[0])
  }
  const distractors = picked.map(s => ({ he: LINE_LABELS_HE[s], en: LINE_LABELS_EN[s] }))
  const { choices, correctIndex } = buildBilingualChoices(correctLabel, distractors)

  return {
    id: uid(), categoryId: 'note_reading', difficulty,
    prompt: {
      he: `על איזה מיקום בחמשורה יושב התו ${natural}?`,
      en: `On which staff position does the note ${natural} sit?`,
    },
    choices, correctIndex,
    explanation: {
      he: `${natural} יושב על ${LINE_LABELS_HE[step]}.`,
      en: `${natural} sits on ${LINE_LABELS_EN[step]}.`,
    },
    theory: THEORY,
  }
}

// Shape 3: "which notes are on the lines of the treble clef?" (mnemonic)
function mnemonicLinesQ(): Question {
  const correct = 'E G B D F'
  const distractors = ['E F G A B', 'F A C E G', 'D F A C E', 'C D E F G']
  const { choices, correctIndex } = buildChoices(correct, distractors)
  return {
    id: uid(), categoryId: 'note_reading', difficulty: 'easy',
    prompt: {
      he: 'אילו תווים יושבים על שורות החמשורה (מלמטה למעלה)?',
      en: 'Which notes sit on the treble clef lines (bottom to top)?',
    },
    choices, correctIndex,
    explanation: {
      he: 'השורות מלמטה למעלה: E G B D F — "Every Good Boy Deserves Fun".',
      en: 'The lines from bottom to top: E G B D F — "Every Good Boy Deserves Fun".',
    },
    theory: THEORY,
  }
}

// Shape 4: "which notes are in the spaces?"
function mnemonicSpacesQ(): Question {
  const correct = 'F A C E'
  const distractors = ['E G B D', 'G A B C', 'D E F G', 'A C E G']
  const { choices, correctIndex } = buildChoices(correct, distractors)
  return {
    id: uid(), categoryId: 'note_reading', difficulty: 'easy',
    prompt: {
      he: 'אילו תווים יושבים במרווחים של החמשורה (מלמטה למעלה)?',
      en: 'Which notes sit in the treble clef spaces (bottom to top)?',
    },
    choices, correctIndex,
    explanation: {
      he: 'המרווחים מלמטה למעלה: F A C E — הם מאייתים "FACE".',
      en: 'The spaces from bottom to top: F A C E — they spell "FACE".',
    },
    theory: THEORY,
  }
}

// Shape 5: "which line number is note X?" (counting lines)
function lineNumberQ(): Question {
  const lineIdx = Math.floor(Math.random() * LINE_NOTES.length)  // 0-4
  const note = LINE_NOTES[lineIdx]
  const correct = `${lineIdx + 1}`
  const distractors = ['1','2','3','4','5'].filter(n => n !== correct)
  const { choices, correctIndex } = buildChoices(correct, distractors)
  return {
    id: uid(), categoryId: 'note_reading', difficulty: 'easy',
    prompt: {
      he: `על שורה מספר כמה יושב התו ${note} בחמשורה?`,
      en: `On which line number does the note ${note} sit in the treble clef?`,
    },
    choices, correctIndex,
    explanation: {
      he: `${note} יושב על שורה ${lineIdx + 1} (מלמטה).`,
      en: `${note} sits on line ${lineIdx + 1} (counting from the bottom).`,
    },
    theory: THEORY,
  }
}

// Shape 6: "which space number is note X?" (counting spaces)
function spaceNumberQ(): Question {
  const spIdx = Math.floor(Math.random() * SPACE_NOTES.length)  // 0-3
  const note = SPACE_NOTES[spIdx]
  const correct = `${spIdx + 1}`
  const distractors = ['1','2','3','4'].filter(n => n !== correct)
  const { choices, correctIndex } = buildChoices(correct, distractors)
  return {
    id: uid(), categoryId: 'note_reading', difficulty: 'easy',
    prompt: {
      he: `במרווח מספר כמה יושב התו ${note} בחמשורה?`,
      en: `In which space does the note ${note} sit in the treble clef?`,
    },
    choices, correctIndex,
    explanation: {
      he: `${note} יושב במרווח ${spIdx + 1} (מלמטה).`,
      en: `${note} is in space ${spIdx + 1} (from the bottom).`,
    },
    theory: THEORY,
  }
}

// Shape 7: "what clef has E on its bottom line?"
function clefFactQ(): Question {
  const questions: Array<{ q: { he: string; en: string }; correct: string; wrong: string[] }> = [
    {
      q: { he: 'איזה תו יושב על השורה התחתונה של המפתח סול?', en: 'Which note is on the bottom line of the treble clef?' },
      correct: 'E', wrong: ['F','G','C'],
    },
    {
      q: { he: 'איזה תו יושב במרווח הראשון של המפתח סול?', en: 'Which note sits in the 1st space of the treble clef?' },
      correct: 'F', wrong: ['E','G','A'],
    },
    {
      q: { he: 'איזה תו יושב על השורה האמצעית (שלישית) של המפתח סול?', en: 'Which note is on the middle (3rd) line of the treble clef?' },
      correct: 'B', wrong: ['A','C','G'],
    },
    {
      q: { he: 'איזה תו יושב על השורה העליונה של המפתח סול?', en: 'Which note is on the top line of the treble clef?' },
      correct: 'F', wrong: ['E','G','D'],
    },
    {
      q: { he: 'איזה תו יושב במרווח השלישי של המפתח סול?', en: 'Which note sits in the 3rd space of the treble clef?' },
      correct: 'C', wrong: ['B','D','E'],
    },
  ]
  const q = randomOf(questions)
  const { choices, correctIndex } = buildChoices(q.correct, q.wrong)
  return {
    id: uid(), categoryId: 'note_reading', difficulty: 'easy',
    prompt: q.q,
    choices, correctIndex,
    explanation: {
      he: `התשובה הנכונה: ${q.correct}.`,
      en: `The correct answer: ${q.correct}.`,
    },
    theory: THEORY,
  }
}

export function generateNoteReadingQuestion(difficulty: Difficulty): Question {
  const EASY_SHAPES = [visualQ, mnemonicLinesQ, mnemonicSpacesQ, lineNumberQ, spaceNumberQ, clefFactQ, positionQ]
  const MEDIUM_SHAPES = [visualQ, visualQ, positionQ, clefFactQ]
  const HARD_SHAPES  = [visualQ, positionQ]

  const shapes = difficulty === 'easy' ? EASY_SHAPES : difficulty === 'medium' ? MEDIUM_SHAPES : HARD_SHAPES
  const shape = randomOf(shapes)

  // Some shapes ignore difficulty (always easy mnemonics), visualQ uses difficulty correctly
  try {
    return shape(difficulty)
  } catch {
    return visualQ(difficulty)
  }
}

const THEORY = {
  he: 'המפתח סול (treble clef) מסמן את השורה השנייה מלמטה — G. השורות הן E-G-B-D-F ("Every Good Boy Deserves Fun"), המרווחים הם F-A-C-E. בגיטרה: המיתרים פתוחים מיוצגים בתווי: E2, A2, D3, G3, B3, E4.',
  en: 'The treble clef marks the 2nd line from the bottom as G. Lines spell E-G-B-D-F ("Every Good Boy Deserves Fun"); spaces spell F-A-C-E. On guitar, open strings are notated: E2, A2, D3, G3, B3, E4.',
}
