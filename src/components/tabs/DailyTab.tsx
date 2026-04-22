import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, CategoryProgress, Difficulty, Question, SessionResult } from '../../lib/challenges/types'
import { CATEGORIES, getCategory } from '../../lib/challenges/categories'
import QuestionCard from '../challenges/QuestionCard'
import FeedbackPanel from '../challenges/FeedbackPanel'
import SessionSummary from '../challenges/SessionSummary'
import HeartsDisplay from '../challenges/HeartsDisplay'
import TheoryIntro from '../challenges/TheoryIntro'
import { CATEGORY_THEORY } from '../../lib/challenges/categoryTheory'
import type { AnsweredQuestion } from '../challenges/ChallengeRunner'
import { scoreSession } from '../../lib/challenges/engine'
import type { HeartsState } from '../../lib/gamification/hearts'
import TactileButton from '../ui/TactileButton'

interface Props {
  progress: Record<CategoryId, CategoryProgress>
  onSessionComplete: (result: SessionResult) => void
  hearts?: HeartsState
  onWrongAnswer?: () => void
}

const DAILY_LENGTH = 10

export default function DailyTab({ progress, onSessionComplete, hearts, onWrongAnswer }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [showTheory, setShowTheory]   = useState(false)
  const [started, setStarted]         = useState(false)
  const [idx, setIdx]                 = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed]       = useState(false)
  const [answers, setAnswers]         = useState<AnsweredQuestion[]>([])
  const [done, setDone]               = useState<SessionResult | null>(null)
  const [questions, setQuestions]     = useState<Question[]>([])
  const [justLostHeart, setJustLostHeart] = useState(false)

  const startedAt = useMemo(() => Date.now(), [started]) // eslint-disable-line

  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)

  const handleStart = () => {
    // No hearts = can't play
    if (hearts && hearts.current === 0) return
    setShowTheory(true)
  }

  const handleTheoryDone = () => {
    setShowTheory(false)
    setQuestions(buildMixedSession(progress, DAILY_LENGTH))
    setStarted(true)
    setIdx(0)
    setSelectedIndex(null)
    setRevealed(false)
    setAnswers([])
    setDone(null)
  }

  const current = questions[idx]
  const isLast  = idx === questions.length - 1

  const handleSelect = (chosenIndex: number) => {
    if (revealed || !current) return
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
    if (!current) return
    if (isLast) {
      const bools  = answers.map(a => a.correct)
      const result = scoreSession(current.categoryId, current.difficulty, bools, startedAt)
      setDone(result)
      onSessionComplete(result)
      return
    }
    setIdx(i => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
  }

  const exitSession = () => {
    setStarted(false)
    setDone(null)
    setShowTheory(false)
  }

  // ── Theory intro ─────────────────────────────────────────────────────────
  if (showTheory) {
    const entry = CATEGORY_THEORY['_daily']!
    return <TheoryIntro entry={entry} isHe={isHe} onStart={handleTheoryDone} />
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  if (done) {
    const cat = getCategory(done.categoryId)
    if (!cat) return null
    return (
      <SessionSummary
        result={done}
        category={cat}
        answers={answers}
        onExit={exitSession}
        isHe={isHe}
      />
    )
  }

  // ── Active session ────────────────────────────────────────────────────────
  if (started && current) {
    const progressPct = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
    return (
      <div className="fm-runner">
        <div className="fm-runner-top">
          <button
            onClick={exitSession}
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
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, textAlign: 'center', fontFamily: 'var(--fm-font-display)' }}>
              {isHe ? 'האתגר היומי' : 'Daily Challenge'}
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

  // ── Landing — centered, minimal ───────────────────────────────────────────
  const noHearts = hearts && hearts.current === 0

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '0 24px',
    }}>
      <div style={{
        fontFamily: 'var(--fm-font-display)',
        fontSize: 11, fontWeight: 600,
        color: 'var(--fm-primary)',
        textTransform: 'uppercase', letterSpacing: '0.2em',
        marginBottom: 12,
      }}>
        {isHe ? 'האתגר היומי' : 'Daily Challenge'}
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--fm-text)', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
        {isHe ? 'מוכן לאתגר?' : "Ready for today's challenge?"}
      </h1>

      <p style={{ fontSize: 15, color: 'var(--fm-text-muted)', lineHeight: 1.65, margin: '0 0 40px', maxWidth: 400 }}>
        {isHe
          ? `${DAILY_LENGTH} שאלות מעורבות מכל הקטגוריות, מותאמות לנקודות החולשה שלך. בערך 5 דקות.`
          : `${DAILY_LENGTH} mixed questions across every category, weighted toward your weak spots. About 5 minutes.`}
      </p>

      {noHearts ? (
        <div style={{
          padding: '18px 24px', borderRadius: 14,
          background: 'var(--fm-bg-card)', border: '1px solid var(--fm-border)',
          fontSize: 14, color: 'var(--fm-text-muted)', maxWidth: 340,
          boxShadow: '0 3px 0 0 var(--fm-border)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--fm-coral)" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {isHe ? 'אזלו הלבבות. המתן לטעינה מחדש כדי להמשיך.' : 'Out of hearts. Wait for a refill to continue.'}
          </span>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <TactileButton fullWidth onClick={handleStart} disabled={available.length === 0}>
            {isHe ? 'התחל' : 'Start'}
          </TactileButton>
        </div>
      )}
    </div>
  )
}

function buildMixedSession(progress: Record<CategoryId, CategoryProgress>, length: number): Question[] {
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  if (available.length === 0) return []
  const weights     = available.map(c => 1 + (1 - (progress[c.id]?.bestAccuracy ?? 0)))
  const totalWeight = weights.reduce((s, w) => s + w, 0)
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
