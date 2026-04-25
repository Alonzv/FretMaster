/**
 * ChallengeRunner.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen "Live Listening" challenge experience — Bauhaus Constructivist UI.
 *
 * Layout (3 zones)
 * ────────────────
 *  ┌────────────────────────────────────────────────┐
 *  │  HUD  [X] ██████████░░░░ Cat · N/10  [♥♥♥○○]  │  sticky 58px
 *  ├────────────────────────────────────────────────┤
 *  │                                                │
 *  │  ── EASY ──────────────────────────────────── │  eyebrow divider
 *  │                                                │
 *  │  "Play a Perfect 5th above G"   [🔊 Hint]     │  prompt (pitch only)
 *  │                                                │
 *  │  [ QuestionCard  or  PitchQuestionCard ]       │  card
 *  │                                                │
 *  ├────────────────────────────────────────────────┤
 *  │  ║║║║║║║║║║║║║         LISTENING...           │  visualizer 92px fixed
 *  └────────────────────────────────────────────────┘
 *
 * State transitions
 * ─────────────────
 *  Correct → fm-flash-success overlay (primary blue wash, 0.65s)
 *  Wrong   → fm-wrong-shake on challenge zone (mechanical jolt, 0.45s)
 *  Visualizer breathes (fm-viz-breathe) at rest,
 *             fires (fm-viz-active + primary colour) when pitch matches.
 */

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CategoryId, Difficulty, Question, SessionResult } from '../../lib/challenges/types'
import type { PitchTarget } from '../../lib/engine/questionGenerator'
import { buildSession, scoreSession, SESSION_LENGTH } from '../../lib/challenges/engine'
import { getCategory } from '../../lib/challenges/categories'
import QuestionCard from './QuestionCard'
import PitchQuestionCard from './PitchQuestionCard'
import FeedbackPanel from './FeedbackPanel'
import SessionSummary from './SessionSummary'
import HeartsDisplay from './HeartsDisplay'
import type { HeartsState } from '../../lib/gamification/hearts'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  categoryId:    CategoryId
  difficulty:    Difficulty
  onExit:        () => void
  onComplete:    (result: SessionResult) => void
  hearts?:       HeartsState
  onWrongAnswer?: () => void
}

export interface AnsweredQuestion {
  question:     Question
  chosenIndex:  number
  correct:      boolean
}

interface PitchInfo {
  isMatching:   boolean
  holdProgress: number
  isListening:  boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Visualizer geometry — 13-bar Bauhaus waveform arch (px heights)
// ─────────────────────────────────────────────────────────────────────────────

const VIZ_HEIGHTS = [12, 16, 22, 29, 36, 42, 46, 42, 36, 29, 22, 16, 12]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ChallengeRunner({
  categoryId, difficulty, onExit, onComplete, hearts, onWrongAnswer,
}: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const category  = getCategory(categoryId)
  const startedAt = useMemo(() => Date.now(), [])
  const questions = useMemo(
    () => buildSession(categoryId, difficulty, SESSION_LENGTH),
    [categoryId, difficulty],
  )

  const [idx,           setIdx]           = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed,      setRevealed]      = useState(false)
  const [answers,       setAnswers]       = useState<AnsweredQuestion[]>([])
  const [done,          setDone]          = useState<SessionResult | null>(null)
  const [justLostHeart, setJustLostHeart] = useState(false)
  const [pitchInfo,     setPitchInfo]     = useState<PitchInfo | null>(null)
  const [shaking,       setShaking]       = useState(false)
  const [flashKey,      setFlashKey]      = useState(0)   // increments → remounts SuccessFlash

  if (!category) return null
  if (done) {
    return (
      <SessionSummary
        result={done} category={category}
        answers={answers} onExit={onExit} isHe={isHe}
      />
    )
  }

  const current     = questions[idx]
  const isLast      = idx === questions.length - 1
  const pitchTarget = (current as Question & { pitchTarget?: PitchTarget }).pitchTarget ?? null
  const progress    = ((idx + (revealed ? 1 : 0)) / questions.length) * 100

