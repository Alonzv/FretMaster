import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
  majorScaleNotes,
  MAJOR_KEYS,
  MAJOR_DIATONIC_QUALITIES,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'הרמוניה דיאטונית מתייחסת לאקורדים הנבנים על כל דרגה של הסולם תוך שימוש אך ורק בתווי הסולם. בטונאליות מז׳ורית: I ו-IV ו-V הם מז׳ורים, ii/iii/vi מינוריים, ו-vii° מוקטן. מתח (V→I) הוא הקדנצה החזקה ביותר — הבסיס של ההרמוניה הקלאסית ורוק.',
  en: 'Diatonic harmony refers to chords built on each scale degree using only the notes of the scale. In major tonality: I, IV and V are major; ii, iii and vi are minor; vii° is diminished. The V→I tension-resolution is the strongest cadence — the foundation of classical and rock harmony.',
}

const EASY_KEYS  = MAJOR_KEYS.filter(k => Math.abs(k.accidentals) <= 1)
const MED_KEYS   = MAJOR_KEYS.filter(k => Math.abs(k.accidentals) <= 3)
const ALL_KEYS   = MAJOR_KEYS

// Build a chord name like "Dm", "G", "F#m", "D#°"
function chordName(root: string, quality: string): string {
  if (quality === 'maj') return root
  if (quality === 'min') return root + 'm'
  if (quality === 'dim') return root + '°'
  return root
}

type EasyShape = 'qualityI' | 'qualityIi' | 'qualityVii' | 'iiChordC' | 'vChordG' | 'viChordC' | 'dominantRoman' | 'primaryChords'
type MedShape  = 'ivChord' | 'iiiChord' | 'viQuality' | 'relativeMajor' | 'iiV1' | 'subdominantChord' | 'viiChord' | 'diatonicMeaning'
type HardShape = 'iiiChordFlat' | 'viiChordFlat' | 'whichKeyVii' | 'viChordFlat' | 'iiChordFlat' | 'romanFunction' | 'chordOnDegree' | 'namedDegreeChord'

export function generateDiatonicHarmonyQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['qualityI','qualityIi','qualityVii','iiChordC','vChordG','viChordC','dominantRoman','primaryChords'])
  switch (shape) {
    case 'qualityI': {
      const correct: Bilingual = { he: 'מז׳ור', en: 'Major' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מינור', en: 'Minor' },
        { he: 'מוקטן', en: 'Diminished' },
        { he: 'מוגדל', en: 'Augmented' },
      ])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מה האיכות של אקורד ה-I בסולם מז׳ורי?', en: 'What quality is the I chord in a major key?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-I (הטוניקה) בסולם מז׳ורי הוא תמיד מז׳ור.', en: 'The I chord (tonic) in a major key is always major.' },
        theory: THEORY_TEXT,
      }
    }
    case 'qualityIi': {
      const correct: Bilingual = { he: 'מינור', en: 'Minor' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מז׳ור', en: 'Major' },
        { he: 'מוקטן', en: 'Diminished' },
        { he: 'מוגדל', en: 'Augmented' },
      ])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מה האיכות של אקורד ה-ii בסולם מז׳ורי?', en: 'What quality is the ii chord in a major key?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-ii (הסאב-טוניקה) בסולם מז׳ורי הוא תמיד מינור.', en: 'The ii chord (supertonic) in a major key is always minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'qualityVii': {
      const correct: Bilingual = { he: 'מוקטן', en: 'Diminished' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מז׳ור', en: 'Major' },
        { he: 'מינור', en: 'Minor' },
        { he: 'מוגדל', en: 'Augmented' },
      ])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מה האיכות של אקורד ה-vii° בסולם מז׳ורי?', en: 'What quality is the vii° chord in a major key?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-vii° הוא תמיד מוקטן בסולם מז׳ורי.', en: 'The vii° chord is always diminished in a major key.' },
        theory: THEORY_TEXT,
      }
    }
    case 'iiChordC': {
      const correct = 'Dm'
      const { choices, correctIndex } = buildChoices(correct, ['Em','Am','Bm'])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מה אקורד ה-ii ב-C מז׳ור?', en: 'What is the ii chord in C major?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-ii ב-C מז׳ור הוא Dm — בנוי על הדרגה השנייה (D) עם תווי הסולם בלבד.', en: 'The ii chord in C major is Dm — built on the 2nd degree (D) using only scale tones.' },
        theory: THEORY_TEXT,
      }
    }
    case 'vChordG': {
      const correct = 'D'
      const { choices, correctIndex } = buildChoices(correct, ['A','E','C'])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מה אקורד ה-V ב-G מז׳ור?', en: 'What is the V chord in G major?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-V (הדומיננטה) ב-G מז׳ור הוא D — בנוי על הדרגה החמישית.', en: 'The V chord (dominant) in G major is D — built on the 5th degree.' },
        theory: THEORY_TEXT,
      }
    }
    case 'viChordC': {
      const correct = 'Am'
      const { choices, correctIndex } = buildChoices(correct, ['Em','Dm','Bm'])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מה אקורד ה-vi ב-C מז׳ור?', en: 'What is the vi chord in C major?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-vi ב-C מז׳ור הוא Am — הוא גם המינור הרלטיבי.', en: 'The vi chord in C major is Am — it is also the relative minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dominantRoman': {
      const correct = 'V'
      const { choices, correctIndex } = buildChoices(correct, ['I','IV','vii°'])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'איזה ציון רומי מייצג את הדומיננטה?', en: 'Which Roman numeral represents the dominant chord?' },
        choices, correctIndex,
        explanation: { he: 'ה-V הוא הדומיננטה — הדרגה החמישית, שיוצרת מתח שנפתר אל ה-I.', en: 'V is the dominant — the 5th degree that creates tension resolved by the I chord.' },
        theory: THEORY_TEXT,
      }
    }
    case 'primaryChords': {
      const correct = 'I, IV, V'
      const { choices, correctIndex } = buildChoices(correct, ['I, ii, V','I, iii, vi','I, V, vii°'])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'easy',
        prompt: { he: 'מהם שלושת האקורדים הראשיים (עמודי התווך) בסולם מז׳ורי?', en: 'What are the three primary chords (pillars) of a major key?' },
        choices, correctIndex,
        explanation: { he: 'I (טוניקה), IV (סאב-דומיננטה) ו-V (דומיננטה) הם שלושת האקורדים הראשיים.', en: 'I (tonic), IV (subdominant) and V (dominant) are the three primary chords.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['ivChord','iiiChord','viQuality','relativeMajor','iiV1','subdominantChord','viiChord','diatonicMeaning'])
  switch (shape) {
    case 'ivChord': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[3], 'maj')
      const pool = [chordName(notes[0],'maj'), chordName(notes[1],'min'), chordName(notes[4],'maj'), chordName(notes[5],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: `מה אקורד ה-IV ב-${key.tonic} מז׳ור?`, en: `What is the IV chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-IV ב-${key.tonic} מז׳ור הוא ${correct} — בנוי על ${notes[3]}.`, en: `The IV chord in ${key.tonic} major is ${correct} — built on ${notes[3]}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'iiiChord': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[2], 'min')
      const pool = [chordName(notes[0],'maj'), chordName(notes[3],'maj'), chordName(notes[5],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: `מה אקורד ה-iii ב-${key.tonic} מז׳ור?`, en: `What is the iii chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-iii ב-${key.tonic} מז׳ור הוא ${correct} — מינור, בנוי על ${notes[2]}.`, en: `The iii chord in ${key.tonic} major is ${correct} — minor, built on ${notes[2]}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'viQuality': {
      const correct: Bilingual = { he: 'מינור', en: 'Minor' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מז׳ור', en: 'Major' },
        { he: 'מוקטן', en: 'Diminished' },
        { he: 'מוגדל', en: 'Augmented' },
      ])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: 'מה האיכות של אקורד ה-vi בסולם מז׳ורי?', en: 'What chord quality is the vi chord in a major key?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ה-vi הוא תמיד מינור — הוא הסולם המינורי הרלטיבי.', en: 'The vi chord is always minor — it is the relative minor of the key.' },
        theory: THEORY_TEXT,
      }
    }
    case 'relativeMajor': {
      const key = randomOf(MED_KEYS)
      const correct = key.relativeMinor + 'm'
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const pool = notes.map(n => n + 'm').filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: `מה המינור הרלטיבי של ${key.tonic} מז׳ור?`, en: `What is the relative minor of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `המינור הרלטיבי של ${key.tonic} מז׳ור הוא ${key.relativeMinor}m — בנוי על הדרגה השישית.`, en: `The relative minor of ${key.tonic} major is ${key.relativeMinor}m — built on the 6th degree.` },
        theory: THEORY_TEXT,
      }
    }
    case 'iiV1': {
      const key = randomOf(EASY_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const ii  = chordName(notes[1], 'min')
      const V   = chordName(notes[4], 'maj')
      const I   = chordName(notes[0], 'maj')
      const correct = `${ii} - ${V} - ${I}`
      const { choices, correctIndex } = buildChoices(correct, [
        `${I} - ${V} - ${ii}`,
        `${V} - ${ii} - ${I}`,
        `${ii} - ${I} - ${V}`,
      ])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: `מה הפרוגרסיה ii-V-I ב-${key.tonic} מז׳ור?`, en: `What is the ii-V-I progression in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `ii-V-I ב-${key.tonic} מז׳ור = ${correct}.`, en: `ii-V-I in ${key.tonic} major = ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'subdominantChord': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[3], 'maj')
      const pool = [chordName(notes[0],'maj'), chordName(notes[4],'maj'), chordName(notes[1],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: `מהי הסאב-דומיננטה (IV) ב-${key.tonic} מז׳ור?`, en: `Which chord is the subdominant (IV) in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `הסאב-דומיננטה של ${key.tonic} מז׳ור היא ${correct}.`, en: `The subdominant of ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'viiChord': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[6], 'dim')
      const pool = [chordName(notes[0],'maj'), chordName(notes[4],'maj'), chordName(notes[1],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: `מה אקורד ה-vii° ב-${key.tonic} מז׳ור?`, en: `What is the vii° chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-vii° ב-${key.tonic} מז׳ור הוא ${correct} — מוקטן, בנוי על ${notes[6]}.`, en: `The vii° chord in ${key.tonic} major is ${correct} — diminished, built on ${notes[6]}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'diatonicMeaning': {
      const correct: Bilingual = { he: 'שימוש בתווים מתוך הסולם בלבד', en: 'Using only notes from the key' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שימוש בכרומטיקה', en: 'Using chromatic notes' },
        { he: 'שינוי מפתח', en: 'Changing key' },
        { he: 'הוספת תווים זרים', en: 'Adding foreign notes' },
      ])
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'medium',
        prompt: { he: 'מה פירוש המונח "דיאטוני"?', en: "What does 'diatonic' mean?" },
        choices, correctIndex,
        explanation: { he: '"דיאטוני" פירושו שימוש אך ורק בתווים שייכים לסולם הנוכחי.', en: "'Diatonic' means using only notes that belong to the current key." },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['iiiChordFlat','viiChordFlat','whichKeyVii','viChordFlat','iiChordFlat','romanFunction','chordOnDegree','namedDegreeChord'])
  switch (shape) {
    case 'iiiChordFlat': {
      const key = randomOf(ALL_KEYS.filter(k => k.accidentals < 0))
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[2], 'min')
      const pool = [chordName(notes[0],'maj'), chordName(notes[3],'maj'), chordName(notes[5],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה אקורד ה-iii ב-${key.tonic} מז׳ור?`, en: `What is the iii chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-iii ב-${key.tonic} מז׳ור הוא ${correct}.`, en: `The iii chord in ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'viiChordFlat': {
      const key = randomOf(ALL_KEYS.filter(k => k.accidentals < 0))
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[6], 'dim')
      const pool = [chordName(notes[0],'maj'), chordName(notes[4],'maj'), chordName(notes[1],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה אקורד ה-vii° ב-${key.tonic} מז׳ור?`, en: `What is the vii° chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-vii° ב-${key.tonic} מז׳ור הוא ${correct}.`, en: `The vii° chord in ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'whichKeyVii': {
      const key = randomOf(ALL_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const seventh = notes[6]
      const correct = key.tonic
      const others = ALL_KEYS.filter(k => k.tonic !== correct).map(k => k.tonic)
      const { choices, correctIndex } = buildChoices(correct, others)
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `ב-${seventh}° הוא ה-vii° של איזה סולם מז׳ורי?`, en: `${seventh}° is the vii° of which major key?` },
        choices, correctIndex,
        explanation: { he: `${seventh}° הוא ה-vii° של ${correct} מז׳ור.`, en: `${seventh}° is the vii° of ${correct} major.` },
        theory: THEORY_TEXT,
      }
    }
    case 'viChordFlat': {
      const key = randomOf(ALL_KEYS.filter(k => k.accidentals < -1))
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[5], 'min')
      const pool = [chordName(notes[0],'maj'), chordName(notes[3],'maj'), chordName(notes[1],'min')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה אקורד ה-vi ב-${key.tonic} מז׳ור?`, en: `What is the vi chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-vi ב-${key.tonic} מז׳ור הוא ${correct}.`, en: `The vi chord in ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'iiChordFlat': {
      const key = randomOf(ALL_KEYS.filter(k => k.accidentals < 0))
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = chordName(notes[1], 'min')
      const pool = [chordName(notes[0],'maj'), chordName(notes[3],'maj'), chordName(notes[4],'maj')]
      const { choices, correctIndex } = buildChoices(correct, pool.filter(c => c !== correct))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה אקורד ה-ii ב-${key.tonic} מז׳ור?`, en: `What is the ii chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `אקורד ה-ii ב-${key.tonic} מז׳ור הוא ${correct} — מינור.`, en: `The ii chord in ${key.tonic} major is ${correct} — minor.` },
        theory: THEORY_TEXT,
      }
    }
    case 'romanFunction': {
      const functions: Array<{roman: string; fn: Bilingual}> = [
        { roman: 'I',    fn: { he: 'טוניקה — מנוחה ויציבות', en: 'Tonic — rest and stability' } },
        { roman: 'IV',   fn: { he: 'סאב-דומיננטה — תנועה ורחיקה', en: 'Subdominant — movement away from home' } },
        { roman: 'V',    fn: { he: 'דומיננטה — מתח שנפתר ל-I', en: 'Dominant — tension that resolves to I' } },
        { roman: 'vi',   fn: { he: 'טוניקה מינורית — מינור הרלטיבי', en: 'Minor tonic — the relative minor' } },
        { roman: 'ii',   fn: { he: 'פרה-דומיננטה — מוביל ל-V', en: 'Pre-dominant — leads to V' } },
        { roman: 'vii°', fn: { he: 'מוקטן — מתח חזק, מוביל ל-I', en: 'Diminished — strong tension, leads to I' } },
      ]
      const item = randomOf(functions)
      const { choices, correctIndex } = buildBilingualChoices(item.fn, functions.map(f => f.fn).filter(f => f.en !== item.fn.en))
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה הפונקציה ההרמונית של אקורד ה-${item.roman}?`, en: `What is the harmonic function of the ${item.roman} chord?` },
        choices, correctIndex,
        explanation: { he: `ה-${item.roman}: ${item.fn.he}.`, en: `The ${item.roman}: ${item.fn.en}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'chordOnDegree': {
      const key = randomOf(ALL_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const degreeIdx = randomOf([0,1,2,3,4,5,6])
      const quality = MAJOR_DIATONIC_QUALITIES[degreeIdx].quality
      const correct = chordName(notes[degreeIdx], quality)
      const pool = [0,1,2,3,4,5,6].filter(i => i !== degreeIdx).map(i => chordName(notes[i], MAJOR_DIATONIC_QUALITIES[i].quality))
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה האקורד ה-${MAJOR_DIATONIC_QUALITIES[degreeIdx].roman} ב-${key.tonic} מז׳ור?`, en: `What is the ${MAJOR_DIATONIC_QUALITIES[degreeIdx].roman} chord in ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `ה-${MAJOR_DIATONIC_QUALITIES[degreeIdx].roman} ב-${key.tonic} מז׳ור הוא ${correct}.`, en: `The ${MAJOR_DIATONIC_QUALITIES[degreeIdx].roman} in ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'namedDegreeChord': {
      const degreeNames = ['טוניקה (I)','סאב-טוניקה (ii)','מדיאנטה (iii)','סאב-דומיננטה (IV)','דומיננטה (V)','סאב-מדיאנטה (vi)','טון מוביל (vii°)']
      const degreeNamesEn = ['Tonic (I)','Supertonic (ii)','Mediant (iii)','Subdominant (IV)','Dominant (V)','Submediant (vi)','Leading tone (vii°)']
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const degreeIdx = randomOf([0,1,2,3,4,5,6])
      const quality = MAJOR_DIATONIC_QUALITIES[degreeIdx].quality
      const correct = chordName(notes[degreeIdx], quality)
      const pool = [0,1,2,3,4,5,6].filter(i => i !== degreeIdx).map(i => chordName(notes[i], MAJOR_DIATONIC_QUALITIES[i].quality))
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'diatonic_harmony', difficulty: 'hard',
        prompt: { he: `מה ה${degreeNames[degreeIdx]} של ${key.tonic} מז׳ור?`, en: `What is the ${degreeNamesEn[degreeIdx]} of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `ה${degreeNames[degreeIdx]} של ${key.tonic} מז׳ור הוא ${correct}.`, en: `The ${degreeNamesEn[degreeIdx]} of ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
  }
}
