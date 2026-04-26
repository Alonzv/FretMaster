import { useState } from 'react'

// ── Geometry ──────────────────────────────────────────────────────────────────
const W         = 380
const H         = 220
const LEFT      = 48    // x of nut
const RIGHT     = W - 16
const STR_GAP   = 26
const TOP_STR   = 32    // y of string 6 (low E)
const FRET_W    = (RIGHT - LEFT) / 12
const N_FRETS   = 12

// str: 6=top(low E), 1=bottom(high e)
const strY  = (s: number) => TOP_STR + (6 - s) * STR_GAP
const fretX = (f: number) => LEFT + f * FRET_W

// Standard tuning open notes
const OPEN_NOTE = ['e','B','G','D','A','E'] // str1..str6, index 0=str1
const STR_LABEL = (s: number) => OPEN_NOTE[s - 1] // s=1→'e', s=6→'E'

// Intervals between strings (str6→5, 5→4, 4→3, 3→2, 2→1)
// All Perfect 4th (5 st) except G→B which is Major 3rd (4 st)
const INTERVAL_LABEL = (idx: number) => idx === 3 ? 'M3 (4 st)' : 'P4 (5 st)'

export default function TuningAnomalyVisualizer({ isHe }: { isHe: boolean }) {
  // ruler dragged by user: fret column 0-11
  const [rulerFret, setRulerFret] = useState(4)
  const [dragging, setDragging] = useState(false)

  // Convert SVG x → nearest fret
  const xToFret = (svgX: number) => {
    const f = Math.round((svgX - LEFT) / FRET_W)
    return Math.max(0, Math.min(N_FRETS - 1, f))
  }

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    setRulerFret(xToFret(svgX))
  }
  const onTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const svgX = ((e.touches[0].clientX - rect.left) / rect.width) * W
    setRulerFret(xToFret(svgX))
  }

  // The "ruler" is a vertical line at rulerFret.
  // On each string, we show the dot where the ruler lands.
  // The anomaly: going from str3→str2, the dot shifts LEFT by 1 fret.
  // We visualise this as the ruler "bending" rightward for strings 2 and 1
  // (i.e., to keep the same note the finger must be 1 fret further right).

  const rulerX    = fretX(rulerFret) + FRET_W / 2
  const anomalyX  = fretX(Math.min(rulerFret + 1, N_FRETS - 1)) + FRET_W / 2

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#E83020', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'תעלומת הכיוון — נקודת השבר של מיתר B' : 'Tuning Anomaly — The B-String Breaking Point'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        <p style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, color: '#5A5242',
          letterSpacing: '0.05em', lineHeight: 1.6, marginBottom: 14,
        }}>
          {isHe
            ? 'גרור את הקו האנכי. שים לב כיצד הוא נשבר ימינה בין מיתר G למיתר B.'
            : 'Drag the vertical ruler. Watch how it bends right between the G and B strings.'}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <svg
            width={W} height={H}
            style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC', cursor: 'col-resize', touchAction: 'none' }}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onMouseMove={onMouseMove}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
            onTouchMove={onTouchMove}
          >
            {/* Fret lines */}
            {Array.from({ length: N_FRETS + 1 }, (_, f) => (
              <line key={f}
                x1={fretX(f)} y1={TOP_STR - 12} x2={fretX(f)} y2={TOP_STR + 5 * STR_GAP + 12}
                stroke={f === 0 ? '#1A1A2E' : '#D8D0BC'}
                strokeWidth={f === 0 ? 3 : 1} />
            ))}

            {/* Strings */}
            {[6, 5, 4, 3, 2, 1].map((s, di) => (
              <line key={s}
                x1={LEFT} y1={strY(s)} x2={RIGHT} y2={strY(s)}
                stroke="#8A7E68" strokeWidth={0.8 + di * 0.18} />
            ))}

            {/* String labels */}
            {[6, 5, 4, 3, 2, 1].map(s => (
              <text key={s} x={LEFT - 8} y={strY(s) + 4}
                textAnchor="end" fontSize={9} fontWeight={700}
                fill={s === 2 ? '#E83020' : '#8A7E68'}
                fontFamily="var(--fm-font-display)">
                {STR_LABEL(s)}
              </text>
            ))}

            {/* Interval badges between strings */}
            {[6, 5, 4, 3, 2].map((s, idx) => {
              const isAnomaly = idx === 3 // G→B
              return (
                <g key={s}>
                  <rect
                    x={RIGHT - 60} y={(strY(s) + strY(s - 1)) / 2 - 7}
                    width={56} height={14}
                    fill={isAnomaly ? '#E83020' : '#1A1A2E'} />
                  <text
                    x={RIGHT - 32} y={(strY(s) + strY(s - 1)) / 2 + 4}
                    textAnchor="middle" fontSize={8} fontWeight={700}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {INTERVAL_LABEL(idx)}
                  </text>
                </g>
              )
            })}

            {/* Ruler — vertical line that bends at G/B boundary */}
            {/* Segment: str6, 5, 4, 3 — straight at rulerX */}
            <line
              x1={rulerX} y1={TOP_STR - 8}
              x2={rulerX} y2={strY(2) + STR_GAP / 2}
              stroke="#2B50E8" strokeWidth={2.5} strokeDasharray="4 2" />

            {/* Bend indicator: diagonal from G-region to B-region */}
            <line
              x1={rulerX}  y1={strY(2) + STR_GAP / 2}
              x2={anomalyX} y2={strY(2) - STR_GAP / 2}
              stroke="#F5C200" strokeWidth={2.5} />

            {/* Segment: str2, 1 — shifted right by 1 fret */}
            <line
              x1={anomalyX} y1={strY(2) - STR_GAP / 2}
              x2={anomalyX} y2={TOP_STR + 5 * STR_GAP + 8}
              stroke="#2B50E8" strokeWidth={2.5} strokeDasharray="4 2" />

            {/* Dots on each string */}
            {[6, 5, 4, 3].map(s => (
              <circle key={s} cx={rulerX} cy={strY(s)} r={6}
                fill="#2B50E8" />
            ))}
            {[2, 1].map(s => (
              <circle key={s} cx={anomalyX} cy={strY(s)} r={6}
                fill="#E83020" />
            ))}

            {/* Fret number label */}
            <text x={rulerX} y={H - 6} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="#2B50E8"
              fontFamily="var(--fm-font-display)">
              {isHe ? `סריג ${rulerFret}` : `Fret ${rulerFret}`}
            </text>
            <text x={anomalyX} y={H - 6} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="#E83020"
              fontFamily="var(--fm-font-display)">
              {rulerFret !== Math.min(rulerFret + 1, N_FRETS - 1)
                ? (isHe ? `סריג ${rulerFret + 1}` : `Fret ${rulerFret + 1}`)
                : ''}
            </text>

            {/* Anomaly label */}
            <rect x={LEFT + 2} y={strY(2) - 9} width={76} height={16} fill="#E83020" />
            <text x={LEFT + 40} y={strY(2) + 3}
              textAnchor="middle" fontSize={8} fontWeight={700}
              fill="#FAF8F0" fontFamily="var(--fm-font-display)">
              {isHe ? 'נקודת השבר' : 'BREAK POINT'}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            { color: '#2B50E8', label: isHe ? 'קוורטה זכה (5 סריגים)' : 'Perfect 4th (5 frets)' },
            { color: '#E83020', label: isHe ? 'טרצה גדולה — G→B (4 סריגים!)' : 'Major 3rd — G→B (4 frets!)' },
            { color: '#F5C200', label: isHe ? 'הסטת סריג אחד קדימה' : 'Shift 1 fret forward' },
          ].map(item => (
            <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 3, background: item.color, flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820',
                letterSpacing: '0.05em',
              }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