  // ── Event handlers ─────────────────────────────────────────────────────────

  const handleSelect = (chosenIndex: number) => {
    if (revealed) return
    const correct = chosenIndex === current.correctIndex
    setSelectedIndex(chosenIndex)
    setRevealed(true)
    setAnswers(prev => [...prev, { question: current, chosenIndex, correct }])

    if (!correct) {
      if (onWrongAnswer) onWrongAnswer()
      setJustLostHeart(true)
      setTimeout(() => setJustLostHeart(false), 600)
      // Mechanical shake — triggers by transitioning animation property
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    } else {
      // Remount SuccessFlash by bumping key
      setFlashKey(k => k + 1)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const result = scoreSession(categoryId, difficulty, answers.map(a => a.correct), startedAt)
      setDone(result)
      onComplete(result)
      return
    }
    setIdx(i => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
    setPitchInfo(null)
  }

  // Play the target note as a sine-wave tone for 1.4s (audio hint)
  const playHintAudio = () => {
    if (!pitchTarget) return
    try {
      const freq = 440 * Math.pow(2, (pitchTarget.midiNumber - 69) / 12)
      const actx = new AudioContext()
      const osc  = actx.createOscillator()
      const gain = actx.createGain()
      osc.connect(gain)
      gain.connect(actx.destination)
      osc.type            = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, actx.currentTime)
      gain.gain.linearRampToValueAtTime(0.35, actx.currentTime + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 1.4)
      osc.start()
      osc.stop(actx.currentTime + 1.4)
      setTimeout(() => actx.close(), 1800)
    } catch { /* mic/audio not available */ }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      dir={isHe ? 'rtl' : 'ltr'}
      style={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh',
        background: 'var(--fm-bg-deep)',
        backgroundImage: [
          'linear-gradient(rgba(43,80,232,0.03) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(43,80,232,0.03) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '28px 28px',
        position: 'relative',
      }}
    >
      {/* ── Correct-answer screen flash ─────────────────────────────────────── */}
      <SuccessFlash key={flashKey} active={flashKey > 0} />

      {/* ══ HUD ══════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 58, padding: '0 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'var(--fm-bg-deep)',
        borderBottom: '2px solid var(--fm-border)',
      }}>

        {/* Exit — X in square */}
        <button
          onClick={onExit}
          aria-label={isHe ? 'סגור' : 'Close'}
          style={{
            width: 34, height: 34, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--fm-bg-card)',
            border: '1px solid var(--fm-border)',
            color: 'var(--fm-text-muted)', cursor: 'pointer',
            transition: 'color 0.12s, border-color 0.12s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color        = 'var(--fm-coral)'
            e.currentTarget.style.borderColor  = 'var(--fm-coral)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color        = 'var(--fm-text-muted)'
            e.currentTarget.style.borderColor  = 'var(--fm-border)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {/* Progress track + labels */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{
            height: 10, background: 'var(--fm-bg-input)',
            border: '1px solid var(--fm-border)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${progress}%`,
              background: progress >= 80
                ? 'repeating-linear-gradient(90deg, var(--fm-secondary) 0, var(--fm-secondary) 6px, rgba(245,194,0,.55) 6px, rgba(245,194,0,.55) 8px)'
                : 'repeating-linear-gradient(90deg, var(--fm-primary) 0, var(--fm-primary) 6px, rgba(43,80,232,.55) 6px, rgba(43,80,232,.55) 8px)',
              transition: 'width 0.4s cubic-bezier(0.25,0,0.75,1)',
            }} />
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--fm-text-dim)',
          }}>
            <span>{isHe ? category.titleHe : category.titleEn}</span>
            <span>{idx + 1} / {questions.length}</span>
          </div>
        </div>

        {/* Hearts or difficulty badge */}
        {hearts ? (
          <HeartsDisplay hearts={hearts} lastLost={justLostHeart} />
        ) : (
          <DifficultyBadge difficulty={difficulty} isHe={isHe} />
        )}
      </div>

      {/* ══ Challenge zone ════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '28px 20px 116px',
          animation: shaking ? 'fm-wrong-shake 0.45s cubic-bezier(0.25,0,0.75,1)' : 'none',
        }}
      >
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Difficulty eyebrow divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--fm-border)' }} />
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--fm-primary)',
            }}>
              {isHe ? difficultyLabelHe(difficulty) : difficultyLabelEn(difficulty)}
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--fm-border)' }} />
          </div>

          {/* ── Pitch questions: big prompt + audio-hint button ── */}
          {pitchTarget && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 16, marginBottom: 24, textAlign: 'center',
            }}>
              {/* Large question prompt */}
              <h2 style={{
                margin: 0, fontSize: 27, fontWeight: 900, lineHeight: 1.25,
                letterSpacing: '-0.3px', color: 'var(--fm-text)',
                fontFamily: 'var(--fm-font-display)', maxWidth: 440,
              }}>
                {isHe ? current.prompt.he : current.prompt.en}
              </h2>

              {/* Audio hint button */}
              <button
                onClick={playHintAudio}
                aria-label={isHe ? 'השמע רמז קולי' : 'Play audio hint'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px',
                  background: 'transparent',
                  border: '1px solid var(--fm-border-mid)',
                  color: 'var(--fm-text-muted)',
                  fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--fm-primary)'
                  e.currentTarget.style.color       = 'var(--fm-primary)'
                  e.currentTarget.style.background  = 'var(--fm-primary-bg)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--fm-border-mid)'
                  e.currentTarget.style.color       = 'var(--fm-text-muted)'
                  e.currentTarget.style.background  = 'transparent'
                }}
              >
                <SpeakerIcon />
                {isHe ? 'רמז קולי' : 'Audio Hint'}
              </button>
            </div>
          )}

          {/* ── Card ── */}
          {pitchTarget ? (
            <PitchQuestionCard
              question={current}
              pitchTarget={pitchTarget}
              isHe={isHe}
              hidePrompt
              onSuccess={() => handleSelect(current.correctIndex)}
              onSkip={() => handleSelect(current.correctIndex === 0 ? 1 : 0)}
              onPitchUpdate={setPitchInfo}
            />
          ) : (
            <QuestionCard
              question={current}
              selectedIndex={selectedIndex}
              revealed={revealed}
              onSelect={handleSelect}
              isHe={isHe}
            />
          )}

          {/* MCQ feedback panel (position: fixed via CSS) */}
          {revealed && !pitchTarget && (
            <FeedbackPanel
              question={current}
              wasCorrect={selectedIndex === current.correctIndex}
              onNext={handleNext}
              isLast={isLast}
              isHe={isHe}
              xpEarned={selectedIndex === current.correctIndex
                ? (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20)
                : undefined}
            />
          )}
        </div>
      </div>

      {/* ══ Geometric Waveform Visualizer (position: fixed, bottom) ══════════ */}
      <GeometricVisualizer
        isMatching={pitchInfo?.isMatching   ?? false}
        holdProgress={pitchInfo?.holdProgress ?? 0}
        isListening={pitchInfo?.isListening  ?? false}
        isPitchQuestion={!!pitchTarget}
        isHe={isHe}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Brief primary-blue screen wash on correct answer */
