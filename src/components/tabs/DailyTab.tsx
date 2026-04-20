import { useMemo, useState, useEffect } from 'react'
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
import { getTreeWithStatus, findNextNode } from '../../lib/skilltree/treeEngine'
import type { HeartsState } from '../../lib/gamification/hearts'

interface Props {
  progress: Record<CategoryId, CategoryProgress>
  onSessionComplete: (result: SessionResult) => void
  hearts?: HeartsState
  onWrongAnswer?: () => void
}

const DAILY_LENGTH   = 10
const DAILY_DONE_KEY = 'fm_daily_done_v1'

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}
function isDailyDone() {
  return localStorage.getItem(DAILY_DONE_KEY) === getTodayStr()
}
function markDailyDone() {
  localStorage.setItem(DAILY_DONE_KEY, getTodayStr())
}

export default function DailyTab({ progress, onSessionComplete, hearts, onWrongAnswer }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  // ── Focus node from skill tree ──────────────────────────────────────────
  const focusNode = useMemo(() => {
    const nodes = getTreeWithStatus()
    return findNextNode(nodes) ?? null
  }, [])

  const [dailyDone, setDailyDone] = useState(() => isDailyDone())

  // ── Session state ────────────────────────────────────────────────────────
  const [mode, setMode]           = useState<'landing' | 'focus' | 'mixed'>('landing')
  const [showTheory, setShowTheory] = useState(false)
  const [started, setStarted]     = useState(false)
  const [idx, setIdx]             = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed]   = useState(false)
  const [answers, setAnswers]     = useState<AnsweredQuestion[]>([])
  const [done, setDone]           = useState<SessionResult | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [justLostHeart, setJustLostHeart] = useState(false)

  const startedAt = useMemo(() => Date.now(), [started])

  useEffect(() => {
    if (!started) return
    if (mode === 'mixed') {
      setQuestions(buildMixedSession(progress, DAILY_LENGTH))
    } else if (mode === 'focus' && focusNode) {
      const cat = getCategory(focusNode.categoryId)
      if (cat?.generator) {
        const qs: Question[] = Array.from({ length: 10 }, () =>
          cat.generator!(focusNode.difficulty)
        )
        setQuestions(qs)
      }
    }
  }, [started])

  const handleStart = (m: 'focus' | 'mixed') => {
    setMode(m)
    if (m === 'mixed') {
      setShowTheory(true)
    } else {
      setStarted(true)
      setIdx(0)
      setSelectedIndex(null)
      setRevealed(false)
      setAnswers([])
      setDone(null)
    }
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
      const catId  = mode === 'focus' && focusNode ? focusNode.categoryId : current.categoryId
      const diff   = mode === 'focus' && focusNode ? focusNode.difficulty  : current.difficulty
      const result = scoreSession(catId, diff, bools, startedAt)
      setDone(result)
      onSessionComplete(result)
      if (mode === 'mixed') { markDailyDone(); setDailyDone(true) }
      return
    }
    setIdx(i => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
  }

  const exitSession = () => {
    setStarted(false)
    setMode('landing')
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
    const catId = mode === 'focus' && focusNode ? focusNode.categoryId : done.categoryId
    const cat   = getCategory(catId)
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
    const sessionLabel = mode === 'focus' && focusNode
      ? (isHe ? focusNode.titleHe : focusNode.titleEn)
      : (isHe ? 'האתגר היומי' : 'Daily Challenge')

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
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, textAlign: 'center' }}>
              {sessionLabel}
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

  // ── Landing ───────────────────────────────────────────────────────────────
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)

  return (
    <div className="fm-page" style={{ maxWidth: 520, paddingTop: 32 }}>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, textAlign: 'center' }}>
        {isHe ? 'האתגר היומי' : 'Daily Challenge'}
      </div>

      {/* ── Today's Focus (next skill tree node) ─── */}
      {focusNode && (
        <div style={{
          background: 'var(--fm-bg-card)',
          border: '2px solid var(--fm-primary)',
          borderRadius: 16, padding: '20px 20px 18px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            {isHe ? '🎯 הצעד הבא שלך' : '🎯 Your next step'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'var(--fm-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d={focusNode.icon} />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--fm-text)' }}>
                {isHe ? focusNode.titleHe : focusNode.titleEn}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>
                {isHe ? focusNode.descHe : focusNode.descEn}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleStart('focus')}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 10,
              background: 'var(--fm-primary)', color: 'white',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none',
            }}
          >
            {isHe ? 'התחל אתגר זה' : 'Start this challenge'}
          </button>
        </div>
      )}

      {/* ── Mixed daily ─── */}
      <div style={{
        background: 'var(--fm-bg-card)',
        border: `1px solid ${dailyDone ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
        borderRadius: 16, padding: '20px 20px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--fm-text)' }}>
            {isHe ? 'תרגול מעורב' : 'Mixed Practice'}
          </div>
          {dailyDone && (
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'var(--fm-primary)',
              background: 'rgba(88,204,2,0.1)', border: '1px solid var(--fm-primary)',
              borderRadius: 20, padding: '2px 10px',
            }}>
              {isHe ? '✓ הושלם היום' : '✓ Done today'}
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--fm-text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
          {isHe
            ? `${DAILY_LENGTH} שאלות מכל הקטגוריות, מותאמות לנקודות החולשה שלך`
            : `${DAILY_LENGTH} questions across all categories, weighted toward your weak spots`}
        </p>
        <button
          onClick={() => handleStart('mixed')}
          disabled={available.length === 0}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 10,
            background: dailyDone ? 'var(--fm-bg-deep)' : 'var(--fm-bg-deep)',
            color: dailyDone ? 'var(--fm-primary)' : 'var(--fm-text)',
            border: `1px solid ${dailyDone ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
            fontSize: 14, fontWeight: 700,
            cursor: available.length === 0 ? 'not-allowed' : 'pointer',
            opacity: available.length === 0 ? 0.5 : 1,
          }}
        >
          {dailyDone
            ? (isHe ? 'שחק שוב' : 'Play again')
            : (isHe ? 'התחל' : 'Start')}
        </button>
      </div>
    </div>
  )
}

// Weighted mix: categories with lower best-accuracy get more questions.
function buildMixedSession(progress: Record<CategoryId, CategoryProgress>, length: number): Question[] {
  const available = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  if (available.length === 0) return []

  const weights    = available.map(c => 1 + (1 - (progress[c.id]?.bestAccuracy ?? 0)))
  const totalWeight = weights.reduce((s, w) => s + w, 0)
  const diffs: Difficulty[] = ['easy', 'medium', 'hard']

  const questions: Question[] = []
  for (let i = 0; i < length; i++) {
    let r    = Math.random() * totalWeight
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
