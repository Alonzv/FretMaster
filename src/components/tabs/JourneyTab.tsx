import { useTranslation } from 'react-i18next'

interface Challenge {
  id: number
  titleHe: string
  titleEn: string
  descHe: string
  descEn: string
  status: 'completed' | 'active' | 'locked'
  xp: number
}

const CHALLENGES: Challenge[] = [
  { id: 1, titleHe: 'הצליל הראשון',     titleEn: 'First Note',        descHe: 'נגן נוטה אחת נקייה 3 פעמים',             descEn: 'Play one clean note 3 times',               status: 'active',    xp: 50  },
  { id: 2, titleHe: 'שני מיתרים',       titleEn: 'Two Strings',       descHe: 'עבור בין שני מיתרים בצורה חלקה',         descEn: 'Switch between two strings smoothly',       status: 'locked',    xp: 75  },
  { id: 3, titleHe: 'האקורד הראשון',    titleEn: 'First Chord',       descHe: 'נגן אקורד Em נקי',                        descEn: 'Play a clean Em chord',                     status: 'locked',    xp: 100 },
  { id: 4, titleHe: 'מעבר אקורדים',     titleEn: 'Chord Change',      descHe: 'עבור בין Em ל-Am ברציפות',               descEn: 'Switch between Em and Am smoothly',         status: 'locked',    xp: 125 },
  { id: 5, titleHe: 'ריתמוס בסיסי',    titleEn: 'Basic Rhythm',      descHe: 'נגן strumming pattern פשוט עם מטרונום',  descEn: 'Play a simple strumming pattern with metronome', status: 'locked', xp: 150 },
  { id: 6, titleHe: 'שיר שלם',         titleEn: 'Full Song',         descHe: 'נגן שיר קצר מהתחלה לסוף',               descEn: 'Play a short song from start to finish',    status: 'locked',    xp: 200 },
]

export default function JourneyTab() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const totalXP = CHALLENGES.filter(c => c.status === 'completed').reduce((s, c) => s + c.xp, 0)
  const activeIdx = CHALLENGES.findIndex(c => c.status === 'active')

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {isHe ? 'מסלול האתגרים' : 'Challenge Path'}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-text)', margin: 0, letterSpacing: '-0.5px' }}>
          {isHe ? 'המסע שלך' : 'Your Journey'}
        </h1>
      </div>

      {/* XP bar */}
      <div className="fm-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)' }}>
            {totalXP} XP
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

      {/* Challenge list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CHALLENGES.map((ch, i) => {
          const isLocked = ch.status === 'locked'
          const isDone = ch.status === 'completed'
          const isActive = ch.status === 'active'

          return (
            <div
              key={ch.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 20px',
                borderRadius: 12,
                border: `1.5px solid ${isDone ? 'var(--fm-secondary)' : isActive ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
                background: isDone ? 'var(--fm-secondary-bg)' : isActive ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
                opacity: isLocked ? 0.5 : 1,
              }}
            >
              {/* Step number */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: isDone ? 'var(--fm-secondary)' : isActive ? 'var(--fm-primary)' : 'var(--fm-bg-input)',
                border: `2px solid ${isDone ? 'var(--fm-secondary)' : isActive ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                color: (isDone || isActive) ? 'white' : 'var(--fm-text-muted)',
              }}>
                {isDone ? '✓' : i + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)' }}>
                  {isHe ? ch.titleHe : ch.titleEn}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 3 }}>
                  {isLocked ? (isHe ? 'השלם את האתגר הקודם כדי לפתוח' : 'Complete the previous challenge to unlock') : (isHe ? ch.descHe : ch.descEn)}
                </div>
              </div>

              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                {isActive && (
                  <button className="fm-btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>
                    {isHe ? 'התחל' : 'Start'}
                  </button>
                )}
                {isDone && (
                  <span style={{ fontSize: 13, color: 'var(--fm-secondary)', fontWeight: 700 }}>
                    +{ch.xp} XP
                  </span>
                )}
                {isLocked && (
                  <span style={{ fontSize: 13, color: 'var(--fm-text-dim)', fontWeight: 600 }}>
                    {ch.xp} XP
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
