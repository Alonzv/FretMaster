import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
  majorScaleNotes,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'שבעת המודוסים נגזרים מהסולם המז׳ורי — כל מודוס מתחיל על דרגה שונה. יש שתי גישות: "נגזרת" (Derivative) — אותו סולם, דרגת התחלה שונה; "מקבילה" (Parallel) — אותו שורש, נוסחה שונה. מקסולידי = מז׳ור עם b7, דוריאן = מינור עם #6, פריגי = מינור עם b2, לידי = מז׳ור עם #4.',
  en: 'The seven modes derive from the major scale — each mode starts on a different degree. There are two approaches: "derivative" (same key, different starting note) and "parallel" (same root, different formula). Mixolydian = major with b7; Dorian = minor with #6; Phrygian = minor with b2; Lydian = major with #4.',
}

type EasyShape = 'modeCount' | 'ionianIs' | 'aeolianIs' | 'degree5Mode' | 'mixolydianAlter' | 'spanishMode' | 'dorianRaised' | 'lydianChar'
type MedShape  = 'cMajorDeg4' | 'lydianAvoid' | 'mixolydianGenre' | 'dorianGenre' | 'minorJazzy' | 'cDorianVsCminor' | 'cMixVsCmaj' | 'darkExoticFlamenco'
type HardShape = 'dDorianNotes' | 'degree7Mode' | 'locrianWhy' | 'enterSandman' | 'parallelVsDerivative' | 'dreamyMode' | 'dDorianCMajor' | 'overDom7'

