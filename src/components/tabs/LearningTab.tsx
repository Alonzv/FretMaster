import { useTranslation } from 'react-i18next'

const CHAPTERS = [
  { id: 1, emoji: '🎸', titleHe: 'יסודות הגיטרה', titleEn: 'Guitar Fundamentals', status: 'active' },
  { id: 2, emoji: '🎵', titleHe: 'אקורדים ראשונים', titleEn: 'First Chords', status: 'locked' },
  { id: 3, emoji: '🎼', titleHe: 'ריתמוס ו-Strumming', titleEn: 'Rhythm & Strumming', status: 'locked' },
  { id: 4, emoji: '🎹', titleHe: 'סולם Pentatonic', titleEn: 'Pentatonic Scale', status: 'locked' },
  { id: 5, emoji: '🎺', titleHe: 'הרמוניה בסיסית', titleEn: 'Basic Harmony', status: 'locked' },
]

export default function LearningTab() {
  const { t, i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <div style={{ padding: '20px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 6 }}>
        {t('learning.title')}
      </h1>
      <p style={{ color: 'var(--fm-text-muted)', fontSize: 14, marginBottom: 24 }}>
        {isHe ? 'השלם אתגרים כדי לפתוח את הפרק הבא' : 'Complete challenges to unlock the next chapter'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CHAPTERS.map((ch, i) => {
          const isLocked = ch.status === 'locked'
          const isActive = ch.status === 'active'

          return (
            <div
              key={ch.id}
              className={`fm-challenge${isLocked ? ' locked' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 14 }}
            >
              {/* Number / status indicator */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: isLocked ? 'var(--fm-bg-input)' : isActive ? 'var(--fm-primary-bg)' : 'var(--fm-secondary-bg)',
                border: `2px solid ${isLocked ? 'var(--fm-border)' : isActive ? 'var(--fm-primary)' : 'var(--fm-secondary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}>
                {isLocked ? '🔒' : ch.emoji}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)' }}>
                  {t('learning.chapter')} {i + 1} — {isHe ? ch.titleHe : ch.titleEn}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginTop: 2 }}>
                  {isLocked ? t('learning.locked') : isActive ? '3 אתגרים' : t('learning.completed')}
                </div>
              </div>

              {isActive && (
                <button
                  className="fm-btn-primary"
                  style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
                >
                  {t('learning.startChallenge')}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
