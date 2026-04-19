// Glossary of music-theory terms. Every term that appears in an explanation or theory
// block should have an entry here — the UI wraps matching substrings with a hover
// tooltip so the user can learn terminology without leaving the question.

export interface GlossaryEntry {
  termHe: string             // exact substring to match in Hebrew text
  termEn: string             // exact substring to match in English text
  definitionHe: string
  definitionEn: string
}

export const GLOSSARY: GlossaryEntry[] = [
  // ── Intervals ───────────────────────────────────────────────────────────
  {
    termHe: 'רלטיב מינור',
    termEn: 'relative minor',
    definitionHe: 'סולם מינור שחולק את אותם התווים עם סולם מז׳ור מסוים, אבל מתחיל מהדרגה השישית שלו. למשל: A מינור הוא הרלטיב מינור של C מז׳ור — שניהם משתמשים באותם 7 תווים.',
    definitionEn: 'A minor key that shares the exact same notes as a given major key but starts on the 6th degree. Example: A minor is the relative minor of C major — both use the same 7 notes.',
  },
  {
    termHe: 'טריטון',
    termEn: 'tritone',
    definitionHe: 'אינטרוול של 6 חצאי-טונים — חצי האוקטבה בדיוק. זה האינטרוול הכי דיסוננטי וחסר מנוחה במוזיקה טונלית, ובתקופות קדומות נאסר לשימוש.',
    definitionEn: 'An interval of 6 semitones — exactly half an octave. It is the most dissonant, restless interval in tonal music; medieval theorists actually banned it from church music.',
  },
  {
    termHe: 'אוקטבה',
    termEn: 'octave',
    definitionHe: 'המרחק בין תו אחד לתו הבא עם אותו שם (למשל מ-C ל-C הבא). 12 חצאי-טונים, והצליל נשמע "זהה" אבל גבוה יותר או נמוך יותר.',
    definitionEn: 'The distance between a note and the next note with the same name (e.g. C to the next C). 12 semitones apart — the pitch sounds "the same" but higher or lower.',
  },
  {
    termHe: 'חצי-טון',
    termEn: 'semitone',
    definitionHe: 'המרחק המוזיקלי הקטן ביותר במוזיקה מערבית. על הגיטרה, כל סריג הוא חצי-טון. 12 חצאי-טונים ממלאים אוקטבה.',
    definitionEn: 'The smallest musical distance in Western music. On guitar, each fret is one semitone. 12 semitones fill an octave.',
  },
  {
    termHe: 'אינטרוול',
    termEn: 'interval',
    definitionHe: 'המרחק בין שני תווים, נמדד בחצאי-טונים. כל אינטרוול נשמע שונה — קווינטה נשמעת יציבה, טריטון נשמע חסר מנוח, טרצה גדולה נשמעת שמחה.',
    definitionEn: 'The distance between two notes, measured in semitones. Each interval has a distinct sound — a fifth sounds stable, a tritone sounds restless, a major third sounds bright.',
  },
  {
    termHe: 'קווינטה',
    termEn: 'perfect fifth',
    definitionHe: 'אינטרוול של 7 חצאי-טונים. האינטרוול הכי יציב אחרי האוקטבה, ולכן הבסיס לבניית אקורדים.',
    definitionEn: 'An interval of 7 semitones. The most stable interval after the octave, and the foundation of chord-building.',
  },
  {
    termHe: 'טרצה',
    termEn: 'third',
    definitionHe: 'אינטרוול של 3 או 4 חצאי-טונים. טרצה גדולה (4) נשמעת מז׳ורית, טרצה קטנה (3) נשמעת מינורית. זה התו שקובע אם אקורד שמח או עצוב.',
    definitionEn: 'An interval of 3 or 4 semitones. A major third (4) sounds bright, a minor third (3) sounds sad. This is the note that decides whether a chord feels happy or sad.',
  },

  // ── Chords / keys ───────────────────────────────────────────────────────
  {
    termHe: 'טוניקה',
    termEn: 'tonic',
    definitionHe: 'התו הראשון והמרכזי של הסולם. הוא "הבית" — כל המוזיקה שואפת לחזור אליו.',
    definitionEn: 'The first and central note of a key. It is "home" — all the music gravitates back to it.',
  },
  {
    termHe: 'דיאטוני',
    termEn: 'diatonic',
    definitionHe: 'שייך לסולם. אקורד דיאטוני הוא אקורד שנבנה רק מתווי הסולם הנוכחי, בלי הוספות חיצוניות.',
    definitionEn: 'Belonging to the key. A diatonic chord uses only notes from the current scale, with no outside additions.',
  },
  {
    termHe: 'דיאז',
    termEn: 'sharp',
    definitionHe: 'סימן (♯) שמעלה את התו בחצי-טון. למשל F# הוא F הרגיל פלוס סריג אחד על הגיטרה.',
    definitionEn: 'A symbol (♯) that raises a note by one semitone. For example, F♯ is F moved up one fret on the guitar.',
  },
  {
    termHe: 'במול',
    termEn: 'flat',
    definitionHe: 'סימן (♭) שמוריד את התו בחצי-טון. למשל Bb הוא B הרגיל פחות סריג אחד על הגיטרה.',
    definitionEn: 'A symbol (♭) that lowers a note by one semitone. For example, B♭ is B moved down one fret on the guitar.',
  },
  {
    termHe: 'מז׳ור',
    termEn: 'major',
    definitionHe: 'איכות שמחה ומוארת. סולם מז׳ור בנוי מתבנית ספציפית של חצאי-טונים וטונים שלמים (T-T-ח-T-T-T-ח).',
    definitionEn: 'A bright, happy quality. A major scale is built from a specific pattern of whole- and half-steps (W-W-H-W-W-W-H).',
  },
  {
    termHe: 'מינור',
    termEn: 'minor',
    definitionHe: 'איכות מלנכולית ועצובה. סולם מינור משתמש בטרצה קטנה במקום טרצה גדולה.',
    definitionEn: 'A melancholy, darker quality. A minor scale uses a minor third instead of a major third.',
  },
  {
    termHe: 'מעגל החמישיות',
    termEn: 'circle of fifths',
    definitionHe: 'דיאגרמה שמסדרת את 12 הסולמות לפי מרחק של קווינטה. כל צעד ימינה מוסיף דיאז, כל צעד שמאלה מוסיף במול.',
    definitionEn: 'A diagram arranging the 12 keys by fifths. Each step clockwise adds a sharp; each step counter-clockwise adds a flat.',
  },
  {
    termHe: 'פרוגרסיה',
    termEn: 'progression',
    definitionHe: 'רצף של אקורדים שיוצר תנועה הרמונית. למשל I-V-vi-IV היא הפרוגרסיה הכי מפורסמת במוזיקת פופ.',
    definitionEn: 'A sequence of chords that creates harmonic motion. I-V-vi-IV is the most famous progression in pop music.',
  },
  {
    termHe: 'דרגה',
    termEn: 'degree',
    definitionHe: 'מספר שמייצג את המיקום של תו או אקורד בסולם. מסמנים את זה בספרות רומיות: I (ראשון), ii (שני) וכו׳.',
    definitionEn: 'A number indicating the position of a note or chord in the scale. Written with Roman numerals: I (first), ii (second), etc.',
  },
  {
    termHe: 'מוקטן',
    termEn: 'diminished',
    definitionHe: 'אקורד עם טרצה קטנה וקווינטה מוקטנת (טריטון). נשמע דרמטי ומתוח.',
    definitionEn: 'A chord with a minor third and a diminished fifth (tritone). Sounds tense and dramatic.',
  },
  {
    termHe: 'מוגדל',
    termEn: 'augmented',
    definitionHe: 'אקורד עם טרצה גדולה וקווינטה מוגדלת. נשמע מיסטי ולא-רגוע.',
    definitionEn: 'A chord with a major third and an augmented fifth. Sounds mysterious and unresolved.',
  },

  // ── Scale family ────────────────────────────────────────────────────────
  {
    termHe: 'פנטטוני',
    termEn: 'pentatonic',
    definitionHe: 'סולם של 5 תווים (במקום 7). הכי נפוץ: פנטטוני מינור — הסולם הראשון שכל גיטריסט לומד לסולו בלוז.',
    definitionEn: 'A 5-note scale (instead of 7). The most common is the minor pentatonic — the first scale every guitarist learns for blues solos.',
  },
  {
    termHe: 'מודוסים',
    termEn: 'modes',
    definitionHe: 'וריאציות של סולם המז׳ור, כל אחת מתחילה מדרגה אחרת. Ionian (1), Dorian (2), Phrygian (3), Lydian (4), Mixolydian (5), Aeolian (6), Locrian (7).',
    definitionEn: 'Variations of the major scale, each starting on a different degree. Ionian (1), Dorian (2), Phrygian (3), Lydian (4), Mixolydian (5), Aeolian (6), Locrian (7).',
  },
  {
    termHe: 'פרטבורד',
    termEn: 'fretboard',
    definitionHe: 'הצוואר של הגיטרה, המקום שבו לוחצים על המיתרים. מורכב מסריגים, מיתרים, וסימני אוריינטציה (inlays).',
    definitionEn: 'The neck of the guitar, where you press the strings. Made up of frets, strings, and position markers (inlays).',
  },
  {
    termHe: 'סריג',
    termEn: 'fret',
    definitionHe: 'פס המתכת הדק על הצוואר של הגיטרה. כל סריג מפריד בין שני חצאי-טונים סמוכים.',
    definitionEn: 'The thin metal bar on the guitar\'s neck. Each fret separates two adjacent semitones.',
  },
]