export function generateModesTheoryQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['modeCount','ionianIs','aeolianIs','degree5Mode','mixolydianAlter','spanishMode','dorianRaised','lydianChar'])
  switch (shape) {
    case 'modeCount': {
      const correct = '7'
      const { choices, correctIndex } = buildChoices(correct, ['5','6','8'])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'כמה מודוסים יש לסולם המז׳ורי?', en: 'How many modes does the major scale have?' },
        choices, correctIndex,
        explanation: { he: 'לסולם המז׳ורי יש 7 מודוסים — כל אחד מתחיל על דרגה שונה.', en: 'The major scale has 7 modes — each starting on a different degree.' },
        theory: THEORY_TEXT,
      }
    }
    case 'ionianIs': {
      const correct: Bilingual = { he: 'הסולם המז׳ורי', en: 'The major scale' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'המינור הטבעי', en: 'Natural minor' },
        { he: 'דוריאן', en: 'Dorian' },
        { he: 'מיקסולידי', en: 'Mixolydian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'מודוס איוניאן (Ionian) זהה לאיזה סולם?', en: 'Ionian mode is the same as which scale?' },
        choices, correctIndex,
        explanation: { he: 'איוניאן = הסולם המז׳ורי (דרגה I של הסולם המז׳ורי).', en: 'Ionian = the major scale (degree I of the major scale).' },
        theory: THEORY_TEXT,
      }
    }
    case 'aeolianIs': {
      const correct: Bilingual = { he: 'המינור הטבעי', en: 'Natural minor' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'הסולם המז׳ורי', en: 'Major scale' },
        { he: 'דוריאן', en: 'Dorian' },
        { he: 'לוקריאן', en: 'Locrian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'מודוס אאיוליאן (Aeolian) זהה לאיזה סולם?', en: 'Aeolian mode is the same as which scale?' },
        choices, correctIndex,
        explanation: { he: 'אאיוליאן = המינור הטבעי (דרגה VI של הסולם המז׳ורי).', en: 'Aeolian = natural minor (degree VI of the major scale).' },
        theory: THEORY_TEXT,
      }
    }
    case 'degree5Mode': {
      const correct: Bilingual = { he: 'מיקסולידי', en: 'Mixolydian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דוריאן', en: 'Dorian' },
        { he: 'לידי', en: 'Lydian' },
        { he: 'פריגי', en: 'Phrygian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'איזה מודוס מתחיל על הדרגה החמישית?', en: 'Which mode starts on the 5th degree?' },
        choices, correctIndex,
        explanation: { he: 'מיקסולידי = מודוס על דרגה V של הסולם המז׳ורי.', en: 'Mixolydian = the mode on degree V of the major scale.' },
        theory: THEORY_TEXT,
      }
    }
    case 'mixolydianAlter': {
      const correct: Bilingual = { he: 'b7 (ספטימה קטנה)', en: 'b7 (minor 7th)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: '#4 (קוורטה מוגדלת)', en: '#4 (augmented 4th)' },
        { he: 'b3 (טרצה קטנה)', en: 'b3 (minor 3rd)' },
        { he: 'b2 (סקונדה קטנה)', en: 'b2 (minor 2nd)' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'מיקסולידי הוא כמו מז׳ור אבל עם איזה שינוי?', en: "Mixolydian is like major but with which altered note?" },
        choices, correctIndex,
        explanation: { he: 'מיקסולידי = מז׳ור עם b7 — זה מה שמעניק לו את הצליל הבלוזי.', en: 'Mixolydian = major with b7 — this is what gives it its bluesy sound.' },
        theory: THEORY_TEXT,
      }
    }
    case 'spanishMode': {
      const correct: Bilingual = { he: 'פריגי (Phrygian)', en: 'Phrygian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לידי (Lydian)', en: 'Lydian' },
        { he: 'דוריאן (Dorian)', en: 'Dorian' },
        { he: 'לוקריאן (Locrian)', en: 'Locrian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'איזה מודוס ידוע בצלילו ה"חשוך, ספרדי, אכזוטי"?', en: "Which mode is known for its 'dark, Spanish, exotic' sound?" },
        choices, correctIndex,
        explanation: { he: 'פריגי מאופיין ב-b2 (סקונדה קטנה) — זה מעניק לו את הצליל הספרדי-פלמנקו.', en: 'Phrygian is characterized by the b2 (minor 2nd) — this gives it its Spanish/flamenco sound.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dorianRaised': {
      const correct: Bilingual = { he: 'דרגה 6 (#6 — סקסטה גדולה)', en: '6th degree (#6 — major 6th)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דרגה 7 (#7)', en: '7th degree (#7)' },
        { he: 'דרגה 2 (#2)', en: '2nd degree (#2)' },
        { he: 'דרגה 4 (#4)', en: '4th degree (#4)' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'דוריאן הוא מינור עם איזו דרגה מוגבהת?', en: 'Dorian mode is minor with which raised degree?' },
        choices, correctIndex,
        explanation: { he: 'דוריאן = מינור טבעי + דרגה 6 מוגבהת. דוגמה: D דוריאן = D-E-F-G-A-B-C.', en: 'Dorian = natural minor + raised 6th. Example: D Dorian = D-E-F-G-A-B-C.' },
        theory: THEORY_TEXT,
      }
    }
    case 'lydianChar': {
      const correct: Bilingual = { he: 'לידי (Lydian)', en: 'Lydian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מיקסולידי (Mixolydian)', en: 'Mixolydian' },
        { he: 'איוניאן (Ionian)', en: 'Ionian' },
        { he: 'דוריאן (Dorian)', en: 'Dorian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'easy',
        prompt: { he: 'איזה מודוס מאופיין ב-#4 (קוורטה מוגדלת)?', en: 'Which mode has the #4 (raised 4th) as its characteristic note?' },
        choices, correctIndex,
        explanation: { he: 'לידי = מז׳ור עם #4 — הטריטון מעל השורש מעניק לו את הצליל החולמני.', en: 'Lydian = major with #4 — the tritone above the root gives it its dreamy sound.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['cMajorDeg4','lydianAvoid','mixolydianGenre','dorianGenre','minorJazzy','cDorianVsCminor','cMixVsCmaj','darkExoticFlamenco'])
  switch (shape) {
    case 'cMajorDeg4': {
      const correct = 'F Lydian'
      const { choices, correctIndex } = buildChoices(correct, ['F Mixolydian','F Dorian','F Phrygian'])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'איזה מודוס נמצא על הדרגה הרביעית של C מז׳ור?', en: 'What mode is on the 4th degree of C major?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה ה-4 של C מז׳ור היא F. F Lydian = C מז׳ור המתחיל על F.', en: 'The 4th degree of C major is F. F Lydian = C major scale starting on F.' },
        theory: THEORY_TEXT,
      }
    }
    case 'lydianAvoid': {
      const correct: Bilingual = { he: '#4 (קוורטה מוגדלת — טריטון)', en: '#4 (augmented 4th — tritone above root)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'b2 (סקונדה קטנה)', en: 'b2 (minor 2nd)' },
        { he: 'b7 (ספטימה קטנה)', en: 'b7 (minor 7th)' },
        { he: '#5 (קווינטה מוגדלת)', en: '#5 (augmented 5th)' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'מה ה"תו המאפיין" (avoid note) של לידי?', en: "What is the characteristic 'avoid note' of Lydian?" },
        choices, correctIndex,
        explanation: { he: '#4 של לידי הוא טריטון מעל השורש — הוא הנותן ללידי את המתח המיוחד שלו.', en: 'The #4 of Lydian is a tritone above the root — it gives Lydian its distinctive tension.' },
        theory: THEORY_TEXT,
      }
    }
    case 'mixolydianGenre': {
      const correct: Bilingual = { he: 'רוק, בלוז-רוק', en: 'Rock, blues-rock' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'ג׳אז מודאלי', en: 'Modal jazz' },
        { he: 'קלאסיקה', en: 'Classical' },
        { he: 'פלמנקו', en: 'Flamenco' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'מיקסולידי שימושי במיוחד באיזה ז׳אנר?', en: "Which genre most commonly uses Mixolydian?" },
        choices, correctIndex,
        explanation: { he: 'מיקסולידי = מז׳ור עם b7 — מתאים לרוק ובלוז-רוק (גיטריסטים אוהבים אותו מעל אקורדים דומיננטיים).', en: 'Mixolydian = major with b7 — fits rock and blues-rock (guitarists love it over dominant chords).' },
        theory: THEORY_TEXT,
      }
    }
    case 'dorianGenre': {
      const correct: Bilingual = { he: 'ג׳אז מודאלי', en: 'Modal jazz' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'פלמנקו', en: 'Flamenco' },
        { he: 'קאנטרי', en: 'Country' },
        { he: 'רגאיי', en: 'Reggae' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'דוריאן ידוע בשימושו המשמעותי באיזה ז׳אנר?', en: 'Dorian is most associated with which genre?' },
        choices, correctIndex,
        explanation: { he: 'מייל דייוויס השתמש בדוריאן בסיקנד\'ס מ"Kind of Blue" — זה סייע לפתח את הג׳אז המודאלי.', en: "Miles Davis used Dorian on 'So What' from 'Kind of Blue' — this helped develop modal jazz." },
        theory: THEORY_TEXT,
      }
    }
    case 'minorJazzy': {
      const correct: Bilingual = { he: 'דוריאן', en: 'Dorian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אאיוליאן', en: 'Aeolian' },
        { he: 'פריגי', en: 'Phrygian' },
        { he: 'לוקריאן', en: 'Locrian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'איזה מודוס כדאי להשתמש בו מעל אקורד מינורי לצליל "ג׳אזי"?', en: "What mode would you use over a minor chord that needs a 'jazzy' sound?" },
        choices, correctIndex,
        explanation: { he: 'דוריאן (#6) מוסיף צבע ג׳אזי מעל אקורדי m7 — מייל דייוויס השתמש בו לאורך כל ה"Kind of Blue".', en: "Dorian (#6) adds jazzy color over m7 chords — Miles Davis used it throughout 'Kind of Blue'." },
        theory: THEORY_TEXT,
      }
    }
    case 'cDorianVsCminor': {
      const correct = 'A (natural, not Ab)'
      const { choices, correctIndex } = buildChoices(correct, ['B (natural)','Bb','F#'])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'איזה תו מבדיל בין C דוריאן ל-C מינור טבעי?', en: 'What note distinguishes C Dorian from C natural minor?' },
        choices, correctIndex,
        explanation: { he: 'C מינור טבעי: Ab. C דוריאן: A טבעי (דרגה 6 מוגבהת).', en: 'C natural minor has Ab. C Dorian has A natural (raised 6th).' },
        theory: THEORY_TEXT,
      }
    }
    case 'cMixVsCmaj': {
      const correct = 'Bb (b7)'
      const { choices, correctIndex } = buildChoices(correct, ['Ab (b6)','F# (#4)','Eb (b3)'])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'איזה תו מבדיל בין C מיקסולידי ל-C מז׳ור?', en: 'What note distinguishes C Mixolydian from C major?' },
        choices, correctIndex,
        explanation: { he: 'C מיקסולידי מכיל Bb (b7) לעומת B (M7) ב-C מז׳ור.', en: 'C Mixolydian contains Bb (b7) instead of B (M7) in C major.' },
        theory: THEORY_TEXT,
      }
    }
    case 'darkExoticFlamenco': {
      const correct: Bilingual = { he: 'פריגי (Phrygian)', en: 'Phrygian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לוקריאן (Locrian)', en: 'Locrian' },
        { he: 'אאיוליאן (Aeolian)', en: 'Aeolian' },
        { he: 'דוריאן (Dorian)', en: 'Dorian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'medium',
        prompt: { he: 'איזה מודוס נשמע "חשוך, אכזוטי, פלמנקו"?', en: "What mode has the characteristic sound: dark, exotic, flamenco?" },
        choices, correctIndex,
        explanation: { he: 'פריגי עם b2 מעניק את הצליל הספרדי-פלמנקו האופייני.', en: 'Phrygian with its b2 creates the characteristic Spanish-flamenco sound.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['dDorianNotes','degree7Mode','locrianWhy','enterSandman','parallelVsDerivative','dreamyMode','dDorianCMajor','overDom7'])
  switch (shape) {
    case 'dDorianNotes': {
      // D Dorian = C major starting on D = D E F G A B C
      const notes = majorScaleNotes('C')
      const dDorian = [...notes.slice(1), notes[0]]  // rotate to start on D
      const correct = dDorian.join(', ')
      const { choices, correctIndex } = buildChoices(correct, [
        'D, E, F, G, A, Bb, C',
        'D, E, F#, G, A, B, C',
        'D, Eb, F, G, A, B, C',
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'מה התווים של D דוריאן?', en: 'What notes are in D Dorian?' },
        choices, correctIndex,
        explanation: { he: `D דוריאן: ${correct} — זהה ל-C מז׳ור מתחיל על D.`, en: `D Dorian: ${correct} — same as C major starting on D.` },
        theory: THEORY_TEXT,
      }
    }
    case 'degree7Mode': {
      const correct: Bilingual = { he: 'לוקריאן (Locrian)', en: 'Locrian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אאיוליאן (Aeolian)', en: 'Aeolian' },
        { he: 'פריגי (Phrygian)', en: 'Phrygian' },
        { he: 'דוריאן (Dorian)', en: 'Dorian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'איזה מודוס בנוי על הדרגה השביעית?', en: 'What mode is built on the 7th degree?' },
        choices, correctIndex,
        explanation: { he: 'לוקריאן = מודוס על דרגה VII של הסולם המז׳ורי. ב-C מז׳ור: B לוקריאן.', en: 'Locrian = mode on degree VII of the major scale. In C major: B Locrian.' },
        theory: THEORY_TEXT,
      }
    }
    case 'locrianWhy': {
      const correct: Bilingual = { he: 'אקורד הטוניקה שלו מוקטן (לא יציב)', en: 'Its tonic chord is diminished (unstable)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'יש בו יותר מדי חצאי-טונים', en: 'It has too many semitones' },
        { he: 'הוא לא ניתן לנגינה על גיטרה', en: 'It cannot be played on guitar' },
        { he: 'אין לו קווינטה זכה', en: 'It has no perfect fifth' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'מדוע לוקריאן נדיר בשימוש המעשי?', en: 'Why is Locrian rarely used in practice?' },
        choices, correctIndex,
        explanation: { he: 'לוקריאן: אקורד ה-I שלו מוקטן (b5) — לא יציב, לא ניתן "לנוח" עליו. לכן הוא נדיר.', en: 'Locrian: its I chord is diminished (b5) — unstable, cannot "rest" on it. That is why it is rarely used.' },
        theory: THEORY_TEXT,
      }
    }
    case 'enterSandman': {
      const correct: Bilingual = { he: 'אאיוליאן (E מינור טבעי)', en: 'Aeolian (E natural minor)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'פריגי (E פריגי)', en: 'Phrygian (E Phrygian)' },
        { he: 'לוקריאן (E לוקריאן)', en: 'Locrian (E Locrian)' },
        { he: 'דוריאן (E דוריאן)', en: 'Dorian (E Dorian)' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'ה-riff הראשי של "Enter Sandman" (Metallica) משתמש באיזה מודוס?', en: "What mode is used in Metallica's 'Enter Sandman' main riff?" },
        choices, correctIndex,
        explanation: { he: '"Enter Sandman" משתמש ב-E אאיוליאן = E מינור טבעי — הנפוץ ביותר במטאל.', en: "'Enter Sandman' uses E Aeolian = E natural minor — the most common mode in metal." },
        theory: THEORY_TEXT,
      }
    }
    case 'parallelVsDerivative': {
      const correct: Bilingual = { he: 'מקבילה = אותו שורש, נוסחה שונה; נגזרת = אותו סולם, דרגת התחלה שונה', en: 'Parallel = same root, different formula; Derivative = same key, different starting degree' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מקבילה = אותו סולם, שורש שונה; נגזרת = נוסחה שונה', en: 'Parallel = same scale, different root; Derivative = different formula' },
        { he: 'אין הבדל — שתי הגישות זהות', en: 'No difference — both approaches are the same' },
        { he: 'מקבילה = יותר מתקדמת', en: 'Parallel = more advanced' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'מה ההבדל בין גישה "מקבילה" לגישה "נגזרת" למודוסים?', en: "What's the 'parallel' approach to modes vs the 'derivative' approach?" },
        choices, correctIndex,
        explanation: { he: 'נגזרת: C-D-E-F-G-A-B-C (כולם אותם תווים, שורש שונה). מקבילה: C איוניאן vs C דוריאן (אותו שורש C, נוסחה שונה).', en: 'Derivative: C-D-E-F-G-A-B-C (all same notes, different root). Parallel: C Ionian vs C Dorian (same root C, different formula).' },
        theory: THEORY_TEXT,
      }
    }
    case 'dreamyMode': {
      const correct: Bilingual = { he: 'לידי (Lydian)', en: 'Lydian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'איוניאן (Ionian)', en: 'Ionian' },
        { he: 'מיקסולידי (Mixolydian)', en: 'Mixolydian' },
        { he: 'דוריאן (Dorian)', en: 'Dorian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'איזה מודוס נשמע "כמו מז׳ור אבל חולמני ומרחף"?', en: "What mode sounds like major but more 'dreamy/floating'?" },
        choices, correctIndex,
        explanation: { he: 'לידי = מז׳ור עם #4 — הטריטון מוסיף תחושת ריחוף וחלום (ג׳ון ויליאמס משתמש בו בסרטי מדע בדיוני).', en: 'Lydian = major with #4 — the tritone adds a floating, dreamy quality (John Williams uses it in sci-fi films).' },
        theory: THEORY_TEXT,
      }
    }
    case 'dDorianCMajor': {
      const correct: Bilingual = { he: 'כן — D דוריאן = C מז׳ור החל מ-D', en: 'Yes — D Dorian = C major starting on D' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לא — הם שונים', en: 'No — they are different' },
        { he: 'רק 5 תווים משותפים', en: 'Only 5 notes shared' },
        { he: 'נכון רק בגישה מקבילה', en: 'True only in parallel approach' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'האם D דוריאן ו-C מז׳ור חולקים את אותם התווים?', en: 'Do D Dorian and C major share the same notes?' },
        choices, correctIndex,
        explanation: { he: 'כן! D דוריאן = C מז׳ור המתחיל על D — זהו הבסיס לגישה ה"נגזרת".', en: 'Yes! D Dorian = C major starting on D — this is the basis of the "derivative" approach.' },
        theory: THEORY_TEXT,
      }
    }
    case 'overDom7': {
      const correct: Bilingual = { he: 'מיקסולידי', en: 'Mixolydian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'דוריאן', en: 'Dorian' },
        { he: 'לידי', en: 'Lydian' },
        { he: 'איוניאן', en: 'Ionian' },
      ])
      return {
        id: uid(), categoryId: 'modes_theory', difficulty: 'hard',
        prompt: { he: 'איזה מודוס משמש מעל אקורד דומיננטי 7 לצליל "בלוזי"?', en: 'What mode is used over a dominant 7th chord for a bluesy sound?' },
        choices, correctIndex,
        explanation: { he: 'מיקסולידי (מז׳ור עם b7) מתאים מושלם לאקורד דומיננטי 7 — ה-b7 כלול בשניהם.', en: 'Mixolydian (major with b7) perfectly fits the dominant 7 chord — the b7 is shared by both.' },
        theory: THEORY_TEXT,
      }
    }
  }
}
