import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, Difficulty, SessionResult } from '../../lib/challenges/types'
import { buildSession, scoreSession, SESSION_LENGTH } from '../../lib/challenges/engine'
import { getCategory } from '../../lib/challenges/categories'
import QuestionCard from './QuestionCard'
import FeedbackPanel from './FeedbackPanel'
import SessionSummary from './SessionSummary'

interface Props {
  categoryId: CategoryId
  difficulty: Difficulty
  onExit: () => void
  onComplete: (result: SessionResult) => void
}

// Runs a full challenge session end-to-end: renders questions, collects answers,
// shows feedback after each, and a summary at the end.
export default function ChallengeRunner({ categoryId, difficulty, onExit, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const category = getCategory(categoryId)
  const startedAt = useMemo(() => Date.now(), [])
  const questions = useMemo(() => buildSession(categoryId, difficulty, SESSION_LENGTH), [categoryId, difficulty])

  const [idx, setIdx] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState<SessionResult | null>(null)

  if (!category) return null

  // End-of-session summary.
  if (done) {
    return <SessionSummary result={done} category={category} onExit={onExit} isHe={isHe} />
  }

  const current = questions[idx]
  const isLast = idx === questions.length - 1

  const handleSubmit = () => {
    if (selectedIndex === null) return
    const correct = selectedIndex === current.correctIndex
    setAnswers(prev => [...prev, correct])
    setRevealed(true)
  }

  const handleNext = () => {
    if (isLast) {
      const result = scoreSession(categoryId, difficulty, answers, startedAt)
      setDone(result)
      onComplete(result)
      return
    }
    setIdx(i => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
  }

  const progress = ((idx + (revealed ? 1 : 0)) / questions.length) * 100

  return (
    <div className="fm-runner">
      {/* Top bar */}
      <div className="fm-runner-top">
        <button
          onClick={onExit}
          aria-label={isHe ? 'סגור' : 'Close'}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--fm-bg-card)',
            border: '1px solid var(--fm-border)',
            color: 'var(--fm-text-muted)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--fm-text)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--fm-text-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="fm-runner-progress">
          <div className="fm-runner-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', minWidth: 40, textAlign: 'center' }}>
          {idx + 1}/{questions.length}
        </div>
      </div>

      {/* Main content */}
      <div className="fm-runner-body">
        <div className="fm-runner-content">
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, textAlign: 'center' }}>
            {isHe ? category.titleHe : category.titleEn} · {isHe ? difficultyLabelHe(difficulty) : difficultyLabelEn(difficulty)}
          </div>

          <QuestionCard
            question={current}
            selectedIndex={selectedIndex}
            revealed={revealed}
            onSelect={setSelectedIndex}
            isHe={isHe}
          />

          {!revealed && (
            <button
              onClick={handleSubmit}
              disabled={selectedIndex === null}
              style={{
                marginTop: 28,
                width: '100%',
                padding: '14px 20px',
                borderRadius: 12,
                background: selectedIndex === null ? 'var(--fm-bg-input)' : 'var(--fm-primary)',
                color: selectedIndex === null ? 'var(--fm-text-muted)' : 'white',
                fontSize: 15,
                fontWeight: 700,
                cursor: selectedIndex === null ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {isHe ? 'בדוק' : 'Check'}
            </button>
          )}

          {revealed && (
            <FeedbackPanel
              question={current}
              wasCorrect={selectedIndex === current.correctIndex}
              onNext={handleNext}
              isLast={isLast}
              isHe={isHe}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function difficultyLabelHe(d: Difficulty): string {
  return d === 'easy' ? 'קל' : d === 'medium' ? 'בינוני' : 'קשה'
}
function difficultyLabelEn(d: Difficulty): string {
  return d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard'
}
