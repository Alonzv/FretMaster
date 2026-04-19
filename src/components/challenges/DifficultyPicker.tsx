import type { Difficulty } from '../../lib/challenges/types'

interface Props {
  onPick: (d: Difficulty) => void
  onCancel: () => void
  isHe: boolean
}

const LEVELS: { id: Difficulty; he: string; en: string; descHe: string; descEn: string }[] = [
  { id: 'easy',   he: 'קל',    en: 'Easy',   descHe: 'נקודת פתיחה — בסיס',          descEn: 'Starting point — foundation' },
  { id: 'medium', he: 'בינוני', en: 'Medium', descHe: 'כל התווים, כל הסולמות',       descEn: 'Full chromatic, all keys'    },
  { id: 'hard',   he: 'קשה',   en: 'Hard',   descHe: 'מודוסים, אקורדים מורכבים',    descEn: 'Modes, complex chords'       },
]

// Difficulty selection modal. All levels are always available — no locking.
export default function DifficultyPicker({ onPick, onCancel, isHe }: Props) {
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
            {isHe ? 'כל הרמות פתוחות תמיד' : 'All levels are always available'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEVELS.map(lv => (
            <button
              key={lv.id}
              onClick={() => onPick(lv.id)}
              style={{
                padding: '16px 18px',
                borderRadius: 14,
                border: '1.5px solid var(--fm-border)',
                background: 'var(--fm-bg-card)',
                cursor: 'pointer',
                textAlign: isHe ? 'right' : 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fm-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--fm-border)' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fm-text)' }}>
                  {isHe ? lv.he : lv.en}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 2 }}>
                  {isHe ? lv.descHe : lv.descEn}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
