import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PitchEngine, GUITAR_STRINGS } from '../../lib/audio/pitchEngine'
import type { PitchResult } from '../../lib/audio/pitchEngine'

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_CENTS = 50

// ── Main component ────────────────────────────────────────────────────────────

export default function TunerTab() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [running, setRunning]     = useState(false)
  const [pitch, setPitch]         = useState<PitchResult | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const engineRef                 = useRef<PitchEngine | null>(null)

  // Smooth cents with a moving average to reduce jitter
  const centsHistory              = useRef<number[]>([])
  const [smoothCents, setSmoothCents] = useState(0)

  const handlePitch = useCallback((result: PitchResult | null) => {
    setPitch(result)
    if (result) {
      centsHistory.current.push(result.cents)
      if (centsHistory.current.length > 6) centsHistory.current.shift()
      const avg = Math.round(centsHistory.current.reduce((a, b) => a + b, 0) / centsHistory.current.length)
      setSmoothCents(avg)
    } else {
      centsHistory.current = []
      setSmoothCents(0)
    }
  }, [])

  const start = async () => {
    setError(null)
    try {
      const engine = new PitchEngine(handlePitch)
      await engine.start()
      engineRef.current = engine
      setRunning(true)
    } catch (e) {
      setError(isHe ? 'לא ניתן לגשת למיקרופון. אנא אפשר גישה בהגדרות הדפדפן.' : 'Cannot access microphone. Please allow access in browser settings.')
    }
  }

  const stop = () => {
    engineRef.current?.stop()
    engineRef.current = null
    setRunning(false)
    setPitch(null)
    setSmoothCents(0)
  }

  useEffect(() => () => { engineRef.current?.stop() }, [])

  // Closest guitar string to current pitch
  const closestString = pitch ? GUITAR_STRINGS.reduce((best, s) => {
    return Math.abs(s.freq - pitch.freq) < Math.abs(best.freq - pitch.freq) ? s : best
  }) : null

  // needle angle: -MAX_CENTS → -70deg, 0 → 0deg, +MAX_CENTS → +70deg
  const needleAngle = pitch ? Math.max(-70, Math.min(70, (smoothCents / MAX_CENTS) * 70)) : 0

  // Color based on cents
  const tuningColor = !pitch ? 'var(--fm-text-muted)'
    : pitch.inTune ? '#58cc02'
    : Math.abs(smoothCents) < 25 ? '#f5b730'
    : '#e05260'

  return (
    <div className="fm-page" style={{ maxWidth: 480, paddingTop: 24, userSelect: 'none' }}>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, textAlign: 'center' }}>
        {isHe ? 'כוונון גיטרה' : 'Guitar Tuner'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', textAlign: 'center', marginBottom: 28 }}>
        {isHe ? 'כוונון סטנדרטי E A D G B e' : 'Standard tuning E A D G B e'}
      </div>

      {/* ── Main display ── */}
      <div style={{
        background: 'var(--fm-bg-card)',
        border: `2px solid ${running ? tuningColor : 'var(--fm-border)'}`,
        borderRadius: 24,
        padding: '32px 24px',
        marginBottom: 20,
        transition: 'border-color 0.2s',
        textAlign: 'center',
      }}>

        {/* Note name */}
        <div style={{
          fontSize: 80, fontWeight: 900, lineHeight: 1,
          color: pitch ? tuningColor : 'var(--fm-text-muted)',
          transition: 'color 0.15s',
          letterSpacing: '-2px',
          minHeight: 90,
        }}>
          {pitch ? (isHe ? pitch.noteHe : pitch.note) : (running ? '–' : '♩')}
          {pitch && (
            <span style={{ fontSize: 36, fontWeight: 700, verticalAlign: 'sub', marginLeft: 4 }}>
              {pitch.octave}
            </span>
          )}
        </div>

        {/* Cents display */}
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: pitch ? tuningColor : 'var(--fm-text-muted)',
          marginTop: 8, marginBottom: 24, minHeight: 22,
          transition: 'color 0.15s',
        }}>
          {pitch
            ? pitch.inTune
              ? (isHe ? '✓ מכוון' : '✓ In tune')
              : `${smoothCents > 0 ? '+' : ''}${smoothCents}¢`
            : running
              ? (isHe ? 'נגן תו...' : 'Play a note...')
              : (isHe ? 'לחץ התחל לכוונון' : 'Press Start to tune')}
        </div>

        {/* Needle gauge */}
        <div style={{ position: 'relative', height: 80, marginBottom: 8 }}>
          {/* Arc track */}
          <svg viewBox="0 0 240 90" style={{ width: '100%', height: '100%' }}>
            {/* Background arc */}
            <path
              d="M 20 80 A 100 100 0 0 1 220 80"
              fill="none"
              stroke="var(--fm-border)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Center tick */}
            <line x1="120" y1="72" x2="120" y2="62" stroke="var(--fm-text-muted)" strokeWidth="2" />
            {/* -25 and +25 ticks */}
            <line x1="57"  y1="66" x2="60"  y2="57" stroke="var(--fm-border)" strokeWidth="1.5" />
            <line x1="183" y1="66" x2="180" y2="57" stroke="var(--fm-border)" strokeWidth="1.5" />

            {/* Needle */}
            <line
              x1="120" y1="80"
              x2={120 + 70 * Math.sin((needleAngle * Math.PI) / 180)}
              y2={80  - 70 * Math.cos((needleAngle * Math.PI) / 180)}
              stroke={pitch ? tuningColor : 'var(--fm-text-muted)'}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: 'x2 0.06s, y2 0.06s, stroke 0.15s' }}
            />
            {/* Pivot dot */}
            <circle cx="120" cy="80" r="6" fill={pitch ? tuningColor : 'var(--fm-text-muted)'} style={{ transition: 'fill 0.15s' }} />

            {/* Labels */}
            <text x="14"  y="84" fontSize="9" fill="var(--fm-text-muted)" textAnchor="middle">-50</text>
            <text x="226" y="84" fontSize="9" fill="var(--fm-text-muted)" textAnchor="middle">+50</text>
          </svg>
        </div>

        {/* Frequency */}
        {pitch && (
          <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', fontWeight: 600 }}>
            {pitch.freq.toFixed(1)} Hz
          </div>
        )}
      </div>

      {/* ── Guitar strings reference ── */}
      <div style={{
        display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
      }}>
        {GUITAR_STRINGS.map(s => {
          const isActive = closestString?.string === s.string && !!pitch
          const cents = isActive ? smoothCents : null
          const color = isActive
            ? (Math.abs(cents!) <= 8 ? '#58cc02' : Math.abs(cents!) < 25 ? '#f5b730' : '#e05260')
            : 'var(--fm-text-muted)'

          return (
            <div
              key={s.string}
              style={{
                width: 52, height: 56, borderRadius: 12,
                background: isActive ? 'var(--fm-bg-card)' : 'var(--fm-bg-card)',
                border: `2px solid ${isActive ? color : 'var(--fm-border)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color, transition: 'color 0.2s' }}>
                {isHe ? s.noteHe : s.note}
              </div>
              <div style={{ fontSize: 10, color: 'var(--fm-text-muted)', fontWeight: 600 }}>
                {isHe ? `מיתר ${s.string}` : `str ${s.string}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: 'rgba(224,82,96,0.1)', border: '1px solid #e05260',
          color: '#e05260', fontSize: 13, marginBottom: 16, textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* ── Start / Stop button ── */}
      <button
        onClick={running ? stop : start}
        style={{
          width: '100%', padding: '15px 0', borderRadius: 12,
          background: running ? 'var(--fm-bg-card)' : 'var(--fm-primary)',
          color: running ? '#e05260' : 'white',
          border: running ? '2px solid #e05260' : 'none',
          fontSize: 16, fontWeight: 700, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {running
          ? (isHe ? '⏹ עצור' : '⏹ Stop')
          : (isHe ? '🎙 התחל כוונון' : '🎙 Start tuning')}
      </button>

      <p style={{ fontSize: 12, color: 'var(--fm-text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
        {isHe
          ? 'נגן תו על הגיטרה ← האפליקציה תזהה אותו ותראה כמה סנטים אתה סוטה מהכוונון המושלם'
          : 'Play a string → the app detects the note and shows how many cents off perfect pitch you are'}
      </p>
    </div>
  )
}
