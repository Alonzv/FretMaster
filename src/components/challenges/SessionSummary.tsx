import { useEffect, useState } from 'react'
import type { SessionResult } from '../../lib/challenges/types'
import type { CategoryEntry } from '../../lib/challenges/categories'
import type { AnsweredQuestion } from './ChallengeRunner'
import TheoryText from './TheoryText'
import { celebrateConfetti, spawnXPParticle } from '../../lib/animations'

interface Props {
  result: SessionResult
  category: CategoryEntry
  answers: AnsweredQuestion[]
  onExit: () => void
  isHe: boolean
}

export default function SessionSummary({ result, category, answers, onExit, isHe }: Props) {
  const accuracy  = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
  const mistakes  = answers.filter(a => !a.correct)
  const [starsShown, setStarsShown] = useState(0)
  const [xpPopped, setXpPopped]     = useState(false)

  // Animate stars in one-by-one, then confetti if ≥2 stars
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= result.stars; i++) {
      timers.push(setTimeout(() => setStarsShown(i), i * 200 + 100))
    }
    if (result.stars >= 2) {
      timers.push(setTimeout(() => celebrateConfetti(result.stars === 3 ? 100 : 60), 800))
    }
    timers.push(setTimeout(() => setXpPopped(true), result.stars * 200 + 400))
    return () => timers.forEach(clearTimeout)
  }, [result.stars])

  // Spawn XP particle near the XP stat block when it becomes visible
  const handleXpRef = (el: HTMLDivElement | null) => {
    if (!el || xpPopped) return
    const rect = el.getBoundingClientRect()
    setTimeout(() => spawnXPParticle(rect.left + rect.width / 2, rect.top, result.xpEarned), 20)
  }

  return (
    <div className="fm-runner">
      <div className="fm-runner-body" style={{ alignItems: 'flex-start' }}>
        <div className="fm-runner-content">
          <div style={{ textAlign: 'center', animation: 'fm-fade-in 0.35s ease' }}>

            {/* Eyebrow */}
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--fm-primary)',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 8,
              fontFamily: 'var(--fm-font-display)',
            }}>
              {isHe ? '🎉 סשן הושלם!' : '🎉 Session complete!'}
            </div>

            {/* Category title */}
            <h1 style={{
              fontSize: 28, fontWeight: 900, color: 'var(--fm-text)',
              margin: '0 0 28px', letterSpacing: '-0.5px',
              fontFamily: 'var(--fm-font-display)',
            }}>
              {isHe ? category.titleHe : category.titleEn}
            </h1>

            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
              {[1, 2, 3].map(n => (
                <div
                  key={n}
                  style={{
                    animation: n <= starsShown ? 'fm-star-pop 0.4s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                    opacity: n <= starsShown ? 1 : 0.18,
                    transform: n <= starsShown ? 'scale(1)' : 'scale(0.5)',
                    transition: 'opacity 0.2s, transform 0.2s',
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24"
                    fill={n <= result.stars ? 'var(--fm-primary)' : 'var(--fm-border)'}
                    style={{ filter: n <= result.stars ? 'drop-shadow(0 2px 6px var(--fm-primary-glow))' : 'none' }}
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
              <StatBlock label={isHe ? 'דיוק' : 'Accuracy'} value={`${accuracy}%`} />
              <StatBlock
                label={isHe ? 'נכונות' : 'Correct'}
                value={`${result.correct}/${result.total}`}
              />
              <StatBlock
                label="XP"
                value={`+${result.xpEarned}`}
                highlight
                refCallback={xpPopped ? undefined : handleXpRef}
              />
            </div>

            {/* Perfect session badge */}
            {mistakes.length === 0 && (
              <div style={{
                padding: '14px 20px', marginBottom: 24,
                borderRadius: 14,
                background: 'var(--fm-secondary-bg)',
                border: '1px solid var(--fm-secondary)',
                color: 'var(--fm-secondary)',
                fontSize: 15, fontWeight: 700,
                animation: 'fm-bounce-in 0.4s cubic-bezier(0.22,1,0.36,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                🏆 {isHe ? 'סשן מושלם — אפס טעויות!' : 'Perfect session — no mistakes!'}
              </div>
            )}
          </div>

          {/* Mistake review */}
          {mistakes.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 14, textAlign: isHe ? 'right' : 'left',
              }}>
                {isHe ? `סקירת טעויות (${mistakes.length})` : `Mistake review (${mistakes.length})`}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mistakes.map((m, i) => {
                  const chosen  = m.question.choices[m.chosenIndex]
                  const correct = m.question.choices[m.question.correctIndex]
                  return (
                    <div
                      key={i}
                      style={{
                        padding: 18, borderRadius: 14,
                        background: 'var(--fm-bg-card)',
                        border: '1px solid var(--fm-border)',
                        textAlign: isHe ? 'right' : 'left',
                        animation: `fm-stagger-in 0.3s ease ${i * 0.06}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 10 }}>
                        <TheoryText text={isHe ? m.question.prompt.he : m.question.prompt.en} isHe={isHe} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--fm-coral)" style={{ flexShrink: 0 }}>
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                          <span style={{ color: 'var(--fm-text-muted)' }}>{isHe ? 'בחרת:' : 'You chose:'}</span>
                          <span style={{ color: 'var(--fm-coral)', fontWeight: 700 }}>{isHe ? chosen.he : chosen.en}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--fm-secondary)" style={{ flexShrink: 0 }}>
                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          <span style={{ color: 'var(--fm-text-muted)' }}>{isHe ? 'נכון:' : 'Correct:'}</span>
                          <span style={{ color: 'var(--fm-secondary)', fontWeight: 700 }}>{isHe ? correct.he : correct.en}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fm-text)' }}>
                        <TheoryText text={isHe ? m.question.explanation.he : m.question.explanation.en} isHe={isHe} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Exit button */}
          <button
            onClick={onExit}
            style={{
              width: '100%', padding: '15px 20px', borderRadius: 14,
              background: 'var(--fm-primary)', color: 'white',
              fontSize: 17, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 5px 0 0 var(--fm-primary-shadow)',
              transform: 'translateY(0)',
              transition: 'transform 0.09s, box-shadow 0.09s, filter 0.12s',
              letterSpacing: '-0.1px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter = 'brightness(1.08)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 7px 0 0 var(--fm-primary-shadow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = ''
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 5px 0 0 var(--fm-primary-shadow)'
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translateY(5px)'
              e.currentTarget.style.boxShadow = '0 0 0 0 var(--fm-primary-shadow)'
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 5px 0 0 var(--fm-primary-shadow)'
            }}
          >
            {isHe ? '← חזרה' : 'Back →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stat block ─────────────────────────────────────────────────────────────────
function StatBlock({
  label, value, highlight, refCallback,
}: {
  label: string
  value: string
  highlight?: boolean
  refCallback?: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={refCallback}
      style={{
        padding: '14px 8px', borderRadius: 12,
        background: highlight ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        border: `1.5px solid ${highlight ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
        animation: highlight ? 'fm-glow-pulse 2s ease-in-out infinite' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {highlight && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(143,173,121,0.2), transparent)',
          animation: 'fm-xp-shine 2.5s ease-in-out infinite',
        }} />
      )}
      <div style={{
        fontSize: 11, fontWeight: 600,
        color: 'var(--fm-text-muted)',
        textTransform: 'uppercase', letterSpacing: 0.5,
        position: 'relative',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 24, fontWeight: 900,
        color: highlight ? 'var(--fm-primary)' : 'var(--fm-text)',
        marginTop: 4,
        fontFamily: highlight ? 'var(--fm-font-display)' : 'inherit',
        position: 'relative',
      }}>
        {value}
      </div>
    </div>
  )
}