function SuccessFlash({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 90, pointerEvents: 'none',
        background: 'var(--fm-primary)',
        animation: 'fm-flash-success 0.65s ease-out forwards',
      }}
    />
  )
}

/** Geometric speaker SVG — 24×24 viewBox, fills currentColor */
function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  )
}

/** Three filled/empty squares showing difficulty level */
function DifficultyBadge({ difficulty, isHe }: { difficulty: Difficulty; isHe: boolean }) {
  const color = difficulty === 'easy'   ? 'var(--fm-secondary)'
              : difficulty === 'medium' ? 'var(--fm-primary)'
              :                           'var(--fm-coral)'
  const filled = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
      padding: '4px 10px',
      border: `1px solid ${color}`,
      background: `color-mix(in srgb, ${color} 10%, transparent)`,
    }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5,
            background: i < filled ? color : 'var(--fm-border-mid)',
          }} />
        ))}
      </div>
      <span style={{
        fontSize: 9, fontWeight: 800, letterSpacing: '0.18em',
        textTransform: 'uppercase', color,
      }}>
        {isHe ? difficultyLabelHe(difficulty) : difficultyLabelEn(difficulty)}
      </span>
    </div>
  )
}

/**
 * Geometric waveform visualizer — 13 vertical Bauhaus bars arranged in an arch.
 *
 * • Idle: bars breathe softly via fm-viz-breathe (each at a different phase)
 * • Listening: bars lighten to border-mid colour
 * • Matching: bars snap to primary blue + fm-viz-active (more dramatic)
 * • holdProgress draws a top-edge progress stripe
 *
 * Always position: fixed at the bottom of the viewport, accounting for
 * the sidebar width via var(--fm-sidebar-w).
 */
