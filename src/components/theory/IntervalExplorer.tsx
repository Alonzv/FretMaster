import { useEffect, useRef, useState } from 'react'

// ── Music data ────────────────────────────────────────────────────────────────

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Open-string MIDI: low E(40) A(45) D(50) G(55) B(59) high-e(64)
const OPEN_MIDI = [40, 45, 50, 55, 59, 64]

// String labels displayed top-to-bottom (high e → low E)
const STR_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']

// String stroke widths top-to-bottom (thin high-e → thick low-E)
const STR_WIDTHS = [0.65, 0.9, 1.1, 1.4, 1.75, 2.1]

const INTERVALS = [
  { s: 1,  en: 'Minor 2nd',   he: 'סקונדה קטנה',  abbr: 'm2' },
  { s: 2,  en: 'Major 2nd',   he: 'סקונדה גדולה', abbr: 'M2' },
  { s: 3,  en: 'Minor 3rd',   he: 'טרצה קטנה',    abbr: 'm3' },
  { s: 4,  en: 'Major 3rd',   he: 'טרצה גדולה',   abbr: 'M3' },
  { s: 5,  en: 'Perfect 4th', he: 'קוורטה זכה',   abbr: 'P4' },
  { s: 6,  en: 'Tritone',     he: 'טריטון',        abbr: 'TT' },
  { s: 7,  en: 'Perfect 5th', he: 'קווינטה זכה',  abbr: 'P5' },
  { s: 8,  en: 'Minor 6th',   he: 'ספיטה קטנה',   abbr: 'm6' },
  { s: 9,  en: 'Major 6th',   he: 'ספיטה גדולה',  abbr: 'M6' },
  { s: 10, en: 'Minor 7th',   he: 'ספטימה קטנה',  abbr: 'm7' },
  { s: 11, en: 'Major 7th',   he: 'ספטימה גדולה', abbr: 'M7' },
  { s: 12, en: 'Octave',      he: 'אוקטבה',        abbr: 'P8' },
]

// ── SVG fretboard geometry ────────────────────────────────────────────────────

const L_PAD    = 28   // left: string label column
const OPEN_W   = 26   // open-string zone width (before nut)
const FRET_W   = 44   // width per fret cell
const N_FRETS  = 12
const STR_GAP  = 22   // px between strings
const TOP_PAD  = 24   // room for fret labels
const BOT_PAD  = 10
const DOT_R    = 9    // note dot radius
const N_STR    = 6

const FB_X0 = L_PAD + OPEN_W            // x of nut line
const FB_Y0 = TOP_PAD                   // y of top string (high e, vi=0)
const FB_Y1 = TOP_PAD + (N_STR - 1) * STR_GAP  // y of bottom string (low E, vi=5)

const SVG_W = L_PAD + OPEN_W + N_FRETS * FRET_W  // 582
const SVG_H = TOP_PAD + (N_STR - 1) * STR_GAP + BOT_PAD  // 146

/** Y coord for visual string index (vi=0 = high e at top, vi=5 = low E at bottom) */
const strY = (vi: number) => TOP_PAD + vi * STR_GAP

/** X center of a fret cell.  fret=0 → open zone; fret≥1 → between fret lines. */
const fretCX = (fret: number) =>
  fret === 0
    ? L_PAD + OPEN_W / 2
    : FB_X0 + (fret - 1) * FRET_W + FRET_W / 2

/** X of the fret line to the right of fret-cell N. */
const fretLineX = (n: number) => FB_X0 + n * FRET_W

// Standard position-marker frets
const POS_MARKS    = [3, 5, 7, 9]
const DBL_MARK     = 12

// ── Helpers ───────────────────────────────────────────────────────────────────

/** All fretboard positions (fret 0-12) where a given chroma appears. */
function getPositions(chroma: number): { vi: number; fret: number }[] {
  const out: { vi: number; fret: number }[] = []
  for (let si = 0; si < N_STR; si++) {
    for (let f = 0; f <= N_FRETS; f++) {
      if ((OPEN_MIDI[si] + f) % 12 === chroma) {
        out.push({ vi: N_STR - 1 - si, fret: f })  // vi: high-e at top
      }
    }
  }
  return out
}

