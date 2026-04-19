import { useTranslation } from 'react-i18next'

const TOPICS = [
  { id: 'fretboard', emoji: '🗺️', labelHe: 'הפרטבורד', labelEn: 'The Fretboard', status: 'available' },
  { id: 'scales', emoji: '🎼', labelHe: 'סולמות', labelEn: 'Scales', status: 'available' },
  { id: 'chords', emoji: '🎵', labelHe: 'בניית אקורדים', labelEn: 'Chord Construction', status: 'locked' },
  { id: 'harmony', emoji: '🎹', labelHe: 'הרמוניה', labelEn: 'Harmony', status: 'locked' },
  { id: 'rhythm', emoji: '🥁', labelHe: 'ריתמוס', labelEn: 'Rhythm', status: 'locked' },
  { id: 'styles', emoji: '🎸', labelHe: 'סגנונות מוזיקליים', labelEn: 'Musical Styles', status: 'locked' },
]

export default function TheoryTab() {
  const { t, i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <div style={{ padding: '20px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 6 }}>
        {t('theory.title')}
      </h1>
      <p style={{ color: 'var(--fm-text-muted)', fontSize: 14, marginBottom: 24 }}>
        {isHe ? 'תאוריה שמחוברת לגיטרה שלך' : 'Theory connected to your guitar'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TOPICS.map(topic => {
          const isLocked = topic.status === 'locked'
          return (
            <button
              key={topic.id}
              className="fm-card"
              disabled={isLocked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => { if (!isLocked) e.currentTarget.style.filter = 'brightness(0.95)' }}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <span style={{ fontSize: 28 }}>{isLocked ? '🔒' : topic.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)' }}>
                  {isHe ? topic.labelHe : topic.labelEn}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginTop: 2 }}>
                  {isLocked
                    ? (isHe ? 'נעול' : 'Locked')
                    : (isHe ? 'לחץ להתחיל' : 'Tap to begin')}
                </div>
              </div>
              {!isLocked && <span style={{ color: 'var(--fm-primary)', fontSize: 18 }}>{'›'}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
