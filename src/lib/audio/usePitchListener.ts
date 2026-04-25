/**
 * usePitchListener.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook that wraps Pitchy.js pitch detection and implements a debounce
 * "hold time" to eliminate false positives from overtones or transient plucks.
 *
 * Architecture
 * ────────────
 * • ALL audio objects (AudioContext, AnalyserNode, MediaStream, detector, buffer)
 *   live in useRef — they never trigger re-renders and are safely accessible
 *   inside the requestAnimationFrame callback without stale closure issues.
 *
 * • React useState is used only for values the UI needs to render:
 *     status      — 'idle' | 'requesting' | 'listening' | 'success' | 'error'
 *     detected    — current detected note (throttled to 10 fps to reduce renders)
 *     isMatching  — true while the correct note is being sustained
 *     holdProgress — 0–1 fill for the hold-progress ring
 *     errorMessage — user-facing microphone error
 *
 * • The hold-time debounce works entirely via refs (isMatchingRef, matchStartRef)
 *   so no React state update is needed to make the timing decision. React state
 *   is only updated when the boolean changes (for the CSS animation trigger) or
 *   when the progress bar needs a visual tick (throttled to 20 fps).
 *
 * • Cleanup is guaranteed: the useEffect return value cancels RAF and releases
 *   the MediaStream whether the component unmounts normally or on error.
 *
 * Usage
 * ─────
 * ```tsx
 * const { status, detected, isMatching, holdProgress, start, stop, reset } =
 *   usePitchListener({ target: question.pitchTarget, onSuccess: handlePitchSuccess })
 * ```
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { PitchDetector } from 'pitchy'
import { freqToNote, type PitchResult } from './pitchEngine'
import { matchesPitchTarget, type PitchTarget } from '../engine/questionGenerator'

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export type PitchStatus = 'idle' | 'requesting' | 'listening' | 'success' | 'error'

export interface UsePitchListenerOptions {
  /** The target pitch from GeneratedQuestion.pitchTarget. Null = paused. */
  target: PitchTarget | null
  /** 'loose' = pitch-class only (any octave). 'strict' = octave + cents aware. */
  mode?: 'loose' | 'strict'
  /** Milliseconds the correct note must be sustained before confirming. Default: 450 */
  holdMs?: number
  /** Called once when the hold time is satisfied and status transitions to 'success'. */
  onSuccess?: (confirmed: PitchResult) => void
}

export interface UsePitchListenerResult {
  status:      PitchStatus
  /** Last note detected by Pitchy (null when silent or unclear). Updated at ~10 fps. */
  detected:    PitchResult | null
  /** True while the detected note matches the target and is being held. */
  isMatching:  boolean
  /** 0–1: how far through the hold-time window the player has progressed. */
  holdProgress: number
  errorMessage: string | null
  start: () => Promise<void>
  stop:  () => void
  reset: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants (mirror pitchEngine.ts to stay consistent)
// ─────────────────────────────────────────────────────────────────────────────

const BUFFER_SIZE  = 2048
const CLARITY_MIN  = 0.85   // Pitchy confidence threshold (0–1)
const MIN_FREQ     = 60     // Hz — just below low E open string
const MAX_FREQ     = 1400   // Hz — just above highest fret on high-e string

// Throttle intervals for React state updates inside the RAF loop
const DETECT_THROTTLE_MS   = 100  // detected note  →  ~10 fps
const PROGRESS_THROTTLE_MS = 50   // holdProgress   →  ~20 fps

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function usePitchListener({
  target,
  mode    = 'loose',
  holdMs  = 450,
  onSuccess,
}: UsePitchListenerOptions): UsePitchListenerResult {

  // ── React state ─────────────────────────────────────────────────────────────
  const [status,       setStatus]       = useState<PitchStatus>('idle')
  const [detected,     setDetected]     = useState<PitchResult | null>(null)
  const [isMatching,   setIsMatching]   = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ── Audio object refs (never trigger renders, safe inside RAF) ──────────────
  const ctxRef      = useRef<AudioContext | null>(null)
  const sourceRef   = useRef<MediaStreamAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null)
  const bufRef      = useRef<Float32Array<ArrayBuffer> | null>(null)
  const streamRef   = useRef<MediaStream | null>(null)
  const rafIdRef    = useRef<number>(0)

