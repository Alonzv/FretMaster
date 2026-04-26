import { useState, useRef } from 'react'

// ── MIDI → Hz ─────────────────────────────────────────────────────────────────
const midiHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// ── Score notes (staff position + MIDI) ───────────────────────────────────────
// staffPos: 0=E(line1), 2=G(line2), 3=A(space2), 4=B(line3/mid), 5=C(space3), 6=D(line4), 7=E(space4)
const SCORE_NOTES = [
  { label: 'E', staffPos: 0, midi: 52 },
  { label: 'G', staffPos: 2, midi: 55 },
  { label: 'A', staffPos: 3, midi: 57 },
  { label: 'B', staffPos: 4, midi: 59 },
  { label: 'C', staffPos: 5, midi: 60 },
  { label: 'D', staffPos: 6, midi: 62 },
  { label: "E'", staffPos: 7, midi: 64 },
]

const DURATIONS = [
  { id: 'q' as const, beats: 1, symHe: 'רבע',  symEn: 'Quarter' },
  { id: 'h' as const, beats: 2, symHe: 'חצי',   symEn: 'Half'    },
  { id: 'w' as const, beats: 4, symHe: 'שלם',   symEn: 'Whole'   },
]

interface Slot { noteIdx: number; dur: 'q' | 'h' | 'w' }

const DEFAULT_SLOTS: Slot[] = [
  { noteIdx: 3, dur: 'q' },  // B
  { noteIdx: 2, dur: 'q' },  // A
  { noteIdx: 1, dur: 'q' },  // G
  { noteIdx: 0, dur: 'q' },  // E
]

// ── Staff geometry ─────────────────────────────────────────────────────────────
const GAP     = 11    // staff line gap
const BOT_Y   = 70    // y of line1 (bottom line)
const STAFF_H = 96
const SLOT_W  = 64    // width of each slot column
const CLEF_W  = 52    // width of clef+time sig area
const STAFF_W = CLEF_W + 4 * SLOT_W + 16

const staffY = (pos: number) => BOT_Y - pos * (GAP / 2)

function StaffLines() {
  return (
    <>
      {[0,1,2,3,4].map(i => {
        const y = BOT_Y - i * GAP
        return <line key={i} x1={8} y1={y} x2={STAFF_W - 8} y2={y} stroke="#C0B898" strokeWidth={0.9} />
      })}
    </>
  )
}

const TREBLE = String.fromCodePoint(0x1D11E)

// ── Audio ─────────────────────────────────────────────────────────────────────
function playNote(ctx: AudioContext, hz: number, start: number, dur: number, vol = 0.28) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain); gain.connect(ctx.destination)
  osc.type = 'triangle'
  osc.frequency.value = hz
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(vol, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.9)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconPlay() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
      <path d="M0 0L10 6L0 12V0Z" />
    </svg>
  )
}
function IconStop() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <rect width="10" height="10" />
    </svg>
  )
}

