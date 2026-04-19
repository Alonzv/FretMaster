import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, Difficulty, Question } from '../../lib/challenges/types'
import { CATEGORIES, getCategory } from '../../lib/challenges/categories'
import QuestionCard from '../challenges/QuestionCard'
import FeedbackPanel from '../challenges/FeedbackPanel'

// Endless, no-scoring practice. Instant feedback on choice click — drill any category
// (or all of them at once) at any difficulty for as long as you want.
export default function PracticeTab() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const available = useMemo(() => CATEGORIES.filter(c => c.phase === 1 && c.generator), [])

  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [running, setRunning] = useState(false)
  const [current, setCurrent] = useState<Question | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [streak, setStreak] = useState(0)
  const [seen, setSeen] = useState(0)

  const pickNextCategory = () => {
    const pool = filter === 'all' ? available : available.filter(c => c.id === filter)
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const nextQuestion = () => {
    const cat = pickNextCategory()
    if (!cat || !cat.generator) return
    setCurrent(cat.generator(difficulty))
    setSelectedIndex(null)
    setRevealed(false)
  }

  const handleStart = () => {
    setStreak(0)
    setSeen(0)
    setRunning(true)
    const cat = pickNextCategory()
    if (cat && cat.generator) setCurrent(cat.generator(difficulty))
  }

  // Instant feedback — no Check button.
  const handleSelect = (chosenIndex: number) => {
    if (revealed || !current) return
    const correct = chosenIndex === current.correctIndex
    setSelectedIndex(chosenIndex)
    setRevealed(true)
    setStreak(s => correct ? s + 1 : 0)
    setSeen(s => s + 1)
  }

  // ── Active state ─────────────────────────────────────────────────────────
  if (running && current) {
    const cat = getCategory(current.categoryId)
    return (
      <div className="fm-runner">
        <div className="fm-runner-top">
          <button
            onClick={() => { setRunning(false); setCurrent(null) }}
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
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, textAlign: 'center' }}>
              {isHe ? 'תרגול' : 'Practice'} {cat && `· ${isHe ? cat.titleHe : cat.titleEn}`}
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
                onNext={nextQuestion}
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
        <div className="fm-page-eyebrow">{isHe ? 'תרגול' : 'Practice'}</div>
        <h1 className="fm-page-title">{isHe ? 'תרגל בלי לחץ' : 'Practice without pressure'}</h1>
        <p className="fm-page-subtitle">
          {isHe
            ? 'בלי טיימר, בלי ניקוד, בלי כוכבים. בחר קטגוריה ורמה — תתרגל כמה שתרצה.'
            : 'No timer, no scoring, no stars. Pick a category and level — drill as long as you want.'}
        </p>
      </div>

      <div className="fm-card" style={{ padding: 24, marginBottom: 20 }}>
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

      <div className="fm-card" style={{ padding: 24, marginBottom: 24 }}>
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

      <button
        onClick={handleStart}
        style={{
          width: '100%', padding: '14px 20px',
          borderRadius: 12, background: 'var(--fm-primary)', color: 'white',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          transition: 'filter 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.filter = '')}
      >
        {isHe ? 'התחל תרגול' : 'Start practice'}
      </button>
    </div>
  )
}

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
  return d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard'
}
