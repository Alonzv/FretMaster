import type { SessionResult } from '../../lib/challenges/types'
import type { CategoryEntry } from '../../lib/challenges/categories'

interface Props {
  result: SessionResult
  category: CategoryEntry
  onExit: () => void
  isHe: boolean
}

// End-of-session card: accuracy, XP earned, stars, call-to-action to return.
export default function SessionSummary({ result, category, onExit, isHe }: Props) {
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0

  return (
    <div className="fm-runner">
      <div className="fm-runner-body">
        <div className="fm-runner-content" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            {isHe ? 'סשן הושלם' : 'Session complete'}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-text)', margin: '0 0 32px', letterSpacing: '-0.5px' }}>
            {isHe ? category.titleHe : category.titleEn}
          </h1>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
            {[1, 2, 3].map(n => {
              const filled = n <= result.stars
              return (
                <svg key={n} width="44" height="44" viewBox="0 0 24 24" fill={filled ? 'var(--fm-primary)' : 'var(--fm-border)'}>
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              )
            })}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            <StatBlock label={isHe ? 'דיוק' : 'Accuracy'} value={`${accuracy}%`} />
            <StatBlock label={isHe ? 'נכונות' : 'Correct'} value={`${result.correct}/${result.total}`} />
            <StatBlock label={isHe ? 'XP' : 'XP'} value={`+${result.xpEarned}`} highlight />
          </div>

          <button
            onClick={onExit}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 12,
              background: 'var(--fm-primary)',
              color: 'white',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.filter = '')}
          >
            {isHe ? 'חזרה לאתגרים' : 'Back to challenges'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        padding: '14px 8px',
        borderRadius: 12,
        background: highlight ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        border: `1px solid ${highlight ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: highlight ? 'var(--fm-primary)' : 'var(--fm-text)', marginTop: 4 }}>
        {value}
      </div>
    </div>
  )
}
