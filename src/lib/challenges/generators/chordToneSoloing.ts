import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'אלתור על תווי אקורד (Chord Tone Soloing) = דגש על שורש, טרצה, קווינטה וספטימה בפעימות חזקות. בניגוד לנגינה סקלרית בלבד, שיטה זו מייצרת קשר ישיר בין המלודיה להרמוניה. תווי Guide (3rd ו-7th) מגדירים את איכות האקורד ולכן הם הכי חשובים.',
  en: 'Chord tone soloing = emphasizing root, 3rd, 5th and 7th on strong beats. Unlike purely scalar playing, this approach creates a direct connection between melody and harmony. Guide tones (3rd and 7th) define the chord quality and are therefore the most important notes to target.',
}

type EasyShape = 'whatIsChordTone' | 'cMajChordTones' | 'g7Arpeggio' | 'whatIsArpeggio' | 'dmTarget' | 'tensionTones' | 'whatIsTarget'
type MedShape  = 'g7Emphasize' | 'amDissonance' | 'insideOutside' | 'guideTone' | 'iiV1Target' | 'enclosure' | 'cmaj7Arpeggio'
type HardShape = 'subArpeggioG7' | 'upperStructure' | 'dm7Tension' | 'approachNotes' | 'horizVsVert' | 'connectArpeggios' | 'bebopSoloing' | 'chordSubSoloing'

