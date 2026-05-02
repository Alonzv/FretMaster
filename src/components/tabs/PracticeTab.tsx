import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Difficulty, Question } from '../../lib/challenges/types'
import { CATEGORIES, getCategory } from '../../lib/challenges/categories'
import QuestionCard from '../challenges/QuestionCard'
import FeedbackPanel from '../challenges/FeedbackPanel'
import TactileButton from '../ui/TactileButton'
import type { HeartsState } from '../../lib/gamification/hearts'

// ── Persist practice session state ───────────────────────────────────────────
const RESUME_KEY = 'fm_practice_resume_v2'

interface ResumeState {
  selectedIds: string[]
  difficulty: Difficulty
  seen: number
  streak: number
}

function saveResume(s: ResumeState) {
  localStorage.setItem(RESUME_KEY, JSON.stringify(s))
}

function loadResume(): ResumeState | null {
  try {
    const raw = localStorage.getItem(RESUME_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearResume() {
  localStorage.removeItem(RESUME_KEY)
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  hearts?: HeartsState
  onWrongAnswer?: () => void
}

export default function PracticeTab({ hearts: _hearts, onWrongAnswer }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const basicCats = useMemo(
    () => CATEGORIES.filter(c => c.phase === 1 && c.generator && !c.id.startsWith('genre_')),
    [],
  )
  const genreCats = useMemo(
    () => CATEGORIES.filter(c => c.id.startsWith('genre_') && c.generator),
    [],
  )
  const allCats = useMemo(() => [...basicCats, ...genreCats], [basicCats, genreCats])

  // Multi-select: empty set = "all"
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [difficulty, setDifficulty]   = useState<Difficulty>('easy')
  const [running, setRunning]         = useState(false)
  const [current, setCurrent]         = useState<Question | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed]       = useState(false)
  const [streak, setStreak]           = useState(0)
  const [seen, setSeen]               = useState(0)
  const [resumeData, setResumeData]   = useState<ResumeState | null>(null)
  const [showResumePrompt, setShowResumePrompt] = useState(false)

  useEffect(() => {
    const saved = loadResume()
    if (saved && saved.seen > 0) setResumeData(saved)
  }, [])

  function toggleTopic(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelectedIds(new Set())
  }

  function pool(ids: Set<string> = selectedIds) {
    return ids.size === 0 ? allCats : allCats.filter(c => ids.has(c.id))
  }

  function pickCat(ids: Set<string> = selectedIds) {
    const p = pool(ids)
    if (p.length === 0) return null
    return p[Math.floor(Math.random() * p.length)]
  }

  function nextQuestion(ids: Set<string> = selectedIds, d: Difficulty = difficulty) {
    const cat = pickCat(ids)
    if (!cat || !cat.generator) return
    setCurrent(cat.generator(d))
    setSelectedIndex(null)
    setRevealed(false)
  }

  function startFresh(ids: Set<string> = selectedIds, d: Difficulty = difficulty) {
    clearResume()
    setResumeData(null)
    setShowResumePrompt(false)
    setStreak(0)
    setSeen(0)
    setRunning(true)
    const cat = pickCat(ids)
    if (cat && cat.generator) setCurrent(cat.generator(d))
  }

  function idsMatch(a: Set<string>, b: string[]): boolean {
    if (a.size !== b.length) return false
    return b.every(id => a.has(id))
  }

  function handleStart() {
    if (resumeData && resumeData.difficulty === difficulty && idsMatch(selectedIds, resumeData.selectedIds)) {
      setShowResumePrompt(true)
      return
    }
    startFresh()
  }

  function handleResume() {
    if (!resumeData) return
    const ids = new Set(resumeData.selectedIds)
    setSelectedIds(ids)
    setDifficulty(resumeData.difficulty)
    setStreak(resumeData.streak)
    setSeen(resumeData.seen)
    setShowResumePrompt(false)
    setRunning(true)
    nextQuestion(ids, resumeData.difficulty)
  }

  function handleSelect(chosenIndex: number) {
    if (revealed || !current) return
    const correct = chosenIndex === current.correctIndex
    setSelectedIndex(chosenIndex)
    setRevealed(true)
    if (!correct) onWrongAnswer?.()
    const newStreak = correct ? streak + 1 : 0
    const newSeen   = seen + 1
    setStreak(newStreak)
    setSeen(newSeen)
    saveResume({ selectedIds: [...selectedIds], difficulty, streak: newStreak, seen: newSeen })
  }

  function handleClose() {
    setRunning(false)
    setCurrent(null)
  }

  // ── Resume prompt ─────────────────────────────────────────────────────────
  if (showResumePrompt && resumeData) {
    const count = resumeData.selectedIds.length
    const catLabel = count === 0
      ? (isHe ? 'הכל' : 'All categories')
      : resumeData.selectedIds
          .map(id => {
            const c = CATEGORIES.find(x => x.id === id)
            return c ? (isHe ? c.titleHe : c.titleEn) : id
          })
          .join(', ')

    return (
      <div className="fm-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--fm-text)', margin: '0 0 10px' }}>
          {isHe ? 'יש סשן שמור' : 'You have a saved session'}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fm-text-muted)', margin: '0 0 8px', lineHeight: 1.6 }}>
          {isHe
            ? `נושאים: ${catLabel} · רמה: ${diffLabel(resumeData.difficulty, true)}`
            : `Topics: ${catLabel} · Level: ${diffLabel(resumeData.difficulty, false)}`}
        </p>
        <p style={{ fontSize: 14, color: 'var(--fm-text-muted)', margin: '0 0 32px', lineHeight: 1.6 }}>
          {isHe
            ? `נענו ${resumeData.seen} שאלות · רצף: ${resumeData.streak}`
            : `${resumeData.seen} questions answered · Streak: ${resumeData.streak}`}
        </p>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column', width: '100%', maxWidth: 320 }}>
          <TactileButton variant="primary" fullWidth onClick={handleResume}>
            {isHe ? 'המשך מאיפה שעצרתי' : 'Resume where I left off'}
          </TactileButton>
          <TactileButton variant="ghost" fullWidth onClick={() => startFresh()}>
            {isHe ? 'התחל מהתחלה' : 'Start fresh'}
          </TactileButton>
        </div>
      </div>
    )
  }

  // ── Active session ────────────────────────────────────────────────────────
  if (running && current) {
    const cat = getCategory(current.categoryId)
    return (
      <div className="fm-runner">
        <div className="fm-runner-top">
          <button
            onClick={handleClose}
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
          <div style={{ flex: 1, display: 'flex', gap: 18, justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--fm-text-muted)' }}>
            <span>{isHe ? `רצף: ${streak}` : `Streak: ${streak}`}</span>
            <span>·</span>
            <span>{isHe ? `נענו: ${seen}` : `Seen: ${seen}`}</span>
          </div>
          <div style={{ width: 36 }} />
        </div>

        <div className="fm-runner-body">
          <div className="fm-runner-content">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, textAlign: 'center', fontFamily: 'var(--fm-font-display)' }}>
              {isHe ? 'תרגול חופשי' : 'Free Practice'} {cat && `· ${isHe ? cat.titleHe : cat.titleEn}`}
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
                onNext={() => nextQuestion()}
                isLast={false}
                isHe={isHe}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Landing ───────────────────────────────────────────────────────────────
  const resumeBannerVisible = resumeData && resumeData.seen > 0 && !idsMatch(selectedIds, resumeData.selectedIds)

  return (
    <div className="fm-page">
      <div className="fm-page-header" style={{ textAlign: isHe ? 'right' : 'left' }}>
        <div className="fm-page-eyebrow">{isHe ? 'תרגול חופשי' : 'Free Practice'}</div>
        <h1 className="fm-page-title">{isHe ? 'תרגל בלי לחץ' : 'Practice without pressure'}</h1>
        <p className="fm-page-subtitle">
          {isHe
            ? 'בלי טיימר, בלי ניקוד, בלי כוכבים. בחר נושא אחד או כמה — תתרגל כמה שתרצה.'
            : 'No timer, no scoring, no stars. Pick one topic or many — drill as long as you want.'}
        </p>
      </div>

      {/* Resume banner */}
      {resumeBannerVisible && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 16,
          background: 'var(--fm-primary-bg)', border: '1px solid var(--fm-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ fontSize: 13, color: 'var(--fm-primary)', fontWeight: 600 }}>
            {isHe
              ? `סשן שמור: ${resumeData!.seen} שאלות, רצף ${resumeData!.streak}`
              : `Saved session: ${resumeData!.seen} questions, streak ${resumeData!.streak}`}
          </div>
          <button
            onClick={() => {
              const ids = new Set(resumeData!.selectedIds)
              setSelectedIds(ids)
              setDifficulty(resumeData!.difficulty)
            }}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: 'var(--fm-primary)', color: 'white', cursor: 'pointer',
              border: 'none', flexShrink: 0,
            }}
          >
            {isHe ? 'טען' : 'Load'}
          </button>
        </div>
      )}

      {/* ── Section header: badge + difficulty side by side ──────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: isHe ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        {/* Core Theory badge */}
        <div style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 11, fontWeight: 600,
          color: 'var(--fm-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.15em',
          background: 'var(--fm-bg-card)',
          border: '1px solid var(--fm-border-mid)',
          borderRadius: 6,
          padding: '5px 14px',
          boxShadow: '0 2px 0 0 var(--fm-border)',
        }}>
          {isHe ? 'תיאוריה בסיסית' : 'Core Theory'}
        </div>

        {/* Difficulty chips — inline */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: 'var(--fm-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontFamily: 'var(--fm-font-display)',
          }}>
            {isHe ? 'רמה:' : 'Level:'}
          </span>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <FilterChip key={d} active={difficulty === d} onClick={() => setDifficulty(d)} small>
              {diffLabel(d, isHe)}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ── Main card: topic multi-select ──────────────────────────────────── */}
      <div className="fm-card" style={{ padding: 24, marginBottom: 20 }}>
        {/* Basic Theory topics */}
        <div style={{
          fontSize: 12, fontWeight: 700,
          color: 'var(--fm-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 10,
          textAlign: isHe ? 'right' : 'left',
          fontFamily: 'var(--fm-font-display)',
        }}>
          {isHe ? 'נושא — ניתן לבחור כמה' : 'Topic — pick one or many'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', direction: 'ltr', justifyContent: isHe ? 'flex-end' : 'flex-start', marginBottom: 20 }}>
          <FilterChip active={selectedIds.size === 0} onClick={selectAll}>
            {isHe ? 'הכל' : 'All'}
          </FilterChip>
          {basicCats.map(c => (
            <FilterChip
              key={c.id}
              active={selectedIds.has(c.id)}
              onClick={() => toggleTopic(c.id)}
            >
              {isHe ? c.titleHe : c.titleEn}
            </FilterChip>
          ))}
        </div>

        {/* Genre Theory sub-section */}
        <div style={{
          borderTop: '1px solid var(--fm-border)',
          paddingTop: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--fm-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 10,
            textAlign: isHe ? 'right' : 'left',
            fontFamily: 'var(--fm-font-display)',
          }}>
            {isHe ? 'תיאוריית ז׳אנרים' : 'Genre Theory'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', direction: 'ltr', justifyContent: isHe ? 'flex-end' : 'flex-start' }}>
            {genreCats.map(c => (
              <FilterChip
                key={c.id}
                active={selectedIds.has(c.id)}
                onClick={() => toggleTopic(c.id)}
              >
                {isHe ? c.titleHe : c.titleEn}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* ── Start button ──────────────────────────────────────────────────── */}
      <TactileButton variant="primary" fullWidth onClick={handleStart}>
        {resumeData && resumeData.difficulty === difficulty && idsMatch(selectedIds, resumeData.selectedIds)
          ? (isHe ? '▶ המשך / התחל' : '▶ Continue / Start')
          : (isHe ? 'התחל תרגול' : 'Start practice')}
      </TactileButton>
    </div>
  )
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function FilterChip({
  active, onClick, children, small = false,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? '5px 10px' : '8px 14px',
        borderRadius: 999,
        border: `1.5px solid ${active ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
        background: active ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        color: active ? 'var(--fm-primary)' : 'var(--fm-text)',
        fontSize: small ? 12 : 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function diffLabel(d: Difficulty, isHe: boolean): string {
  if (isHe) return d === 'easy' ? 'קל' : d === 'medium' ? 'בינוני' : 'קשה'
  return d === 'easy' ? 'Easy' : d === 'medium' ? 'Med' : 'Hard'
}
