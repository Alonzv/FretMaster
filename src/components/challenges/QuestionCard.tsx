import type { Question } from '../../lib/challenges/types'
import FretboardVisual from './FretboardVisual'

interface Props {
  question: Question
  selectedIndex: number | null    // user's currently-selected answer (null = not yet)
  revealed: boolean               // true once the user has submitted
  onSelect: (index: number) => void
  isHe: boolean
}

// One question rendered with its prompt, optional visual, and 4 choice buttons.
// Layout switches from 2x2 grid on desktop to 1-column stack on narrow screens.
export default function QuestionCard({ question, selectedIndex, revealed, onSelect, isHe }: Props) {
  return (
    <div>
      {question.visual?.kind === 'fret' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <FretboardVisual string={question.visual.string} fret={question.visual.fret} isRTL={isHe} />
        </div>
      )}

      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--fm-text)',
          textAlign: 'center',
          marginBottom: 28,
          lineHeight: 1.35,
          letterSpacing: '-0.3px',
        }}
      >
        {isHe ? question.prompt.he : question.prompt.en}
      </div>

      <div className="fm-choices">
        {question.choices.map((choice, idx) => {
          const isSelected = selectedIndex === idx
          const isCorrect = idx === question.correctIndex
          // State-driven styling
          let bg   = 'var(--fm-bg-card)'
          let border = 'var(--fm-border)'
          let color  = 'var(--fm-text)'

          if (revealed) {
            if (isCorrect) {
              bg = 'var(--fm-secondary-bg)'
              border = 'var(--fm-secondary)'
              color = 'var(--fm-secondary)'
            } else if (isSelected) {
              bg = 'var(--fm-coral-faint)'
              border = 'var(--fm-coral)'
              color = 'var(--fm-coral)'
            }
          } else if (isSelected) {
            bg = 'var(--fm-primary-bg)'
            border = 'var(--fm-primary)'
            color = 'var(--fm-primary)'
          }

          return (
            <button
              key={idx}
              onClick={() => !revealed && onSelect(idx)}
              disabled={revealed}
              style={{
                padding: '18px 20px',
                borderRadius: 14,
                background: bg,
                border: `1.5px solid ${border}`,
                color,
                fontSize: 17,
                fontWeight: 600,
                cursor: revealed ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
                minHeight: 60,
              }}
              onMouseEnter={e => {
                if (revealed) return
                if (!isSelected) e.currentTarget.style.background = 'var(--fm-bg-input)'
              }}
              onMouseLeave={e => {
                if (revealed) return
                if (!isSelected) e.currentTarget.style.background = 'var(--fm-bg-card)'
              }}
            >
              {isHe ? choice.he : choice.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
