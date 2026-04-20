// Ear-training questions — text-based MC until the Web Audio API is wired.
// Questions cover the conceptual knowledge behind ear training so users
// understand what they are eventually supposed to hear.

import type { Question, Difficulty } from '../types'
import { uid } from '../musicTheory'

function q(
  categoryId: 'intervals_ear' | 'chord_quality' | 'chord_progressions' | 'scale_id',
  difficulty: Difficulty,
  promptHe: string, promptEn: string,
  choices: [string, string][],  // [he, en] tuples
  correctIndex: number,
  explanationHe: string, explanationEn: string,
): Question {
  return {
    id: uid(),
    categoryId,
    difficulty,
    prompt: { he: promptHe, en: promptEn },
    choices: choices.map(([he, en]) => ({ he, en })),
    correctIndex,
    explanation: { he: explanationHe, en: explanationEn },
    theory: { he: 'אימון אוזן פותח את היכולת לזהות צלילים ומרחקים ביניהם.', en: 'Ear training develops the ability to identify sounds and intervals.' },
  }
}

// ── intervals_ear ─────────────────────────────────────────────────────────────

const INTERVALS_EAR_EASY: Question[] = [
  q('intervals_ear', 'easy',
    'איזה אינטרוול נשמע הכי "יציב" ומשלים?',
    'Which interval sounds the most stable and resolved?',
    [['קווינטה מושלמת', 'Perfect 5th'],['טריטון', 'Tritone'],['שנייה מינורית', 'Minor 2nd'],['שביעית מז׳ורית', 'Major 7th']],
    0,
    'הקווינטה המושלמת (7 חצ"ט) היא האינטרוול היציב ביותר — אין בה מתח. הטריטון, לעומת זאת, הוא המתוח ביותר.',
    'The perfect 5th (7 semitones) is the most stable interval — no tension. The tritone is the most dissonant.'),
  q('intervals_ear', 'easy',
    'שמע שני תווים: C ואז C♯. מה האינטרוול ביניהם?',
    'You hear two notes: C and then C♯. What is the interval?',
    [['חצי-טון (שנייה מינורית)', 'Half step (Minor 2nd)'],['טון שלם (שנייה מז׳ורית)', 'Whole step (Major 2nd)'],['טרצה מינורית', 'Minor 3rd'],['קווינטה', 'Perfect 5th']],
    0,
    'C ל-C♯ הוא חצי-טון אחד — שנייה מינורית. זהו המרחק הקטן ביותר שיש במוזיקה טונאלית.',
    'C to C♯ is one semitone — a minor 2nd. This is the smallest interval in tonal music.'),
  q('intervals_ear', 'easy',
    'איזה אינטרוול נשמע הכי "מסוכן" ולא יציב?',
    'Which interval is famously the most dissonant and unstable?',
    [['טריטון', 'Tritone'],['קווינטה מושלמת', 'Perfect 5th'],['אוקטבה', 'Octave'],['טרצה מז׳ורית', 'Major 3rd']],
    0,
    'הטריטון (6 חצ"ט) כונה ב"diabolus in musica" — השטן במוזיקה. הוא יוצר מתח חזק שדורש פתרון.',
    'The tritone (6 semitones) was called "diabolus in musica" — the devil in music. It creates strong tension demanding resolution.'),
]

