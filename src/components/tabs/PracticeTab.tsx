import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, Difficulty, Question } from '../../lib/challenges/types'
import { CATEGORIES, getCategory } from '../../lib/challenges/categories'
import QuestionCard from '../challenges/QuestionCard'
import FeedbackPanel from '../challenges/FeedbackPanel'
import TactileButton from '../ui/TactileButton'
import type { HeartsState } from '../../lib/gamification/hearts'

// ── Persist practice session state so user can resume ────────────────────────
const RESUME_KEY = 'fm_practice_resume_v1'

interface ResumeState {
  filter: CategoryId | 'all'
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

  // Core theory categories (non-genre)
  const available = useMemo(
    () => CATEGORIES.filter(c => c.phase === 1 && c.generator && !c.id.startsWith('genre_')),
    [],
  )

  // Genre categories
  const genreCategories = useMemo(
    () => CATEGORIES.filter(c => c.id.startsWith('genre_') && c.generator),
    [],
  )

  const [filter, setFilter]     = useState<CategoryId | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [running, setRunning]   = useState(false)
  const [current, setCurrent]   = useState<Question | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [streak, setStreak]     = useState(0)
  const [seen, setSeen]         = useState(0)

  const [resumeData, setResumeData] = useState<ResumeState | null>(null)
  const [showResumePrompt, setShowResumePrompt] = useState(false)

  useEffect(() => {
    const saved = loadResume()
    if (saved && saved.seen > 0) setResumeData(saved)
  }, [])

  const pickNextCategory = (f: CategoryId | 'all' = filter, pool = available) => {
    const cats = f === 'all' ? pool : pool.filter(c => c.id === f)
    if (cats.length === 0) return null
    return cats[Math.floor(Math.random() * cats.length)]
  }

  const nextQuestion = (f: CategoryId | 'all' = filter, d: Difficulty = difficulty, pool = available) => {
    const cat = pickNextCategory(f, pool)
    if (!cat || !cat.generator) return
    setCurrent(cat.generator(d))
    setSelectedIndex(null)
    setRevealed(false)
  }

  const startFresh = (
    f: CategoryId | 'all' = filter,
    d: Difficulty = difficulty,
    pool = available,
  ) => {
    clearResume()
    setResumeData(null)
    setShowResumePrompt(false)
    setStreak(0)
    setSeen(0)
    setFilter(f)
    setDifficulty(d)
    setRunning(true)
    const cat = pickNextCategory(f, pool)
    if (cat && cat.generator) setCurrent(cat.generator(d))
  }

  /** Launch a genre session directly (bypasses difficulty selection) */
  const startGenre = (categoryId: CategoryId, d: Difficulty = 'easy') => {
    clearResume()
    setResumeData(null)
    setShowResumePrompt(false)
    setStreak(0)
    setSeen(0)
    setFilter(categoryId)
    setDifficulty(d)
    setRunning(true)
    const genreCats = CATEGORIES.filter(c => c.id === categoryId && c.generator)
    const cat = genreCats[0]
    if (cat && cat.generator) setCurrent(cat.generator(d))
  }

  const handleStart = () => {
    if (resumeData && resumeData.filter === filter && resumeData.difficulty === difficulty) {
      setShowResumePrompt(true)
      return
    }
    startFresh()
  }

  const handleResume = () => {
    if (!resumeData) return
    setFilter(resumeData.filter)
    setDifficulty(resumeData.difficulty)
    setStreak(resumeData.streak)
    setSeen(resumeData.seen)
    setShowResumePrompt(false)
    setRunning(true)
    nextQuestion(resumeData.filter, resumeData.difficulty, CATEGORIES.filter(c => c.phase === 1 && c.generator))
  }

  const handleSelect = (chosenIndex: number) => {
    if (revealed || !current) return
    const correct = chosenIndex === current.correctIndex
    setSelectedIndex(chosenIndex)
    setRevealed(true)
    if (!correct) onWrongAnswer?.()
    const newStreak = correct ? streak + 1 : 0
    const newSeen   = seen + 1
    setStreak(newStreak)
    setSeen(newSeen)
    saveResume({ filter, difficulty, streak: newStreak, seen: newSeen })
  }

  const handleClose = () => {
    setRunning(false)
    setCurrent(null)
  }

