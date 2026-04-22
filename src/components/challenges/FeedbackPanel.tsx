import { useEffect, useRef } from 'react'
import type { Question } from '../../lib/challenges/types'
import TactileButton from '../ui/TactileButton'
import TheoryButton from './TheoryButton'
import TheoryText from './TheoryText'
import { spawnXPParticle } from '../../lib/animations'

interface Props {
  question: Question
  wasCorrect: boolean
  onNext: () => void
  isLast: boolean
  isHe: boolean
  xpEarned?: number  // optional — shown as particle if correct
}

const CORRECT_HE = ['מעולה!','כל הכבוד!','נכון בול!','אש!','ממש טוב!','בדיוק!','מהיר ומדויק!','גאה בך!','ידעת!','תותח!']
const CORRECT_EN = ['Correct!','Nailed it!','Spot on!','Well done!','Perfect!','Exactly!','Great job!','You got it!','Brilliant!','Nice work!']
const WRONG_HE   = ['לא מדויק','כמעט!','נסה שוב','לא נורא','למד מזה','קרוב!','בפעם הבאה!','לא ידעת הפעם','זה קורה','תמשיך!']
const WRONG_EN   = ['Not quite','Almost!','Try again','Keep going','Learn from it','Close!','Next time!','Missed this one','Happens!','Keep it up!']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export default function FeedbackPanel({ question, wasCorrect, onNext, isLast, isHe, xpEarned }: Props) {
  const correctChoice = question.choices[question.correctIndex]
  const label = wasCorrect
    ? (isHe ? pick(CORRECT_HE) : pick(CORRECT_EN))
    : (isHe ? pick(WRONG_HE)   : pick(WRONG_EN))

  // Spawn XP particle once on correct answer
  const iconRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!wasCorrect || !iconRef.current) return
    const rect = iconRef.current.getBoundingClientRect()
    const amount = xpEarned ?? 20
    // slight delay so the badge has painted
    const t = setTimeout(() => spawnXPParticle(rect.left + rect.width / 2, rect.top, amount), 150)
    return () => clearTimeout(t)
  }, [wasCorrect, xpEarned])

  return (
    <div
      style={{
        marginTop: 28,
        padding: '22px 22px 20px',
        borderRadius: 18,
        background: wasCorrect ? 'var(--fm-secondary-bg)' : 'var(--fm-coral-faint)',
        border: `2px solid ${wasCorrect ? 'var(--fm-secondary)' : 'var(--fm-coral)'}`,
        textAlign: isHe ? 'right' : 'left',
        animation: 'fm-slide-up 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Status row */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {/* Icon badge (ref for XP particle spawn) */}
          <div
            ref={iconRef}
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: wasCorrect ? 'var(--fm-secondary)' : 'var(--fm-coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 3px 0 0 ${wasCorrect ? 'var(--fm-secondary-shadow)' : 'var(--fm-coral-shadow)'}`,
              animation: wasCorrect ? 'fm-heart-pulse 0.5s ease' : 'fm-shake 0.4s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              {wasCorrect
                ? <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                : <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />}
            </svg>
          </div>

          <div>
            <div style={{
              fontSize: 19, fontWeight: 900,
              color: wasCorrect ? 'var(--fm-secondary)' : 'var(--fm-coral)',
              fontFamily: 'var(--fm-font-display)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              animation: wasCorrect ? 'fm-correct-pop 0.3s ease' : 'fm-wrong-shake 0.4s ease',
            }}>
              {label}
            </div>
            {!wasCorrect && (
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 4 }}>
                {isHe ? 'התשובה הנכונה: ' : 'Answer: '}
                <span style={{ fontWeight: 700, color: 'var(--fm-text)' }}>
                  {isHe ? correctChoice.he : correctChoice.en}
                </span>
              </div>
            )}
            {wasCorrect && xpEarned != null && (
              <div style={{
                fontSize: 12, color: 'var(--fm-secondary)', fontWeight: 700, marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span>✨</span>
                <span style={{ fontFamily: 'var(--fm-font-display)' }}>+{xpEarned} XP</span>
              </div>
            )}
          </div>
        </div>

        <TheoryButton
          titleHe={question.prompt.he}
          titleEn={question.prompt.en}
          bodyHe={question.theory.he}
          bodyEn={question.theory.en}
          isHe={isHe}
        />
      </div>

      {/* Explanation */}
      <div style={{ fontSize: 14, color: 'var(--fm-text)', lineHeight: 1.65, marginBottom: 18 }}>
        <TheoryText text={isHe ? question.explanation.he : question.explanation.en} isHe={isHe} />
      </div>

      {/* CTA */}
      <TactileButton variant={wasCorrect ? 'success' : 'primary'} fullWidth onClick={onNext}>
        {isLast
          ? (isHe ? '🏆 סיים סשן' : '🏆 Finish session')
          : (isHe ? 'השאלה הבאה ←' : 'Next question →')}
      </TactileButton>
    </div>
  )
}