export function generateChordToneSoloingQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['whatIsChordTone','cMajChordTones','g7Arpeggio','whatIsArpeggio','dmTarget','tensionTones','whatIsTarget'])
  switch (shape) {
    case 'whatIsChordTone': {
      const correct: Bilingual = { he: 'התווים המרכיבים את האקורד (שורש, 3rd, 5th, 7th)', en: 'The notes that make up a chord (root, 3rd, 5th, 7th)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'תווים מחוץ לאקורד', en: 'Notes outside the chord' },
        { he: 'כל תווי הסולם', en: 'All the scale notes' },
        { he: 'תווי העיטור (grace notes)', en: 'Ornamental notes (grace notes)' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'מהם "תווי אקורד" (chord tones)?', en: "What are 'chord tones'?" },
        choices, correctIndex,
        explanation: { he: 'תווי אקורד = שורש, 3rd, 5th ו-7th (אם קיים) — הם מגדירים את האקורד.', en: 'Chord tones = root, 3rd, 5th and 7th (if present) — they define the chord.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cMajChordTones': {
      const correct = 'C, E, G'
      const { choices, correctIndex } = buildChoices(correct, ['C, D, E','C, E, G, B','C, F, G'])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'מה תווי האקורד של C מז׳ור?', en: 'What are the chord tones of C major?' },
        choices, correctIndex,
        explanation: { he: 'C מז׳ור = C (שורש), E (3rd), G (5th). שלושת תווי הטריאד הבסיסי.', en: 'C major = C (root), E (3rd), G (5th). The three basic triad tones.' },
        theory: THEORY_TEXT,
      }
    }
    case 'g7Arpeggio': {
      const correct = 'G, B, D, F'
      const { choices, correctIndex } = buildChoices(correct, ['G, B, D','G, Bb, D, F','G, B, D, F#'])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'מה התווים של ה-arpeggio של G7?', en: 'What are the notes in the G7 arpeggio?' },
        choices, correctIndex,
        explanation: { he: 'G7 = G (Root), B (3rd), D (5th), F (b7). ה-F הוא הספטימה הקטנה.', en: 'G7 = G (Root), B (3rd), D (5th), F (b7). The F is the minor 7th.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whatIsArpeggio': {
      const correct: Bilingual = { he: 'תווי אקורד מנוגנים בזה אחר זה (לא בו-זמנית)', en: 'Chord notes played sequentially (one after another)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'תווי אקורד מנוגנים בו-זמנית', en: 'Chord notes played simultaneously' },
        { he: 'מנגינה מהירה בצלילים גבוהים', en: 'A fast melody in high notes' },
        { he: 'דפוס ניגון מיוחד לגיטרה', en: 'A special picking pattern for guitar' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'מהו "arpeggio"?', en: "What is an 'arpeggio'?" },
        choices, correctIndex,
        explanation: { he: 'Arpeggio = תווי אקורד מנוגנים בזה אחר זה, לא בו-זמנית. מהמילה האיטלקית "arpa" (נבל).', en: 'Arpeggio = chord notes played one after another, not simultaneously. From Italian "arpa" (harp).' },
        theory: THEORY_TEXT,
      }
    }
    case 'dmTarget': {
      const correct: Bilingual = { he: 'D (שורש) או A (קווינטה)', en: 'D (root) or A (5th)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'F (טרצה) בלבד', en: 'F (3rd) only' },
        { he: 'C (ספטימה)', en: 'C (7th)' },
        { he: 'כל תו בסולם Dm', en: 'Any note in the Dm scale' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'מעל Dm, איזה תו הוא "target" חזק לנחיתה?', en: "What note of Dm is the strongest 'target' to land on over a Dm chord?" },
        choices, correctIndex,
        explanation: { he: 'הנחיתה על D (שורש) או A (5th) מעל Dm נשמעת יציבה ומכוונת.', en: 'Landing on D (root) or A (5th) over Dm sounds stable and intentional.' },
        theory: THEORY_TEXT,
      }
    }
    case 'tensionTones': {
      const correct: Bilingual = { he: 'תווים שאינם תווי האקורד (passing tones)', en: 'Non-chord tones (passing tones)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שורש האקורד', en: 'The root of the chord' },
        { he: 'הקווינטה', en: 'The perfect fifth' },
        { he: 'הטרצה', en: 'The third' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'באלתור על תווי אקורד, אילו תווים יוצרים מתח על האקורד?', en: 'In chord tone soloing, which notes create the most tension over a chord?' },
        choices, correctIndex,
        explanation: { he: 'תווים שאינם תווי האקורד = passing tones — הם יוצרים מתח שנפתר לתווי האקורד.', en: 'Non-chord tones = passing tones — they create tension that resolves to chord tones.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whatIsTarget': {
      const correct: Bilingual = { he: 'תו אקורד שנוחתים עליו בפעימה חזקה', en: 'A chord tone that you resolve to on a strong beat' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'תו הנגנן בעוצמה חזקה', en: 'A note played loudly' },
        { he: 'תו בתוספת וויברטו', en: 'A note with vibrato added' },
        { he: 'תו האחרון במשפט מוסיקלי', en: 'The last note of a musical phrase' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'easy',
        prompt: { he: 'מהו "target note" (תו מטרה)?', en: "What is a 'target note'?" },
        choices, correctIndex,
        explanation: { he: 'Target note = תו אקורד שמגיעים אליו בפעימה חזקה — עוגן הרמוני במשפט המוסיקלי.', en: 'Target note = a chord tone you arrive at on a strong beat — a harmonic anchor in the musical phrase.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['g7Emphasize','amDissonance','insideOutside','guideTone','iiV1Target','enclosure','cmaj7Arpeggio'])
  switch (shape) {
    case 'g7Emphasize': {
      const correct: Bilingual = { he: 'G, B, D, F — בעיקר B ו-F (הטריטון)', en: 'G, B, D, F — especially B and F (the tritone)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'G בלבד (השורש)', en: 'G only (the root)' },
        { he: 'כל תווי סולם G מז׳ור', en: 'All notes of G major scale' },
        { he: 'F ו-D (b7 ו-5th)', en: 'F and D (b7 and 5th)' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'מעל אקורד G7, אילו תווים כדאי להדגיש?', en: 'What chord tones would you emphasize over a G7 chord?' },
        choices, correctIndex,
        explanation: { he: 'מעל G7: B (3rd) ו-F (b7) הם ה-guide tones — הטריטון ביניהם הוא מנוע המתח.', en: 'Over G7: B (3rd) and F (b7) are the guide tones — the tritone between them is the engine of tension.' },
        theory: THEORY_TEXT,
      }
    }
    case 'amDissonance': {
      const correct: Bilingual = { he: 'b2 (Bb)', en: 'b2 (Bb)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'b7 (G)', en: 'b7 (G)' },
        { he: 'b3 (C)', en: 'b3 (C)' },
        { he: '#5 (F)', en: '#5 (F)' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'מעל Am, איזו דרגה יוצרת את הדיסוננס החזק ביותר?', en: 'Over an Am chord, which scale degree creates the strongest dissonance?' },
        choices, correctIndex,
        explanation: { he: 'ה-b2 (Bb מעל Am) הוא מרווח חצי-טון מהשורש — הדיסוננס החד ביותר.', en: 'The b2 (Bb over Am) is a half step from the root — the sharpest dissonance.' },
        theory: THEORY_TEXT,
      }
    }
    case 'insideOutside': {
      const correct: Bilingual = { he: 'Inside = בתוך המפתח; Outside = תווים כרומטיים/לא-דיאטוניים', en: 'Inside = within the key; Outside = chromatic/non-diatonic notes' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'Inside = נגינה בפנים הגיטרה; Outside = נגינה בחוץ', en: 'Inside = playing inside the guitar; Outside = playing outside' },
        { he: 'Inside = פנטטוני; Outside = סולם מז׳ורי', en: 'Inside = pentatonic; Outside = major scale' },
        { he: 'Inside = אקורדים; Outside = מלודיה', en: 'Inside = chords; Outside = melody' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'מה ההבדל בין נגינה "Inside" ל-"Outside"?', en: "What is the difference between 'inside' and 'outside' playing?" },
        choices, correctIndex,
        explanation: { he: 'Inside = דיאטוני, בתוך המפתח. Outside = כרומטי, מחוץ למפתח — יוצר מתח שנפתר חזרה ל-Inside.', en: 'Inside = diatonic, within the key. Outside = chromatic, beyond the key — creates tension that resolves back inside.' },
        theory: THEORY_TEXT,
      }
    }
    case 'guideTone': {
      const correct: Bilingual = { he: 'הטרצה (3rd) והספטימה (7th) — מגדירים את איכות האקורד', en: 'The 3rd and 7th of a chord — they define its quality' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'השורש והקווינטה — הכי יציבים', en: 'The root and 5th — most stable' },
        { he: 'הרביעית והשישית — הכי צבעוניים', en: 'The 4th and 6th — most colorful' },
        { he: 'ה-9th וה-11th — המתחים', en: 'The 9th and 11th — the tensions' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'מהם "guide tones" (תווי מדריך)?', en: "What is a 'guide tone'?" },
        choices, correctIndex,
        explanation: { he: 'Guide tones = 3rd ו-7th. הם מגדירים את "מז׳ור/מינור" ו"דומיננטי/מז׳ורי" של האקורד.', en: 'Guide tones = 3rd and 7th. They define the "major/minor" and "dominant/major" quality of the chord.' },
        theory: THEORY_TEXT,
      }
    }
    case 'iiV1Target': {
      const correct: Bilingual = { he: 'E ו-G (3rd ו-5th של C מז׳ור)', en: 'E and G (3rd and 5th of C major)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'C (שורש) בלבד', en: 'C (root) only' },
        { he: 'F ו-A (תווי Dm)', en: 'F and A (notes of Dm)' },
        { he: 'B ו-D (תווי G7)', en: 'B and D (notes of G7)' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'ב-ii-V-I ב-C מז׳ור, אילו תווי אקורד לכוון אליהם ברגע הפתרון (I)?', en: 'Over a ii-V-I in C, what chord tones should you target at the resolution (I)?' },
        choices, correctIndex,
        explanation: { he: 'ביחידת ה-I (C מז׳ור): נחיתה על E (3rd) ו-G (5th) נשמעת חזקה ומוסיקלית.', en: 'At the I chord (C major): landing on E (3rd) and G (5th) sounds strong and musical.' },
        theory: THEORY_TEXT,
      }
    }
    case 'enclosure': {
      const correct: Bilingual = { he: 'כליאת תו מטרה בין שתי שכנותיו הכרומטיות (מלמעלה ומלמטה)', en: 'Surrounding a target note with its chromatic neighbors above and below' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'נגינת כל תווי האוקטבה', en: 'Playing all notes of the octave' },
        { he: 'כליאת אקורד בתוך אחר', en: 'Enclosing one chord within another' },
        { he: 'נגינה מחוץ לגבולות הגיטרה', en: 'Playing beyond the guitar range' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'מהי טכניקת "enclosure" (כליאה) באלתור ג׳אז?', en: "What is 'enclosure' in jazz soloing?" },
        choices, correctIndex,
        explanation: { he: 'Enclosure: לפני תו המטרה C, מנגנים D ו-Cb (חצי-טון מלמעלה וחצי-טון מלמטה) — אחר כך נוחתים על C.', en: 'Enclosure: before target note C, play D and Cb (half step above and below) — then land on C.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cmaj7Arpeggio': {
      const correct = 'C, E, G, B'
      const { choices, correctIndex } = buildChoices(correct, ['C, E, G, Bb','C, Eb, G, B','C, E, G, A'])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'medium',
        prompt: { he: 'מה תווי ה-arpeggio מעל Cmaj7?', en: 'Which arpeggio do you use over Cmaj7?' },
        choices, correctIndex,
        explanation: { he: 'Cmaj7 = C (Root), E (3rd), G (5th), B (maj7). ה-B הוא הספטימה הגדולה.', en: 'Cmaj7 = C (Root), E (3rd), G (5th), B (maj7). The B is the major 7th.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['subArpeggioG7','upperStructure','dm7Tension','approachNotes','horizVsVert','connectArpeggios','bebopSoloing','chordSubSoloing'])
  switch (shape) {
    case 'subArpeggioG7': {
      const correct: Bilingual = { he: 'Bdim7 — מכיל את הטריטון של G7 (B ו-F)', en: 'Bdim7 — contains the tritone of G7 (B and F)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'Dm7 — מינורי ורך', en: 'Dm7 — minor and soft' },
        { he: 'C מז׳ור — ה-I', en: 'C major — the I chord' },
        { he: 'Em7 — מינורי עם #4', en: 'Em7 — minor with #4' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'באלתור על תחליפי אקורד (chord substitution), מה ה-arpeggio שמנגנים מעל G7?', en: "In 'chord substitution soloing', what arpeggio can you play over G7?" },
        choices, correctIndex,
        explanation: { he: 'Bdim7 מעל G7: B-D-F-Ab מכיל את ה-guide tones של G7 (B ו-F) — מרחיב את הצבע.', en: 'Bdim7 over G7: B-D-F-Ab contains the guide tones of G7 (B and F) — expands the color.' },
        theory: THEORY_TEXT,
      }
    }
    case 'upperStructure': {
      const correct: Bilingual = { he: 'נגינת טריאד ממקור אחר מעל אקורד, ליצירת הרחבות', en: 'Playing a triad from a different root over a chord to create extensions' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'נגינת שני אקורדים בו-זמנית', en: 'Playing two chords simultaneously' },
        { he: 'נגינה בעצמה גבוהה', en: 'Playing at high volume' },
        { he: 'שימוש בנוטות גבוהות בלבד', en: 'Using only high-register notes' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'מהי "Upper Structure Triad" (טריאד מבנה עליון)?', en: "What is 'upper structure triads'?" },
        choices, correctIndex,
        explanation: { he: 'Upper structure: מנגנים טריאד שמוסיף 9th, #11th או 13th לאקורד בסיס — צבע ג׳אזי/מורכב.', en: 'Upper structure: playing a triad that adds 9th, #11th or 13th to a base chord — jazzy/complex color.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dm7Tension': {
      const correct: Bilingual = { he: 'Eb (b2) ו-Bb (b6)', en: 'Eb (b2) and Bb (b6)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'A (5th) ו-C (7th)', en: 'A (5th) and C (7th)' },
        { he: 'D (שורש) ו-F (3rd)', en: 'D (root) and F (3rd)' },
        { he: 'G (4th) ו-E (M2)', en: 'G (4th) and E (M2)' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'מעל Dm7, אילו תווים יוצרים את המתח הגבוה ביותר?', en: 'Over Dm7, what notes create the most tension?' },
        choices, correctIndex,
        explanation: { he: 'מעל Dm7: Eb (b2 — חצי-טון מהשורש) ו-Bb (b6) הם הכי דיסוננטיים.', en: 'Over Dm7: Eb (b2 — half step from root) and Bb (b6) are the most dissonant.' },
        theory: THEORY_TEXT,
      }
    }
    case 'approachNotes': {
      const correct: Bilingual = { he: 'תווים חצי-טון או טון מעל/מתחת לתו המטרה, המובילים אליו', en: 'Notes a half step or whole step above/below a chord tone to lead into it' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'תווים רחוקים מהמטרה', en: 'Notes far from the target' },
        { he: 'נגינת שתי אוקטבות בו-זמנית', en: 'Playing two octaves simultaneously' },
        { he: 'תווי אקורד מנוגנים בסדר הפוך', en: 'Chord tones played in reverse order' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'מהי טכניקת "approach notes" (תווי גישה)?', en: "What is the 'approach notes' technique?" },
        choices, correctIndex,
        explanation: { he: 'Approach notes: לפני D מנגנים D# (כרומטי מלמעלה) — יוצר מתח ומכוון ל-D.', en: 'Approach notes: before D, play D# (chromatic from above) — creates tension and directs to D.' },
        theory: THEORY_TEXT,
      }
    }
    case 'horizVsVert': {
      const correct: Bilingual = { he: 'אופקי = סקלרי (ריצה בסולם); אנכי = arpeggio (תווי אקורד)', en: 'Horizontal = scalar (running scales); Vertical = arpeggio-based (chord tones)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אופקי = לנגן ימינה על הצוואר; אנכי = מיתרים', en: 'Horizontal = playing right on the neck; Vertical = strings' },
        { he: 'אופקי = ריתם; אנכי = מלודיה', en: 'Horizontal = rhythm; Vertical = melody' },
        { he: 'אין הבדל', en: 'No difference' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'מה ההבדל בין אלתור "אופקי" ל"אנכי"?', en: "What is the difference between 'horizontal' and 'vertical' soloing?" },
        choices, correctIndex,
        explanation: { he: 'אופקי = ריצה בסולם (כל תווי הסולם). אנכי = הדגשת תווי האקורד (arpeggio). הטוב ביותר = שילוב.', en: 'Horizontal = scalar runs (all scale notes). Vertical = emphasizing chord tones (arpeggio). Best = combination.' },
        theory: THEORY_TEXT,
      }
    }
    case 'connectArpeggios': {
      const correct: Bilingual = { he: 'מוצאים תווים משותפים ועוברים בצעדים לאורך פרוגרסיה', en: 'Find common tones and move by step between arpeggios' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מנגנים כל arpeggio במלואו לפני המעבר', en: 'Play each arpeggio fully before transitioning' },
        { he: 'עוברים בקפיצה לאוקטבה הבאה', en: 'Jump to the next octave' },
        { he: 'מנגנים רק את השורש של כל אקורד', en: 'Play only the root of each chord' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'כיצד מחברים arpeggios חלק ב-I-VI-II-V?', en: 'Over a I-VI-II-V progression, how do you connect the arpeggios smoothly?' },
        choices, correctIndex,
        explanation: { he: 'מוצאים תווים משותפים בין האקורדים ועוברים בצעדים קטנים — voice leading מוסיקלי בין arpeggios.', en: 'Find shared notes between chords and move by small steps — musical voice leading between arpeggios.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bebopSoloing': {
      const correct: Bilingual = { he: 'שימוש נרחב בתווי אקורד ובתווי גישה כרומטיים בטמפו מהיר', en: 'Heavy use of chord tones and chromatic approach notes at fast tempos' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שימוש בסולם פנטטוני בלבד', en: 'Using only the pentatonic scale' },
        { he: 'שימוש בווולום נמוך ומלנכולי', en: 'Using low volume and melancholy' },
        { he: 'אלתור על אקורדים מינוריים בלבד', en: 'Soloing over minor chords only' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'מה מאפיין אלתור "Bebop"?', en: "What is 'bebop soloing'?" },
        choices, correctIndex,
        explanation: { he: 'Bebop: תווי אקורד + תווי גישה כרומטיים בטמפו מהיר. פרקר, גילספי וגורדון = דוגמאות קלאסיות.', en: 'Bebop: chord tones + chromatic approach notes at fast tempos. Parker, Gillespie and Gordon = classic examples.' },
        theory: THEORY_TEXT,
      }
    }
    case 'chordSubSoloing': {
      const correct: Bilingual = { he: 'מנגנים arpeggio של אקורד אחר מעל האקורד הנוכחי', en: 'Playing the arpeggio of a different chord over the current chord' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מחליפים את האקורד לגמרי', en: 'Completely replacing the chord' },
        { he: 'מנגנים בסולם אחר', en: 'Playing in a different scale' },
        { he: 'מוסיפים תווים כרומטיים אקראיים', en: 'Adding random chromatic notes' },
      ])
      return {
        id: uid(), categoryId: 'chord_soloing', difficulty: 'hard',
        prompt: { he: 'מהי "Chord Substitution Soloing" (אלתור תחליפי אקורד)?', en: "What is 'chord substitution soloing'?" },
        choices, correctIndex,
        explanation: { he: 'אלתור תחליפי = מנגן Bdim7 arpeggio מעל G7 — מרחיב את הצבע תוך שמירה על הפונקציה.', en: 'Substitution soloing = playing Bdim7 arpeggio over G7 — expands the color while maintaining the function.' },
        theory: THEORY_TEXT,
      }
    }
  }
}
