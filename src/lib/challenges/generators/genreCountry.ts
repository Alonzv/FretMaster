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
    prompt: { he: 'מהו "Capo" ולמה הוא נפוץ בקאנטרי?', en: 'What is a "capo" and why is it common in country music?' },
    correct: { he: 'מהדק שמקצר את הצוואר ומעלה כיוון — מאפשר נגינה בצורות פתוחות בכל טוניקה', en: 'A clamp that shortens the neck and raises pitch — allows open chord shapes in any key' },
    distractors: [{ he: 'פדל שמשנה את הצליל לסאונד קאנטרי', en: 'A pedal that changes sound to country tone' }, { he: 'כיוון מיוחד של מיתרי גיטרה לקאנטרי', en: 'Special guitar string tuning for country' }, { he: 'מדוד מחרוזת לניגון כפול', en: 'A slide device for double-stop playing' }],
    explanation: { he: 'ה-Capo מאפשר לנגן בצורות פתוחות (G, C, D) אבל בטוניקה אחרת. Capo פרט 2 + צורת G = A בפועל.', en: 'The capo allows playing in open shapes (G, C, D) but in a different key. Capo fret 2 + G shape = A in actual pitch.' },
    theory: { he: 'קאנטרי משתמש בגיטרה אקוסטית עם capo לעיתים קרובות כי: 1) אקורדים פתוחים נשמעים מלאים יותר, 2) קל להתאים לקול הזמר. פרטי capo נפוצים בקאנטרי: 2, 3, 4, 5. "Take Me Home Country Roads" - John Denver משתמש ב-capo.', en: 'Country frequently uses acoustic guitar with capo because: 1) open chords sound fuller, 2) easy to match singer\'s voice. Common capo frets in country: 2, 3, 4, 5. "Take Me Home Country Roads" by John Denver uses a capo.' },
  },
  {
    prompt: { he: 'מהם "Double Stops" בגיטרה?', en: 'What are "double stops" on guitar?' },
    correct: { he: 'נגינת שני תווים בו-זמנית — אופייני ל-licks של קאנטרי ורוקביל', en: 'Playing two notes simultaneously — characteristic of country and rockabilly licks' },
    distractors: [{ he: 'נגינה בשני פיקים בו-זמנית', en: 'Playing with two picks simultaneously' }, { he: 'לחיצה כפולה על הפרט', en: 'Double-pressing on the fret' }, { he: 'נגינת אוקטבה על שתי גיטרות', en: 'Playing octaves on two guitars' }],
    explanation: { he: 'Double stops = שני תווים ביחד — לרוב טרצות (3rds) או שישיות (6ths). נשמע "country" מאוד — דייג Paisley, Brad Paisley, Albert Lee מומחים בזה.', en: 'Double stops = two notes together — usually thirds or sixths. Sounds very "country" — Brad Paisley, Albert Lee are experts at this.' },
    theory: { he: 'Double stops בטרצות: נגן תו על מיתר אחד ותו שלישה מעל על המיתר הסמוך. ב-G מז׳ור פרט 5-7: G-B, A-C, B-D... כל זוג הוא טרצה דיאטונית. זה הבסיס של licks קאנטרי ורוקביל.', en: 'Double stops in thirds: play a note on one string and a note a third higher on the adjacent string. In G major at frets 5-7: G-B, A-C, B-D... each pair is a diatonic third. This is the basis of country and rockabilly licks.' },
  },
  {
    prompt: { he: 'מהו "Chicken Picking"?', en: 'What is "chicken picking"?' },
    correct: { he: 'טכניקת נגינה בה מחלפים בין פיק לאצבעות — יוצרת צליל חד ו"פופ"', en: 'A picking technique alternating between pick and fingers — creates a sharp "pop" sound' },
    distractors: [{ he: 'נגינה בפיק בלבד במהירות גבוהה', en: 'Playing with pick only at high speed' }, { he: 'נגינת אקורדים בטכניקת פרוח על הצוואר', en: 'Playing chords with a flower technique on the neck' }, { he: 'משיכה של מיתר בכפות הרגליים', en: 'Plucking string with toes' }],
    explanation: { he: 'Chicken picking = hybrid picking: פיק + אצבע האמצע (ולפעמים קמיצה). נותן צליל "snap" חד. יחד עם palm muting — הצליל "chicken" האופייני לקאנטרי.', en: 'Chicken picking = hybrid picking: pick + middle finger (and sometimes ring). Gives a sharp "snap" sound. Combined with palm muting — the typical "chicken" sound of country.' },
    theory: { he: 'מאסטרים: Brent Mason, Albert Lee, Brad Paisley, Jerry Reed. טכניקה: נגנים ריף עם הפיק ומשתמשים בם (middle finger) לנגינת מיתרים גבוהים בסנאפ. מאפשר ריפים מהירים מאוד שלא ניתנים לנגינה בפיק בלבד.', en: 'Masters: Brent Mason, Albert Lee, Brad Paisley, Jerry Reed. Technique: play riff with pick and use m (middle finger) to snap higher strings. Enables very fast licks impossible to play with pick alone.' },
  },
  {
    prompt: { he: 'איזה סולם הוא הבסיס של האלתורים בקאנטרי?', en: 'Which scale is the basis of country improvisation?' },
    correct: { he: 'הפנטטוני המז׳ורי', en: 'The major pentatonic scale' },
    distractors: [{ he: 'הפנטטוני המינורי', en: 'The minor pentatonic scale' }, { he: 'סולם דוריאן', en: 'The Dorian scale' }, { he: 'סולם הרמוני מינור', en: 'The harmonic minor scale' }],
    explanation: { he: 'קאנטרי הוא בעיקרו מוסיקה מז׳ורית ואופטימית — הפנטטוני המז׳ורי (1-2-3-5-6) הוא הכלי העיקרי. נשמע "happy" ו"country".', en: 'Country is primarily major and optimistic — the major pentatonic (1-2-3-5-6) is the main tool. Sounds "happy" and "country".' },
    theory: { he: 'G פנטטוני מז׳ורי: G-A-B-D-E. ניתן גם לשלב עם מינורי: "country sound" = ערבוב ♭3 ו-3 (bending ♭3→3). לדוגמה: בידני C♭3=E♭ ואז עולה ל-E. זה נותן את הצבע הבלואזי-קאנטרי.', en: 'G major pentatonic: G-A-B-D-E. You can also mix with minor: "country sound" = mixing ♭3 and 3 (bending ♭3→3). Example: bend C\'s ♭3=E♭ up to E. This gives the blues-country color.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מהו "Nashville Number System"?', en: 'What is the "Nashville Number System"?' },
    correct: { he: 'שיטת כתיב מוסיקה בה כותבים מספרי דרגות במקום שמות אקורדים — 1, 4, 5 במקום G, C, D', en: 'A music notation system using scale degree numbers instead of chord names — 1, 4, 5 instead of G, C, D' },
    distractors: [{ he: 'מערכת כיוון גיטרה אקוסטית בנאשוויל', en: 'A Nashville acoustic guitar tuning system' }, { he: 'מערכת ניקוד לנגנים לפי איכות הנגינה', en: 'A scoring system for players based on performance quality' }, { he: 'שיטת כתיב תוים על חמשה', en: 'A method for writing notes on a staff' }],
    explanation: { he: 'Nashville Number System: 1=I, 4=IV, 5=V, 6m=vi וכו׳. כתיב אוניברסלי שעובד בכל טוניקה — הנגן מחיל אותו על הסולם שנבחר.', en: 'Nashville Number System: 1=I, 4=IV, 5=V, 6m=vi etc. Universal notation that works in any key — the musician applies it to the chosen key.' },
    theory: { he: 'פותח בנאשוויל בשנות ה-50 לצרכי הקלטות מהירות. מאפשר לנגנים להחליף טוניקה ברגע. chart קצר: |1|4|1|5|4|1|5|1| = 12-bar country. כל נגן בנאשוויל חייב לדעת זאת.', en: 'Developed in Nashville in the 1950s for fast recording sessions. Allows musicians to switch keys instantly. Short chart: |1|4|1|5|4|1|5|1| = 12-bar country. Every Nashville musician must know this.' },
  },
  {
    prompt: { he: 'מהו "Pedal Steel Guitar" ומה הצליל האופייני שלו?', en: 'What is a "pedal steel guitar" and what is its characteristic sound?' },
    correct: { he: 'גיטרה אופקית עם פדלים שמשנים כיוון מיתרים — יוצרת slides וצלילי "crying" אופייניים', en: 'A horizontal guitar with pedals that change string tuning — creates slides and characteristic "crying" sounds' },
    distractors: [{ he: 'גיטרה חשמלית עם pedal distortion מסוים', en: 'An electric guitar with a specific distortion pedal' }, { he: 'גיטרה בס עם 6 מיתרים ופדל וואה', en: 'A bass guitar with 6 strings and wah pedal' }, { he: 'גיטרה קלאסית עם מסרק פלדה', en: 'A classical guitar with a steel nut' }],
    explanation: { he: 'Pedal steel = גיטרה שמנגנים עם barre (חתיכת פלדה) ועם פדלים שמשנים כיוון. הפדלים מאפשרים בנדים ומיקסים של צלילים שאי אפשר בגיטרה רגילה.', en: 'Pedal steel = guitar played with a steel bar (slide) and pedals that change tuning. The pedals allow bends and note mixes impossible on a regular guitar.' },
    theory: { he: 'Pedal steel הוא ה"קול" של קאנטרי קלאסי. כיוון נפוץ: E9 tuning (E-B-G#-F#-D-B-G#-E-D-B). הפדלים מאפשרים: raise D→E, raise G#→A. Legends: Buddy Emmons, Lloyd Green, Bud Isaacs.', en: 'Pedal steel is the "voice" of classic country. Common tuning: E9 tuning (E-B-G#-F#-D-B-G#-E-D-B). Pedals allow: raise D→E, raise G#→A. Legends: Buddy Emmons, Lloyd Green, Bud Isaacs.' },
  },
  {
    prompt: { he: 'מהי "Banjo Roll" ואיך היא משפיעה על גיטרת קאנטרי?', en: 'What is a "banjo roll" and how does it influence country guitar?' },
    correct: { he: 'דפוס אצבוע גולגולתי על שלושה מיתרים — השפיע על fingerpicking ו-Travis picking בגיטרה', en: 'A rolling fingerpicking pattern across three strings — influenced guitar fingerpicking and Travis picking' },
    distractors: [{ he: 'טכניקת bending מהירה על מיתר בודד', en: 'Fast bending technique on a single string' }, { he: 'ניגוד בין בס ואקורד בשיטת flatpicking', en: 'Bass and chord alternation with flatpicking' }, { he: 'תנועת pick מהירה על מיתר בודד', en: 'Fast pick movement on a single string' }],
    explanation: { he: '"Travis Picking" = דפוס שמחקה בנג׳ו: האגודל מנגן bass notes חלופיות (thumb pattern) בזמן שהאצבעות מנגנות melody על מיתרים גבוהים.', en: '"Travis Picking" = a pattern mimicking banjo: thumb plays alternating bass notes while fingers play melody on higher strings.' },
    theory: { he: 'Merle Travis פיתח את הסגנון בשנות ה-40. Chet Atkins שיכלל אותו. Pattern בסיסי: אגודל 6→4, אצבע 1-2. שיר ללמוד: "Cannonball Rag" של Chet Atkins. Travis picking הוא הבסיס של folk ו-fingerstyle country.', en: 'Merle Travis developed the style in the 1940s. Chet Atkins perfected it. Basic pattern: thumb 6→4, finger 1-2. Song to learn: "Cannonball Rag" by Chet Atkins. Travis picking is the foundation of folk and fingerstyle country.' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מה הוא "Telecaster Twang" ולמה Telecaster אופייני לקאנטרי?', en: 'What is "Telecaster Twang" and why is the Telecaster iconic in country?' },
    correct: { he: 'צליל חד וברור של Fender Telecaster עם pickup הכן המיוחד — נותן attack חד ו"בוטח"', en: 'The bright, cutting sound of a Fender Telecaster with its unique bridge pickup — gives sharp, confident attack' },
    distractors: [{ he: 'פדל reverb שיוצר אפקט טלגרף', en: 'A reverb pedal that creates telegraph effect' }, { he: 'טכניקת strumming מיוחדת עם פיק עבה', en: 'Special strumming technique with heavy pick' }, { he: 'גיטרה עם נוצות של עוף - ציד טאנג', en: 'Guitar with feathers - hunting twang' }],
    explanation: { he: 'ה-Telecaster (1950) הוא גיטרת הקאנטרי האייקונית. ה-bridge pickup שלה נותן צליל חד ו"twangy" שחותך בדיוק. James Burton, Buck Owens, Keith Urban מנגנים Tele.', en: 'The Telecaster (1950) is the iconic country guitar. Its bridge pickup gives a bright and "twangy" sound that cuts through precisely. James Burton, Buck Owens, Keith Urban play Tele.' },
    theory: { he: 'ה-twang הטלקסטרי נובע מ: 1) Bridge pickup פלדה קשיח, 2) Brass saddles, 3) String tension גבוה. בשילוב עם clean amp (Fender Twin), chicken picking, ו-steel guitar — זה ה"sound" של Nashville.', en: 'The Telecaster twang comes from: 1) Hard steel bridge pickup, 2) Brass saddles, 3) High string tension. Combined with clean amp (Fender Twin), chicken picking, and steel guitar — this is the Nashville "sound".' },
  },
  {
    prompt: { he: 'מהו "Outlander Country" ואיזה תיאוריה מוסיקלית מאפיינת אותו?', en: 'What is "Outlaw Country" and what musical theory characterizes it?' },
    correct: { he: 'קאנטרי שמשלב יסודות רוק ובלוז עם מינור אקורדים ופרוגרסיות כהות', en: 'Country that blends rock and blues elements with minor chords and darker progressions' },
    distractors: [{ he: 'קאנטרי שמשתמש רק ב-major chords בלי ספטימות', en: 'Country that uses only major chords without sevenths' }, { he: 'קאנטרי שמחדד נגינה עם כלי נשיפה', en: 'Country that focuses on wind instrument playing' }, { he: 'קאנטרי מסורתי עם פנטטוני מז׳ורי בלבד', en: 'Traditional country with major pentatonic only' }],
    explanation: { he: 'Outlaw Country (Waylon Jennings, Willie Nelson, Johnny Cash) = קאנטרי עם "edge". מינור אקורדים, פרוגרסיות כהות, וריפים שאולים מרוק.', en: 'Outlaw Country (Waylon Jennings, Willie Nelson, Johnny Cash) = country with "edge". Minor chords, darker progressions, riffs borrowed from rock.' },
    theory: { he: '"Folsom Prison Blues" - Cash: E-A-B7 (I-IV-V בלוז). "Whiskey River" - Nelson: Am-D-G (vi-IV-I). הפנטטוני המינורי חוזר: Outlaws משתמשים בו בניגוד לקאנטרי המסורתי. "Ring of Fire" - Am-F-C-G: אקורד Am (vi) בפתיחה — unusual לקאנטרי.', en: '"Folsom Prison Blues" - Cash: E-A-B7 (I-IV-V blues). "Whiskey River" - Nelson: Am-D-G (vi-IV-I). The minor pentatonic returns: Outlaws use it unlike traditional country. "Ring of Fire" - Am-F-C-G: Am chord (vi) opener — unusual for country.' },
  },
  {
    prompt: { he: 'מהו "Bakersfield Sound" ואיזה אלמנטים מוסיקליים מאפיינים אותו?', en: 'What is the "Bakersfield Sound" and what musical elements characterize it?' },
    correct: { he: 'קאנטרי חשמלי מ-1950s עם Telecaster חד, קצב חזק, ופחות orchesTRation מ-Nashville', en: 'Electric country from the 1950s with bright Telecaster, strong beat, and less orchestration than Nashville' },
    distractors: [{ he: 'קאנטרי קלאסי מ-Nashville עם מיתריות', en: 'Classic Nashville country with string sections' }, { he: 'קאנטרי פולק עם גיטרה אקוסטית ובנג׳ו', en: 'Country folk with acoustic guitar and banjo' }, { he: 'קאנטרי מודרני עם בס חשמלי ודגימות', en: 'Modern country with electric bass and samples' }],
    explanation: { he: 'Bakersfield Sound (Buck Owens, Merle Haggard) = תגובה ל-Nashville polished sound. יותר "raw", Telecasters, Fender amps, rhythm section ברור.', en: 'Bakersfield Sound (Buck Owens, Merle Haggard) = reaction to Nashville polished sound. More "raw", Telecasters, Fender amps, clear rhythm section.' },
    theory: { he: '"Act Naturally" - Buck Owens: I-IV-V פשוט, Tele ישיר. "Mama Tried" - Haggard: I-IV-V-I בלוז קאנטרי. הגיטרה יותר בחזית, פחות strings. הSound הזה השפיע על Gram Parsons, Eagles, ועל country-rock של שנות ה-70.', en: '"Act Naturally" - Buck Owens: simple I-IV-V, straight Tele. "Mama Tried" - Haggard: I-IV-V-I blues country. Guitar more upfront, less strings. This Sound influenced Gram Parsons, Eagles, and 70s country-rock.' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreCountryQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_country',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
