import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
  majorScaleNotes,
  MAJOR_KEYS,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'הסולם המז׳ורי בנוי לפי הנוסחה: שלם-שלם-חצי-שלם-שלם-שלם-חצי (W-W-H-W-W-W-H). הזוגות E-F ו-B-C הם חצאי-טונים טבעיים על הפסנתר (אין שחורה ביניהם). בעזרת נוסחה זו ניתן לבנות סולם מז׳ורי מכל תו.',
  en: 'The major scale follows the formula: W-W-H-W-W-W-H (whole and half steps). The pairs E-F and B-C are natural half steps on the piano (no black key between them). Using this formula you can build a major scale from any root note.',
}

const MED_KEYS  = MAJOR_KEYS.filter(k => Math.abs(k.accidentals) <= 3)
const ALL_KEYS  = MAJOR_KEYS

type EasyShape = 'formula' | 'degree3' | 'halfstep34' | 'halfstep78' | 'notecount' | 'degree5C' | 'halfstepDeg' | 'degree7G'
type MedShape  = 'degree4Bb' | 'degree6D' | 'leadingTone' | 'subdominant' | 'tonicFrom5' | 'sharpsCount' | 'degreeNote' | 'submediant'
type HardShape = 'mediant' | 'containsBoth' | 'whichKeyHas7' | 'degreeFromFlat' | 'allDegreesFlat' | 'parallelMinor' | 'degreeName' | 'scaleContains'