  // ── Debounce refs (hold-time logic, zero re-renders) ────────────────────────
  const isMatchingRef   = useRef(false)
  const matchStartRef   = useRef(0)

  // ── Throttle timestamps ─────────────────────────────────────────────────────
  const lastDetectUpd   = useRef(0)
  const lastProgressUpd = useRef(0)

  // ── Option snapshots (prevent stale closures inside RAF) ───────────────────
  const targetRef    = useRef(target)
  const modeRef      = useRef(mode)
  const holdMsRef    = useRef(holdMs)
  const onSuccessRef = useRef(onSuccess)
  const statusRef    = useRef<PitchStatus>('idle')

  useEffect(() => { targetRef.current    = target    }, [target])
  useEffect(() => { modeRef.current      = mode      }, [mode])
  useEffect(() => { holdMsRef.current    = holdMs    }, [holdMs])
  useEffect(() => { onSuccessRef.current = onSuccess }, [onSuccess])

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  // Declared with useCallback so `start()` can reference it without stale closure.
  // All mutable values are read from refs, never from closed-over state.
  const loop = useCallback((): void => {
    const analyser = analyserRef.current
    const detector = detectorRef.current
    const buf      = bufRef.current
    const ctx      = ctxRef.current
    if (!analyser || !detector || !buf || !ctx) return

    // ── 1. Fill buffer from microphone ────────────────────────────────────────
    analyser.getFloatTimeDomainData(buf)

    // ── 2. Ask Pitchy for frequency + confidence ───────────────────────────────
    const [freq, clarity] = detector.findPitch(buf, ctx.sampleRate)
    const now = performance.now()

    if (clarity >= CLARITY_MIN && freq >= MIN_FREQ && freq <= MAX_FREQ) {
      // ── 3a. Convert Hz → { note, octave, cents } ──────────────────────────
      const pitchData  = freqToNote(freq)
      const pitchResult: PitchResult = {
        ...pitchData,
        freq,
        clarity,
        inTune: Math.abs(pitchData.cents) <= 8,
      }

      // Update detected state (throttled — at most ~10 fps)
      if (now - lastDetectUpd.current >= DETECT_THROTTLE_MS) {
        setDetected(pitchResult)
        lastDetectUpd.current = now
      }

      // ── 3b. Compare against target ────────────────────────────────────────
      const tgt = targetRef.current
      if (tgt) {
        const matches = matchesPitchTarget(pitchResult, tgt, modeRef.current)

        if (matches) {
          if (!isMatchingRef.current) {
            // ── Match just started: record timestamp, trigger CSS animation ──
            isMatchingRef.current = true
            matchStartRef.current = now
            setIsMatching(true)
          }

          // ── Check hold duration ───────────────────────────────────────────
          const elapsed  = now - matchStartRef.current
          const progress = Math.min(elapsed / holdMsRef.current, 1)

          // Throttle progress bar updates (~20 fps)
          if (now - lastProgressUpd.current >= PROGRESS_THROTTLE_MS) {
            setHoldProgress(progress)
            lastProgressUpd.current = now
          }

          if (elapsed >= holdMsRef.current) {
            // ✅ CONFIRMED — stop the loop and emit success
            cancelAnimationFrame(rafIdRef.current)
            setStatus('success')
            statusRef.current = 'success'
            setHoldProgress(1)
            onSuccessRef.current?.(pitchResult)
            return   // ← exits loop, RAF is NOT re-scheduled
          }
        } else {
          // ── Match broken — reset debounce ─────────────────────────────────
          if (isMatchingRef.current) {
            isMatchingRef.current = false
            matchStartRef.current = 0
            setIsMatching(false)
            setHoldProgress(0)
          }
        }
      }

    } else {
      // ── 3c. No clear signal — treat as silence ────────────────────────────
      if (now - lastDetectUpd.current >= DETECT_THROTTLE_MS) {
        setDetected(null)
        lastDetectUpd.current = now
      }
      if (isMatchingRef.current) {
        isMatchingRef.current = false
        matchStartRef.current = 0
        setIsMatching(false)
        setHoldProgress(0)
      }
    }

    // ── 4. Schedule next frame ────────────────────────────────────────────────
    rafIdRef.current = requestAnimationFrame(loop)
  }, []) // empty deps — all mutable state read from refs