const INTERVALS_EAR_MEDIUM: Question[] = [
  q('intervals_ear', 'medium',
    'טרצה מז׳ורית כוללת כמה חצאי-טונים?',
    'How many semitones does a major 3rd contain?',
    [['4', '4'],['3', '3'],['5', '5'],['2', '2']],
    0,
    'טרצה מז׳ורית = 4 חצאי-טונים. לדוגמה: C–E. היא מרכיב עיקרי של האקורד המז׳ורי.',
    'Major 3rd = 4 semitones. For example: C–E. It is a key component of the major chord.'),
  q('intervals_ear', 'medium',
    'מה ההבדל בין טרצה מז׳ורית למינורית בשמיעה?',
    'How does a major 3rd differ from a minor 3rd in sound?',
    [['מז׳ור נשמע בהיר ושמח; מינור — עגמומי ועמוק', 'Major sounds bright/happy; minor sounds dark/melancholy'],
     ['מז׳ור נשמע עמוק יותר', 'Major sounds deeper'],
     ['אין הבדל — הם זהים', 'No difference — they are identical'],
     ['מינור נשמע חזק יותר', 'Minor sounds louder']],
    0,
    'הטרצה קובעת את "הצבע" של האקורד. מז׳ור = בהיר, שמח. מינור = עמוק, עגמומי. זה ההבדל הבסיסי ביותר בהרמוניה.',
    'The third defines the "color" of a chord. Major = bright, happy. Minor = dark, melancholy. This is the most fundamental color distinction in harmony.'),
  q('intervals_ear', 'medium',
    'מה נשמע כאשר מנגנים שני תווים רחוקים אוקטבה?',
    'What happens perceptually when two notes are an octave apart?',
    [['הם נשמעים כמעט כמו אותו תו, רק גבוה יותר', 'They sound almost like the same note, just higher'],
     ['הם יוצרים דיסוננס חריף', 'They create sharp dissonance'],
     ['הם שונים לחלוטין זה מזה', 'They sound completely different'],
     ['רק אחד מהם נשמע', 'Only one of them is heard']],
    0,
    'אוקטבה = 12 חצאי-טונים. התדר גבוה בדיוק פי 2. המוח תופס אותם כ"אותו תו" — זו ה-pitch class equivalence.',
    'Octave = 12 semitones. The frequency is exactly double. The brain perceives them as "the same note" — this is pitch class equivalence.'),
]

const INTERVALS_EAR_HARD: Question[] = [
  q('intervals_ear', 'hard',
    'האינטרוול בין G ל-D♭ הוא טריטון. כמה חצאי-טונים זה?',
    'The interval from G to D♭ is a tritone. How many semitones is that?',
    [['6', '6'],['5', '5'],['7', '7'],['8', '8']],
    0,
    'הטריטון = 6 חצאי-טונים. G→G♯→A→A♯→B→C→D♭ — שישה שלבים. בדיוק חצי אוקטבה, ולכן הוא כה מיוחד.',
    'Tritone = 6 semitones. G→G♯→A→A♯→B→C→D♭ — six steps. Exactly half an octave, which is what makes it so special.'),
  q('intervals_ear', 'hard',
    'ב-jazz, הטריטון substitution מחליף V7 ב-♭II7. מה הסיבה?',
    'In jazz, tritone substitution replaces V7 with ♭II7. Why does this work?',
    [['לשני האקורדים יש אותו טריטון פנימי', 'Both chords share the same internal tritone'],
     ['שניהם מינורים', 'Both are minor chords'],
     ['הם באותו מפתח', 'They are in the same key'],
     ['הם יוצרים את אותו בס', 'They produce the same bass note']],
    0,
    'G7 (V) מכיל B ו-F. D♭7 (♭II) מכיל F ו-B♭ — אותו טריטון, רק הפוך! לכן ניתן להחליפם. זו ידיעה מתקדמת של jazz.',
    'G7 (V) contains B and F. D♭7 (♭II) contains F and C♭ (=B) — the same tritone, inverted! This is why the substitution works harmonically.'),
]

export function generateIntervalsEarQuestion(difficulty: Difficulty): Question {
  const pool = difficulty === 'easy' ? INTERVALS_EAR_EASY : difficulty === 'medium' ? INTERVALS_EAR_MEDIUM : INTERVALS_EAR_HARD
  return { ...pool[Math.floor(Math.random() * pool.length)], id: uid() }
}

// ── chord_quality ─────────────────────────────────────────────────────────────

