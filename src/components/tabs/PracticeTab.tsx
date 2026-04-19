import { useTranslation } from 'react-i18next'

const EXERCISES = [
  { id: 'progressions', labelHe: 'פרוגרסיות אקורדים', labelEn: 'Chord Progressions',  color: 'var(--fm-primary-bg)',    border: 'var(--fm-primary)'   },
  { id: 'ear',          labelHe: 'אימון אוזן',          labelEn: 'Ear Training',          color: 'var(--fm-secondary-bg)', border: 'var(--fm-secondary)' },
  { id: 'improv',       labelHe: 'אלתור',               labelEn: 'Improvisation',         color: 'var(--fm-bg-card)',       border: 'var(--fm-border)'    },
  { id: 'technique',    labelHe: 'טכניקה',              labelEn: 'Technique',             color: 'var(--fm-bg-card)',       border: 'var(--fm-border)'    },
  { id: 'metronome',    labelHe: 'מטרונום',             labelEn: 'Metronome',             color: 'var(--fm-bg-card)',       border: 'var(--fm-border)'    },
]

export default function PracticeTab() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {isHe ? 'תרגולים חופשיים' : 'Free Exercises'}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-text)', margin: 0, letterSpacing: '-0.5px' }}>
          {isHe ? 'אימון' : 'Practice'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
        {EXERCISES.map(ex => (
          <button
            key={ex.id}
            style={{
              padding: '24px 20px',
              borderRadius: 12,
              border: `1.5px solid ${ex.border}`,
              background: ex.color,
              cursor: 'pointer',
              textAlign: isHe ? 'right' : 'left',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.95)')}
            onMouseLeave={e => (e.currentTarget.style.filter = '')}
          >
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)', marginBottom: 4 }}>
              {isHe ? ex.labelHe : ex.labelEn}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>
              {isHe ? 'לחץ להתחיל' : 'Click to start'}
            </div>
          </button>
        ))}
      </div>

      {/* Streak */}
      <div className="fm-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fm-text)' }}>
            {isHe ? 'רצף יומי' : 'Daily Streak'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 3 }}>
            {isHe ? 'תרגל היום כדי להתחיל את הרצף' : 'Practice today to start your streak'}
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-primary)' }}>0</div>
      </div>
    </div>
  )
}
