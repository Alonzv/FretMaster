import { useState, useEffect, useRef } from 'react'

// ── Harmonic definitions ──────────────────────────────────────────────────────
interface Harmonic {
  fret: number
  divisions: number      // how many equal parts the string is divided into
  interval: string
  intervalHe: string
  multiplier: number     // freq = fundamental * multiplier
  color: string
  desc: string
  descHe: string
}

const HARMONICS: Harmonic[] = [
  {
    fret: 12,
    divisions: 2,
    interval: 'Octave (×2)',
    intervalHe: 'אוקטבה (×2)',
    multiplier: 2,
    color: '#2B50E8',
    desc: 'Half the string vibrates. Exactly one octave above the open string.',
    descHe: 'חצי המיתר רוטט. גבוה בדיוק אוקטבה אחת מהמיתר הפתוח.',
  },
  {
    fret: 7,
    divisions: 3,
    interval: 'Octave + 5th (×3)',
    intervalHe: 'אוקטבה + קווינטה (×3)',
    multiplier: 3,
    color: '#E83020',
    desc: 'One third of the string vibrates. An octave plus a perfect fifth above.',
    descHe: 'שליש המיתר רוטט. אוקטבה ועוד קווינטה מושלמת מעל.',
  },
  {
    fret: 5,
    divisions: 4,
    interval: '2 Octaves (×4)',
    intervalHe: 'שתי אוקטבות (×4)',
    multiplier: 4,
    color: '#00C896',
    desc: 'One quarter of the string vibrates. Two full octaves above the open string.',
    descHe: 'רבע המיתר רוטט. שתי אוקטבות שלמות מעל המיתר הפתוח.',
  },
]

// ── Audio helpers ─────────────────────────────────────────────────────────────
// Open E string fundamental: 82.41 Hz
const FUNDAMENTAL_HZ = 82.41

function playHarmonic(multiplier: number) {
  const ctx  = new AudioContext()
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.value = FUNDAMENTAL_HZ * multiplier

  gain.gain.setValueAtTime(0.001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 2.5)

  setTimeout(() => ctx.close(), 3000)
}

// ── String vibration SVG ──────────────────────────────────────────────────────
// Shows animated sine waves for each vibrating segment

interface StringVizProps {
  divisions: number
  color: string
  active: boolean
}

function StringViz({ divisions, color, active }: StringVizProps) {
  const W  = 320
  const H  = 60
  const CY = H / 2

  if (!active) {
    // Flat string
    return (
      <svg width={W} height={H} style={{ display: 'block' }}>
        <line x1={0} y1={CY} x2={W} y2={CY} stroke="#4A4A6A" strokeWidth={2} />
      </svg>
    )
  }

  // Draw divisions segments, each with a sine arch
  const segW   = W / divisions
  const amp    = 18

  const paths: string[] = []
  for (let seg = 0; seg < divisions; seg++) {
    const x0 = seg * segW
    const points: string[] = []
    const steps = 40
    for (let i = 0; i <= steps; i++) {
      const t  = i / steps
      const x  = x0 + t * segW
      const y  = CY + amp * Math.sin(Math.PI * t) * (seg % 2 === 0 ? 1 : -1)
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    paths.push(points.join(' '))
  }

  // Node dots
  const nodeDots: number[] = []
  for (let i = 0; i <= divisions; i++) {
    nodeDots.push((i / divisions) * W)
  }

  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      {/* String baseline */}
      <line x1={0} y1={CY} x2={W} y2={CY} stroke="#4A4A6A" strokeWidth={1} />
      {/* Vibration arches */}
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={2.5} opacity={0.85} />
      ))}
      {/* Node points */}
      {nodeDots.map((x, i) => (
        <circle key={i} cx={x} cy={CY} r={5} fill="#FAF8F0" stroke={color} strokeWidth={2} />
      ))}
    </svg>
  )
}

// ── Fretboard SVG ─────────────────────────────────────────────────────────────
// Shows a single string (E6), frets 0-14, with touch points at 5, 7, 12

const FRET_COUNT = 15
const FRET_W_BASE = 28   // fret 0 width (decreasing by ~5.9% each fret)
const STR_Y  = 36
const SVG_H  = 70
const LEFT   = 24

function fretPositions(): number[] {
  // Equal temperament: fret n is at position * (1 - 1/2^(n/12))
  const total = FRET_COUNT * FRET_W_BASE  // approximate total width
  const pos: number[] = [0]
  for (let f = 1; f <= FRET_COUNT; f++) {
    pos.push(total * (1 - Math.pow(2, -f / 12)))
  }
  return pos
}

const FRET_POS = fretPositions()
const SVG_W    = LEFT + FRET_POS[FRET_COUNT] + 16

const TOUCH_FRETS = new Set([5, 7, 12])

interface FretboardProps {
  selected: number | null
  onSelect: (fret: number) => void
}

