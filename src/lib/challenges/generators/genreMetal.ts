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
    prompt: { he: 'מהו "Drop D" ולמה הוא נפוץ במטאל?', en: 'What is "Drop D" and why is it popular in metal?' },
    correct: { he: 'כיוון מיתר 6 מ-E ל-D — מאפשר power chords בפרט אחד וצליל כבד יותר', en: 'Tuning string 6 from E to D — enables one-finger power chords and heavier sound' },
    distractors: [{ he: 'כיוון כל המיתרים טון מטה', en: 'Tuning all strings down one step' }, { he: 'הורדת מיתרים 1-2 ל-D', en: 'Lowering strings 1-2 to D' }, { he: 'כיוון מיוחד עם 7 מיתרים', en: 'Special tuning with 7 strings' }],
    explanation: { he: 'Drop D = D-A-D-G-B-E. המיתר הנמוך ביותר (D) מרחיב את הטווח ויוצר power chords קלים: סדרת ג׳ סייד (D5) = פרטים פתוחים 6+5+4.', en: 'Drop D = D-A-D-G-B-E. The lowest string (D) extends the range and creates easy power chords: D5 = open strings 6+5+4.' },
    theory: { he: 'Drop D נפוץ: Pantera, Soundgarden, Foo Fighters, Tool. Drop C (C-G-C-F-A-D), Drop B (B-F#-B-E-G#-C#) נפוצים גם הם בהוויי מטאל. כל כיוון "drop" מוריד רק את המיתר הנמוך ביותר.', en: 'Drop D common in: Pantera, Soundgarden, Foo Fighters, Tool. Drop C (C-G-C-F-A-D), Drop B (B-F#-B-E-G#-C#) also common in heavy metal. Every "drop" tuning lowers only the lowest string.' },
  },
  {
    prompt: { he: 'מהו "Tritone" ומה הכינוי ההיסטורי שלו?', en: 'What is the "tritone" and what is its historical nickname?' },
    correct: { he: 'אינטרוול של שישה חצי-טונים (♭5/augmented 4th) — "Diabolus in Musica" (השטן במוסיקה)', en: 'An interval of six semitones (♭5/augmented 4th) — "Diabolus in Musica" (the devil in music)' },
    distractors: [{ he: 'אינטרוול של שבעה חצי-טונים — "Perfect fifth"', en: 'An interval of seven semitones — "Perfect fifth"' }, { he: 'אינטרוול של חמישה חצי-טונים — "Perfect fourth"', en: 'An interval of five semitones — "Perfect fourth"' }, { he: 'ספטימה גדולה — "Angel\'s interval"', en: 'Major seventh — "Angel\'s interval"' }],
    explanation: { he: 'הטריטון (C→F# / C→G♭) = 6 חצי-טונים — בדיוק באמצע האוקטבה. בימי הביניים איסרו אותו בהרמוניה. במטאל הוא הביטוי של "כהות" ואיום.', en: 'The tritone (C→F# / C→G♭) = 6 semitones — exactly in the middle of the octave. In medieval times it was forbidden in harmony. In metal it expresses "darkness" and menace.' },
    theory: { he: 'Black Sabbath השתמשו בטריטון ב-"Black Sabbath" (1970): G-G-G-F#-G... הריף הפתיחתי הוא טריטון E→B♭. מאז, הטריטון הוא "interval of metal". כרגע נמצא גם בהרמוניה ג׳אזית כ-tritone sub.', en: 'Black Sabbath used the tritone in "Black Sabbath" (1970): G-G-G-F#-G... The opening riff is the tritone E→B♭. Since then, the tritone is the "interval of metal". Also found in jazz harmony as tritone substitution.' },
  },
  {
    prompt: { he: 'מהי גמא "Harmonic Minor" ולמה היא אופיינית למטאל?', en: 'What is the "harmonic minor" scale and why is it typical in metal?' },
    correct: { he: 'מינור טבעי עם 7 גדולה — יוצר מתח אקזוטי ומרחק טריטון בין 6 ל-7', en: 'Natural minor with a raised 7th — creates exotic tension and a tritone between the 6th and 7th degrees' },
    distractors: [{ he: 'מינור עם ♭5 — נשמע "ממוקטן"', en: 'Minor with ♭5 — sounds "diminished"' }, { he: 'מינור עם 3 גדולה — נשמע "מז׳ורי"', en: 'Minor with major 3 — sounds "major"' }, { he: 'מינור עם ♭2 — סולם פריגי', en: 'Minor with ♭2 — Phrygian scale' }],
    explanation: { he: 'A הרמוני מינור: A-B-C-D-E-F-G#. ה-G# (7 גדולה) יוצר מרחק טרצה מוגדלת (augmented 2nd: F→G#) שנשמע "מזרחי" ואכזרי. Yngwie Malmsteen מומחה בזה.', en: 'A harmonic minor: A-B-C-D-E-F-G#. The G# (raised 7th) creates an augmented 2nd (F→G#) that sounds "Eastern" and brutal. Yngwie Malmsteen is the expert.' },
    theory: { he: 'הרמוני מינור נמצא ב: "Eruption" - Van Halen, "Far Beyond the Sun" - Yngwie, "Phantom of the Opera" - Iron Maiden. הV7 ב-harmonic minor הוא E7 (=E-G#-B-D): הG# יוצר leading tone חזק ל-A. זה יוצר מתח וחיוניות.', en: 'Harmonic minor found in: "Eruption" - Van Halen, "Far Beyond the Sun" - Yngwie, "Phantom of the Opera" - Iron Maiden. The V7 in harmonic minor is E7 (=E-G#-B-D): the G# creates a strong leading tone to A. This creates tension and drive.' },
  },
  {
    prompt: { he: 'מהו "Gallop Rhythm" (ריתמוס דהרה)?', en: 'What is the "gallop rhythm"?' },
    correct: { he: 'ריתמוס טרינארי מהיר: שתיים עשרות + שמינית (♩♩♪) — אופייני לאיירון מיידן', en: 'Fast triplet rhythm: two sixteenths + eighth (♩♩♪) — characteristic of Iron Maiden' },
    distractors: [{ he: 'ריתמוס בינארי מהיר של שמיניות', en: 'Fast binary rhythm of eighth notes' }, { he: 'דפוס palm muting על ריבעיות', en: 'Palm muting pattern on quarter notes' }, { he: 'ריתמוס של שלוש ריבעיות לתיבה', en: 'Rhythm of three quarter notes per bar' }],
    explanation: { he: 'Gallop = ♩♩♪ (16th-16th-8th) או ♪♩♩ (8th-16th-16th). Iron Maiden, Judas Priest אופייניים. נשמע כמו דהרת סוס — חזק ודינאמי.', en: 'Gallop = ♩♩♪ (16th-16th-8th) or ♪♩♩ (8th-16th-16th). Iron Maiden, Judas Priest are typical. Sounds like a horse gallop — powerful and dynamic.' },
    theory: { he: '"The Trooper" - Iron Maiden: gallop rhythm קלאסי. Steve Harris (בסיסט Iron Maiden) הפך את ה-gallop לאופי של ה-NWOBHM (New Wave of British Heavy Metal). ניתן לנגן עם downstrokes בלבד, alternating, או עם אצבעות בבס.', en: '"The Trooper" - Iron Maiden: classic gallop rhythm. Steve Harris (Iron Maiden bassist) made gallop the character of NWOBHM (New Wave of British Heavy Metal). Can be played with downstrokes only, alternating, or fingers on bass.' },
  },
]