// ── Note SVG (on staff) ───────────────────────────────────────────────────────
function NoteOnStaff({ slot, active }: { slot: Slot; active: boolean }) {
  const note = SCORE_NOTES[slot.noteIdx]
  const ny = staffY(note.staffPos)
  const filled = slot.dur !== 'w'
  const hasStem = slot.dur !== 'w'
  const stemUp = note.staffPos < 5
  const color = active ? '#E83020' : '#1A1A2E'

  const rx = 9, ry = 6.5

  return (
    <g>
      {/* Ledger line for low E (pos 0) */}
      {note.staffPos === 0 && (
        <line x1={SLOT_W / 2 - 14} y1={ny} x2={SLOT_W / 2 + 14} y2={ny}
          stroke={color} strokeWidth={1.2} />
      )}

      {/* Note head */}
      <ellipse cx={SLOT_W / 2} cy={ny} rx={rx} ry={ry}
        fill={filled ? color : 'none'} stroke={color} strokeWidth={1.6}
        transform={`rotate(-15,${SLOT_W / 2},${ny})`} />

      {/* Stem */}
      {hasStem && stemUp && (
        <line x1={SLOT_W / 2 + rx} y1={ny}
          x2={SLOT_W / 2 + rx} y2={ny - 30}
          stroke={color} strokeWidth={1.8} />
      )}
      {hasStem && !stemUp && (
        <line x1={SLOT_W / 2 - rx} y1={ny}
          x2={SLOT_W / 2 - rx} y2={ny + 30}
          stroke={color} strokeWidth={1.8} />
      )}

      {/* Flag for quarter (not for whole/half) */}
      {/* Quarter note has no flag, only eighth does — but we only have q/h/w */}

      {/* Duration label below */}
      <text x={SLOT_W / 2} y={STAFF_H - 4} textAnchor="middle"
        fontSize={8} fill={active ? '#E83020' : '#8A7E68'}
        fontFamily="var(--fm-font-display)">
        {note.label}
      </text>
    </g>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FirstScoreBuilder({ isHe }: { isHe: boolean }) {
  const [slots, setSlots] = useState<Slot[]>(DEFAULT_SLOTS)
  const [activeSlot, setActiveSlot] = useState<number>(0)
  const [selectedNote, setSelectedNote] = useState<number>(3)     // B
  const [selectedDur, setSelectedDur]   = useState<'q'|'h'|'w'>('q')
  const [isPlaying, setIsPlaying]       = useState(false)
  const [playingIdx, setPlayingIdx]     = useState<number | null>(null)
  const ctxRef  = useRef<AudioContext | null>(null)
  const stopRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const BEAT_DUR = 0.45  // seconds per beat

  function applyToSlot() {
    setSlots(prev => {
      const next = [...prev]
      next[activeSlot] = { noteIdx: selectedNote, dur: selectedDur }
      return next
    })
    // advance to next slot
    setActiveSlot(i => Math.min(i + 1, 3))
  }

  function stopPlayback() {
    if (stopRef.current) clearTimeout(stopRef.current)
    try { ctxRef.current?.close() } catch (_) { /* ignore */ }
    ctxRef.current = null
    setIsPlaying(false)
    setPlayingIdx(null)
  }

  function play() {
    if (isPlaying) { stopPlayback(); return }

    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
    const ctx: AudioContext = new AudioCtx()
    ctxRef.current = ctx
    const now = ctx.currentTime

    let cursor = now
    slots.forEach((slot, si) => {
      const durBeats = DURATIONS.find(d => d.id === slot.dur)?.beats ?? 1
      const durSec = durBeats * BEAT_DUR
      const note = SCORE_NOTES[slot.noteIdx]
      playNote(ctx, midiHz(note.midi), cursor, durSec)
      const delay = (cursor - now) * 1000
      setTimeout(() => setPlayingIdx(si), delay)
      cursor += durSec
    })

    const total = cursor - now
    setIsPlaying(true)
    stopRef.current = setTimeout(() => {
      setIsPlaying(false)
      setPlayingIdx(null)
      ctxRef.current?.close()
      ctxRef.current = null
    }, total * 1000 + 300)
  }

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#F5C200', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'בנה תיבה — נגן אותה' : 'Build a Measure — Play It'}
        </span>
      </div>

      <div style={{ padding: '20px 20px 24px' }}>
        {/* ── Score SVG ── */}
        <div style={{ overflowX: 'auto', marginBottom: 18 }}>
          <svg width={STAFF_W} height={STAFF_H} style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>
            <StaffLines />

            {/* Treble clef */}
            <text x={10} y={BOT_Y + 14} fontSize={66}
              fontFamily="'Times New Roman','Palatino',serif"
              fill="#1A1A2E" style={{ userSelect: 'none' }}>
              {TREBLE}
            </text>

            {/* 4/4 time signature */}
            <text x={CLEF_W - 10} y={staffY(6) + 7} fontSize={20} fontWeight={800}
              fill="#1A1A2E" textAnchor="middle" fontFamily="var(--fm-font-display)">4</text>
            <text x={CLEF_W - 10} y={staffY(2) + 7} fontSize={20} fontWeight={800}
              fill="#1A1A2E" textAnchor="middle" fontFamily="var(--fm-font-display)">4</text>

            {/* Slot columns */}
            {slots.map((slot, si) => {
              const slotX = CLEF_W + si * SLOT_W
              const isActive = si === activeSlot && !isPlaying
              const isPlayingThis = si === playingIdx

              return (
                <g key={si}
                  transform={`translate(${slotX}, 0)`}
                  style={{ cursor: isPlaying ? 'default' : 'pointer' }}
                  onClick={() => !isPlaying && setActiveSlot(si)}
                >
                  {/* Slot highlight */}
                  {isActive && (
                    <rect x={2} y={6} width={SLOT_W - 4} height={STAFF_H - 14}
                      fill="rgba(43,80,232,0.08)" stroke="#2B50E8" strokeWidth={1} />
                  )}
                  {isPlayingThis && (
                    <rect x={2} y={6} width={SLOT_W - 4} height={STAFF_H - 14}
                      fill="rgba(232,48,32,0.1)" />
                  )}
                  <NoteOnStaff slot={slot} active={isPlayingThis} />
                </g>
              )
            })}

            {/* Final barline */}
            <line x1={STAFF_W - 12} y1={BOT_Y - 4 * GAP} x2={STAFF_W - 12} y2={BOT_Y}
              stroke="#1A1A2E" strokeWidth={1.5} />
            <line x1={STAFF_W - 8} y1={BOT_Y - 4 * GAP} x2={STAFF_W - 8} y2={BOT_Y}
              stroke="#1A1A2E" strokeWidth={3.5} />
          </svg>
        </div>

        {/* ── Instruction ── */}
        {!isPlaying && (
          <div style={{
            marginBottom: 14,
            fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#8A7E68',
            letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
          }}>
            {isHe
              ? `תיבה ${activeSlot + 1}/4 — בחר תו וקצב, לחץ "הצב"`
              : `Slot ${activeSlot + 1}/4 — pick a note and duration, then "Place"`}
          </div>
        )}

        {/* ── Controls ── */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          {/* Note selector */}
          <div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#5A5040', letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              {isHe ? 'תו' : 'Note'}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {SCORE_NOTES.map((n, ni) => (
                <button key={ni} onClick={() => setSelectedNote(ni)} disabled={isPlaying}
                  style={{
                    width: 32, height: 32, border: 'none', cursor: 'pointer',
                    background: ni === selectedNote ? '#2B50E8' : '#1A1A2E',
                    color: '#FAF8F0',
                    fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                    transition: 'background 0.15s',
                    opacity: isPlaying ? 0.5 : 1,
                  }}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration selector */}
          <div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#5A5040', letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              {isHe ? 'קצב' : 'Duration'}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {DURATIONS.map(d => (
                <button key={d.id} onClick={() => setSelectedDur(d.id)} disabled={isPlaying}
                  style={{
                    height: 32, padding: '0 10px', border: 'none', cursor: 'pointer',
                    background: d.id === selectedDur ? '#2B50E8' : '#1A1A2E',
                    color: '#FAF8F0',
                    fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    transition: 'background 0.15s',
                    opacity: isPlaying ? 0.5 : 1,
                  }}>
                  {isHe ? d.symHe : d.symEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          {!isPlaying && (
            <button
              onClick={applyToSlot}
              style={{
                padding: '10px 18px',
                background: '#2B50E8', border: 'none', color: '#FAF8F0',
                fontFamily: 'var(--fm-font-display)', fontSize: 12, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {isHe ? 'הצב' : 'Place'}
            </button>
          )}

          <button
            onClick={play}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px',
              background: isPlaying ? '#E83020' : '#1A1A2E',
              border: 'none', color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            {isPlaying ? <IconStop /> : <IconPlay />}
            {isPlaying ? (isHe ? 'עצור' : 'Stop') : (isHe ? 'נגן' : 'Play')}
          </button>

          {!isPlaying && (
            <button
              onClick={() => { setSlots(DEFAULT_SLOTS); setActiveSlot(0) }}
              style={{
                padding: '10px 14px',
                background: 'transparent', border: '1px solid #C0B898', color: '#5A5040',
                fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {isHe ? 'אפס' : 'Reset'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