const CHORD_QUALITY_EASY: Question[] = [
  q('chord_quality', 'easy',
    'מה הופך אקורד למינורי לעומת מז׳ורי?',
    'What makes a chord minor rather than major?',
    [['הטרצה המינורית (3 חצ"ט במקום 4)', 'The minor third (3 semitones instead of 4)'],
     ['הקווינטה הנמוכה', 'The lower fifth'],
     ['הטוניקה הנמוכה', 'A lower root'],
     ['יש בו יותר תווים', 'It has more notes']],
    0,
    'בין הטוניקה לטרצה: מז׳ור = 4 חצ"ט, מינור = 3 חצ"ט. זה ההבדל היחידי בין טריאד מז׳ור למינור — טרצה נמוכה בחצי-טון.',
    'Between root and third: major = 4 semitones, minor = 3 semitones. This is the only difference between a major and minor triad.'),
  q('chord_quality', 'easy',
    'אקורד "מוקטן" (diminished) בנוי מאיזה אינטרוולים?',
    'A diminished chord is built from which intervals?',
    [['טרצה מינורית + טרצה מינורית', 'Minor 3rd + Minor 3rd'],
     ['טרצה מז׳ורית + טרצה מינורית', 'Major 3rd + Minor 3rd'],
     ['טרצה מינורית + טרצה מז׳ורית', 'Minor 3rd + Major 3rd'],
     ['שתי קווינטות', 'Two perfect 5ths']],
    0,
    'Diminished = 3 + 3 חצ"ט. לדוגמה: C–E♭–G♭. שני מינורים גורמים לצליל מאוד מתוח ולא יציב.',
    'Diminished = 3 + 3 semitones. Example: C–E♭–G♭. Two minor thirds create a very tense, unstable sound.'),
]

const CHORD_QUALITY_MEDIUM: Question[] = [
  q('chord_quality', 'medium',
    'מה ההבדל בין Cmaj7 ל-C7 (dominant)?',
    'What is the difference between Cmaj7 and C7 (dominant)?',
    [['Cmaj7 מכיל B; C7 מכיל B♭', 'Cmaj7 contains B; C7 contains B♭'],
     ['Cmaj7 גדול יותר', 'Cmaj7 is a bigger chord'],
     ['C7 אינו בשימוש', 'C7 is not used in music'],
     ['אין הבדל ביניהם', 'There is no difference between them']],
    0,
    'ה-7 מז׳ורית (B) יוצרת צליל מתוחכם ומרוחק. ה-7 דומיננטית (B♭) יוצרת מתח חזק שדורש פתרון לאקורד ה-IV.',
    'The major 7th (B) creates a sophisticated, suspended sound. The dominant 7th (B♭) creates strong tension that resolves to the IV chord.'),
  q('chord_quality', 'medium',
    'למה אקורד "augmented" נשמע לא יציב?',
    'Why does an augmented chord sound unstable?',
    [['הקווינטה המוגדלת (8 חצ"ט) יוצרת מתח', 'The augmented 5th (8 semitones) creates tension'],
     ['יש בו יותר מדי תווים', 'It has too many notes'],
     ['הטוניקה חסרה בו', 'The root is missing'],
     ['הוא מינורי מדי', 'It is too minor']],
    0,
    'האקורד המוגדל: טרצה מז׳ורית + טרצה מז׳ורית (4+4 חצ"ט). הקווינטה מוגדלת בחצי-טון מהמושלמת, ויוצרת מתח.',
    'Augmented chord: major 3rd + major 3rd (4+4 semitones). The fifth is raised by a half step from perfect, creating tension.'),
]

