import type { Question, Difficulty } from '../types'
import {
  NOTE_NAMES_SHARP,
  NOTE_NAMES_FLAT,
  pitchClass,
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'ישנם שלושה סוגי סולמות מינוריים: טבעי (Aeolian) — הנפוץ ביותר, הרמוני — מעלה את הדרגה השביעית ליצירת קדנצה חזקה (V→i), ומלודי — מעלה דרגות 6 ו-7 עלייה ויורד לטבעי ירידה. הסולם ההרמוני נפוץ בקלאסיקה ופלמנקו, המלודי — בג׳אז.',
  en: 'There are three types of minor scales: natural (Aeolian) — the most common; harmonic minor — raises the 7th degree to create a strong V→i cadence; and melodic minor — raises the 6th and 7th ascending, reverts to natural minor descending. Harmonic minor is used in classical and flamenco; melodic in jazz.',
}

// Natural minor: W-H-W-W-H-W-W
function naturalMinorNotes(root: string): string[] {
  const pc = pitchClass(root)
  const steps = [0, 2, 3, 5, 7, 8, 10]
  return steps.map(s => NOTE_NAMES_SHARP[(pc + s) % 12])
}

// Harmonic minor: same but raise degree 7 (+1 semitone)
function harmonicMinorNotes(root: string): string[] {
  const pc = pitchClass(root)
  const steps = [0, 2, 3, 5, 7, 8, 11]
  return steps.map(s => NOTE_NAMES_SHARP[(pc + s) % 12])
}

// Melodic minor ascending: raise 6 and 7
function melodicMinorAscNotes(root: string): string[] {
  const pc = pitchClass(root)
  const steps = [0, 2, 3, 5, 7, 9, 11]
  return steps.map(s => NOTE_NAMES_SHARP[(pc + s) % 12])
}

const EASY_ROOTS = ['A','E','D','C']
const MED_ROOTS  = ['A','E','D','G','B','F']

type EasyShape = 'naturalFormula' | 'degree7A' | 'eNaturalNotes' | 'relativeOf' | 'amSharesC' | 'diffHarmonicNatural' | 'raisedInHarmonicA' | 'whichFlat7'
type MedShape  = 'harmonicFormula' | 'augSecond' | 'vChordHarmonic' | 'melodicVsNatural' | 'raisedV' | 'dHarmonicNotes' | 'classicalCadence' | 'leadingToneHarmonic'
type HardShape = 'melodicRaised' | 'avoidAugSecond' | 'genreHarmonic' | 'viiDimHarmonic' | 'jazzMelodic' | 'dorianRaised' | 'dorianVsNatural' | 'minorKeyV'

