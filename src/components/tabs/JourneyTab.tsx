import { useTranslation } from 'react-i18next'

interface Challenge {
  id: number
  emoji: string
  titleHe: string
  titleEn: string
  descHe: string
  descEn: string
  status: 'completed' | 'active' | 'locked'
  xp: number
}

const CHALLENGES: Challenge[] = [
  { id: 1, emoji: '🎸', titleHe: 'הצליל הראשון', titleEn: 'First Note', descHe: 'נגן נוטה אחת נקייה 3 פעמים', descEn: 'Play one clean note 3 times', status: 'active', xp: 50 },
  { id: 2, emoji: '🤘', titleHe: 'שני מיתרים', titleEn: 'Two Strings', descHe: 'עבור בין שני מיתרים בצורה חלקה', descEn: 'Switch between two strings smoothly', status: 'locked', xp: 75 },
  { id: 3, emoji: '🎵', titleHe: 'האקורד הראשון', titleEn: 'First Chord', descHe: 'נגן אקורד Em נקי', descEn: 'Play a clean Em chord', status: 'locked', xp: 100 },
  { id: 4, emoji: '🔄', titleHe: 'מעבר אקורדים', titleEn: 'Chord Change', descHe: 'עבור בין Em ל-Am', descEn: 'Switch between Em and Am', status: 'locked', xp: 125 },
  { id: 5, emoji: '🥁', titleHe: 'הריתמוס הראשון', titleEn: 'First Rhythm', descHe: 'נגן strumming pattern בסיסי', descEn: 'Play a basic strumming pattern', status: 'locked', xp: 150 },
  { id: 6, emoji: '🎼', titleHe: 'שיר שלם', titleEn: 'Full Song', descHe: 'נגן שיר קצר מהתחלה לסוף', descEn: 'Play a short song from start to finish', status: 'locked', xp: 200 },
]

export default function JourneyTab() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const totalXP = CHALLENGES.filter(c => c.status === 'completed').reduce((s, c) => s + c.xp, 0)
  const activeIdx = CHALLENGES.findIndex(c => c.status === 'active')

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Header */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 4 }}>
        {isHe ? 'המסע שלך' : 'Your Journey'}
      </h1>
      <p style={{ color: 'var(--fm-text-muted)', fontSize: 14, marginBottom: 16 }}>
        {isHe ? 'השלם אתגרים כדי להתקדם' : 'Complete challenges to progress'}
      </p>

      {/* XP bar */}
      <div className="fm-card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fm-text)' }}>
              {isHe ? `${totalXP} נקודות ניסיון` : `${totalXP} XP`}
            </span>
            <span style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>
              {isHe ? `אתגר ${activeIdx + 1} מתוך ${CHALLENGES.length}` : `Challenge ${activeIdx + 1} of ${CHALLENGES.length}`}
            </span>
          </div>
          <div style={{ height: 8, background: 'var(--fm-bg-input)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(activeIdx / CHALLENGES.length) * 100}%`,
              background: 'var(--fm-primary)',
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Challenge path */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line connecting challenges */}
        <div style={{
          position: 'absolute',
          left: 23,
          top: 24,
          bottom: 24,
          width: 2,
          background: 'var(--fm-border)',
          zIndex: 0,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CHALLENGES.map((ch) => {
            const isLocked = ch.status === 'locked'
            const isDone = ch.status === 'completed'
            const isActive = ch.status === 'active'

            return (
              <div
                key={ch.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Node */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: isDone ? 'var(--fm-secondary)' : isActive ? 'var(--fm-primary)' : 'var(--fm-bg-input)',
                  border: `3px solid ${isDone ? 'var(--fm-secondary)' : isActive ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                  boxShadow: isActive ? '0 0 16px var(--fm-primary-glow)' : 'none',
                }}>
                  {isDone ? '✓' : isLocked ? '🔒' : ch.emoji}
                </div>

                {/* Content */}
                <div
                  className={`fm-challenge${isLocked ? ' locked' : ''}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    borderColor: isActive ? 'var(--fm-primary)' : isDone ? 'var(--fm-secondary)' : undefined,
                    background: isActive ? 'var(--fm-primary-bg)' : isDone ? 'var(--fm-secondary-bg)' : undefined,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)' }}>
                      {isHe ? ch.titleHe : ch.titleEn}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginTop: 2 }}>
                      {isLocked ? (isHe ? 'נעול' : 'Locked') : (isHe ? ch.descHe : ch.descEn)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    {isActive && (
                      <button className="fm-btn-primary" style={{ width: 'auto', padding: '7px 14px', fontSize: 13 }}>
                        {isHe ? 'התחל' : 'Start'}
                      </button>
                    )}
                    {isDone && (
                      <span style={{ fontSize: 12, color: 'var(--fm-secondary)', fontWeight: 700 }}>
                        +{ch.xp} XP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
