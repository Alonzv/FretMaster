import { useTranslation } from 'react-i18next'
import type { CategoryId, CategoryProgress } from '../../lib/challenges/types'
import { CATEGORIES } from '../../lib/challenges/categories'
import { totalXP } from '../../lib/challenges/progress'

interface Props {
  progress: Record<CategoryId, CategoryProgress>
}

// Read-only stats surface: aggregate XP, per-category accuracy bars, mastery tiers.
export default function StatsTab({ progress }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const xp = totalXP(progress)
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  const sessions = Object.values(progress).reduce((s, p) => s + p.sessionsPlayed, 0)
  const totalAnswered = Object.values(progress).reduce((s, p) => s + p.totalAnswered, 0)
  const totalCorrect  = Object.values(progress).reduce((s, p) => s + p.totalCorrect, 0)
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  return (
    <div className="fm-page">
      <div className="fm-page-header">
        <div className="fm-page-eyebrow">{isHe ? 'סטטיסטיקות' : 'Stats'}</div>
        <h1 className="fm-page-title">{isHe ? 'הפרוגרס שלך' : 'Your progress'}</h1>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        <SummaryCard label={isHe ? 'XP' : 'XP'} value={xp.toString()} highlight />
        <SummaryCard label={isHe ? 'סשנים' : 'Sessions'} value={sessions.toString()} />
        <SummaryCard label={isHe ? 'דיוק כולל' : 'Accuracy'} value={`${overallAccuracy}%`} />
        <SummaryCard label={isHe ? 'שאלות נענו' : 'Answered'} value={totalAnswered.toString()} />
      </div>

      {/* Per-category breakdown */}
      <section>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
          {isHe ? 'פירוט לפי קטגוריה' : 'By category'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {available.map(cat => {
            const cp = progress[cat.id]
            const accuracy = cp.totalAnswered > 0 ? (cp.totalCorrect / cp.totalAnswered) * 100 : 0
            const everPlayed = cp.sessionsPlayed > 0

            return (
              <div key={cat.id} className="fm-card" style={{ padding: 18, textAlign: isHe ? 'right' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)' }}>
                    {isHe ? cat.titleHe : cat.titleEn}
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 600, color: 'var(--fm-text-muted)', alignItems: 'center' }}>
                    {cp.mastery !== 'none' && (
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: cp.mastery === 'gold' ? 'rgba(212, 160, 23, 0.15)' : cp.mastery === 'silver' ? 'rgba(154, 165, 177, 0.18)' : 'rgba(169, 113, 66, 0.18)',
                        color: cp.mastery === 'gold' ? '#D4A017' : cp.mastery === 'silver' ? '#9AA5B1' : '#A97142',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: 10,
                      }}>
                        {cp.mastery}
                      </span>
                    )}
                    <span>{cp.xp} XP</span>
                  </div>
                </div>

                {/* Accuracy bar */}
                <div style={{
                  height: 6,
                  background: 'var(--fm-bg-input)',
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginBottom: 8,
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(accuracy, everPlayed ? 3 : 0)}%`,
                    background: 'var(--fm-primary)',
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--fm-text-muted)' }}>
                  <span>{everPlayed ? `${Math.round(accuracy)}% ${isHe ? 'דיוק' : 'accuracy'}` : (isHe ? 'לא תורגל' : 'Not practiced')}</span>
                  <span>{cp.sessionsPlayed} {isHe ? 'סשנים' : 'sessions'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SummaryCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: highlight ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        border: `1px solid ${highlight ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: highlight ? 'var(--fm-primary)' : 'var(--fm-text)', marginTop: 6 }}>
        {value}
      </div>
    </div>
  )
}
