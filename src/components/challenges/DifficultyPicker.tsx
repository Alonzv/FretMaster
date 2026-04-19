import type { Difficulty, CategoryProgress } from '../../lib/challenges/types'
import { isDifficultyUnlocked } from '../../lib/challenges/progress'

interface Props {
  progress: CategoryProgress
  onPick: (d: Difficulty) => void
  onCancel: () => void
  isHe: boolean
}

const LEVELS: { id: Difficulty; he: string; en: string; descHe: string; descEn: string }[] = [
  { id: 'easy',   he: 'קל',    en: 'Easy',   descHe: 'נקודת פתיחה — בסיס',            descEn: 'Starting point — foundation'         },
  { id: 'medium', he: 'בינוני', en: 'Medium', descHe: 'כל התווים, כל הסולמות',        descEn: 'Full chromatic, all keys'            },
  { id: 'hard',   he: 'קשה',   en: 'Hard',   descHe: 'מודוסים, אקורדים מורכבים',      descEn: 'Modes, complex chords'               },
]

export default function DifficultyPicker({ progress, onPick, onCancel, isHe }: Props) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fm-fade-in 0.18s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(440px, 100%)',
          background: 'var(--fm-bg-deep)',
          border: '1px solid var(--fm-border)',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            {isHe ? 'בחר רמת קושי' : 'Pick a difficulty'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>
            {isHe ? 'רמות נפתחות לפי ביצועים' : 'Levels unlock as you progress'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEVELS.map(lv => {
            const unlocked = isDifficultyUnlocked(progress, lv.id)
            return (
              <button
                key={lv.id}
                onClick={() => unlocked && onPick(lv.id)}
                disabled={!unlocked}
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  border: `1.5px solid ${unlocked ? 'var(--fm-border)' : 'var(--fm-border)'}`,
                  background: 'var(--fm-bg-card)',
                  opacity: unlocked ? 1 : 0.45,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  textAlign: isHe ? 'right' : 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (unlocked) e.currentTarget.style.borderColor = 'var(--fm-primary)' }}
                onMouseLeave={e => { if (unlocked) e.currentTarget.style.borderColor = 'var(--fm-border)' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fm-text)' }}>
                    {isHe ? lv.he : lv.en}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 2 }}>
                    {unlocked ? (isHe ? lv.descHe : lv.descEn) : (isHe ? 'סגור — השג 2×3★ ברמה הקודמת' : 'Locked — earn 2×3★ at the previous level')}
                  </div>
                </div>
                {!unlocked && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--fm-text-muted)">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