const MEDIUM: QTemplate[] = [
  {
    prompt: { he: 'מהו "Sweep Picking"?', en: 'What is "sweep picking"?' },
    correct: { he: 'תנועת פיק אחת רציפה על מספר מיתרים — מנגנת arpeggio מהיר', en: 'One continuous pick stroke across multiple strings — plays a fast arpeggio' },
    distractors: [{ he: 'נגינת כמה מיתרים בבת אחת עם downstroke', en: 'Playing several strings at once with downstroke' }, { he: 'טכניקת שיבושום של alternating picking', en: 'An alternating picking disruption technique' }, { he: 'נגינת מיתרים בתנועת זיג-זג', en: 'Playing strings in a zigzag motion' }],
    explanation: { he: 'Sweep picking = "רחיפה" של הפיק על 3-6 מיתרים בתנועה אחת. כל מיתר נשמע נפרד כי היד שמאל מרים את האצבע אחרי כל תו. יוצר arpeggios מהירות שנשמעות כאילו נגנו 16th notes.', en: 'Sweep picking = "sweeping" the pick across 3-6 strings in one motion. Each string sounds separate because the left hand lifts each finger after each note. Creates fast arpeggios that sound like 16th notes.' },
    theory: { he: 'Yngwie Malmsteen, Frank Gambale, Jason Becker, Marty Friedman הם מאסטרים. Arpeggio 3-string Ami: x-x-x-7-5-5 (A5 shape). Sweep down + up = "full sweep". מאתגר: left-right hand synchronization חייבת להיות מדויקת.', en: 'Yngwie Malmsteen, Frank Gambale, Jason Becker, Marty Friedman are masters. 3-string Am arpeggio: x-x-x-7-5-5 (A5 shape). Sweep down + up = "full sweep". Challenge: left-right hand synchronization must be precise.' },
  },
  {
    prompt: { he: 'מהו מצב "Phrygian Dominant"?', en: 'What is "Phrygian Dominant" mode?' },
    correct: { he: 'המצב החמישי של הרמוני מינור — פריגי עם 3 גדולה: 1-♭2-3-4-5-♭6-♭7', en: 'The fifth mode of harmonic minor — Phrygian with major 3: 1-♭2-3-4-5-♭6-♭7' },
    distractors: [{ he: 'פריגי עם ♭7 גדולה — מצב ספרדי', en: 'Phrygian with major ♭7 — Spanish mode' }, { he: 'דומיננט 7 עם ♭2 — מצב ג׳אזי', en: 'Dominant 7 with ♭2 — jazz mode' }, { he: 'הרמוני מינור עם ♭5 — מצב לוקריאני', en: 'Harmonic minor with ♭5 — Locrian mode' }],
    explanation: { he: 'E פריגי דומיננט: E-F-G#-A-B-C-D. הF (♭2) + G# (3 גדולה) יוצרים augmented 2nd. נשמע "מרוקאי/ספרדי/אקזוטי". נפוץ מאוד במטאל שאר.', en: 'E Phrygian Dominant: E-F-G#-A-B-C-D. The F (♭2) + G# (major 3) create an augmented 2nd. Sounds "Moroccan/Spanish/exotic." Very common in shred metal.' },
    theory: { he: 'Phrygian Dominant = אקזוטי + מטאלי. Ritchie Blackmore (Deep Purple), Dio, Metallica, Sepultura משתמשים בו. E Phrygian Dom = A Harmonic Minor מ-E. ריף אופייני: E5-F5 (I-♭II — "קפיצת שטן").', en: 'Phrygian Dominant = exotic + metal. Ritchie Blackmore (Deep Purple), Dio, Metallica, Sepultura use it. E Phrygian Dom = A Harmonic Minor from E. Typical riff: E5-F5 (I-♭II — "devil\'s jump").' },
  },
  {
    prompt: { he: 'מהו "Diminished Scale" במטאל?', en: 'What is the "Diminished Scale" in metal?' },
    correct: { he: 'סולם סימטרי של חלופת טון-חצי-טון — 8 תווים, חוזר כל שלוש חצי-טונים', en: 'A symmetrical scale alternating whole-half steps — 8 notes, repeating every three semitones' },
    distractors: [{ he: 'אקורד מוקטן 7 שמנוגן כסולם', en: 'A diminished 7 chord played as a scale' }, { he: 'סולם כרומטי מ-vii° עד I', en: 'Chromatic scale from vii° to I' }, { he: 'פנטטוני מינורי עם ♭5 ו-♭2', en: 'Minor pentatonic with ♭5 and ♭2' }],
    explanation: { he: 'Diminished (W-H): 1-2-♭3-4-♭5-♭6-6-7. Diminished (H-W): 1-♭2-♭3-3-♭5-5-6-♭7. כל אחד מ-8 תוויו הוא שורש לאותו הסולם! יוצר ריפים סימטריים ומסתוריים.', en: 'Diminished (W-H): 1-2-♭3-4-♭5-♭6-6-7. Diminished (H-W): 1-♭2-♭3-3-♭5-5-6-♭7. Any of its 8 notes can be the root for the same scale! Creates symmetrical and mysterious riffs.' },
    theory: { he: 'הסולם המוקטן נמצא ב: "The Call of Ktulu" - Metallica, "Symphony of Destruction" - Megadeth. דפוסי אצבוע חוזרים על הצוואר (כל 3 פרטים). אקורד dim7 = 4 תווים שווי מרחק מהאוקטבה: C-E♭-F#-A.', en: 'The diminished scale found in: "The Call of Ktulu" - Metallica, "Symphony of Destruction" - Megadeth. Fingering patterns repeat up the neck (every 3 frets). Dim7 chord = 4 notes equally dividing the octave: C-E♭-F#-A.' },
  },
]

