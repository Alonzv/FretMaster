import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Lesson {
  id: string
  emoji: string
  titleHe: string
  titleEn: string
  sections: Section[]
}

interface Section {
  type: 'intro' | 'theory' | 'tip' | 'example' | 'ready'
  titleHe?: string
  titleEn?: string
  bodyHe: string
  bodyEn: string
}

const CURRENT_LESSON: Lesson = {
  id: 'guitar-basics',
  emoji: '🎸',
  titleHe: 'יסודות הגיטרה',
  titleEn: 'Guitar Fundamentals',
  sections: [
    {
      type: 'intro',
      bodyHe: 'ברוך הבא לשיעור הראשון! נתחיל מהבסיס — איך לאחוז בגיטרה, מה זה frets ו-strings, ואיך מפיקים צליל נקי.',
      bodyEn: "Welcome to your first lesson! We'll start from the basics — how to hold the guitar, what frets and strings are, and how to produce a clean sound.",
    },
    {
      type: 'theory',
      titleHe: 'מבנה הגיטרה',
      titleEn: 'Guitar Anatomy',
      bodyHe: '🎸 הגיטרה מורכבת מ-6 מיתרים. מהעבה לדקיק: E-A-D-G-B-e\n\n📍 ה-Frets הם הפסים המתכתיים לאורך ה-Neck. כשאתה לוחץ בין שני frets — זה מייצר נוטה.',
      bodyEn: '🎸 The guitar has 6 strings. From thickest to thinnest: E-A-D-G-B-e\n\n📍 Frets are the metal strips along the neck. When you press between two frets — that produces a note.',
    },
    {
      type: 'tip',
      titleHe: '💡 טיפ חשוב',
      titleEn: '💡 Important Tip',
      bodyHe: 'לחץ את האצבע קרוב ל-fret (מימינו), לא באמצע. זה מייצר צליל נקי יותר ודורש פחות כוח.',
      bodyEn: 'Press your finger close to the fret (on its right side), not in the middle. This produces a cleaner sound and requires less force.',
    },
    {
      type: 'example',
      titleHe: '🎵 ננסה ביחד',
      titleEn: '🎵 Let\'s Try Together',
      bodyHe: '1. קח את הגיטרה ואחוז בה בצורה נוחה\n2. מצא את המיתר הדקיק ביותר (e)\n3. לחץ ב-fret הראשון עם האצבע המורה\n4. דפוק על המיתר עם הפיק או האגודל',
      bodyEn: '1. Pick up the guitar and hold it comfortably\n2. Find the thinnest string (e)\n3. Press the 1st fret with your index finger\n4. Strike the string with a pick or your thumb',
    },
    {
      type: 'ready',
      bodyHe: 'מצוין! עכשיו שלמדת את הבסיס, אתה מוכן לאתגר הראשון שלך במסע שלך.',
      bodyEn: "Great! Now that you've learned the basics, you're ready for your first challenge in Your Journey.",
    },
  ],
}

const SECTION_COLORS: Record<string, string> = {
  intro: 'var(--fm-bg-card)',
  theory: 'var(--fm-primary-bg)',
  tip: 'rgba(98,150,119,0.15)',
  example: 'rgba(232,115,106,0.08)',
  ready: 'var(--fm-secondary-bg)',
}

const SECTION_BORDER: Record<string, string> = {
  intro: 'var(--fm-border)',
  theory: 'var(--fm-primary)',
  tip: 'var(--fm-secondary)',
  example: 'var(--fm-coral)',
  ready: 'var(--fm-secondary)',
}

interface Props {
  onGoToJourney: () => void
}

export default function LearningTab({ onGoToJourney }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const [expanded, setExpanded] = useState<string | null>('intro')
  const lesson = CURRENT_LESSON

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 32 }}>{lesson.emoji}</span>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fm-text)', margin: 0 }}>
            {isHe ? lesson.titleHe : lesson.titleEn}
          </h1>
          <p style={{ color: 'var(--fm-text-muted)', fontSize: 13, margin: 0 }}>
            {isHe ? 'שיעור 1' : 'Lesson 1'}
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--fm-border)', margin: '16px 0' }} />

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lesson.sections.map((sec, i) => {
          const key = `${sec.type}-${i}`
          const isOpen = expanded === key
          const hasTitle = sec.titleHe || sec.titleEn
          const isReady = sec.type === 'ready'

          return (
            <div
              key={key}
              style={{
                borderRadius: 12,
                border: `1.5px solid ${SECTION_BORDER[sec.type]}`,
                background: SECTION_COLORS[sec.type],
                overflow: 'hidden',
              }}
            >
              {hasTitle && (
                <button
                  onClick={() => setExpanded(isOpen ? null : key)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--fm-text)',
                    fontWeight: 700,
                    fontSize: 15,
                    textAlign: isHe ? 'right' : 'left',
                  }}
                >
                  <span>{isHe ? sec.titleHe : sec.titleEn}</span>
                  <span style={{ fontSize: 18, color: 'var(--fm-text-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    ›
                  </span>
                </button>
              )}

              {(!hasTitle || isOpen) && (
                <div style={{ padding: hasTitle ? '0 16px 16px' : '16px' }}>
                  <p style={{
                    color: 'var(--fm-text)',
                    fontSize: 15,
                    lineHeight: 1.7,
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}>
                    {isHe ? sec.bodyHe : sec.bodyEn}
                  </p>

                  {isReady && (
                    <button
                      className="fm-btn-primary"
                      style={{ marginTop: 16 }}
                      onClick={onGoToJourney}
                    >
                      {isHe ? 'עבור למסע שלך ←' : 'Go to Your Journey →'}
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
