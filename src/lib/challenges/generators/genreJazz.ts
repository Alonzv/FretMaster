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
    prompt: { he: 'מהי פרוגרסיית II-V-I?', en: 'What is the II-V-I progression?' },
    correct: { he: 'הפרוגרסיה ההרמונית הבסיסית ביותר בג׳אז: מינור 7 → דומיננט 7 → מז׳ור 7', en: 'The most fundamental jazz harmonic progression: minor 7 → dominant 7 → major 7' },
    distractors: [{ he: 'פרוגרסיית ג׳אז עם שלושה מז׳ור 7 אקורדים', en: 'A jazz progression with three major 7 chords' }, { he: 'מעבר כרומטי בין שלושה אקורדים', en: 'Chromatic move between three chords' }, { he: 'פרוגרסיה עם שניים מינוריים ואחד מז׳ורי', en: 'A progression with two minors and one major' }],
    explanation: { he: 'ב-C: Dm7-G7-Cmaj7. ה-ii (Dm7) יוצר מתח, V (G7) מגביר אותו, I (Cmaj7) פותר. זהו הגרעין הרמוני של הג׳אז.', en: 'In C: Dm7-G7-Cmaj7. The ii (Dm7) creates tension, V (G7) increases it, I (Cmaj7) resolves. This is the harmonic nucleus of jazz.' },
    theory: { he: 'II-V-I מופיע בכמעט כל סטנדרט ג׳אז. "Autumn Leaves", "All The Things You Are", "There Will Never Be Another You" כולם בנויים על שרשרות של II-V-I בטונאליויות שונות. ניתן לנגן Dorian על ii, Mixolydian על V, Ionian על I.', en: 'II-V-I appears in almost every jazz standard. "Autumn Leaves", "All The Things You Are", "There Will Never Be Another You" are all built on chains of II-V-I in different keys. Play Dorian over ii, Mixolydian over V, Ionian over I.' },
  },
  {
    prompt: { he: 'מהו אקורד "Maj7"?', en: 'What is a "Maj7" chord?' },
    correct: { he: 'אקורד עם בסיס, טרצה גדולה, קווינטה, וספטימה גדולה (1-3-5-7)', en: 'A chord with root, major third, fifth, and major seventh (1-3-5-7)' },
    distractors: [{ he: 'אקורד עם בסיס, טרצה גדולה, קווינטה, וספטימה קטנה', en: 'A chord with root, major third, fifth, and minor seventh' }, { he: 'אקורד עם בסיס, טרצה קטנה, קווינטה, וספטימה גדולה', en: 'A chord with root, minor third, fifth, and major seventh' }, { he: 'אקורד עם שני בסיסים ושתי קווינטות', en: 'A chord with two roots and two fifths' }],
    explanation: { he: 'Cmaj7 = C-E-G-B. הספטימה הגדולה (B) ליד הבסיס (C) יוצרת מתח עדין ונעים. זה שונה מ-C7 (דומיננט) שיש לו B♭.', en: 'Cmaj7 = C-E-G-B. The major seventh (B) next to the root (C) creates a gentle, pleasant tension. This differs from C7 (dominant) which has B♭.' },
    theory: { he: 'Maj7 אופייני לג׳אז ובוסה נובה. ב-II-V-I: I הוא תמיד Maj7. Cmaj7 על גיטרה: x32000 (בצורה פתוחה) או x-3-5-4-5-x (ברה). ניתן גם להוסיף תשיעית: Cmaj9 = C-E-G-B-D.', en: 'Maj7 is typical of jazz and bossa nova. In II-V-I: I is always Maj7. Cmaj7 on guitar: x32000 (open) or x-3-5-4-5-x (barre). You can also add a ninth: Cmaj9 = C-E-G-B-D.' },
  },
  {
    prompt: { he: 'מה ההבדל בין "Swing" ל-"Straight" ריתמוס?', en: 'What is the difference between "Swing" and "Straight" rhythm?' },
    correct: { he: 'Swing = שמיניות מנוגנות בתחושת שלוש-אחד (triplet feel); Straight = שמיניות שוות', en: 'Swing = eighth notes played with triplet feel (long-short); Straight = equal eighth notes' },
    distractors: [{ he: 'Swing = טמפו מהיר; Straight = טמפו איטי', en: 'Swing = fast tempo; Straight = slow tempo' }, { he: 'Swing = ריתמוס בינארי; Straight = ריתמוס טרינארי', en: 'Swing = binary rhythm; Straight = ternary rhythm' }, { he: 'Swing = עם הקצב; Straight = נגד הקצב', en: 'Swing = on the beat; Straight = against the beat' }],
    explanation: { he: 'בסווינג, שתי שמיניות שכתובות כשוות נשמעות כ-"dah-dit": הראשונה ארוכה (2/3 של רבע), השנייה קצרה (1/3). זה ה"גרוב" של הג׳אז.', en: 'In swing, two written equal eighth notes sound like "dah-dit": the first is long (2/3 of a quarter), the second is short (1/3). This is the "groove" of jazz.' },
    theory: { he: 'הסווינג נובע מ-triplet feel: חשבו על טריאולה של רבע: 1-ה-ל. Swing = נגנו 1 ו-ל (דלגו את ה-ה). מחוות: Count Basie, Duke Ellington. ריתמוס סווינג הוא הבסיס של ג׳אז קלאסי, ביבופ, ומוסיקת בינג בנד.', en: 'Swing comes from triplet feel: think of a quarter note triplet: 1-and-ah. Swing = play 1 and ah (skip the "and"). Masters: Count Basie, Duke Ellington. Swing rhythm is the basis of classic jazz, bebop, and big band music.' },
  },
  {
    prompt: { he: 'מהו "Walking Bass"?', en: 'What is "walking bass"?' },
    correct: { he: 'קו בס ג׳אזי שמנגן בעיקר רבעים ועולה/יורד כרומטית בין אקורדים', en: 'A jazz bass line that plays mainly quarter notes and walks chromatically between chords' },
    distractors: [{ he: 'קו בס שמנגן שמיניות מהירות', en: 'A bass line that plays fast eighth notes' }, { he: 'קו בס שמנגן רק את בסיסי האקורדים', en: 'A bass line that plays only the chord roots' }, { he: 'קו בס שמחקה את הגיטרה', en: 'A bass line that mimics the guitar' }],
    explanation: { he: 'Walking bass = 4 רבעים לתיבה, עם תנועה מלודית שמחברת בין אקורדים. שואפת לנחות על תו האקורד בתיבה החדשה.', en: 'Walking bass = 4 quarter notes per bar, with melodic movement connecting chords. It aims to land on a chord tone on the downbeat of the new bar.' },
    theory: { he: 'Walking bass משתמשת: תווי אקורד (1-3-5-7), גמישויות כרומטיות (חצי-טון מהתו הבא), תווים דיאטוניים. שחקן בס מומלץ ללמוד: Paul Chambers, Ron Carter, Ray Brown. זהו הבסיס של טריו הג׳אז.', en: 'Walking bass uses: chord tones (1-3-5-7), chromatic approaches (half-step from next note), diatonic passing tones. Recommended bass players to study: Paul Chambers, Ron Carter, Ray Brown. This is the foundation of the jazz trio.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מהו מצב "Dorian" ואיך משתמשים בו בג׳אז?', en: 'What is the "Dorian" mode and how is it used in jazz?' },
    correct: { he: 'מינור עם ♭3, ♭7, אך עם 6 טבעית — נגנים על אקורדי ii מינור', en: 'Minor with ♭3 and ♭7, but with a natural 6 — played over ii minor chords' },
    distractors: [{ he: 'מינור עם ♭2 — נגנים על אקורד V', en: 'Minor with ♭2 — played over V chord' }, { he: 'מז׳ור עם ♭6 — נגנים על IV מז׳ור', en: 'Major with ♭6 — played over IV major' }, { he: 'מינור עם ♭5 — נגנים על vii°', en: 'Minor with ♭5 — played over vii°' }],
    explanation: { he: 'A דוריאן: A-B-C-D-E-F#-G. הF# (6 גדולה) הוא המאפיין. על Dm7 ב-II-V-I ב-C: נגן D דוריאן. "So What" - Miles Davis בנוי לחלוטין על D דוריאן.', en: 'A Dorian: A-B-C-D-E-F#-G. The F# (major 6) is the characteristic note. Over Dm7 in II-V-I in C: play D Dorian. "So What" by Miles Davis is built entirely on D Dorian.' },
    theory: { he: 'דוריאן = מינור טבעי עם 6 גדולה. זה הבדל של תו בודד, אבל עושה הבדל עצום בצבע. בג׳אז: ii מינור = דוריאן; iv מינור = אאוליאן (מינור טבעי); iii = פריגי.', en: 'Dorian = natural minor with major 6. That\'s a one-note difference, but makes a huge color difference. In jazz: ii minor = Dorian; iv minor = Aeolian (natural minor); iii = Phrygian.' },
  },
  {
    prompt: { he: 'מהו "Mixolydian" ואיך משתמשים בו בג׳אז?', en: 'What is "Mixolydian" and how is it used in jazz?' },
    correct: { he: 'מז׳ור עם ♭7 — נגנים על אקורדי V7 (דומיננט)', en: 'Major with ♭7 — played over V7 (dominant) chords' },
    distractors: [{ he: 'מינור עם 3 גדולה — נגנים על I מינור', en: 'Minor with major 3 — played over I minor' }, { he: 'מז׳ור עם ♭2 — מתאים לג׳אז מזרחי', en: 'Major with ♭2 — suits Eastern jazz' }, { he: 'מז׳ור עם #4 ו-♭7 — נגנים על II', en: 'Major with #4 and ♭7 — played over II' }],
    explanation: { he: 'G מיקסוליידי: G-A-B-C-D-E-F. ה-F (♭7) הוא המאפיין. נגן G מיקסוליידי על G7 ב-II-V-I ב-C.', en: 'G Mixolydian: G-A-B-C-D-E-F. The F (♭7) is the characteristic note. Play G Mixolydian over G7 in II-V-I in C.' },
    theory: { he: 'מיקסוליידי = מז׳ור טבעי עם ♭7. זה עובד על V7 כי הוא מכיל את הטרצה (B) והספטימה (F) שמגדירות את G7, ומפנה ל-Cmaj7. בבלוז-ג׳אז, הI עצמו הוא לרוב I7, אז נגן מיקסוליידי גם עליו.', en: 'Mixolydian = natural major with ♭7. It works over V7 because it contains the 3rd (B) and 7th (F) that define G7, and points to Cmaj7. In jazz blues, the I itself is often I7, so play Mixolydian over it too.' },
  },
  {
    prompt: { he: 'מה הם "Extensions" של אקורד בג׳אז?', en: 'What are chord "extensions" in jazz?' },
    correct: { he: 'תווים מעבר לספטימה: 9, 11, 13 — מוסיפים צבע ועומק', en: 'Notes beyond the seventh: 9, 11, 13 — they add color and depth' },
    distractors: [{ he: 'וריאציות של בסיס האקורד', en: 'Variations of the chord root' }, { he: 'תווי אקורד שמנוגנים על מיתרי בס', en: 'Chord tones played on bass strings' }, { he: 'טכניקות מתיחה של מיתרים', en: 'String stretching techniques' }],
    explanation: { he: 'Cmaj9 = C-E-G-B-D. Dm11 = D-F-A-C-E-G. G13 = G-B-D-F-A-C-E. בג׳אז, אקורדים כוללים לרוב 5-7 תווים שונים.', en: 'Cmaj9 = C-E-G-B-D. Dm11 = D-F-A-C-E-G. G13 = G-B-D-F-A-C-E. In jazz, chords often include 5-7 different notes.' },
    theory: { he: '9 = 2+אוקטבה, 11 = 4+אוקטבה, 13 = 6+אוקטבה. על גיטרה נבחרים תווים מסוימים (בד"כ: root, 3, 7, extension). guide tones (3 ו-7) הם החובה — השאר אופציונלי. לדוגמה: G9 על גיטרה = x-x-5-4-3-5 (G-B-F-A).', en: '9 = 2+octave, 11 = 4+octave, 13 = 6+octave. On guitar, specific notes are chosen (usually: root, 3, 7, extension). Guide tones (3 and 7) are mandatory — the rest is optional. Example: G9 on guitar = x-x-5-4-3-5 (G-B-F-A).' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מהו "Altered Scale" ומתי משתמשים בו?', en: 'What is the "Altered Scale" and when is it used?' },
    correct: { he: 'שלישי של מינור מלודי על V7 — כולל ♭9, #9, ♭5, #5, יוצר מקסימום מתח לפני פתרון', en: 'The 7th mode of melodic minor over V7 — includes ♭9, #9, ♭5, #5, creates maximum tension before resolution' },
    distractors: [{ he: 'סולם מז׳ור עם כל החצי-טונים מוורדים', en: 'Major scale with all half-steps flatted' }, { he: 'פנטטוני מינורי עם תוספת ♭9', en: 'Minor pentatonic with added ♭9' }, { he: 'מצב לוקריאן עם 2 גדולה', en: 'Locrian mode with major 2' }],
    explanation: { he: 'G altered (=G Super Locrian): G-A♭-B♭-C♭-D♭-E♭-F. כולל ♭9(A♭), #9(B♭), #11(C♭=B♭? לא, C♭=B), ♭13(E♭). נגן על G7alt לפני Cmaj7.', en: 'G altered (=G Super Locrian): G-A♭-B♭-C♭-D♭-E♭-F. Includes ♭9(A♭), #9(B♭), #11(C♭=B), ♭13(E♭). Play over G7alt before Cmaj7.' },
    theory: { he: 'Altered scale = מינור מלודי מה-7 שלו. C מינור מלודי: C-D-E♭-F-G-A-B. התחלה מ-B נותן B altered. זה הסולם "הכי מורכב" לפני פתרון. John Coltrane, Herbie Hancock, Pat Metheny משתמשים בו.', en: 'Altered scale = melodic minor from its 7th degree. C melodic minor: C-D-E♭-F-G-A-B. Starting from B gives B altered. This is the "most tense" scale before resolution. John Coltrane, Herbie Hancock, Pat Metheny use it.' },
  },
  {
    prompt: { he: 'מהו "Coltrane Changes"?', en: 'What are "Coltrane Changes"?' },
    correct: { he: 'מחזור של מודולציות בטרצות גדולות (כל 4 תיבות) שמחלק את האוקטבה לשלושה חלקים שווים', en: 'A cycle of modulations in major thirds (every 4 bars), dividing the octave into three equal parts' },
    distractors: [{ he: 'פרוגרסיית II-V-I מהירה בכל קצב', en: 'Rapid II-V-I progression on every beat' }, { he: 'שינוי מצב מינורי לגדול בכל תיבה', en: 'Mode change from minor to major every bar' }, { he: 'שרשרת של tritone substitutions רצופים', en: 'A chain of consecutive tritone substitutions' }],
    explanation: { he: 'ב-"Giant Steps" (1960), Coltrane מנגן: Bmaj7-D7-Gmaj7-B♭7-E♭maj7-Am7-D7... מדלג כל 4 תיבות בטרצה גדולה (B→G→E♭), מחלק האוקטבה לשלישים.', en: 'In "Giant Steps" (1960), Coltrane plays: Bmaj7-D7-Gmaj7-B♭7-E♭maj7-Am7-D7... skipping every 4 bars by a major third (B→G→E♭), dividing the octave into thirds.' },
    theory: { he: 'Coltrane changes מאתגרים כי ה-II-V-I מתחלפים מהר מאוד — חצי שניה לכל מרכז הרמוני. הגיטריסטים ופסנתרנים נאלצים לחשוב מהר בין 3 טונאליויות. זה שינה את הג׳אז המודרני. מטחנה לנגנים: "Giant Steps" בכל 12 הסולמות.', en: 'Coltrane changes are challenging because II-V-I cycles change very fast — half a second per harmonic center. Guitarists and pianists must think fast between 3 tonalities. This changed modern jazz. The grinder for musicians: "Giant Steps" in all 12 keys.' },
  },
  {
    prompt: { he: 'מהו "Bebop Scale"?', en: 'What is the "Bebop Scale"?' },
    correct: { he: 'סולם מז׳ור או מיקסוליידי עם תו כרומטי נוסף המאפשר לאקורד-תווים לנפול על ה-beats החזקים', en: 'A major or Mixolydian scale with an extra chromatic tone that places chord tones on strong beats' },
    distractors: [{ he: 'סולם בן 9 תווים שכולל את כל הכרומטיקה בין 1 ל-5', en: 'A 9-note scale including all chromatics between 1 and 5' }, { he: 'סולם מינור עם תו ♭2 ותו 7 גדולה', en: 'A minor scale with ♭2 and major 7' }, { he: 'שני פנטטוניים שחוברו', en: 'Two pentatonics joined together' }],
    explanation: { he: 'Bebop dominant: 1-2-3-4-5-6-♭7-7 (8 תווים). התו הנוסף (7 טבעית) מאפשר ל-1-3-5-♭7 לנפול תמיד על הסמיות האי-זוגיות כשמנגנים שמיניות.', en: 'Bebop dominant: 1-2-3-4-5-6-♭7-7 (8 notes). The extra note (natural 7) lets 1-3-5-♭7 always fall on odd eighth notes when playing runs.' },
    theory: { he: 'Charlie Parker, Dizzy Gillespie השתמשו בבבופ סקיילס ביסודיות. כשמנגנים 8 שמיניות לתיבה, תמיד מתחילים על תו אקורד בזמן 1. התוצאה: ריצות מהירות שנשמעות הרמונית נכון. ישנם: bebop major, bebop dominant, bebop dorian.', en: 'Charlie Parker, Dizzy Gillespie used bebop scales systematically. When playing 8 eighth notes per bar, always start on a chord tone on beat 1. The result: fast runs that sound harmonically correct. Types: bebop major, bebop dominant, bebop dorian.' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreJazzQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_jazz',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
