import type { Question, Difficulty } from '../types'
import {
  NOTE_NAMES_SHARP,
  pitchClass,
  randomOf,
  buildChoices,
  buildBilingualChoices,
  uid,
} from '../musicTheory'
import type { Bilingual } from '../types'

const THEORY_TEXT: Bilingual = {
  he: 'אקורד ספטימה נוצר מהוספת ספטימה לטריאדה. סוגים עיקריים: maj7 (טריאדה מז׳ורית + ספטימה גדולה), dom7 (טריאדה מז׳ורית + ספטימה קטנה), m7 (טריאדה מינורית + ספטימה קטנה), m7b5 (טריאדה מוקטנת + ספטימה קטנה), dim7 (טריאדה מוקטנת + ספטימה מוקטנת). בג׳אז משתמשים בספטימות בכל מקום.',
  en: 'A seventh chord is built by adding a seventh above a triad. Main types: maj7 (major triad + major seventh), dom7 (major triad + minor seventh), m7 (minor triad + minor seventh), m7b5 (diminished triad + minor seventh), dim7 (diminished triad + diminished seventh). Jazz uses seventh chords throughout.',
}

// Notes for each seventh chord type from a root
function maj7Notes(root: string): string[] {
  const pc = pitchClass(root)
  return [0, 4, 7, 11].map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}
function dom7Notes(root: string): string[] {
  const pc = pitchClass(root)
  return [0, 4, 7, 10].map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}
function m7Notes(root: string): string[] {
  const pc = pitchClass(root)
  return [0, 3, 7, 10].map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}
function m7b5Notes(root: string): string[] {
  const pc = pitchClass(root)
  return [0, 3, 6, 10].map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}
function dim7Notes(root: string): string[] {
  const pc = pitchClass(root)
  return [0, 3, 6, 9].map(i => NOTE_NAMES_SHARP[(pc + i) % 12])
}

const EASY_ROOTS = ['C', 'G', 'D', 'A', 'E', 'F']

type EasyShape = 'maj7Stack' | 'dom7Stack' | 'm7Stack' | 'howManyNotes' | 'maj7vs7' | 'cMaj7Notes' | 'dom7Interval' | 'minorSeventhInterval'
type MedShape  = 'am7Notes' | 'g7Notes' | 'dm7b5Desc' | 'dim7Stack' | 'dom7InKey' | 'maj7InKey' | 'm7b5Aka' | 'ii7inC'
type HardShape = 'fullDim7Notes' | 'rootFromNotes' | 'qualityFromStack' | 'jazzIIVI' | 'vChordType' | 'leadingTone' | 'alteredDom' | 'countNotes'

export function generateSeventhChordsQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') return easyQ()
  if (difficulty === 'medium') return mediumQ()
  return hardQ()
}

