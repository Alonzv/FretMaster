import type { Question, Difficulty } from '../types'
import { randomOf, buildBilingualChoices, uid } from '../musicTheory'

// Blues genre theory questions
// Easy:   12-bar form, I-IV-V, dominant 7ths, blues scale basics
// Medium: quick-change, turnarounds, blue notes, minor pentatonic vs blues scale
// Hard:   tritone sub, jazz-blues, rhythm changes, chord substitutions

interface QTemplate {
  prompt: { he: string; en: string }
  correct: { he: string; en: string }
  distractors: { he: string; en: string }[]
  explanation: { he: string; en: string }
  theory: { he: string; en: string }
}

const EASY: QTemplate[] = [
  {
    prompt: { he: 'כמה תיבות יש בפרוגרסיית הבלוז הסטנדרטית?', en: 'How many bars are in a standard blues progression?' },
    correct: { he: '12', en: '12' },
    distractors: [{ he: '8', en: '8' }, { he: '16', en: '16' }, { he: '4', en: '4' }],
    explanation: { he: 'הבלוז הסטנדרטי הוא פרוגרסיית 12 תיבות — הבסיס של מוסיקת הבלוז.', en: 'Standard blues is a 12-bar progression — the foundation of blues music.' },
    theory: { he: 'פרוגרסיית 12-בר הבלוז: 4 תיבות על I, 2 על IV, 2 על I, 1 על V, 1 על IV, 2 על I. בסולם C: C7-C7-C7-C7-F7-F7-C7-C7-G7-F7-C7-C7.', en: 'The 12-bar blues: 4 bars on I, 2 on IV, 2 on I, 1 on V, 1 on IV, 2 on I. In C: C7-C7-C7-C7-F7-F7-C7-C7-G7-F7-C7-C7.' },
  },
  {
    prompt: { he: 'איזה סוג של אקורד הוא הבסיס של הבלוז?', en: 'What type of chord is the foundation of blues harmony?' },
    correct: { he: 'אקורד דומיננט 7 (dominant 7th)', en: 'Dominant 7th chord' },
    distractors: [{ he: 'אקורד מז׳ור', en: 'Major chord' }, { he: 'אקורד מינור 7', en: 'Minor 7th chord' }, { he: 'אקורד מז׳ור 7', en: 'Major 7th chord' }],
    explanation: { he: 'בבלוז, כל האקורדים (I, IV, V) הם בדרך כלל אקורדי דומיננט 7. זה יוצר את הצליל החם והמלוחלח האופייני.', en: 'In blues, all chords (I, IV, V) are typically dominant 7th chords. This creates the characteristic warm and gritty sound.' },
    theory: { he: 'הדומיננט 7 בנוי מ-4 תווים: 1-3-5-♭7. למשל: C7 = C-E-G-B♭. הספטימה המוורדת (♭7) יוצרת את המתח שמאפיין את הבלוז.', en: 'A dominant 7th has 4 notes: 1-3-5-♭7. E.g., C7 = C-E-G-B♭. The flatted 7th creates the tension characteristic of blues.' },
  },
  {
    prompt: { he: 'איזה סולם משמש בדרך כלל לאימפרוביזציה בבלוז?', en: 'Which scale is most commonly used for blues improvisation?' },
    correct: { he: 'סולם הבלוז', en: 'Blues scale' },
    distractors: [{ he: 'סולם מז׳ור', en: 'Major scale' }, { he: 'סולם הרמוני מינור', en: 'Harmonic minor scale' }, { he: 'מצב דוריאן', en: 'Dorian mode' }],
    explanation: { he: 'סולם הבלוז = פנטטוני מינור + "תו הבלוז" (♭5). 6 תווים שמספקים את הצליל הבלואזי האייקוני.', en: 'The blues scale = minor pentatonic + the "blue note" (♭5). 6 notes that provide the iconic bluesy sound.' },
    theory: { he: 'סולם הבלוז ב-A: A-C-D-E♭-E-G. ה-E♭ הוא "תו הבלוז" — הדיסוננס הזה יוצר את המתח האופייני. ניתן לנגן אותו על כל אקורד בפרוגרסיית I-IV-V.', en: 'A blues scale: A-C-D-E♭-E-G. The E♭ is the "blue note" — this dissonance creates the characteristic tension. It works over all chords in a I-IV-V progression.' },
  },
  {
    prompt: { he: 'מהי הפרוגרסיה הבסיסית בבלוז?', en: 'What is the basic chord progression in blues?' },
    correct: { he: 'I - IV - V', en: 'I - IV - V' },
    distractors: [{ he: 'I - V - vi - IV', en: 'I - V - vi - IV' }, { he: 'ii - V - I', en: 'ii - V - I' }, { he: 'I - IV - I - V', en: 'I - IV - I - V' }],
    explanation: { he: 'הבלוז בנוי על שלושה אקורדים: I (טוניקה), IV (סובדומיננט), V (דומיננט). בסולם E: E7-A7-B7.', en: 'Blues is built on three chords: I (tonic), IV (subdominant), V (dominant). In E: E7-A7-B7.' },
    theory: { he: 'I-IV-V הוא הבסיס ההרמוני של הבלוז, הגוספל, הרוק, והקאנטרי. כוחו בפשטותו — שלושה אקורדים יוצרים מתח ושחרור שלם.', en: 'I-IV-V is the harmonic foundation of blues, gospel, rock, and country. Its power lies in its simplicity — three chords creating complete tension and release.' },
  },
  {
    prompt: { he: 'איזה פנטטוני הוא הבסיס של סולם הבלוז?', en: 'Which pentatonic is the basis of the blues scale?' },
    correct: { he: 'פנטטוני מינור', en: 'Minor pentatonic' },
    distractors: [{ he: 'פנטטוני מז׳ור', en: 'Major pentatonic' }, { he: 'פנטטוני יפני', en: 'Japanese pentatonic' }, { he: 'פנטטוני מודאלי', en: 'Modal pentatonic' }],
    explanation: { he: 'סולם הבלוז = פנטטוני מינור (5 תווים) + תו הבלוז ♭5 = 6 תווים סה"כ.', en: 'Blues scale = minor pentatonic (5 notes) + blue note ♭5 = 6 notes total.' },
    theory: { he: 'פנטטוני מינור: 1-♭3-4-5-♭7. הוסף ♭5 לקבלת סולם הבלוז: 1-♭3-4-♭5-5-♭7. הפנטטוני המינורי עצמו עובד מצוין על פרוגרסיות בלוז גם ללא תו הבלוז.', en: 'Minor pentatonic: 1-♭3-4-5-♭7. Add ♭5 for the blues scale: 1-♭3-4-♭5-5-♭7. The minor pentatonic alone works great over blues progressions even without the blue note.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מהו "Quick Change" בבלוז?', en: 'What is the "Quick Change" in blues?' },
    correct: { he: 'מעבר לאקורד IV בתיבה השנייה', en: 'Moving to the IV chord in bar 2' },
    distractors: [{ he: 'מעבר לאקורד V בתיבה השנייה', en: 'Moving to the V chord in bar 2' }, { he: 'שינוי מהיר מ-I ל-V בתיבה הראשונה', en: 'Quick change from I to V in bar 1' }, { he: 'שינוי קצב בתיבה השישית', en: 'Tempo change in bar 6' }],
    explanation: { he: 'ב-Quick Change הבלוז, בתיבה השנייה עוברים כבר לאקורד IV (במקום להישאר על I עוד 3 תיבות).', en: 'In the Quick Change blues, bar 2 goes immediately to the IV chord (instead of staying on I for 3 more bars).' },
    theory: { he: 'פרוגרסיית Quick Change: I-IV-I-I-IV-IV-I-I-V-IV-I-V. ל-Standard: I-I-I-I-IV-IV-I-I-V-IV-I-V. הQuick Change נפוץ בבלוז ג׳אזי ומהיר.', en: 'Quick Change progression: I-IV-I-I-IV-IV-I-I-V-IV-I-V. Standard: I-I-I-I-IV-IV-I-I-V-IV-I-V. Quick Change is common in jazz blues and uptempo blues.' },
  },
  {
    prompt: { he: 'מהו "Turnaround" בבלוז?', en: 'What is a "turnaround" in blues?' },
    correct: { he: 'פרוגרסיה בשתי התיבות האחרונות שמחזירה לתחילת ה-12 בר', en: 'A 2-bar phrase in the last bars that leads back to the top' },
    distractors: [{ he: 'חזרה לסולם המז׳ור בסוף', en: 'Return to major key at the end' }, { he: 'שינוי קצב בסוף ה-12 בר', en: 'Tempo change at the end of the 12 bars' }, { he: 'ריף גיטרה בתיבה הראשונה', en: 'Guitar riff in the first bar' }],
    explanation: { he: 'הטרנאראונד הוא ביטוי הרמוני שמופיע בתיבות 11-12 ומוביל חזרה לתחילת הפרוגרסיה.', en: 'The turnaround is a harmonic phrase in bars 11-12 that leads back to the beginning of the progression.' },
    theory: { he: 'טרנאראונד קלאסי ב-E: E7-D7-C7-B7 (תיבות 11-12). הניד הכרומטי יוצר תנועה מרגשת שמוביל בחזרה ל-E7. אפשר גם: I-VI-II-V (ג׳אז בלוז).', en: 'Classic turnaround in E: E7-D7-C7-B7 (bars 11-12). The chromatic movement creates exciting motion leading back to E7. Also possible: I-VI-II-V (jazz blues).' },
  },
  {
    prompt: { he: 'מהו "תו הבלוז" (blue note)?', en: 'What is the "blue note"?' },
    correct: { he: 'הקווינטה המוורדת (♭5)', en: 'The flatted fifth (♭5)' },
    distractors: [{ he: 'הטרצה המוורדת (♭3)', en: 'The flatted third (♭3)' }, { he: 'הספטימה המוורדת (♭7)', en: 'The flatted seventh (♭7)' }, { he: 'הקוורטה המוגדלת (#4)', en: 'The augmented fourth (#4)' }],
    explanation: { he: 'תו הבלוז הוא ה-♭5 — הטריטון. בא-בלוז: E♭ בין D ל-E. הוא יוצר את הדיסוננס הייחודי של הבלוז.', en: 'The blue note is the ♭5 — the tritone. In A blues: E♭ between D and E. It creates the unique dissonance of blues.' },
    theory: { he: 'בפועל, "תווי בלוז" הם כל הגמישויות הכרומטיות: ♭3, ♭5, ♭7. הזמר או המנגן מחליק בין ♭3 ל-3, בין ♭5 ל-5, יוצר את הצליל הבלואזי. זהו אחד ממאפייני ה-microtonal של הבלוז.', en: 'In practice, "blue notes" include all chromatic inflections: ♭3, ♭5, ♭7. The singer or player bends between ♭3 and 3, between ♭5 and 5, creating the bluesy sound. This is one of the microtonal characteristics of blues.' },
  },
  {
    prompt: { he: 'מה ההבדל בין פנטטוני מינור לפנטטוני מז׳ור בבלוז?', en: 'How are the minor and major pentatonic used differently in blues?' },
    correct: { he: 'פנטטוני מינור — ל-gritty ואגרסיבי; פנטטוני מז׳ור — ל-sweet ומלודי', en: 'Minor pentatonic — gritty and aggressive; major pentatonic — sweet and melodic' },
    distractors: [{ he: 'פנטטוני מינור לאלתור, פנטטוני מז׳ור לאקומפנימנט', en: 'Minor pentatonic for soloing, major pentatonic for accompaniment' }, { he: 'פנטטוני מז׳ור לבלוז דלתא, פנטטוני מינור לבלוז שיקגו', en: 'Major pentatonic for Delta blues, minor pentatonic for Chicago blues' }, { he: 'הם אותו הדבר בהקשר בלוז', en: 'They are the same in blues context' }],
    explanation: { he: 'גיטריסטי בלוז מיומנים מערבבים בין שני הסולמות. פנטטוני מינור נותן צליל "dirty", פנטטוני מז׳ור נותן צליל "sweet" ואופטימי יותר.', en: 'Skilled blues guitarists mix both scales. Minor pentatonic gives a "dirty" sound, major pentatonic gives a "sweet" and more optimistic sound.' },
    theory: { he: 'שני הסולמות על אותה טוניקה: מינור (A-C-D-E-G), מז׳ור (A-B-C#-E-F#). ריי צ׳ארלס, בי.בי. קינג ואחרים ידועים בשימוש גמיש בשניהם, לפעמים במשפט בודד.', en: 'Both scales on same tonic: minor (A-C-D-E-G), major (A-B-C#-E-F#). Ray Charles, B.B. King and others are known for flexibly using both, sometimes within a single phrase.' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מה היא "החלפת טריטון" (tritone substitution)?', en: 'What is a tritone substitution?' },
    correct: { he: 'החלפת אקורד V7 באקורד ♭II7 (מרחק טריטון)', en: 'Replacing the V7 chord with the ♭II7 chord (a tritone away)' },
    distractors: [{ he: 'הוספת תו ♭5 לאקורד V', en: 'Adding a ♭5 to the V chord' }, { he: 'מעבר ממז׳ור למינור בטריטון', en: 'Moving from major to minor a tritone away' }, { he: 'שימוש בפנטטוני טריטון מהטוניקה', en: 'Using the tritone pentatonic from the tonic' }],
    explanation: { he: 'ב-tritone sub, מחליפים G7 (V7 ב-C) ב-D♭7 — הטריטון (שישה חצי-טונים) מ-G. שני האקורדים חולקים את אותם guide tones: B=C♭ ו-F.', en: 'In tritone sub, G7 (V7 in C) is replaced by D♭7 — a tritone (six semitones) from G. Both chords share the same guide tones: B=C♭ and F.' },
    theory: { he: 'ה-tritone sub עובד כי V7 ו-♭II7 חולקים את אותה טרצה ספטימה (guide tones). G7: B-F; D♭7: F-C♭(=B). כל אחד מהם פותר ל-C מז׳ור. שיטה זו מאפיינת את ג׳אז הבלוז.', en: 'Tritone sub works because V7 and ♭II7 share the same 3rd and 7th (guide tones). G7: B-F; D♭7: F-C♭(=B). Both resolve to C major. This technique characterizes jazz blues.' },
  },
  {
    prompt: { he: 'מהי פרוגרסיית "Bird Blues" (ג׳אז בלוז)?', en: 'What is the "Bird Blues" (jazz blues) progression?' },
    correct: { he: 'וריאציה על 12-בר עם II-V-I, tritone subs, ורה-הרמוניזציה', en: 'A 12-bar variation with II-V-I cadences, tritone subs, and reharmonization' },
    distractors: [{ he: '8-בר בלוז עם אקורדי מז׳ור 7', en: '8-bar blues with major 7th chords' }, { he: 'פרוגרסיית I-IV-V עם סיום ii-V-I', en: 'I-IV-V progression with a ii-V-I ending' }, { he: '16-בר בלוז עם כרומטיקה', en: '16-bar blues with chromaticism' }],
    explanation: { he: 'ה-Bird Blues (צ׳ארלי פארקר) הוא 12-בר עם הרמוניה ג׳אזית: II-V cadences, tritone subs, וביחוד II-V-I בתיבות 9-12.', en: 'The Bird Blues (Charlie Parker) is a 12-bar form with jazz harmony: II-V cadences, tritone subs, and notably II-V-I in bars 9-12.' },
    theory: { he: 'לדוגמה ב-F: F7|B♭7|F7|Cm7-F7|B♭7|B♭m7-E♭7|F7-Am7♭5-D7|Gm7-C7|F7-Gm7|C7|F7-C7. כל המהלכים הג׳אזיים מוסיפים עומק הרמוני על גבי הצורה הקלאסית.', en: 'Example in F: F7|B♭7|F7|Cm7-F7|B♭7|B♭m7-E♭7|F7-Am7♭5-D7|Gm7-C7|F7-Gm7|C7|F7-C7. All the jazz moves add harmonic depth on top of the classic form.' },
  },
  {
    prompt: { he: 'מהם "Guide Tones" ומדוע הם חשובים בהרמוניה?', en: 'What are "guide tones" and why are they important in harmony?' },
    correct: { he: 'הטרצה והספטימה של האקורד — הם מגדירים את האיכות ומנהלים את התנועה ההרמונית', en: 'The 3rd and 7th of a chord — they define quality and drive harmonic motion' },
    distractors: [{ he: 'הבסיס והקווינטה — הם הבסיס של האקורד', en: 'The root and 5th — they are the foundation of the chord' }, { he: 'כל תווי האקורד שיוצרים את הצליל', en: 'All chord tones that create the sound' }, { he: 'הנוטות הכרומטיות שבין שני אקורדים', en: 'The chromatic passing tones between two chords' }],
    explanation: { he: 'ה-guide tones (3 ו-7) מגדירים אם אקורד הוא מז׳ור, מינור, או דומיננט, ובדרך כלל נעים בחצי-טון בין אקורדים.', en: 'Guide tones (3 and 7) define whether a chord is major, minor, or dominant, and typically move by half-step between chords.' },
    theory: { he: 'ב-G7 ל-C: הטרצה B נעה לC, הספטימה F נעה ל-E. ב-Dm7-G7: הטרצה F (Dm7) נעה ל-F (G7—ספטימה), הספטימה C (Dm7) נעה ל-B (G7—טרצה). תנועה חלקה זו היא מהות ה-voice leading.', en: 'In G7 to C: the 3rd B moves to C, the 7th F moves to E. In Dm7-G7: F (3rd of Dm7) moves to F (7th of G7), C (7th of Dm7) moves to B (3rd of G7). This smooth motion is the essence of voice leading.' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreBluesQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_blues',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
