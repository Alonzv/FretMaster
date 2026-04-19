// First-launch app introduction — shown once after the user signs in for the first time.
// A quick 3-slide carousel explaining what FretMaster is and how it works.

const INTRO_KEY = 'fm_app_intro_v2'

export function hasSeenIntro(): boolean {
  return localStorage.getItem(INTRO_KEY) === '1'
}
export function markIntroSeen(): void {
  localStorage.setItem(INTRO_KEY, '1')
}

interface Props {
  isHe: boolean
  onDone: () => void
}

const SLIDES_HE = [
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
      </svg>
    ),
    title: 'ברוך הבא ל-FretMaster',
    body: 'אפליקציה ללימוד תאוריה מוזיקלית ופרטבורד — דרך אתגרים קצרים ואינטראקטיביים. כמו Duolingo, רק לגיטריסטים.',
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    title: 'תשובה → פידבק → הסבר',
    body: 'כשבוחרים תשובה — מיד רואים אם צדקת. אם לא, מקבלים הסבר מדוע התשובה הנכונה היא מה שהיא. בסוף כל סשן יש סיכום של כל הטעויות.',
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
      </svg>
    ),
    title: 'מונח לא מכיר?',
    body: 'כל פעם שיופיע ביטוי תאורטי כמו "רלטיב מינור" או "טריטון" — אפשר לעשות hover ולקרוא הסבר. ועוד לפני כל תרגיל יש הסבר תאורטי קצר.',
  },
]

const SLIDES_EN = [
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
      </svg>
    ),
    title: 'Welcome to FretMaster',
    body: 'Learn music theory and the guitar fretboard through short, interactive challenges — like Duolingo, but built for guitarists.',
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    title: 'Answer → Feedback → Explanation',
    body: 'The moment you pick an answer you see if you were right. If not, you get an explanation of why the correct answer is correct. Every session ends with a review of all your mistakes.',
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
      </svg>
    ),
    title: 'Unknown term?',
    body: 'Whenever a theory term like "relative minor" or "tritone" appears, hover over it to read a quick definition. And before every session there is a short theory overview.',
  },
]

import { useState } from 'react'

export default function AppIntro({ isHe, onDone }: Props) {
  const [idx, setIdx] = useState(0)
  const slides = isHe ? SLIDES_HE : SLIDES_EN
  const slide = slides[idx]
  const isLast = idx === slides.length - 1

  const advance = () => {
    if (isLast) { markIntroSeen(); onDone() }
    else setIdx(i => i + 1)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'var(--fm-bg-deep)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      direction: isHe ? 'rtl' : 'ltr',
    }}>
      <div style={{
        width: 'min(480px, 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 0,
        animation: 'fm-fade-in 0.25s ease',
      }}>
        {/* Icon */}
        <div style={{
          width: 92, height: 92, borderRadius: 24,
          background: 'var(--fm-primary-bg)',
          color: 'var(--fm-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}>
          {slide.icon}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: 'var(--fm-text)',
          margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.2,
        }}>
          {slide.title}
        </h1>

        {/* Body */}
        <p style={{
          fontSize: 15, color: 'var(--fm-text-muted)',
          lineHeight: 1.65, margin: '0 0 40px', maxWidth: 380,
        }}>
          {slide.body}
        </p>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              height: 6, borderRadius: 3,
              width: i === idx ? 22 : 6,
              background: i === idx ? 'var(--fm-primary)' : 'var(--fm-border)',
              transition: 'width 0.25s ease, background 0.25s ease',
            }} />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={advance}
          style={{
            width: '100%', padding: '15px 20px',
            borderRadius: 12, background: 'var(--fm-primary)', color: 'white',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            transition: 'filter 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.filter = '')}
        >
          {isLast
            ? (isHe ? 'בואו נתחיל' : 'Let\'s go')
            : (isHe ? 'הבא' : 'Next')}
        </button>

        {!isLast && (
          <button
            onClick={() => { markIntroSeen(); onDone() }}
            style={{
              marginTop: 12, fontSize: 13,
              color: 'var(--fm-text-muted)',
              cursor: 'pointer', padding: '6px 12px',
            }}
          >
            {isHe ? 'דלג' : 'Skip'}
          </button>
        )}
      </div>
    </div>
  )
}