function FretboardSVG({ selected, onSelect }: FretboardProps) {
  return (
    <svg width={SVG_W} height={SVG_H}
      style={{ display: 'block', background: '#1A1A2E', cursor: 'pointer' }}>

      {/* Fret wires */}
      {Array.from({ length: FRET_COUNT + 1 }, (_, f) => {
        const x = LEFT + FRET_POS[f]
        return (
          <line key={f} x1={x} y1={12} x2={x} y2={SVG_H - 14}
            stroke={f === 0 ? '#FAF8F0' : '#3A3A5A'}
            strokeWidth={f === 0 ? 3 : 1} />
        )
      })}

      {/* String line */}
      <line x1={LEFT} y1={STR_Y} x2={SVG_W - 10} y2={STR_Y}
        stroke="#8A7E68" strokeWidth={1.5} />

      {/* Fret number labels */}
      {[5, 7, 9, 12].map(f => (
        <text key={f}
          x={LEFT + (FRET_POS[f - 1] + FRET_POS[f]) / 2}
          y={SVG_H - 2}
          textAnchor="middle" fontSize={8} fill="#6A6A8A"
          fontFamily="var(--fm-font-display)">
          {f}
        </text>
      ))}

      {/* Touch points */}
      {Array.from(TOUCH_FRETS).map(f => {
        const h     = HARMONICS.find(h => h.fret === f)!
        const midX  = LEFT + (FRET_POS[f - 1] + FRET_POS[f]) / 2
        const isOn  = selected === f
        return (
          <g key={f} onClick={() => onSelect(f)} style={{ cursor: 'pointer' }}>
            <circle cx={midX} cy={STR_Y} r={15}
              fill={isOn ? h.color : '#2A2840'}
              stroke={h.color} strokeWidth={isOn ? 0 : 1.5} />
            <text x={midX} y={STR_Y + 4}
              textAnchor="middle" fontSize={9} fontWeight={800}
              fill="#FAF8F0" fontFamily="var(--fm-font-display)">
              {f}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HarmonicsFretboard({ isHe }: { isHe: boolean }) {
  const [selected, setSelected] = useState<number | null>(null)
  const animRef = useRef<number | null>(null)

  const harmonic = selected !== null ? HARMONICS.find(h => h.fret === selected) ?? null : null

  const handleSelect = (fret: number) => {
    if (selected === fret) {
      setSelected(null)
      return
    }
    setSelected(fret)
    const h = HARMONICS.find(h => h.fret === fret)
    if (h) playHarmonic(h.multiplier)
  }

  // Animate string on selection change
  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
  }, [selected])

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{
        background: '#1A1A2E', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 4, height: 20, background: '#00C896', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'הרמוניקס — מיתר E פתוח' : 'Harmonics — Open E String'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Instruction */}
        <div style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
          color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          {isHe
            ? 'לחץ על סריג 12, 7 או 5 כדי לשמוע ולראות את ההרמוניק'
            : 'Tap fret 12, 7, or 5 to hear and see the harmonic'}
        </div>

        {/* Fretboard */}
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <FretboardSVG selected={selected} onSelect={handleSelect} />
        </div>

        {/* String vibration visualization */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isHe ? 'תנודת המיתר' : 'String Vibration'}
          </div>
          <div style={{
            background: '#1A1A2E', padding: '10px 12px',
            border: `2px solid ${harmonic ? harmonic.color : '#2A2840'}`,
          }}>
            <StringViz
              divisions={harmonic ? harmonic.divisions : 1}
              color={harmonic ? harmonic.color : '#4A4A6A'}
              active={harmonic !== null} />
          </div>
        </div>

        {/* Info panel */}
        {harmonic ? (
          <div style={{
            padding: '12px 16px',
            background: '#1A1A2E',
            borderInlineStart: `4px solid ${harmonic.color}`,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                padding: '4px 12px', background: harmonic.color,
                fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 900,
                color: '#FAF8F0', letterSpacing: '0.06em',
              }}>
                {isHe ? `סריג ${harmonic.fret}` : `Fret ${harmonic.fret}`}
              </div>
              <div style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                color: harmonic.color, letterSpacing: '0.06em',
              }}>
                {isHe ? harmonic.intervalHe : harmonic.interval}
              </div>
              <div style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10,
                color: '#8A7E68',
              }}>
                {(FUNDAMENTAL_HZ * harmonic.multiplier).toFixed(1)} Hz
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#D8D0BC',
              lineHeight: 1.6,
            }}>
              {isHe ? harmonic.descHe : harmonic.desc}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {Array.from({ length: harmonic.divisions }, (_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6,
                  background: i % 2 === 0 ? harmonic.color : `${harmonic.color}44`,
                }} />
              ))}
            </div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, color: '#6A6A8A',
              letterSpacing: '0.08em',
            }}>
              {isHe
                ? `${harmonic.divisions} חלקים שווים — ${harmonic.divisions} קשתות תנודה`
                : `${harmonic.divisions} equal segments — ${harmonic.divisions} vibration arches`}
            </div>
          </div>
        ) : (
          <div style={{
            padding: '12px 16px', background: 'rgba(43,80,232,0.07)',
            borderInlineStart: '4px solid #2B50E8',
            fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
            lineHeight: 1.6,
          }}>
            {isHe
              ? 'בחר סריג למעלה. הנחת אצבע בנקודות גיאומטריות אלה מחלקת את המיתר לחלקים שווים ויוצרת צלילי פעמון.'
              : 'Select a fret above. Touching at these geometric points divides the string into equal segments, producing bell-like tones.'}
          </div>
        )}

        {/* Harmonic series overview */}
        <div style={{ marginTop: 14 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isHe ? 'טבלת הרמוניקס' : 'Harmonics Table'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {HARMONICS.map(h => (
              <div key={h.fret}
                onClick={() => handleSelect(h.fret)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 12px',
                  background: selected === h.fret ? '#1A1A2E' : 'transparent',
                  border: `1px solid ${selected === h.fret ? h.color : '#D8D0BC'}`,
                  cursor: 'pointer',
                }}>
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  background: h.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 900,
                    color: '#FAF8F0',
                  }}>{h.fret}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                    color: selected === h.fret ? h.color : '#1A1A2E',
                    letterSpacing: '0.04em',
                  }}>
                    {isHe ? h.intervalHe : h.interval}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 9,
                    color: '#8A7E68',
                  }}>
                    {(FUNDAMENTAL_HZ * h.multiplier).toFixed(1)} Hz
                    &nbsp;&middot;&nbsp;
                    {isHe ? `${h.divisions} חלקים` : `${h.divisions} segments`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
