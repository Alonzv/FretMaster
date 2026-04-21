import type { CategoryId, Difficulty } from '../challenges/types'
import type { TreeNode } from '../skilltree/treeData'

// ── Factory helper ─────────────────────────────────────────────────────────────
// Generates a 25-node linear-ish tree for one topic.
// Nodes 0-8: easy (9), 9-17: medium (9), 18-24: hard (7).

interface NodeSpec {
  titleHe: string
  titleEn: string
  descHe: string
  descEn: string
  /** Extra IDs (within this topic) this node depends on beyond the previous one */
  extraReq?: string[]
}

function makeTopic(
  categoryId: CategoryId,
  icon: string,
  easy: NodeSpec[],    // 9 nodes
  medium: NodeSpec[],  // 9 nodes
  hard: NodeSpec[],    // 7 nodes
): TreeNode[] {
  const prefix = categoryId
  const nodes: TreeNode[] = []

  const all: Array<{ spec: NodeSpec; diff: Difficulty; xp: number }> = [
    ...easy.map(s  => ({ spec: s, diff: 'easy'   as Difficulty, xp: 20 })),
    ...medium.map(s => ({ spec: s, diff: 'medium' as Difficulty, xp: 35 })),
    ...hard.map(s  => ({ spec: s, diff: 'hard'   as Difficulty, xp: 55 })),
  ]

  all.forEach((item, idx) => {
    const id = `${prefix}_${String(idx + 1).padStart(2, '0')}`
    const prevId = idx > 0 ? `${prefix}_${String(idx).padStart(2, '0')}` : null
    const requires: string[] = prevId ? [prevId] : []
    if (item.spec.extraReq) {
      for (const extra of item.spec.extraReq) {
        const extraId = `${prefix}_${String(Number(extra)).padStart(2, '0')}`
        if (!requires.includes(extraId)) requires.push(extraId)
      }
    }
    nodes.push({
      id,
      categoryId,
      difficulty: item.diff,
      titleHe: item.spec.titleHe,
      titleEn: item.spec.titleEn,
      descHe: item.spec.descHe,
      descEn: item.spec.descEn,
      requires,
      xpReward: item.xp,
      icon,
    })
  })
  return nodes
}

// ── major_scale ───────────────────────────────────────────────────────────────

const MAJOR_SCALE_NODES = makeTopic(
  'major_scale',
  'M12 3l1.45 4.47H18l-3.73 2.71 1.42 4.38L12 11.9l-3.69 2.66 1.42-4.38L6 7.47h4.55L12 3z',
  [
    { titleHe: 'נוסחת הסולם', titleEn: 'Scale Formula', descHe: 'טון-טון-חצי-טון-טון-טון-טון-חצי', descEn: 'W-W-H-W-W-W-H pattern' },
    { titleHe: 'סולם C מז׳ור', titleEn: 'C Major Scale', descHe: 'שבעת התווים הטבעיים', descEn: 'The seven natural notes' },
    { titleHe: 'סולם G מז׳ור', titleEn: 'G Major Scale', descHe: 'סולם עם דיאז אחד (F#)', descEn: 'One sharp key (F#)' },
    { titleHe: 'סולם D מז׳ור', titleEn: 'D Major Scale', descHe: 'שני דיאזים: F#, C#', descEn: 'Two sharps: F#, C#' },
    { titleHe: 'סולם F מז׳ור', titleEn: 'F Major Scale', descHe: 'סולם עם במול אחד (Bb)', descEn: 'One flat key (Bb)' },
    { titleHe: 'דרגות הסולם', titleEn: 'Scale Degrees', descHe: 'I II III IV V VI VII — שמות הדרגות', descEn: 'I II III IV V VI VII — naming degrees' },
    { titleHe: 'טטרכורד', titleEn: 'Tetrachord', descHe: 'פיצול הסולם לשתי חצאות', descEn: 'Splitting the scale into two halves' },
    { titleHe: 'תוו רגיש', titleEn: 'Leading Tone', descHe: 'הדרגה השביעית נמשכת לשמינית', descEn: 'The seventh degree pulls to the octave' },
    { titleHe: 'מאיוה עד פה', titleEn: 'Solfege Basics', descHe: 'דו רה מי פה סול לה סי דו', descEn: 'Do Re Mi Fa Sol La Ti Do' },
  ],
  [
    { titleHe: 'סולם A מז׳ור', titleEn: 'A Major Scale', descHe: 'שלושה דיאזים: F# C# G#', descEn: 'Three sharps: F# C# G#' },
    { titleHe: 'סולם E מז׳ור', titleEn: 'E Major Scale', descHe: 'ארבעה דיאזים: F# C# G# D#', descEn: 'Four sharps: F# C# G# D#' },
    { titleHe: 'סולם Bb מז׳ור', titleEn: 'Bb Major Scale', descHe: 'שני במולים: Bb Eb', descEn: 'Two flats: Bb Eb' },
    { titleHe: 'סולם Eb מז׳ור', titleEn: 'Eb Major Scale', descHe: 'שלושה במולים: Bb Eb Ab', descEn: 'Three flats: Bb Eb Ab' },
    { titleHe: 'מינור רלטיבי', titleEn: 'Relative Minor', descHe: 'כל מז׳ור חולק תווים עם מינור (VI)', descEn: 'Every major shares notes with a minor (VI)' },
    { titleHe: 'אנהרמוניה', titleEn: 'Enharmonic Keys', descHe: 'F# = Gb, B = Cb — אותם צלילים, שמות שונים', descEn: 'F# = Gb, B = Cb — same sounds, different names' },
    { titleHe: 'דרגות בסולם', titleEn: 'Degrees in Context', descHe: 'טוניקה, סופרטוניקה, מדיאנטה, סובדומיננטה', descEn: 'Tonic, supertonic, mediant, subdominant' },
    { titleHe: 'תווים בכל מפתח', titleEn: 'Notes in Every Key', descHe: 'זיהוי מהיר של תווים בסולמות שונים', descEn: 'Quickly identifying notes in different keys' },
    { titleHe: 'מקרי מיוחדים', titleEn: 'Special Cases', descHe: 'C# מז׳ור, Cb מז׳ור — 7 דיאזים/במולים', descEn: 'C# major, Cb major — 7 sharps/flats' },
  ],
  [
    { titleHe: 'הסולם על הגיטרה', titleEn: 'Scale on Guitar', descHe: 'תבניות ידיים לאורך הצוואר', descEn: 'Fingering patterns along the neck' },
    { titleHe: 'קביעת מפתח', titleEn: 'Key Identification', descHe: 'זיהוי מפתח מתוך ניתוח האקורדים', descEn: 'Identifying the key from chord context' },
    { titleHe: 'מרחקים בסולם', titleEn: 'Intervals Within Scale', descHe: 'כל האינטרוולים הדיאטוניים', descEn: 'All diatonic intervals within the scale' },
    { titleHe: 'סולם מז׳ור כמקור', titleEn: 'Major as Reference', descHe: 'כל הסולמות נגזרים מהמז׳ורי', descEn: 'All scales derived from major' },
    { titleHe: 'שימוש מוזיקלי', titleEn: 'Musical Application', descHe: 'מלודיות ואימפרוביזציה על הסולם', descEn: 'Melodies and improvisation on the scale' },
    { titleHe: 'תנועה דיאטונית', titleEn: 'Diatonic Motion', descHe: 'צעדים ודילוגים בתוך הסולם', descEn: 'Steps and skips within the scale' },
    { titleHe: 'מאסטרי מפתחות', titleEn: 'Key Mastery', descHe: 'כל 12 המפתחות — שטף מלא', descEn: 'All 12 keys — full fluency' },
  ],
)

// ── intervals_theory ──────────────────────────────────────────────────────────

