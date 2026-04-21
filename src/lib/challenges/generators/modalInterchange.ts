import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
  pitchClass,
  NOTE_NAMES_SHARP,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'אינטרצ׳נג׳ מודאלי (Modal Interchange) הוא שאלת אקורדים ממודוסים מקבילים — בעיקר מהמינור הטבעי לתוך שיר מז׳ורי. האקורדים השאולים (bVI, bVII, iv) מוסיפים צבע רגשי ומפתיעים את האוזן. ה-V המשני (Secondary Dominant) הוא אקורד V7 שמוביל לאקורד שאינו ה-I.',
  en: 'Modal interchange is borrowing chords from parallel modes — most commonly from natural minor into a major key. Borrowed chords (bVI, bVII, iv) add emotional color and surprise the ear. A secondary dominant is a V7 chord applied to a chord other than I.',
}

type EasyShape = 'whatIsModal' | 'ivBorrowedFrom' | 'beatlesBvii' | 'whatIsSecDom' | 'secDomOfIi' | 'bviiInC' | 'effectOfModal'
type MedShape  = 'bviInC' | 'andalusian' | 'v7ofIV' | 'picardyThird' | 'bviiInRock' | 'backdoor' | 'secDomOfV'
type HardShape = 'saddestBorrow' | 'borrowVsModulate' | 'bviRoman' | 'secDomOfVi' | 'tritoneSubDef' | 'tritoneSubG7' | 'bviiFunction' | 'ivBorrowed'