const HARD: QTemplate[] = [
  {
    prompt: { he: 'מהו "Economy Picking"?', en: 'What is "economy picking"?' },
    correct: { he: 'שילוב של alternate picking עם sweep picking — downstroke כשעוברים מיתר מטה, upstroke מיתר מעלה', en: 'Combination of alternate picking and sweep picking — downstroke moving to a lower string, upstroke to a higher string' },
    distractors: [{ he: 'נגינה רק ב-downstrokes לחיסכון בתנועה', en: 'Playing only downstrokes to save motion' }, { he: 'נגינה ב-upstrokes בלבד לחסכון', en: 'Playing only upstrokes to save movement' }, { he: 'alternate picking מהיר במינימום תנועה', en: 'Fast alternate picking with minimal motion' }],
    explanation: { he: 'Economy picking = "sweep" כשעוברים בין מיתרים. משנים כיוון רק כשעוברים בדגימה ב"כיוון הנגדי". מאפשר מהירות גבוהה עם פחות מאמץ.', en: 'Economy picking = "sweep" when crossing strings. Change direction only when the next string is in the opposite direction. Enables high speed with less effort.' },
    theory: { he: 'Frank Gambale הגדיר את הטכניקה. Pattern 3-note-per-string: D-D-D (שלושה downstrokes על מיתר) עובר למיתר הבא ב-D גם (economy). Vs alternate: D-U-D-U (פחות יעיל למעבר מיתר). Eric Johnson ידוע בeconomy picking מושלם.', en: 'Frank Gambale defined the technique. Pattern 3-note-per-string: D-D-D (three downstrokes per string) crosses to next string with D also (economy). Vs alternate: D-U-D-U (less efficient for string crossing). Eric Johnson is known for perfect economy picking.' },
  },
  {
    prompt: { he: 'מה הם "Polyrhythms" ומדוע הם נפוצים במטאל פרוגרסיבי?', en: 'What are "polyrhythms" and why are they common in progressive metal?' },
    correct: { he: 'שני ריתמוסים שונים בו-זמנית — למשל 3 נגד 4, או 5 נגד 4', en: 'Two different rhythms simultaneously — e.g., 3 against 4, or 5 against 4' },
    distractors: [{ he: 'שינוי חתימת זמן כל תיבה', en: 'Time signature change every bar' }, { he: 'נגינה בשני טמפואים שונים ברצף', en: 'Playing in two different tempos in sequence' }, { he: 'ריתמוס שמשתנה בין קצר לארוך', en: 'Rhythm alternating between short and long' }],
    explanation: { he: 'Polyrhythm = שני patterns שונים שמתחילים בו-זמנית ומגיעים יחד רק לאחר LCM תיבות. 4 נגד 3: 12 שמיניות לקבוצה.', en: 'Polyrhythm = two different patterns starting simultaneously, meeting again only after LCM beats. 4 against 3: 12 eighth notes per cycle.' },
    theory: { he: 'Tool, Meshuggah, Dream Theater ידועים ב-polyrhythms. Meshuggah: ריפים ב-4/4 שנשמעים ב-8 תיבות, יוצרים 4:3 או 5:4. Tool: "Schism" ב-5/4 ו-7/8. אלמנטי djent (כמו Meshuggah) בנויים על polyrhythms + heavy palm muting.', en: 'Tool, Meshuggah, Dream Theater are known for polyrhythms. Meshuggah: 4/4 riffs that span 8 bars, creating 4:3 or 5:4 patterns. Tool: "Schism" in 5/4 and 7/8. Djent elements (like Meshuggah) are built on polyrhythms + heavy palm muting.' },
  },
  {
    prompt: { he: 'מהי "Neoclassical Metal" ואיזה תיאוריה מאפיינת אותה?', en: 'What is "Neoclassical Metal" and what theory characterizes it?' },
    correct: { he: 'מטאל המשלב טכניקות ומבנים של מוסיקה קלאסית — harmonic minor, diminished, Bach-style counterpoint', en: 'Metal combining classical music techniques and structures — harmonic minor, diminished, Bach-style counterpoint' },
    distractors: [{ he: 'מטאל עם כלי תזמורת בלבד', en: 'Metal with orchestral instruments only' }, { he: 'מטאל שמשתמש בסולמות יווניים עתיקים', en: 'Metal using ancient Greek scales' }, { he: 'מטאל שמנגן יצירות קלאסיות בעיבוד', en: 'Metal playing arranged classical pieces' }],
    explanation: { he: 'Neoclassical metal = Yngwie Malmsteen, Ritchie Blackmore, Jason Becker. מאפיינים: harmonic minor שימוש נרחב, sweep arpeggios, bach-style sequences, חתימות זמן לא שגרתיות.', en: 'Neoclassical metal = Yngwie Malmsteen, Ritchie Blackmore, Jason Becker. Characteristics: extensive harmonic minor use, sweep arpeggios, Bach-style sequences, unusual time signatures.' },
    theory: { he: 'Yngwie מנגן Bach "Toccata & Fugue" בסגנון מטאל. Pattern נפוץ: arpeggio בהרמוני מינור + diminished sequence. "Far Beyond the Sun": A harmonic minor, sweep arpeggios, speed runs. Counterpoint: שני קולות עצמאיים שרצים בו-זמנית.', en: 'Yngwie plays Bach "Toccata & Fugue" in metal style. Common pattern: harmonic minor arpeggio + diminished sequence. "Far Beyond the Sun": A harmonic minor, sweep arpeggios, speed runs. Counterpoint: two independent voices running simultaneously.' },
  },
]

function pickTemplate(difficulty: Difficulty): QTemplate {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  return randomOf(pool)
}

export function generateGenreMetalQuestion(difficulty: Difficulty): Question {
  const t = pickTemplate(difficulty)
  const { choices, correctIndex } = buildBilingualChoices(t.correct, t.distractors)
  return {
    id: uid(),
    categoryId: 'genre_metal',
    difficulty,
    prompt: t.prompt,
    choices,
    correctIndex,
    explanation: t.explanation,
    theory: t.theory,
  }
}
