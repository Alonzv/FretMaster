import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, CategoryProgress, Difficulty, Question, SessionResult } from '../../lib/challenges/types'
import { CATEGORIES, getCategory } from '../../lib/challenges/categories'
import QuestionCard from '../challenges/QuestionCard'
import FeedbackPanel from '../challenges/FeedbackPanel'
import SessionSummary from '../challenges/SessionSummary'
import TheoryIntro from '../challenges/TheoryIntro'
import { CATEGORY_THEORY } from '../../lib/challenges/categoryTheory'
import type { AnsweredQuestion } from '../challenges/ChallengeRunner'
import { scoreSession } from '../../lib/challenges/engine'

interface Props {
  progress: Record<CategoryId, CategoryProgress>
  onSessionComplete: (result: SessionResult) => void
}

const DAILY_LENGTH = 10

// Daily mixed session — draws 10 questions spread across every Phase-1 category,
// weighted toward the user's weaker areas. Landing is just one centered Start button.
export default function DailyTab({ progress, onSessionComplete }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [showTheory, setShowTheory] = useState(false)
  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([])
  const [done, setDone] = useState<SessionResult | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  const startedAt = useMemo(() => Date.now(), [started])

  useEffect(() => {
    if (!started) return
    setQuestions(buildMixedSession(progress, DAILY_LENGTH))
  }, [started])

  const handleStart = () => {
    setShowTheory(true)
  }

  const handleTheoryDone = () => {
    setShowTheory(false)
    setStarted(true)
    setIdx(0)
    setSelectedIndex(null)
    setRevealed(false)
    setAnswers([])
    setDone(null)
  }

  const current = questions[idx]
  const isLast = idx === questions.length - 1

  // Instant-reveal on choice click.
  const handleSelect = (chosenIndex: number) => {
    if (revealed || !current) return
    const correct = chosenIndex === current.correctIndex
    setSelectedIndex(chosenIndex)
    setRevealed(true)
    setAnswers(prev => [...prev, { question: current, chosenIndex, correct }])
  }

  const handleNext = () => {
    if (!current) return
    if (isLast) {
      const bools = answers.map(a => a.correct)
      const result = scoreSession(current.categoryId, current.difficulty, bools, startedAt)
      setDone(result)
      onSessionComplete(result)
      return
    }
    setIdx(i => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
  }

  // ── Theory intro ────────────────────────────────────────────────────────
  if (showTheory) {
    const entry = CATEGORY_THEORY['_daily']!
    return <TheoryIntro entry={entry} isHe={isHe} onStart={handleTheoryDone} />
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  if (done) {
    const cat = getCategory(done.categoryId)
    if (!cat) return null
    return (
      <SessionSummary
        result={done}
        category={cat}
        answers={answers}
        onExit={() => { setStarted(false); setDone(null) }}
        isHe={isHe}
      />
    )
  }

  // ── Active session ───────────────────────────────────────────────────────
  if (started && current) {
    const progressPct = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
    return (
      <div className="fm-runner">
        <div className="fm-runner-top">
          <button
            onClick={() => setStarted(false)}
            aria-label={isHe ? 'סגור' : 'Close'}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--fm-bg-card)', border: '1px solid var(--fm-border)',
              color: 'var(--fm-text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          <div className="fm-runner-progress">
            <div className="fm-runner-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', minWidth: 40, textAlign: 'center' }}>
            {idx + 1}/{questions.length}
          </div>
        </div>

        <div className="fm-runner-body">
          <div className="fm-runner-content">
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, textAlign: 'center' }}>
              {isHe ? 'האתגר היומי' : 'Daily challenge'}
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

  // ── Landing — a single centered Start button ─────────────────────────────
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)

  return (
    <div className="fm-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      maxWidth: 520,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        {isHe ? 'האתגר היומי' : 'Daily Challenge'}
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--fm-text)', margin: '0 0 14px', letterSpacing: '-0.5px' }}>
        {isHe ? 'מוכן לאתגר?' : 'Ready for today\'s challenge?'}
      </h1>
      <p style={{ fontSize: 15, color: 'var(--fm-text-muted)', lineHeight: 1.6, margin: '0 0 36px', maxWidth: 420 }}>
        {isHe
          ? `${DAILY_LENGTH} שאלות מעורבות מכל הקטגוריות, מותאמות לאזורים שבהם אתה חלש יותר. בערך 5 דקות.`
          : `${DAILY_LENGTH} mixed questions across every category, weighted toward what you need most. About 5 minutes.`}
      </p>

      <button
        onClick={handleStart}
        disabled={available.length === 0}
        style={{
          padding: '16px 44px',
          borderRadius: 999,
          background: 'var(--fm-primary)',
          color: 'white',
          fontSize: 16,
          fontWeight: 700,
          cursor: available.length === 0 ? 'not-allowed' : 'pointer',
          opacity: available.length === 0 ? 0.5 : 1,
          transition: 'filter 0.15s, transform 0.1s',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.filter = '')}
      >
        {isHe ? 'התחל' : 'Start'}
      </button>
    </div>
  )
}

// Weighted mix: categories with lower best-accuracy get more questions.
function buildMixedSession(progress: Record<CategoryId, CategoryProgress>, length: number): Question[] {
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  if (available.length === 0) return []

  const weights = available.map(c => 1 + (1 - progress[c.id].bestAccuracy))
  const totalWeight = weights.reduce((s, w) => s + w, 0)

  // Rotate difficulty per-question so the mix isn't monotone — all levels are unlocked.
  const diffs: Difficulty[] = ['easy', 'medium', 'hard']

  const questions: Question[] = []
  for (let i = 0; i < length; i++) {
    let r = Math.random() * totalWeight
    let pick = available[0]
    for (let j = 0; j < available.length; j++) {
      r -= weights[j]
      if (r <= 0) { pick = available[j]; break }
    }
    if (!pick.generator) continue
    const d = diffs[Math.floor(Math.random() * diffs.length)]
    questions.push(pick.generator(d))
  }
  return questions
}