export function generateModalInterchangeQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['whatIsModal','ivBorrowedFrom','beatlesBvii','whatIsSecDom','secDomOfIi','bviiInC','effectOfModal'])
  switch (shape) {
    case 'whatIsModal': {
      const correct: Bilingual = { he: 'שאלת אקורדים ממודוס מקביל', en: 'Borrowing chords from a parallel mode/key' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שינוי מפתח קבוע', en: 'A permanent key change' },
        { he: 'שימוש בסולם כרומטי', en: 'Using the chromatic scale' },
        { he: 'נגינה מחוץ למפתח', en: 'Playing outside the key' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'מה הוא "אינטרצ׳נג׳ מודאלי"?', en: "What is 'modal interchange'?" },
        choices, correctIndex,
        explanation: { he: 'אינטרצ׳נג׳ מודאלי = שאלת אקורד ממודוס מקביל (אותו שורש, מפתח שונה).', en: 'Modal interchange = borrowing a chord from a parallel mode (same root, different key).' },
        theory: THEORY_TEXT,
      }
    }
    case 'ivBorrowedFrom': {
      const correct: Bilingual = { he: 'מינור טבעי (Aeolian)', en: 'Natural minor (Aeolian)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'פריגי', en: 'Phrygian' },
        { he: 'לידי', en: 'Lydian' },
        { he: 'לוקריאן', en: 'Locrian' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'ה-iv (מינורי) בשיר מז׳ורי נשאל ממאיפה?', en: 'The iv chord in a major key is borrowed from which mode?' },
        choices, correctIndex,
        explanation: { he: 'ה-iv המינורי הוא אקורד שאול מהמינור הטבעי המקביל — הוא מוסיף קהות ועצב.', en: 'The minor iv is borrowed from the parallel natural minor — it adds darkness and sadness.' },
        theory: THEORY_TEXT,
      }
    }
    case 'beatlesBvii': {
      const correct: Bilingual = { he: 'שימוש ב-bVII בשיר מז׳ורי', en: 'Using bVII in a major key' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שימוש ב-bVI בשיר מז׳ורי', en: 'Using bVI in a major key' },
        { he: 'שינוי מפתח בין בתים', en: 'Key change between verses' },
        { he: 'אקורד מוקטן על הדרגה השנייה', en: 'Diminished chord on degree II' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'הביטלס השתמשו בטריק הרמוני מפורסם של שימוש ב-bVII. מה זה?', en: "Which famous Beatles harmonic trick uses a borrowed bVII chord?" },
        choices, correctIndex,
        explanation: { he: 'ה-bVII (למשל Bb ב-C מז׳ור) הוא אקורד שאול מהמינור המקביל — נפוץ בבריטיש-אינווייז׳ן.', en: 'The bVII (e.g. Bb in C major) is borrowed from the parallel minor — common in British Invasion rock.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whatIsSecDom': {
      const correct: Bilingual = { he: 'אקורד V7 שמוביל לאקורד שאינו ה-I', en: 'A V7 chord applied to a chord other than I' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אקורד שני (ii) של המפתח', en: 'The ii chord of the key' },
        { he: 'שינוי מפתח', en: 'A key change' },
        { he: 'אקורד מוגדל על ה-V', en: 'An augmented chord on V' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'מהו "דומיננטה משנית" (Secondary Dominant)?', en: "What is a 'secondary dominant'?" },
        choices, correctIndex,
        explanation: { he: 'דומיננטה משנית = V7 של כל אקורד, לא רק של ה-I. יוצרת מתח מקומי לפני כל אקורד.', en: 'Secondary dominant = V7 of any chord, not just I. Creates local tension before any chord.' },
        theory: THEORY_TEXT,
      }
    }
    case 'secDomOfIi': {
      const correct = 'A7'
      const { choices, correctIndex } = buildChoices(correct, ['E7','D7','G7'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'ב-C מז׳ור, מה הדומיננטה המשנית של ה-ii (Dm)?', en: 'In C major, what is the secondary dominant of the ii chord (Dm)?' },
        choices, correctIndex,
        explanation: { he: 'ה-V של Dm הוא A (כי V של D הוא A). אז הדומיננטה המשנית היא A7.', en: 'The V of Dm is A (since V of D is A). So the secondary dominant is A7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bviiInC': {
      const correct = 'Bb major'
      const { choices, correctIndex } = buildChoices(correct, ['Ab major','Gb major','Eb major'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'מה האקורד bVII ב-C מז׳ור?', en: 'The chord bVII in C major would be?' },
        choices, correctIndex,
        explanation: { he: 'bVII ב-C מז׳ור = Bb מז׳ור (חצי-טון מתחת ל-B, הדרגה השביעית הדיאטונית).', en: 'bVII in C major = Bb major (a semitone below B, the diatonic 7th degree).' },
        theory: THEORY_TEXT,
      }
    }
    case 'effectOfModal': {
      const correct: Bilingual = { he: 'צבע רגשי מפתיע מבלי לעזוב את מרכז המפתח', en: 'Unexpected color/emotion without leaving the key center' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שינוי מפתח קבוע', en: 'A permanent key change' },
        { he: 'דיסוננס חזק ולא מוסיקלי', en: 'Strong unmusical dissonance' },
        { he: 'הפיכת המפתח למינורי', en: 'Making the key fully minor' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'easy',
        prompt: { he: 'מה האפקט המוסיקלי של אינטרצ׳נג׳ מודאלי?', en: 'What effect does modal interchange create in music?' },
        choices, correctIndex,
        explanation: { he: 'אקורדים שאולים מוסיפים צבע רגשי ומפתיעים את האוזן מבלי לשנות את מרכז הטונאליות.', en: 'Borrowed chords add emotional color and surprise the ear without changing the tonal center.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['bviInC','andalusian','v7ofIV','picardyThird','bviiInRock','backdoor','secDomOfV'])
  switch (shape) {
    case 'bviInC': {
      const correct = 'Ab major'
      const { choices, correctIndex } = buildChoices(correct, ['Gb major','Bb major','Eb major'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'ב-C מז׳ור, מהו ה-bVI?', en: 'In C major, bVI is?' },
        choices, correctIndex,
        explanation: { he: 'bVI ב-C מז׳ור = Ab מז׳ור. הוא שאול מ-C מינור הטבעי.', en: 'bVI in C major = Ab major. It is borrowed from C natural minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'andalusian': {
      const correct: Bilingual = { he: 'פריגי ואאיוליאן', en: 'Phrygian/Aeolian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לידי ומיקסולידי', en: 'Lydian/Mixolydian' },
        { he: 'דוריאן ולוקריאן', en: 'Dorian/Locrian' },
        { he: 'איוניאן ודוריאן', en: 'Ionian/Dorian' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'ה-Andalusian Cadence (i-bVII-bVI-V) לוקח אקורדים ממאיזה מודוס?', en: 'The Andalusian cadence (i-bVII-bVI-V) uses chords from which mode?' },
        choices, correctIndex,
        explanation: { he: 'ה-Andalusian Cadence שואלת מהמינור הטבעי (אאיוליאן) ומפריגי — נפוצה בפלמנקו.', en: 'The Andalusian cadence borrows from natural minor (Aeolian) and Phrygian — common in flamenco.' },
        theory: THEORY_TEXT,
      }
    }
    case 'v7ofIV': {
      const correct = 'C7'
      const { choices, correctIndex } = buildChoices(correct, ['G7','A7','D7'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'ב-C מז׳ור, מה הוא V7/IV (הדומיננטה המשנית של ה-IV)?', en: 'What is V7/IV in C major?' },
        choices, correctIndex,
        explanation: { he: 'IV של C מז׳ור = F. V של F = C. אז V7/IV = C7 (דומיננטי — לא Cmaj7).', en: 'IV of C major = F. V of F = C. So V7/IV = C7 (dominant 7th, not Cmaj7).' },
        theory: THEORY_TEXT,
      }
    }
    case 'picardyThird': {
      const correct: Bilingual = { he: 'סיום שיר מינורי עם אקורד I מז׳ורי', en: 'Ending a minor piece with a major I chord' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שינוי מהמז׳ור למינור', en: 'Switching from major to minor' },
        { he: 'שימוש בטרצה מוגדלת', en: 'Using an augmented third' },
        { he: 'חזרה לאקורד הראשי', en: 'Return to the tonic chord' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'מה המשמעות של "Picardy Third"?', en: "What does the 'Picardy Third' mean?" },
        choices, correctIndex,
        explanation: { he: '"Picardy Third" = סיום שיר מינורי עם אקורד מז׳ורי. נפוץ בבארוק — מעניק תחושת פתרון.', en: "'Picardy Third' = ending a minor piece with a major chord. Common in Baroque — gives a sense of resolution." },
        theory: THEORY_TEXT,
      }
    }
    case 'bviiInRock': {
      const correct: Bilingual = { he: 'רוק, לדוגמה A-G-D ב-E מיקסולידי', en: 'Rock, e.g. A-G-D in E Mixolydian' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'ג׳אז קלאסי', en: 'Classical jazz' },
        { he: 'פלמנקו', en: 'Flamenco' },
        { he: 'רגאיי', en: 'Reggae' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'ב-bVII שימושי במיוחד באיזה ז׳אנר?', en: 'In which progression does the bVII chord appear prominently?' },
        choices, correctIndex,
        explanation: { he: 'ה-bVII מופיע הרבה ברוק (A-G-D בשיר ב-E מז׳ור/מיקסולידי) — נותן צביון רוקי.', en: 'bVII appears often in rock (A-G-D in E major/Mixolydian) — gives a rocky color.' },
        theory: THEORY_TEXT,
      }
    }
    case 'backdoor': {
      const correct: Bilingual = { he: 'שימוש ב-bVII7→I במקום V7→I', en: 'Using bVII7→I instead of V7→I' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שימוש ב-ii→I ישירות', en: 'Using ii→I directly' },
        { he: 'החלפת V7 ב-I7', en: 'Replacing V7 with I7' },
        { he: 'שימוש בקדנצה מינורית', en: 'Using a minor cadence' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'מה הוא "Backdoor ii-V-I"?', en: "What is a 'backdoor ii-V-I'?" },
        choices, correctIndex,
        explanation: { he: '"Backdoor": שימוש ב-bVII7→I — פותר אל ה-I בצעד חצי-טון מלמעלה, במקום V7→I.', en: "'Backdoor': uses bVII7→I — resolves to I from a half step above, instead of V7→I." },
        theory: THEORY_TEXT,
      }
    }
    case 'secDomOfV': {
      const correct = 'A7'
      const { choices, correctIndex } = buildChoices(correct, ['D7','E7','B7'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'medium',
        prompt: { he: 'ב-G מז׳ור, מה הדומיננטה המשנית של ה-V (D)?', en: 'In G major, what is the secondary dominant of V (D)?' },
        choices, correctIndex,
        explanation: { he: 'V של G = D. הדומיננטה של D (V/V) = A. אז הדומיננטה המשנית = A7.', en: 'V of G = D. The dominant of D (V/V) = A. So the secondary dominant = A7.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['saddestBorrow','borrowVsModulate','bviRoman','secDomOfVi','tritoneSubDef','tritoneSubG7','bviiFunction','ivBorrowed'])
  switch (shape) {
    case 'saddestBorrow': {
      const correct: Bilingual = { he: 'bVI (כמו Ab ב-C מז׳ור)', en: 'bVI (like Ab in C major)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'bVII (כמו Bb ב-C מז׳ור)', en: 'bVII (like Bb in C major)' },
        { he: 'iv (כמו Fm ב-C מז׳ור)', en: 'iv (like Fm in C major)' },
        { he: 'bII (כמו Db ב-C מז׳ור)', en: 'bII (like Db in C major)' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'איזה אקורד שאול מייצר את הצליל ה"עצוב ביותר" בשיר מז׳ורי?', en: "What borrowed chord creates the 'saddest' sound in a major key?" },
        choices, correctIndex,
        explanation: { he: 'ה-bVI (כמו Ab ב-C מז׳ור) הוא האקורד הכי עצוב — הוא בנוי על b6 של הפרלל מינור.', en: 'The bVI (like Ab in C major) sounds the saddest — built on the b6 of the parallel minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'borrowVsModulate': {
      const correct: Bilingual = { he: 'שאלה = זמנית, חוזרים למפתח; מודולציה = ממסדת מפתח חדש', en: 'Borrowed = temporary, returns to home key; modulation = establishes a new key' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אין הבדל — שניהם שינוי מפתח', en: 'No difference — both are key changes' },
        { he: 'מודולציה = זמנית; שאלה = קבועה', en: 'Modulation = temporary; borrowing = permanent' },
        { he: 'שאלה = שינוי לתוך מינור; מודולציה = שינוי לתוך מז׳ור', en: 'Borrowing = shift to minor; modulation = shift to major' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'מה ההבדל בין אקורד שאול (borrowed) למודולציה?', en: "What's the difference between a borrowed chord and a modulation?" },
        choices, correctIndex,
        explanation: { he: 'אקורד שאול: זמני — חוזרים למפתח המקורי. מודולציה: ממסדת מפתח חדש לתקופה.', en: 'Borrowed chord: temporary — you return to the home key. Modulation: establishes a new key for a period.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bviRoman': {
      const correct = 'bVI'
      const { choices, correctIndex } = buildChoices(correct, ['VI','#VI','bVII'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'באיזה ציון רומי נציין את ה"flat-VI" (האקורד השאול)?', en: "What Roman numeral represents the 'flat-VI' borrowed chord?" },
        choices, correctIndex,
        explanation: { he: 'ה-bVI = flat-six = האקורד המז׳ורי על הדרגה השישית של המינור המקביל.', en: 'The bVI = flat-six = the major chord on the 6th degree of the parallel minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'secDomOfVi': {
      const correct = 'E7'
      const { choices, correctIndex } = buildChoices(correct, ['B7','A7','G7'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'ב-C מז׳ור, מה הדומיננטה המשנית של ה-vi (Am)?', en: 'In C major, what is the secondary dominant of vi (Am)?' },
        choices, correctIndex,
        explanation: { he: 'vi של C מז׳ור = Am. הדומיננטה של Am = E7. אז V/vi = E7.', en: 'vi of C major = Am. The dominant of Am = E7. So V/vi = E7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'tritoneSubDef': {
      const correct: Bilingual = { he: 'החלפת אקורד דומיננטי 7 באקורד מרחק טריטון', en: "Replacing a dominant 7th with the chord a tritone away" }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'החלפת אקורד מינורי באקורד מז׳ורי', en: 'Replacing a minor chord with a major chord' },
        { he: 'הפיכת הדומיננטה למוקטן', en: 'Turning the dominant into diminished' },
        { he: 'שימוש בשני דומיננטים בו-זמנית', en: 'Using two dominants simultaneously' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'מהו "Tritone Substitution" (החלפת טריטון)?', en: "What is a 'tritone substitution'?" },
        choices, correctIndex,
        explanation: { he: 'החלפת טריטון = החלפת אקורד V7 באקורד מרחק 6 חצאי-טונים (טריטון). הם חולקים את אותו טריטון פנימי.', en: 'Tritone sub = replacing V7 with a chord a tritone (6 semitones) away. They share the same internal tritone.' },
        theory: THEORY_TEXT,
      }
    }
    case 'tritoneSubG7': {
      const correct = 'Db7'
      const { choices, correctIndex } = buildChoices(correct, ['Ab7','F#7','Eb7'])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'ב-C מז׳ור, מה ה-Tritone Sub של G7?', en: 'In C major, the tritone sub for G7 would be?' },
        choices, correctIndex,
        explanation: { he: 'G + 6 חצאי-טונים = Db. אז ה-Tritone Sub של G7 הוא Db7.', en: 'G + 6 semitones = Db. So the tritone sub for G7 is Db7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bviiFunction': {
      const correct: Bilingual = { he: 'דומיננטה אחורית (Backdoor Dominant) — פותר ל-I מלמעלה', en: 'Backdoor dominant — resolves to I from above' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'סאב-דומיננטה (Subdominant)', en: 'Subdominant function' },
        { he: 'טוניקה חלופית', en: 'Alternative tonic' },
        { he: 'אקורד מחבר (Passing Chord)', en: 'Passing chord' },
      ])
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: 'מה הפונקציה ההרמונית של ה-bVII ב-Modal Interchange?', en: 'What is the harmonic function of the bVII in modal interchange?' },
        choices, correctIndex,
        explanation: { he: 'ה-bVII (Backdoor Dominant) פותר ל-I בתנועת שלם-טון מלמעלה — חלופה לדומיננטה הרגילה.', en: 'The bVII (Backdoor Dominant) resolves to I by a whole step from above — an alternative to the regular dominant.' },
        theory: THEORY_TEXT,
      }
    }
    case 'ivBorrowed': {
      const root = randomOf(['C','G','D','A','F'])
      const rootPc = pitchClass(root)
      const ivMinorRoot = NOTE_NAMES_SHARP[(rootPc + 5) % 12]
      const correct = `${ivMinorRoot}m`
      const ivMajorRoot = ivMinorRoot
      const pool = [`${ivMajorRoot}`, `${NOTE_NAMES_SHARP[(rootPc + 7) % 12]}`, `${NOTE_NAMES_SHARP[(rootPc + 3) % 12]}m`]
      const { choices, correctIndex } = buildChoices(correct, pool)
      return {
        id: uid(), categoryId: 'modal_interchange', difficulty: 'hard',
        prompt: { he: `מה ה-iv (מינורי, שאול) ב-${root} מז׳ור?`, en: `What is the borrowed iv chord in ${root} major?` },
        choices, correctIndex,
        explanation: { he: `ה-iv השאול ב-${root} מז׳ור הוא ${correct} — שאול מ-${root} מינור.`, en: `The borrowed iv in ${root} major is ${correct} — borrowed from ${root} minor.` },
        theory: THEORY_TEXT,
      }
    }
  }
}