const CHORD_QUALITY_HARD: Question[] = [
  q('chord_quality', 'hard',
    'ה-7♯9 chord (Hendrix chord) מורכב מאיזה אינטרוולים?',
    'The 7♯9 chord (Hendrix chord) contains which interval above the root?',
    [['1, 3, 5, ♭7, ♯9', '1, 3, 5, ♭7, ♯9'],
     ['1, ♭3, 5, 7', '1, ♭3, 5, 7'],
     ['1, 4, 5, 7', '1, 4, 5, 7'],
     ['1, 3, ♭5, ♭7', '1, 3, ♭5, ♭7']],
    0,
    'E7♯9 = E G♯ B D G♯/G♮ (שינוי). ה-♯9 = מינור טרצה מעל האוקטבה. יוצר בו-זמנית מז׳ור ומינור — לכן נשמע כה מיוחד.',
    'E7♯9 contains both a major 3rd and a ♯9 (=minor 3rd an octave up). This simultaneous major/minor quality is what gives it that intense, bluesy-rock sound.'),
]

export function generateChordQualityQuestion(difficulty: Difficulty): Question {
  const pool = difficulty === 'easy' ? CHORD_QUALITY_EASY : difficulty === 'medium' ? CHORD_QUALITY_MEDIUM : CHORD_QUALITY_HARD
  return { ...pool[Math.floor(Math.random() * pool.length)], id: uid() }
}

// ── chord_progressions ────────────────────────────────────────────────────────

const PROGRESSIONS_EASY: Question[] = [
  q('chord_progressions', 'easy',
    'מהי הפרוגרסיה I–IV–V–I?',
    'What is the I–IV–V–I progression?',
    [['הפרוגרסיה הנפוצה ביותר במוזיקה המערבית', 'The most common progression in Western music'],
     ['פרוגרסיה מינורית בלבד', 'A minor-only progression'],
     ['פרוגרסיה מז׳ז בלבד', 'A jazz-only progression'],
     ['פרוגרסיה בת 8 אקורדים', 'An 8-chord progression']],
    0,
    'I=טוניקה, IV=סובדומיננטה, V=דומיננטה. ב-C מז׳ור: C–F–G–C. זו מבנה הבסיס של רוק, בלוז, קאנטרי ומוזיקה קלאסית.',
    'I=tonic, IV=subdominant, V=dominant. In C major: C–F–G–C. This forms the backbone of rock, blues, country, and classical music.'),
  q('chord_progressions', 'easy',
    'פרוגרסיית vi–IV–I–V נפוצה מאוד. איפה שומעים אותה?',
    'The vi–IV–I–V progression is extremely common. Where is it heard?',
    [['ברוב הפופ המודרני (נקראת "Axis progression")', 'In most modern pop (called the "Axis progression")'],
     ['רק ב-jazz', 'Only in jazz'],
     ['בלוז בלבד', 'Blues only'],
     ['מוזיקה קלאסית בלבד', 'Classical music only']],
    0,
    'הפרוגרסיה הזו מופיעה ב-Let It Be, No Woman No Cry, Don\'t Stop Believin\' ועוד מאות שירים. ב-C: Am–F–C–G.',
    'This progression appears in Let It Be, No Woman No Cry, Don\'t Stop Believin\' and hundreds of others. In C: Am–F–C–G.'),
]

