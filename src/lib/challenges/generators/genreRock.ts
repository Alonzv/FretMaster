import type { Question, Difficulty } from '../types'
import { randomOf, buildBilingualChoices, uid } from '../musicTheory'

interface QTemplate {
  prompt: { he: string; en: string }
  correct: { he: string; en: string }
  distractors: { he: string; en: string }[]
  explanation: { he: string; en: string }
  theory: { he: string; en: string }
}

const EASY: QTemplate[] = [
  {
    prompt: { he: 'מהו "Power Chord"?', en: 'What is a power chord?' },
    correct: { he: 'אקורד המורכב מבסיס וקווינטה בלבד (1-5)', en: 'A chord made of only the root and perfect fifth (1-5)' },
    distractors: [{ he: 'אקורד מז׳ור עם בסיס כפול', en: 'A major chord with doubled root' }, { he: 'אקורד מינור ללא קווינטה', en: 'A minor chord without a fifth' }, { he: 'אקורד עם ספטימה מוורדת', en: 'A chord with a flatted seventh' }],
    explanation: { he: 'Power chord = בסיס + קווינטה. ללא טרצה — לכן הוא לא מז׳ור ולא מינור. מושלם לדיסטורשן כי חסרה בו ההרמוניה שנשמעת עכורה עם פדל.', en: 'Power chord = root + fifth. No third — so it is neither major nor minor. Perfect for distortion because it lacks the harmonics that sound muddy through a pedal.' },
    theory: { he: 'E5 = E-B. A5 = A-E. לרוב מנגנים שני פרטים על שניים עוקבים עם ברה בינהם. Drop D מאפשר power chords בפרט אחד: D5 = פרטים 6,5,4 ריקים (D-A-D).', en: 'E5 = E-B. A5 = A-E. Usually played on two consecutive strings with a barre. Drop D enables one-finger power chords: D5 = open strings 6,5,4 (D-A-D).' },
  },
  {
    prompt: { he: 'מהי כוונת "Drop D"?', en: 'What is "Drop D" tuning?' },
    correct: { he: 'כיוון המיתר השישי מ-E ל-D', en: 'Tuning the 6th string down from E to D' },
    distractors: [{ he: 'כיוון כל המיתרים טון אחד מטה', en: 'Tuning all strings down one whole step' }, { he: 'כיוון המיתרים 1 ו-6 ל-D', en: 'Tuning strings 1 and 6 to D' }, { he: 'כיוון המיתר הראשון מ-E ל-D', en: 'Tuning the 1st string down from E to D' }],
    explanation: { he: 'ב-Drop D מורידים רק את המיתר השישי (העבה ביותר) מ-E ל-D. זה מאפשר power chords בפרט בודד ומרחיב את הטווח הבסיסי.', en: 'In Drop D, only the 6th (thickest) string is tuned down from E to D. This enables one-finger power chords and extends the low range.' },
    theory: { he: 'Drop D פופולרי במטאל ובגראנג׳: Nirvana, Soundgarden, Foo Fighters. כיוון: D-A-D-G-B-E. Power chords על המיתרים 6-5-4: הצבע על שלושה פרטים עם פרט אחד. Riff מפורסם: "Everlong" של Foo Fighters.', en: 'Drop D is popular in metal and grunge: Nirvana, Soundgarden, Foo Fighters. Tuning: D-A-D-G-B-E. Power chords on strings 6-5-4: barre three strings with one finger. Famous riff: "Everlong" by Foo Fighters.' },
  },
  {
    prompt: { he: 'איזו פרוגרסיה נחשבת ל"פרוגרסיית הפופ-רוק הגדולה"?', en: 'Which progression is called the "greatest pop-rock progression"?' },
    correct: { he: 'I - V - vi - IV', en: 'I - V - vi - IV' },
    distractors: [{ he: 'I - IV - V - I', en: 'I - IV - V - I' }, { he: 'ii - V - I', en: 'ii - V - I' }, { he: 'I - vi - IV - V', en: 'I - vi - IV - V' }],
    explanation: { he: 'I-V-vi-IV מופיעה באלפי שירים: "Let It Be", "Don\'t Stop Believin\'", "No Woman No Cry", "Tainted Love". היא נקראת גם "Axis progression".', en: 'I-V-vi-IV appears in thousands of songs: "Let It Be", "Don\'t Stop Believin\'", "No Woman No Cry", "Tainted Love". It is also called the "Axis progression".' },
    theory: { he: 'ב-C מז׳ור: C-G-Am-F. ב-G: G-D-Em-C. כוחה בכך שהיא יוצרת מתח (V), שחרור רגשי (vi - מינור), ואז נפילה רכה (IV) לפני החזרה. נוצרת לולאה הרמונית שקשה להתנגד לה.', en: 'In C major: C-G-Am-F. In G: G-D-Em-C. Its power lies in creating tension (V), emotional release (vi - minor), then a soft landing (IV) before returning. It creates a harmonic loop that is hard to resist.' },
  },
  {
    prompt: { he: 'מה הוא "Palm Muting" בגיטרה?', en: 'What is "palm muting" on guitar?' },
    correct: { he: 'הנחת כף היד על המיתרים ליד הכן כדי לקהות את הצליל', en: 'Resting the palm on the strings near the bridge to dampen the sound' },
    distractors: [{ he: 'לחיצת אצבע על המיתר לשתיקה מוחלטת', en: 'Pressing a finger on the string for complete silence' }, { he: 'נגינה עם האגודל במקום הפיק', en: 'Playing with the thumb instead of a pick' }, { he: 'חסימת המיתרים עם יד שמאל', en: 'Blocking the strings with the left hand' }],
    explanation: { he: 'Palm muting = הנחת כף ימין (בגיטריסט ימני) ליד הכן של הגיטרה. יוצר צליל עמום, "chunky" — אופייני לריפים של מטאל ופאנק-רוק.', en: 'Palm muting = resting the right hand near the guitar bridge. Creates a muted, "chunky" sound — characteristic of metal and punk-rock riffs.' },
    theory: { he: 'טכניקת palm mute + power chords היא הבסיס של ריפ המטאל. ניתן לשחק עם כמות הלחץ: לחץ חזק = עמום מאוד; לחץ קל = "tight" אך פתוח יותר. מאסטרי: James Hetfield (Metallica).', en: 'Palm muting + power chords is the foundation of metal riffing. You can vary the pressure: heavy press = very muted; light press = "tight" but more open. Master: James Hetfield (Metallica).' },
  },
  {
    prompt: { he: 'איזה סולם הוא הבסיס לסולואים ברוק?', en: 'Which scale is the foundation of rock soloing?' },
    correct: { he: 'הפנטטוני המינורי', en: 'The minor pentatonic scale' },
    distractors: [{ he: 'סולם מז׳ור', en: 'Major scale' }, { he: 'סולם פריגי', en: 'Phrygian scale' }, { he: 'סולם המליודי מינור', en: 'Melodic minor scale' }],
    explanation: { he: 'הפנטטוני המינורי (5 תווים) הוא הכלי העיקרי של גיטריסטי רוק. פשוט לנגן, נשמע מעולה עם דיסטורשן, ומשמש את ג׳ימי הנדריקס, אריק קלפטון, ג׳ימי פייג׳ ואחרים.', en: 'The minor pentatonic (5 notes) is the primary tool of rock guitarists. Simple to play, sounds great with distortion, used by Jimi Hendrix, Eric Clapton, Jimmy Page and others.' },
    theory: { he: 'פנטטוני מינורי ב-A: A-C-D-E-G. "Box 1" (pattern ראשון בפרט 5): הצורה הנפוצה ביותר לגיטרה. מוסיקאי רוק רבים מתחילים ומסיימים את הקריירה שלהם עם הסולם הזה.', en: 'Minor pentatonic in A: A-C-D-E-G. "Box 1" (first pattern at fret 5): the most common shape on guitar. Many rock musicians start and end their careers with this scale.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מה הוא "Pentatonic Box" ואיך משתמשים בו?', en: 'What is the "Pentatonic Box" and how is it used?' },
    correct: { he: 'דפוס אצבוע של סולם פנטטוני על הצוואר, לרוב על פרטים 4-7', en: 'A fingering pattern of the pentatonic scale on the neck, often covering frets 4-7' },
    distractors: [{ he: 'טבלה של אקורדים בסגנון רוק', en: 'A chart of rock-style chords' }, { he: 'אמצעי לאחסון גיטרה', en: 'A storage method for a guitar' }, { he: 'טכניקת bending ספציפית', en: 'A specific bending technique' }],
    explanation: { he: 'ה-"box" הוא צורה ויזואלית על הצוואר שמאפשרת לנגן את כל תווי הפנטטוני בשטח מוגבל. Box 1 הוא הנפוץ ביותר.', en: 'The "box" is a visual shape on the neck that allows you to play all pentatonic notes in a limited area. Box 1 is the most common.' },
    theory: { he: 'יש 5 "boxes" — כל אחד מתחיל על תו שונה של הסולם. כשלומדים את כל 5 הצורות ומחברים ביניהן, ניתן לנגן את הפנטטוני על כל הצוואר. רוב הגיטריסטים מתחילים עם box 1 ומרחיבים משם.', en: 'There are 5 "boxes" — each starting on a different scale tone. When you learn all 5 shapes and connect them, you can play the pentatonic across the whole neck. Most guitarists start with box 1 and expand from there.' },
  },
  {
    prompt: { he: 'מהי טכניקת "String Bending"?', en: 'What is the "string bending" technique?' },
    correct: { he: 'דחיפת המיתר הצידה תוך כדי לחיצה להעלאת גובה הצליל', en: 'Pushing the string sideways while fretting to raise the pitch' },
    distractors: [{ he: 'מתיחת המיתר ממקום אחיזתו', en: 'Pulling the string from its anchor point' }, { he: 'לחיצה חזקה יותר על הפרט', en: 'Pressing harder on the fret' }, { he: 'שימוש בוויברטו ידי', en: 'Using the whammy bar' }],
    explanation: { he: 'Bending = דחיפת המיתר למעלה (מיתרים 1-3) או למטה (מיתרים 4-6) כדי להעלות את הגובה. Bend מלא = חצי-טון מעלה (כמו עלייה לפרט הבא).', en: 'Bending = pushing the string up (strings 1-3) or down (strings 4-6) to raise pitch. Full bend = one whole step up (as if moving to the next two frets).' },
    theory: { he: 'סוגי bends: ¼ tone (quarter bend), half step (חצי-טון), whole step (טון), pre-bend (bend לפני הנגינה), release bend (החזרה). B.B. King ידוע ב-vibrato שלו; Slash ב-bends הרחבים שלו. Bending הוא הביטוי הרגשי ביותר של הגיטרה.', en: 'Types of bends: ¼ tone (quarter bend), half step, whole step, pre-bend (bend before picking), release bend. B.B. King is known for his vibrato; Slash for his wide bends. Bending is the most expressive technique on guitar.' },
  },
  {
    prompt: { he: 'מה הם "Borrowed Chords" ברוק?', en: 'What are "borrowed chords" in rock?' },
    correct: { he: 'אקורדים שאולים מסולם מקביל (לרוב מינור מקביל)', en: 'Chords borrowed from the parallel scale (usually parallel minor)' },
    distractors: [{ he: 'אקורדים מסגנון מוסיקאי אחר', en: 'Chords borrowed from a different musical style' }, { he: 'אקורדים שאולים מסולם בקווינטה', en: 'Chords borrowed from the scale a fifth away' }, { he: 'אקורדי עוברים כרומטיים', en: 'Chromatic passing chords' }],
    explanation: { he: 'ברוק רבים "שואלים" אקורדים מהמינור המקביל. C מז׳ור שואל מ-C מינור: ♭VII (B♭), ♭VI (A♭), ♭III (E♭). נותן צבע "epic" וכהה יותר.', en: 'In rock, many songs "borrow" chords from the parallel minor. C major borrows from C minor: ♭VII (B♭), ♭VI (A♭), ♭III (E♭). Gives an "epic" and darker color.' },
    theory: { he: 'דוגמאות: "Stairway to Heaven" (Am-G-F); "Hotel California" (Bm-F#-A-E-G-D-Em-F#). ה-♭VII ב-רוק נפוץ מאוד: G-F-C ב-C מז׳ור. מצב אאולי (natural minor) נפוץ מאוד בהארד רוק.', en: 'Examples: "Stairway to Heaven" (Am-G-F); "Hotel California" (Bm-F#-A-E-G-D-Em-F#). The ♭VII in rock is very common: G-F-C in C major. Aeolian mode (natural minor) is very common in hard rock.' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מה הוא מצב הפריגי (Phrygian) ומהי השימוש שלו ברוק?', en: 'What is the Phrygian mode and how is it used in rock?' },
    correct: { he: 'סולם מינור עם ♭2 — נשמע אפל ואקזוטי, נפוץ במטאל ורוק לטיני', en: 'A minor scale with a ♭2 — sounds dark and exotic, common in metal and Latin rock' },
    distractors: [{ he: 'סולם מז׳ור עם ♭3 — מתאים לרוק קלאסי', en: 'A major scale with ♭3 — suits classic rock' }, { he: 'מצב מינור עם ♭6 — נפוץ בג׳אז רוק', en: 'A minor mode with ♭6 — common in jazz rock' }, { he: 'סולם פנטטוני עם תו נוסף', en: 'Pentatonic scale with an extra note' }],
    explanation: { he: 'פריגי = 1-♭2-♭3-4-5-♭6-♭7. ה-♭2 (סקונדה קטנה) נותן את הצבע הספרדי/מזרחי. Carlos Santana, Dio, Metallica משתמשים בו.', en: 'Phrygian = 1-♭2-♭3-4-5-♭6-♭7. The ♭2 (minor second) gives the Spanish/Eastern color. Carlos Santana, Dio, Metallica use it.' },
    theory: { he: 'E פריגי: E-F-G-A-B-C-D. ה-F (♭2) הוא המאפיין. "Wherever I May Roam" - Metallica, "Orion" - Metallica, פרוגרסיה אופיינית: Em-F-Em (I-♭II-I). פריגי הרמוני (עם #3) עוד יותר אקזוטי: E-F-G#-A-B-C-D.', en: 'E Phrygian: E-F-G-A-B-C-D. The F (♭2) is the characteristic note. "Wherever I May Roam" - Metallica, "Orion" - Metallica, typical progression: Em-F-Em (I-♭II-I). Phrygian dominant (with #3) is even more exotic: E-F-G#-A-B-C-D.' },
  },
  {
    prompt: { he: 'מה הוא מצב הליידיאן (Lydian) ומתי משתמשים בו?', en: 'What is the Lydian mode and when is it used?' },
    correct: { he: 'סולם מז׳ור עם #4 — נשמע "מרחפי" ואווירתי, נפוץ בסאונדטראקים ופרוגרסיב', en: 'A major scale with #4 — sounds "floating" and atmospheric, common in soundtracks and prog' },
    distractors: [{ he: 'סולם מינור עם #6 — מתאים לבלוז', en: 'A minor scale with #6 — suits blues' }, { he: 'סולם מז׳ור עם ♭7 — אופייני לרוק', en: 'A major scale with ♭7 — typical of rock' }, { he: 'מצב מז׳ורי עם ♭2', en: 'A major mode with ♭2' }],
    explanation: { he: 'ליידיאן = 1-2-3-#4-5-6-7. ה-#4 (הטריטון מהבסיס) נותן צבע חלומי ו"מרחפי". Joe Satriani, Steve Vai, John Williams משתמשים בו.', en: 'Lydian = 1-2-3-#4-5-6-7. The #4 (tritone from root) gives a dreamy and "floating" color. Joe Satriani, Steve Vai, John Williams use it.' },
    theory: { he: 'F ליידיאן: F-G-A-B-C-D-E (= C מז׳ור מ-F). הטריטון F-B נותן את האפקט. שירים: "Flying in a Blue Dream" - Satriani, "For the Love of God" - Steve Vai. על Im♯4 אקורד ניתן לנגן ליידיאן.', en: 'F Lydian: F-G-A-B-C-D-E (= C major starting from F). The tritone F-B creates the effect. Songs: "Flying in a Blue Dream" - Satriani, "For the Love of God" - Steve Vai. Over a Imaj#4 chord, use Lydian.' },
  },
  {
    prompt: { he: 'מה הוא "Modal Interchange" (חילופי מצבים)?', en: 'What is "modal interchange"?' },
    correct: { he: 'שימוש באקורדים ממצבים שונים של אותה טוניקה באותו קטע', en: 'Using chords from different modes of the same tonic within the same piece' },
    distractors: [{ he: 'מעבר מסולם למצב בקטעים שונים', en: 'Switching between scale and mode in different sections' }, { he: 'שימוש ב-II-V-I בין מצבים', en: 'Using II-V-I between modes' }, { he: 'כיוון גיטרה לכל מצב בנפרד', en: 'Tuning guitar to each mode separately' }],
    explanation: { he: 'Modal interchange = לקחת אקורדים ממצבים מקבילים. C מז׳ור לוקח מ-C דוריאן, C פריגי וכו׳. יוצר עושר הרמוני בלי לעזוב את הטוניקה.', en: 'Modal interchange = taking chords from parallel modes. C major borrows from C Dorian, C Phrygian, etc. Creates harmonic richness without leaving the tonic.' },
    theory: { he: 'C מז׳ור + modal interchange: IV (F) → iv (Fm, מ-C מינור) — סיים "Yesterday" Beatles. I (C) → I7 (C7) → IV (F) — כניסה לסאבדומיננט ג׳אזי. ♭VII (B♭, מ-C מיקסוליידי) — נפוץ מאוד ברוק. כל מצב נותן ״צבע״ שונה.', en: 'C major + modal interchange: IV (F) → iv (Fm, from C minor) — end of Beatles "Yesterday". I (C) → I7 (C7) → IV (F) — jazzy subdominant move. ♭VII (B♭, from C Mixolydian) — very common in rock. Each mode gives a different "color".' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreRockQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_rock',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
