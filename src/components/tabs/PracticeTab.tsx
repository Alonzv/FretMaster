import { useTranslation } from 'react-i18next'

const EXERCISES = [
  { id: 'progressions', emoji: '🎵', labelHe: 'פרוגרסיות אקורדים', labelEn: 'Chord Progressions', color: 'var(--fm-primary-bg)', border: 'var(--fm-primary)' },
  { id: 'ear', emoji: '👂', labelHe: 'אימון אוזן', labelEn: 'Ear Training', color: 'var(--fm-secondary-bg)', border: 'var(--fm-secondary)' },
  { id: 'improv', emoji: '🎸', labelHe: 'אלתור', labelEn: 'Improvisation', color: 'var(--fm-coral-faint)', border: 'var(--fm-coral)' },
  { id: 'technique', emoji: '🖐️', labelHe: 'טכניקה', labelEn: 'Technique', color: 'var(--fm-primary-soft)', border: 'var(--fm-primary)' },
  { id: 'metronome', emoji: '🥁', labelHe: 'מטרונום', labelEn: 'Metronome', color: 'var(--fm-bg-input)', border: 'var(--fm-border)' },
]

export default function PracticeTab() {
  const { t, i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <div style={{ padding: '20px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 6 }}>
        {t('practice.title')}
      </h1>
      <p style={{ color: 'var(--fm-text-muted)', fontSize: 14, marginBottom: 24 }}>
        {isHe ? 'תרגולים שאפשר לעשות בכל זמן' : 'Exercises you can do anytime'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {EXERCISES.map(ex => (
          <button
            key={ex.id}
            className="fm-card"
            style={{
              background: ex.color,
              borderColor: ex.border,
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 20,
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.95)')}
            onMouseLeave={e => (e.currentTarget.style.filter = '')}
          >
            <span style={{ fontSize: 32 }}>{ex.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fm-text)' }}>
              {isHe ? ex.labelHe : ex.labelEn}
            </span>
          </button>
        ))}
      </div>

      {/* Daily streak */}
      <div className="fm-card" style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>🔥</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fm-text)' }}>
            {isHe ? '0 ימים רצופים' : '0 day streak'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>
            {isHe ? 'תרגל היום כדי להתחיל!' : 'Practice today to start!'}
          </div>
        </div>
      </div>
    </div>
  )
}
