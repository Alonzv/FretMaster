import type { Question, Difficulty } from '../types'
import {
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'פולי-ריתם הוא נגינת שני דפוסי קצב שונים בו-זמנית, שאין להם מחנה משותף (כמו 3 נגד 2). מטרים לא-זוגיים כמו 5/4, 7/8 ו-7/4 יוצרים תחושת "כדור מתגלגל" שאינו נופל בנקודות החזרה הצפויות. לתרגול: לדפוק ביד ימין 3 ולשמאל 2 בו-זמנית.',
  en: 'Polyrhythm is the simultaneous use of two conflicting rhythmic patterns with no common beat (like 3 against 2). Odd meters like 5/4, 7/8, and 7/4 create a "rolling ball" sensation that does not land on expected downbeats. Practice by tapping 3 with your right hand and 2 with your left simultaneously.',
}

type EasyShape = 'beats34' | 'beats54' | 'topNumber' | 'bottomNumber' | 'beats78' | 'commonMeter' | 'waltzTime'
type MedShape  = 'count54' | 'group78' | 'whatIsPolyRhythm' | 'threeAgainstTwo' | 'hemiola' | 'syncopation' | 'oddMeterBands'
type HardShape = 'fourThree' | 'grouping338' | 'metricModulation' | 'polyrhythmComposer' | 'whatIsTuplet' | 'crossRhythm' | 'toolTimeSignatures' | 'schismSignature'

