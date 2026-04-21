import type { Question, Difficulty } from '../types'
import {
  NOTE_NAMES_SHARP,
  pitchClass,
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'הסולם הפנטטוני הוא סולם בן 5 תווים שנפוץ בגיטרה. הסולם הפנטטוני המינורי (W+H-W-W-W+H-W) נטול חצאי-טונים — זו הסיבה שהוא "בטוח" לנגן מעל כמעט כל אקורד. סולם הבלוז מוסיף b5 (טריטון) לפנטטוני המינורי ויוצר את הצליל הבלוזי האופייני.',
  en: 'The pentatonic scale is a 5-note scale widely used in guitar. The minor pentatonic (W+H-W-W-W+H-W) has no semitones — that is why it sounds "safe" over almost any chord. The blues scale adds a b5 (tritone) to the minor pentatonic, creating the characteristic bluesy sound.',
}

// Minor pentatonic: root, b3, 4, 5, b7
function minorPentatonicNotes(root: string): string[] {
  const pc = pitchClass(root)
  const intervals = [0, 3, 5, 7, 10]
  return intervals.map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}

// Major pentatonic: root, M2, M3, 5, M6
function majorPentatonicNotes(root: string): string[] {
  const pc = pitchClass(root)
  const intervals = [0, 2, 4, 7, 9]
  return intervals.map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}

const EASY_ROOTS = ['A','E','C','G','D']

type EasyShape = 'noteCount' | 'skippedDegrees' | 'blueNote' | 'amNotes' | 'emRoot' | 'blueNoteAlias' | 'relativePenta' | 'guitarFriendly'
type MedShape  = 'emPentaNotes' | 'gmPentaNotes' | 'cmajPenta' | 'skipComparison' | 'bluesB7' | 'boxPattern' | 'bluesInterval' | 'dMinorOver'
type HardShape = 'bmPentaNotes' | 'relativeMajor' | 'twelvebar' | 'bluesScale' | 'mixolydianLink' | 'boxCount' | 'happyPenta' | 'countryNote'

