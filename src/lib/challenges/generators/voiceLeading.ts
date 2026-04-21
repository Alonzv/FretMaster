import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'Voice Leading (הולכת קולות) היא האמנות של הזזת כל קול מלודי בנפרד בין אקורדים בתנועה חלקה. היפוכים (inversions) מאפשרים את כך: בסיס ראשון (3rd בבס), בסיס שני (5th בבס), בסיס שלישי (7th בבס ב-7th chords). בass-line חלקה מוזיקה נשמעת טבעית ומחוברת.',
  en: 'Voice leading is the art of moving each melodic voice smoothly between chords. Inversions enable this: first inversion (3rd in bass), second inversion (5th in bass), third inversion (7th in bass for 7th chords). A smooth bass line makes music sound natural and connected.',
}

type EasyShape = 'whatIsInversion' | 'rootPosition' | 'firstInversion' | 'secondInversion' | 'ceInBass' | 'gRootBass' | 'slashChord'
type MedShape  = 'secondInvBass' | 'smoothVL' | 'contraryMotion' | 'parallelMotion' | 'avoidParFifths' | 'amCBass' | 'commonTone'
type HardShape = 'whatIsVL' | 'tritoneInDom7' | 'tritonResolve' | 'addedNote' | 'am7vsC6' | 'voiceExchange' | 'parallelOctaves' | 'closedSpacing'

