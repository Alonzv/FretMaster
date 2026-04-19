import { useTranslation } from 'react-i18next'

const TOPICS = [
  { id: 'fretboard', labelHe: 'הפרטבורד', labelEn: 'The Fretboard',        descHe: 'שמות הנוטות, octaves, ניווט בצוואר', descEn: 'Note names, octaves, neck navigation', status: 'available' },
  { id: 'scales',    labelHe: 'סולמות',   labelEn: 'Scales',                descHe: 'Major, minor, pentatonic, modes',      descEn: 'Major, minor, pentatonic, modes',     status: 'available' },
  { id: 'chords',    labelHe: 'אקורדים',  labelEn: 'Chord Construction',    descHe: 'בניית triads ו-seventh chords',        descEn: 'Building triads and seventh chords',  status: 'locked'    },
  { id: 'harmony',   labelHe: 'הרמוניה',  labelEn: 'Harmony',               descHe: 'Roman numerals, progressions, cadences', descEn: 'Roman numerals, progressions, cadences', status: 'locked' },
  { id: 'rhythm',    labelHe: 'ריתמוס',   labelEn: 'Rhythm',                descHe: 'תווים, מקצבים, syncopation',          descEn: 'Note values, meters, syncopation',    status: 'locked'    },
  { id: 'styles',    labelHe: 'סגנונות',  labelEn: 'Styles',                descHe: 'בלוז, ג\'אז, רוק — איך הם שונים',    descEn: 'Blues, jazz, rock — how they differ', status: 'locked'    },
]

export default function TheoryTab() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {isHe ? 'תאוריה מחוברת לגיטרה' : 'Theory Connected to Guitar'}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-text)', margin: 0, letterSpacing: '-0.5px' }}>
          {isHe ? 'תאוריה' : 'Theory'}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TOPICS.map(topic => {
          const isLocked = topic.status === 'locked'
          return (
            <button
              key={topic.id}
              disabled={isLocked}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 20px',
                borderRadius: 12,
                border: `1.5px solid ${isLocked ? 'var(--fm-border)' : 'var(--fm-primary)'}`,
                background: isLocked ? 'var(--fm-bg-card)' : 'var(--fm-primary-bg)',
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                textAlign: isHe ? 'right' : 'left',
                width: '100%',
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => { if (!isLocked) e.currentTarget.style.filter = 'brightness(0.95)' }}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fm-text)' }}>
                  {isHe ? topic.labelHe : topic.labelEn}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 3 }}>
                  {isHe ? topic.descHe : topic.descEn}
                </div>
              </div>
              {!isLocked && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--fm-primary)" style={{ flexShrink: 0, transform: isHe ? 'scaleX(-1)' : 'none' }}>
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
