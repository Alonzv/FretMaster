import { useState, useRef } from 'react'

// ── MIDI → Hz ─────────────────────────────────────────────────────────────────
const midiHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// ── Chord definitions ─────────────────────────────────────────────────────────
// MIDI values for a comfortable range (octave 3 / 4)
const CHORDS = {
  Am: { notes: [57, 60, 64], label: 'Am', role: 'i',      tones: ['A', 'C', 'E']        },
  Dm: { notes: [50, 53, 57], label: 'Dm', role: 'iv',     tones: ['D', 'F', 'A']        },
  Em: { notes: [52, 55, 59], label: 'Em', role: 'v',      tones: ['E', 'G', 'B']        },
  E7: { notes: [52, 56, 59, 62], label: 'E7', role: 'V7', tones: ['E', 'G♯', 'B', 'D'] },
} as const
type ChordKey = keyof typeof CHORDS

function IconPlay() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
      <path d="M0 0L12 7L0 14V0Z" />
    </svg>
  )
}
function IconStop() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <rect width="12" height="12" />
    </svg>
  )
}

// ── Audio playback ────────────────────────────────────────────────────────────
function scheduleNote(
  ctx: AudioContext, hz: number, start: number, dur: number, vol = 0.28,
) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'triangle'
  osc.frequency.value = hz
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(vol, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

// ── Tone chip ─────────────────────────────────────────────────────────────────
function ToneChip({ note, highlight }: { note: string; highlight: boolean }) {
  return (
    <span style={{
      fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
      padding: '3px 8px',
      background: highlight ? '#E83020' : 'rgba(255,255,255,0.12)',
      color: '#FAF8F0',
      border: `1px solid ${highlight ? '#E83020' : 'rgba(255,255,255,0.25)'}`,
      letterSpacing: '0.04em',
      transition: 'background 0.25s, border-color 0.25s',
      display: 'inline-block',
    }}>
      {note}
    </span>
  )
}

// ── Chord card ────────────────────────────────────────────────────────────────
function ChordCard({
  chordKey, active, isHe,
}: {
  chordKey: ChordKey
  active: boolean
  isHe: boolean
}) {
  const c = CHORDS[chordKey]
  const isE7   = chordKey === 'E7'

  // Role display
  const roleLabel = isHe
    ? { 'i': 'דרגה 1', 'iv': 'דרגה 4', 'v': 'דרגה 5 (רכה)', 'V7': 'דרגה V7 (דומיננטה)' }[c.role]
    : { 'i': 'Degree 1', 'iv': 'Degree 4', 'v': 'Degree 5 (soft)', 'V7': 'Degree V7 (Dominant)' }[c.role]

  return (
    <div style={{
      background: active ? '#2B50E8' : '#242030',
      border: `2px solid ${active ? '#2B50E8' : isE7 ? '#E83020' : '#3A3050'}`,
      padding: '16px 14px',
      flex: '1 1 120px', minWidth: 110,
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'border-color 0.3s, background 0.3s',
      position: 'relative',
    }}>
      {/* Chord name */}
      <div style={{
        fontFamily: 'var(--fm-font-display)', fontSize: 28, fontWeight: 800,
        color: '#FAF8F0', letterSpacing: '-0.02em', lineHeight: 1,
      }}>
        {c.label}
      </div>

      {/* Role */}
      <div style={{
        fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
        color: isE7 ? '#E83020' : 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase', letterSpacing: '0.12em',
      }}>
        {roleLabel}
      </div>

      {/* Tones */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {c.tones.map((tone, ti) => {
          // G♯ and D in E7 are the borrowed/tension tones
          const isTension = isE7 && (tone === 'G♯' || tone === 'D')
          return <ToneChip key={ti} note={tone} highlight={isTension} />
        })}
      </div>

      {/* Tension indicator badge */}
      {isE7 && (
        <div style={{
          position: 'absolute', top: 8, insetInlineEnd: 8,
          background: '#E83020',
          fontFamily: 'var(--fm-font-display)', fontSize: 8, fontWeight: 700,
          color: '#FAF8F0', padding: '2px 6px',
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {isHe ? 'מתח' : 'TENSION'}
        </div>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DominantTrickLab({ isHe }: { isHe: boolean }) {
  const [dominantMode, setDominantMode] = useState(false)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [activeIdx,    setActiveIdx]    = useState<number | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const stopRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const progression: ChordKey[] = dominantMode
    ? ['Am', 'Dm', 'E7', 'Am']
    : ['Am', 'Dm', 'Em']

  function stopAll() {
    if (stopRef.current) clearTimeout(stopRef.current)
    try { ctxRef.current?.close() } catch (_) { /* ignore */ }
    ctxRef.current = null
    setIsPlaying(false)
    setActiveIdx(null)
  }

  function play() {
    if (isPlaying) { stopAll(); return }

    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
    const ctx: AudioContext = new AudioCtx()
    ctxRef.current = ctx

    const noteDur  = 0.28
    const noteGap  = 0.06
    const chordGap = 0.45
    const now = ctx.currentTime

    let cursor = now
    let totalDur = 0

    progression.forEach((key, ci) => {
      const chord = CHORDS[key]
      const chordStart = cursor

      // Schedule each chord tone as an arpeggio
      chord.notes.forEach((midi, ni) => {
        const t = chordStart + ni * (noteDur + noteGap)
        scheduleNote(ctx, midiHz(midi), t, noteDur)
      })

      // Light up the card while chord plays
      const delay = (chordStart - now) * 1000
      setTimeout(() => setActiveIdx(ci), delay)

      cursor += chord.notes.length * (noteDur + noteGap) + chordGap
      totalDur = cursor - now
    })

    setIsPlaying(true)
    stopRef.current = setTimeout(() => {
      setIsPlaying(false)
      setActiveIdx(null)
      ctxRef.current?.close()
      ctxRef.current = null
    }, totalDur * 1000 + 200)
  }

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#E83020', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מעבדת טריק הדרגה החמישית' : 'Dominant Fifth Trick Lab'}
        </span>
      </div>

      <div style={{ padding: '20px 20px 24px' }}>
        {/* ── Toggle ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 20, padding: '12px 16px',
          background: dominantMode ? 'rgba(232,48,32,0.08)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${dominantMode ? '#E83020' : '#C0B898'}`,
          transition: 'background 0.3s, border-color 0.3s',
        }}>
          <button
            onClick={() => { stopAll(); setDominantMode(p => !p) }}
            style={{
              width: 44, height: 24, borderRadius: 0, border: 'none',
              background: dominantMode ? '#E83020' : '#C0B898',
              cursor: 'pointer', flexShrink: 0,
              position: 'relative',
              transition: 'background 0.25s',
            }}
            aria-label={isHe ? 'הפעל טריק דרגה חמישית' : 'Activate fifth degree trick'}
          >
            <div style={{
              position: 'absolute', top: 4, width: 16, height: 16,
              background: '#FAF8F0',
              left: dominantMode ? 24 : 4,
              transition: 'left 0.25s',
            }} />
          </button>
          <div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 12, fontWeight: 700,
              color: dominantMode ? '#E83020' : '#5A5040',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'color 0.25s',
            }}>
              {isHe ? 'הפעל מתח (טריק דרגה חמישית)' : 'Activate Tension (Fifth Degree Trick)'}
            </div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10,
              color: '#8A7E68', letterSpacing: '0.06em', marginTop: 3,
            }}>
              {dominantMode
                ? (isHe ? "Em → E7 (מז'ור + ספטימה קטנה)" : 'Em → E7 (Major + Minor 7th)')
                : (isHe ? 'כרגע: Em — מינורי, רגוע' : 'Currently: Em — minor, soft')}
            </div>
          </div>
        </div>

        {/* ── Chord cards ── */}
        <div style={{ background: '#18152A', padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {progression.map((key, i) => (
              <ChordCard
                key={`${key}-${i}`}
                chordKey={key}
                active={activeIdx === i}
                isHe={isHe}
              />
            ))}
          </div>

          {/* Arrow labels between chords */}
          {dominantMode && (
            <div style={{
              marginTop: 12,
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              color: '#E83020', textTransform: 'uppercase', letterSpacing: '0.14em',
              textAlign: 'center',
            }}>
              {isHe ? '← E7 מושך חזרה ל-Am בכוח מגנטי ←' : '← E7 pulls back to Am with magnetic force ←'}
            </div>
          )}
        </div>

        {/* ── Play button ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={play}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 22px',
              background: isPlaying ? '#1A1A2E' : '#2B50E8',
              color: '#FAF8F0', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
          >
            {isPlaying ? <IconStop /> : <IconPlay />}
            {isPlaying
              ? (isHe ? 'עצור' : 'Stop')
              : (isHe ? 'נגן' : 'Play')}
          </button>
          <span style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 11,
            color: '#5A5040', letterSpacing: '0.06em',
          }}>
            {dominantMode
              ? (isHe ? 'Am → Dm → E7 → Am (שמע את הפתרון)' : 'Am → Dm → E7 → Am (hear the resolution)')
              : (isHe ? 'Am → Dm → Em (פתוח — אין פתרון)' : 'Am → Dm → Em (open — no resolution)')}
          </span>
        </div>
      </div>
    </div>
  )
}
