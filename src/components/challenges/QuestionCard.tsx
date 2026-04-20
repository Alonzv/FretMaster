import type { Question } from '../../lib/challenges/types'
import FretboardVisual from './FretboardVisual'
import StaffVisual from './StaffVisual'
import TheoryText from './TheoryText'

interface Props {
  question: Question
  selectedIndex: number | null
  revealed: boolean
  onSelect: (index: number) => void
  isHe: boolean
}

export default function QuestionCard({ question, selectedIndex, revealed, onSelect, isHe }: Props) {
  return (
    <div>
      {/* Optional visual aids */}
      {question.visual?.kind === 'fret' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <FretboardVisual string={question.visual.string} fret={question.visual.fret} isHe={isHe} />
        </div>
      )}
      {question.visual?.kind === 'staff' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <StaffVisual staffStep={question.visual.staffStep} accidental={question.visual.accidental} />
        </div>
      )}

      {/* Question prompt */}
      <div style={{
        fontSize: 21,
        fontWeight: 700,
        color: 'var(--fm-text)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 1.4,
        letterSpacing: '-0.2px',
        padding: '0 8px',
      }}>
        <TheoryText text={isHe ? question.prompt.he : question.prompt.en} isHe={isHe} />
      </div>

      {/* Answer choices */}
      <div className="fm-choices">
        {question.choices.map((choice, idx) => {
          const isSelected = selectedIndex === idx
          const isCorrect  = idx === question.correctIndex

          let cls = 'fm-choice'
          if (revealed) {
            if (isCorrect)              cls += ' correct'
            else if (isSelected)        cls += ' wrong'
            else                        cls += ' dimmed'
          } else if (isSelected) {
            cls += ' selected'
          }

          return (
            <button
              key={idx}
              className={cls}
              onClick={() => !revealed && onSelect(idx)}
              disabled={revealed}
            >
              {isHe ? choice.he : choice.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
