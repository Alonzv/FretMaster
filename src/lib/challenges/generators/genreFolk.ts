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
    prompt: { he: 'מהו כיוון "DADGAD"?', en: 'What is "DADGAD" tuning?' },
    correct: { he: 'כיוון גיטרה: D-A-D-G-A-D — יוצר אקורד Dsus4 פתוח, אופייני לפולק קלטי', en: 'Guitar tuning: D-A-D-G-A-D — creates an open Dsus4 chord, typical of Celtic folk' },
    distractors: [{ he: 'כיוון גיטרה ספרדי עם חמישה D', en: 'Spanish guitar tuning with five D\'s' }, { he: 'כיוון drop D כפול עם מיתר עזר', en: 'Double drop D tuning with aux string' }, { he: 'כיוון מיוחד לנגינת דאבל-בס', en: 'Special tuning for double-bass playing' }],
    explanation: { he: 'DADGAD = D-A-D-G-A-D. כל המיתרים פתוחים יוצרים Dsus4 (ללא טרצה). האוקטבות D המרובות יוצרות drone effect מיוחד.', en: 'DADGAD = D-A-D-G-A-D. All open strings create Dsus4 (no third). The multiple D octaves create a unique drone effect.' },
    theory: { he: 'DADGAD פותח על-ידי Davey Graham בשנות ה-60 לנגינת מוסיקה מרוקאית. Jimmy Page השתמש בו ב-"Kashmir". נפוץ מאוד בפולק קלטי (אירלנד, סקוטלנד). מאפשר חבלי drone (תו נמשך) בזמן נגינה מלודית.', en: 'DADGAD was developed by Davey Graham in the 1960s for Moroccan music. Jimmy Page used it in "Kashmir". Very common in Celtic folk (Ireland, Scotland). Enables drone strings while playing melody.' },
  },
  {
    prompt: { he: 'מהו "Fingerpicking" ואיך הוא שונה מנגינה עם פיק?', en: 'What is "fingerpicking" and how does it differ from pick playing?' },
    correct: { he: 'נגינה עם האצבעות במקום פיק — מאפשר מלודיה, בס, ואקומפנימנט בו-זמנית', en: 'Playing with fingers instead of a pick — allows melody, bass, and accompaniment simultaneously' },
    distractors: [{ he: 'נגינה עם צרור אצבעות כפיק', en: 'Playing with a bunch of fingers as a pick' }, { he: 'נגינה בפיק ובו-זמנית בקלידים', en: 'Playing with pick while simultaneously on keys' }, { he: 'נגינה בשתי גיטרות בו-זמנית', en: 'Playing on two guitars simultaneously' }],
    explanation: { he: 'Fingerpicking = P (אגודל) לבס, I-M-A (אצבעות) למלודיה/אקורד. יוצר פוליפוניה על כלי יחיד. מאפשר לגיטרה לשחק תפקידי בס + סופרן יחד.', en: 'Fingerpicking = P (thumb) for bass, I-M-A (fingers) for melody/chords. Creates polyphony on one instrument. Allows guitar to play bass + soprano roles together.' },
    theory: { he: 'סגנונות fingerpicking: Travis picking (קאנטרי), Classical (classically trained), Celtic (folk קלטי), Flamenco (ספרדי). ביון Clapton, Simon & Garfunkel, Nick Drake, John Fahey — כולם fingerpickers ידועים.', en: 'Fingerpicking styles: Travis picking (country), Classical (classically trained), Celtic (Celtic folk), Flamenco (Spanish). Eric Clapton, Simon & Garfunkel, Nick Drake, John Fahey — all known fingerpickers.' },
  },
  {
    prompt: { he: 'מהו "Drone" בפולק?', en: 'What is a "drone" in folk music?' },
    correct: { he: 'תו (או תווים) שנמשכים לאורך כל הנגינה בעוד שמלודיה משתנה מעליהם', en: 'A note (or notes) sustained throughout the performance while a melody changes above them' },
    distractors: [{ he: 'ריתמוס מונוטוני בלי שינוי הרמוני', en: 'Monotonous rhythm without harmonic change' }, { he: 'נגינת אקורד חוזר ונשנה', en: 'Playing a repeated chord over and over' }, { he: 'אפקט echo ארוך', en: 'A long echo effect' }],
    explanation: { he: 'Drone = תו בסיסי נמשך (לרוב D, G, א) בעוד מלודיה עוברת מעליו. שמות: תהלוכה (drone note/pedal point). מאפיין בגפיפות, וולשית, ואירית.', en: 'Drone = a sustained bass note (usually D, G, A) while a melody passes above. Names: drone note/pedal point. Characteristic of bagpipes, Welsh, and Irish music.' },
    theory: { he: 'גפיפות (bagpipes) = כלי drone קלאסי: חצוצרה + drone pipes. DADGAD + open strings יוצרים drone טבעי. "The Lark in the Morning" (traditional Irish): D כדרון. John Fahey, Leo Kottke ידועים בשימוש ב-drone.', en: 'Bagpipes = classic drone instrument: chanter + drone pipes. DADGAD + open strings create natural drone. "The Lark in the Morning" (traditional Irish): D as drone. John Fahey, Leo Kottke known for drone use.' },
  },
  {
    prompt: { he: 'מהי "Drop D" כוונה לפולק?', en: 'What does "open tuning" mean in folk?' },
    correct: { he: 'כיוון גיטרה שבו המיתרים הפתוחים יוצרים אקורד שלם — למשל Open G, Open D, Open E', en: 'Guitar tuning where open strings form a complete chord — e.g., Open G, Open D, Open E' },
    distractors: [{ he: 'כיוון שבו כל המיתרים על אותו גובה', en: 'Tuning where all strings are the same pitch' }, { he: 'כיוון שבו לא לוחצים על שום פרט', en: 'Tuning where no frets are pressed' }, { he: 'כיוון שבו הגיטרה פתוחה פיזית', en: 'Tuning where the guitar is physically open' }],
    explanation: { he: 'Open tunings: Open G (D-G-D-G-B-D), Open D (D-A-D-F#-A-D), Open E (E-B-E-G#-B-E). מנגנים slide guitar עם open tunings: משפשף בר פלדה על הצוואר.', en: 'Open tunings: Open G (D-G-D-G-B-D), Open D (D-A-D-F#-A-D), Open E (E-B-E-G#-B-E). Slide guitar is played with open tunings: sliding a steel bar across the neck.' },
    theory: { he: 'Open G = Keith Richards sound (Rolling Stones). Open D = Joni Mitchell, John Denver. Slide guitar: Robert Johnson, Duane Allman. ב-open tuning, barre פשוט = אקורד מז׳ור בכל פרט. מאפשר חבלי drone וסאונד "פולקי".', en: 'Open G = Keith Richards sound (Rolling Stones). Open D = Joni Mitchell, John Denver. Slide guitar: Robert Johnson, Duane Allman. In open tuning, a simple barre = major chord at any fret. Enables drone strings and "folky" sound.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מהם "Modal Folk Scales" (מצבים בפולק)?', en: 'What are "modal folk scales" in folk music?' },
    correct: { he: 'מצבים כמו דוריאן, מיקסוליידי ואאוליאן — נפוצים בפולק קלטי ובלדות אנגליות ישנות', en: 'Modes like Dorian, Mixolydian, and Aeolian — common in Celtic folk and old English ballads' },
    distractors: [{ he: 'סולמות ביזנטיים ופרסיים', en: 'Byzantine and Persian scales' }, { he: 'פנטטוניים מהמזרח הרחוק', en: 'Pentatonics from the Far East' }, { he: 'סולמות יהודיים עתיקים', en: 'Ancient Hebrew scales' }],
    explanation: { he: 'פולק קלטי ישתמש ב: Dorian (מינור עם 6 גדולה), Mixolydian (מז׳ור עם ♭7), Aeolian (מינור טבעי). "Scarborough Fair" — E דוריאן. "Greensleeves" — A אאוליאן.', en: 'Celtic folk uses: Dorian (minor with major 6), Mixolydian (major with ♭7), Aeolian (natural minor). "Scarborough Fair" — E Dorian. "Greensleeves" — A Aeolian.' },
    theory: { he: 'הסולמות המודאליים הם טבעיים לפולק כי מוסיקה עממית קדמה למערכת המז׳ור/מינור. D דוריאן: D-E-F-G-A-B-C. ה-B (6 גדולה) נותן את הצבע הקלטי. G מיקסוליידי: G-A-B-C-D-E-F — ה-F (♭7) אופייני לקאנטרי ופולק.', en: 'Modal scales are natural to folk because folk music predates the major/minor system. D Dorian: D-E-F-G-A-B-C. The B (major 6) gives the Celtic color. G Mixolydian: G-A-B-C-D-E-F — the F (♭7) is typical of country and folk.' },
  },
  {
    prompt: { he: 'מהו "Jig" ומהו "Reel" בפולק אירי?', en: 'What is a "jig" and what is a "reel" in Irish folk?' },
    correct: { he: 'Jig = 6/8 (שש שמיניות לתיבה); Reel = 4/4 (ארבע ריבעיות לתיבה) — שני קצבי ריקוד יסודיים', en: 'Jig = 6/8 (six eighth notes per bar); Reel = 4/4 (four quarter notes per bar) — two fundamental dance rhythms' },
    distractors: [{ he: 'Jig = ריקוד איטי; Reel = ריקוד מהיר', en: 'Jig = slow dance; Reel = fast dance' }, { he: 'Jig = ריתמוס בינארי; Reel = ריתמוס טרינארי', en: 'Jig = binary rhythm; Reel = ternary rhythm' }, { he: 'Jig = פולק אנגלי; Reel = פולק אירי', en: 'Jig = English folk; Reel = Irish folk' }],
    explanation: { he: 'Jig (6/8): "The Irish Washerwoman". Reel (4/4 מהיר): "The Morning Dew". Hornpipe: 4/4 עם dots. Slip Jig: 9/8. כל ריקוד יש לו מבנה ריתמי ואורך (לרוב 32 תיבות = A+A+B+B).', en: 'Jig (6/8): "The Irish Washerwoman". Reel (fast 4/4): "The Morning Dew". Hornpipe: dotted 4/4. Slip Jig: 9/8. Each dance type has a rhythmic structure and length (usually 32 bars = A+A+B+B).' },
    theory: { he: 'Jig beat: 1-2-3, 4-5-6 (resh-resh-resh, resh-resh-resh ב-6/8). Reel: ריצות שמיניות מהירות ב-4/4. Hornpipe: ♩. ♪♩. ♪ (dotted feel). פולק אירי = ריקוד + מוסיקה חד-פעמית — ה-ריתמוס הוא ה-DNA.', en: 'Jig beat: 1-2-3, 4-5-6 (strong-weak-weak, strong-weak-weak in 6/8). Reel: fast eighth-note runs in 4/4. Hornpipe: dotted rhythm feel. Irish folk = dance + single-voice music — the rhythm is the DNA.' },
  },
  {
    prompt: { he: 'מהו "Scordatura" בפולק?', en: 'What is "scordatura" in folk music?' },
    correct: { he: 'כיוון לא-סטנדרטי של כלי מיתר שמוסיף צבע ייחודי לנגינה', en: 'Non-standard tuning of a string instrument that adds unique tonal color to the playing' },
    distractors: [{ he: 'טכניקת נגינה בה לוחצים על שני פרטים בו-זמנית', en: 'A technique of pressing two frets simultaneously' }, { he: 'כיוון שבו כל המיתרים על אותו גובה', en: 'Tuning where all strings are the same pitch' }, { he: 'שיטת כתיבת תווים מיוחדת', en: 'A special notation method for notes' }],
    explanation: { he: 'Scordatura = כל כיוון שאינו E-A-D-G-B-E הסטנדרטי. DADGAD, Open G, Open D — כולם scordatura. כל כיוון פותח אפשרויות ייחודיות.', en: 'Scordatura = any tuning other than standard E-A-D-G-B-E. DADGAD, Open G, Open D — all are scordatura. Each tuning opens unique possibilities.' },
    theory: { he: 'פולק ידוע ב-scordatura creative: Joni Mitchell לבדה השתמשה ביותר מ-50 כיוונים שונים. Nick Drake: CGCFCE ל-"Pink Moon". Michael Hedges: כיוונים אקסטרים כמו EEEEBE. כל כיוון משנה את ה-shapes ואת הצבעים הזמינים.', en: 'Folk is known for creative scordatura: Joni Mitchell alone used over 50 different tunings. Nick Drake: CGCFCE for "Pink Moon". Michael Hedges: extreme tunings like EEEEBE. Each tuning changes the available shapes and colors.' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מה הוא "Counterpoint" ואיך מופיע בפולק?', en: 'What is "counterpoint" and how does it appear in folk?' },
    correct: { he: 'שני קולות עצמאיים שנעים במקביל — ב-fingerstyle folk: מלודיה ובס נעים בעצמאות', en: 'Two independent voices moving simultaneously — in fingerstyle folk: melody and bass move independently' },
    distractors: [{ he: 'חיקוי של מנגינה על-ידי כלי שני', en: 'Imitation of a melody by a second instrument' }, { he: 'ניגוד בין קצב מהיר לאיטי', en: 'Contrast between fast and slow rhythm' }, { he: 'שינוי הרמוני חד בין שני אקורדים', en: 'Abrupt harmonic change between two chords' }],
    explanation: { he: 'ב-fingerstyle folk מתקדם: האגודל מנגן bass line עצמאית בעוד האצבעות מנגנות מלודיה בצד. זה Counterpoint על גיטרה יחידה.', en: 'In advanced fingerstyle folk: the thumb plays an independent bass line while fingers play the melody above. This is counterpoint on a single guitar.' },
    theory: { he: 'Bach כתב counterpoint שניתן לנגן על גיטרה (Cello Suites, Lute Suites). Leo Kottke, John Fahey, Michael Hedges הביאו counterpoint ל-folk גיטרה. Technique: thumb bass = quarter notes on beats 1-3; fingers = syncopated melody. מאתגר ביותר.', en: 'Bach wrote counterpoint performable on guitar (Cello Suites, Lute Suites). Leo Kottke, John Fahey, Michael Hedges brought counterpoint to folk guitar. Technique: thumb bass = quarter notes on beats 1-3; fingers = syncopated melody. Highly challenging.' },
  },
  {
    prompt: { he: 'מהו "Aeolian Mode" ולמה הוא שכיח בפולק?', en: 'What is "Aeolian mode" and why is it common in folk?' },
    correct: { he: 'המינור הטבעי (1-2-♭3-4-5-♭6-♭7) — מרגיש עתיק ומלנכולי, מוריש מסורת בלדות ישנות', en: 'The natural minor (1-2-♭3-4-5-♭6-♭7) — feels ancient and melancholic, inherited from old ballad tradition' },
    distractors: [{ he: 'מינור מלודי עם 6 ו-7 מורמים', en: 'Melodic minor with raised 6 and 7' }, { he: 'מז׳ור עם ♭6 ו-♭7', en: 'Major with ♭6 and ♭7' }, { he: 'מינור הרמוני עם 7 גדולה', en: 'Harmonic minor with major 7' }],
    explanation: { he: 'Aeolian = מינור טבעי = מצב ה-6 של המז׳ור. A אאוליאן = A-B-C-D-E-F-G = C מז׳ור מ-A. "Greensleeves", "Scarborough Fair", "House of the Rising Sun" — כולם Aeolian.', en: 'Aeolian = natural minor = 6th mode of major. A Aeolian = A-B-C-D-E-F-G = C major from A. "Greensleeves", "Scarborough Fair", "House of the Rising Sun" — all Aeolian.' },
    theory: { he: 'Aeolian מרגיש "קדום" כי הוא מצב טבעי שהיה בשימוש לפני הקדישה של מז׳ור/מינור. פרוגרסיה אאוליאן: Am-G-F-E (i-♭VII-♭VI-V) — נפוצה בפולק ובפלמנקו. Am-F-C-G (i-♭VI-♭III-♭VII) — "All Along the Watchtower", "Stairway to Heaven".', en: 'Aeolian feels "ancient" because it\'s a natural mode used before the codification of major/minor. Aeolian progression: Am-G-F-E (i-♭VII-♭VI-V) — common in folk and flamenco. Am-F-C-G (i-♭VI-♭III-♭VII) — "All Along the Watchtower", "Stairway to Heaven".' },
  },
  {
    prompt: { he: 'מהי "Alternate Bass" ו-"Carter Family Picking"?', en: 'What is "Alternate Bass" and "Carter Family Picking"?' },
    correct: { he: 'דפוס בו האגודל מנגן בס חלופי (בסיס-קווינטה) בזמן שהאצבעות strumming על מיתרים גבוהים', en: 'A pattern where the thumb alternates bass (root-fifth) while fingers strum higher strings' },
    distractors: [{ he: 'נגינת בס ומלודיה בידיים נפרדות', en: 'Playing bass and melody with separate hands' }, { he: 'strumming מהיר עם אגודל בלבד', en: 'Fast strumming with thumb only' }, { he: 'פיקינג של שלושה בסיסים ברצף', en: 'Picking three bass notes in sequence' }],
    explanation: { he: 'Carter Family Picking: אגודל = בסיס (root) → קווינטה → root → קווינטה. אצבעות = stroke מטה על מיתרים 1-3. יוצר ריתמוס "boom-chick".', en: 'Carter Family Picking: thumb = root → fifth → root → fifth. Fingers = downstroke on strings 1-3. Creates "boom-chick" rhythm.' },
    theory: { he: 'Mother Maybelle Carter פיתחה את הסגנון בשנות ה-20. השפיע על: Johnny Cash, Chet Atkins, ו-entire country/folk tradition. Pattern ב-G: G (מיתר 6) → D (מיתר 4) + strum → G (מיתר 6) → D (מיתר 4) + strum. 2 beats per cycle.', en: 'Mother Maybelle Carter developed this style in the 1920s. Influenced: Johnny Cash, Chet Atkins, and the entire country/folk tradition. Pattern in G: G (string 6) → D (string 4) + strum → G (string 6) → D (string 4) + strum. 2 beats per cycle.' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreFolkQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_folk',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
