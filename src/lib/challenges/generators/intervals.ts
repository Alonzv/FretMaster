import type { Question, Difficulty, Bilingual } from '../types'
import {
  NOTE_NAMES_SHARP,
  INTERVAL_NAMES,
  interval,
  randomOf,
  buildBilingualChoices,
  uid,
} from '../musicTheory'

const NATURAL_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const ALL_NOTES = [...NOTE_NAMES_SHARP]

function allIntervalLabels(): Bilingual[] {
  return Object.values(INTERVAL_NAMES).map(i => ({ he: i.he, en: i.en }))
}

export function generateIntervalTheoryQuestion(difficulty: Difficulty): Question {
  const pool = difficulty === 'easy' ? NATURAL_NOTES : ALL_NOTES
  const a = randomOf(pool)
  let b = randomOf(pool)
  while (b === a) b = randomOf(pool)

  const semitones = interval(a, b)
  const info = INTERVAL_NAMES[semitones]
  const correct: Bilingual = { he: info.he, en: info.en }

  const { choices, correctIndex } = buildBilingualChoices(correct, allIntervalLabels())

  return {
    id: uid(),
    categoryId: 'intervals_theory',
    difficulty,
    prompt: {
      he: `מה האינטרוול מ-${a} ל-${b}?`,
      en: `What is the interval from ${a} to ${b}?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `מ-${a} ל-${b} יש ${semitones} חצאי-טונים, וזה מוגדר כ${info.he} (${info.short}).`,
      en: `From ${a} to ${b} there are ${semitones} semitones, which is a ${info.en} (${info.short}).`,
    },
    theory: {
      he: 'אינטרוול הוא המרחק בין שני תווים, נמדד בחצאי-טונים. כל סריג בגיטרה הוא חצי-טון, אז אפשר לספור אינטרוולים על הצוואר. האינטרוולים הזכים (פרימה, קוורטה, קווינטה, אוקטבה) נשמעים יציבים; טרצות וסקסטות נשמעות צבעוניות; טריטון הוא האינטרוול הכי דיסוננטי ונשמע חסר מנוח.',
      en: 'An interval is the distance between two notes, measured in semitones. Each fret on the guitar is one semitone, so you can count intervals along the neck. Perfect intervals (unison, 4th, 5th, octave) sound stable; 3rds and 6ths sound colorful; the tritone is the most dissonant interval and feels restless.',
    },
  }
}