function midiToHz(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function scheduleNote(
  ctx: AudioContext,
  hz: number,
  startAt: number,
  dur: number,
  vol = 0.26,
) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'triangle'
  osc.frequency.value = hz
  const t0 = ctx.currentTime + startAt
  gain.gain.setValueAtTime(0,   t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.016)
  gain.gain.setValueAtTime(vol, t0 + dur - 0.07)
  gain.gain.linearRampToValueAtTime(0,   t0 + dur)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

// ── SVG sub-components ────────────────────────────────────────────────────────

function Fretboard({
  rootChroma,
  targetChroma,
  rootNote,
  targetNote,
  label,
}: {
  rootChroma: number
  targetChroma: number
  rootNote: string
  targetNote: string
  label: string
}) {
  const rootPos   = getPositions(rootChroma)
  const targetPos = getPositions(targetChroma)

  const targetSet = new Set(targetPos.map(p => `${p.vi},${p.fret}`))
  const rootSet   = new Set(rootPos.map(p => `${p.vi},${p.fret}`))

  const rootOnly   = rootPos.filter(p => !targetSet.has(`${p.vi},${p.fret}`))
  const targetOnly = targetPos.filter(p => !rootSet.has(`${p.vi},${p.fret}`))
  const both       = rootPos.filter(p => targetSet.has(`${p.vi},${p.fret}`))

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ display: 'block', minWidth: 480 }}
      aria-label={label}
      role="img"
    >
      {/* Fretboard fill */}
      <rect
        x={FB_X0} y={FB_Y0}
        width={N_FRETS * FRET_W} height={FB_Y1 - FB_Y0}
        fill="#EBE6DA" opacity={0.5}
      />

      {/* Position marker dots (decorative) */}
      {POS_MARKS.map(f => (
        <circle key={f} cx={fretCX(f)} cy={(FB_Y0 + FB_Y1) / 2} r={3} fill="#C0B898" />
      ))}
      <circle cx={fretCX(DBL_MARK)} cy={FB_Y0 + STR_GAP * 1.5} r={3} fill="#C0B898" />
      <circle cx={fretCX(DBL_MARK)} cy={FB_Y1 - STR_GAP * 1.5} r={3} fill="#C0B898" />

      {/* Fret lines (N=0 → nut, thick) */}
      {Array.from({ length: N_FRETS + 1 }, (_, n) => (
        <line
          key={n}
          x1={fretLineX(n)} y1={FB_Y0}
          x2={fretLineX(n)} y2={FB_Y1}
          stroke={n === 0 ? '#2A2820' : '#C8C0A8'}
          strokeWidth={n === 0 ? 3.5 : 1}
        />
      ))}

      {/* String lines */}
      {STR_LABELS.map((name, vi) => (
        <g key={vi}>
          <line
            x1={L_PAD} y1={strY(vi)}
            x2={SVG_W} y2={strY(vi)}
            stroke="#7A7060"
            strokeWidth={STR_WIDTHS[vi]}
          />
          <text
            x={L_PAD - 5} y={strY(vi) + 4}
            textAnchor="end"
            fontSize={9} fontWeight={600}
            fill="#8A7E68"
            fontFamily="var(--fm-font-display)"
          >
            {name}
          </text>
        </g>
      ))}

      {/* Fret number labels (only at common positions) */}
      {[0, 3, 5, 7, 9, 12].map(f => (
        <text
          key={f}
          x={fretCX(f)} y={FB_Y0 - 7}
          textAnchor="middle"
          fontSize={9} fontWeight={600}
          fill="#8A7E68"
          fontFamily="var(--fm-font-display)"
        >
          {f}
        </text>
      ))}

      {/* Target dots (yellow) — render first so root covers on overlap */}
      {targetOnly.map((p, i) => (
        <g key={`t${i}`}>
          <circle cx={fretCX(p.fret)} cy={strY(p.vi)} r={DOT_R} fill="#F5C200" />
          <text
            x={fretCX(p.fret)} y={strY(p.vi) + 4}
            textAnchor="middle" fontSize={8} fontWeight={700}
            fill="#1A1A2E"
            fontFamily="var(--fm-font-display)"
          >
            {targetNote}
          </text>
        </g>
      ))}

      {/* Root dots (blue) */}
      {rootOnly.map((p, i) => (
        <g key={`r${i}`}>
          <circle cx={fretCX(p.fret)} cy={strY(p.vi)} r={DOT_R} fill="#2B50E8" />
          <text
            x={fretCX(p.fret)} y={strY(p.vi) + 4}
            textAnchor="middle" fontSize={8} fontWeight={700}
            fill="#FFFFFF"
            fontFamily="var(--fm-font-display)"
          >
            {rootNote}
          </text>
        </g>
      ))}

      {/* Both positions (octave case) — blue fill, yellow ring */}
      {both.map((p, i) => (
        <g key={`b${i}`}>
          <circle cx={fretCX(p.fret)} cy={strY(p.vi)} r={DOT_R} fill="#2B50E8" />
          <circle cx={fretCX(p.fret)} cy={strY(p.vi)} r={DOT_R - 1} fill="none" stroke="#F5C200" strokeWidth={2} />
          <text
            x={fretCX(p.fret)} y={strY(p.vi) + 4}
            textAnchor="middle" fontSize={8} fontWeight={700}
            fill="#FFFFFF"
            fontFamily="var(--fm-font-display)"
          >
            {rootNote}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function IconPause() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props { isHe: boolean }

export default function IntervalExplorer({ isHe }: Props) {
  const [rootChroma, setRootChroma] = useState(0)   // C
  const [intIdx,     setIntIdx]     = useState(4)   // Major 3rd
  const [playing,    setPlaying]    = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  const interval    = INTERVALS[intIdx]
  const targetChroma = (rootChroma + interval.s) % 12
  const rootNote    = NOTES[rootChroma]
  const targetNote  = NOTES[targetChroma]

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => { ctxRef.current?.close() }
  }, [])

  const handlePlay = async () => {
    if (playing) return
    setPlaying(true)

    // Create or resume AudioContext (must be inside user gesture)
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') await ctx.resume()

    const rootMidi   = rootChroma + 60   // put root in octave 4
    const targetMidi = rootMidi + interval.s

    const rHz = midiToHz(rootMidi)
    const tHz = midiToHz(targetMidi)

    scheduleNote(ctx, rHz, 0.00, 0.60)   // root alone
    scheduleNote(ctx, tHz, 0.75, 0.60)   // target alone
    scheduleNote(ctx, rHz, 1.50, 1.10)   // both together
    scheduleNote(ctx, tHz, 1.50, 1.10)

    setTimeout(() => setPlaying(false), 2900)
  }

  // Shared label style for selects
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--fm-font-display)',
    fontSize: 10, fontWeight: 700,
    color: '#6A6050',
    textTransform: 'uppercase', letterSpacing: '0.16em',
    marginBottom: 6, display: 'block',
  }

  const selectStyle: React.CSSProperties = {
    fontFamily: 'var(--fm-font-display)',
    fontSize: 14, fontWeight: 700,
    color: '#1A1A2E',
    background: '#FAF8F0',
    border: '2px solid #1A1A2E',
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: 0,
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  }

  const dir = isHe ? 'rtl' : 'ltr'

  return (
    <div
      dir={dir}
      style={{
        marginBottom: 48,
        border: '1px solid #B8B0A0',
        background: '#F0EDE4',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        background: '#1A1A2E',
        padding: '11px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 3, height: 18, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 11, fontWeight: 700,
          color: '#F0EDE8',
          textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'כלי אינטראקטיבי — חוקר אינטרוולים' : 'Interactive — Interval Explorer'}
        </span>
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end',
        }}>
          {/* Root note */}
          <div>
            <label style={labelStyle}>{isHe ? 'תו שורש' : 'Root Note'}</label>
            <div style={{ position: 'relative' }}>
              <select
                value={rootChroma}
                onChange={e => setRootChroma(Number(e.target.value))}
                style={{ ...selectStyle, width: 90 }}
              >
                {NOTES.map((n, i) => (
                  <option key={i} value={i}>{n}</option>
                ))}
              </select>
              {/* Custom arrow */}
              <span style={{
                position: 'absolute',
                insetInlineEnd: 10, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', color: '#1A1A2E', fontSize: 10,
              }}>
                ▼
              </span>
            </div>
          </div>

          {/* Interval */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>{isHe ? 'אינטרוול' : 'Interval'}</label>
            <div style={{ position: 'relative' }}>
              <select
                value={intIdx}
                onChange={e => setIntIdx(Number(e.target.value))}
                style={{ ...selectStyle, width: '100%' }}
              >
                {INTERVALS.map((iv, i) => (
                  <option key={i} value={i}>
                    {isHe ? iv.he : iv.en} ({iv.abbr})
                  </option>
                ))}
              </select>
              <span style={{
                position: 'absolute',
                insetInlineEnd: 10, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', color: '#1A1A2E', fontSize: 10,
              }}>
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* ── Info bar ─────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 14,
          padding: '10px 16px',
          background: '#FAF8F0',
          border: '1px solid #D0C8B4',
          display: 'flex', alignItems: 'center',
          gap: 10, flexWrap: 'wrap',
        }}>
          {/* Root pill */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#2B50E8', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 17, fontWeight: 800, color: '#1A1A2E',
            }}>
              {rootNote}
            </span>
          </span>

          <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 12, color: '#8A7E68', fontWeight: 600 }}>
            +
          </span>

          <span style={{ fontFamily: 'var(--fm-font-body)', fontSize: 14, color: '#4A4030' }}>
            {isHe ? interval.he : interval.en}
          </span>

          <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 12, color: '#8A7E68', fontWeight: 600 }}>
            =
          </span>

          {/* Target pill */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#F5C200', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 17, fontWeight: 800, color: '#1A1A2E',
            }}>
              {targetNote}
            </span>
          </span>

          {/* Semitone count */}
          <span style={{
            marginInlineStart: 'auto',
            fontFamily: 'var(--fm-font-display)',
            fontSize: 11, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.06em',
          }}>
            {interval.s} {isHe ? 'סריגים' : 'semitones'}
          </span>
        </div>
      </div>

      {/* ── Fretboard ────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 20px 0', overflowX: 'auto' }}>
        <Fretboard
          rootChroma={rootChroma}
          targetChroma={targetChroma}
          rootNote={rootNote}
          targetNote={targetNote}
          label={
            isHe
              ? `לוח גיטרה: ${rootNote} עם ${interval.he}`
              : `Guitar fretboard: ${rootNote} with ${interval.en}`
          }
        />
      </div>

      {/* ── Footer: play + legend ─────────────────────────────────────────── */}
      <div style={{
        padding: '14px 20px 18px',
        marginTop: 10,
        borderTop: '1px solid #D8D0BC',
        display: 'flex', alignItems: 'center',
        gap: 14, flexWrap: 'wrap',
      }}>
        {/* Play button */}
        <button
          onClick={handlePlay}
          disabled={playing}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 22px',
            background: playing ? '#3A3A5E' : '#1A1A2E',
            border: 'none',
            color: '#F0EDE8',
            fontFamily: 'var(--fm-font-display)',
            fontSize: 12, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: playing ? 'not-allowed' : 'pointer',
            transition: 'background 0.18s',
            opacity: playing ? 0.75 : 1,
          }}
        >
          {playing ? <IconPause /> : <IconPlay />}
          <span>
            {playing
              ? (isHe ? 'מנגן...' : 'Playing...')
              : (isHe
                  ? `נגן: ${rootNote} → ${targetNote} → יחד`
                  : `Play: ${rootNote} → ${targetNote} → Together`)}
          </span>
        </button>

        {/* Legend */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          marginInlineStart: 'auto',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 13, height: 13, borderRadius: '50%',
              background: '#2B50E8', display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 11, fontWeight: 700, color: '#1A1A2E', letterSpacing: '0.04em',
            }}>
              {rootNote} {isHe ? '(שורש)' : '(Root)'}
            </span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 13, height: 13, borderRadius: '50%',
              background: '#F5C200', display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 11, fontWeight: 700, color: '#1A1A2E', letterSpacing: '0.04em',
            }}>
              {targetNote} ({interval.abbr})
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
