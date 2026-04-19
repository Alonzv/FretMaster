import type { Question, Difficulty, Bilingual } from '../types'
import {
  MAJOR_KEYS,
  MAJOR_DIATONIC_QUALITIES,
  majorScaleNotes,
  randomOf,
  buildBilingualChoices,
  buildChoices,
  uid,
} from '../musicTheory'

// Three question shapes, picked at random per call:
//  1. "How many sharps/flats in key X major?"      (accidental count)
//  2. "What is the relative minor of X major?"     (relative minor)
//  3. "Which chord is the [roman] in key X major?" (diatonic chord)
//
// Easy   → natural-only keys (C, G, D, A, F) for shape 1/2; roman pool I/IV/V for shape 3.
// Medium → all 12 major keys, full roman numerals (I ii iii IV V vi vii°).
// Hard   → same as medium, plus distractors that include enharmonic near-misses.

type Shape = 'accidentals' | 'relative_minor' | 'diatonic_chord'

const EASY_KEYS = MAJOR_KEYS.filter(k => Math.abs(k.accidentals) <= 1)

export function generateCircleOfFifthsQuestion(difficulty: Difficulty): Question {
  const shape: Shape = randomOf(['accidentals', 'relative_minor', 'diatonic_chord'])
  switch (shape) {
    case 'accidentals':    return accidentalsQ(difficulty)
    case 'relative_minor': return relativeMinorQ(difficulty)
    case 'diatonic_chord': return diatonicChordQ(difficulty)
  }
}