const INTERVALS_NODES = makeTopic(
  'intervals_theory',
  'M4 20V4h2v16H4zm14 0V4h2v16h-2zM9 8h6v2H9V8zm0 6h6v2H9v-2z',
  [
    { titleHe: 'חצי-טון וטון שלם', titleEn: 'Half & Whole Steps', descHe: 'יחידות המדידה הבסיסיות', descEn: 'Basic units of musical measurement' },
    { titleHe: 'פרימה ואוקטבה', titleEn: 'Unison & Octave', descHe: 'אינטרוול 0 ואינטרוול 12', descEn: 'Interval 0 and interval 12' },
    { titleHe: 'שניות', titleEn: 'Seconds', descHe: 'שנייה קטנה (1) ושנייה גדולה (2)', descEn: 'Minor second (1) and major second (2)' },
    { titleHe: 'טרצות', titleEn: 'Thirds', descHe: 'טרצה קטנה (3) וטרצה גדולה (4)', descEn: 'Minor third (3) and major third (4)' },
    { titleHe: 'קוורטה וקווינטה', titleEn: 'Fourth & Fifth', descHe: 'קוורטה זכה (5) וקווינטה זכה (7)', descEn: 'Perfect fourth (5) and fifth (7)' },
    { titleHe: 'ספטימות', titleEn: 'Sevenths', descHe: 'ספטימה קטנה (10) וגדולה (11)', descEn: 'Minor seventh (10) and major seventh (11)' },
    { titleHe: 'ספיטות', titleEn: 'Sixths', descHe: 'ספיטה קטנה (8) וגדולה (9)', descEn: 'Minor sixth (8) and major sixth (9)' },
    { titleHe: 'טריטון', titleEn: 'Tritone', descHe: 'האינטרוול הכי דיסוננטי (6 חצאי-טונים)', descEn: 'The most dissonant interval (6 semitones)' },
    { titleHe: 'ספירת חצאי-טונים', titleEn: 'Counting Semitones', descHe: 'ספירה ישירה מתו לתו', descEn: 'Direct counting from note to note' },
  ],
  [
    { titleHe: 'איכות האינטרוול', titleEn: 'Interval Quality', descHe: 'זך, גדול, קטן, מוגדל, מוקטן', descEn: 'Perfect, major, minor, augmented, diminished' },
    { titleHe: 'היפוכי אינטרוולים', titleEn: 'Interval Inversions', descHe: 'סכום היפוך = 9 (עבור לא-זכים)', descEn: 'Inversion sum = 9 (for non-perfect)' },
    { titleHe: 'אינטרוולים על גיטרה', titleEn: 'Intervals on Guitar', descHe: 'מיפוי אינטרוולים על הצוואר', descEn: 'Mapping intervals on the neck' },
    { titleHe: 'עלייה וירידה', titleEn: 'Ascending & Descending', descHe: 'אינטרוולים מעלה ומטה', descEn: 'Intervals going up and down' },
    { titleHe: 'זיהוי לפי שם שיר', titleEn: 'Songs as Mnemonics', descHe: 'Happy Birthday = M6, Star Wars = P5', descEn: 'Happy Birthday = M6, Star Wars = P5' },
    { titleHe: 'אינטרוולים מוגדלים', titleEn: 'Augmented Intervals', descHe: 'מוגדל = זך/גדול + חצי-טון', descEn: 'Augmented = perfect/major + semitone' },
    { titleHe: 'אינטרוולים מוקטנים', titleEn: 'Diminished Intervals', descHe: 'מוקטן = זך/קטן - חצי-טון', descEn: 'Diminished = perfect/minor - semitone' },
    { titleHe: 'מורכבים מאוקטבה', titleEn: 'Compound Intervals', descHe: 'ת׳רצה בוגרת (M9), ספיטה בוגרת (M13)', descEn: 'Major ninth, major thirteenth' },
    { titleHe: 'הרמוניה ודיסוננס', titleEn: 'Consonance & Dissonance', descHe: 'קיטוב בין מתח לנינוחות', descEn: 'The tension-release spectrum' },
  ],
  [
    { titleHe: 'אינטרוולים בכל 12 הצלילים', titleEn: 'All 12 Chromatic Notes', descHe: 'זיהוי מהיר לכל שילוב', descEn: 'Fast identification of any combination' },
    { titleHe: 'אינטרוולים מורכבים', titleEn: 'Complex Intervals', descHe: 'מוגדל כפול, מוקטן כפול', descEn: 'Doubly augmented, doubly diminished' },
    { titleHe: 'קנטרפאונט', titleEn: 'Counterpoint Basics', descHe: 'תנועה מקבילה, ישרה, מנוגדת', descEn: 'Parallel, direct, contrary motion' },
    { titleHe: 'אינטרוול כמבנה אקורד', titleEn: 'Intervals in Chords', descHe: 'כיצד אינטרוולים בונים אקורדים', descEn: 'How intervals construct chords' },
    { titleHe: 'זיהוי לפי צליל', titleEn: 'Interval Sound', descHe: 'מאפיין הצליל של כל אינטרוול', descEn: 'Characteristic sound of each interval' },
    { titleHe: 'אינטרוולים וז׳אנר', titleEn: 'Intervals & Genre', descHe: 'טריטון במטאל, ספיטות בג׳אז', descEn: 'Tritones in metal, sixths in jazz' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Mastery', descHe: 'כל האינטרוולים בכל כיוון ומפתח', descEn: 'All intervals in every direction and key' },
  ],
)

// ── chord_construction ────────────────────────────────────────────────────────

const CHORDS_NODES = makeTopic(
  'chord_construction',
  'M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z',
  [
    { titleHe: 'מהו אקורד?', titleEn: 'What is a Chord?', descHe: '3+ תווים נשמעים יחד', descEn: '3+ notes sounding together' },
    { titleHe: 'טריאדה מז׳ורית', titleEn: 'Major Triad', descHe: '1-3-5 (טרצה גדולה + טרצה קטנה)', descEn: '1-3-5 (major third + minor third)' },
    { titleHe: 'טריאדה מינורית', titleEn: 'Minor Triad', descHe: '1-b3-5 (טרצה קטנה + טרצה גדולה)', descEn: '1-b3-5 (minor third + major third)' },
    { titleHe: 'טריאדה מוקטנת', titleEn: 'Diminished Triad', descHe: '1-b3-b5 (שתי טרצות קטנות)', descEn: '1-b3-b5 (two minor thirds)' },
    { titleHe: 'טריאדה מוגדלת', titleEn: 'Augmented Triad', descHe: '1-3-#5 (שתי טרצות גדולות)', descEn: '1-3-#5 (two major thirds)' },
    { titleHe: 'אקורדי C, G, Am, F', titleEn: 'C, G, Am, F Chords', descHe: 'ארבעת האקורדים הנפוצים ביותר', descEn: 'The four most common chords' },
    { titleHe: 'שורשים טבעיים', titleEn: 'Natural Root Chords', descHe: 'אקורדים על כל התווים הטבעיים', descEn: 'Chords on all natural notes' },
    { titleHe: 'זיהוי לפי שם', titleEn: 'Chord by Name', descHe: 'Am = A מינורית, G = G מז׳ורית', descEn: 'Am = A minor, G = G major' },
    { titleHe: 'מז׳ור vs מינור', titleEn: 'Major vs Minor', descHe: 'ההבדל — טרצה אחת (חצי-טון)', descEn: 'One note difference — one semitone' },
  ],
  [
    { titleHe: 'אקורדים עם דיאזים', titleEn: 'Sharp Root Chords', descHe: 'F#, C#, G#, D# — כל הסוגים', descEn: 'F#, C#, G#, D# — all types' },
    { titleHe: 'אקורדים עם במולים', titleEn: 'Flat Root Chords', descHe: 'Bb, Eb, Ab, Db — כל הסוגים', descEn: 'Bb, Eb, Ab, Db — all types' },
    { titleHe: 'Suspended', titleEn: 'Suspended Chords', descHe: 'sus2 = 1-2-5, sus4 = 1-4-5', descEn: 'sus2 = 1-2-5, sus4 = 1-4-5' },
    { titleHe: 'Power Chord', titleEn: 'Power Chords', descHe: '1-5 — הבסיס של הרוק', descEn: '1-5 — the foundation of rock' },
    { titleHe: 'Add Chords', titleEn: 'Add Chords', descHe: 'Cadd9, Gadd2 — תוספת צבע', descEn: 'Cadd9, Gadd2 — added color' },
    { titleHe: '12 שורשים — מז׳ור', titleEn: '12 Roots — Major', descHe: 'כל 12 האקורדים המז׳וריים', descEn: 'All 12 major chords' },
    { titleHe: '12 שורשים — מינור', titleEn: '12 Roots — Minor', descHe: 'כל 12 האקורדים המינוריים', descEn: 'All 12 minor chords' },
    { titleHe: 'זיהוי איכות', titleEn: 'Quality Identification', descHe: 'בהינתן תווים — מה סוג האקורד?', descEn: 'Given notes — what type is the chord?' },
    { titleHe: 'בניה על דרגות', titleEn: 'Building on Degrees', descHe: 'איזה אקורד על כל דרגה בסולם', descEn: 'Which chord type on each scale degree' },
  ],
  [
    { titleHe: 'תווי אקורד מול תווי סולם', titleEn: 'Chord Tones vs Scale Tones', descHe: 'אילו תווים "חזקים" ואילו "צבע"', descEn: 'Which notes are "strong" vs "color"' },
    { titleHe: 'אקורדים בסולם מינור', titleEn: 'Chords in Minor', descHe: 'i, ii°, III, iv, V, VI, VII', descEn: 'i, ii°, III, iv, V, VI, VII' },
    { titleHe: 'ספטימה על כולם', titleEn: 'Adding the Seventh', descHe: 'הפיכת טריאדות לאקורדי ספטימה', descEn: 'Converting triads to seventh chords' },
    { titleHe: 'אקורדי גיטרה — עמדות', titleEn: 'Guitar Chord Voicings', descHe: 'צורות שונות על הצוואר לאותו אקורד', descEn: 'Different shapes on the neck for one chord' },
    { titleHe: 'זיהוי מהיר', titleEn: 'Speed Recognition', descHe: 'זיהוי אקורד בשנייה', descEn: 'Identifying a chord in one second' },
    { titleHe: 'אקורדים ז׳אזיים', titleEn: 'Jazz Chord Extensions', descHe: 'Cmaj9, Am11, G13 — הרחבות', descEn: 'Cmaj9, Am11, G13 — extensions' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Mastery', descHe: 'כל סוגי האקורדים על כל 12 השורשים', descEn: 'All chord types on all 12 roots' },
  ],
)

// ── circle_of_fifths ──────────────────────────────────────────────────────────

const CIRCLE_NODES = makeTopic(
  'circle_of_fifths',
  'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
  [
    { titleHe: 'מה הוא מעגל החמישיות?', titleEn: 'What is the Circle?', descHe: '12 מפתחות בסדר חמישיות', descEn: '12 keys arranged in fifths' },
    { titleHe: 'C ← G ← D', titleEn: 'C ← G ← D', descHe: 'כל צעד ימינה = מפתח עם דיאז נוסף', descEn: 'Each step right = one more sharp' },
    { titleHe: 'C ← F ← Bb', titleEn: 'C ← F ← Bb', descHe: 'כל צעד שמאלה = מפתח עם במול נוסף', descEn: 'Each step left = one more flat' },
    { titleHe: 'סולמות קרובים', titleEn: 'Closely Related Keys', descHe: 'שכנים במעגל — אקורד אחד שונה', descEn: 'Neighbors in the circle — one chord apart' },
    { titleHe: 'סימני מפתח', titleEn: 'Key Signatures', descHe: 'כמה דיאזים/במולים בכל מפתח?', descEn: 'How many sharps/flats in each key?' },
    { titleHe: 'דיאז ראשון בסדר', titleEn: 'Order of Sharps', descHe: 'F# C# G# D# A# E# B#', descEn: 'F# C# G# D# A# E# B#' },
    { titleHe: 'במול ראשון בסדר', titleEn: 'Order of Flats', descHe: 'Bb Eb Ab Db Gb Cb Fb', descEn: 'Bb Eb Ab Db Gb Cb Fb' },
    { titleHe: 'מפתח C מז׳ור', titleEn: 'C Major — No Accidentals', descHe: 'C — אפס סימני מפתח', descEn: 'C — zero accidentals' },
    { titleHe: 'חמישייה זכה', titleEn: 'Perfect Fifth', descHe: 'המרחק בין שכנים במעגל', descEn: 'Distance between neighbors in the circle' },
  ],
  [
    { titleHe: 'מינור רלטיבי', titleEn: 'Relative Minor', descHe: 'Am לעומת C מז׳ור — אותם תווים', descEn: 'Am vs C major — same notes' },
    { titleHe: 'כל 12 המפתחות', titleEn: 'All 12 Keys', descHe: 'מיקום כולם על המעגל', descEn: 'Position of all 12 on the circle' },
    { titleHe: 'אנהרמוניה במעגל', titleEn: 'Enharmonics on the Circle', descHe: 'F# = Gb, C# = Db, B = Cb', descEn: 'F# = Gb, C# = Db, B = Cb' },
    { titleHe: 'מפתחות מנוגדים', titleEn: 'Tritone Keys', descHe: 'מפתחות ממולים — הכי רחוקים', descEn: 'Opposite keys — furthest apart' },
    { titleHe: 'אקורדים דיאטוניים ומיקומם', titleEn: 'Diatonic Chords Position', descHe: 'I IV V — ילד גיבור על המעגל', descEn: 'I IV V — hero child on the circle' },
    { titleHe: 'מודולציה לשכן', titleEn: 'Modulation to Neighbor', descHe: 'מעבר בין מפתחות קרובים', descEn: 'Moving between closely related keys' },
    { titleHe: 'סדר הדיאזים/במולים לפי זיכרון', titleEn: 'Memorizing Accidental Order', descHe: 'טכניקות זיכרון לסדר הדיאזים', descEn: 'Mnemonic techniques for the sharp order' },
    { titleHe: 'מינוריים — המעגל השלם', titleEn: 'Minor Keys — Full Circle', descHe: '12 מפתחות מינוריים ומספר אמות מפתח שלהם', descEn: '12 minor keys and their accidentals' },
    { titleHe: 'קרבה הרמונית', titleEn: 'Harmonic Distance', descHe: 'מדידת מרחק בין שני מפתחות', descEn: 'Measuring distance between two keys' },
  ],
  [
    { titleHe: 'מודולציה רחוקה', titleEn: 'Distant Modulation', descHe: 'מעבר למפתחות רחוקים — אמצעים', descEn: 'Moving to distant keys — techniques' },
    { titleHe: 'pivot chord', titleEn: 'Pivot Chord', descHe: 'אקורד המשמש בשני מפתחות', descEn: 'A chord that belongs to two keys' },
    { titleHe: 'אנהרמוניה מוזיקלית', titleEn: 'Enharmonic Reinterpretation', descHe: 'Gb7 = F#7 — שימוש בשינוי פרשנות', descEn: 'Gb7 = F#7 — reinterpreting a chord' },
    { titleHe: 'II-V-I בכל מפתח', titleEn: 'II-V-I in Every Key', descHe: 'פרוגרסיית הג׳אז בכל 12 המפתחות', descEn: 'Jazz progression in all 12 keys' },
    { titleHe: 'Secondary Dominants', titleEn: 'Secondary Dominants', descHe: 'V/V, V/ii — דומיננטים משניים', descEn: 'V/V, V/ii — secondary dominants' },
    { titleHe: 'הסבר תיאורטי עמוק', titleEn: 'Deep Theory', descHe: 'מדוע המעגל עובד מבחינה אקוסטית', descEn: 'Why the circle works acoustically' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Circle Mastery', descHe: 'זיהוי מיידי של כל מפתח, מינור, אמות', descEn: 'Instant identification of any key' },
  ],
)

// ── diatonic_harmony ──────────────────────────────────────────────────────────

const DIATONIC_NODES = makeTopic(
  'diatonic_harmony',
  'M3 12h4l3-9 4 18 3-9h4',
  [
    { titleHe: 'מהי הרמוניה דיאטונית?', titleEn: 'What is Diatonic Harmony?', descHe: 'אקורדים הנובעים מהסולם עצמו', descEn: 'Chords that emerge from the scale itself' },
    { titleHe: 'אקורדים ב-C מז׳ור', titleEn: 'Chords in C Major', descHe: 'C Dm Em F G Am Bdim', descEn: 'C Dm Em F G Am Bdim' },
    { titleHe: 'I IV V — מזל שלישייה', titleEn: 'I IV V — The Holy Trinity', descHe: 'שלושת האקורדים הנפוצים ביותר', descEn: 'The three most common chords' },
    { titleHe: 'vi — מינור רלטיבי', titleEn: 'vi — Relative Minor', descHe: 'Am ב-C — הדרגה השישית', descEn: 'Am in C — the sixth degree' },
    { titleHe: 'iii — מדיאנטה', titleEn: 'iii — Mediant', descHe: 'Em ב-C — תחליף לטוניקה', descEn: 'Em in C — substitute for tonic' },
    { titleHe: 'ii — סופרטוניקה', titleEn: 'ii — Supertonic', descHe: 'Dm ב-C — מוביל לדומיננטה', descEn: 'Dm in C — leads to dominant' },
    { titleHe: 'vii° — מוקטן', titleEn: 'vii° — Diminished', descHe: 'Bdim ב-C — הדרגה השביעית', descEn: 'Bdim in C — the seventh degree' },
    { titleHe: 'I-V-vi-IV', titleEn: 'I-V-vi-IV', descHe: 'פרוגרסיה ב-4 אקורדים הנפוצה ביותר', descEn: 'The most popular 4-chord progression' },
    { titleHe: 'זיהוי בשמיעה', titleEn: 'Hear the Progression', descHe: 'זיהוי I IV V בשמיעה', descEn: 'Recognizing I IV V by ear' },
  ],
  [
    { titleHe: 'אקורדים בכל סולם מז׳ורי', titleEn: 'Chords in Every Major Key', descHe: 'G מז׳ור, D מז׳ור, F מז׳ור...', descEn: 'G major, D major, F major...' },
    { titleHe: 'דרגות ברומיות', titleEn: 'Roman Numeral Analysis', descHe: 'I ii iii IV V vi vii°', descEn: 'I ii iii IV V vi vii°' },
    { titleHe: 'תפקידים הרמוניים', titleEn: 'Harmonic Functions', descHe: 'טוניקה, סובדומיננטה, דומיננטה', descEn: 'Tonic, subdominant, dominant' },
    { titleHe: 'פרוגרסיה II-V-I', titleEn: 'ii-V-I Progression', descHe: 'Dm-G-C — פרוגרסיית הג׳אז הקלאסית', descEn: 'Dm-G-C — classic jazz progression' },
    { titleHe: 'קדנצות', titleEn: 'Cadences', descHe: 'אותנטית, חצי-קדנצה, פרוגרסיה נמנעת', descEn: 'Authentic, half, deceptive cadences' },
    { titleHe: 'דיאטוני מינור', titleEn: 'Minor Key Harmony', descHe: 'i ii° III iv V VI VII', descEn: 'i ii° III iv V VI VII' },
    { titleHe: 'החלפות דרגות', titleEn: 'Chord Substitutions', descHe: 'iii ↔ I, vi ↔ IV — תחליפים', descEn: 'iii ↔ I, vi ↔ IV — substitutes' },
    { titleHe: 'ניתוח שירים', titleEn: 'Song Analysis', descHe: 'זיהוי דרגות בשירים מוכרים', descEn: 'Identifying degrees in familiar songs' },
    { titleHe: 'אקורדי ספטימה דיאטוניים', titleEn: 'Diatonic Seventh Chords', descHe: 'Imaj7, ii7, iii7, IVmaj7, V7, vi7, vii∅7', descEn: 'Imaj7, ii7, iii7, IVmaj7, V7, vi7, vii∅7' },
  ],
  [
    { titleHe: 'פרוגרסיות מורכבות', titleEn: 'Complex Progressions', descHe: 'I VI II V, I III IV I...', descEn: 'I VI II V, I III IV I...' },
    { titleHe: 'Secondary Dominant', titleEn: 'Secondary Dominants', descHe: 'V/IV, V/vi — דומיננטים משניים', descEn: 'V/IV, V/vi — secondary dominants' },
    { titleHe: 'דומיננט משאול', titleEn: 'Borrowed Dominants', descHe: 'V7/V — הכפלת הדומיננטה', descEn: 'V7/V — chain of dominants' },
    { titleHe: 'ניתוח מוזיקה מורכבת', titleEn: 'Advanced Song Analysis', descHe: 'ניתוח שירים עם חריגות', descEn: 'Songs with chromatic exceptions' },
    { titleHe: 'כתיבה הרמונית', titleEn: 'Harmonic Writing', descHe: 'בניית פרוגרסיה מקורית', descEn: 'Building an original progression' },
    { titleHe: 'הרמוניה מינורית מתקדמת', titleEn: 'Advanced Minor Harmony', descHe: 'מינור הרמוני, V מז׳ורי, VII', descEn: 'Harmonic minor, major V, VII' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Mastery', descHe: 'ניתוח וכתיבה בכל 12 המפתחות', descEn: 'Analysis and writing in all 12 keys' },
  ],
)

// ── caged_system ──────────────────────────────────────────────────────────────

const CAGED_NODES = makeTopic(
  'caged_system',
  'M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
  [
    { titleHe: 'מה זה CAGED?', titleEn: 'What is CAGED?', descHe: 'חמש צורות בסיסיות מכסות את כל הצוואר', descEn: 'Five shapes covering the entire neck' },
    { titleHe: 'צורת C', titleEn: 'C Shape', descHe: 'צורת אקורד C על הצוואר', descEn: 'C chord shape on the neck' },
    { titleHe: 'צורת A', titleEn: 'A Shape', descHe: 'צורת אקורד A על הצוואר', descEn: 'A chord shape on the neck' },
    { titleHe: 'צורת G', titleEn: 'G Shape', descHe: 'צורת אקורד G על הצוואר', descEn: 'G chord shape on the neck' },
    { titleHe: 'צורת E', titleEn: 'E Shape', descHe: 'צורת אקורד E על הצוואר', descEn: 'E chord shape on the neck' },
    { titleHe: 'צורת D', titleEn: 'D Shape', descHe: 'צורת אקורד D על הצוואר', descEn: 'D chord shape on the neck' },
    { titleHe: 'סדר המעבר', titleEn: 'CAGED Sequence', descHe: 'C→A→G→E→D→C — מהנמוך לגבוה', descEn: 'C→A→G→E→D→C — low to high' },
    { titleHe: 'מיפוי G מז׳ור', titleEn: 'G Major Mapping', descHe: 'G מז׳ור בכל 5 הצורות', descEn: 'G major in all 5 shapes' },
    { titleHe: 'שורש בכל צורה', titleEn: 'Root in Each Shape', descHe: 'איפה השורש בכל אחת מ-5 הצורות', descEn: 'Where the root sits in each of the 5 shapes' },
  ],
  [
    { titleHe: 'Barre Chords', titleEn: 'Barre Chords', descHe: 'E-shape ו-A-shape בכל עמדות', descEn: 'E-shape and A-shape across all positions' },
    { titleHe: 'מיפוי D מז׳ור', titleEn: 'D Major Mapping', descHe: 'D מז׳ור בכל 5 הצורות', descEn: 'D major in all 5 shapes' },
    { titleHe: 'מיפוי A מז׳ור', titleEn: 'A Major Mapping', descHe: 'A מז׳ור בכל 5 הצורות', descEn: 'A major in all 5 shapes' },
    { titleHe: 'CAGED מינורי', titleEn: 'Minor CAGED Shapes', descHe: 'Cm, Am, Gm, Em, Dm — 5 צורות מינור', descEn: 'Cm, Am, Gm, Em, Dm — 5 minor shapes' },
    { titleHe: 'מיקום שורש לפי פרט', titleEn: 'Root by Fret Number', descHe: 'מציאת שורש בכל פרט', descEn: 'Finding the root at any fret' },
    { titleHe: 'פנטטוני על גבי CAGED', titleEn: 'Pentatonic Over CAGED', descHe: 'קישור סולמות לצורות CAGED', descEn: 'Linking pentatonic scales to CAGED shapes' },
    { titleHe: 'מעבר חלק בין צורות', titleEn: 'Smooth Shape Transitions', descHe: 'זרימה ממשפחה אחת לאחרת', descEn: 'Flowing from one shape to the next' },
    { titleHe: 'ניתוח שיר', titleEn: 'Song Analysis', descHe: 'זיהוי CAGED בשירים מוכרים', descEn: 'Identifying CAGED shapes in songs' },
    { titleHe: 'אקורדי 7 ב-CAGED', titleEn: 'Seventh Chords in CAGED', descHe: 'הוספת ספטימה לכל 5 הצורות', descEn: 'Adding the seventh to all 5 shapes' },
  ],
  [
    { titleHe: 'אימפרוביזציה ב-CAGED', titleEn: 'CAGED Improvisation', descHe: 'סולו תוך שימוש בכל 5 הצורות', descEn: 'Soloing using all 5 shapes' },
    { titleHe: 'ארפג׳יו ב-CAGED', titleEn: 'CAGED Arpeggios', descHe: 'ניגון תווי האקורד אחד אחד', descEn: 'Playing chord tones one by one' },
    { titleHe: 'חיבור 5 הצורות', titleEn: 'Connecting All 5', descHe: 'תנועה רציפה לאורך כל הצוואר', descEn: 'Continuous motion across the neck' },
    { titleHe: 'CAGED מקצועי', titleEn: 'Professional CAGED', descHe: 'שימוש בצורות בסגנונות שונים', descEn: 'Using shapes in various styles' },
    { titleHe: 'עמדות על מיתרי בס', titleEn: 'Bass String Positions', descHe: 'שורשים על מיתרים 5 ו-6', descEn: 'Roots on strings 5 and 6' },
    { titleHe: 'צורות מעל הפרט 12', titleEn: 'Shapes Above Fret 12', descHe: 'CAGED חוזר על עצמו אחרי פרט 12', descEn: 'CAGED repeats after fret 12' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full CAGED Mastery', descHe: 'ניווט מיידי בכל הצוואר', descEn: 'Instant navigation across the full neck' },
  ],
)

// ── seventh_chords ────────────────────────────────────────────────────────────

const SEVENTH_CHORDS_NODES = makeTopic(
  'seventh_chords',
  'M6 3h12v18H6V3zm2 2v14h8V5H8z',
  [
    { titleHe: 'מהו אקורד ספטימה?', titleEn: 'What is a Seventh Chord?', descHe: 'טריאדה + ספטימה = 4 תווים', descEn: 'Triad + seventh = 4 notes' },
    { titleHe: 'maj7 — מז׳ורי-גדול', titleEn: 'maj7 — Major-Major', descHe: '1-3-5-7M (ספטימה גדולה)', descEn: '1-3-5-7M (major seventh)' },
    { titleHe: 'dom7 — דומיננטי', titleEn: 'dom7 — Dominant', descHe: '1-3-5-b7 (ספטימה קטנה)', descEn: '1-3-5-b7 (minor seventh)' },
    { titleHe: 'm7 — מינורי-קטן', titleEn: 'm7 — Minor-Minor', descHe: '1-b3-5-b7 (מינורי + ספטימה קטנה)', descEn: '1-b3-5-b7 (minor + minor seventh)' },
    { titleHe: 'Cmaj7 ו-G7', titleEn: 'Cmaj7 and G7', descHe: 'שני אקורדי הספטימה הנפוצים ביותר', descEn: 'The two most common seventh chords' },
    { titleHe: 'Am7 ו-Dm7', titleEn: 'Am7 and Dm7', descHe: 'אקורדי m7 בהקשר של C מז׳ור', descEn: 'm7 chords in the context of C major' },
    { titleHe: 'Maj7 vs Dom7', titleEn: 'Maj7 vs Dom7', descHe: 'ההבדל — ספטימה אחת (חצי-טון)', descEn: 'One semitone difference — the seventh' },
    { titleHe: 'ספטימה גדולה/קטנה', titleEn: 'Major/Minor Seventh', descHe: '11 חצאי-טונים vs 10 חצאי-טונים', descEn: '11 semitones vs 10 semitones' },
    { titleHe: 'ספטימה בשירים מוכרים', titleEn: 'Seventh Chords in Songs', descHe: 'Cmaj7 ב-"Misty", G7 ב-"Summertime"', descEn: 'Cmaj7 in "Misty", G7 in "Summertime"' },
  ],
  [
    { titleHe: 'm7b5 — חצי-מוקטן', titleEn: 'm7b5 — Half-Diminished', descHe: '1-b3-b5-b7 (טריאדה מוקטנת + b7)', descEn: '1-b3-b5-b7 (dim triad + minor 7)' },
    { titleHe: 'dim7 — מוקטן מלא', titleEn: 'dim7 — Fully Diminished', descHe: '1-b3-b5-bb7 (כולם טרצות קטנות)', descEn: '1-b3-b5-bb7 (all minor thirds)' },
    { titleHe: 'אקורדי ספטימה על כל דרגה', titleEn: 'Seventh Chords on Every Degree', descHe: 'Imaj7 ii7 iii7 IVmaj7 V7 vi7 vii∅7', descEn: 'Imaj7 ii7 iii7 IVmaj7 V7 vi7 vii∅7' },
    { titleHe: 'V7 → I', titleEn: 'V7 → I Cadence', descHe: 'הקדנצה החזקה ביותר — דומיננטי לטוניקה', descEn: 'The strongest cadence — dominant to tonic' },
    { titleHe: 'ii-V-I בג׳אז', titleEn: 'ii-V-I in Jazz', descHe: 'Dm7-G7-Cmaj7 — בלב הג׳אז', descEn: 'Dm7-G7-Cmaj7 — the heart of jazz' },
    { titleHe: 'ספטימות על 12 שורשים', titleEn: 'Seventh Chords All Roots', descHe: 'maj7, m7, dom7 על כל 12 השורשים', descEn: 'maj7, m7, dom7 on all 12 roots' },
    { titleHe: 'זיהוי בשמיעה', titleEn: 'Ear Recognition', descHe: 'הצליל הייחודי של כל סוג ספטימה', descEn: 'Distinctive sound of each seventh type' },
    { titleHe: 'ניתוח שיר ג׳אזי', titleEn: 'Jazz Song Analysis', descHe: 'ניתוח ספטימות בסטנדרטים', descEn: 'Analyzing sevenths in jazz standards' },
    { titleHe: 'החלפות ספטימה', titleEn: 'Seventh Chord Substitutions', descHe: 'tritone substitution — מרחק טריטון', descEn: 'Tritone substitution — a tritone away' },
  ],
  [
    { titleHe: 'אקורדי 9, 11, 13', titleEn: 'Extensions 9, 11, 13', descHe: 'הרחבת ספטימה לשמינייה ומעלה', descEn: 'Extending seventh chords to ninths+' },
    { titleHe: 'Alt — דומיננטי מאולטר', titleEn: 'Altered Dominant', descHe: 'G7alt = כל ה-tensions מאולטרות', descEn: 'G7alt = all tensions altered' },
    { titleHe: 'Lydian Dominant', titleEn: 'Lydian Dominant', descHe: 'G7#11 — לידי עם ספטימה קטנה', descEn: 'G7#11 — Lydian with minor seventh' },
    { titleHe: 'ספטימות בפרוגרסיה מינורית', titleEn: 'Seventh Chords in Minor', descHe: 'i7 ii∅7 bIIImaj7 iv7 V7 bVImaj7 bVII7', descEn: 'i7 ii∅7 bIIImaj7 iv7 V7 bVImaj7 bVII7' },
    { titleHe: 'ניהול קולות בספטימות', titleEn: 'Voice Leading Sevenths', descHe: 'הספטימה יורדת חצי-טון לדרגה III', descEn: 'The seventh resolves down a semitone' },
    { titleHe: 'dim7 כמחליף', titleEn: 'dim7 as Substitution', descHe: 'Bdim7 = G7b9 ללא שורש', descEn: 'Bdim7 = G7b9 without the root' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Seventh Chord Mastery', descHe: 'כל 5 הסוגים על כל 12 השורשים', descEn: 'All 5 types on all 12 roots' },
  ],
)

// ── pentatonic_blues ──────────────────────────────────────────────────────────

const PENTA_NODES = makeTopic(
  'pentatonic_blues',
  'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 14h-2v-4H8l4-7 4 7h-3v4z',
  [
    { titleHe: 'מהו פנטטוני?', titleEn: 'What is Pentatonic?', descHe: '5 תווים — הסולם הנגין ביותר', descEn: '5 notes — the most playable scale' },
    { titleHe: 'Am פנטטוני — תיבה 1', titleEn: 'Am Pentatonic — Box 1', descHe: 'התבנית הקלאסית בפרטים 5-8', descEn: 'Classic pattern at frets 5-8' },
    { titleHe: 'נוסחת מינורי', titleEn: 'Minor Formula', descHe: '1-b3-4-5-b7 — חמשת התווים', descEn: '1-b3-4-5-b7 — the five notes' },
    { titleHe: 'מז׳ורי פנטטוני', titleEn: 'Major Pentatonic', descHe: '1-2-3-5-6 — הצליל השמח', descEn: '1-2-3-5-6 — the happy sound' },
    { titleHe: 'Em פנטטוני — תיבה 1', titleEn: 'Em Pentatonic — Box 1', descHe: 'פרטים 0-3 — המיתרים הפתוחים', descEn: 'Open strings pattern, frets 0-3' },
    { titleHe: 'מינורי vs מז׳ורי', titleEn: 'Minor vs Major Penta', descHe: 'אותם תווים, שורש שונה', descEn: 'Same notes, different root' },
    { titleHe: 'תו הבלוז', titleEn: 'Blue Note', descHe: 'b5 — הטריטון שמוסיף את הבלוז', descEn: 'b5 — the tritone that adds blues' },
    { titleHe: 'סולם בלוז', titleEn: 'Blues Scale', descHe: 'פנטטוני מינורי + b5 = 6 תווים', descEn: 'Minor pentatonic + b5 = 6 notes' },
    { titleHe: 'שימוש ב-Am', titleEn: 'Using Am Pentatonic', descHe: 'אימפרוביזציה בסיסית על 12-bar blues', descEn: 'Basic improvisation over 12-bar blues' },
  ],
  [
    { titleHe: 'כל 5 תיבות Am', titleEn: 'All 5 Am Boxes', descHe: 'חמש תבניות על כל הצוואר', descEn: 'Five patterns across the whole neck' },
    { titleHe: 'Em ו-Gm פנטטוני', titleEn: 'Em & Gm Pentatonic', descHe: 'תבניות בשורשים נוספים', descEn: 'Patterns with additional roots' },
    { titleHe: 'קישור תיבות', titleEn: 'Connecting Boxes', descHe: 'מעבר חלק בין תבנית לתבנית', descEn: 'Smooth transition between patterns' },
    { titleHe: 'Dm בלוז', titleEn: 'Dm Blues Scale', descHe: 'תיבה 1 על D בלוז', descEn: 'Box 1 of D blues scale' },
    { titleHe: 'Bends ו-Vibrato', titleEn: 'Bends & Vibrato', descHe: 'ביטויים בסיסיים של גיטרה בלוז', descEn: 'Core expressive techniques in blues guitar' },
    { titleHe: 'פנטטוני על כל 12 שורשים', titleEn: 'Pentatonic All 12 Roots', descHe: 'מיקום שורש בכל שורש', descEn: 'Root position in every key' },
    { titleHe: 'מז׳ורי/מינורי מקביל', titleEn: 'Parallel Major/Minor Penta', descHe: 'שימוש בשתי הגרסות מעל אקורד', descEn: 'Using both versions over one chord' },
    { titleHe: 'Blues Licks', titleEn: 'Blues Licks', descHe: 'ביטויים מלודיים קלאסיים של בלוז', descEn: 'Classic melodic expressions of blues' },
    { titleHe: 'Pentatonic ב-Dorian', titleEn: 'Pentatonic in Dorian', descHe: 'שימוש בפנטטוני מינורי מעל m7', descEn: 'Using minor pentatonic over m7 chords' },
  ],
  [
    { titleHe: 'תיבות מחוברות — Am מלא', titleEn: 'Full Neck Am Penta', descHe: 'זרימה ברציפות על כל הצוואר', descEn: 'Continuous flow across the full neck' },
    { titleHe: 'Super Imposed Scales', titleEn: 'Superimposed Scales', descHe: 'שימוש בפנטטוני מעל אקורדים שונים', descEn: 'Using pentatonic over different chords' },
    { titleHe: 'בלוז מינורי מתקדם', titleEn: 'Advanced Blues Minor', descHe: 'ניצול מלא של תוו הבלוז', descEn: 'Full exploitation of the blue note' },
    { titleHe: 'ג׳אז-בלוז', titleEn: 'Jazz-Blues Hybrid', descHe: 'ספטימות + פנטטוני בצורה חכמה', descEn: 'Smart blend of sevenths and pentatonic' },
    { titleHe: 'פנטטוני כמסלול ארפג׳ו', titleEn: 'Pentatonic as Arpeggio Path', descHe: 'בחירת תווי אקורד מהסולם', descEn: 'Selecting chord tones from the scale' },
    { titleHe: 'Country Pentatonic', titleEn: 'Country Pentatonic', descHe: 'שימוש במז׳ורי פנטטוני בסגנון קאנטרי', descEn: 'Major pentatonic in country style' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Pentatonic Mastery', descHe: 'כל 5 תיבות, כל שורש, כל סגנון', descEn: 'All 5 boxes, every root, every style' },
  ],
)

// ── minor_scales ──────────────────────────────────────────────────────────────

const MINOR_NODES = makeTopic(
  'minor_scales',
  'M3 3h2v18H3V3zm16 0h2v18h-2V3zM7 7h2v14H7V7zm4-4h2v18h-2V3zm4 4h2v14h-2V7z',
  [
    { titleHe: 'מינור טבעי', titleEn: 'Natural Minor', descHe: 'W-H-W-W-H-W-W — הסולם המינורי הבסיסי', descEn: 'W-H-W-W-H-W-W — the basic minor scale' },
    { titleHe: 'Am טבעי — התווים', titleEn: 'Am Natural Notes', descHe: 'A-B-C-D-E-F-G — כל התווים', descEn: 'A-B-C-D-E-F-G — all notes' },
    { titleHe: 'Am vs C מז׳ור', titleEn: 'Am vs C Major', descHe: 'אותם תווים — שורש שונה', descEn: 'Same notes — different root' },
    { titleHe: 'Em טבעי', titleEn: 'Em Natural Scale', descHe: 'E-F#-G-A-B-C-D — אחד דיאז', descEn: 'E-F#-G-A-B-C-D — one sharp' },
    { titleHe: 'Dm טבעי', titleEn: 'Dm Natural Scale', descHe: 'D-E-F-G-A-Bb-C — אחד במול', descEn: 'D-E-F-G-A-Bb-C — one flat' },
    { titleHe: 'V7 במינור', titleEn: 'V Chord in Minor', descHe: 'הדרגה 5 במינור טבעי היא מינורית', descEn: 'The 5th degree in natural minor is minor' },
    { titleHe: 'צליל המינור הטבעי', titleEn: 'Natural Minor Sound', descHe: 'חשוך, מלנכולי, רוקי', descEn: 'Dark, melancholy, rocky' },
    { titleHe: 'מינור הרמוני — מבוא', titleEn: 'Harmonic Minor — Intro', descHe: 'שינוי: הדרגה ה-7 מוגבהת חצי-טון', descEn: 'Change: the 7th degree raised by semitone' },
    { titleHe: 'Am הרמוני', titleEn: 'Am Harmonic Scale', descHe: 'A-B-C-D-E-F-G# — G# הוא השינוי', descEn: 'A-B-C-D-E-F-G# — G# is the change' },
  ],
  [
    { titleHe: 'V מז׳ורי במינור הרמוני', titleEn: 'Major V in Harmonic Minor', descHe: 'G# יוצר E מז׳ורי — קדנצה חזקה', descEn: 'G# creates E major — strong cadence' },
    { titleHe: 'טרצה גדולה מוגדלת', titleEn: 'Augmented Second', descHe: 'F→G# = 3 חצאי-טונים — הפרדה ייחודית', descEn: 'F→G# = 3 semitones — unique gap' },
    { titleHe: 'צליל פלמנקו/קלאסי', titleEn: 'Flamenco/Classical Sound', descHe: 'הטרצה המוגדלת נותנת את הצליל', descEn: 'The augmented second creates the sound' },
    { titleHe: 'Dm הרמוני', titleEn: 'Dm Harmonic Scale', descHe: 'D-E-F-G-A-Bb-C# — C# הוא השינוי', descEn: 'D-E-F-G-A-Bb-C# — C# is the change' },
    { titleHe: 'מינור מלודי — מבוא', titleEn: 'Melodic Minor — Intro', descHe: 'עלייה: דרגות 6 ו-7 מוגבהות', descEn: 'Ascending: degrees 6 and 7 raised' },
    { titleHe: 'Am מלודי', titleEn: 'Am Melodic Scale', descHe: 'עלייה: A-B-C-D-E-F#-G#-A', descEn: 'Ascending: A-B-C-D-E-F#-G#-A' },
    { titleHe: 'מלודי — ירידה', titleEn: 'Melodic — Descending', descHe: 'ירידה: חוזר לטבעי (G G F E...)', descEn: 'Descending: reverts to natural minor' },
    { titleHe: 'מינור מלודי בג׳אז', titleEn: 'Jazz Melodic Minor', descHe: 'בג׳אז: גרסת העלייה בשני הכיוונים', descEn: 'In jazz: ascending version in both directions' },
    { titleHe: 'השוואת שלושת המינוריים', titleEn: 'Comparing Three Minors', descHe: 'מה שונה בכל אחד — דרגה 6 ו-7', descEn: 'What differs in each — degrees 6 and 7' },
  ],
  [
    { titleHe: 'Em הרמוני', titleEn: 'Em Harmonic Scale', descHe: 'E-F#-G-A-B-C-D# — D# הוא השינוי', descEn: 'E-F#-G-A-B-C-D# — D# is the change' },
    { titleHe: 'מינוריים על כל 12 שורשים', titleEn: 'All 12 Minor Roots', descHe: 'כל 3 הסוגים על כל 12 שורשים', descEn: 'All 3 types on all 12 roots' },
    { titleHe: 'דוריאן vs מינור טבעי', titleEn: 'Dorian vs Natural Minor', descHe: 'מה ההבדל — דרגה 6 (#6 בדוריאן)', descEn: 'The difference — raised 6th in Dorian' },
    { titleHe: 'מינוריים בגיטרה', titleEn: 'Minor Scales on Guitar', descHe: 'תבניות על הצוואר לכל 3 הסוגים', descEn: 'Neck patterns for all 3 types' },
    { titleHe: 'שימוש מוזיקלי', titleEn: 'Musical Application', descHe: 'מתי להשתמש בכל סוג מינורי', descEn: 'When to use each minor type' },
    { titleHe: 'אקורדים מהמינוריים', titleEn: 'Chords from Minor Scales', descHe: 'אקורדים דיאטוניים מהסולמות המינוריים', descEn: 'Diatonic chords from minor scales' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Minor Mastery', descHe: 'טבעי, הרמוני, מלודי — שטף מלא', descEn: 'Natural, harmonic, melodic — full fluency' },
  ],
)

// ── modes_theory ──────────────────────────────────────────────────────────────

const MODES_NODES = makeTopic(
  'modes_theory',
  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  [
    { titleHe: 'מה הוא מודוס?', titleEn: 'What is a Mode?', descHe: 'הסולם מתחיל על דרגה שונה', descEn: 'The scale starting on a different degree' },
    { titleHe: 'Ionian = מז׳ור', titleEn: 'Ionian = Major', descHe: 'מודוס ראשון — זהה לסולם מז׳ורי', descEn: 'First mode — identical to major scale' },
    { titleHe: 'Aeolian = מינור טבעי', titleEn: 'Aeolian = Natural Minor', descHe: 'מודוס שישי — זהה למינור טבעי', descEn: 'Sixth mode — natural minor' },
    { titleHe: 'Dorian — מינור ג׳אזי', titleEn: 'Dorian — Jazzy Minor', descHe: 'מינור + דרגה 6 גדולה (#6)', descEn: 'Minor + raised 6th' },
    { titleHe: 'Mixolydian — מז׳ור בלוזי', titleEn: 'Mixolydian — Bluesy Major', descHe: 'מז׳ור + ספטימה קטנה (b7)', descEn: 'Major + minor seventh (b7)' },
    { titleHe: 'Phrygian — ספרדי', titleEn: 'Phrygian — Spanish', descHe: 'מינור + b2 (סקונדה קטנה)', descEn: 'Minor + b2 (minor second)' },
    { titleHe: 'Lydian — חולמני', titleEn: 'Lydian — Dreamy', descHe: 'מז׳ור + #4 (קוורטה מוגדלת)', descEn: 'Major + #4 (raised fourth)' },
    { titleHe: 'Locrian — נדיר', titleEn: 'Locrian — Rare', descHe: 'מוקטן — הכי דיסוננטי, מודוס 7', descEn: 'Diminished — most dissonant, mode 7' },
    { titleHe: 'שבעת המודוסים', titleEn: 'All Seven Modes', descHe: 'Ionian Dorian Phrygian Lydian Mixo Aeolian Locrian', descEn: 'Ionian Dorian Phrygian Lydian Mixo Aeolian Locrian' },
  ],
  [
    { titleHe: 'D דוריאן = C מז׳ור', titleEn: 'D Dorian = C Major', descHe: 'גישה נגזרת: אותם תווים, שורש שונה', descEn: 'Derivative approach: same notes, different root' },
    { titleHe: 'גישה מקבילה', titleEn: 'Parallel Approach', descHe: 'אותו שורש, נוסחה שונה', descEn: 'Same root, different formula' },
    { titleHe: 'Mixolydian בגיטרה', titleEn: 'Mixolydian on Guitar', descHe: 'Mixolydian תבניות על הצוואר', descEn: 'Mixolydian patterns on the neck' },
    { titleHe: 'Dorian בגיטרה', titleEn: 'Dorian on Guitar', descHe: 'Dorian תבניות על הצוואר', descEn: 'Dorian patterns on the neck' },
    { titleHe: 'מודוס לפי סוג אקורד', titleEn: 'Mode by Chord Type', descHe: 'מינור → Dorian/Phrygian, מז׳ור → Lydian/Mixo', descEn: 'Minor → Dorian/Phrygian, major → Lydian/Mixo' },
    { titleHe: 'Lydian בגיטרה', titleEn: 'Lydian on Guitar', descHe: 'Lydian תבניות + הצליל הייחודי', descEn: 'Lydian patterns + the unique sound' },
    { titleHe: 'Phrygian על דרגה III', titleEn: 'Phrygian on Degree III', descHe: 'E Phrygian ב-C מז׳ור — E-F-G-A-B-C-D', descEn: 'E Phrygian in C major — E-F-G-A-B-C-D' },
    { titleHe: 'ז׳אנרים של מודוסים', titleEn: 'Modes & Genres', descHe: 'Mixo=Rock, Dorian=Jazz, Phrygian=Metal', descEn: 'Mixo=Rock, Dorian=Jazz, Phrygian=Metal' },
    { titleHe: 'זיהוי מודוסים בשמיעה', titleEn: 'Identifying Modes by Ear', descHe: 'הצליל המאפיין של כל מודוס', descEn: 'Characteristic sound of each mode' },
  ],
  [
    { titleHe: 'D Dorian נגד D מינור', titleEn: 'D Dorian vs D Minor', descHe: 'מה שונה — B טבעי לעומת Bb', descEn: 'What differs — B natural vs Bb' },
    { titleHe: 'Locrian ואי-יציבות', titleEn: 'Locrian & Instability', descHe: 'מדוע Locrian נדיר: b5 ביסוד', descEn: 'Why Locrian is rare: b5 in the root' },
    { titleHe: 'מודוס מלודי מינורי', titleEn: 'Melodic Minor Modes', descHe: 'Lydian Dominant, Altered Scale...', descEn: 'Lydian Dominant, Altered Scale...' },
    { titleHe: 'Lydian Dominant', titleEn: 'Lydian Dominant', descHe: '#4 + b7 — מעל V7 בג׳אז', descEn: '#4 + b7 — over V7 chords in jazz' },
    { titleHe: 'Altered Scale', titleEn: 'Altered Scale', descHe: 'super-locrian — מעל V7alt', descEn: 'super-locrian — over V7alt chords' },
    { titleHe: 'כתיבה מודאלית', titleEn: 'Modal Writing', descHe: 'כתיבת מנגינה המבטאת מודוס', descEn: 'Writing a melody that expresses a mode' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Modes Mastery', descHe: 'כל 7 המודוסים בכל 12 השורשים', descEn: 'All 7 modes in all 12 roots' },
  ],
)

// ── modal_interchange ─────────────────────────────────────────────────────────

const MODAL_INT_NODES = makeTopic(
  'modal_interchange',
  'M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4',
  [
    { titleHe: 'מהי החלפת מודוסים?', titleEn: 'What is Modal Interchange?', descHe: 'שאילת אקורד ממינורי מקביל', descEn: 'Borrowing a chord from the parallel minor' },
    { titleHe: 'מז׳ור ומינור מקביל', titleEn: 'Parallel Major & Minor', descHe: 'C מז׳ור ו-C מינור — אותו שורש', descEn: 'C major and C minor — same root' },
    { titleHe: 'bVII — אקורד שאול', titleEn: 'bVII — Borrowed Chord', descHe: 'Bb ב-C מז׳ור — מ-C מינור', descEn: 'Bb in C major — borrowed from C minor' },
    { titleHe: 'bVI — אקורד שאול', titleEn: 'bVI — Borrowed Chord', descHe: 'Ab ב-C מז׳ור — מ-C מינור', descEn: 'Ab in C major — borrowed from C minor' },
    { titleHe: 'iv — מינורי שאול', titleEn: 'iv — Borrowed Minor iv', descHe: 'Fm ב-C מז׳ור במקום F', descEn: 'Fm in C major instead of F' },
    { titleHe: 'ישנם 4 אקורדים נפוצים', titleEn: '4 Common Borrowed Chords', descHe: 'bVII, bVI, bIII, iv — הנפוצים ביותר', descEn: 'bVII, bVI, bIII, iv — most common' },
    { titleHe: 'צליל "כהה יותר"', titleEn: 'Darker Sound', descHe: 'אקורדים שאולים מוסיפים עומק', descEn: 'Borrowed chords add depth and darkness' },
    { titleHe: 'שימוש בפופ ורוק', titleEn: 'Pop & Rock Use', descHe: 'The Beatles, Radiohead — שאלת אקורדים', descEn: 'The Beatles, Radiohead — chord borrowing' },
    { titleHe: 'מינור → מז׳ור', titleEn: 'Minor to Major Borrowing', descHe: 'שאילת אקורדים מהמינורי לתוך מז׳ור', descEn: 'Borrowing from minor into major context' },
  ],
  [
    { titleHe: 'bIII — מז׳ורי שאול', titleEn: 'bIII — Borrowed Major', descHe: 'Eb ב-C מז׳ור — מ-C מינור', descEn: 'Eb in C major — from C minor' },
    { titleHe: 'i7 שאול', titleEn: 'Borrowed i7', descHe: 'Cm7 ב-C מז׳ור (im7) — מינורי שאול', descEn: 'Cm7 in C major — borrowed minor tonic' },
    { titleHe: 'Neapolitan Chord (bII)', titleEn: 'Neapolitan (bII)', descHe: 'Db מז׳ור ב-C — "נפוליטאני"', descEn: 'Db major in C — Neapolitan chord' },
    { titleHe: 'ניתוח שיר עם שאלת אקורדים', titleEn: 'Song Analysis', descHe: 'זיהוי אקורדים שאולים בשיר', descEn: 'Identifying borrowed chords in a song' },
    { titleHe: 'שאלה מ-Dorian', titleEn: 'Borrowing from Dorian', descHe: 'IV מז׳ורי מדוריאן', descEn: 'Major IV from Dorian mode' },
    { titleHe: 'שאלה מ-Phrygian', titleEn: 'Borrowing from Phrygian', descHe: 'bII (נפוליטאני) מפריגי', descEn: 'bII (Neapolitan) from Phrygian' },
    { titleHe: 'שאלה מ-Lydian', titleEn: 'Borrowing from Lydian', descHe: 'II מז׳ורי מלידי (שטוח)', descEn: 'Major II from Lydian mode' },
    { titleHe: 'החלפה כדרמה', titleEn: 'Interchange as Drama', descHe: 'מתי ולמה להשתמש בהחלפת מודוסים', descEn: 'When and why to use modal interchange' },
    { titleHe: 'כתיבת פרוגרסיה עם שאלת אקורדים', titleEn: 'Writing with Borrowing', descHe: 'יצירת פרוגרסיה עם אקורדים שאולים', descEn: 'Creating a progression with borrowed chords' },
  ],
  [
    { titleHe: 'Mixture Chords', titleEn: 'Chromatic Mixture', descHe: 'שאלה מכמה מודוסים בו-זמנית', descEn: 'Borrowing from multiple modes simultaneously' },
    { titleHe: 'Tritone Substitution', titleEn: 'Tritone Substitution', descHe: 'החלפת V7 באקורד מרחק טריטון', descEn: 'Replacing V7 with a chord a tritone away' },
    { titleHe: 'ניתוח מוזיקה ברמה גבוהה', titleEn: 'Advanced Analysis', descHe: 'ניתוח שיר עם חריגות מרובות', descEn: 'Analyzing songs with multiple exceptions' },
    { titleHe: 'שאלה בסגנון ג׳אז', titleEn: 'Jazz-Style Borrowing', descHe: 'Coltrane changes, Giant Steps', descEn: 'Coltrane changes, Giant Steps' },
    { titleHe: 'שאלה במינור', titleEn: 'Borrowing in Minor', descHe: 'שאלת אקורדים ממז׳ורי מקביל', descEn: 'Borrowing from parallel major into minor' },
    { titleHe: 'Common-Tone Modulation', titleEn: 'Common-Tone Modulation', descHe: 'שינוי מפתח דרך תו משותף', descEn: 'Key change via a shared note' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Interchange Mastery', descHe: 'שאלת אקורדים מכל מודוס בכל מפתח', descEn: 'Borrowing from any mode in any key' },
  ],
)

// ── voice_leading ─────────────────────────────────────────────────────────────

const VOICE_NODES = makeTopic(
  'voice_leading',
  'M9 3v12.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z',
  [
    { titleHe: 'מהו ניהול קולות?', titleEn: 'What is Voice Leading?', descHe: 'תנועה חלקה בין תווי אקורד לאקורד', descEn: 'Smooth movement between chord tones' },
    { titleHe: 'היפוך ראשון (6 אקורד)', titleEn: 'First Inversion (6 chord)', descHe: 'טרצה בבס: C/E, G/B, F/A', descEn: 'Third in bass: C/E, G/B, F/A' },
    { titleHe: 'היפוך שני (6/4 אקורד)', titleEn: 'Second Inversion (6/4)', descHe: 'קווינטה בבס: C/G', descEn: 'Fifth in bass: C/G' },
    { titleHe: 'מדוע היפוכים?', titleEn: 'Why Inversions?', descHe: 'לינייה של בס חלקה יותר', descEn: 'Smoother bass line motion' },
    { titleHe: 'תנועה מנוגדת', titleEn: 'Contrary Motion', descHe: 'קולות נעים בכיוונים מנוגדים', descEn: 'Voices moving in opposite directions' },
    { titleHe: 'תנועה מקבילה', titleEn: 'Parallel Motion', descHe: 'קולות נעים באותו כיוון', descEn: 'Voices moving in the same direction' },
    { titleHe: 'הכלל: מינימום תנועה', titleEn: 'Principle: Minimal Motion', descHe: 'שמירה על תנועה מינימלית בין אקורדים', descEn: 'Keeping minimal movement between chords' },
    { titleHe: 'תנועה חלקה', titleEn: 'Smooth Voice Movement', descHe: 'מעבר בין אקורדים במרחק חצי-טון או טון', descEn: 'Moving between chords by step' },
    { titleHe: 'היפוך שלישי (ספטימה בבס)', titleEn: 'Third Inversion (7th in bass)', descHe: 'ספטימה בבס: G7/F', descEn: 'Seventh in bass: G7/F' },
  ],
  [
    { titleHe: 'Drop 2 Voicings', titleEn: 'Drop 2 Voicings', descHe: 'הורדת הקול השני מהגבוה — עמדת גיטרה', descEn: 'Lowering 2nd voice from top — guitar voicing' },
    { titleHe: 'Drop 3 Voicings', titleEn: 'Drop 3 Voicings', descHe: 'הורדת הקול השלישי מהגבוה', descEn: 'Lowering 3rd voice from top' },
    { titleHe: 'Close vs Open Voicing', titleEn: 'Close vs Open Voicing', descHe: 'כל התווים בתוך אוקטבה vs מרווחות', descEn: 'All notes within one octave vs spread out' },
    { titleHe: 'Shell Voicings', titleEn: 'Shell Voicings', descHe: 'שורש + טרצה + ספטימה — עמדת ג׳אז', descEn: 'Root + third + seventh — jazz voicing' },
    { titleHe: 'Voice Leading ב-ii-V-I', titleEn: 'Voice Leading in ii-V-I', descHe: 'ניהול קולות מושלם בפרוגרסיה ג׳אזית', descEn: 'Smooth voice leading in jazz progression' },
    { titleHe: 'קינטה מקבילה — להימנע', titleEn: 'Parallel Fifths — Avoid', descHe: 'כלל קלאסי: אין קינטות מקבילות', descEn: 'Classical rule: no parallel fifths' },
    { titleHe: 'החלטת ספטימה', titleEn: 'Seventh Resolution', descHe: 'הספטימה יורדת חצי-טון', descEn: 'The seventh resolves down a semitone' },
    { titleHe: 'העלאת תוו רגיש', titleEn: 'Leading Tone Resolution', descHe: 'הדרגה ה-7 מז׳ורי עולה לאוקטבה', descEn: 'Major 7th degree rises to the octave' },
    { titleHe: 'ניהול קולות בבלוקים', titleEn: 'Block Chord Voice Leading', descHe: 'בלוק-אקורדים בסגנון Locked Hands', descEn: 'Block chords in Locked Hands style' },
  ],
  [
    { titleHe: 'Voice Leading ב-4 קולות', titleEn: '4-Voice Chorale Writing', descHe: 'בס, טנור, אלט, סופרן — קלאסי', descEn: 'Bass, tenor, alto, soprano — classical' },
    { titleHe: 'Contrary Motion כהרמוניה', titleEn: 'Contrary Motion as Harmony', descHe: 'שימוש בתנועה מנוגדת כהאסטרטגיה', descEn: 'Using contrary motion as strategy' },
    { titleHe: 'ניתוח Bach Chorale', titleEn: 'Bach Chorale Analysis', descHe: 'ניתוח ניהול קולות בכורל של באך', descEn: 'Analyzing voice leading in a Bach chorale' },
    { titleHe: 'Quartal Voicings', titleEn: 'Quartal Voicings', descHe: 'עמדות מבוססות קווארטות — מודרני', descEn: 'Voicings built in fourths — modern' },
    { titleHe: 'Upper Structure Triads', titleEn: 'Upper Structure Triads', descHe: 'טריאדה גבוהה מעל בס מורכב', descEn: 'High triad over complex bass' },
    { titleHe: 'Reharmonization', titleEn: 'Reharmonization', descHe: 'שינוי הרמוניה תחת מלודיה קיימת', descEn: 'Changing harmony under an existing melody' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Voice Leading Mastery', descHe: 'ניהול קולות בכל הסגנונות', descEn: 'Voice leading in all styles' },
  ],
)

// ── polyrhythm ────────────────────────────────────────────────────────────────

const POLY_NODES = makeTopic(
  'polyrhythm',
  'M4 11h16v2H4v-2zm0-6h16v2H4V5zm0 12h10v2H4v-2z',
  [
    { titleHe: 'מה הוא ריתם?', titleEn: 'What is Rhythm?', descHe: 'ארגון זמן במוזיקה', descEn: 'Organization of time in music' },
    { titleHe: 'תו רבע ותו שמינית', titleEn: 'Quarter & Eighth Notes', descHe: 'ערכי תווים בסיסיים', descEn: 'Basic note values' },
    { titleHe: 'מד 4/4', titleEn: '4/4 Time Signature', descHe: 'ארבע פעמות לתיבה', descEn: 'Four beats per measure' },
    { titleHe: 'מד 3/4', titleEn: '3/4 Time Signature', descHe: 'שלוש פעמות לתיבה (וולס)', descEn: 'Three beats per measure (waltz)' },
    { titleHe: 'Triplets — שלישיות', titleEn: 'Triplets', descHe: '3 תווים בזמן של 2 — הרגשת "שלוש"', descEn: '3 notes in the space of 2 — triplet feel' },
    { titleHe: 'Syncopation', titleEn: 'Syncopation', descHe: 'הדגשה על פעמה חלשה', descEn: 'Emphasis on a weak beat' },
    { titleHe: 'הגדרת פולירית׳ם', titleEn: 'Polyrhythm Defined', descHe: 'שני ריתמים שונים בו-זמנית', descEn: 'Two different rhythms simultaneously' },
    { titleHe: '2-against-3', titleEn: '2-against-3', descHe: 'שניים מול שלוש — הפולירית׳ם הקלאסי', descEn: 'Two against three — the classic polyrhythm' },
    { titleHe: 'מד 6/8', titleEn: '6/8 Time', descHe: 'שש שמיניות — שתי קבוצות של שלוש', descEn: 'Six eighths — two groups of three' },
  ],
  [
    { titleHe: '3-against-4', titleEn: '3-against-4', descHe: 'שלוש מול ארבע — מורכב יותר', descEn: 'Three against four — more complex' },
    { titleHe: 'Hemiola', titleEn: 'Hemiola', descHe: '3 זוגות של 2 = 2 קבוצות של 3', descEn: '3 pairs of 2 = 2 groups of 3' },
    { titleHe: 'מד 5/4', titleEn: '5/4 Time', descHe: 'Take Five — חמש פעמות לתיבה', descEn: 'Take Five — five beats per measure' },
    { titleHe: 'מד 7/8', titleEn: '7/8 Time', descHe: 'שבע שמיניות — אופייני למוזיקה בלקנית', descEn: 'Seven eighths — Balkan feel' },
    { titleHe: 'Cross-Rhythm', titleEn: 'Cross-Rhythm', descHe: 'ריתמים חוצים את הפעמה החזקה', descEn: 'Rhythms crossing the main beat' },
    { titleHe: 'Metric Modulation', titleEn: 'Metric Modulation', descHe: 'שינוי תחושת הטמפו דרך פרופורציה', descEn: 'Changing tempo feel through proportion' },
    { titleHe: 'Polymeter', titleEn: 'Polymeter', descHe: 'שני מדים שונים בו-זמנית', descEn: 'Two different time signatures simultaneously' },
    { titleHe: 'פולירית׳ם בגיטרה', titleEn: 'Polyrhythm on Guitar', descHe: 'ניגון 4-against-3 עם ידיים', descEn: 'Playing 4-against-3 with both hands' },
    { titleHe: 'פולירית׳ם בז׳אנרים', titleEn: 'Polyrhythm in Genres', descHe: 'אפריקאי, ברזילאי, ג׳אז, פרוג', descEn: 'African, Brazilian, jazz, prog' },
  ],
  [
    { titleHe: '4-against-3', titleEn: '4-against-3', descHe: 'ארבעה מול שלושה — מורכב', descEn: 'Four against three — complex' },
    { titleHe: 'Rhythmic Displacement', titleEn: 'Rhythmic Displacement', descHe: 'הזזת ביטוי ריתמי על ציר הזמן', descEn: 'Shifting a rhythmic phrase along the timeline' },
    { titleHe: 'Odd-Meter Grooves', titleEn: 'Odd-Meter Grooves', descHe: '5/4, 7/8 — ניגון עם "גרוב"', descEn: '5/4, 7/8 — playing with groove' },
    { titleHe: 'Steve Reich Style', titleEn: 'Steve Reich Style', descHe: 'Phasing — שני ריתמים מתרחקים', descEn: 'Phasing — two rhythms drifting apart' },
    { titleHe: 'פולירית׳ם בסלה', titleEn: 'Polyrhythm in Ostinato', descHe: 'בסיס ריתמי חוזר עם חריגות', descEn: 'Repeating rhythmic base with exceptions' },
    { titleHe: 'Progressive Rock', titleEn: 'Progressive Rock Rhythms', descHe: '21/8, Tool — מדים מורכבים', descEn: '21/8, Tool — complex time signatures' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Polyrhythm Mastery', descHe: 'כל הפולירית׳מים, כל המדים', descEn: 'All polyrhythms, all time signatures' },
  ],
)

// ── chord_soloing ─────────────────────────────────────────────────────────────

const SOLOING_NODES = makeTopic(
  'chord_soloing',
  'M12 14l9-5-9-5-9 5 9 5zm0 2l-9-5v6l9 5 9-5v-6l-9 5z',
  [
    { titleHe: 'מה הוא Chord Tone Soloing?', titleEn: 'What is Chord-Tone Soloing?', descHe: 'סולו המדגיש תווי אקורד', descEn: 'Solo emphasizing chord tones' },
    { titleHe: 'תווי אקורד vs תווי סולם', titleEn: 'Chord Tones vs Scale Tones', descHe: '1-3-5-7 = חזקים, שאר = מעבר', descEn: '1-3-5-7 = strong, rest = passing' },
    { titleHe: 'ארפג׳ו', titleEn: 'Arpeggios', descHe: 'ניגון תווי אקורד בזה אחר זה', descEn: 'Playing chord tones one after another' },
    { titleHe: 'C מז׳ור ארפג׳ו', titleEn: 'C Major Arpeggio', descHe: 'C-E-G על הצוואר — מסלולים', descEn: 'C-E-G on the neck — paths' },
    { titleHe: 'Am ארפג׳ו', titleEn: 'Am Arpeggio', descHe: 'A-C-E — מסלולים', descEn: 'A-C-E — paths' },
    { titleHe: 'G7 ארפג׳ו', titleEn: 'G7 Arpeggio', descHe: 'G-B-D-F — מסלולים', descEn: 'G-B-D-F — paths' },
    { titleHe: 'Dm7 ארפג׳ו', titleEn: 'Dm7 Arpeggio', descHe: 'D-F-A-C — מסלולים', descEn: 'D-F-A-C — paths' },
    { titleHe: 'תנועה כרומטית לתווי אקורד', titleEn: 'Chromatic Approach to Chord Tones', descHe: 'נגיעה מחצי-טון לפני תו אקורד', descEn: 'Landing on chord tones from a semitone away' },
    { titleHe: 'Guide Tones', titleEn: 'Guide Tones', descHe: 'טרצה + ספטימה = תווי ניהול', descEn: 'Third + seventh = guide tones' },
  ],
  [
    { titleHe: 'ארפג׳ו על ii-V-I', titleEn: 'Arpeggios Over ii-V-I', descHe: 'מסלול דרך Dm7-G7-Cmaj7', descEn: 'Path through Dm7-G7-Cmaj7' },
    { titleHe: 'הרחבת ארפג׳ו', titleEn: 'Extended Arpeggios', descHe: '9, 11, 13 — מעבר לד תווים', descEn: '9, 11, 13 — beyond four notes' },
    { titleHe: 'ארפג׳ו ו-CAGED', titleEn: 'Arpeggios & CAGED', descHe: 'שילוב ארפג׳יו עם צורות CAGED', descEn: 'Combining arpeggios with CAGED shapes' },
    { titleHe: 'ניגון על שינוי אקורד', titleEn: 'Playing Through Changes', descHe: 'מעקב אחר שינויי אקורדים בסולו', descEn: 'Following chord changes while soloing' },
    { titleHe: 'Enclosure', titleEn: 'Enclosure', descHe: 'הקפת תו מטרה מלמעלה ומלמטה', descEn: 'Approaching a target tone from above and below' },
    { titleHe: 'Bebop Scale', titleEn: 'Bebop Scale', descHe: 'מז׳ור + #5 — 8 תווים לבי-בופ', descEn: 'Major + #5 — 8-note bebop scale' },
    { titleHe: 'ארפג׳יו על כל 12 שורשים', titleEn: 'Arpeggios All 12 Roots', descHe: 'maj, min, dom7, m7b5 בכל שורש', descEn: 'maj, min, dom7, m7b5 in all roots' },
    { titleHe: 'Superimposition', titleEn: 'Arpeggio Superimposition', descHe: 'ניגון ארפג׳ו של אקורד שונה', descEn: 'Playing an arpeggio from a different chord' },
    { titleHe: 'Guide Tone Lines', titleEn: 'Guide Tone Lines', descHe: 'קו מלודי מהטרצה/ספטימה לאקורד הבא', descEn: 'Melodic line from guide tone to next chord' },
  ],
  [
    { titleHe: 'ארפג׳ו פנימי', titleEn: 'Inner Voice Arpeggios', descHe: 'ניגון ארפג׳ו בקולות פנימיים', descEn: 'Arpeggios in inner voices' },
    { titleHe: 'Coltrane Changes', titleEn: 'Coltrane Changes', descHe: 'מסלול ארפג׳ו מתקדם דרך 3 מרכזים', descEn: 'Advanced arpeggio path through 3 tonal centers' },
    { titleHe: 'Altered Tensions in Solo', titleEn: 'Altered Tensions in Solo', descHe: 'שימוש ב-b9, #9, b5 כצבעים', descEn: 'Using b9, #9, b5 as colors' },
    { titleHe: 'Chord Melody', titleEn: 'Chord Melody', descHe: 'מלודיה ואקורד בו-זמנית', descEn: 'Melody and chord simultaneously' },
    { titleHe: 'Sweep Picking', titleEn: 'Sweep Picking', descHe: 'ניגון ארפג׳יו במשיחה רציפה', descEn: 'Playing arpeggios with sweep picking' },
    { titleHe: 'ז׳אז Chord Soloing', titleEn: 'Jazz Chord Soloing', descHe: 'ניגון מלודיה על אקורדי ג׳אז', descEn: 'Soloing over jazz chord changes' },
    { titleHe: 'שליטה מלאה', titleEn: 'Full Soloing Mastery', descHe: 'ארפג׳יו וסולו על כל אקורד', descEn: 'Arpeggios and soloing over any chord' },
  ],
)

// ── Export all trees ──────────────────────────────────────────────────────────

export const TOPIC_TREES: Record<string, TreeNode[]> = {
  major_scale:       MAJOR_SCALE_NODES,
  intervals_theory:  INTERVALS_NODES,
  chord_construction: CHORDS_NODES,
  circle_of_fifths:  CIRCLE_NODES,
  diatonic_harmony:  DIATONIC_NODES,
  caged_system:      CAGED_NODES,
  seventh_chords:    SEVENTH_CHORDS_NODES,
  pentatonic_blues:  PENTA_NODES,
  minor_scales:      MINOR_NODES,
  modes_theory:      MODES_NODES,
  modal_interchange: MODAL_INT_NODES,
  voice_leading:     VOICE_NODES,
  polyrhythm:        POLY_NODES,
  chord_soloing:     SOLOING_NODES,
}

export function getTopicTree(topicId: string): TreeNode[] {
  return TOPIC_TREES[topicId] ?? []
}
