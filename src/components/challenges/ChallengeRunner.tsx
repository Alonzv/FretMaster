import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, Difficulty, Question, SessionResult } from '../../lib/challenges/types'
import { buildSession, scoreSession, SESSION_LENGTH } from '../../lib/challenges/engine'
import { getCategory } from '../../lib/challenges/categories'
import QuestionCard from './QuestionCard'
import FeedbackPanel from './FeedbackPanel'
import SessionSummary from './SessionSummary'
import HeartsDisplay from './HeartsDisplay'
import type { HeartsState } from '../../lib/gamification/hearts'

interface Props {
  categoryId: CategoryId
  difficulty: Difficulty
  onExit: () => void
  onComplete: (result: SessionResult) => void
  hearts?: HeartsState
  onWrongAnswer?: () => void
}

// A record of one question plus what the user answered — powers the end-of-session review.
export interface AnsweredQuestion {
  question: Question
  chosenIndex: number
  correct: boolean
}

// Runs a full challenge session: renders questions, captures answers instantly on click,
// flashes feedback, then shows the summary at the end.
export default function ChallengeRunner({ categoryId, difficulty, onExit, onComplete, hearts, onWrongAnswer }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const category = getCategory(categoryId)
  const startedAt = useMemo(() => Date.now(), [])
  const questions = useMemo(() => buildSession(categoryId, difficulty, SESSION_LENGTH), [categoryId, difficulty])

  const [idx, setIdx] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([])
  const [done, setDone] = useState<SessionResult | null>(null)
  const [justLostHeart, setJustLostHeart] = useState(false)

  if (!category) return null

  if (done) {
    return <SessionSummary result={done} category={category} answers={answers} onExit={onExit} isHe={isHe} />
  }

  const current = questions[idx]
  const isLast = idx === questions.length - 1

  // Instant-reveal: the moment the user picks a choice, we lock + score.
  const handleSelect = (chosenIndex: number) => {
    if (revealed) return
    const correct = chosenIndex === current.correctIndex
    setSelectedIndex(chosenIndex)
    setRevealed(true)
    setAnswers(prev => [...prev, { question: current, chosenIndex, correct }])
    if (!correct && onWrongAnswer) {
      onWrongAnswer()
      setJustLostHeart(true)
      setTimeout(() => setJustLostHeart(false), 600)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const bools = answers.map(a => a.correct)
      const result = scoreSession(categoryId, difficulty, bools, startedAt)
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

        {hearts ? (
          <HeartsDisplay hearts={hearts} lastLost={justLostHeart} />
        ) : (
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', minWidth: 40, textAlign: 'center' }}>
            {idx + 1}/{questions.length}
          </div>
        )}
      </div>

      <div className="fm-runner-body">
        <div className="fm-runner-content">
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, textAlign: 'center' }}>
            {isHe ? category.titleHe : category.titleEn} · {isHe ? difficultyLabelHe(difficulty) : difficultyLabelEn(difficulty)}
          </div>

          <QuestionCard
            question={current}
            selectedIndex={selectedIndex}
            revealed={revealed}
            onSelect={handleSelect}
            isHe={isHe}
          />

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
