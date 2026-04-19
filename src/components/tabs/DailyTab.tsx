import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import type { CategoryId, CategoryProgress, Difficulty, Question, SessionResult } from '../../lib/challenges/types'
import { CATEGORIES, getCategory } from '../../lib/challenges/categories'
import QuestionCard from '../challenges/QuestionCard'
import FeedbackPanel from '../challenges/FeedbackPanel'
import SessionSummary from '../challenges/SessionSummary'
import { scoreSession } from '../../lib/challenges/engine'

interface Props {
  progress: Record<CategoryId, CategoryProgress>
  onSessionComplete: (result: SessionResult) => void
}

const DAILY_LENGTH = 10

// A mixed daily session — draws questions from every available Phase-1 category at the
// user's highest unlocked difficulty, weighted toward weaker areas.
export default function DailyTab({ progress, onSessionComplete }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState<SessionResult | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  // Available = Phase-1 categories with an actual generator.
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  const startedAt = useMemo(() => Date.now(), [started])

  useEffect(() => {
    if (!started) return
    setQuestions(buildMixedSession(progress, DAILY_LENGTH))
  }, [started])

  const handleStart = () => {
    setStarted(true)
    setIdx(0)
    setSelectedIndex(null)
    setRevealed(false)
    setAnswers([])
    setDone(null)
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
      // Use the primary category of the first question for progress bookkeeping; daily XP
      // gets averaged across categories in the session summary.
      const result = scoreSession(current.categoryId, current.difficulty, answers, startedAt)
      setDone(result)
      onSessionComplete(result)
      return
    }
    setIdx(i => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
  }

  // ── Summary state ────────────────────────────────────────────────────────
  if (done) {
    const cat = getCategory(done.categoryId)
    if (!cat) return null
    return <SessionSummary result={done} category={cat} onExit={() => { setStarted(false); setDone(null) }} isHe={isHe} />
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
              {isHe ? 'סשן יומי' : 'Daily session'}
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
                  marginTop: 28, width: '100%', padding: '14px 20px',
                  borderRadius: 12,
                  background: selectedIndex === null ? 'var(--fm-bg-input)' : 'var(--fm-primary)',
                  color: selectedIndex === null ? 'var(--fm-text-muted)' : 'white',
                  fontSize: 15, fontWeight: 700,
                  cursor: selectedIndex === null ? 'not-allowed' : 'pointer',
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

  // ── Landing (before start) ───────────────────────────────────────────────
  const totalSessions = Object.values(progress).reduce((s, p) => s + p.sessionsPlayed, 0)

  return (
    <div className="fm-page">
      <div className="fm-page-header">
        <div className="fm-page-eyebrow">{isHe ? 'סשן יומי' : 'Daily session'}</div>
        <h1 className="fm-page-title">{isHe ? 'המסע שלך' : 'Your journey'}</h1>
        <p className="fm-page-subtitle">
          {isHe ? `${DAILY_LENGTH} שאלות מעורבות מכל הקטגוריות, מותאמות לאזורים שבהם אתה חלש יותר.` : `${DAILY_LENGTH} mixed questions across every category, weighted toward what you need most.`}
        </p>
      </div>

      <div className="fm-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text)' }}>
              {isHe ? 'הסשן של היום' : 'Today\'s session'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 4 }}>
              {available.length === 0
                ? (isHe ? 'אין עדיין קטגוריות זמינות' : 'No categories available yet')
                : (isHe ? `${available.length} קטגוריות פעילות · ~5 דקות` : `${available.length} active categories · ~5 min`)}
            </div>
          </div>
          <button
            onClick={handleStart}
            disabled={available.length === 0}
            style={{
              padding: '12px 24px', borderRadius: 12,
              background: 'var(--fm-primary)', color: 'white',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              opacity: available.length === 0 ? 0.5 : 1,
            }}
          >
            {isHe ? 'התחל' : 'Start'}
          </button>
        </div>
      </div>

      <div className="fm-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          {isHe ? 'התקדמות כוללת' : 'Total progress'}
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--fm-primary)' }}>
          {totalSessions}
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fm-text-muted)', marginInlineStart: 8 }}>
            {isHe ? 'סשנים הושלמו' : 'sessions completed'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Build a mixed session: sample N questions spread across categories, weighted so the
// user sees more of their weaker categories (lower bestAccuracy → higher weight).
function buildMixedSession(progress: Record<CategoryId, CategoryProgress>, length: number): Question[] {
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  if (available.length === 0) return []

  // Weight = 1 + (1 - accuracy). Fresh categories (accuracy=0) get weight 2.
  const weights = available.map(c => 1 + (1 - progress[c.id].bestAccuracy))
  const totalWeight = weights.reduce((s, w) => s + w, 0)

  const questions: Question[] = []
  for (let i = 0; i < length; i++) {
    let r = Math.random() * totalWeight
    let pick = available[0]
    for (let j = 0; j < available.length; j++) {
      r -= weights[j]
      if (r <= 0) { pick = available[j]; break }
    }
    if (!pick.generator) continue
    // Use the highest unlocked difficulty for this category.
    const d: Difficulty = progress[pick.id].unlockedDifficulty
    questions.push(pick.generator(d))
  }
  return questions
}
