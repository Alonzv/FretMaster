import type { SessionResult } from '../../lib/challenges/types'
import type { CategoryEntry } from '../../lib/challenges/categories'
import type { AnsweredQuestion } from './ChallengeRunner'
import TheoryText from './TheoryText'

interface Props {
  result: SessionResult
  category: CategoryEntry
  answers: AnsweredQuestion[]
  onExit: () => void
  isHe: boolean
}

// End-of-session card: stars, accuracy, XP, and a review of every wrong answer with
// the correct choice + explanation so the user actually learns from their mistakes.
export default function SessionSummary({ result, category, answers, onExit, isHe }: Props) {
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
  const mistakes = answers.filter(a => !a.correct)

  return (
    <div className="fm-runner">
      <div className="fm-runner-body" style={{ alignItems: 'flex-start' }}>
        <div className="fm-runner-content">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              {isHe ? 'סשן הושלם' : 'Session complete'}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fm-text)', margin: '0 0 32px', letterSpacing: '-0.5px' }}>
              {isHe ? category.titleHe : category.titleEn}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
              {[1, 2, 3].map(n => {
                const filled = n <= result.stars
                return (
                  <svg key={n} width="44" height="44" viewBox="0 0 24 24" fill={filled ? 'var(--fm-primary)' : 'var(--fm-border)'}>
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
              <StatBlock label={isHe ? 'דיוק' : 'Accuracy'} value={`${accuracy}%`} />
              <StatBlock label={isHe ? 'תשובות נכונות' : 'Correct answers'} value={`${result.correct}/${result.total}`} />
              <StatBlock label={isHe ? 'XP' : 'XP'} value={`+${result.xpEarned}`} highlight />
            </div>
          </div>

          {/* Mistake review */}
          {mistakes.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, textAlign: isHe ? 'right' : 'left' }}>
                {isHe ? `בוא נעבור על הטעויות (${mistakes.length})` : `Let's review the mistakes (${mistakes.length})`}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mistakes.map((m, i) => {
                  const chosen  = m.question.choices[m.chosenIndex]
                  const correct = m.question.choices[m.question.correctIndex]
                  return (
                    <div
                      key={i}
                      style={{
                        padding: 18,
                        borderRadius: 14,
                        background: 'var(--fm-bg-card)',
                        border: '1px solid var(--fm-border)',
                        textAlign: isHe ? 'right' : 'left',
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
                          <span style={{ color: 'var(--fm-text-muted)' }}>
                            {isHe ? 'הבחירה שלך:' : 'You chose:'}
                          </span>
                          <span style={{ color: 'var(--fm-coral)', fontWeight: 700 }}>
                            {isHe ? chosen.he : chosen.en}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--fm-secondary)" style={{ flexShrink: 0 }}>
                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          <span style={{ color: 'var(--fm-text-muted)' }}>
                            {isHe ? 'התשובה הנכונה:' : 'Correct answer:'}
                          </span>
                          <span style={{ color: 'var(--fm-secondary)', fontWeight: 700 }}>
                            {isHe ? correct.he : correct.en}
                          </span>
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

          {mistakes.length === 0 && (
            <div style={{
              padding: 20, marginBottom: 32,
              textAlign: 'center',
              borderRadius: 14,
              background: 'var(--fm-secondary-bg)',
              border: '1px solid var(--fm-secondary)',
              color: 'var(--fm-secondary)',
              fontSize: 14,
              fontWeight: 600,
            }}>
              {isHe ? 'סשן מושלם — בלי שום טעות' : 'Perfect session — no mistakes'}
            </div>
          )}

          <button
            onClick={onExit}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 12,
              background: 'var(--fm-primary)', color: 'white',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.filter = '')}
          >
            {isHe ? 'חזרה' : 'Back'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        padding: '14px 8px', borderRadius: 12,
        background: highlight ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        border: `1px solid ${highlight ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: highlight ? 'var(--fm-primary)' : 'var(--fm-text)', marginTop: 4 }}>
        {value}
      </div>
    </div>
  )
}