function easyQ(): Question {
  const shape = randomOf<EasyShape>(['maj7Stack','dom7Stack','m7Stack','howManyNotes','maj7vs7','cMaj7Notes','dom7Interval','minorSeventhInterval'])
  switch (shape) {
    case 'howManyNotes': {
      const correct = '4'
      const { choices, correctIndex } = buildChoices(correct, ['3', '5', '6'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'כמה תווים יש באקורד ספטימה?', en: 'How many notes does a seventh chord have?' },
        choices, correctIndex,
        explanation: { he: 'אקורד ספטימה = 4 תווים: שורש + טרצה + קווינטה + ספטימה.', en: 'A seventh chord = 4 notes: root + third + fifth + seventh.' },
        theory: THEORY_TEXT,
      }
    }
    case 'maj7Stack': {
      const correct: Bilingual = { he: 'טריאדה מז׳ורית + ספטימה גדולה', en: 'Major triad + major seventh' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טריאדה מז׳ורית + ספטימה קטנה', en: 'Major triad + minor seventh' },
        { he: 'טריאדה מינורית + ספטימה גדולה', en: 'Minor triad + major seventh' },
        { he: 'טריאדה מינורית + ספטימה קטנה', en: 'Minor triad + minor seventh' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'מה ההרכב של אקורד maj7?', en: 'What is the structure of a maj7 chord?' },
        choices, correctIndex,
        explanation: { he: 'maj7 = טריאדה מז׳ורית (1-3-5) + ספטימה גדולה (7M). דוגמה: Cmaj7 = C-E-G-B.', en: 'maj7 = major triad (1-3-5) + major seventh (7M). Example: Cmaj7 = C-E-G-B.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dom7Stack': {
      const correct: Bilingual = { he: 'טריאדה מז׳ורית + ספטימה קטנה', en: 'Major triad + minor seventh' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טריאדה מז׳ורית + ספטימה גדולה', en: 'Major triad + major seventh' },
        { he: 'טריאדה מינורית + ספטימה קטנה', en: 'Minor triad + minor seventh' },
        { he: 'טריאדה מוקטנת + ספטימה קטנה', en: 'Diminished triad + minor seventh' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'מה ההרכב של אקורד דומיננטי 7 (G7)?', en: 'What is the structure of a dominant 7th chord (G7)?' },
        choices, correctIndex,
        explanation: { he: 'דומיננטי 7 = טריאדה מז׳ורית + ספטימה קטנה. G7 = G-B-D-F.', en: 'Dominant 7 = major triad + minor seventh. G7 = G-B-D-F.' },
        theory: THEORY_TEXT,
      }
    }
    case 'm7Stack': {
      const correct: Bilingual = { he: 'טריאדה מינורית + ספטימה קטנה', en: 'Minor triad + minor seventh' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טריאדה מינורית + ספטימה גדולה', en: 'Minor triad + major seventh' },
        { he: 'טריאדה מז׳ורית + ספטימה קטנה', en: 'Major triad + minor seventh' },
        { he: 'טריאדה מוקטנת + ספטימה קטנה', en: 'Diminished triad + minor seventh' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'מה ההרכב של אקורד m7?', en: 'What is the structure of an m7 chord?' },
        choices, correctIndex,
        explanation: { he: 'm7 = טריאדה מינורית + ספטימה קטנה. Am7 = A-C-E-G.', en: 'm7 = minor triad + minor seventh. Am7 = A-C-E-G.' },
        theory: THEORY_TEXT,
      }
    }
    case 'maj7vs7': {
      const correct: Bilingual = { he: 'Cmaj7 יש B טבעי; C7 יש Bb', en: 'Cmaj7 has B natural; C7 has Bb' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'Cmaj7 יש Bb; C7 יש B טבעי', en: 'Cmaj7 has Bb; C7 has B natural' },
        { he: 'שניהם זהים', en: 'They are the same' },
        { he: 'ההבדל הוא בקווינטה', en: 'The difference is in the fifth' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'מה ההבדל בין Cmaj7 ל-C7?', en: 'What is the difference between Cmaj7 and C7?' },
        choices, correctIndex,
        explanation: { he: 'Cmaj7: C-E-G-B (ספטימה גדולה). C7: C-E-G-Bb (ספטימה קטנה).', en: 'Cmaj7: C-E-G-B (major seventh). C7: C-E-G-Bb (minor seventh).' },
        theory: THEORY_TEXT,
      }
    }
    case 'cMaj7Notes': {
      const notes = maj7Notes('C')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, ['C, E, G, Bb', 'C, Eb, G, B', 'C, E, G#, B'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'מה התווים של Cmaj7?', en: 'What are the notes in Cmaj7?' },
        choices, correctIndex,
        explanation: { he: `Cmaj7 = ${correct} (1-3-5-7M).`, en: `Cmaj7 = ${correct} (1-3-5-7M).` },
        theory: THEORY_TEXT,
      }
    }
    case 'dom7Interval': {
      const correct: Bilingual = { he: 'ספטימה קטנה (10 חצאי-טונים)', en: 'Minor seventh (10 semitones)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'ספטימה גדולה (11 חצאי-טונים)', en: 'Major seventh (11 semitones)' },
        { he: 'ספטימה מוקטנת (9 חצאי-טונים)', en: 'Diminished seventh (9 semitones)' },
        { he: 'ספיטה (8 חצאי-טונים)', en: 'Sixth (8 semitones)' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'איזה אינטרוול הוא הספטימה באקורד דומיננטי 7?', en: 'What interval is the seventh in a dominant 7th chord?' },
        choices, correctIndex,
        explanation: { he: 'דומיננטי 7 מכיל ספטימה קטנה = 10 חצאי-טונים מהשורש.', en: 'Dominant 7 contains a minor seventh = 10 semitones from the root.' },
        theory: THEORY_TEXT,
      }
    }
    case 'minorSeventhInterval': {
      const correct = '11'
      const { choices, correctIndex } = buildChoices(correct, ['10', '9', '12'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'easy',
        prompt: { he: 'כמה חצאי-טונים יש בספטימה גדולה (כמו ב-maj7)?', en: 'How many semitones in a major seventh (as in maj7)?' },
        choices, correctIndex,
        explanation: { he: 'ספטימה גדולה = 11 חצאי-טונים. ספטימה קטנה = 10 חצאי-טונים.', en: 'Major seventh = 11 semitones. Minor seventh = 10 semitones.' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function mediumQ(): Question {
  const shape = randomOf<MedShape>(['am7Notes','g7Notes','dm7b5Desc','dim7Stack','dom7InKey','maj7InKey','m7b5Aka','ii7inC'])
  switch (shape) {
    case 'am7Notes': {
      const notes = m7Notes('A')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, ['A, C, E, B', 'A, C#, E, G', 'A, C, Eb, G'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'מה התווים של Am7?', en: 'What are the notes in Am7?' },
        choices, correctIndex,
        explanation: { he: `Am7 = ${correct} (A מינורי + G = ספטימה קטנה).`, en: `Am7 = ${correct} (A minor triad + G = minor seventh).` },
        theory: THEORY_TEXT,
      }
    }
    case 'g7Notes': {
      const notes = dom7Notes('G')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, ['G, B, D, A', 'G, B, D, F#', 'G, Bb, D, F'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'מה התווים של G7?', en: 'What are the notes in G7?' },
        choices, correctIndex,
        explanation: { he: `G7 = ${correct} — הדומיננטי של C מז׳ור.`, en: `G7 = ${correct} — the dominant of C major.` },
        theory: THEORY_TEXT,
      }
    }
    case 'dm7b5Desc': {
      const correct: Bilingual = { he: 'טריאדה מוקטנת + ספטימה קטנה', en: 'Diminished triad + minor seventh' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טריאדה מוקטנת + ספטימה מוקטנת', en: 'Diminished triad + diminished seventh' },
        { he: 'טריאדה מינורית + ספטימה קטנה', en: 'Minor triad + minor seventh' },
        { he: 'טריאדה מז׳ורית + ספטימה קטנה', en: 'Major triad + minor seventh' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'מה ההרכב של אקורד m7b5 (חצי-מוקטן)?', en: 'What is the structure of an m7b5 (half-diminished) chord?' },
        choices, correctIndex,
        explanation: { he: 'm7b5 = טריאדה מוקטנת + ספטימה קטנה. Bm7b5 (ב-C מז׳ור) = B-D-F-A.', en: 'm7b5 = diminished triad + minor seventh. Bm7b5 (in C major) = B-D-F-A.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dim7Stack': {
      const correct: Bilingual = { he: 'טריאדה מוקטנת + ספטימה מוקטנת (3 חצאי-טונים מעל הקווינטה המוקטנת)', en: 'Diminished triad + diminished seventh (3 semitones above the flat fifth)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'טריאדה מוקטנת + ספטימה קטנה', en: 'Diminished triad + minor seventh' },
        { he: 'טריאדה מינורית + ספטימה מוקטנת', en: 'Minor triad + diminished seventh' },
        { he: 'ארבעה טונים שלמים', en: 'Four whole tones' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'מה ההרכב של אקורד dim7 (מוקטן מלא)?', en: 'What is the structure of a fully diminished (dim7) chord?' },
        choices, correctIndex,
        explanation: { he: 'dim7 = כולם מרווחי טרצה קטנה (3 חצאי-טונים). Bdim7 = B-D-F-Ab.', en: 'dim7 = all minor third intervals (3 semitones each). Bdim7 = B-D-F-Ab.' },
        theory: THEORY_TEXT,
      }
    }
    case 'dom7InKey': {
      const correct = 'G7'
      const { choices, correctIndex } = buildChoices(correct, ['Fmaj7', 'Dm7', 'Am7'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'איזה אקורד ספטימה הוא הדומיננטי (V7) של C מז׳ור?', en: 'Which seventh chord is the dominant (V7) of C major?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה החמישית של C מז׳ור היא G. G עם ספטימה קטנה = G7 (G-B-D-F).', en: 'The fifth degree of C major is G. G with a minor seventh = G7 (G-B-D-F).' },
        theory: THEORY_TEXT,
      }
    }
    case 'maj7InKey': {
      const correct = 'Cmaj7'
      const { choices, correctIndex } = buildChoices(correct, ['C7', 'Cm7', 'Cmaj9'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'איזה אקורד ספטימה נמצא על הדרגה הראשונה (I7) של C מז׳ור?', en: 'Which seventh chord sits on the first degree (I7) of C major?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה הראשונה של C מז׳ור היא C מז׳ורית + B (ספטימה גדולה) = Cmaj7.', en: 'The first degree of C major is a C major triad + B (major seventh) = Cmaj7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'm7b5Aka': {
      const correct: Bilingual = { he: 'חצי-מוקטן (ø)', en: 'Half-diminished (ø)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'מוקטן מלא (°)', en: 'Fully diminished (°)' },
        { he: 'מז׳ורי-מינורי', en: 'Major-minor' },
        { he: 'סוספנדד', en: 'Suspended' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'כיצד נקרא אקורד m7b5 בשמו הנוסף?', en: 'What is the alternative name for an m7b5 chord?' },
        choices, correctIndex,
        explanation: { he: 'm7b5 = חצי-מוקטן (ø). "חצי" כי הספטימה היא קטנה (לא מוקטנת), בניגוד ל-dim7 המלא.', en: 'm7b5 = half-diminished (ø). "Half" because the seventh is minor (not diminished), unlike fully diminished dim7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'ii7inC': {
      const correct = 'Dm7'
      const { choices, correctIndex } = buildChoices(correct, ['Dm7b5', 'D7', 'Dmaj7'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'medium',
        prompt: { he: 'איזה אקורד ספטימה נמצא על הדרגה השנייה (ii7) של C מז׳ור?', en: 'Which seventh chord is on the second degree (ii7) of C major?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה השנייה של C מז׳ור היא D מינורית + C (ספטימה קטנה) = Dm7 (D-F-A-C).', en: 'The second degree of C major is D minor triad + C (minor seventh) = Dm7 (D-F-A-C).' },
        theory: THEORY_TEXT,
      }
    }
  }
}

function hardQ(): Question {
  const shape = randomOf<HardShape>(['fullDim7Notes','rootFromNotes','qualityFromStack','jazzIIVI','vChordType','leadingTone','alteredDom','countNotes'])
  switch (shape) {
    case 'fullDim7Notes': {
      const notes = dim7Notes('B')
      const correct = notes.join(', ')
      const { choices, correctIndex } = buildChoices(correct, ['B, D, F, A', 'B, D, F, G#', 'B, D#, F#, A'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: 'מה התווים של Bdim7?', en: 'What are the notes in Bdim7?' },
        choices, correctIndex,
        explanation: { he: `Bdim7 = ${correct} — כל מרווח הוא טרצה קטנה (3 חצאי-טונים).`, en: `Bdim7 = ${correct} — every interval is a minor third (3 semitones).` },
        theory: THEORY_TEXT,
      }
    }
    case 'rootFromNotes': {
      const root = randomOf(EASY_ROOTS)
      const notes = dom7Notes(root)
      const correct = `${root}7`
      const others = EASY_ROOTS.filter(r => r !== root).slice(0, 3).map(r => `${r}7`)
      const { choices, correctIndex } = buildChoices(correct, others)
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: `התווים ${notes.join(', ')} שייכים לאיזה אקורד דומיננטי 7?`, en: `The notes ${notes.join(', ')} belong to which dominant 7th chord?` },
        choices, correctIndex,
        explanation: { he: `${notes.join(', ')} = ${correct} (שורש: ${root}, מרווחים: 1-3-5-b7).`, en: `${notes.join(', ')} = ${correct} (root: ${root}, intervals: 1-3-5-b7).` },
        theory: THEORY_TEXT,
      }
    }
    case 'qualityFromStack': {
      const types: Array<{ label: Bilingual; notes: (r:string)=>string[]; name:(r:string)=>string }> = [
        { label: { he: 'maj7', en: 'maj7' }, notes: maj7Notes, name: r => `${r}maj7` },
        { label: { he: 'dom7', en: 'dom7' }, notes: dom7Notes, name: r => `${r}7` },
        { label: { he: 'm7', en: 'm7' },     notes: m7Notes,   name: r => `${r}m7` },
        { label: { he: 'm7b5', en: 'm7b5' }, notes: m7b5Notes, name: r => `${r}m7b5` },
      ]
      const t = randomOf(types)
      const root = randomOf(EASY_ROOTS)
      const nts = t.notes(root)
      const correct = t.label
      const distractors = types.filter(x => x.label.en !== t.label.en).map(x => x.label)
      const { choices, correctIndex } = buildBilingualChoices(correct, distractors)
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: `האקורד ${t.name(root)} (${nts.join(', ')}) הוא מאיזה סוג?`, en: `The chord ${t.name(root)} (${nts.join(', ')}) is of which type?` },
        choices, correctIndex,
        explanation: { he: `${t.name(root)} הוא ${correct.he}.`, en: `${t.name(root)} is a ${correct.en}.` },
        theory: THEORY_TEXT,
      }
    }
    case 'jazzIIVI': {
      const correct = 'Dm7 → G7 → Cmaj7'
      const { choices, correctIndex } = buildChoices(correct, ['Dm7 → G7 → Cm7', 'Am7 → D7 → Gmaj7', 'Dm → G → C'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: 'מה פרוגרסיית ii-V-I ב-C מז׳ור עם אקורדי ספטימה?', en: 'What is the ii-V-I progression in C major using seventh chords?' },
        choices, correctIndex,
        explanation: { he: 'ii-V-I = Dm7 → G7 → Cmaj7 — הפרוגרסיה הנפוצה ביותר בג׳אז.', en: 'ii-V-I = Dm7 → G7 → Cmaj7 — the most common progression in jazz.' },
        theory: THEORY_TEXT,
      }
    }
    case 'vChordType': {
      const correct: Bilingual = { he: 'דומיננטי 7 (V7)', en: 'Dominant 7 (V7)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'maj7', en: 'maj7' },
        { he: 'm7', en: 'm7' },
        { he: 'dim7', en: 'dim7' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: 'איזה סוג ספטימה נמצא על הדרגה החמישית (V) בסולם מז׳ורי?', en: 'What type of seventh chord sits on the fifth degree (V) of a major scale?' },
        choices, correctIndex,
        explanation: { he: 'הדרגה ה-V בסולם מז׳ורי יוצרת טריאדה מז׳ורית + ספטימה קטנה = דומיננטי 7.', en: 'The fifth degree of a major scale forms a major triad + minor seventh = dominant 7.' },
        theory: THEORY_TEXT,
      }
    }
    case 'leadingTone': {
      const correct: Bilingual = { he: 'Bm7b5 (וii° = חצי-מוקטן)', en: 'Bm7b5 (vii° = half-diminished)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'Bdim7 (מוקטן מלא)', en: 'Bdim7 (fully diminished)' },
        { he: 'Bm7', en: 'Bm7' },
        { he: 'Bmaj7', en: 'Bmaj7' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: 'מה אקורד הספטימה על הדרגה ה-VII (B) ב-C מז׳ור?', en: 'What is the seventh chord on degree VII (B) in C major?' },
        choices, correctIndex,
        explanation: { he: 'B-D-F-A = Bm7b5 (חצי-מוקטן). הטריאדה B-D-F היא מוקטנת; הספטימה A היא קטנה.', en: 'B-D-F-A = Bm7b5 (half-diminished). B-D-F is a diminished triad; the seventh A is minor.' },
        theory: THEORY_TEXT,
      }
    }
    case 'alteredDom': {
      const correct: Bilingual = { he: 'דומיננטי 7 עם שינויים (b9, #9, b5, #5)', en: 'Dominant 7 with alterations (b9, #9, b5, #5)' }
      const { choices, correctIndex } = buildBilingualChoices(correct, [
        { he: 'אקורד maj7 עם תוספות', en: 'maj7 with added extensions' },
        { he: 'אקורד מינורי מוקטן', en: 'Diminished minor chord' },
        { he: 'אקורד ספנד', en: 'Suspended chord' },
      ])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: 'מה הוא "אקורד דומיננטי מאולטר" בג׳אז?', en: "What is an 'altered dominant' chord in jazz?" },
        choices, correctIndex,
        explanation: { he: 'דומיננטי מאולטר = G7alt = G-B-Db-F + Eb/Ab/C# — כל ה-tensions מאולטרות, יוצר מתח מקסימלי לפני ה-I.', en: 'Altered dominant = G7alt uses all altered tensions (b9, #9, b5, #5) for maximum tension before resolving to I.' },
        theory: THEORY_TEXT,
      }
    }
    case 'countNotes': {
      const correct = '5'
      const { choices, correctIndex } = buildChoices(correct, ['3', '4', '7'])
      return {
        id: uid(), categoryId: 'seventh_chords', difficulty: 'hard',
        prompt: { he: 'כמה סוגי אקורדי ספטימה עיקריים קיימים?', en: 'How many main types of seventh chords are there?' },
        choices, correctIndex,
        explanation: { he: '5 סוגים: maj7, dom7, m7, m7b5 (חצי-מוקטן), dim7 (מלא-מוקטן).', en: '5 types: maj7, dom7, m7, m7b5 (half-diminished), dim7 (fully-diminished).' },
        theory: THEORY_TEXT,
      }
    }
  }
}