export function generatePolyrhythmQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['beats34','beats54','topNumber','bottomNumber','beats78','commonMeter','waltzTime'])
  switch (shape) {
    case 'beats34': {
      const correct = '3'
      const { choices, correctIndex } = buildChoices(correct, ['4','6','2'])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: 'כמה פעימות יש בתיבה של 3/4?', en: 'How many beats are in a bar of 3/4?' },
        choices, correctIndex,
        explanation: { he: '3/4 = 3 פעימות לתיבה, כשהרבע-תו = פעימה אחת.', en: '3/4 = 3 beats per bar, with a quarter note = one beat.' },
        theory: THEORY_TEXT,
      }
    }
    case 'beats54': {
      const correct = '5'
      const { choices, correctIndex } = buildChoices(correct, ['4','6','7'])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: 'כמה פעימות יש בתיבה של 5/4?', en: 'How many beats are in a bar of 5/4?' },
        choices, correctIndex,
        explanation: { he: '5/4 = 5 פעימות לתיבה. נפוץ בג׳אז (Dave Brubeck "Take Five").', en: '5/4 = 5 beats per bar. Common in jazz (Dave Brubeck "Take Five").' },
        theory: THEORY_TEXT,
      }
    }
    case 'topNumber': {
      const correct: Bilingual = { he: 'מספר הפעימות לתיבה', en: 'Number of beats per bar' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אורך התו הבסיסי', en: 'Duration of the basic note' },
        { he: 'הקצב בדקה (BPM)', en: 'The tempo in BPM' },
        { he: 'מספר הצלילים בתיבה', en: 'Number of notes in the bar' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: 'מה פירוש המספר העליון בסימן זמן (time signature)?', en: 'What does the top number in a time signature mean?' },
        choices, correctIndex,
        explanation: { he: 'המספר העליון = כמה פעימות לתיבה. 4/4 = 4 פעימות לתיבה.', en: 'The top number = how many beats per bar. 4/4 = 4 beats per bar.' },
        theory: THEORY_TEXT,
      }
    }
    case 'bottomNumber': {
      const correct: Bilingual = { he: 'הרבע-תו (quarter note) = פעימה אחת', en: 'Quarter note = 1 beat' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שמינית = פעימה אחת', en: 'Eighth note = 1 beat' },
        { he: 'חצי-תו = פעימה אחת', en: 'Half note = 1 beat' },
        { he: 'השלמות לתיבה', en: 'The subdivision count' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: 'מה פירוש המספר 4 בתחתית סימן הזמן 4/4?', en: 'What does the bottom number (4) mean in 4/4?' },
        choices, correctIndex,
        explanation: { he: '4 = רבע-תו. הערך 4 תמיד אומר שהרבע-תו הוא יחידת הפעימה.', en: '4 = quarter note. The value 4 always means the quarter note is the beat unit.' },
        theory: THEORY_TEXT,
      }
    }
    case 'beats78': {
      const correct = '7'
      const { choices, correctIndex } = buildChoices(correct, ['6','8','5'])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: '7/8 = כמה פעימות שמינית?', en: '7/8 means how many eighth-note beats?' },
        choices, correctIndex,
        explanation: { he: '7/8 = 7 שמיניות לתיבה. נפוץ במטאל פרוגרסיבי (Tool) ובמוסיקה עממית בלקנית.', en: '7/8 = 7 eighth notes per bar. Common in progressive metal (Tool) and Balkan folk music.' },
        theory: THEORY_TEXT,
      }
    }
    case 'commonMeter': {
      const correct = '4/4'
      const { choices, correctIndex } = buildChoices(correct, ['3/4','6/8','2/4'])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: 'איזה סימן זמן הכי נפוץ ברוק?', en: 'Which time signature is most common in rock music?' },
        choices, correctIndex,
        explanation: { he: '4/4 נקרא גם "Common Time" — הוא הסימן הנפוץ ביותר ברוק, פופ ורוב הז׳אנרים.', en: '4/4 is also called "Common Time" — it is the most common time signature in rock, pop and most genres.' },
        theory: THEORY_TEXT,
      }
    }
    case 'waltzTime': {
      const correct: Bilingual = { he: 'ולס (Waltz)', en: 'Waltz time' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מארש (March)', en: 'March time' },
        { he: 'פולקה (Polka)', en: 'Polka time' },
        { he: 'ג׳יג (Jig)', en: 'Jig time' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'easy',
        prompt: { he: '3/4 ידוע בשם...?', en: '3/4 is known as?' },
        choices, correctIndex,
        explanation: { he: '3/4 = ולס — שלוש פעימות לתיבה עם הדגש על הפעימה הראשונה.', en: '3/4 = waltz — three beats per bar with emphasis on beat one.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['count54','group78','whatIsPolyRhythm','threeAgainstTwo','hemiola','syncopation','oddMeterBands'])
  switch (shape) {
    case 'count54': {
      const correct = '1-2-3-4-5 (לרוב: 3+2 או 2+3)'
      const { choices, correctIndex } = buildChoices(correct, [
        '1-2-3-4-5 (תמיד: 5 שווים)',
        '1-2-3-4-5 (תמיד: 2+3)',
        '1-2-3-4-5-6 (תשע פעימות)',
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: 'כיצד סופרים 5/4? (כמו "Take Five" של Dave Brubeck)', en: "How would you count 5/4? (like Dave Brubeck's 'Take Five')" },
        choices, correctIndex,
        explanation: { he: '5/4 נסדר לרוב כ-3+2 (1-2-3, 1-2) או 2+3 (1-2, 1-2-3) תלוי בסגנון.', en: '5/4 is usually grouped as 3+2 (1-2-3, 1-2) or 2+3 (1-2, 1-2-3) depending on style.' },
        theory: THEORY_TEXT,
      }
    }
    case 'group78': {
      const correct = '3+2+2 או 2+2+3'
      const { choices, correctIndex } = buildChoices(correct, ['4+3','2+5','1+1+1+1+1+1+1'])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: '7/8 מסודר לרוב לקבוצות של...?', en: '7/8 is often grouped as?' },
        choices, correctIndex,
        explanation: { he: '7/8 = 3+2+2 או 2+2+3 שמיניות — יוצר תחושת אסימטריה.', en: '7/8 = 3+2+2 or 2+2+3 eighth notes — creates an asymmetric feel.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whatIsPolyRhythm': {
      const correct: Bilingual = { he: 'שני קצבים שאין להם מחנה משותף, מנוגנים בו-זמנית', en: 'Two rhythms played simultaneously that do not share a common beat' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שימוש במטר לא-זוגי', en: 'Using an odd time signature' },
        { he: 'שינוי קצב במהלך שיר', en: 'Changing tempo during a song' },
        { he: 'נגינת אקורדים בקצב שונה', en: 'Playing chords at a different rhythm' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: 'מהו "פולי-ריתם"?', en: "What is a 'polyrhythm'?" },
        choices, correctIndex,
        explanation: { he: 'פולי-ריתם = שני קצבים בו-זמנית ללא חפיפה (כמו 3  против 2). האוזן שומעת שניים בו-זמנית.', en: 'Polyrhythm = two simultaneous rhythms with no common beat (like 3 vs 2). The ear perceives both at once.' },
        theory: THEORY_TEXT,
      }
    }
    case 'threeAgainstTwo': {
      const correct: Bilingual = { he: 'קול אחד מנגן 3 תווים בזמן שהשני מנגן 2 באותו פרק זמן', en: 'One voice plays 3 notes while another plays 2 in the same time span' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'נגינה במטר 3/2', en: 'Playing in 3/2 meter' },
        { he: 'שלוש פעימות חזקות נגד שתיים חלשות', en: 'Three strong beats against two weak beats' },
        { he: 'שינוי לפולי-טוניקה', en: 'A shift to polytonality' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: 'מה פירוש פולי-ריתם 3 נגד 2?', en: '3 against 2 polyrhythm means?' },
        choices, correctIndex,
        explanation: { he: '3:2 = קול אחד מנגן שלישיות בזמן שהשני מנגן דואים. נפוץ במוסיקה אפריקאית ולטינית.', en: '3:2 = one voice plays triplets while the other plays duplets. Common in African and Latin music.' },
        theory: THEORY_TEXT,
      }
    }
    case 'hemiola': {
      const correct: Bilingual = { he: 'שלושה תווים מנוגנים בזמן של שניים (3:2)', en: 'Three notes played in the time of two (3:2)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שני תווים מנוגנים בזמן של שלושה', en: 'Two notes played in the time of three' },
        { he: 'שינוי סימן הזמן', en: 'A time signature change' },
        { he: 'סינקופציה על הפעימה החלשה', en: 'Syncopation on the weak beat' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: 'מהי "המיולה" (Hemiola)?', en: "What is a 'hemiola'?" },
        choices, correctIndex,
        explanation: { he: 'המיולה = 3 תווים בזמן של 2 — יוצרת אפקט של האטה לפני קדנצה. נפוצה במוסיקה בארוקית ורנסנסית.', en: 'Hemiola = 3 notes in the time of 2 — creates an effect of slowing before a cadence. Common in Baroque and Renaissance music.' },
        theory: THEORY_TEXT,
      }
    }
    case 'syncopation': {
      const correct: Bilingual = { he: 'הנחת הדגש על הפעימה החלשה (Off-beat)', en: 'Placing emphasis on the off-beat (weak beat)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'הנחת הדגש על הפעימה הראשונה', en: 'Placing emphasis on beat 1' },
        { he: 'שינוי טמפו', en: 'A tempo change' },
        { he: 'שימוש בשלישיות', en: 'Using triplets' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: 'מהי "סינקופציה" ב-4/4?', en: "What is a 'syncopation' in 4/4?" },
        choices, correctIndex,
        explanation: { he: 'סינקופציה = הנחת הדגש על ה-off-beat (1/2 פעימה, 2, 4 וכו׳) — נפוצה ב-funk, jazz ו-reggae.', en: 'Syncopation = emphasis on the off-beat (upbeat, 2, 4, etc.) — common in funk, jazz and reggae.' },
        theory: THEORY_TEXT,
      }
    }
    case 'oddMeterBands': {
      const correct: Bilingual = { he: 'Tool ו-Radiohead', en: 'Tool and Radiohead' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'Metallica ו-AC/DC', en: 'Metallica and AC/DC' },
        { he: 'The Beatles ו-Elvis', en: 'The Beatles and Elvis' },
        { he: 'Nirvana ו-Pearl Jam', en: 'Nirvana and Pearl Jam' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'medium',
        prompt: { he: 'אילו להקות ידועות בשימוש במטרים לא-זוגיים (7/8, 5/4)?', en: "Tool and Radiohead are known for using which time signatures?" },
        choices, correctIndex,
        explanation: { he: 'Tool (Schism, Lateralus) ו-Radiohead (Pyramid Song) ידועים בשימוש במטרים לא-זוגיים מורכבים.', en: 'Tool (Schism, Lateralus) and Radiohead (Pyramid Song) are known for their complex odd meters.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['fourThree','grouping338','metricModulation','polyrhythmComposer','whatIsTuplet','crossRhythm','toolTimeSignatures','schismSignature'])
  switch (shape) {
    case 'fourThree': {
      const correct: Bilingual = { he: '4 תווים מנוגנים בזמן של 3 תווים', en: '4 notes played in the time of 3 notes' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: '3 תווים מנוגנים בזמן של 4 תווים', en: '3 notes played in the time of 4 notes' },
        { he: 'מטר 4/3', en: 'A 4/3 time signature' },
        { he: 'ארבעה קולות שונים מנוגנים בו-זמנית', en: 'Four different voices played simultaneously' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'מהו פולי-ריתם 4:3?', en: 'What is 4:3 polyrhythm?' },
        choices, correctIndex,
        explanation: { he: '4:3 = 4 תווים בזמן של 3. קשה מאוד לנגן — דורש אימון עצמאי של כל יד.', en: '4:3 = 4 notes in the time of 3. Very difficult to play — requires independent training of each hand.' },
        theory: THEORY_TEXT,
      }
    }
    case 'grouping338': {
      const correct = '8/8 עם חלוקה 3+3+2'
      const { choices, correctIndex } = buildChoices(correct, ['7/8 עם חלוקה 2+2+3','5/4 עם חלוקה 3+2','6/8'])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'איזה מטר נשמע כמו "3+3+2" שמיניות?', en: "Which meter feels like '3+3+2' eighth notes?" },
        choices, correctIndex,
        explanation: { he: '8/8 עם חלוקה 3+3+2 — שמינית יחידת הבסיס, אבל חלוקה א-סימטרית. נפוץ בפלמנקו ומוסיקה ספרדית.', en: '8/8 with 3+3+2 grouping — eighth note is the basic unit, but with asymmetric grouping. Common in flamenco.' },
        theory: THEORY_TEXT,
      }
    }
    case 'metricModulation': {
      const correct: Bilingual = { he: 'שימוש בחלוקת תת-יחידה של מטר אחד לקביעת קצב/מטר חדש', en: 'Using a subdivision of one meter to establish a new tempo/meter' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שינוי פתאומי של סימן הזמן', en: 'Sudden change of time signature' },
        { he: 'שינוי קצב באמצעות פדל', en: 'Tempo change via pedal' },
        { he: 'מודולציה הרמונית', en: 'Harmonic modulation' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'מהי "מודולציה מטרית" (metric modulation)?', en: "What is 'metric modulation'?" },
        choices, correctIndex,
        explanation: { he: 'מודולציה מטרית: שלישית (triplet) של המטר הישן הופכת לרבע-תו של המטר החדש — שינוי קצב חלק.', en: 'Metric modulation: a triplet of the old meter becomes a quarter note of the new meter — a smooth tempo change.' },
        theory: THEORY_TEXT,
      }
    }
    case 'polyrhythmComposer': {
      const correct: Bilingual = { he: 'סטרווינסקי ובארטוק', en: 'Stravinsky and Bartók' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'בטהובן ומוצרט', en: 'Beethoven and Mozart' },
        { he: 'שובן וליסט', en: 'Chopin and Liszt' },
        { he: 'בך והנדל', en: 'Bach and Handel' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'אילו מלחינים קלאסיים ידועים בשימוש בפולי-ריתם?', en: 'Which composers are famous for polyrhythm in classical music?' },
        choices, correctIndex,
        explanation: { he: 'סטרווינסקי ("ה-Rite of Spring") ובארטוק ידועים בשימוש נרחב בפולי-ריתם ומטרים מורכבים.', en: 'Stravinsky ("The Rite of Spring") and Bartók are famous for extensive use of polyrhythm and complex meters.' },
        theory: THEORY_TEXT,
      }
    }
    case 'whatIsTuplet': {
      const correct: Bilingual = { he: 'קבוצת תווים המנוגנים בזמן של מספר אחר (שלישייה, חמישייה וכו׳)', en: 'A group of notes played in the time of a different number (triplet, quintuplet, etc.)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שינוי עוצמה פתאומי', en: 'A sudden dynamic change' },
        { he: 'אקורד עם תוספת תו', en: 'A chord with an added note' },
        { he: 'חזרה מקוצרת של מנגינה', en: 'A shortened repetition of a melody' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'מהו "Tuplet"?', en: "What is a 'tuplet'?" },
        choices, correctIndex,
        explanation: { he: 'Tuplet = קבוצת תווים בזמן לא-סטנדרטי. שלישייה = 3 תווים בזמן של 2. חמישייה = 5 תווים בזמן של 4.', en: 'Tuplet = a group of notes in non-standard time. Triplet = 3 notes in the time of 2. Quintuplet = 5 notes in the time of 4.' },
        theory: THEORY_TEXT,
      }
    }
    case 'crossRhythm': {
      const correct: Bilingual = { he: 'קצב שסותר את המטר הקיים', en: 'A rhythm that contradicts the established meter' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'שינוי סימן הזמן', en: 'A time signature change' },
        { he: 'נגינת אקורדים שאינם במפתח', en: 'Playing out-of-key chords' },
        { he: 'חלוקה לשני קצבים שווים', en: 'Division into two equal rhythms' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'מהו "Cross-Rhythm"?', en: "What is a 'cross-rhythm'?" },
        choices, correctIndex,
        explanation: { he: 'Cross-rhythm: דפוס קצב שסותר את ה-downbeat הקיים — יוצר תחושת ניגוד ומתח קצבי.', en: 'Cross-rhythm: a rhythmic pattern that contradicts the established downbeat — creates rhythmic tension and contrast.' },
        theory: THEORY_TEXT,
      }
    }
    case 'toolTimeSignatures': {
      const correct = 'Schism: 5/4, 7/8 ועוד; Lateralus: 9/8, 8/8, 7/8 ועוד'
      const { choices, correctIndex } = buildChoices(correct, [
        'כל השירים ב-4/4',
        'Schism: 3/4 בלבד; Lateralus: 6/8 בלבד',
        'Schism: 7/4 בלבד; Lateralus: 5/4 בלבד',
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'אילו סימני זמן משמשים ב-Schism ו-Lateralus של Tool?', en: "What time signatures does Tool use in 'Schism' and 'Lateralus'?" },
        choices, correctIndex,
        explanation: { he: 'Tool ידועים בשינויים תכופים של סימני זמן — Lateralus משתמש בסיבוב פיבונאצ׳י של 9/8, 8/8, 7/8.', en: "Tool is known for frequent time signature changes — Lateralus uses a Fibonacci rotation of 9/8, 8/8, 7/8." },
        theory: THEORY_TEXT,
      }
    }
    case 'schismSignature': {
      const correct: Bilingual = { he: 'שינויים בין 5/4, 7/8 ומטרים נוספים', en: 'Changes between 5/4, 7/8 and additional meters' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'רק 4/4 לאורך כל השיר', en: 'Only 4/4 throughout the song' },
        { he: 'שינויים בין 3/4 ו-6/8 בלבד', en: 'Changes between 3/4 and 6/8 only' },
        { he: 'שינויים בין 7/4 ו-11/8', en: 'Changes between 7/4 and 11/8' },
      ])
      return {
        id: uid(), categoryId: 'polyrhythm', difficulty: 'hard',
        prompt: { he: 'מה מאפיין מבחינה קצבית את "Schism" של Tool?', en: "What rhythmically characterizes Tool's 'Schism'?" },
        choices, correctIndex,
        explanation: { he: '"Schism" מסתדר בין 5/4 ל-7/8 לאורך השיר — הדבר יוצר תחושת פולי-ריתמית מורכבת.', en: "'Schism' alternates between 5/4 and 7/8 throughout — creating a complex polyrhythmic feel." },
        theory: THEORY_TEXT,
      }
    }
  }
}