// Shape 1: accidental count
function accidentalsQ(difficulty: Difficulty): Question {
  const keys = difficulty === 'easy' ? EASY_KEYS : MAJOR_KEYS
  const key = randomOf(keys)
  const n = Math.abs(key.accidentals)

  const correctHe = buildAccidentalsLabelHe(key.accidentals)
  const correctEn = buildAccidentalsLabelEn(key.accidentals)

  // Distractors: 0..7 sharps & 1..5 flats.
  const pool: Bilingual[] = []
  for (let i = 0; i <= 7; i++) pool.push({ he: buildAccidentalsLabelHe(i), en: buildAccidentalsLabelEn(i) })
  for (let i = -5; i <= -1; i++) pool.push({ he: buildAccidentalsLabelHe(i), en: buildAccidentalsLabelEn(i) })

  const { choices, correctIndex } = buildBilingualChoices({ he: correctHe, en: correctEn }, pool)

  return {
    id: uid(),
    categoryId: 'circle_of_fifths',
    difficulty,
    prompt: {
      he: `כמה דיאזים או במולים יש בסולם ${key.tonic} מז׳ור?`,
      en: `How many sharps or flats are in ${key.tonic} major?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: n === 0
        ? `ל-${key.tonic} מז׳ור אין דיאזים ולא במולים — זה הסולם הטבעי היחיד.`
        : `ל-${key.tonic} מז׳ור יש ${n} ${key.accidentals > 0 ? 'דיאזים' : 'במולים'}.`,
      en: n === 0
        ? `${key.tonic} major has no sharps or flats — it is the only fully natural key.`
        : `${key.tonic} major has ${n} ${key.accidentals > 0 ? 'sharp(s)' : 'flat(s)'}.`,
    },
    theory: {
      he: 'מעגל החמישיות מסדר את 12 הסולמות לפי מרחק של קווינטה זכה. כל צעד בכיוון השעון מוסיף דיאז אחד: C (0) → G (1#) → D (2#) → A (3#) → E (4#) → B (5#) → F# (6#). כל צעד נגד השעון מוסיף במול: C (0) → F (1b) → Bb (2b) → Eb (3b) → Ab (4b) → Db (5b). שינון של הסדר הזה הוא המפתח לכל התאוריה שבאה אחריו — פרוגרסיות, מודולציות, ניתוח אקורדים.',
      en: 'The circle of fifths arranges the 12 major keys by perfect-fifth distance. Each clockwise step adds one sharp: C (0) → G (1#) → D (2#) → A (3#) → E (4#) → B (5#) → F# (6#). Each counter-clockwise step adds one flat: C (0) → F (1b) → Bb (2b) → Eb (3b) → Ab (4b) → Db (5b). Memorizing this order is the key to everything that follows — progressions, modulations, chord analysis.',
    },
  }
}

function buildAccidentalsLabelHe(n: number): string {
  if (n === 0) return '0'
  if (n > 0) return `${n} #`
  return `${Math.abs(n)} ♭`
}
function buildAccidentalsLabelEn(n: number): string {
  if (n === 0) return '0'
  if (n > 0) return `${n} ♯`
  return `${Math.abs(n)} ♭`
}

// Shape 2: relative minor
function relativeMinorQ(difficulty: Difficulty): Question {
  const keys = difficulty === 'easy' ? EASY_KEYS : MAJOR_KEYS
  const key = randomOf(keys)
  const correct = `${key.relativeMinor}m`
  const pool = MAJOR_KEYS.map(k => `${k.relativeMinor}m`).concat(MAJOR_KEYS.map(k => `${k.tonic}m`))
  const { choices, correctIndex } = buildChoices(correct, pool)

  return {
    id: uid(),
    categoryId: 'circle_of_fifths',
    difficulty,
    prompt: {
      he: `מה הרלטיב מינור של ${key.tonic} מז׳ור?`,
      en: `What is the relative minor of ${key.tonic} major?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `הרלטיב מינור נמצא תמיד שישה חצאי-טונים מתחת לטוניקה של המז׳ור — כלומר תוספת של טרצה קטנה כלפי מטה. עבור ${key.tonic} מז׳ור, זה ${correct}.`,
      en: `The relative minor is always a minor 3rd below the major tonic. For ${key.tonic} major, that is ${correct}.`,
    },
    theory: {
      he: 'לכל סולם מז׳ור יש סולם מינור "שותף" שחולק איתו את אותם התווים בדיוק, אבל מתחיל במקום אחר. קוראים לזה רלטיב מינור, והוא נמצא בדרגה השישית של סולם המז׳ור (למשל: C מז׳ור חולק תווים עם A מינור, כי A הוא הדרגה השישית). זיהוי היחס הזה מאפשר לעבור בין מז׳ור למינור באותו סולם בלי לשנות טוניקה מרכזית.',
      en: 'Every major key has a "partner" minor key that shares the exact same notes but starts on a different tone. This is the relative minor, and it sits on the 6th degree of the major scale (for example: C major shares notes with A minor, since A is the 6th degree). Recognizing this relationship lets you move between major and minor in the same key without changing tonal center.',
    },
  }
}

// Shape 3: which chord is the [roman] in key X?
function diatonicChordQ(difficulty: Difficulty): Question {
  const keys = difficulty === 'easy' ? EASY_KEYS : MAJOR_KEYS
  const key = randomOf(keys)
  const degrees = difficulty === 'easy'
    ? MAJOR_DIATONIC_QUALITIES.filter(d => ['I', 'IV', 'V'].includes(d.roman))
    : MAJOR_DIATONIC_QUALITIES
  const degree = randomOf(degrees)

  const scale = majorScaleNotes(key.tonic, key.useFlats)
  const romanIdx = MAJOR_DIATONIC_QUALITIES.findIndex(d => d.roman === degree.roman)
  const root = scale[romanIdx]

  // Build chord label: root + quality suffix.
  const suffix = degree.quality === 'maj' ? '' : degree.quality === 'min' ? 'm' : '°'
  const correct = `${root}${suffix}`

  // Distractor pool: every diatonic chord from every key in the allowed set.
  const pool: string[] = []
  for (const k of keys) {
    const s = majorScaleNotes(k.tonic, k.useFlats)
    for (let i = 0; i < MAJOR_DIATONIC_QUALITIES.length; i++) {
      const d = MAJOR_DIATONIC_QUALITIES[i]
      const sfx = d.quality === 'maj' ? '' : d.quality === 'min' ? 'm' : '°'
      pool.push(`${s[i]}${sfx}`)
    }
  }

  const { choices, correctIndex } = buildChoices(correct, pool)

  return {
    id: uid(),
    categoryId: 'circle_of_fifths',
    difficulty,
    prompt: {
      he: `מה האקורד ה-${degree.roman} בסולם ${key.tonic} מז׳ור?`,
      en: `What is the ${degree.roman} chord in ${key.tonic} major?`,
    },
    choices,
    correctIndex,
    explanation: {
      he: `בסולם ${key.tonic} מז׳ור, הדרגה ה-${degree.roman} בנויה על התו ${root} והיא ${degree.qualityHe}, כלומר ${correct}.`,
      en: `In ${key.tonic} major, the ${degree.roman} degree is built on ${root} and is ${degree.qualityEn}, which gives ${correct}.`,
    },
    theory: {
      he: 'האקורדים הדיאטוניים של סולם מז׳ור עוקבים תמיד אחרי אותו תבנית: I מז׳ור, ii מינור, iii מינור, IV מז׳ור, V מז׳ור, vi מינור, vii° מוקטן. התבנית הזו לא משתנה בין סולמות, לכן ברגע שזוכרים אותה אפשר לגזור את כל האקורדים של כל סולם מז׳ור. זה הבסיס לניתוח פרוגרסיות (I-V-vi-IV, ii-V-I וכו׳).',
      en: 'The diatonic chords of a major key always follow the same pattern: I major, ii minor, iii minor, IV major, V major, vi minor, vii° diminished. This pattern never changes between keys, so once you memorize it you can derive every chord of every major key. This is the foundation of progression analysis (I-V-vi-IV, ii-V-I, etc.).',
    },
  }
}
