import type { Question } from '../../lib/challenges/types'
import TheoryButton from './TheoryButton'
import TheoryText from './TheoryText'

interface Props {
  question: Question
  wasCorrect: boolean
  onNext: () => void
  isLast: boolean
  isHe: boolean
}

// Post-answer feedback: correct/wrong banner, explanation text with glossary tooltips,
// optional deeper theory popover, and a Next button.
export default function FeedbackPanel({ question, wasCorrect, onNext, isLast, isHe }: Props) {
  const correctChoice = question.choices[question.correctIndex]

  return (
    <div
      style={{
        marginTop: 24,
        padding: '20px 24px',
        borderRadius: 16,
        background: wasCorrect ? 'var(--fm-secondary-bg)' : 'var(--fm-coral-faint)',
        border: `1px solid ${wasCorrect ? 'var(--fm-secondary)' : 'var(--fm-coral)'}`,
        textAlign: isHe ? 'right' : 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: wasCorrect ? 'var(--fm-secondary)' : 'var(--fm-coral)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              {wasCorrect
                ? <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                : <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              }
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: wasCorrect ? 'var(--fm-secondary)' : 'var(--fm-coral)' }}>
              {wasCorrect ? (isHe ? 'נכון!' : 'Correct!') : (isHe ? 'לא מדויק' : 'Not quite')}
            </div>
            {!wasCorrect && (
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 2 }}>
                {isHe ? 'התשובה הנכונה: ' : 'The answer is: '}
                <span style={{ fontWeight: 700, color: 'var(--fm-text)' }}>{isHe ? correctChoice.he : correctChoice.en}</span>
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

      <div style={{ fontSize: 14, color: 'var(--fm-text)', lineHeight: 1.6 }}>
        <TheoryText text={isHe ? question.explanation.he : question.explanation.en} isHe={isHe} />
      </div>

      <button
        onClick={onNext}
        style={{
          marginTop: 18,
          width: '100%',
          padding: '13px 20px',
          borderRadius: 12,
          background: 'var(--fm-primary)',
          color: 'white',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'filter 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.filter = '')}
      >
        {isLast
          ? (isHe ? 'סיים סשן' : 'Finish session')
          : (isHe ? 'השאלה הבאה' : 'Next question')}
      </button>
    </div>
  )
}