function GeometricVisualizer({ isMatching, holdProgress, isListening, isPitchQuestion, isHe }: {
  isMatching:    boolean
  holdProgress:  number
  isListening:   boolean
  isPitchQuestion: boolean
  isHe:          boolean
}) {
  const borderColor = isMatching  ? 'var(--fm-primary)'
                    : isListening ? 'var(--fm-border-mid)'
                    :               'var(--fm-border)'

  const barColor    = isMatching  ? 'var(--fm-primary)'
                    : isListening ? 'var(--fm-border-mid)'
                    :               'var(--fm-border)'

  const statusText  = isMatching
    ? (isHe ? 'מחזיק...' : 'HOLD IT...')
    : isListening
      ? (isHe ? 'מאזין...' : 'LISTENING...')
      : isPitchQuestion
        ? (isHe ? 'לחץ להתחיל' : 'TAP TO START')
        : (isHe ? 'פעיל' : 'LIVE')

  const statusColor = isMatching  ? 'var(--fm-primary)'
                    : isListening ? 'var(--fm-text-muted)'
                    :               'var(--fm-text-dim)'

  return (
    <div style={{
      position: 'fixed', bottom: 0, zIndex: 20,
      left: 'var(--fm-sidebar-w)', right: 0,
      height: 92,
      background: 'var(--fm-bg-card)',
      borderTop: `2px solid ${borderColor}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-end',
      overflow: 'hidden',
      transition: 'border-color 0.22s',
    }}>

      {/* Hold-progress stripe across the very top edge */}
      {holdProgress > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: 'var(--fm-border)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${holdProgress * 100}%`,
            background: 'var(--fm-primary)',
            transition: 'width 0.04s linear',
          }} />
        </div>
      )}

      {/* Bar group — direction forced LTR for visual symmetry */}
      <div style={{
        display: 'flex', gap: 5, alignItems: 'flex-end',
        height: 62, paddingBottom: 4,
        direction: 'ltr',
      }}>
        {VIZ_HEIGHTS.map((h, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: `${h}px`,
              background: barColor,
              transformOrigin: 'bottom',
              animationName: isMatching ? 'fm-viz-active' : 'fm-viz-breathe',
              animationDuration: `${1.1 + i * 0.06}s`,
              animationDelay: `${-i * 0.085}s`,   // negative = staggered start in cycle
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              transition: 'background 0.22s',
            }}
          />
        ))}
      </div>

      {/* Status label */}
      <div style={{
        fontSize: 8, fontWeight: 800,
        letterSpacing: '0.26em', textTransform: 'uppercase',
        color: statusColor, paddingBottom: 6,
        fontFamily: 'var(--fm-font-display)',
        transition: 'color 0.22s',
      }}>
        {statusText}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function difficultyLabelHe(d: Difficulty): string {
  return d === 'easy' ? 'קל' : d === 'medium' ? 'בינוני' : 'קשה'
}
function difficultyLabelEn(d: Difficulty): string {
  return d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard'
}
