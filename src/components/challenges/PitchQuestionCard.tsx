/**
 * PitchQuestionCard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a pitch-detection question: shows the target note, the detected note
 * in real-time, a hold-progress ring, and fires Bauhaus animations on success.
 *
 * Layout
 * ──────
 *  [Prompt text]
 *
 *  TARGET ──── DETECTED
 *  [ G  ]      [ G  ]  ← notes displayed as large chips
 *
 *  [═══════════░░░░░]   ← hold-progress bar (fills over 450 ms)
 *  "Keep holding..."    ← status text
 *
 *  [🎙 Start / Stop]   [Skip →]
 *
 * Accessibility
 * ─────────────
 * • aria-live="polite" on status region so screen readers announce changes.
 * • All icon-only buttons have aria-label.
 */

import { useEffect, useRef } from 'react'
import type { Question } from '../../lib/challenges/types'
import type { PitchTarget } from '../../lib/engine/questionGenerator'
import { usePitchListener } from '../../lib/audio/usePitchListener'
import { spawnConfetti } from '../../lib/animations'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  question: Question
  pitchTarget: PitchTarget
  isHe: boolean
  /** Called when the player confirms the correct pitch — auto-marks as correct. */
  onSuccess: () => void
  /** Called when the player taps Skip — marks as incorrect and advances. */
  onSkip: () => void
  /** When true, the prompt text is hidden (ChallengeRunner renders it instead). */
  hidePrompt?: boolean
  /** Called on every tick with current pitch detection state for the visualizer. */
  onPitchUpdate?: (info: { isMatching: boolean; holdProgress: number; isListening: boolean }) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// SVG progress ring geometry (same style as SkillTreeView nodes)
