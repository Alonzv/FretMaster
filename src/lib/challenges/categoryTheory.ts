// Pre-session theory explanations — shown before each challenge session.
// Each entry has a bilingual title, a short "hook" line, and 2–4 body paragraphs.

export interface CategoryTheoryEntry {
  titleHe: string
  titleEn: string
  hookHe: string
  hookEn: string
  paragraphsHe: string[]
  paragraphsEn: string[]
}

export const CATEGORY_THEORY: Partial<Record<string, CategoryTheoryEntry>> = {

  fretboard: {
    titleHe: 'הפרטבורד',
    titleEn: 'The Fretboard',
    hookHe: 'לדעת איפה כל תו — זה הבסיס של הכל',
    hookEn: 'Knowing where every note lives is the foundation of everything',
    paragraphsHe: [
      'הגיטרה מחולקת ל-6 מיתרים (מדק לבס: e B G D A E) ולסריגים (פרטים). כל סריג מעלה את התו בחצי-טון אחד. פרט 12 = אוקטבה שלמה מעל המיתר הפתוח.',
      'שמות התווים הם: C D E F G A B — ומשם חוזרים. בין E לF ובין B לC יש רק חצי-טון (בלי דיאז ביניהם). בין כל יתר השכנים יש טון שלם, ויכול להיות ביניהם תו דיאז (♯) או במול (♭).',
      'כדי ללמוד פרטבורד, כדאי להתחיל עם מיתר A (מיתר 5) וה-E הנמוך (מיתר 6): שם יושבות בסיסי כל אקורד. אחר כך להרחיב למיתרים הדקים. עם הזמן התווים ייזכרו אוטומטית.',
    ],
    paragraphsEn: [
      'The guitar has 6 strings (high to low: e B G D A E) and metal bars called frets. Each fret raises the pitch by one semitone. Fret 12 is exactly one octave above the open string.',
      'Note names are: C D E F G A B — then back to C. Between E–F and B–C there is only a half step (no sharp in between). Every other adjacent pair has a full step and a possible sharp (♯) or flat (♭) in between.',
      'A great starting point: learn the notes on the low E string and the A string first — that is where most chord roots sit. Then expand outward to the thinner strings. Repetition makes it automatic.',
    ],
  },

  note_reading: {
    titleHe: 'קריאת תווים',
    titleEn: 'Reading Music',
    hookHe: 'החמשה היא השפה הכתובה של המוזיקה',
    hookEn: 'The staff is the written language of music',
    paragraphsHe: [
      'החמשה היא 5 קווים מקבילים עליה כותבים תווים. מפתח הסול (𝄞) בתחילת השורה קובע ש-G4 יושב על הקו השני מלמטה. מכאן ניתן לגזור את כל שאר התווים.',
      'שמות התווים על הקווים (מלמטה): E G B D F — ניתן לזכור עם המשפט "Every Good Boy Does Fine". החללים ביניהם (מלמטה): F A C E — "FACE".',
      'תווים הגבוהים מהחמשה או הנמוכים ממנה כותבים עם קווי עזר. לדוגמה מי אמצעי (C4) נמוך בקו עזר אחד מתחת לחמשה.',
      'דיאז (♯) מעלה תו בחצי-טון, במול (♭) מוריד בחצי-טון. הם נרשמים ישירות לפני ראש התו.',
    ],
    paragraphsEn: [
      'The staff is 5 horizontal lines used to notate pitch. The treble clef (𝄞) at the start tells you that G4 sits on the second line from the bottom — everything else follows from there.',
      'Lines from bottom to top: E G B D F — remember with "Every Good Boy Does Fine." Spaces from bottom: F A C E — just "FACE".',
      'Notes above or below the staff use ledger lines. Middle C (C4) sits on one ledger line below the staff.',
      'A sharp (♯) raises a note by one semitone; a flat (♭) lowers it by one. They appear directly before the notehead.',
    ],
  },

  intervals_theory: {
    titleHe: 'אינטרוולים',
    titleEn: 'Intervals',
    hookHe: 'המרחק בין שני תווים קובע את הצליל שנשמע',
    hookEn: 'The distance between two notes defines the sound you hear',
    paragraphsHe: [
      'אינטרוול הוא המרחק בין שני תווים — נמדד בחצאי-טונים. ה-12 חצאי-הטון שבתוך אוקטבה אחת יוצרים 12 אינטרוולים ייחודיים, לכל אחד שם ואופי.',
      'האינטרוולים העיקריים: יוניסון (0), שניה (1–2), טרצה קטנה (3), טרצה גדולה (4), קוורטה (5), טריטון (6), קווינטה (5), שישית קטנה (8), שישית גדולה (9), שביעית קטנה (10), שביעית גדולה (11), אוקטבה (12).',
      'כדי לספור: בדוק כמה חצאי-טונים בין שני התווים. 4 חצאי-טונים = טרצה גדולה (המרחק שיוצר מז׳ור). 3 = טרצה קטנה (מינור). 7 = קווינטה מושלמת (הכי "יציב").',
      'אינטרוולים קטנים / גדולים / מושלמים / מוקטנים / מוגדלים — אלה שמות המתאר לסוג. לדוגמה קווינטה מושלמת (7 חצ"ט) לעומת קווינטה מוקטנת/טריטון (6 חצ"ט).',
    ],
    paragraphsEn: [
      'An interval is the distance between two notes, measured in semitones (half steps). Within one octave there are 12 unique intervals, each with a name and a distinctive sound.',
      'Key intervals: Unison (0), Minor 2nd (1), Major 2nd (2), Minor 3rd (3), Major 3rd (4), Perfect 4th (5), Tritone (6), Perfect 5th (7), Minor 6th (8), Major 6th (9), Minor 7th (10), Major 7th (11), Octave (12).',
      'To count: find how many semitones separate the two notes. 4 semitones = Major 3rd (the building block of major chords). 3 = Minor 3rd (minor chords). 7 = Perfect 5th (the most stable-sounding interval).',
      'Qualifier words — minor, major, perfect, diminished, augmented — describe the exact size. A Perfect 5th (7 half steps) vs a Diminished 5th / Tritone (6 half steps) sound completely different.',
    ],
  },

  circle_of_fifths: {
    titleHe: 'מעגל החמישיות',
    titleEn: 'Circle of Fifths',
    hookHe: 'כל יחסי הטוניקות, האקורדים והמפתחות — בתרשים אחד',
    hookEn: 'All key relationships, chords, and harmonic distance — in one diagram',
    paragraphsHe: [
      'מעגל החמישיות מסדר את 12 הטוניקות בצורת שעון. בין כל שעה לשעה הבאה (בכיוון השעון) מרחק של קווינטה מושלמת (7 חצאי-טונים). כך: C → G → D → A → E → B...',
      'ימין למעלה: הוספת דיאז. שמאל למעלה: הוספת במול. C מז׳ור (12 בשעון) לא כולל שינויים. G מז׳ור כולל דיאז אחד (F♯). D מז׳ור — שניים. וכן הלאה.',
      'שימוש מעשי: טוניקות קרובות במעגל = קרובות הרמונית (קל לעבור ביניהן). סולם מינור טבעי של כל מז׳ור נמצא 3 שעות שמאלה (הרלטיב מינור).',
      'ידיעת המעגל עוזרת להבין: אילו אקורדים "ישבו טוב" בסונג, כמה בכמה דיאזים/במולים יש בסולם, ואיך פרוגרסיות מוכרות (I–IV–V, ii–V–I) עובדות.',
    ],
    paragraphsEn: [
      'The circle of fifths arranges all 12 key notes around a clock. Moving clockwise, each step is a Perfect 5th (7 semitones) higher: C → G → D → A → E → B...',
      'Clockwise = sharps are added. Counter-clockwise = flats added. C major (12 o\'clock) has zero accidentals. G major has one sharp (F♯). D major has two. And so on.',
      'Practically: keys that sit close together on the circle are harmonically related — it is easy to modulate between them. The relative minor of any major key sits 3 steps counter-clockwise (e.g. A minor is the relative minor of C major).',
      'Knowing the circle helps you understand: which chords feel at home in a song, how many sharps/flats a key signature has, and why famous progressions (I–IV–V, ii–V–I) sound the way they do.',
    ],
  },

  chord_construction: {
    titleHe: 'בניית אקורדים',
    titleEn: 'Building Chords',
    hookHe: 'אקורד = בחירת תווים לפי נוסחה קצרה ופשוטה',
    hookEn: 'A chord = choosing notes by a short, simple formula',
    paragraphsHe: [
      'אקורד הוא שלושה תווים או יותר שמושמעים בו-זמנית. הטריאד הבסיסי בנוי מהדרגה ה-1 (טוניקה), ה-3 וה-5 של הסולם.',
      'ארבעת הטריאדים: מז׳ור (4+3 חצ"ט), מינור (3+4), מוקטן (3+3), מוגדל (4+4). כלומר: C מז׳ור = C E G. C מינור = C E♭ G. C מוקטן = C E♭ G♭.',
      'אקורדים של ארבע צלילים (sevenths) מוסיפים דרגת ה-7: C מז׳ור 7 = C E G B. C דומיננטי 7 = C E G B♭. הצליל ה-7 מוסיף מתח ועניין.',
      'בגיטרה אנו "מחסירים" לפעמים תווים מסוימים (בד"כ ה-5) ומשכפלים אחרים. העיקר הוא הטוניקה, הטרצה (שקובעת מז׳ור/מינור) ולעיתים ה-7.',
    ],
    paragraphsEn: [
      'A chord is three or more notes sounded together. The basic triad is built from the 1st (root), 3rd, and 5th scale degrees.',
      'The four triads: Major (4+3 semitones), Minor (3+4), Diminished (3+3), Augmented (4+4). So: C Major = C E G. C Minor = C E♭ G. C Diminished = C E♭ G♭.',
      'Four-note chords (sevenths) add the 7th scale degree: C Major 7 = C E G B. C Dominant 7 = C E G B♭. The 7th adds tension and colour.',
      'On the guitar we sometimes omit notes (often the 5th) and double others. What matters most: the root, the 3rd (defines major vs. minor), and optionally the 7th.',
    ],
  },

  scale_construction: {
    titleHe: 'בניית סולמות',
    titleEn: 'Building Scales',
    hookHe: 'סולם = נוסחה של טונים וחצאי-טונים — ואין יותר מזה',
    hookEn: 'A scale = a formula of whole and half steps — that is all there is to it',
    paragraphsHe: [
      'סולם הוא רצף של 7 תווים (בד"כ) המסודרים לפי נוסחה קבועה של מרחקים. הנוסחה קובעת את ה"אופי" של הסולם.',
      'סולם מז׳ורי: T T H T T T H (T = טון, H = חצי-טון). לדוגמה, C מז׳ור: C D E F G A B C. E—F וB—C הם חצאי-טונים.',
      'סולם מינור טבעי: T H T T H T T. בונה מינור = מוריד את 3, 6, 7 של המז׳ור בחצי-טון. A מינור: A B C D E F G A.',
      'סולם פנטטוני (מינור): T H T T T — 5 תווים בלבד, בלי חצאי-טונים "חריפים". לכן הוא נשמע "בטוח" ושמישי לאימפרוביזציה. מודוסים (דוריאן, פריגיאן, לידיאן...) הם וריאציות על אותם 7 תווים בנקודות התחלה שונות.',
    ],
    paragraphsEn: [
      'A scale is a sequence of (usually 7) notes arranged by a fixed formula of intervals. The formula determines the scale\'s character.',
      'Major scale formula: W W H W W W H (W = whole step, H = half step). C major: C D E F G A B C. The half steps fall between E–F and B–C.',
      'Natural minor formula: W H W W H W W. In short: lower the 3rd, 6th, and 7th of the major scale by a half step. A minor: A B C D E F G A.',
      'Pentatonic minor: W H W W W — only 5 notes, with no "sharp" half steps, which is why it sounds smooth and is great for soloing. Modes (Dorian, Phrygian, Lydian…) are just the same 7 notes of a major scale starting on a different degree.',
    ],
  },

  // Fallback for daily mixed session
  _daily: {
    titleHe: 'אתגר יומי מעורב',
    titleEn: 'Daily Mix',
    hookHe: '10 שאלות — מכל הקטגוריות',
    hookEn: '10 questions — from every category',
    paragraphsHe: [
      'הסשן של היום ישאל אותך שאלות מכל קטגוריות התאוריה שלמדנו — פרטבורד, קריאת תווים, אינטרוולים, מעגל החמישיות, בניית אקורדים ובניית סולמות.',
      'אין צורך לדעת הכל מראש. אחרי כל שאלה תקבל הסבר מדוע התשובה היא מה שהיא. ככה לומדים — מהטעויות.',
      'ברגע שתבחר תשובה, תראה מיד אם צדקת. בסוף הסשן יהיה סיכום של כל הטעויות עם הסברים.',
    ],
    paragraphsEn: [
      'Today\'s session will ask you questions from every theory category: fretboard, note reading, intervals, circle of fifths, chord construction, and scale building.',
      'You do not need to know everything upfront. After each question you will see an explanation of why the answer is what it is. That is how it sticks — learning from mistakes.',
      'The moment you pick an answer, you get instant feedback. At the end you will see a full summary of every mistake with explanations.',
    ],
  },
}
