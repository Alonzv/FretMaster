import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  type: 'intro' | 'theory' | 'tip' | 'example' | 'ready'
  titleHe?: string
  titleEn?: string
  bodyHe: string
  bodyEn: string
}

interface Lesson {
  titleHe: string
  titleEn: string
  subtitleHe: string
  subtitleEn: string
  sections: Section[]
}

const LESSONS_BY_LEVEL: Record<string, Lesson> = {
  beginner: {
    titleHe: 'יסודות הגיטרה',
    titleEn: 'Guitar Fundamentals',
    subtitleHe: 'שיעור 1 — התחלה מהבסיס',
    subtitleEn: 'Lesson 1 — Starting from zero',
    sections: [
      {
        type: 'intro',
        bodyHe: 'ברוך הבא לשיעור הראשון. נלמד כיצד להחזיק את הגיטרה נכון, מה ההבדל בין המיתרים, ואיך מפיקים את הצליל הראשון שלך.',
        bodyEn: 'Welcome to your first lesson. We will learn how to hold the guitar correctly, the difference between the strings, and how to produce your first sound.',
      },
      {
        type: 'theory',
        titleHe: 'שישה מיתרים — שישה צלילים שונים',
        titleEn: 'Six Strings — Six Different Sounds',
        bodyHe: 'הגיטרה מורכבת מ-6 מיתרים. מהעבה ביותר לדקיק ביותר:\n\nמיתר 6 (הכי עבה): E נמוך — הצליל הכי עמוק\nמיתר 5: A\nמיתר 4: D\nמיתר 3: G\nמיתר 2: B\nמיתר 1 (הכי דקיק): E גבוה — הצליל הכי חד\n\nבשלב זה לא צריך לשנן את השמות. מספיק להרגיש את ההבדל בצליל ביניהם.',
        bodyEn: 'The guitar has 6 strings. From thickest to thinnest:\n\nString 6 (thickest): Low E — the deepest sound\nString 5: A\nString 4: D\nString 3: G\nString 2: B\nString 1 (thinnest): High E — the brightest sound\n\nAt this stage you don\'t need to memorize the names. Just feel the difference in sound between them.',
      },
      {
        type: 'theory',
        titleHe: 'מה זה Fret?',
        titleEn: 'What is a Fret?',
        bodyHe: 'ה-Frets הם הפסים המתכתיים לאורך הצוואר של הגיטרה. כשאתה לוחץ מיתר בין שני frets — המיתר מתקצר ומשנה את הצליל.\n\nככל שתלחץ קרוב יותר לגוף הגיטרה (fret גבוה יותר) — הצליל יהיה חד יותר.',
        bodyEn: 'Frets are the metal strips along the guitar neck. When you press a string between two frets — the string shortens and changes its pitch.\n\nThe closer you press toward the guitar body (higher fret number) — the higher the pitch.',
      },
      {
        type: 'tip',
        titleHe: 'איך ללחוץ נכון',
        titleEn: 'How to Press Correctly',
        bodyHe: 'לחץ את האצבע ממש ליד ה-fret מצד ה-headstock (הכיוון שבו מחוברים מפתחות הכוונון). לא באמצע שני ה-frets.\n\nהסיבה: לחיצה ליד ה-fret דורשת פחות כוח ומייצרת צליל נקי ללא buzz.',
        bodyEn: 'Press your finger right next to the fret on the headstock side (where the tuning pegs are). Not in the middle between two frets.\n\nReason: pressing near the fret requires less force and produces a clean sound without buzz.',
      },
      {
        type: 'example',
        titleHe: 'תרגיל ראשון',
        titleEn: 'First Exercise',
        bodyHe: '1. קח את הגיטרה ושב בנוחות\n2. מצא את המיתר הדקיק (מיתר 1, E גבוה)\n3. לחץ אותו ב-fret ה-1 עם האצבע המורה\n4. דפוק עליו בעדינות עם הפיק או האגודל\n5. האם שמעת צליל נקי? אם יש buzz — הזזה קצת את האצבע לכיוון ה-fret',
        bodyEn: '1. Pick up the guitar and sit comfortably\n2. Find the thinnest string (string 1, high E)\n3. Press it on fret 1 with your index finger\n4. Strike it gently with a pick or thumb\n5. Did you hear a clean note? If there is buzz — move your finger a bit closer to the fret',
      },
      {
        type: 'ready',
        bodyHe: 'למדת את הבסיס. עכשיו הגיע הזמן לאתגר הראשון שלך — עבור למסע שלך כדי לבדוק את עצמך.',
        bodyEn: 'You learned the basics. Now it\'s time for your first challenge — go to Your Journey to test yourself.',
      },
    ],
  },

  intermediate_low: {
    titleHe: 'אקורדים פתוחים ומעברים',
    titleEn: 'Open Chords and Transitions',
    subtitleHe: 'שיעור 1 — חיזוק הבסיס',
    subtitleEn: 'Lesson 1 — Solidifying the basics',
    sections: [
      {
        type: 'intro',
        bodyHe: 'בשלב זה אתה כבר מכיר כמה אקורדים. השיעור הזה יעסוק בשיפור המעברים ביניהם — המפתח לנגינה שוטפת.',
        bodyEn: 'At this stage you already know some chords. This lesson focuses on improving transitions between them — the key to smooth playing.',
      },
      {
        type: 'theory',
        titleHe: 'למה המעבר קשה?',
        titleEn: 'Why are Transitions Hard?',
        bodyHe: 'מעבר בין אקורדים הוא רצף של תנועות מדויקות שהמוח צריך לאוטומט. בתחילה זה איטי — זה טבעי לחלוטין.\n\nהמפתח הוא לתרגל את המעבר הספציפי שמקשה עליך בנפרד, לאט, עם מטרונום.',
        bodyEn: 'Transitioning between chords is a sequence of precise movements that the brain needs to automate. At first it is slow — this is completely normal.\n\nThe key is to practice the specific transition that challenges you separately, slowly, with a metronome.',
      },
      {
        type: 'tip',
        titleHe: 'טכניקת "האצבע האחרונה"',
        titleEn: 'The "Pivot Finger" Technique',
        bodyHe: 'כשאתה עובר בין שני אקורדים שחולקים אצבע אחת באותה מיקום — השאר אותה על המיתר. אל תרים אותה.\n\nלדוגמה: במעבר בין G major ל-Cadd9 ניתן להשאיר את האצבעות על מיתרים 1 ו-2 ב-fret ה-3.',
        bodyEn: 'When transitioning between two chords that share one finger in the same position — keep it on the string. Don\'t lift it.\n\nFor example: when moving from G major to Cadd9 you can keep fingers on strings 1 and 2 at fret 3.',
      },
      {
        type: 'example',
        titleHe: 'תרגיל מעבר',
        titleEn: 'Transition Exercise',
        bodyHe: '1. נגן אקורד Em — החזק 4 פעמות\n2. עבור ל-Am — החזק 4 פעמות\n3. חזור ל-Em\n4. עשה זאת לאט מאוד בהתחלה — האיכות חשובה יותר מהמהירות\n5. בכל יום הגבר קצת את הטמפו',
        bodyEn: '1. Play Em chord — hold for 4 beats\n2. Move to Am — hold for 4 beats\n3. Back to Em\n4. Do this very slowly at first — quality matters more than speed\n5. Every day increase the tempo slightly',
      },
      {
        type: 'ready',
        bodyHe: 'תרגלת? עכשיו הגיע הזמן לבדוק את עצמך באתגר.',
        bodyEn: 'Practiced? Now it\'s time to test yourself in a challenge.',
      },
    ],
  },

  intermediate: {
    titleHe: 'פנטטוניקה ואלתור ראשון',
    titleEn: 'Pentatonic Scale and First Improvisation',
    subtitleHe: 'שיעור 1 — מסולם לסולו',
    subtitleEn: 'Lesson 1 — From scale to solo',
    sections: [
      {
        type: 'intro',
        bodyHe: 'ברמה שלך, הצעד הטבעי הוא להתחיל לאלתר. סולם הפנטטוניקה המינורי הוא הכלי הכי שימושי לכך — הוא בסיס לרוב הסולואים בבלוז, רוק וג\'אז.',
        bodyEn: 'At your level, the natural next step is to start improvising. The minor pentatonic scale is the most useful tool for that — it is the foundation of most solos in blues, rock and jazz.',
      },
      {
        type: 'theory',
        titleHe: 'סולם הפנטטוניקה המינורי — 5 נוטות, אינסוף אפשרויות',
        titleEn: 'The Minor Pentatonic Scale — 5 Notes, Infinite Possibilities',
        bodyHe: 'הסולם מכיל 5 נוטות בלבד (פנטה = חמש). ב-A minor pentatonic:\nA — C — D — E — G\n\nהתבנית הראשונה (box 1) מתחילה ב-fret ה-5 על מיתר E התחתון.\nכל הסולו של Led Zeppelin, Jimi Hendrix וה-blues הקלאסי בנוי על התבנית הזו.',
        bodyEn: 'The scale contains only 5 notes (penta = five). In A minor pentatonic:\nA — C — D — E — G\n\nThe first pattern (box 1) starts at fret 5 on the low E string.\nEvery solo by Led Zeppelin, Jimi Hendrix and classic blues is built on this pattern.',
      },
      {
        type: 'tip',
        titleHe: 'איך מאלתרים בפועל',
        titleEn: 'How to Actually Improvise',
        bodyHe: 'אלתור לא אומר לנגן את כל הנוטות בזה אחר זה. זה אומר לבחור נוטות, להחזיק אותן, לעשות bends, להוסיף דממות.\n\nהטעות הכי נפוצה: לנגן מהר מדי. הגיטריסטים הגדולים יודעים מתי לא לנגן.',
        bodyEn: 'Improvising does not mean playing all the notes in sequence. It means choosing notes, holding them, adding bends, incorporating silence.\n\nThe most common mistake: playing too fast. The greatest guitarists know when NOT to play.',
      },
      {
        type: 'example',
        titleHe: 'תרגיל אלתור ראשון',
        titleEn: 'First Improvisation Exercise',
        bodyHe: '1. מצא backing track של A blues ב-YouTube (חפש "A blues backing track")\n2. נגן רק נוטה אחת — A (fret 5, מיתר E תחתון)\n3. נגן אותה בזמנים שונים, עם חוזק שונה, עם bend קטן\n4. הוסף בהדרגה נוטה שנייה — C (fret 8, מיתר E תחתון)\n5. תהיה סבלני — האוזן מתפתחת עם הזמן',
        bodyEn: '1. Find an A blues backing track on YouTube (search "A blues backing track")\n2. Play only one note — A (fret 5, low E string)\n3. Play it at different timings, different intensities, with a small bend\n4. Gradually add a second note — C (fret 8, low E string)\n5. Be patient — the ear develops over time',
      },
      {
        type: 'ready',
        bodyHe: 'ניסית לאלתר? מעולה. עכשיו לאתגר.',
        bodyEn: 'Tried improvising? Great. Now to the challenge.',
      },
    ],
  },

  advanced: {
    titleHe: 'הרמוניה פונקציונלית — V7 ו-Tritone Substitution',
    titleEn: 'Functional Harmony — V7 and Tritone Substitution',
    subtitleHe: 'שיעור 1 — לחשוב כמו מוזיקאי ג\'אז',
    subtitleEn: 'Lesson 1 — Thinking like a jazz musician',
    sections: [
      {
        type: 'intro',
        bodyHe: 'ברמה שלך, ההבדל בין גיטריסט טוב למצוין טמון בהבנת ההרמוניה. השיעור הזה יעסוק ב-tritone substitution — אחד הכלים האהובים על גיטריסטי ג\'אז ופיוז\'ן.',
        bodyEn: 'At your level, the difference between a good and exceptional guitarist lies in understanding harmony. This lesson covers tritone substitution — one of the favorite tools of jazz and fusion guitarists.',
      },
      {
        type: 'theory',
        titleHe: 'מה זה Tritone Substitution?',
        titleEn: 'What is Tritone Substitution?',
        bodyHe: 'כל dominant 7 chord (V7) ניתן להחלפה ב-dominant 7 chord שנמצא טריטון (3 טונות שלמות) ממנו.\n\nלדוגמה: במקום G7 (V של C) אפשר לנגן Db7.\nהסיבה: ל-G7 ו-Db7 יש אותם שני צלילי מתח (tritone) — B ו-F — רק בסדר הפוך.',
        bodyEn: 'Every dominant 7 chord (V7) can be substituted with a dominant 7 chord a tritone (3 whole tones) away.\n\nFor example: instead of G7 (V of C) you can play Db7.\nReason: G7 and Db7 share the same two tension tones (tritone) — B and F — just in reverse order.',
      },
      {
        type: 'tip',
        titleHe: 'איך לשלב את זה בנגינה',
        titleEn: 'How to Apply This in Playing',
        bodyHe: 'ב-ii-V-I ב-C major (Dm7 — G7 — Cmaj7):\nנסה: Dm7 — Db7 — Cmaj7\n\nה-Db7 יוצר chromatic voice leading מדהים לכיוון ה-Cmaj7. הבס יורד בחצי צליל — תחושה מאוד מסופקת.',
        bodyEn: 'In ii-V-I in C major (Dm7 — G7 — Cmaj7):\nTry: Dm7 — Db7 — Cmaj7\n\nThe Db7 creates beautiful chromatic voice leading toward Cmaj7. The bass descends by a half step — a very satisfying resolution.',
      },
      {
        type: 'example',
        titleHe: 'תרגיל יישום',
        titleEn: 'Application Exercise',
        bodyHe: '1. נגן ii-V-I ב-C major עם ה-voicings הרגילים שלך\n2. בנגינה השנייה, החלף את G7 ב-Db7\n3. שים לב לאיכות ה-resolution שונה\n4. נסה את אותו עקרון ב-3 מפתחות שונים\n5. שלב זאת באלתור מעל backing track של jazz standard',
        bodyEn: '1. Play ii-V-I in C major with your usual voicings\n2. On the second pass, substitute G7 with Db7\n3. Notice the different quality of resolution\n4. Try the same principle in 3 different keys\n5. Incorporate it into improvisation over a jazz standard backing track',
      },
      {
        type: 'ready',
        bodyHe: 'עיכלת את החומר? עכשיו לאתגר המתקדם.',
        bodyEn: 'Absorbed the material? Now to the advanced challenge.',
      },
    ],
  },
}