export function generateMinorScalesQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['naturalFormula','degree7A','eNaturalNotes','relativeOf','amSharesC','diffHarmonicNatural','raisedInHarmonicA','whichFlat7'])
  switch (shape) {
    case 'naturalFormula': {
      const correct = 'W-H-W-W-H-W-W'
      const { choices, correctIndex } = buildChoices(correct, ['W-W-H-W-W-W-H','H-W-W-H-W-W-W','W-H-W-W-W-H-W'])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'מה הנוסחה של הסולם המינורי הטבעי (Aeolian)?', en: 'What is the formula for natural minor (Aeolian)?' },
        choices, correctIndex,
        explanation: { he: 'הסולם המינורי הטבעי: W-H-W-W-H-W-W.', en: 'Natural minor formula: W-H-W-W-H-W-W.' },
        theory: THEORY_TEXT,
      }
    }
    case 'degree7A': {
      const notes = naturalMinorNotes('A')
      const correct = notes[6]
      const { choices, correctIndex } = buildChoices(correct, ['G#','Ab','F#'])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'מה הדרגה השביעית של A מינור טבעי?', en: 'What is the 7th degree of A natural minor?' },
        choices, correctIndex,
        explanation: { he: `הדרגה השביעית של A מינור טבעי היא ${correct} — לא G# (שהיה בהרמוני).`, en: `The 7th degree of A natural minor is ${correct} — not G# (which would be harmonic minor).` },
        theory: THEORY_TEXT,
      }
    }
    case 'eNaturalNotes': {
      const notes = naturalMinorNotes('E')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        naturalMinorNotes('A').join(', '),
        naturalMinorNotes('B').join(', '),
        naturalMinorNotes('D').join(', '),
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'מה התווים של E מינור טבעי?', en: 'What are the notes of E natural minor?' },
        choices, correctIndex,
        explanation: { he: `E מינור טבעי: ${correct}.`, en: `E natural minor: ${correct}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'relativeOf': {
      const correct: Bilingual = { he: 'דרגה 6 של הסולם המז׳ורי', en: '6th degree of the major scale' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דרגה 7 של הסולם המז׳ורי', en: '7th degree of the major scale' },
        { he: 'דרגה 4 של הסולם המז׳ורי', en: '4th degree of the major scale' },
        { he: 'דרגה 2 של הסולם המז׳ורי', en: '2nd degree of the major scale' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'הסולם המינורי הטבעי בנוי על איזו דרגה של הסולם המז׳ורי הרלטיבי?', en: 'Natural minor is built on which degree of the relative major scale?' },
        choices, correctIndex,
        explanation: { he: 'המינור הטבעי בנוי על הדרגה השישית של המז׳ור הרלטיבי שלו (למשל Am = דרגה 6 של C מז׳ור).', en: 'Natural minor is built on the 6th degree of its relative major (e.g. Am = 6th degree of C major).' },
        theory: THEORY_TEXT,
      }
    }
    case 'amSharesC': {
      const correct: Bilingual = { he: 'נכון — אותם 7 תווים', en: 'True — they share the same 7 notes' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לא נכון — שונים', en: 'False — they are different' },
        { he: 'רק 5 תווים משותפים', en: 'Only 5 notes are shared' },
        { he: 'נכון, אבל אקורדים שונים', en: 'True, but different chords' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'Am (מינור טבעי) ו-C מז׳ור חולקים את אותם התווים?', en: 'Am (natural minor) and C major share the same notes?' },
        choices, correctIndex,
        explanation: { he: 'נכון! Am מינור ו-C מז׳ור הם רלטיביים — 7 תווים זהים, אבל טוניקה שונה.', en: 'True! Am minor and C major are relatives — 7 identical notes, but different tonics.' },
        theory: THEORY_TEXT,
      }
    }
    case 'diffHarmonicNatural': {
      const correct: Bilingual = { he: 'ההרמוני מעלה את הדרגה השביעית', en: 'The harmonic minor raises the 7th degree' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'ההרמוני מוריד את הדרגה השישית', en: 'The harmonic minor lowers the 6th degree' },
        { he: 'ההרמוני מעלה את הדרגה הרביעית', en: 'The harmonic minor raises the 4th degree' },
        { he: 'אין הבדל', en: 'There is no difference' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'מה ההבדל בין מינור טבעי להרמוני?', en: 'What is the difference between natural and harmonic minor?' },
        choices, correctIndex,
        explanation: { he: 'הסולם ההרמוני מעלה את הדרגה השביעית בחצי-טון ליצירת טון מוביל חזק.', en: 'Harmonic minor raises the 7th degree by a half step to create a strong leading tone.' },
        theory: THEORY_TEXT,
      }
    }
    case 'raisedInHarmonicA': {
      const correct = 'G → G#'
      const { choices, correctIndex } = buildChoices(correct, ['F → F#', 'E → F', 'D → D#'])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'איזה תו מוגבה ב-A הרמוני מינורי (לעומת A מינור טבעי)?', en: 'What note is raised in A harmonic minor (compared to A natural minor)?' },
        choices, correctIndex,
        explanation: { he: 'ב-A הרמוני מינורי, ה-G מוגבה ל-G# — הדרגה השביעית.', en: 'In A harmonic minor, G is raised to G# — the 7th degree.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whichFlat7': {
      const correct: Bilingual = { he: 'מינור טבעי (Aeolian)', en: 'Natural minor (Aeolian)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מינור הרמוני', en: 'Harmonic minor' },
        { he: 'מינור מלודי (עולה)', en: 'Melodic minor (ascending)' },
        { he: 'דוריאן', en: 'Dorian' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'easy',
        prompt: { he: 'איזה מינור מכיל b7 (ספטימה קטנה)?', en: 'Which minor scale contains the b7 (flatted 7th)?' },
        choices, correctIndex,
        explanation: { he: 'המינור הטבעי מכיל b7 — זאת בדיוק הדרגה שה-harmonic minor מגביה.', en: 'Natural minor contains the b7 — exactly the degree that harmonic minor raises.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['harmonicFormula','augSecond','vChordHarmonic','melodicVsNatural','raisedV','dHarmonicNotes','classicalCadence','leadingToneHarmonic'])
  switch (shape) {
    case 'harmonicFormula': {
      const correct = 'W-H-W-W-H-A2-H (A2 = שנייה מוגדלת)'
      const { choices, correctIndex } = buildChoices(correct, [
        'W-H-W-W-H-W-W',
        'W-W-H-W-W-W-H',
        'H-W-W-W-H-W-W',
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: 'מה הנוסחה של המינור ההרמוני?', en: 'What is the harmonic minor formula?' },
        choices, correctIndex,
        explanation: { he: 'מינור הרמוני: W-H-W-W-H-A2-H. ה-A2 (שנייה מוגדלת) בין ♭6 ל-7 הוא המרווח המאפיין.', en: 'Harmonic minor: W-H-W-W-H-A2-H. The A2 (augmented 2nd) between ♭6 and 7 is the characteristic interval.' },
        theory: THEORY_TEXT,
      }
    }
    case 'augSecond': {
      const correct: Bilingual = { he: 'שנייה מוגדלת (בין ♭6 לדרגה 7)', en: 'Augmented 2nd (between ♭6 and degree 7)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טריטון (בין 4 ל-7)', en: 'Tritone (between 4 and 7)' },
        { he: 'קוורטה זכה (בין 4 ל-7)', en: 'Perfect 4th (between 4 and 7)' },
        { he: 'טרצה גדולה (בין 5 ל-7)', en: 'Major 3rd (between 5 and 7)' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: 'איזה מרווח מאפיין מופיע במינור ההרמוני?', en: 'What characteristic interval appears in harmonic minor?' },
        choices, correctIndex,
        explanation: { he: 'השנייה המוגדלת (3 חצאי-טונים) בין ♭6 ל-7 מעניקה למינור ההרמוני את צלילו האכזוטי.', en: 'The augmented 2nd (3 semitones) between ♭6 and 7 gives harmonic minor its exotic sound.' },
        theory: THEORY_TEXT,
      }
    }
    case 'vChordHarmonic': {
      const root = randomOf(EASY_ROOTS)
      const harmNotes = harmonicMinorNotes(root)
      // V chord root is degree 5 (index 4), major chord because of raised 7
      const vRoot = harmNotes[4]
      const correct = vRoot // major chord
      const { choices, correctIndex } = buildChoices(correct + ' (major)', [harmNotes[0] + ' (major)', harmNotes[1] + 'm', harmNotes[3] + ' (major)'])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: `מה אקורד ה-V ב-${root} הרמוני מינורי?`, en: `What is the V chord in ${root} harmonic minor?` },
        choices: choices,
        correctIndex,
        explanation: { he: `ב-${root} הרמוני מינורי, ה-V הוא ${vRoot} מז׳ור (הדרגה ה-7 המוגבהת יוצרת טרצה גדולה על ה-V).`, en: `In ${root} harmonic minor, the V is ${vRoot} major (the raised 7th creates a major 3rd on V).` },
        theory: THEORY_TEXT,
      }
    }
    case 'melodicVsNatural': {
      const correct: Bilingual = { he: 'מעלה דרגות 6 ו-7 בעלייה, יורד לטבעי בירידה', en: 'Raises degrees 6 and 7 ascending, reverts to natural minor descending' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מעלה רק דרגה 7 בעלייה', en: 'Raises only degree 7 ascending' },
        { he: 'מעלה דרגות 4 ו-6 בעלייה', en: 'Raises degrees 4 and 6 ascending' },
        { he: 'זהה לטבעי — אין הבדל בכיוון', en: 'Same as natural — no directional difference' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: 'מה ייחודי במינור המלודי לעומת הטבעי?', en: 'What does melodic minor do differently from natural minor?' },
        choices, correctIndex,
        explanation: { he: 'המינור המלודי מעלה דרגות 6 ו-7 בעלייה (להימנע מהשנייה המוגדלת), ויורד כמינור טבעי.', en: 'Melodic minor raises degrees 6 and 7 ascending (to avoid the augmented 2nd), and descends as natural minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'raisedV': {
      const correct: Bilingual = { he: 'מז׳ורי (כי ה-7 המוגבהת יוצרת טרצה גדולה)', en: 'Major (because the raised 7th creates a major 3rd)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מינורי', en: 'Minor' },
        { he: 'מוקטן', en: 'Diminished' },
        { he: 'דומיננטי 7', en: 'Dominant 7th' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: 'הדרגה השביעית המוגבהת במינור ההרמוני יוצרת איזה אקורד על הדרגה החמישית?', en: 'The raised 7th in harmonic minor creates which type of chord on the V degree?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה השביעית המוגבהת יוצרת טרצה גדולה על הדרגה החמישית → V מז׳ורי = קדנצה V→i חזקה.', en: 'The raised 7th creates a major 3rd on the 5th degree → major V = strong V→i cadence.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dHarmonicNotes': {
      // Use flats where appropriate
      const notesFlat = [
        NOTE_NAMES_FLAT[(pitchClass('D') + 0) % 12],
        NOTE_NAMES_FLAT[(pitchClass('D') + 2) % 12],
        NOTE_NAMES_FLAT[(pitchClass('D') + 3) % 12],
        NOTE_NAMES_FLAT[(pitchClass('D') + 5) % 12],
        NOTE_NAMES_FLAT[(pitchClass('D') + 7) % 12],
        NOTE_NAMES_FLAT[(pitchClass('D') + 8) % 12],
        NOTE_NAMES_SHARP[(pitchClass('D') + 11) % 12],
      ]
      const correct = notesFlat.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        harmonicMinorNotes('E').join(', '),
        harmonicMinorNotes('G').join(', '),
        harmonicMinorNotes('A').join(', '),
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: 'מה התווים של D הרמוני מינורי?', en: 'What are the notes of D harmonic minor?' },
        choices, correctIndex,
        explanation: { he: `D הרמוני מינורי: ${correct} (הדרגה ה-7 היא C# — מוגבהת ב-chצי-טון מ-C).`, en: `D harmonic minor: ${correct} (the 7th is C# — raised a half step from C).` },
        theory: THEORY_TEXT,
      }
    }
    case 'classicalCadence': {
      const correct: Bilingual = { he: 'מינור הרמוני (קדנצה V→i)', en: 'Harmonic minor (V→i cadence)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מינור טבעי', en: 'Natural minor' },
        { he: 'מינור מלודי', en: 'Melodic minor' },
        { he: 'דוריאן', en: 'Dorian' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: 'איזה סולם מינורי משמש הכי הרבה בקדנצות קלאסיות?', en: 'Which minor scale is used most in classical cadences?' },
        choices, correctIndex,
        explanation: { he: 'המינור ההרמוני פותח לצורך קדנצה V→i חזקה — הדרגה ה-7 המוגבהת מיצרת טון מוביל.', en: 'Harmonic minor was developed for the strong V→i cadence — the raised 7th creates a leading tone.' },
        theory: THEORY_TEXT,
      }
    }
    case 'leadingToneHarmonic': {
      const root = randomOf(MED_ROOTS)
      const harmNotes = harmonicMinorNotes(root)
      const leadingTone = harmNotes[6]
      const correct = leadingTone
      const { choices, correctIndex } = buildChoices(correct, [harmNotes[5], harmNotes[4], harmNotes[2]])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'medium',
        prompt: { he: `מה הטון המוביל (דרגה 7 מוגבהת) של ${root} הרמוני מינורי?`, en: `What is the leading tone (raised 7th) of ${root} harmonic minor?` },
        choices, correctIndex,
        explanation: { he: `הדרגה ה-7 של ${root} הרמוני מינורי היא ${leadingTone} — חצי-טון מתחת לשורש.`, en: `The 7th degree of ${root} harmonic minor is ${leadingTone} — a half step below the root.` },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['melodicRaised','avoidAugSecond','genreHarmonic','viiDimHarmonic','jazzMelodic','dorianRaised','dorianVsNatural','minorKeyV'])
  switch (shape) {
    case 'melodicRaised': {
      const root = randomOf(MED_ROOTS)
      const melNotes = melodicMinorAscNotes(root)
      const correct = `${melNotes[5]} ו-${melNotes[6]} (דרגות 6 ו-7)`
      const pool = [`${melNotes[4]} ו-${melNotes[6]}`, `${melNotes[2]} ו-${melNotes[5]}`, `${melNotes[3]} ו-${melNotes[5]}`]
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: `אילו תווים מוגבהים ב-${root} מלודי מינורי (עולה) לעומת ${root} טבעי?`, en: `What are the raised notes in ${root} melodic minor (ascending) compared to ${root} natural minor?` },
        choices, correctIndex,
        explanation: { he: `ב-${root} מלודי מינורי (עולה): ${correct}.`, en: `In ${root} melodic minor (ascending): degrees 6 and 7 are raised.` },
        theory: THEORY_TEXT,
      }
    }
    case 'avoidAugSecond': {
      const correct: Bilingual = { he: 'מינור מלודי (מעלה 6 ו-7)', en: 'Melodic minor (raises 6 and 7)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מינור הרמוני', en: 'Harmonic minor' },
        { he: 'מינור טבעי', en: 'Natural minor' },
        { he: 'פריגי', en: 'Phrygian' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: 'איזה סולם מינורי נמנע מהמרווח של שנייה מוגדלת?', en: 'Which minor scale avoids the augmented 2nd interval?' },
        choices, correctIndex,
        explanation: { he: 'המינור המלודי מעלה דרגות 6 ו-7 בעלייה — זה מסיר את השנייה המוגדלת של ההרמוני ומאפשר תנועה קולית חלקה.', en: 'Melodic minor raises degrees 6 and 7 ascending — this removes the augmented 2nd of harmonic minor and enables smooth voice movement.' },
        theory: THEORY_TEXT,
      }
    }
    case 'genreHarmonic': {
      const correct: Bilingual = { he: 'מטאל, קלאסיקה, פלמנקו', en: 'Metal, classical, flamenco' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'ג׳אז, בוסה נובה', en: 'Jazz, bossa nova' },
        { he: 'ריגי, פאנק', en: 'Reggae, funk' },
        { he: 'פופ, ר&ב', en: 'Pop, R&B' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: 'באיזה ז׳אנרים נפוץ במיוחד המינור ההרמוני?', en: 'In which genres is harmonic minor particularly common?' },
        choices, correctIndex,
        explanation: { he: 'המינור ההרמוני נפוץ במטאל (ניאו-קלאסי), קלאסיקה ופלמנקו — הצליל האכזוטי שלו מתאים לז׳אנרים אלו.', en: 'Harmonic minor is common in metal (neo-classical), classical and flamenco — its exotic sound suits these genres.' },
        theory: THEORY_TEXT,
      }
    }
    case 'viiDimHarmonic': {
      const root = randomOf(EASY_ROOTS)
      const harmNotes = harmonicMinorNotes(root)
      const viiRoot = harmNotes[6]
      const correct = `${viiRoot}°7 (מוקטן 7)`
      const { choices, correctIndex } = buildChoices(correct, [`${viiRoot}m7b5`, `${viiRoot}°`, `${viiRoot}m`])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: `הדרגה ה-7 המוגבהת ב-${root} הרמוני מינורי יוצרת איזה אקורד על ה-vii?`, en: `What chord does the raised 7th in ${root} harmonic minor create on the vii?` },
        choices, correctIndex,
        explanation: { he: `ב-${root} הרמוני מינורי, ה-vii° הוא ${viiRoot}°7 — אקורד מוקטן שביעי (dim7).`, en: `In ${root} harmonic minor, the vii° is ${viiRoot}°7 — a diminished 7th chord (dim7).` },
        theory: THEORY_TEXT,
      }
    }
    case 'jazzMelodic': {
      const correct = 'W-H-W-W-W-W-H'
      const { choices, correctIndex } = buildChoices(correct, ['W-H-W-W-H-W-W','W-W-H-W-W-W-H','H-W-W-W-H-W-W'])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: 'מה הנוסחה של "מינור מלודי ג׳אזי" (תמיד בגרסה העולה)?', en: "What is the 'jazz melodic minor' formula (always ascending form)?" },
        choices, correctIndex,
        explanation: { he: 'מינור מלודי ג׳אזי: W-H-W-W-W-W-H — תמיד בגרסה העולה (לא יורד לטבעי).', en: 'Jazz melodic minor: W-H-W-W-W-W-H — always the ascending form (does not revert to natural minor).' },
        theory: THEORY_TEXT,
      }
    }
    case 'dorianRaised': {
      const correct: Bilingual = { he: 'דרגה 6 (ספטה גדולה)', en: '6th degree (major 6th)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דרגה 7', en: '7th degree' },
        { he: 'דרגה 3', en: '3rd degree' },
        { he: 'דרגה 4', en: '4th degree' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: 'ב-Dorian מינורי, איזו דרגה מוגבהת באופן טבעי לעומת המינור הטבעי?', en: 'In Dorian minor, which degree is naturally raised compared to natural minor?' },
        choices, correctIndex,
        explanation: { he: 'דוריאן = מינור טבעי עם דרגה 6 מוגבהת. זה מה שמעניק לו את הצליל ה"ג׳אזי" המיוחד.', en: 'Dorian = natural minor with a raised 6th degree. This is what gives it its distinctive "jazzy" sound.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dorianVsNatural': {
      const correct: Bilingual = { he: 'דוריאן יש לו דרגה 6 גדולה (מוגבהת)', en: 'Dorian has a major 6th (raised degree 6)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דוריאן יש לו דרגה 7 גדולה', en: 'Dorian has a major 7th' },
        { he: 'דוריאן יש לו דרגה 2 מוגדלת', en: 'Dorian has an augmented 2nd' },
        { he: 'אין הבדל', en: 'There is no difference' },
      ])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: 'מה ההבדל בין דוריאן למינור טבעי?', en: 'What is the difference between Dorian and natural minor?' },
        choices, correctIndex,
        explanation: { he: 'דוריאן = מינור טבעי עם דרגה 6 גדולה. דוגמה: D דוריאן מכיל B (לא Bb).', en: 'Dorian = natural minor with a raised 6th. Example: D Dorian contains B (not Bb).' },
        theory: THEORY_TEXT,
      }
    }
    case 'minorKeyV': {
      const root = randomOf(EASY_ROOTS)
      const harmNotes = harmonicMinorNotes(root)
      const vRoot = harmNotes[4]
      const correct = `${vRoot} מז׳ור (V של ${root} מינור)`
      const nat = naturalMinorNotes(root)
      const { choices, correctIndex } = buildChoices(correct, [`${nat[4]}m (V מינורי)`, `${nat[4]}7`, `${nat[3]} מז׳ור`])
      return {
        id: uid(), categoryId: 'minor_scales', difficulty: 'hard',
        prompt: { he: `מדוע משתמשים במינור הרמוני עבור ה-V ב-${root} מינור?`, en: `Why is harmonic minor used for the V chord in ${root} minor?` },
        choices, correctIndex,
        explanation: { he: `המינור ההרמוני מעלה את הדרגה ה-7, הופך את ה-V ל-${vRoot} מז׳ור ויוצר קדנצה V→i חזקה.`, en: `Harmonic minor raises the 7th, turning the V into ${vRoot} major and creating a strong V→i cadence.` },
        theory: THEORY_TEXT,
      }
    }
  }
}