export function generateMajorScaleQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['formula','degree3','halfstep34','halfstep78','notecount','degree5C','halfstepDeg','degree7G'])
  switch (shape) {
    case 'formula': {
      const correct = 'W-W-H-W-W-W-H'
      const { choices, correctIndex } = buildChoices(correct, ['W-H-W-W-H-W-W','H-W-W-H-W-W-W','W-W-W-H-W-W-H'])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'מה הנוסחה של הסולם המז׳ורי?', en: 'What is the formula for a major scale?' },
        choices, correctIndex,
        explanation: { he: 'נוסחת הסולם המז׳ורי: W-W-H-W-W-W-H (שלמים וחצאי-טונים).', en: 'The major scale formula is W-W-H-W-W-W-H (whole and half steps).' },
        theory: THEORY_TEXT,
      }
    }
    case 'degree3': {
      const key = randomOf(['C','G','D','A','F','Bb'])
      const keyInfo = MAJOR_KEYS.find(k => k.tonic === key)!
      const notes = majorScaleNotes(key, keyInfo.useFlats)
      const correct = notes[2]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: `מה התו השלישי בסולם ${key} מז׳ור?`, en: `What is the 3rd note of ${key} major?` },
        choices, correctIndex,
        explanation: { he: `התו השלישי ב-${key} מז׳ור הוא ${correct}.`, en: `The 3rd note of ${key} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'halfstep34': {
      const correct: Bilingual = { he: 'חצי-טון', en: 'Half step' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שלם', en: 'Whole step' },
        { he: 'שלם-וחצי', en: 'Whole and a half' },
        { he: 'שני שלמים', en: 'Two whole steps' },
      ])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'האם המרווח בין דרגות 3 ל-4 בסולם מז׳ורי הוא שלם או חצי-טון?', en: 'Is the interval from degree 3 to 4 in a major scale a whole step or half step?' },
        choices, correctIndex,
        explanation: { he: 'בין דרגות 3 ל-4 יש חצי-טון — זהו אחד משני חצאי-הטונים בסולם.', en: 'Between degrees 3 and 4 there is a half step — one of the two half steps in the scale.' },
        theory: THEORY_TEXT,
      }
    }
    case 'halfstep78': {
      const correct: Bilingual = { he: 'חצי-טון', en: 'Half step' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שלם', en: 'Whole step' },
        { he: 'שלם-וחצי', en: 'Whole and a half' },
        { he: 'שני שלמים', en: 'Two whole steps' },
      ])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'האם המרווח בין דרגות 7 ל-8 (אוקטבה) בסולם מז׳ורי הוא שלם או חצי-טון?', en: 'Is the interval from degree 7 to 8 in a major scale a whole step or half step?' },
        choices, correctIndex,
        explanation: { he: 'בין דרגות 7 ל-8 יש חצי-טון — זהו הטון המוביל.', en: 'Between degrees 7 and 8 there is a half step — this is the leading tone.' },
        theory: THEORY_TEXT,
      }
    }
    case 'notecount': {
      const correct = '7'
      const { choices, correctIndex } = buildChoices(correct, ['5','8','6'])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'כמה תווים יש בסולם מז׳ורי?', en: 'How many notes are in a major scale?' },
        choices, correctIndex,
        explanation: { he: 'הסולם המז׳ורי מכיל 7 תווים ייחודיים (הדרגה השמינית היא אוקטבה של הראשונה).', en: 'A major scale contains 7 unique notes (the 8th degree is an octave of the 1st).' },
        theory: THEORY_TEXT,
      }
    }
    case 'degree5C': {
      const correct = 'G'
      const { choices, correctIndex } = buildChoices(correct, ['A','F','D'])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'מה הדרגה החמישית (הדומיננטה) בסולם C מז׳ור?', en: 'What is the 5th degree of C major?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה החמישית בסולם C מז׳ור היא G — הדומיננטה.', en: 'The 5th degree of C major is G — the dominant.' },
        theory: THEORY_TEXT,
      }
    }
    case 'halfstepDeg': {
      const correct: Bilingual = { he: 'חצי-טון (סמיטון)', en: 'Half step (semitone)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טון שלם', en: 'Whole step (tone)' },
        { he: 'טרצה קטנה', en: 'Minor third' },
        { he: 'קוורטה', en: 'Perfect fourth' },
      ])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'איזה מרווח מפריד בין דרגות 3-4 ו-7-8 בסולם מז׳ורי?', en: 'Which interval separates scale degrees 3-4 and 7-8 in a major scale?' },
        choices, correctIndex,
        explanation: { he: 'בין דרגות 3-4 ו-7-8 יש חצי-טון — שתי הנקודות ה"צפופות" של הסולם.', en: 'Between degrees 3-4 and 7-8 there is a half step — the two "tight" spots of the scale.' },
        theory: THEORY_TEXT,
      }
    }
    case 'degree7G': {
      const correct = 'F#'
      const { choices, correctIndex } = buildChoices(correct, ['F','G','E'])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'easy',
        prompt: { he: 'מה התו השביעי בסולם G מז׳ור?', en: 'What is the 7th note of G major?' },
        choices, correctIndex,
        explanation: { he: 'התו השביעי ב-G מז׳ור הוא F# — הטון המוביל לגמא (G).', en: 'The 7th note of G major is F# — the leading tone back to G.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['degree4Bb','degree6D','leadingTone','subdominant','tonicFrom5','sharpsCount','degreeNote','submediant'])
  switch (shape) {
    case 'degree4Bb': {
      const notes = majorScaleNotes('Bb', true)
      const correct = notes[3]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: 'מה התו הרביעי בסולם Bb מז׳ור?', en: 'What is the 4th note of Bb major?' },
        choices, correctIndex,
        explanation: { he: `התו הרביעי ב-Bb מז׳ור הוא ${correct} — הסאב-דומיננטה.`, en: `The 4th note of Bb major is ${correct} — the subdominant.` },
        theory: THEORY_TEXT,
      }
    }
    case 'degree6D': {
      const notes = majorScaleNotes('D')
      const correct = notes[5]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: 'מה התו השישי בסולם D מז׳ור?', en: 'What is the 6th note of D major?' },
        choices, correctIndex,
        explanation: { he: `התו השישי ב-D מז׳ור הוא ${correct} — הסאב-מדיאנטה.`, en: `The 6th note of D major is ${correct} — the submediant.` },
        theory: THEORY_TEXT,
      }
    }
    case 'leadingTone': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = notes[6]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: `מה הטון המוביל (דרגה 7) של ${key.tonic} מז׳ור?`, en: `What's the leading tone (7th degree) of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `הטון המוביל של ${key.tonic} מז׳ור הוא ${correct} — הוא נמצא חצי-טון מתחת לטוניקה.`, en: `The leading tone of ${key.tonic} major is ${correct} — it sits a half step below the tonic.` },
        theory: THEORY_TEXT,
      }
    }
    case 'subdominant': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = notes[3]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: `מה הסאב-דומיננטה (דרגה 4) של ${key.tonic} מז׳ור?`, en: `What is the subdominant (4th degree) of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `הדרגה הרביעית של ${key.tonic} מז׳ור היא ${correct} — הסאב-דומיננטה.`, en: `The 4th degree of ${key.tonic} major is ${correct} — the subdominant.` },
        theory: THEORY_TEXT,
      }
    }
    case 'tonicFrom5': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const fifth = notes[4]
      const correct = key.tonic
      const otherKeys = MED_KEYS.filter(k => k.tonic !== correct).map(k => k.tonic)
      const { choices, correctIndex } = buildChoices(correct, otherKeys)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: `הדרגה החמישית של איזה סולם מז׳ורי היא ${fifth}?`, en: `Which major scale has ${fifth} as its 5th degree?` },
        choices, correctIndex,
        explanation: { he: `${fifth} היא הדרגה החמישית של ${correct} מז׳ור.`, en: `${fifth} is the 5th degree of ${correct} major.` },
        theory: THEORY_TEXT,
      }
    }
    case 'sharpsCount': {
      const sharpKeys = MAJOR_KEYS.filter(k => k.accidentals > 0)
      const key = randomOf(sharpKeys)
      const correct = `${key.accidentals}`
      const pool = ['1','2','3','4','5','6'].filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: `כמה דיאזים יש לסולם ${key.tonic} מז׳ור?`, en: `How many sharps does ${key.tonic} major have?` },
        choices, correctIndex,
        explanation: { he: `ל-${key.tonic} מז׳ור יש ${key.accidentals} דיאזים.`, en: `${key.tonic} major has ${key.accidentals} sharp(s).` },
        theory: THEORY_TEXT,
      }
    }
    case 'degreeNote': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const degreeIdx = randomOf([1,2,3,4,5,6])
      const correct = notes[degreeIdx]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: `מה התו ה-${degreeIdx+1} בסולם ${key.tonic} מז׳ור?`, en: `What is the ${degreeIdx+1}th note of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `הדרגה ה-${degreeIdx+1} של ${key.tonic} מז׳ור היא ${correct}.`, en: `The ${degreeIdx+1}th degree of ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'submediant': {
      const key = randomOf(MED_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = notes[5]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'medium',
        prompt: { he: `מה הסאב-מדיאנטה (דרגה 6) של ${key.tonic} מז׳ור?`, en: `What is the submediant (6th degree) of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `הדרגה השישית של ${key.tonic} מז׳ור היא ${correct}.`, en: `The 6th degree of ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['mediant','containsBoth','whichKeyHas7','degreeFromFlat','allDegreesFlat','parallelMinor','degreeName','scaleContains'])
  switch (shape) {
    case 'mediant': {
      const key = randomOf(ALL_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = notes[2]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `מה המדיאנטה (דרגה 3) של ${key.tonic} מז׳ור?`, en: `What is the mediant (3rd degree) of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `המדיאנטה (דרגה 3) של ${key.tonic} מז׳ור היא ${correct}.`, en: `The mediant (3rd degree) of ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'containsBoth': {
      const correct = 'D'
      const { choices, correctIndex } = buildChoices(correct, ['A','G','E'])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: 'איזה סולם מז׳ורי מכיל גם F# וגם C#?', en: 'Which major scale contains both F# and C#?' },
        choices, correctIndex,
        explanation: { he: 'ל-D מז׳ור יש 2 דיאזים: F# ו-C#.', en: 'D major has 2 sharps: F# and C#.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whichKeyHas7': {
      const flatKeys = ALL_KEYS.filter(k => k.accidentals <= -3)
      const key = randomOf(flatKeys)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const seventh = notes[6]
      const correct = key.tonic
      const otherKeys = ALL_KEYS.filter(k => k.tonic !== correct).map(k => k.tonic)
      const { choices, correctIndex } = buildChoices(correct, otherKeys)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `התו ${seventh} הוא הדרגה השביעית של איזה סולם מז׳ורי?`, en: `${seventh} is the 7th degree of which major scale?` },
        choices, correctIndex,
        explanation: { he: `${seventh} הוא הדרגה השביעית של ${correct} מז׳ור.`, en: `${seventh} is the 7th degree of ${correct} major.` },
        theory: THEORY_TEXT,
      }
    }
    case 'degreeFromFlat': {
      const key = randomOf(ALL_KEYS.filter(k => k.accidentals < 0))
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const degreeIdx = randomOf([1,2,3,4,5,6])
      const correct = notes[degreeIdx]
      const pool = notes.filter(n => n !== correct)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `מה הדרגה ה-${degreeIdx+1} בסולם ${key.tonic} מז׳ור?`, en: `What is the ${degreeIdx+1}th degree of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `הדרגה ה-${degreeIdx+1} של ${key.tonic} מז׳ור היא ${correct}.`, en: `The ${degreeIdx+1}th degree of ${key.tonic} major is ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'allDegreesFlat': {
      const key = randomOf(ALL_KEYS.filter(k => k.accidentals < -2))
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const correct = notes.join(' · ')
      const otherKey = randomOf(ALL_KEYS.filter(k => k.tonic !== key.tonic))
      const distractor1 = majorScaleNotes(otherKey.tonic, otherKey.useFlats).join(' · ')
      const otherKey2 = randomOf(ALL_KEYS.filter(k => k.tonic !== key.tonic && k.tonic !== otherKey.tonic))
      const distractor2 = majorScaleNotes(otherKey2.tonic, otherKey2.useFlats).join(' · ')
      const otherKey3 = randomOf(ALL_KEYS.filter(k => k.tonic !== key.tonic && k.tonic !== otherKey.tonic && k.tonic !== otherKey2.tonic))
      const distractor3 = majorScaleNotes(otherKey3.tonic, otherKey3.useFlats).join(' · ')
      const { choices, correctIndex } = buildChoices(correct, [distractor1, distractor2, distractor3])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `מה הם כל התווים של סולם ${key.tonic} מז׳ור?`, en: `What are all the notes of ${key.tonic} major?` },
        choices, correctIndex,
        explanation: { he: `${key.tonic} מז׳ור = ${correct}.`, en: `${key.tonic} major = ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'parallelMinor': {
      const key = randomOf(ALL_KEYS)
      majorScaleNotes(key.tonic, key.useFlats) // computed for context
      // Ask which degree is flat in natural minor vs major
      const correct: Bilingual = { he: 'דרגה 3, 6 ו-7 מונמכות', en: 'Degrees 3, 6 and 7 are lowered' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דרגה 2, 4 ו-6 מונמכות', en: 'Degrees 2, 4 and 6 are lowered' },
        { he: 'דרגה 3 ו-7 מונמכות', en: 'Degrees 3 and 7 are lowered' },
        { he: 'דרגה 6 ו-7 מונמכות', en: 'Degrees 6 and 7 are lowered' },
      ])
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `בהשוואה ל-${key.tonic} מז׳ור, אילו דרגות מונמכות ב-${key.tonic} מינור טבעי?`, en: `Compared to ${key.tonic} major, which degrees are lowered in ${key.tonic} natural minor?` },
        choices, correctIndex,
        explanation: { he: 'הסולם המינורי הטבעי מונמך בדרגות 3, 6 ו-7 בהשוואה לסולם המז׳ורי המקביל.', en: 'The natural minor scale lowers degrees 3, 6, and 7 compared to the parallel major scale.' },
        theory: THEORY_TEXT,
      }
    }
    case 'degreeName': {
      const degreeNames: Bilingual[] = [
        { he: 'טוניקה (דרגה 1)', en: 'Tonic (degree 1)' },
        { he: 'סאב-טוניקה (דרגה 2)', en: 'Supertonic (degree 2)' },
        { he: 'מדיאנטה (דרגה 3)', en: 'Mediant (degree 3)' },
        { he: 'סאב-דומיננטה (דרגה 4)', en: 'Subdominant (degree 4)' },
        { he: 'דומיננטה (דרגה 5)', en: 'Dominant (degree 5)' },
        { he: 'סאב-מדיאנטה (דרגה 6)', en: 'Submediant (degree 6)' },
        { he: 'טון מוביל (דרגה 7)', en: 'Leading tone (degree 7)' },
      ]
      const correct = randomOf(degreeNames)
      const { choices, correctIndex } = buildBilingualChoices(correct, degreeNames)
      const degreeNum = degreeNames.indexOf(correct) + 1
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `מה השם המסורתי של דרגה ${degreeNum} בסולם מז׳ורי?`, en: `What is the traditional name of degree ${degreeNum} in a major scale?` },
        choices, correctIndex,
        explanation: { he: `דרגה ${degreeNum} נקראת ${correct.he}.`, en: `Degree ${degreeNum} is called the ${correct.en}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'scaleContains': {
      const key = randomOf(ALL_KEYS)
      const notes = majorScaleNotes(key.tonic, key.useFlats)
      const testNote = randomOf(notes)
      const correct = key.tonic
      const others = ALL_KEYS.filter(k => {
        const kn = majorScaleNotes(k.tonic, k.useFlats)
        return !kn.includes(testNote) && k.tonic !== correct
      }).map(k => k.tonic)
      const pool = others.length >= 3 ? others : ALL_KEYS.filter(k => k.tonic !== correct).map(k => k.tonic)
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'major_scale', difficulty: 'hard',
        prompt: { he: `התו ${testNote} שייך לסולם של איזה מז׳ור?`, en: `${testNote} belongs to which major scale?` },
        choices,
        correctIndex,
        explanation: { he: `כן, ${testNote} הוא חלק מסולם ${key.tonic} מז׳ור.`, en: `Yes, ${testNote} is part of the ${key.tonic} major scale.` },
        theory: THEORY_TEXT,
      }
    }
  }
}