const SECTION_STYLE: Record<string, { border: string; bg: string }> = {
  intro:   { border: 'var(--fm-border)',     bg: 'var(--fm-bg-card)' },
  theory:  { border: 'var(--fm-primary)',    bg: 'var(--fm-primary-bg)' },
  tip:     { border: 'var(--fm-secondary)',  bg: 'rgba(98,150,119,0.12)' },
  example: { border: 'var(--fm-border)',     bg: 'var(--fm-bg-input)' },
  ready:   { border: 'var(--fm-secondary)',  bg: 'var(--fm-secondary-bg)' },
}

interface Props {
  onGoToJourney: () => void
  userLevel: string
}

export default function LearningTab({ onGoToJourney, userLevel }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const [expanded, setExpanded] = useState<number | null>(null)

  const level = LESSONS_BY_LEVEL[userLevel] ? userLevel : 'beginner'
  const lesson = LESSONS_BY_LEVEL[level]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {isHe ? lesson.subtitleHe : lesson.subtitleEn}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-text)', margin: 0, letterSpacing: '-0.5px' }}>
          {isHe ? lesson.titleHe : lesson.titleEn}
        </h1>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lesson.sections.map((sec, i) => {
          const style = SECTION_STYLE[sec.type]
          const hasTitle = sec.titleHe || sec.titleEn
          const isOpen = expanded === i
          const isReady = sec.type === 'ready'

          return (
            <div key={i} style={{ borderRadius: 12, border: `1.5px solid ${style.border}`, background: style.bg, overflow: 'hidden' }}>
              {hasTitle ? (
                <>
                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    style={{
                      width: '100%', padding: '16px 20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      color: 'var(--fm-text)', fontWeight: 700, fontSize: 15,
                      textAlign: isHe ? 'right' : 'left',
                    }}
                  >
                    <span>{isHe ? sec.titleHe : sec.titleEn}</span>
                    <span style={{
                      fontSize: 18, color: 'var(--fm-text-muted)',
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s',
                      display: 'inline-block',
                    }}>›</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px' }}>
                      <p style={{ color: 'var(--fm-text)', fontSize: 15, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
                        {isHe ? sec.bodyHe : sec.bodyEn}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '20px' }}>
                  <p style={{ color: 'var(--fm-text)', fontSize: 15, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
                    {isHe ? sec.bodyHe : sec.bodyEn}
                  </p>
                  {isReady && (
                    <button
                      className="fm-btn-primary"
                      style={{ marginTop: 16, width: 'auto', padding: '12px 28px' }}
                      onClick={onGoToJourney}
                    >
                      {isHe ? 'עבור למסע שלך' : 'Go to Your Journey'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