  // ── Teardown helper (shared by stop / reset / unmount) ───────────────────────
  const teardown = useCallback((): void => {
    cancelAnimationFrame(rafIdRef.current)
    sourceRef.current?.disconnect()
    streamRef.current?.getTracks().forEach(t => t.stop())
    ctxRef.current?.close()

    ctxRef.current      = null
    sourceRef.current   = null
    analyserRef.current = null
    streamRef.current   = null
    detectorRef.current = null
    bufRef.current      = null

    isMatchingRef.current = false
    matchStartRef.current = 0
  }, [])

  // ── start() ──────────────────────────────────────────────────────────────────
  const start = useCallback(async (): Promise<void> => {
    if (statusRef.current === 'listening' || statusRef.current === 'requesting') return

    setStatus('requesting')
    statusRef.current = 'requesting'
    setErrorMessage(null)

    try {
      // Request microphone — will throw if denied
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      // Build the audio processing graph
      const ctx = new AudioContext()
      ctxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      sourceRef.current = source

      const analyser = ctx.createAnalyser()
      analyser.fftSize = BUFFER_SIZE
      source.connect(analyser)
      analyserRef.current = analyser

      // Pitchy detector
      const detector = PitchDetector.forFloat32Array(BUFFER_SIZE)
      detector.clarityThreshold = CLARITY_MIN
      detectorRef.current = detector as unknown as PitchDetector<Float32Array>

      bufRef.current = new Float32Array(BUFFER_SIZE) as Float32Array<ArrayBuffer>

      setStatus('listening')
      statusRef.current = 'listening'
      rafIdRef.current = requestAnimationFrame(loop)

    } catch (err) {
      const msg = err instanceof Error
        ? (err.name === 'NotAllowedError'
            ? 'Microphone access was denied. Please allow microphone access and try again.'
            : err.message)
        : 'Could not access microphone.'
      setErrorMessage(msg)
      setStatus('error')
      statusRef.current = 'error'
      teardown()
    }
  }, [loop, teardown])

  // ── stop() ───────────────────────────────────────────────────────────────────
  const stop = useCallback((): void => {
    teardown()
    if (statusRef.current !== 'success') {
      setStatus('idle')
      statusRef.current = 'idle'
    }
  }, [teardown])

  // ── reset() ──────────────────────────────────────────────────────────────────
  // Fully resets to idle — use between questions
  const reset = useCallback((): void => {
    teardown()
    setStatus('idle')
    statusRef.current = 'idle'
    setDetected(null)
    setIsMatching(false)
    setHoldProgress(0)
    setErrorMessage(null)
  }, [teardown])

  // ── Cleanup on unmount ────────────────────────────────────────────────────────
  // Guaranteed to run even if the component unmounts mid-session.
  // This is the single source of truth for resource release.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafIdRef.current)
      sourceRef.current?.disconnect()
      streamRef.current?.getTracks().forEach(t => t.stop())
      ctxRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { status, detected, isMatching, holdProgress, errorMessage, start, stop, reset }
}
