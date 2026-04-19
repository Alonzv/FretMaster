import type { CategoryTheoryEntry } from '../../lib/challenges/categoryTheory'

interface Props {
  entry: CategoryTheoryEntry
  isHe: boolean
  onStart: () => void
}

// Pre-session theory card — shown once before a challenge begins.
// Displays a hook line, 2–4 body paragraphs, and a prominent Start button.
export default function TheoryIntro({ entry, isHe, onStart }: Props) {
  const title = isHe ? entry.titleHe : entry.titleEn
  const hook = isHe ? entry.hookHe : entry.hookEn
  const paragraphs = isHe ? entry.paragraphsHe : entry.paragraphsEn

  return (
    <div className="fm-runner">
      <div className="fm-runner-body" style={{ alignItems: 'flex-start' }}>
        <div className="fm-runner-content">

          {/* Eyebrow */}
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: 'var(--fm-primary)',
            textTransform: 'uppercase', letterSpacing: 1.2,
            marginBottom: 10, textAlign: isHe ? 'right' : 'left',
          }}>
            {isHe ? 'קצת תאוריה לפני שמתחילים' : 'A bit of theory before we start'}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: 'var(--fm-text)',
            margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.15,
            textAlign: isHe ? 'right' : 'left',
          }}>
            {title}
          </h1>

          {/* Hook */}
          <p style={{
            fontSize: 16, fontWeight: 600, color: 'var(--fm-primary)',
            margin: '0 0 28px', lineHeight: 1.5,
            textAlign: isHe ? 'right' : 'left',
          }}>
            {hook}
          </p>

          {/* Theory paragraphs */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            marginBottom: 40, textAlign: isHe ? 'right' : 'left',
          }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{
                fontSize: 14, lineHeight: 1.7,
                color: 'var(--fm-text)',
                margin: 0,
                padding: '14px 18px',
                background: 'var(--fm-bg-card)',
                border: '1px solid var(--fm-border)',
                borderRadius: 12,
              }}>
                {p}
              </p>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            style={{
              width: '100%', padding: '15px 20px',
              borderRadius: 12,
              background: 'var(--fm-primary)', color: 'white',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.filter = '')}
          >
            {isHe ? 'הבנתי — בואו נתחיל' : 'Got it — let\'s start'}
          </button>

        </div>
      </div>
    </div>
  )
}
