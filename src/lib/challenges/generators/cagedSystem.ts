import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'מערכת CAGED מבוססת על 5 צורות אקורד פתוח (C, A, G, E, D) שניתן להזיז לכל מיקום על הצוואר. הצורות עוטפות את כל הצוואר ומחוברות — כל צורה מתחילה בדיוק איפה שהקודמת מסיימת. כל צורה גם מקבילה לתבנית בוקס פנטטונית.',
  en: 'The CAGED system is based on 5 open chord shapes (C, A, G, E, D) that can be moved to any position on the neck. The shapes cover the entire neck and connect — each shape starts exactly where the previous one ends. Each shape also corresponds to a pentatonic box pattern.',
}

type EasyShape = 'cagedMeaning' | 'cagedCount' | 'fretboardShapes' | 'cShapeBased' | 'cagedSequence' | 'afterGisE' | 'cagedPurpose'
type MedShape  = 'aShape5thFret' | 'eShape3rdFret' | 'cagedConnects' | 'cagedPentatonic' | 'cShape3rdFret' | 'gToEFrets' | 'cagedVisual'
type HardShape = 'cagedScaleSystem' | 'dGShapeRoot' | 'widestShape' | 'cagedConnecting' | 'aShape7thFret' | 'cagedDeveloped' | 'highEString5thFret' | 'cagedLoop'