export function generatePentatonicBluesQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['noteCount','skippedDegrees','blueNote','amNotes','emRoot','blueNoteAlias','relativePenta','guitarFriendly'])
  switch (shape) {
    case 'noteCount': {
      const correct = '5'
      const { choices, correctIndex } = buildChoices(correct, ['7','6','8'])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'כמה תווים יש בסולם פנטטוני?', en: 'How many notes are in a pentatonic scale?' },
        choices, correctIndex,
        explanation: { he: 'פנטטוני = 5 תווים (מיוונית: penta = חמש).', en: 'Pentatonic = 5 notes (from Greek: penta = five).' },
        theory: THEORY_TEXT,
      }
    }
    case 'skippedDegrees': {
      const correct: Bilingual = { he: 'דרגות 2 ו-6', en: '2nd and 6th degrees' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דרגות 4 ו-7', en: '4th and 7th degrees' },
        { he: 'דרגות 2 ו-7', en: '2nd and 7th degrees' },
        { he: 'דרגות 3 ו-5', en: '3rd and 5th degrees' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'אילו דרגות מושמטות בהשוואה לסולם מינורי טבעי כדי ליצור פנטטוני מינורי?', en: 'Which degrees of the natural minor scale are removed to create the minor pentatonic?' },
        choices, correctIndex,
        explanation: { he: 'הפנטטוני המינורי מסיר דרגות 2 ו-6 מהסולם המינורי הטבעי.', en: 'The minor pentatonic removes the 2nd and 6th degrees from the natural minor scale.' },
        theory: THEORY_TEXT,
      }
    }
    case 'blueNote': {
      const correct: Bilingual = { he: 'b5 (טריטון)', en: 'b5 (tritone)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'b7 (ספטימה קטנה)', en: 'b7 (minor 7th)' },
        { he: '#4 (קוורטה מוגדלת)', en: '#4 (augmented 4th)' },
        { he: 'b3 (טרצה קטנה)', en: 'b3 (minor 3rd)' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'איזה "תו כחול" מתווסף לפנטטוני המינורי ליצירת סולם הבלוז?', en: 'What blues note is added to the minor pentatonic to create the blues scale?' },
        choices, correctIndex,
        explanation: { he: 'ה-b5 (הטריטון) הוא ה"תו הכחול" שמעניק לסולם הבלוז את צלילו האופייני.', en: 'The b5 (tritone) is the "blue note" that gives the blues scale its characteristic sound.' },
        theory: THEORY_TEXT,
      }
    }
    case 'amNotes': {
      const notes = minorPentatonicNotes('A')
      const correct = notes.join(', ')
      const other1 = minorPentatonicNotes('E').join(', ')
      const other2 = minorPentatonicNotes('D').join(', ')
      const other3 = minorPentatonicNotes('G').join(', ')
      const { choices, correctIndex } = buildChoices(correct, [other1, other2, other3])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'מה התווים של Am פנטטוני?', en: 'What are the notes of Am pentatonic?' },
        choices, correctIndex,
        explanation: { he: `Am פנטטוני: ${correct} — Root, b3, 4, 5, b7.`, en: `Am pentatonic: ${correct} — Root, b3, 4, 5, b7.` },
        theory: THEORY_TEXT,
      }
    }
    case 'emRoot': {
      const correct = 'E'
      const { choices, correctIndex } = buildChoices(correct, ['A','G','B'])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'מה השורש (root) של E מינור פנטטוני?', en: 'What is the root of E minor pentatonic?' },
        choices, correctIndex,
        explanation: { he: 'השורש של E מינור פנטטוני הוא E — השם מציין את השורש.', en: 'The root of E minor pentatonic is E — the name indicates the root.' },
        theory: THEORY_TEXT,
      }
    }
    case 'blueNoteAlias': {
      const correct: Bilingual = { he: 'b5 / קווינטה מוקטנת', en: 'b5 / flattened 5th' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'b7 / ספטימה קטנה', en: 'b7 / minor 7th' },
        { he: 'b3 / טרצה קטנה', en: 'b3 / minor 3rd' },
        { he: '#4 / קוורטה מוגדלת', en: '#4 / augmented 4th' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'מה שמו האחר של "התו הכחול" (blue note)?', en: "What is another name for the 'blue note'?" },
        choices, correctIndex,
        explanation: { he: 'ה"תו הכחול" = b5 = קווינטה מוקטנת = טריטון.', en: "The 'blue note' = b5 = flattened 5th = tritone." },
        theory: THEORY_TEXT,
      }
    }
    case 'relativePenta': {
      const correct: Bilingual = { he: 'נכון — הם אנרמוניים (שווים)', en: 'True — they share the same notes' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לא נכון — הם שונים לחלוטין', en: 'False — they are completely different' },
        { he: 'נכון רק עבור מז׳ור', en: 'True only for major' },
        { he: 'רק שלושה תווים משותפים', en: 'Only three notes are shared' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'Am פנטטוני ו-C מז׳ור פנטטוני חולקים את אותם התווים — נכון או לא נכון?', en: 'Am pentatonic and C major pentatonic share the same notes — true or false?' },
        choices, correctIndex,
        explanation: { he: 'נכון! Am פנטטוני ו-C מז׳ור פנטטוני הם פנטטונים רלטיביים — אותם 5 תווים.', en: 'True! Am pentatonic and C major pentatonic are relative pentatonics — the same 5 notes.' },
        theory: THEORY_TEXT,
      }
    }
    case 'guitarFriendly': {
      const correct: Bilingual = { he: 'פנטטוני מינורי', en: 'Minor pentatonic' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לידי', en: 'Lydian' },
        { he: 'כרומטי', en: 'Chromatic' },
        { he: 'מז׳ורי הרמוני', en: 'Harmonic major' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'easy',
        prompt: { he: 'איזה סולם נחשב ל"הכי ידידותי לגיטרה" לאלתור?', en: "Which scale is considered the most 'guitar-friendly' for soloing?" },
        choices, correctIndex,
        explanation: { he: 'הפנטטוני המינורי הוא הסולם הפופולרי ביותר לאלתור בגיטרה — חמש תבניות (בוקסים) על צוואר הגיטרה.', en: 'The minor pentatonic is the most popular scale for guitar soloing — five box patterns across the neck.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['emPentaNotes','gmPentaNotes','cmajPenta','skipComparison','bluesB7','boxPattern','bluesInterval','dMinorOver'])
  switch (shape) {
    case 'emPentaNotes': {
      const notes = minorPentatonicNotes('E')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        minorPentatonicNotes('A').join(', '),
        minorPentatonicNotes('B').join(', '),
        minorPentatonicNotes('D').join(', '),
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'מה התווים של E מינור פנטטוני?', en: 'What are the notes of E minor pentatonic?' },
        choices, correctIndex,
        explanation: { he: `E מינור פנטטוני: ${correct}.`, en: `E minor pentatonic: ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'gmPentaNotes': {
      const notes = minorPentatonicNotes('G')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        minorPentatonicNotes('D').join(', '),
        minorPentatonicNotes('C').join(', '),
        minorPentatonicNotes('F').join(', '),
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'מה התווים של G מינור פנטטוני?', en: 'What are the notes of G minor pentatonic?' },
        choices, correctIndex,
        explanation: { he: `G מינור פנטטוני: ${correct}.`, en: `G minor pentatonic: ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'cmajPenta': {
      const notes = majorPentatonicNotes('C')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        majorPentatonicNotes('G').join(', '),
        minorPentatonicNotes('A').join(', '),
        majorPentatonicNotes('F').join(', '),
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'מה התווים של C מז׳ור פנטטוני?', en: 'What are the notes of C major pentatonic?' },
        choices, correctIndex,
        explanation: { he: `C מז׳ור פנטטוני: ${correct} — Root, M2, M3, 5, M6.`, en: `C major pentatonic: ${correct} — Root, M2, M3, 5, M6.` },
        theory: THEORY_TEXT,
      }
    }
    case 'skipComparison': {
      const correct: Bilingual = { he: 'דרגות 2 ו-6', en: '2nd and 6th degrees' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דרגות 4 ו-7', en: '4th and 7th degrees' },
        { he: 'דרגות 1 ו-5', en: '1st and 5th degrees' },
        { he: 'דרגות 3 ו-6', en: '3rd and 6th degrees' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'אילו 2 דרגות הפנטטוני המינורי מדלג עליהן בהשוואה למינור הטבעי?', en: 'What 2 degrees does the minor pentatonic skip compared to natural minor?' },
        choices, correctIndex,
        explanation: { he: 'המינור הטבעי (7 תווים) - דרגות 2 ו-6 = פנטטוני מינורי (5 תווים).', en: 'Natural minor (7 notes) - degrees 2 and 6 = minor pentatonic (5 notes).' },
        theory: THEORY_TEXT,
      }
    }
    case 'bluesB7': {
      const correct: Bilingual = { he: 'אקורד דומיננטי 7 (קווינטה-ספטימה)', en: 'Dominant 7th chord' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אקורד מינורי מז׳ור 7', en: 'Minor major 7th chord' },
        { he: 'אקורד מוגדל', en: 'Augmented chord' },
        { he: 'אקורד מוקטן', en: 'Diminished chord' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'בבלוז, איזה סוג אקורד משתמש ב-b7 כחלק אופייני?', en: 'In blues, which chord type typically uses the b7?' },
        choices, correctIndex,
        explanation: { he: 'אקורד הדומיננטי 7 (למשל A7) מכיל b7 — זה הצליל הבלוזי האופייני.', en: 'The dominant 7th chord (e.g. A7) contains the b7 — this is the characteristic blues sound.' },
        theory: THEORY_TEXT,
      }
    }
    case 'boxPattern': {
      const correct: Bilingual = { he: 'תבנית 5 תווים בתוך כמה פרטים, שניתן לחזור עליה בכל מיקום', en: 'A 5-note position pattern playable at any fret position' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לנגן רק בפוזיציה הפתוחה', en: 'Playing only in open position' },
        { he: 'אקורד בצורת בוקס', en: 'A chord in a box shape' },
        { he: 'סולם בשלושה אוקטבות', en: 'A scale spanning three octaves' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'מה הכוונה ב"תבנית הבוקס" (box pattern) בפנטטוני?', en: "What is the 'box pattern' in pentatonic?" },
        choices, correctIndex,
        explanation: { he: 'תבנית הבוקס היא תצורה ויזואלית של 5 תווי הפנטטוני בתוך מספר פרטים — ניתן להזזה לכל מיקום.', en: 'The box pattern is a visual shape of the 5 pentatonic notes within a few frets — movable to any position.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bluesInterval': {
      const correct: Bilingual = { he: 'b5 (טריטון)', en: 'b5 (tritone)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'b7 (ספטימה קטנה)', en: 'b7 (minor 7th)' },
        { he: 'b3 (טרצה קטנה)', en: 'b3 (minor 3rd)' },
        { he: 'b2 (סקונדה קטנה)', en: 'b2 (minor 2nd)' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'איזה מרווח מאפיין את סולם הבלוז לעומת הפנטטוני?', en: 'What interval characterizes the blues scale over the pentatonic?' },
        choices, correctIndex,
        explanation: { he: 'סולם הבלוז = פנטטוני מינורי + b5 (הטריטון).', en: 'Blues scale = minor pentatonic + b5 (the tritone).' },
        theory: THEORY_TEXT,
      }
    }
    case 'dMinorOver': {
      const correct: Bilingual = { he: 'Dm או Dm7', en: 'Dm or Dm7' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'D7 (דומיננטי)', en: 'D7 (dominant)' },
        { he: 'Dmaj7', en: 'Dmaj7' },
        { he: 'D° (מוקטן)', en: 'D° (diminished)' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'medium',
        prompt: { he: 'D מינור פנטטוני הכי טבעי מעל איזה אקורד?', en: 'D minor pentatonic sounds most natural over which chord?' },
        choices, correctIndex,
        explanation: { he: 'D מינור פנטטוני מתאים בצורה הטבעית ביותר מעל Dm או Dm7.', en: 'D minor pentatonic fits most naturally over Dm or Dm7.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['bmPentaNotes','relativeMajor','twelvebar','bluesScale','mixolydianLink','boxCount','happyPenta','countryNote'])
  switch (shape) {
    case 'bmPentaNotes': {
      const notes = minorPentatonicNotes('B')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        minorPentatonicNotes('E').join(', '),
        minorPentatonicNotes('F#').join(', '),
        minorPentatonicNotes('D').join(', '),
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'מה התווים של B מינור פנטטוני?', en: 'What are the notes of B minor pentatonic?' },
        choices, correctIndex,
        explanation: { he: `B מינור פנטטוני: ${correct}.`, en: `B minor pentatonic: ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'relativeMajor': {
      const root = randomOf(EASY_ROOTS)
      const majorPentRoot = NOTE_NAMES_SHARP[(pitchClass(root) + 3) % 12]
      const correct = `${majorPentRoot} מז׳ור פנטטוני`
      const others = EASY_ROOTS.filter(r => r !== root).map(r => `${NOTE_NAMES_SHARP[(pitchClass(r) + 3) % 12]} מז׳ור פנטטוני`)
      const { choices, correctIndex } = buildChoices(correct, others)
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: `מה הפנטטוני המז׳ורי הרלטיבי של ${root} מינור פנטטוני?`, en: `What is the major pentatonic relative of ${root} minor pentatonic?` },
        choices: choices.map(c => ({ he: c.he.replace(' מז׳ור פנטטוני', ' major pentatonic'), en: c.en.replace(' מז׳ור פנטטוני', ' major pentatonic') })),
        correctIndex,
        explanation: { he: `הרלטיבי המז׳ורי של ${root} מינור פנטטוני הוא ${majorPentRoot} מז׳ור פנטטוני.`, en: `The major pentatonic relative of ${root} minor pentatonic is ${majorPentRoot} major pentatonic.` },
        theory: THEORY_TEXT,
      }
    }
    case 'twelvebar': {
      const correct = 'A7, D7, E7'
      const { choices, correctIndex } = buildChoices(correct, ['A7, G7, D7', 'Am, Dm, Em', 'A, D, E'])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'ב-12 תיבות בלוז ב-A, אילו שלושה אקורדים דומיננטים משמשים?', en: 'In the 12-bar blues in A, which three dominant chords are used?' },
        choices, correctIndex,
        explanation: { he: 'ה-12 בר בלוז ב-A: I7=A7, IV7=D7, V7=E7.', en: 'The 12-bar blues in A: I7=A7, IV7=D7, V7=E7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bluesScale': {
      const correct: Bilingual = { he: 'פנטטוני מינורי + b5', en: 'Minor pentatonic + b5' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'פנטטוני מז׳ורי + b3', en: 'Major pentatonic + b3' },
        { he: 'מינור טבעי + b5', en: 'Natural minor + b5' },
        { he: 'פריגי + b7', en: 'Phrygian + b7' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'איזה סולם משלב פנטטוני מינורי עם b5?', en: 'What scale combines minor pentatonic + b5?' },
        choices, correctIndex,
        explanation: { he: 'סולם הבלוז = פנטטוני מינורי (5 תווים) + b5 = 6 תווים.', en: 'Blues scale = minor pentatonic (5 notes) + b5 = 6 notes.' },
        theory: THEORY_TEXT,
      }
    }
    case 'mixolydianLink': {
      const correct: Bilingual = { he: 'מיקסולידי = מז׳ור עם b7 — אותו b7 שבאקורד הדומיננטי 7', en: 'Mixolydian = major with b7 — same b7 as in the dominant 7 chord' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מיקסולידי = מינור עם #6', en: 'Mixolydian = minor with #6' },
        { he: 'מיקסולידי = לידי עם #4', en: 'Mixolydian = Lydian with #4' },
        { he: 'מיקסולידי = דוריאן עם b2', en: 'Mixolydian = Dorian with b2' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'מה הקשר בין מיקסולידי לבלוז דומיננטי?', en: 'What is the Mixolydian connection to dominant blues?' },
        choices, correctIndex,
        explanation: { he: 'מיקסולידי מכיל b7 — אותה דרגה שמגדירה אקורד דומיננטי 7 — ולכן מתאים לנגינת בלוז.', en: 'Mixolydian contains the b7 — the same note that defines the dominant 7 chord — making it ideal for blues.' },
        theory: THEORY_TEXT,
      }
    }
    case 'boxCount': {
      const correct = '5'
      const { choices, correctIndex } = buildChoices(correct, ['3','7','12'])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'כמה תבניות בוקס יש לפנטטוני המינורי?', en: 'How many positions (box patterns) does the minor pentatonic have?' },
        choices, correctIndex,
        explanation: { he: '5 תבניות בוקס — כל אחת מתאימה לצורת CAGED אחת ומכסה את כל הצוואר.', en: '5 box patterns — each corresponding to one CAGED shape and covering the whole neck.' },
        theory: THEORY_TEXT,
      }
    }
    case 'happyPenta': {
      const correct: Bilingual = { he: 'פנטטוני מז׳ורי', en: 'Major pentatonic' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'פנטטוני מינורי', en: 'Minor pentatonic' },
        { he: 'סולם בלוז', en: 'Blues scale' },
        { he: 'לידי', en: 'Lydian' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'איזה סולם פנטטוני נשמע "מז׳ורי" ו"שמח"?', en: "What pentatonic scale sounds 'major' and 'happy'?" },
        choices, correctIndex,
        explanation: { he: 'הפנטטוני המז׳ורי (Root, M2, M3, 5, M6) נשמע בהיר ושמח — נפוץ בקאנטרי ובפופ.', en: 'The major pentatonic (Root, M2, M3, 5, M6) sounds bright and happy — common in country and pop.' },
        theory: THEORY_TEXT,
      }
    }
    case 'countryNote': {
      const correct: Bilingual = { he: 'b3 (טרצה קטנה — ה"תו הכחול")', en: 'b3 (minor 3rd — the "blue note")' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: '#4 (קוורטה מוגדלת)', en: '#4 (augmented 4th)' },
        { he: 'b7 (ספטימה קטנה)', en: 'b7 (minor 7th)' },
        { he: 'b2 (סקונדה קטנה)', en: 'b2 (minor 2nd)' },
      ])
      return {
        id: uid(), categoryId: 'pentatonic_blues', difficulty: 'hard',
        prompt: { he: 'הפנטטוני ה"קאנטרי" מוסיף לרוב איזה תו לפנטטוני המז׳ורי?', en: "The 'country' pentatonic often adds which note to the major pentatonic?" },
        choices, correctIndex,
        explanation: { he: 'הפנטטוני ה"קאנטרי" מוסיף b3 (טרצה קטנה) לפנטטוני המז׳ורי — ויוצר מתח בין מז׳ור למינור.', en: "The 'country' pentatonic adds b3 to the major pentatonic — creating tension between major and minor." },
        theory: THEORY_TEXT,
      }
    }
  }
}