const PROGRESSIONS_MEDIUM: Question[] = [
  q('chord_progressions', 'medium',
    'מה הייחוד של פרוגרסיית ה-ii–V–I ב-jazz?',
    'What makes the ii–V–I progression central to jazz?',
    [['היא יוצרת תנועה חזקה לטוניקה דרך דומיננטה', 'It creates strong motion to the tonic through the dominant'],
     ['היא פשוטה מדי ל-jazz', 'It is too simple for jazz'],
     ['היא מינורית תמיד', 'It is always minor'],
     ['משתמשים בה רק בסיומות', 'It is only used in endings']],
    0,
    'Dm7–G7–Cmaj7 ב-C מז׳ור. ה-ii מכין את ה-V (הפרדוקסאלי), ה-V יוצר מתח מקסימלי לפני הפתרון ל-I. ה-"lingua franca" של jazz.',
    'Dm7–G7–Cmaj7 in C major. The ii prepares the V, which creates maximum tension before resolving to I. The lingua franca of jazz harmony.'),
  q('chord_progressions', 'medium',
    'מהי הפרוגרסיה 12-bar blues?',
    'What is the 12-bar blues form?',
    [['I–I–I–I / IV–IV–I–I / V–IV–I–V', 'I–I–I–I / IV–IV–I–I / V–IV–I–V'],
     ['I–IV–V–IV', 'I–IV–V–IV'],
     ['i–iv–v–i', 'i–iv–v–i'],
     ['I–V–vi–IV', 'I–V–vi–IV']],
    0,
    '12-bar blues הוא מבנה קבוע של 12 מדדים. כל האקורדים הם דומיננטיים (7th). ב-E: E7–E7–E7–E7 / A7–A7–E7–E7 / B7–A7–E7–B7.',
    'The 12-bar blues is a fixed 12-measure form. All chords are dominant 7ths. In E: E7–E7–E7–E7 / A7–A7–E7–E7 / B7–A7–E7–B7.'),
]

const PROGRESSIONS_HARD: Question[] = [
  q('chord_progressions', 'hard',
    'מה זה "rhythm changes" ב-jazz?',
    'What are "rhythm changes" in jazz?',
    [['פרוגרסיה ב-B♭ בהשראת "I Got Rhythm" של גרשווין', 'A B♭ progression inspired by Gershwin\'s "I Got Rhythm"'],
     ['שינוי קצב בדרך של טריפלת', 'A triplet-based rhythm change'],
     ['פרוגרסיה ב-12 מדדים', 'A 12-measure progression'],
     ['החלפת אקורד בטריטון substitute', 'Replacing a chord with its tritone substitute']],
    0,
    '"Rhythm changes" = AABA 32-מדד. ה-A: ||: B♭ G7 | Cm7 F7 | B♭ B♭7 | E♭ Edim | B♭/F F7 | B♭ :||. ה-B: iii–VI7–ii–V7 ב-D, G, C, F.',
    '"Rhythm changes" = AABA 32-bar form based on Gershwin. The A section moves through B♭ with quick chord changes. The bridge cycles through the circle of fifths.'),
]

export function generateChordProgressionsQuestion(difficulty: Difficulty): Question {
  const pool = difficulty === 'easy' ? PROGRESSIONS_EASY : difficulty === 'medium' ? PROGRESSIONS_MEDIUM : PROGRESSIONS_HARD
  return { ...pool[Math.floor(Math.random() * pool.length)], id: uid() }
}

// ── scale_id ──────────────────────────────────────────────────────────────────

const SCALE_ID_EASY: Question[] = [
  q('scale_id', 'easy',
    'מה הנוסחה של הסולם המז׳ורי?',
    'What is the formula of the major scale?',
    [['T T H T T T H', 'W W H W W W H'],
     ['T H T T H T T', 'W H W W H W W'],
     ['T T T H T T H', 'W W W H W W H'],
     ['H T T T H T T', 'H W W W H W W']],
    0,
    'T=טון שלם, H=חצי-טון. הנוסחה יוצרת את הצליל "שמח" של המז׳ור. C מז׳ור: C D E F G A B C — שים לב לחצאי-טונים בין E–F ו-B–C.',
    'W=whole step, H=half step. This formula creates the "happy" major sound. C major: C D E F G A B C — note the half steps between E–F and B–C.'),
  q('scale_id', 'easy',
    'מה ההבדל בין הסולם המינורי הטבעי להרמוני?',
    'What is the difference between natural minor and harmonic minor?',
    [['הרמוני מינור מעלה ה-7 בחצי-טון', 'Harmonic minor raises the 7th by a half step'],
     ['הרמוני מינור מוריד ה-3 בחצי-טון', 'Harmonic minor lowers the 3rd'],
     ['אין הבדל ביניהם', 'There is no difference between them'],
     ['הרמוני מינור הוא מז׳ורי', 'Harmonic minor is a major scale']],
    0,
    'A טבעי מינור: A B C D E F G. A הרמוני מינור: A B C D E F G♯ — ה-G♯ יוצר מתח חזק כלפי ה-A (וכן את הצליל הספרדי/פלמנקו).',
    'A natural minor: A B C D E F G. A harmonic minor: A B C D E F G♯ — the G♯ creates a strong pull toward A and gives harmonic minor its distinctive exotic sound.'),
]