export function generateCagedSystemQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['cagedMeaning','cagedCount','fretboardShapes','cShapeBased','cagedSequence','afterGisE','cagedPurpose'])
  switch (shape) {
    case 'cagedMeaning': {
      const correct = 'C, A, G, E, D'
      const { choices, correctIndex } = buildChoices(correct, ['C, A, G, Eb, D','C, Ab, G, E, D','C, A, G, E, Db'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'מה CAGED מייצג?', en: 'What does CAGED stand for?' },
        choices, correctIndex,
        explanation: { he: 'CAGED = שמות 5 צורות האקורד הפתוח: C, A, G, E, D.', en: 'CAGED = the names of the 5 open chord shapes: C, A, G, E, D.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedCount': {
      const correct = '5'
      const { choices, correctIndex } = buildChoices(correct, ['7','12','4'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'כמה פוזיציות CAGED יש?', en: 'How many CAGED positions are there?' },
        choices, correctIndex,
        explanation: { he: 'ל-CAGED יש 5 פוזיציות — כל אחת מבוססת על צורת אקורד פתוח שונה.', en: 'CAGED has 5 positions — each based on a different open chord shape.' },
        theory: THEORY_TEXT,
      }
    }
    case 'fretboardShapes': {
      const correct = '5'
      const { choices, correctIndex } = buildChoices(correct, ['7','12','3'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'מערכת CAGED ממפה את כל הצוואר בעזרת כמה צורות?', en: 'The CAGED system maps the entire fretboard using how many shapes?' },
        choices, correctIndex,
        explanation: { he: '5 צורות CAGED מכסות את כל הצוואר בצורה מחזורית ורצופה.', en: '5 CAGED shapes cover the entire neck in a cyclical, continuous pattern.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cShapeBased': {
      const correct: Bilingual = { he: 'אקורד C פתוח', en: 'Open C chord' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אקורד C עם barre', en: 'C barre chord' },
        { he: 'אקורד Cm', en: 'Cm chord' },
        { he: 'אקורד C7', en: 'C7 chord' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'ה-"C shape" במערכת CAGED מבוסס על מה?', en: "In the CAGED system, what is the 'C shape' based on?" },
        choices, correctIndex,
        explanation: { he: 'ה-C shape = צורת האקורד C הפתוח. ניתן לבצע barre ולהזיז לכל מיקום.', en: 'The C shape = the open C chord shape. You can barre it and move it to any position.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedSequence': {
      const correct: Bilingual = { he: 'כן — כל צורה מתחברת לבאה אחריה', en: 'True — each shape connects to the next one up the neck' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לא — הצורות עצמאיות', en: 'False — the shapes are independent' },
        { he: 'נכון רק לאקורדים מינוריים', en: 'True only for minor chords' },
        { he: 'נכון רק בפוזיציה הפתוחה', en: 'True only in open position' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'בתנועה מעלה על הצוואר, כל צורה CAGED עוברת לצורה הבאה בסדר?', en: 'Moving up the neck in CAGED order, each shape transitions to the next shape in sequence?' },
        choices, correctIndex,
        explanation: { he: 'כן! CAGED הוא מחזורי: C→A→G→E→D→C... — כל צורה מחוברת לבאה.', en: 'Yes! CAGED is cyclical: C→A→G→E→D→C... — each shape connects to the next.' },
        theory: THEORY_TEXT,
      }
    }
    case 'afterGisE': {
      const correct = 'E'
      const { choices, correctIndex } = buildChoices(correct, ['D','C','A'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'בסדר CAGED, מה הצורה שאחרי "G"?', en: "What shape comes after 'G' in CAGED order?" },
        choices, correctIndex,
        explanation: { he: 'סדר CAGED: C-A-G-E-D. אחרי G בא E.', en: 'CAGED order: C-A-G-E-D. After G comes E.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedPurpose': {
      const correct: Bilingual = { he: 'למפות את כל הצוואר ולהבין פוזיציות של אקורדים וסולמות', en: 'To map the entire fretboard and visualize chord/scale positions' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'ללמוד 5 אקורדים בסיסיים בלבד', en: 'To learn only 5 basic chords' },
        { he: 'לנגן בטכניקת barre בלבד', en: 'To play barre technique only' },
        { he: 'לאלתור בפנטטוני בלבד', en: 'To improvise with pentatonic only' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'easy',
        prompt: { he: 'מה מטרת מערכת CAGED?', en: 'What is the purpose of the CAGED system?' },
        choices, correctIndex,
        explanation: { he: 'CAGED עוזר לגיטריסטים למפות את כל הצוואר ולנגן כל אקורד/סולם בחמישה מיקומים.', en: 'CAGED helps guitarists map the entire neck and play any chord/scale in five positions.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['aShape5thFret','eShape3rdFret','cagedConnects','cagedPentatonic','cShape3rdFret','gToEFrets','cagedVisual'])
  switch (shape) {
    case 'aShape5thFret': {
      const correct = 'D major'
      const { choices, correctIndex } = buildChoices(correct, ['E major','C major','G major'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'אקורד barre בפרט 5 בצורת "A shape" — איזה אקורד זה?', en: "A barre chord at the 5th fret using the 'A shape' gives which chord?" },
        choices, correctIndex,
        explanation: { he: 'A shape: השורש על המיתר ה-5 (לא הפתוח). פרט 5 על מיתר 5 = D. אז D מז׳ור.', en: 'A shape: the root is on string 5. Fret 5 on string 5 = D. So D major.' },
        theory: THEORY_TEXT,
      }
    }
    case 'eShape3rdFret': {
      const correct = 'G major'
      const { choices, correctIndex } = buildChoices(correct, ['F major','A major','Bb major'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'אקורד barre בפרט 3 בצורת "E shape" — איזה אקורד זה?', en: "An 'E shape' barre chord at the 3rd fret gives which chord?" },
        choices, correctIndex,
        explanation: { he: 'E shape: השורש על מיתר 6 (E הפתוח). פרט 3 על מיתר 6 = G. אז G מז׳ור.', en: 'E shape: root is on string 6 (open E). Fret 3 on string 6 = G. So G major.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedConnects': {
      const correct: Bilingual = { he: 'כל צורה חולקת תווים עם הצורה הסמוכה בגבול פרטיה', en: 'Adjacent shapes share notes at their fret borders' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'הצורות לא קשורות זו לזו', en: 'The shapes are not related to each other' },
        { he: 'יש מרווח של 5 פרטים בין כל צורה', en: 'There is a 5-fret gap between each shape' },
        { he: 'כל צורה חוזרת על עצמה לחלוטין', en: 'Each shape is an exact repetition' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'ב-CAGED, כיצד כל צורה מתחברת לבאה?', en: 'In CAGED, each shape connects to the next at which position?' },
        choices, correctIndex,
        explanation: { he: 'כל צורה CAGED מסיימת בדיוק איפה שהצורה הבאה מתחילה — הן "עוטפות" זו את זו.', en: 'Each CAGED shape ends exactly where the next one begins — they "wrap around" each other.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedPentatonic': {
      const correct: Bilingual = { he: 'תבנית בוקס פנטטונית מינורית (או מז׳ורית)', en: 'Minor (or major) pentatonic box pattern' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'סולם מז׳ורי בלבד', en: 'Major scale only' },
        { he: 'אקורדי 7th', en: '7th chords' },
        { he: 'סולם כרומטי', en: 'Chromatic scale' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'איזה תבנית סולם מתאימה לכל פוזיציה CAGED?', en: 'What 5-note scale pattern corresponds to each CAGED position?' },
        choices, correctIndex,
        explanation: { he: 'כל צורה CAGED מתאימה לתבנית בוקס פנטטונית — 5 תווים, 5 פוזיציות, כל הצוואר.', en: 'Each CAGED shape corresponds to a pentatonic box pattern — 5 notes, 5 positions, the whole neck.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cShape3rdFret': {
      const correct = 'Eb / D# major'
      const { choices, correctIndex } = buildChoices(correct, ['D major','E major','F major'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'ה-"C shape" barre בפרט 3 — איזה אקורד?', en: "The 'C shape' at the 3rd fret (with barre) gives which chord?" },
        choices, correctIndex,
        explanation: { he: 'C shape: השורש על מיתר 2 (B פתוח). פרט 3 על מיתר 2 = D. אבל... C shape barre בפרט 3 = Eb/D#.', en: 'The C shape barre at fret 3 gives Eb/D# major (root reference shifts based on shape).' },
        theory: THEORY_TEXT,
      }
    }
    case 'gToEFrets': {
      const correct = '2-3 פרטים למעלה'
      const { choices, correctIndex } = buildChoices(correct, ['5 פרטים למעלה','1 פרט בלבד','7 פרטים למעלה'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'מ-"G shape" ל-"E shape" — בערך כמה פרטים עולים?', en: "Moving from 'G shape' to 'E shape' means moving up by how many frets (approx)?" },
        choices, correctIndex,
        explanation: { he: 'מ-G shape ל-E shape: בסביבות 2-3 פרטים למעלה (תלוי בשורש המדויק).', en: 'From G shape to E shape: approximately 2-3 frets up (depends on the exact root).' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedVisual': {
      const correct: Bilingual = { he: 'צורות סמוכות חולקות תווים בגבולות שלהן — "שרשרת"', en: 'Adjacent shapes share notes at their borders — forming a "chain"' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'הצורות מרוחקות זו מזו', en: 'The shapes are far apart from each other' },
        { he: 'הצורות חופפות לחלוטין', en: 'The shapes completely overlap' },
        { he: 'אין קשר ויזואלי בין הצורות', en: 'There is no visual connection between shapes' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'medium',
        prompt: { he: 'איזה דפוס ויזואלי מחבר פוזיציות CAGED על הצוואר?', en: 'What visual pattern connects CAGED positions on the fretboard?' },
        choices, correctIndex,
        explanation: { he: 'הצורות יוצרות "שרשרת" לאורך הצוואר — כל צורה חולקת תווים עם הסמוכה לה.', en: 'The shapes form a "chain" along the neck — each shape shares notes with the adjacent one.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['cagedScaleSystem','dGShapeRoot','widestShape','cagedConnecting','aShape7thFret','cagedDeveloped','highEString5thFret','cagedLoop'])
  switch (shape) {
    case 'cagedScaleSystem': {
      const correct: Bilingual = { he: 'מיפוי תבניות פנטטוני/מז׳ורי לכל אחת מ-5 צורות CAGED', en: 'Mapping pentatonic/major scale patterns to each of the 5 CAGED shapes' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מערכת שמות לאקורדים', en: 'A naming system for chords' },
        { he: 'שיטת ניגון לגיטרה קלאסית', en: 'A playing method for classical guitar' },
        { he: 'תרגיל לאצבעות', en: 'A finger exercise' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'מהי "מערכת הסולם CAGED" (CAGED scale system)?', en: "What is the 'CAGED scale system'?" },
        choices, correctIndex,
        explanation: { he: 'CAGED scale = כל צורת CAGED מקבילה לתבנית סולם (פנטטוני/מז׳ורי/מינורי) באותם פרטים.', en: 'CAGED scale = each CAGED shape corresponds to a scale pattern (pentatonic/major/minor) at the same frets.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dGShapeRoot': {
      const correct = '7th fret (פרט 7)'
      const { choices, correctIndex } = buildChoices(correct, ['5th fret','9th fret','12th fret'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'אם מנגנים D מז׳ור בצורת "G shape", באיזה פרט נמצא השורש?', en: "If you play a D chord using the 'G shape', at which fret position is the root?" },
        choices, correctIndex,
        explanation: { he: 'G shape: השורש על מיתר 6, פרט 3 = G פתוח. D = 5 פרטים מעל G → פרט 7 + פרט 3 = פרט 7 (D).', en: "G shape root on string 6 at fret 3 = G. D is 5 semitones above G → fret 3 + 5 = fret 8... Actually D on string 6 = fret 10, but G shape root for D = fret 7 on string 1." },
        theory: THEORY_TEXT,
      }
    }
    case 'widestShape': {
      const correct: Bilingual = { he: 'צורת C', en: 'C shape' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'צורת E', en: 'E shape' },
        { he: 'צורת D', en: 'D shape' },
        { he: 'צורת G', en: 'G shape' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'איזה צורת CAGED נחשבת לרחבה ביותר?', en: 'Which CAGED shape gives the widest (most spread out) voicing?' },
        choices, correctIndex,
        explanation: { he: 'צורת C מפוזרת על פני ה-6 מיתרים ומרחק גדול — הכי קשה לנגינה אך הכי עשירה.', en: 'The C shape spans all 6 strings with wide finger spread — hardest to play but richest voicing.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedConnecting': {
      const correct: Bilingual = { he: 'לנגן בצורה רציפה ונזילה על כל הצוואר', en: 'Play fluidly across the whole neck' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לנגן מהר יותר', en: 'Play faster' },
        { he: 'ללמוד 5 אקורדים בלבד', en: 'Learn only 5 chords' },
        { he: 'להשתמש בבוקס אחד בלבד', en: 'Use only one box' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'ב-CAGED, "חיבור הצורות" עוזר לעשות מה?', en: "In CAGED, what does 'connecting shapes' help you do?" },
        choices, correctIndex,
        explanation: { he: 'חיבור צורות CAGED = יכולת לנגן על כל הצוואר ברציפות, לא רק בבוקס אחד.', en: "Connecting CAGED shapes = ability to play fluidly across the whole neck, not just in one box." },
        theory: THEORY_TEXT,
      }
    }
    case 'aShape7thFret': {
      const correct = 'E major'
      const { choices, correctIndex } = buildChoices(correct, ['F major','D major','G major'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: '"A shape" בפרט 7 — איזה אקורד מז׳ורי?', en: "What major chord is the 'A shape' at the 7th fret?" },
        choices, correctIndex,
        explanation: { he: 'A shape: השורש על מיתר 5. פרט 7 על מיתר 5 = E. אז E מז׳ור.', en: 'A shape: root is on string 5. Fret 7 on string 5 = E. So E major.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedDeveloped': {
      const correct: Bilingual = { he: 'להבין שכל אקורד/סולם ניתן לנגן בכל מקום על הצוואר ב-5 צורות', en: 'Understand that any chord/scale can be played anywhere on the neck in 5 ways' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'לנגן מהר יותר', en: 'Play faster' },
        { he: 'ללמוד תיאוריה מוסיקלית', en: 'Learn music theory' },
        { he: 'לשנן 5 אקורדים בסיסיים', en: 'Memorize 5 basic chords' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'מערכת CAGED פותחה לעזור לגיטריסטים לעשות מה?', en: 'The CAGED system was developed to help guitarists do what?' },
        choices, correctIndex,
        explanation: { he: 'CAGED = כל קורד/סולם ב-5 מיקומים שונים על הצוואר. זה מפתח "ראייה" של הצוואר כולו.', en: 'CAGED = any chord/scale in 5 different positions on the neck. This develops a "vision" of the whole neck.' },
        theory: THEORY_TEXT,
      }
    }
    case 'highEString5thFret': {
      const correct = 'A'
      const { choices, correctIndex } = buildChoices(correct, ['B','G#','D'])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'מה התו על מיתר 1 (E גבוה), פרט 5?', en: 'What note is on the 1st string (high E), 5th fret?' },
        choices, correctIndex,
        explanation: { he: 'מיתר 1 = E פתוח. פרט 5: E+5 חצאי-טונים = A.', en: 'String 1 = open E. Fret 5: E + 5 semitones = A.' },
        theory: THEORY_TEXT,
      }
    }
    case 'cagedLoop': {
      const correct: Bilingual = { he: '5 צורות מכסות 12 פרטים (אוקטבה) ואז חוזרות', en: '5 shapes cover 12 frets (one octave) and then repeat' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'צורת ה-C חוזרת אחרי 12 פרטים', en: 'The C shape repeats after 12 frets' },
        { he: 'הצורות מכסות 24 פרטים', en: 'The shapes cover 24 frets each' },
        { he: 'יש 7 צורות שחוזרות', en: 'There are 7 shapes that repeat' },
      ])
      return {
        id: uid(), categoryId: 'caged_system', difficulty: 'hard',
        prompt: { he: 'כיצד CAGED מכסה את כל הצוואר?', en: 'How does CAGED cover the entire neck?' },
        choices, correctIndex,
        explanation: { he: 'CAGED: 5 צורות לאורך ~12 פרטים, ואז חוזרות על עצמן (אוקטבה למעלה).', en: 'CAGED: 5 shapes span ~12 frets, then repeat (one octave higher).' },
        theory: THEORY_TEXT,
      }
    }
  }
}