export function generateVoiceLeadingQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['whatIsInversion','rootPosition','firstInversion','secondInversion','ceInBass','gRootBass','slashChord'])
  switch (shape) {
    case 'whatIsInversion': {
      const correct: Bilingual = { he: 'כאשר תו שאינו השורש נמצא בבס', en: 'When a note other than the root is in the bass' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'כאשר האקורד הופך', en: 'When the chord is reversed' },
        { he: 'כאשר האקורד משחק בתוספת רוברסל', en: 'When the chord plays with reversal' },
        { he: 'כאשר שני אקורדים מנוגנים בו-זמנית', en: 'When two chords play simultaneously' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'מהו "היפוך אקורד" (inversion)?', en: "What is a chord 'inversion'?" },
        choices, correctIndex,
        explanation: { he: 'היפוך = כאשר תו שאינו השורש נמצא בבס. מאפשר bass-line חלקה.', en: 'Inversion = when a note other than the root is in the bass. Enables a smooth bass line.' },
        theory: THEORY_TEXT,
      }
    }
    case 'rootPosition': {
      const correct: Bilingual = { he: 'השורש בבס', en: 'Root note is in the bass' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'הדרגה השלישית בבס', en: '3rd is in the bass' },
        { he: 'הדרגה החמישית בבס', en: '5th is in the bass' },
        { he: 'הדרגה השביעית בבס', en: '7th is in the bass' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'מהי "פוזיציית שורש" (root position)?', en: "What is a 'root position' chord?" },
        choices, correctIndex,
        explanation: { he: 'פוזיציית שורש = השורש בבס. C מז׳ור בפוזיציית שורש: C-E-G עם C בבס.', en: 'Root position = root in the bass. C major in root position: C-E-G with C in the bass.' },
        theory: THEORY_TEXT,
      }
    }
    case 'firstInversion': {
      const correct: Bilingual = { he: 'הדרגה השלישית (3rd) בבס', en: '3rd of the chord is in the bass' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'השורש בבס', en: 'Root is in the bass' },
        { he: 'הדרגה החמישית בבס', en: '5th is in the bass' },
        { he: 'הדרגה השביעית בבס', en: '7th is in the bass' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'מהו "היפוך ראשון" (first inversion)?', en: "What is a 'first inversion'?" },
        choices, correctIndex,
        explanation: { he: 'היפוך ראשון = הדרגה השלישית (3rd) בבס. C מז׳ור: E-G-C עם E בבס.', en: 'First inversion = 3rd of the chord in the bass. C major: E-G-C with E in the bass.' },
        theory: THEORY_TEXT,
      }
    }
    case 'secondInversion': {
      const correct: Bilingual = { he: 'הדרגה החמישית (5th) בבס', en: '5th of the chord is in the bass' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'השורש בבס', en: 'Root is in the bass' },
        { he: 'הדרגה השלישית בבס', en: '3rd is in the bass' },
        { he: 'הדרגה השביעית בבס', en: '7th is in the bass' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'מהו "היפוך שני" (second inversion)?', en: "What is a 'second inversion'?" },
        choices, correctIndex,
        explanation: { he: 'היפוך שני = הדרגה החמישית (5th) בבס. C מז׳ור: G-C-E עם G בבס.', en: 'Second inversion = 5th of the chord in the bass. C major: G-C-E with G in the bass.' },
        theory: THEORY_TEXT,
      }
    }
    case 'ceInBass': {
      const correct = 'E'
      const { choices, correctIndex } = buildChoices(correct, ['C','G','B'])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'C מז׳ור בהיפוך ראשון — איזה תו בבס?', en: 'C major in 1st inversion has which note in the bass?' },
        choices, correctIndex,
        explanation: { he: 'C מז׳ור: C-E-G. היפוך ראשון = הדרגה השלישית (E) בבס.', en: 'C major: C-E-G. First inversion = 3rd (E) in the bass.' },
        theory: THEORY_TEXT,
      }
    }
    case 'gRootBass': {
      const correct = 'G'
      const { choices, correctIndex } = buildChoices(correct, ['B','D','F#'])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'G מז׳ור בפוזיציית שורש — מה בבס?', en: 'G major in root position: what is in the bass?' },
        choices, correctIndex,
        explanation: { he: 'פוזיציית שורש = השורש בבס. G מז׳ור: G בבס.', en: 'Root position = root in the bass. G major: G in the bass.' },
        theory: THEORY_TEXT,
      }
    }
    case 'slashChord': {
      const correct: Bilingual = { he: 'אקורד C מז׳ור עם E בבס (היפוך ראשון)', en: 'C major chord with E in the bass (1st inversion)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שני אקורדים שונים', en: 'Two different chords' },
        { he: 'אקורד E מינורי', en: 'E minor chord' },
        { he: 'אקורד C עם תוספת E', en: 'C chord with E added on top' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'easy',
        prompt: { he: 'סימון slash chord "C/E" מה פירושו?', en: "Slash chord notation C/E means?" },
        choices, correctIndex,
        explanation: { he: 'C/E = אקורד C מז׳ור עם E בבס = היפוך ראשון של C.', en: 'C/E = C major chord with E in the bass = first inversion of C.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['secondInvBass','smoothVL','contraryMotion','parallelMotion','avoidParFifths','amCBass','commonTone'])
  switch (shape) {
    case 'secondInvBass': {
      const correct = 'G'
      const { choices, correctIndex } = buildChoices(correct, ['C','E','B'])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'C מז׳ור בהיפוך שני (6/4 chord) — איזה תו בבס?', en: 'C major in 2nd inversion (6/4 chord) has which note in the bass?' },
        choices, correctIndex,
        explanation: { he: 'היפוך שני = הדרגה החמישית בבס. C מז׳ור: 5th = G. אז G בבס.', en: 'Second inversion = 5th in the bass. C major: 5th = G. So G in the bass.' },
        theory: THEORY_TEXT,
      }
    }
    case 'smoothVL': {
      const correct: Bilingual = { he: 'הזזת קולות במרווחים הקטנים ביותר האפשריים', en: 'Moving voices by the smallest possible intervals' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שימוש תמיד בתנועה מקבילה', en: 'Always using parallel motion' },
        { he: 'שינוי כל הקולות בו-זמנית', en: 'Changing all voices simultaneously by large intervals' },
        { he: 'שמירה על כל הקולות קבועים', en: 'Keeping all voices static' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'מה הופך Voice Leading ל"חלקה"?', en: "What makes voice leading 'smooth'?" },
        choices, correctIndex,
        explanation: { he: 'Voice leading חלקה = כל קול זז במרווח קטן ככל האפשר — מחצי-טון לטרצה.', en: 'Smooth voice leading = each voice moves by the smallest possible interval — from a semitone to a third.' },
        theory: THEORY_TEXT,
      }
    }
    case 'contraryMotion': {
      const correct: Bilingual = { he: 'קולות נעים בכיוונים מנוגדים', en: 'Voices moving in opposite directions' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'קולות נעים באותו כיוון', en: 'Voices moving in the same direction' },
        { he: 'קולות נשארים קבועים', en: 'Voices remaining static' },
        { he: 'קולות מחליפים מיקום', en: 'Voices exchanging positions' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'מהי "תנועה מנוגדת" (contrary motion)?', en: "What is 'contrary motion'?" },
        choices, correctIndex,
        explanation: { he: 'תנועה מנוגדת = קול אחד עולה בזמן שהשני יורד. נחשבת לאיכות voice leading הטובה ביותר.', en: 'Contrary motion = one voice goes up while the other goes down. Considered the best quality voice leading.' },
        theory: THEORY_TEXT,
      }
    }
    case 'parallelMotion': {
      const correct: Bilingual = { he: 'קולות נעים באותו כיוון באותו מרווח', en: 'Voices moving in the same direction by the same interval' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'קולות נעים בכיוונים מנוגדים', en: 'Voices moving in opposite directions' },
        { he: 'קולות נשארים קבועים', en: 'Voices remaining static' },
        { he: 'קולות מחליפים מיקום', en: 'Voices exchanging positions' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'מהי "תנועה מקבילה" (parallel motion)?', en: "What is 'parallel motion'?" },
        choices, correctIndex,
        explanation: { he: 'תנועה מקבילה = שני קולות נעים באותו כיוון ובאותו מרווח.', en: 'Parallel motion = two voices moving in the same direction by the same interval.' },
        theory: THEORY_TEXT,
      }
    }
    case 'avoidParFifths': {
      const correct: Bilingual = { he: 'נשמע חלול ומימי-ביניימי', en: 'Sounds hollow/medieval' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'יוצר דיסוננס חזק', en: 'Creates strong dissonance' },
        { he: 'מסבך את ה-voice leading', en: 'Complicates voice leading' },
        { he: 'משנה את מרכז הטון', en: 'Changes the tonal center' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'מדוע יש להימנע מקווינטות מקבילות בהרמוניה קלאסית?', en: 'Why avoid parallel fifths in classical harmony?' },
        choices, correctIndex,
        explanation: { he: 'קווינטות מקבילות נאסרו בקלאסיקה כי הן נשמעות חלולות ומימי-ביניימיות — חסרות עושר טמברי.', en: 'Parallel fifths were banned in classical style because they sound hollow/medieval — lacking timbral richness.' },
        theory: THEORY_TEXT,
      }
    }
    case 'amCBass': {
      const correct = 'C'
      const { choices, correctIndex } = buildChoices(correct, ['A','E','G'])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'Am/C (Am בהיפוך ראשון) — איזה תו בבס?', en: 'Am/C (Am first inversion) has which note in the bass?' },
        choices, correctIndex,
        explanation: { he: 'Am = A-C-E. היפוך ראשון = הדרגה השלישית (C) בבס → Am/C.', en: 'Am = A-C-E. First inversion = 3rd (C) in the bass → Am/C.' },
        theory: THEORY_TEXT,
      }
    }
    case 'commonTone': {
      const correct: Bilingual = { he: 'תו D שמשותף לשניהם (Dm וגם G7)', en: 'D, which is shared by both (Dm and G7)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'תו C שמשותף לשניהם', en: 'C, which is shared by both' },
        { he: 'תו A שמשותף לשניהם', en: 'A, which is shared by both' },
        { he: 'אין תווים משותפים', en: 'There are no common tones' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'medium',
        prompt: { he: 'ב-ii-V-I, איזה תו משותף לאקורד ה-ii ול-V?', en: 'In a ii-V-I, what note is shared between ii and V?' },
        choices, correctIndex,
        explanation: { he: 'ב-C מז׳ור: ii = Dm (D-F-A), V = G7 (G-B-D-F). התו D וגם F משותפים.', en: 'In C major: ii = Dm (D-F-A), V = G7 (G-B-D-F). D and F are both shared.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['whatIsVL','tritoneInDom7','tritonResolve','addedNote','am7vsC6','voiceExchange','parallelOctaves','closedSpacing'])
  switch (shape) {
    case 'whatIsVL': {
      const correct: Bilingual = { he: 'התנועה הלינארית של הקולות המלודיים הבודדים בתוך פרוגרסיה', en: 'The linear progression of individual melodic lines within a chord progression' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'בחירת אקורדים בפרוגרסיה', en: 'The selection of chords in a progression' },
        { he: 'שינוי קצב בין אקורדים', en: 'The tempo change between chords' },
        { he: 'היפוך כל האקורדים', en: 'The inversion of all chords' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'מהי "Voice Leading" (הולכת קולות)?', en: "What is 'voice leading'?" },
        choices, correctIndex,
        explanation: { he: 'Voice Leading = תנועת כל קול מלודי בנפרד (soprano, alto, tenor, bass) בין אקורד לאקורד.', en: 'Voice leading = the movement of each individual melodic line (soprano, alto, tenor, bass) between chords.' },
        theory: THEORY_TEXT,
      }
    }
    case 'tritoneInDom7': {
      const correct: Bilingual = { he: 'הטריטון (b7 ל-3)', en: 'The tritone (b7 to 3)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'הקווינטה (5th)', en: 'The perfect fifth' },
        { he: 'הטרצה הגדולה (major 3rd)', en: 'The major third' },
        { he: 'השורש עצמו', en: 'The root itself' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'איזה מרווח יוצר את המתח החזק ביותר באקורד דומיננטי 7?', en: 'What interval creates the strongest tension in a dominant 7th chord?' },
        choices, correctIndex,
        explanation: { he: 'הטריטון בין ה-3 וה-b7 (B-F ב-G7) יוצר מתח עז שדורש פתרון.', en: 'The tritone between the 3rd and b7 (B-F in G7) creates intense tension demanding resolution.' },
        theory: THEORY_TEXT,
      }
    }
    case 'tritonResolve': {
      const correct: Bilingual = { he: 'B עולה ל-C; F יורד ל-E', en: 'B resolves up to C; F resolves down to E' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'B יורד ל-Bb; F עולה ל-F#', en: 'B resolves down to Bb; F resolves up to F#' },
        { he: 'שניהם יורדים חצי-טון', en: 'Both resolve down by a half step' },
        { he: 'B נשאר; F עולה ל-G', en: 'B stays; F resolves up to G' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'כיצד הטריטון ב-G7 (B ו-F) נפתר אל C מז׳ור?', en: 'How does the tritone in G7 resolve to C major?' },
        choices, correctIndex,
        explanation: { he: 'B→C (חצי-טון למעלה = 3rd של G7 הופך ל-Root של C), F→E (חצי-טון למטה = b7 של G7 הופך ל-3rd של C).', en: 'B→C (half step up = 3rd of G7 becomes root of C), F→E (half step down = b7 of G7 becomes 3rd of C).' },
        theory: THEORY_TEXT,
      }
    }
    case 'addedNote': {
      const correct: Bilingual = { he: 'אקורד עם תו מוסף שאינו יוצר אקורד ספטימה', en: 'A chord with an added tone that does not create a 7th chord' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אקורד ספטימה רגיל', en: 'A regular 7th chord' },
        { he: 'אקורד עם 5th כפולה', en: 'A chord with a doubled 5th' },
        { he: 'אקורד מוגדל', en: 'An augmented chord' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'מהו "added note chord" (אקורד עם תו מוסף)?', en: "What is an 'added note' chord?" },
        choices, correctIndex,
        explanation: { he: 'אקורד עם תו מוסף: Cadd9 = C-E-G-D (9th מוסף, לא 7th). שונה מ-Cmaj9 שמכיל גם 7th.', en: 'Added note chord: Cadd9 = C-E-G-D (9th added, no 7th). Different from Cmaj9 which also contains a 7th.' },
        theory: THEORY_TEXT,
      }
    }
    case 'am7vsC6': {
      const correct: Bilingual = { he: 'אותם תווים (A-C-E-G), פונקציה שונה לפי ה-context', en: 'Same notes (A-C-E-G), different function depending on context' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'Am7 מכיל G# בעוד C6 מכיל G', en: 'Am7 contains G# while C6 contains G' },
        { he: 'C6 מכיל יותר תווים', en: 'C6 contains more notes' },
        { he: 'Am7 הוא מינורי ו-C6 הוא מז׳ורי — הם שונים לחלוטין', en: 'Am7 is minor and C6 is major — they are completely different' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'מה ההבדל בין Am7 ל-C6?', en: "What's the difference between Am7 and C6?" },
        choices, correctIndex,
        explanation: { he: 'Am7 = A-C-E-G. C6 = C-E-G-A. אותם 4 תווים! ההבדל הוא פונקציה ותפקיד הבס.', en: 'Am7 = A-C-E-G. C6 = C-E-G-A. The same 4 notes! The difference is function and bass role.' },
        theory: THEORY_TEXT,
      }
    }
    case 'voiceExchange': {
      const correct: Bilingual = { he: 'שני קולות מחליפים את התווים שלהם', en: 'Two voices swap their notes' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שני אקורדים מחליפים מיקום', en: 'Two chords switch positions' },
        { he: 'קול אחד נעלם ואחר מחליפו', en: 'One voice disappears and another replaces it' },
        { he: 'תנועה מנוגדת בין כל הקולות', en: 'Contrary motion in all voices' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'מהו "voice exchange" (חליפת קולות)?', en: "What is 'voice exchange'?" },
        choices, correctIndex,
        explanation: { he: 'Voice exchange: קול A עובר לתו X בזמן שקול B עובר לתו Y שהיה של A (ו-A עובר ל-Y של B).', en: 'Voice exchange: voice A moves to note X while voice B moves to note Y (previously held by A), and vice versa.' },
        theory: THEORY_TEXT,
      }
    }
    case 'parallelOctaves': {
      const correct: Bilingual = { he: 'הקולות מאבדים עצמאות ונשמעים כקול אחד', en: 'The voices lose independence and sound like one voice' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'יוצרות דיסוננס חמור', en: 'Creates severe dissonance' },
        { he: 'מחזקות את הבס', en: 'Strengthen the bass' },
        { he: 'מסבכות את הבניה ההרמונית', en: 'Complicate the harmonic structure' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'מדוע יש להימנע מאוקטבות מקבילות בהרמוניה קלאסית?', en: 'Why avoid parallel octaves in classical harmony?' },
        choices, correctIndex,
        explanation: { he: 'אוקטבות מקבילות גורמות לקולות להתמזג לצליל אחד — כך אובדת עצמאות הקולות.', en: 'Parallel octaves cause voices to merge into one sound — thus losing the independence of voices.' },
        theory: THEORY_TEXT,
      }
    }
    case 'closedSpacing': {
      const correct: Bilingual = { he: 'כל התווים בתוך אוקטבה אחת (מלבד הבס)', en: 'All notes within one octave (except the bass)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'תווים מפוזרים על פני שתי אוקטבות', en: 'Notes spread across two octaves' },
        { he: 'כל התווים בפוזיציית שורש', en: 'All notes in root position' },
        { he: 'שימוש בפחות מ-3 קולות', en: 'Using fewer than 3 voices' },
      ])
      return {
        id: uid(), categoryId: 'voice_leading', difficulty: 'hard',
        prompt: { he: 'מהו "Closed Spacing" (ריווח סגור) באקורד?', en: "What is 'closed spacing' in a chord?" },
        choices, correctIndex,
        explanation: { he: 'Closed spacing: שלוש דרגות העליונות בתוך אוקטבה אחת. Open spacing: מפוזרים על פני יותר מאוקטבה.', en: 'Closed spacing: the upper three voices within one octave. Open spacing: spread across more than an octave.' },
        theory: THEORY_TEXT,
      }
    }
  }
}