const RING_SIZE   = 96
const RING_R      = 38
const RING_CX     = RING_SIZE / 2
const RING_CY     = RING_SIZE / 2
const RING_CIRC   = 2 * Math.PI * RING_R   // ≈ 238.7

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PitchQuestionCard({ question, pitchTarget, isHe, onSuccess, onSkip, hidePrompt, onPitchUpdate }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const { status, detected, isMatching, holdProgress, errorMessage, start, stop, reset } =
    usePitchListener({
      target: pitchTarget,
      mode: 'loose',    // default: any octave is accepted
      holdMs: 450,
      onSuccess: (_confirmed) => {
        // Trigger Bauhaus burst from center of the card
        const rect = cardRef.current?.getBoundingClientRect()
        if (rect) {
          spawnConfetti(
            rect.left + rect.width  / 2,
            rect.top  + rect.height / 2,
            44,
            220,
          )
        }
        // Small delay so the animation is visible before the card unmounts
        setTimeout(onSuccess, 480)
      },
    })

  // Report pitch state to ChallengeRunner for the visualizer (throttled naturally by usePitchListener)
  const onPitchUpdateRef = useRef(onPitchUpdate)
  useEffect(() => { onPitchUpdateRef.current = onPitchUpdate }, [onPitchUpdate])
  useEffect(() => {
    onPitchUpdateRef.current?.({ isMatching, holdProgress, isListening: status === 'listening' })
  }, [isMatching, holdProgress, status])

  // Reset the hook whenever the question changes (new pitchTarget)
  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  // Stop mic when unmounting
  useEffect(() => () => stop(), [stop])

  // ── Derived display values ─────────────────────────────────────────────────
  const isListening = status === 'listening'
  const isSuccess   = status === 'success'
  const isError     = status === 'error'

  const detectedNote = detected?.note ?? null
  const noteMatch    = isMatching || isSuccess

  // Progress ring stroke offset — 0 offset = full ring, RING_CIRC offset = empty
  const strokeDash   = `${RING_CIRC * holdProgress} ${RING_CIRC * (1 - holdProgress)}`
  const strokeOffset = RING_CIRC * 0.25   // start from top (−90°)

  // Status message
  const statusMsg = (): string => {
    if (isSuccess)   return isHe ? '✓ מצוין! ממשיכים...' : '✓ Perfect! Moving on...'
    if (isError)     return errorMessage ?? (isHe ? 'שגיאת מיקרופון' : 'Microphone error')
    if (!isListening) return isHe ? 'לחץ כדי להתחיל להאזין' : 'Tap to start listening'
    if (isMatching)  return isHe ? 'מצוין! המשך להחזיק...' : 'Great! Keep holding...'
    if (detectedNote) return isHe ? `מזוהה: ${detectedNote} — נגן ${pitchTarget.noteClass}` : `Detected: ${detectedNote} — play ${pitchTarget.noteClass}`
    return isHe ? 'נגן את התו...' : 'Play the note...'
  }

  const ringColor = isSuccess   ? 'var(--fm-secondary)'
                  : isMatching  ? 'var(--fm-primary)'
                  : 'var(--fm-border-mid)'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      dir={isHe ? 'rtl' : 'ltr'}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 24, padding: '8px 0',
      }}
    >
      {/* ── Prompt (hidden when ChallengeRunner owns it) ─────────────────── */}
      {!hidePrompt && (
        <p style={{
          fontSize: 20, fontWeight: 800, textAlign: 'center', lineHeight: 1.4,
          color: 'var(--fm-text)', margin: 0, maxWidth: 380,
        }}>
          {isHe ? question.prompt.he : question.prompt.en}
        </p>
      )}

      {/* ── Note chips row ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 24, alignItems: 'center',
        flexDirection: isHe ? 'row-reverse' : 'row',
      }}>
        {/* Target note */}
        <NoteChip
          label={isHe ? 'יעד' : 'Target'}
          note={pitchTarget.noteClass}
          highlighted={false}
          dimmed={isSuccess}
          color="var(--fm-primary)"
        />

        {/* Separator arrow */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--fm-border-mid)"
          style={{ transform: isHe ? 'scaleX(-1)' : 'none', flexShrink: 0 }}>
          <path d="M8 5v14l11-7z"/>
        </svg>

        {/* Detected note */}
        <NoteChip
          label={isHe ? 'מזוהה' : 'Detected'}
          note={detectedNote ?? '—'}
          highlighted={noteMatch}
          dimmed={false}
          color={noteMatch ? 'var(--fm-secondary)' : 'var(--fm-text-muted)'}
        />
      </div>

      {/* ── Progress ring ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE} height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={RING_CX} cy={RING_CY} r={RING_R}
            fill="none"
            stroke="var(--fm-bg-input)"
            strokeWidth={6}
          />
          {/* Fill */}
          <circle
            cx={RING_CX} cy={RING_CY} r={RING_R}
            fill="none"
            stroke={ringColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={strokeDash}
            strokeDashoffset={-strokeOffset}
            style={{ transition: 'stroke 0.15s, stroke-dasharray 0.04s linear' }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isSuccess ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--fm-secondary)">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          ) : isListening ? (
            <MicIcon active={isMatching} />
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--fm-text-muted)">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          )}
        </div>
      </div>

      {/* ── Status message ─────────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        style={{
          fontSize: 13, fontWeight: 600, color: isError ? 'var(--fm-coral)' : isSuccess ? 'var(--fm-secondary)' : 'var(--fm-text-muted)',
          textAlign: 'center', minHeight: 20,
          transition: 'color 0.2s',
        }}
      >
        {statusMsg()}
      </div>

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      {!isSuccess && (
        <div style={{
          display: 'flex', gap: 12, width: '100%', maxWidth: 320,
          flexDirection: isHe ? 'row-reverse' : 'row',
        }}>
          {/* Start / Stop */}
          <button
            onClick={() => isListening ? stop() : start()}
            style={{
              flex: 1, padding: '13px 0', borderRadius: 12,
              background: isListening ? 'var(--fm-bg-input)' : 'var(--fm-primary)',
              border: `1px solid ${isListening ? 'var(--fm-border)' : 'transparent'}`,
              color: isListening ? 'var(--fm-text-muted)' : 'white',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: isListening ? 'none' : '0 4px 0 0 var(--fm-primary-shadow)',
              transition: 'all 0.15s',
            }}
            aria-label={isListening
              ? (isHe ? 'עצור האזנה' : 'Stop listening')
              : (isHe ? 'התחל האזנה' : 'Start listening')}
          >
            {isListening ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                {isHe ? 'עצור' : 'Stop'}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
                {isHe ? 'התחל האזנה' : 'Start Listening'}
              </>
            )}
          </button>

          {/* Skip */}
          <button
            onClick={onSkip}
            style={{
              padding: '13px 16px', borderRadius: 12,
              background: 'transparent',
              border: '1px solid var(--fm-border)',
              color: 'var(--fm-text-muted)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fm-border-mid)'; e.currentTarget.style.color = 'var(--fm-text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--fm-border)'; e.currentTarget.style.color = 'var(--fm-text-muted)' }}
            aria-label={isHe ? 'דלג' : 'Skip this question'}
          >
            {isHe ? 'דלג' : 'Skip'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
              style={{ marginInlineStart: 5, transform: isHe ? 'scaleX(-1)' : 'none' }}>
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function NoteChip({
  label, note, highlighted, dimmed, color,
}: {
  label: string
  note: string
  highlighted: boolean
  dimmed: boolean
  color: string
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--fm-text-dim)',
        fontFamily: 'var(--fm-font-display)',
      }}>
        {label}
      </span>
      <div style={{
        width: 72, height: 72, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: highlighted ? `${color}18` : 'var(--fm-bg-input)',
        border: `2px solid ${highlighted ? color : 'var(--fm-border)'}`,
        boxShadow: highlighted ? `0 0 0 3px ${color}22, 0 4px 0 0 ${color}44` : '0 2px 0 0 var(--fm-border)',
        opacity: dimmed ? 0.45 : 1,
        transition: 'all 0.18s cubic-bezier(0.22,1,0.36,1)',
        transform: highlighted ? 'scale(1.06)' : 'scale(1)',
      }}>
        <span style={{
          fontSize: note.length > 2 ? 18 : 24, fontWeight: 900,
          fontFamily: 'var(--fm-font-display)', letterSpacing: '0.02em',
          color: highlighted ? color : 'var(--fm-text)',
          transition: 'color 0.15s',
        }}>
          {note}
        </span>
      </div>
    </div>
  )
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="26" height="26" viewBox="0 0 24 24"
      fill={active ? 'var(--fm-primary)' : 'var(--fm-text-muted)'}
      style={{
        animation: active ? 'fm-pulse 1.2s ease-in-out infinite' : 'none',
        transition: 'fill 0.15s',
      }}
    >
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
    </svg>
  )
}
