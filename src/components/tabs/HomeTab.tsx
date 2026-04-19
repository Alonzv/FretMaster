import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '../../lib/challenges/categories'
import type { CategoryId, Difficulty, SessionResult, CategoryProgress } from '../../lib/challenges/types'
import DifficultyPicker from '../challenges/DifficultyPicker'
import ChallengeRunner from '../challenges/ChallengeRunner'

interface Props {
  progress: Record<CategoryId, CategoryProgress>
  onSessionComplete: (result: SessionResult) => void
}

// The app's home screen — showcases every category the app offers, grouped by phase.
// Tap a category to pick a difficulty and start a session.
export default function HomeTab({ progress, onSessionComplete }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [pickerFor, setPickerFor] = useState<CategoryId | null>(null)
  const [activeSession, setActiveSession] = useState<{ id: CategoryId; difficulty: Difficulty } | null>(null)

  if (activeSession) {
    return (
      <ChallengeRunner
        categoryId={activeSession.id}
        difficulty={activeSession.difficulty}
        onExit={() => setActiveSession(null)}
        onComplete={onSessionComplete}
      />
    )
  }

  const phase1 = CATEGORIES.filter(c => c.phase === 1)
  const phase2 = CATEGORIES.filter(c => c.phase === 2)
  const phase3 = CATEGORIES.filter(c => c.phase === 3)

  return (
    <div className="fm-page">
      <div className="fm-page-header" style={{ textAlign: isHe ? 'right' : 'left' }}>
        <div className="fm-page-eyebrow">
          {isHe ? 'ברוך הבא' : 'Welcome'}
        </div>
        <h1 className="fm-page-title">
          {isHe ? 'מה לומדים היום?' : 'What will you learn today?'}
        </h1>
        <p className="fm-page-subtitle">
          {isHe
            ? 'בחר קטגוריה — כל קטגוריה היא סשן קצר של 10 שאלות עם הסבר על כל טעות.'
            : 'Pick a category — each one is a short 10-question session with an explanation for every mistake.'}
        </p>
      </div>

      <CategoryGroup
        title={isHe ? 'תאוריה' : 'Theory'}
        categories={phase1}
        progress={progress}
        onOpen={id => setPickerFor(id)}
        isHe={isHe}
      />

      <CategoryGroup
        title={isHe ? 'אימון אוזן (בקרוב)' : 'Ear training (coming soon)'}
        categories={phase2}
        progress={progress}
        onOpen={() => {}}
        isHe={isHe}
      />

      <CategoryGroup
        title={isHe ? 'נגינה בגיטרה (בקרוב)' : 'Play-along (coming soon)'}
        categories={phase3}
        progress={progress}
        onOpen={() => {}}
        isHe={isHe}
      />

      {pickerFor && (
        <DifficultyPicker
          onPick={d => {
            setActiveSession({ id: pickerFor, difficulty: d })
            setPickerFor(null)
          }}
          onCancel={() => setPickerFor(null)}
          isHe={isHe}
        />
      )}
    </div>
  )
}

function CategoryGroup({
  title, categories, progress, onOpen, isHe,
}: {
  title: string
  categories: typeof CATEGORIES
  progress: Record<CategoryId, CategoryProgress>
  onOpen: (id: CategoryId) => void
  isHe: boolean
}) {
  if (categories.length === 0) return null

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, textAlign: isHe ? 'right' : 'left' }}>
        {title}
      </div>
      <div className="fm-category-grid">
        {categories.map(cat => {
          const available = !!cat.generator
          const cp = progress[cat.id]
          const accuracy = cp.totalAnswered > 0 ? Math.round((cp.totalCorrect / cp.totalAnswered) * 100) : null

          return (
            <button
              key={cat.id}
              onClick={() => available && onOpen(cat.id)}
              disabled={!available}
              className="fm-category-card"
              style={{
                opacity: available ? 1 : 0.55,
                cursor: available ? 'pointer' : 'not-allowed',
                textAlign: isHe ? 'right' : 'left',
              }}
            >
              <div className="fm-category-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d={cat.icon} />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)' }}>
                  {isHe ? cat.titleHe : cat.titleEn}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                  {isHe ? cat.descHe : cat.descEn}
                </div>
                {available && cp.sessionsPlayed > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, fontWeight: 600 }}>
                    <span style={{ color: 'var(--fm-primary)' }}>{cp.xp} XP</span>
                    {accuracy !== null && <span style={{ color: 'var(--fm-text-muted)' }}>· {accuracy}%</span>}
                    {cp.mastery !== 'none' && (
                      <span style={{ color: cp.mastery === 'gold' ? '#D4A017' : cp.mastery === 'silver' ? '#9AA5B1' : '#A97142', textTransform: 'capitalize' }}>
                        · {cp.mastery}
                      </span>
                    )}
                  </div>
                )}
                {!available && (
                  <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: 'var(--fm-text-muted)' }}>
                    {isHe ? 'בפיתוח' : 'In development'}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