const SCALE_ID_MEDIUM: Question[] = [
  q('scale_id', 'medium',
    'מה מייחד את סולם הבלוז לעומת הפנטטוני המינורי?',
    'What distinguishes the blues scale from the minor pentatonic?',
    [['תו הבלוז — ה-♭5 (טריטון)', 'The blue note — the ♭5 (tritone)'],
     ['הבלוז כולל יותר תווים', 'Blues has more notes overall'],
     ['הבלוז הוא מז׳ורי', 'Blues scale is major'],
     ['הם זהים לחלוטין', 'They are identical']],
    0,
    'פנטטוני מינורי (5 תווים): 1 ♭3 4 5 ♭7. סולם בלוז (6 תווים): 1 ♭3 4 ♭5 5 ♭7. ה-♭5 הוא "התו הכחול" שנותן את הצליל המאפיין.',
    'Minor pentatonic (5 notes): 1 ♭3 4 5 ♭7. Blues scale (6 notes): 1 ♭3 4 ♭5 5 ♭7. The ♭5 is the "blue note" that gives it its characteristic tension.'),
  q('scale_id', 'medium',
    'מה הדוריאן מוד ואיפה משתמשים בו?',
    'What is the Dorian mode and where is it used?',
    [['מינור עם ♮6 — נשמע "חמים", נפוץ ב-jazz ופאנק', 'Minor with ♮6 — sounds "warm", common in jazz and funk'],
     ['מז׳ור עם ♭7', 'Major with ♭7'],
     ['מינור עם ♭6', 'Minor with ♭6'],
     ['סולם מיוחד ל-flamenco', 'A scale specific to flamenco']],
    0,
    'דוריאן = מינור טבעי עם ♮6 (במקום ♭6). A דוריאן: A B C D E F♯ G. F♯ (♮6) נותן צליל חמים יותר ממינור. Santana, Miles Davis ורבים אחרים.',
    'Dorian = natural minor with ♮6. A Dorian: A B C D E F♯ G. The raised 6th gives a warmer, brighter sound than natural minor. Used by Santana, Miles Davis, and countless others.'),
]

const SCALE_ID_HARD: Question[] = [
  q('scale_id', 'hard',
    'מה ה"Lydian" מוד ואיזה צליל ייחודי יש לו?',
    'What is the Lydian mode and what is its distinctive sound?',
    [['מז׳ור עם ♯4 — נשמע "חלומי", floating', 'Major with ♯4 — sounds "dreamy", floating'],
     ['מינור עם ♯7', 'Minor with ♯7'],
     ['מז׳ור עם ♭7', 'Major with ♭7'],
     ['כמו מינור הרמוני', 'Same as harmonic minor']],
    0,
    'Lydian = מז׳ור עם ♯4. C Lydian: C D E F♯ G A B. ה-F♯ יוצר צליל "מרחף" שמשמש ב-film scores (John Williams), progressive rock ו-fusion jazz.',
    'Lydian = major with ♯4. C Lydian: C D E F♯ G A B. The ♯4 creates a floating, ethereal quality used extensively in film scores, progressive rock, and fusion jazz.'),
]

export function generateScaleIdQuestion(difficulty: Difficulty): Question {
  const pool = difficulty === 'easy' ? SCALE_ID_EASY : difficulty === 'medium' ? SCALE_ID_MEDIUM : SCALE_ID_HARD
  return { ...pool[Math.floor(Math.random() * pool.length)], id: uid() }
}