  // ── Resume prompt modal ───────────────────────────────────────────────────
  if (showResumePrompt && resumeData) {
    const catEntry = CATEGORIES.find(a => a.id === resumeData.filter)
    const catLabel = resumeData.filter === 'all'
      ? (isHe ? 'הכל' : 'All categories')
      : catEntry ? (isHe ? catEntry.titleHe : catEntry.titleEn) : resumeData.filter

    return (
      <div className="fm-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏸️</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--fm-text)', margin: '0 0 10px' }}>
          {isHe ? 'יש סשן שמור' : 'You have a saved session'}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fm-text-muted)', margin: '0 0 8px', lineHeight: 1.6 }}>
          {isHe
            ? `קטגוריה: ${catLabel} · רמה: ${diffLabel(resumeData.difficulty, true)}`
            : `Category: ${catLabel} · Level: ${diffLabel(resumeData.difficulty, false)}`}
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

  // ── Active state ─────────────────────────────────────────────────────────
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
                onNext={() => nextQuestion(filter, difficulty, CATEGORIES.filter(c => c.phase === 1 && c.generator))}
                isLast={false}
                isHe={isHe}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Landing ──────────────────────────────────────────────────────────────
  return (
    <div className="fm-page">
      <div className="fm-page-header" style={{ textAlign: isHe ? 'right' : 'left' }}>
        <div className="fm-page-eyebrow">{isHe ? 'תרגול חופשי' : 'Free Practice'}</div>
        <h1 className="fm-page-title">{isHe ? 'תרגל בלי לחץ' : 'Practice without pressure'}</h1>
        <p className="fm-page-subtitle">
          {isHe
            ? 'בלי טיימר, בלי ניקוד, בלי כוכבים. בחר קטגוריה ורמה — תתרגל כמה שתרצה.'
            : 'No timer, no scoring, no stars. Pick a category and level — drill as long as you want.'}
        </p>
      </div>

      {/* Resume banner */}
      {resumeData && resumeData.seen > 0 && !(resumeData.filter === filter && resumeData.difficulty === difficulty) && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 16,
          background: 'var(--fm-primary-bg)', border: '1px solid var(--fm-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ fontSize: 13, color: 'var(--fm-primary)', fontWeight: 600 }}>
            {isHe
              ? `סשן שמור: ${resumeData.seen} שאלות, רצף ${resumeData.streak}`
              : `Saved session: ${resumeData.seen} questions, streak ${resumeData.streak}`}
          </div>
          <button
            onClick={() => {
              setFilter(resumeData.filter)
              setDifficulty(resumeData.difficulty)
            }}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: 'var(--fm-primary)', color: 'white', cursor: 'pointer', flexShrink: 0,
            }}
          >
            {isHe ? 'טען' : 'Load'}
          </button>
        </div>
      )}

      {/* ── Core Theory ─────────────────────────────────────────────────── */}
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
        display: 'inline-block',
        marginBottom: 16,
      }}>
        {isHe ? 'תיאוריה בסיסית' : 'Core Theory'}
      </div>

      <div className="fm-card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, textAlign: isHe ? 'right' : 'left' }}>
          {isHe ? 'קטגוריה' : 'Category'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: isHe ? 'flex-end' : 'flex-start' }}>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
            {isHe ? 'הכל' : 'All'}
          </FilterChip>
          {available.map(c => (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
              {isHe ? c.titleHe : c.titleEn}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="fm-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, textAlign: isHe ? 'right' : 'left' }}>
          {isHe ? 'רמת קושי' : 'Difficulty'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: isHe ? 'flex-end' : 'flex-start' }}>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <FilterChip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
              {diffLabel(d, isHe)}
            </FilterChip>
          ))}
        </div>
      </div>

      <TactileButton variant="primary" fullWidth onClick={handleStart}>
        {resumeData && resumeData.filter === filter && resumeData.difficulty === difficulty
          ? (isHe ? '▶ המשך / התחל' : '▶ Continue / Start')
          : (isHe ? 'התחל תרגול' : 'Start practice')}
      </TactileButton>

      {/* ── Genre Theory Section ─────────────────────────────────────────── */}
      <div style={{ marginTop: 40 }}>
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
          display: 'inline-block',
          marginBottom: 16,
        }}>
          {isHe ? 'תיאוריית ז׳אנר' : 'Genre Theory'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginBottom: 16, lineHeight: 1.6, textAlign: isHe ? 'right' : 'left' }}>
          {isHe
            ? 'תרגל תיאוריה ספציפית לז׳אנר — בחר ז׳אנר ורמת קושי ותתחיל.'
            : 'Drill genre-specific theory — choose a genre and difficulty level to start.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {genreCategories.map(cat => (
            <GenreCard
              key={cat.id}
              titleHe={cat.titleHe}
              titleEn={cat.titleEn}
              descHe={cat.descHe}
              descEn={cat.descEn}
              icon={cat.icon}
              isHe={isHe}
              onStart={(d) => startGenre(cat.id as CategoryId, d)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Genre card ────────────────────────────────────────────────────────────────

function GenreCard({
  titleHe, titleEn, descHe, descEn, icon, isHe, onStart,
}: {
  titleHe: string; titleEn: string; descHe: string; descEn: string
  icon: string; isHe: boolean
  onStart: (d: Difficulty) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="fm-card"
      style={{
        padding: 16,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        direction: isHe ? 'rtl' : 'ltr',
        textAlign: isHe ? 'right' : 'left',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: 'var(--fm-primary-bg)', border: '1px solid var(--fm-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--fm-primary)">
            <path d={icon} />
          </svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text)', lineHeight: 1.2 }}>
          {isHe ? titleHe : titleEn}
        </div>
      </div>

      {!expanded && (
        <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', lineHeight: 1.5 }}>
          {isHe ? descHe : descEn}
        </div>
      )}

      {expanded && (
        <div
          style={{ animation: 'fm-fade-in 0.15s ease' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
            {isHe ? descHe : descEn}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => onStart(d)}
                style={{
                  flex: 1, padding: '7px 4px', borderRadius: 8,
                  background: 'var(--fm-primary)', color: 'white',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 3px 0 0 var(--fm-primary-shadow)',
                  transition: 'transform 0.08s, box-shadow 0.08s',
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'translateY(3px)'
                  e.currentTarget.style.boxShadow = '0 0 0 0 transparent'
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '0 3px 0 0 var(--fm-primary-shadow)'
                }}
              >
                {diffLabel(d, isHe)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 999,
        border: `1.5px solid ${active ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
        background: active ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        color: active ? 'var(--fm-primary)' : 'var(--fm-text)',
        fontSize: 13,
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
