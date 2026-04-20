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
    prompt: { he: 'מה הוא "The One" בפאנק?', en: 'What is "The One" in funk?' },
    correct: { he: 'הזמן הראשון של כל תיבה — הדגש החזק שסביבו הכל מאורגן', en: 'The first beat of every bar — the strong downbeat around which everything is organized' },
    distractors: [{ he: 'הזמן האחרון של כל תיבה — הנחיתה אחרי ה-groove', en: 'The last beat of every bar — the landing after the groove' }, { he: 'ה-upbeat לפני תחילת התיבה', en: 'The upbeat before the bar starts' }, { he: 'הזמן השני בתיבה — הדגש של הסנר', en: 'The second beat in the bar — the snare accent' }],
    explanation: { he: '"Hit it on the one!" — James Brown. בפאנק, כולם מתכנסים ל-beat 1 של כל תיבה. ה"One" הוא המרכז הריתמי של הסגנון.', en: '"Hit it on the one!" — James Brown. In funk, everyone converges on beat 1 of every bar. "The One" is the rhythmic center of the style.' },
    theory: { he: 'James Brown פיתח תפיסת "The One" עם ה-JBs בשנות ה-60. בניגוד ל-jazz שמדגיש את ה-2 וה-4, ובניגוד לרוק שמדגיש 2+4 עם סנר — פאנק כולל מרכז כל דבר ב-beat 1. "Sex Machine", "Cold Sweat" — הכל מתנקז ל-one.', en: 'James Brown developed the concept of "The One" with the JBs in the 1960s. Unlike jazz emphasizing beats 2 and 4, and unlike rock with snare on 2+4 — funk organizes everything around beat 1. "Sex Machine", "Cold Sweat" — everything flows to the one.' },
  },
  {
    prompt: { he: 'מה הוא "Wah-Wah Pedal" ותפקידו בפאנק?', en: 'What is the "Wah-Wah Pedal" and its role in funk?' },
    correct: { he: 'פדל שמסנן תדרים דינמית לפי תנועת הרגל — יוצר ביטוי "ווה-ווה" קצבי', en: 'A pedal that dynamically filters frequencies based on foot movement — creates rhythmic "wah-wah" expression' },
    distractors: [{ he: 'פדל ריוורב מיוחד לפאנק', en: 'A special reverb pedal for funk' }, { he: 'פדל שמנחית גובה צליל', en: 'A pedal that lowers pitch' }, { he: 'פדל שמשפר המלודיה', en: 'A pedal that enhances melody' }],
    explanation: { he: 'Wah = filter envelope שנשלט ברגל. בפאנק משתמשים בו כ"כלי קצב" — תנועת הרגל מסנכרנת עם ה-groove. Jimi Hendrix, Isaac Hayes, Nile Rodgers.', en: 'Wah = foot-controlled filter envelope. In funk it\'s used as a "rhythmic instrument" — foot movement syncs with the groove. Jimi Hendrix, Isaac Hayes, Nile Rodgers.' },
    theory: { he: 'Wah שימוש בפאנק: "scratch" wah (קצר וחד) לעקב על 16th notes. Auto-wah (envelope filter) = wah אוטומטי שמגיב לחוזק הנגינה. Bootsy Collins השתמש ב-envelope filter ב-bass. "Theme from Shaft" - Isaac Hayes: wah קלאסי.', en: 'Wah use in funk: "scratch" wah (short and sharp) to accent 16th notes. Auto-wah (envelope filter) = automatic wah responding to playing strength. Bootsy Collins used envelope filter on bass. "Theme from Shaft" - Isaac Hayes: classic wah.' },
  },
  {
    prompt: { he: 'מהי "Syncopation" ומדוע היא מרכזית בפאנק?', en: 'What is "syncopation" and why is it central to funk?' },
    correct: { he: 'דגש על זמנים חלשים או בין-זמנים (upbeats) במקום זמנים חזקים — יוצר מתח ריתמי', en: 'Emphasis on weak beats or off-beats (upbeats) instead of strong beats — creates rhythmic tension' },
    distractors: [{ he: 'חזרה על אותו ריתמוס פעמיים ברצף', en: 'Repeating the same rhythm twice in sequence' }, { he: 'נגינה קצת לפני הזמן', en: 'Playing slightly before the beat' }, { he: 'שינוי טמפו פתאומי', en: 'Sudden tempo change' }],
    explanation: { he: 'בפאנק, הגיטרה והבס מנגנים לעתים קרובות על ה-"&" (upbeat) ולא על הזמן החזק. זה יוצר את ה-"groove" — המתח בין המה שמצופה למה שמנוגן.', en: 'In funk, guitar and bass often play on the "&" (upbeat) rather than the strong beat. This creates the "groove" — the tension between what\'s expected and what\'s played.' },
    theory: { he: 'Syncopation = הלב של פאנק, hip-hop, ו-R&B. ביטוי "1-e-&-a": הסימביות על "&" הן syncopated. James Brown: בס על beat 1, גיטרה על "&". Prince, Stevie Wonder — masters of syncopation. "Superstition" - Wonder: מוטיב 16th-note syncopated.', en: 'Syncopation = the heart of funk, hip-hop, and R&B. In "1-e-&-a" notation: accents on "&" are syncopated. James Brown: bass on beat 1, guitar on "&". Prince, Stevie Wonder — masters of syncopation. "Superstition" - Wonder: syncopated 16th-note motif.' },
  },
  {
    prompt: { he: 'מהו "Scratch Rhythm" בגיטרת פאנק?', en: 'What is "scratch rhythm" in funk guitar?' },
    correct: { he: 'חסימת מיתרים עם יד שמאל לצלילים דממים בעוד יד ימין strumming — יוצר "chk-chk" קצבי', en: 'Muting strings with left hand for dead sounds while right hand strums — creates rhythmic "chk-chk"' },
    distractors: [{ he: 'נגינה בפיק מחוספס ליצירת רעש', en: 'Playing with a rough pick to create noise' }, { he: 'scratching מיתרים עם ציפורן', en: 'Scratching strings with a fingernail' }, { he: 'נגינה מהירה של שמיניות על מיתר בודד', en: 'Fast eighth notes on a single string' }],
    explanation: { he: 'Scratch = יד שמאל מונחת על המיתרים (לא לוחצת) + strumming מהיר. יוצר "X" נוטה בתוי מוסיקה. הבסיס של rhythmic funk guitar playing.', en: 'Scratch = left hand resting on strings (not pressing) + fast strumming. Creates "X" noteheads in music notation. The foundation of rhythmic funk guitar playing.' },
    theory: { he: 'Nile Rodgers (Chic) הוא מאסטר ה-scratch rhythm. "Le Freak", "Good Times" — scratch rhythm קלאסי. Pattern נפוץ: 16th notes עם mute על זמנים חלשים, שמע על חזקים. Rhythmic guitar בפאנק = percussion instrument לכל דבר.', en: 'Nile Rodgers (Chic) is the master of scratch rhythm. "Le Freak", "Good Times" — classic scratch rhythm. Common pattern: 16th notes with mutes on weak beats, sound on strong. Rhythmic guitar in funk = a percussion instrument.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מהם "Extended Chords" בפאנק?', en: 'What are "extended chords" in funk?' },
    correct: { he: 'אקורדים עם 9, 11, 13 — כמו dominant 9th, minor 11th — שמוסיפים עושר הרמוני ייחודי', en: 'Chords with 9, 11, 13 extensions — like dominant 9th, minor 11th — adding unique harmonic richness' },
    distractors: [{ he: 'אקורדים שמנוגנים על פרטים גבוהים', en: 'Chords played on high frets' }, { he: 'אקורדים עם ברה מורחב על 6 מיתרים', en: 'Chords with extended barre across 6 strings' }, { he: 'אקורדים עם בסיס נמוך', en: 'Chords with a low bass note' }],
    explanation: { he: 'פאנק אוהב dom9 (E9 = E-G#-B-D-F#), m11 (Am11), 13th. Jimi Hendrix ידוע ב-E9 שלו. Nile Rodgers מנגן Am7-D9 grooves.', en: 'Funk loves dom9 (E9 = E-G#-B-D-F#), m11 (Am11), 13th. Jimi Hendrix is known for his E9. Nile Rodgers plays Am7-D9 grooves.' },
    theory: { he: 'E9 על גיטרה: 0-7-6-7-9-0 (open E + frets). אקורד זה = הטביעת האצבע של funk guitar. "Purple Haze" - Hendrix: E7#9 ("the Hendrix chord" = E-G#-B-D-G). "Le Freak" - Chic: Gm9. Extended chords מאפשרים richness בלי שינוי תכוף.', en: 'E9 on guitar: 0-7-6-7-9-0 (open E + frets). This chord = the fingerprint of funk guitar. "Purple Haze" - Hendrix: E7#9 ("the Hendrix chord" = E-G#-B-D-G). "Le Freak" - Chic: Gm9. Extended chords allow richness without frequent changes.' },
  },
  {
    prompt: { he: 'מהו "The Hendrix Chord" (E7#9)?', en: 'What is "The Hendrix Chord" (E7#9)?' },
    correct: { he: 'E-G#-B-D-G — דומיננט 7 עם #9 (תשיעית מוגדלת) — שילוב ייחודי של מז׳ור ומינור', en: 'E-G#-B-D-G — dominant 7 with #9 (augmented ninth) — unique combination of major and minor' },
    distractors: [{ he: 'E-G#-B-D-F# — דומיננט 9 רגיל', en: 'E-G#-B-D-F# — regular dominant 9' }, { he: 'E-G-B-D-G — מינור 7 עם 11', en: 'E-G-B-D-G — minor 7 with 11' }, { he: 'E-G#-B-D — דומיננט 7 ללא הרחבות', en: 'E-G#-B-D — dominant 7 without extensions' }],
    explanation: { he: 'E7#9 = E-G#-B-D-G(#9=G♮). ה-G# (3 גדולה, מז׳ור) + G♮ (#9 = כמו ♭3, מינור) בו-זמנית. יוצר מתח דיסוננטי-מרגש שאופייני לפאנק ולבלוז-רוק.', en: 'E7#9 = E-G#-B-D-G(#9=G♮). The G# (major 3) + G♮ (#9 = like ♭3, minor) simultaneously. Creates dissonant-exciting tension typical of funk and blues-rock.' },
    theory: { he: '"Purple Haze" פותח ב-E7#9. Hendrix השתמש באקורד הזה לעתים קרובות כי הוא מכיל מז׳ור ומינור ביחד — "ambiguous" ומלא אנרגיה. על גיטרה: 0-7-6-7-8-x. עוד שמות: "Voodoo chord", "Purple chord".', en: '"Purple Haze" opens with E7#9. Hendrix used this chord often because it contains major and minor simultaneously — "ambiguous" and full of energy. On guitar: 0-7-6-7-8-x. Other names: "Voodoo chord", "Purple chord".' },
  },
  {
    prompt: { he: 'מה ההבדל בין "Straight 16ths" ל-"Swung 16ths" בפאנק?', en: 'What is the difference between "straight 16ths" and "swung 16ths" in funk?' },
    correct: { he: 'Straight = שישיות עשרה שוות בזמן; Swung = עם triplet feel — הראשון ארוך, השני קצר', en: 'Straight = equal sixteenth notes; Swung = with triplet feel — first is long, second is short' },
    distractors: [{ he: 'Straight = ריתמוס של 4/4; Swung = ריתמוס של 6/8', en: 'Straight = 4/4 rhythm; Swung = 6/8 rhythm' }, { he: 'Straight = מהיר; Swung = איטי', en: 'Straight = fast; Swung = slow' }, { he: 'Straight = בס; Swung = גיטרה', en: 'Straight = bass; Swung = guitar' }],
    explanation: { he: 'פאנק מודרני = straight 16ths (Earth, Wind & Fire, Prince). פאנק ישן/New Orleans = swung 16ths (Dr. John, The Meters). שניהם "פאנק" אבל מרגישים שונה לחלוטין.', en: 'Modern funk = straight 16ths (Earth, Wind & Fire, Prince). Old-school/New Orleans funk = swung 16ths (Dr. John, The Meters). Both are "funk" but feel completely different.' },
    theory: { he: 'Swung 16ths = triplet subdivision: 1-e-&-a → 1 ארוך, e קצר. The Meters ידועים ב-"second line" New Orleans groove עם swung feel. Prince ב-"Kiss" משתמש ב-straight 16ths פשוטים ומינימליסטיים. James Brown = בין הדרכים, עם micro-timing ייחודי.', en: 'Swung 16ths = triplet subdivision: 1-e-&-a → 1 is long, e is short. The Meters are known for "second line" New Orleans groove with swung feel. Prince in "Kiss" uses simple, minimalist straight 16ths. James Brown = between the two, with unique micro-timing.' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מהי "Rhythmic Displacement" בפאנק?', en: 'What is "rhythmic displacement" in funk?' },
    correct: { he: 'הזזת דפוס ריתמי ב-16th note אחד או יותר — אותו motif מתחיל במקום שונה בתיבה', en: 'Shifting a rhythmic pattern by one or more 16th notes — the same motif starts at a different position in the bar' },
    distractors: [{ he: 'שינוי הדגש מזמן חזק לחלש', en: 'Changing accent from strong to weak beat' }, { he: 'נגינת הריתמוס בסולם אחר', en: 'Playing the rhythm in a different key' }, { he: 'הזזת כל הלהקה לקצב אחר', en: 'Moving the whole band to a different tempo' }],
    explanation: { he: 'Displacement = לקחת groove ולהזיז אותו 16th אחד. Pattern שמתחיל על beat 1 יתחיל על "1-e" (16th אחד אחרי). יוצר תחושה "off" מרגשת.', en: 'Displacement = take a groove and shift it by one 16th. A pattern starting on beat 1 will start on "1-e" (one 16th later). Creates an exciting "off" feeling.' },
    theory: { he: 'Meshuggah (מטאל), Herbie Hancock (jazz), Stevie Wonder — כולם משתמשים ב-displacement. בפאנק: Clyde Stubblefield (JBs drummer) נוגן grooves שנראות "חסרות" אבל מרגישות מושלמות — כי הן displaced. "Funky Drummer" - James Brown: הריתמוס displaced ב-16th שיוצר את ה-magic.', en: 'Meshuggah (metal), Herbie Hancock (jazz), Stevie Wonder — all use displacement. In funk: Clyde Stubblefield (JBs drummer) played grooves that seem "missing" but feel perfect — because they\'re displaced. "Funky Drummer" - James Brown: rhythm displaced by 16th that creates the magic.' },
  },
  {
    prompt: { he: 'מהו "Polyrhythm" בפאנק?', en: 'What is "polyrhythm" in funk?' },
    correct: { he: 'שני ריתמוסים שונים בו-זמנית — כגון בס ב-3 נגד גיטרה ב-4 (3:4)', en: 'Two different rhythms simultaneously — e.g., bass in 3 against guitar in 4 (3:4)' },
    distractors: [{ he: 'שינוי חתימת זמן בין כלים שונים', en: 'Different time signatures between instruments' }, { he: 'נגינה של אותו ריתמוס בגבהים שונים', en: 'Playing the same rhythm at different pitches' }, { he: 'ריתמוס שמשנה טמפו לאורך הנגינה', en: 'Rhythm that changes tempo throughout the piece' }],
    explanation: { he: 'בפאנק אפריקאי, 3:4 polyrhythm נפוץ: התוף משחק ב-3 בזמן שהבס משחק ב-4. יוצר groove "מסתחרר" שקשה לעמוד על מקום לצלילים.', en: 'In African funk, 3:4 polyrhythm is common: the drum plays in 3 while the bass plays in 4. Creates a "spinning" groove that makes you unable to stand still.' },
    theory: { he: 'Fela Kuti (afrobeat) = polyrhythm מאסטר. "Water No Get Enemy": 3:4 בין כלים שונים. Tony Williams, Elvin Jones (jazz drummers) גם משתמשים בזה. בפאנק: גיטרה ב-4, קלאבס (clave) ב-3+2. Clave הוא מרכז הריתמוס האפרו-קובני שהשפיע על פאנק ו-salsa.', en: 'Fela Kuti (afrobeat) = polyrhythm master. "Water No Get Enemy": 3:4 between different instruments. Tony Williams, Elvin Jones (jazz drummers) also use this. In funk: guitar in 4, claves in 3+2. Clave is the center of Afro-Cuban rhythm that influenced funk and salsa.' },
  },
  {
    prompt: { he: 'מה הוא "Clave" ומה חשיבותו לפאנק?', en: 'What is "clave" and why is it important to funk?' },
    correct: { he: 'דפוס ריתמי אפרו-קובני של 3+2 (או 2+3) שמשמש כ"עמוד שדרה" הריתמי', en: 'An Afro-Cuban rhythmic pattern of 3+2 (or 2+3) serving as the rhythmic "backbone"' },
    distractors: [{ he: 'כלי הקשה קובני שמנוגן בכל שיר פאנק', en: 'A Cuban percussion instrument played in every funk song' }, { he: 'שם של פרוגרסיית אקורדים אפריקאית', en: 'Name of an African chord progression' }, { he: 'טכניקת strumming מיוחדת ממערב אפריקה', en: 'A special strumming technique from West Africa' }],
    explanation: { he: 'Clave (3-2): ♩ ♩ ♩ | ♩ ♩. כלי הקשה (clave sticks) מנגנים דפוס זה. שורש הסלסה, הסמבה, ה-afrobeat, ובסופו של דבר — הפאנק וה-hip-hop.', en: 'Clave (3-2): ♩ ♩ ♩ | ♩ ♩. Clave sticks play this pattern. The root of salsa, samba, afrobeat, and ultimately — funk and hip-hop.' },
    theory: { he: 'West African rhythms הגיעו לאמריקה עם העבדות → New Orleans second line → Funk. Clave מופיע ב: "Cissy Strut" (The Meters), שירי Fela Kuti, ו-hip-hop beats. פנינה: ה"funkiest" grooves הם לרוב clave-based. Questlove, ?uestlove מדבר על clave בכל ראיון.', en: 'West African rhythms arrived in America with slavery → New Orleans second line → Funk. Clave appears in: "Cissy Strut" (The Meters), Fela Kuti songs, and hip-hop beats. The "funkiest" grooves are usually clave-based. Questlove discusses clave in every interview.' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreFunkQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_funk',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
