import { useState } from 'react'

// ── Theory ───────────────────────────────────────────────────────────────────
// Triad inversions on strings 1-2-3 (high strings), fret positions.
// Root position: root on str3, 3rd on str2, 5th on str1
// 1st inversion:  3rd on str3, 5th on str2, root on str1
// 2nd inversion: 5th on str3, root on str2, 3rd on str1
//
// We show C Major triads as the canonical example, slid by rootFret.
// C Major notes: C(0), E(4), G(7) semitones
// Open: str3=G(0st), str2=B(19st), str1=e(24st)
// So for root position at fret r on str3 (C = fret 5):
//   str3 fret: r         (root C)
//   str2 fret: r+1       (3rd E, adjusted +1 for B-string anomaly → C is at str3/f5, E at str2/f5, but str2 needs +1)
//   Actually let's hardcode the shapes for all 3 inversions and slide them.

// Shapes: [str3_offset, str2_offset, str1_offset] relative to a base fret
// Root position (C at fret 5 on str3): str3=5(C), str2=5(E), str1=3(G)
// 1st inversion  (E at fret 9 on str3 becomes root E at bottom): str3=9(E), str2=8(G? no)
// Let's use actual fret positions:
// Root pos: C=str3/f5, E=str2/f5, G=str1/f3  → offsets from base fret 3: [+2, +2, 0]
// 1st inv:  E=str3/f9, G=str2/f8, C=str1/f8  → offsets from base fret 8: [+1, 0, 0]
// 2nd inv:  G=str3/f12, C=str2/f13, E=str1/f12 → offsets from base fret 12: [0,+1,0]

// Let's just define each shape as {str3, str2, str1} deltas and a base fret.
// We'll let user slide the base fret to see the shapes travel up the neck.

interface TriadShape {
  label: string
  labelHe: string
  noteNames: [string, string, string] // str3, str2, str1
  // fret offsets relative to base [str3, str2, str1]
  offsets: [number, number, number]
  baseOffset: number // where on the neck this shape naturally sits (for C major)
}

const SHAPES: TriadShape[] = [
  {
    label:     'Root Position',
    labelHe:   'מצב יסודי',
    noteNames: ['C (root)', 'E (3rd)', 'G (5th)'],
    offsets:   [2, 2, 0],
    baseOffset: 3,
  },
  {
    label:     '1st Inversion',
    labelHe:   'היפוך ראשון',
    noteNames: ['E (3rd)', 'G (5th)', 'C (root)'],
    offsets:   [1, 0, 0],
    baseOffset: 8,
  },
  {
    label:     '2nd Inversion',
    labelHe:   'היפוך שני',
    noteNames: ['G (5th)', 'C (root)', 'E (3rd)'],
    offsets:   [0, 1, 0],
    baseOffset: 12,
  },
]

// ── Geometry ──────────────────────────────────────────────────────────────────
const W       = 380
const H       = 160
const LEFT    = 52
const RIGHT   = W - 16
const STR_GAP = 28
const TOP_STR = 28   // y of str3 (top of our display — strings 3,2,1)
const SHOW_FRETS = 15
const FRET_W  = (RIGHT - LEFT) / SHOW_FRETS

const strY  = (s: number) => TOP_STR + (3 - s) * STR_GAP   // s=3→top, s=1→bottom
const fretX = (f: number) => LEFT + f * FRET_W + FRET_W / 2

const DOT_COLORS = ['#2B50E8', '#E83020', '#F5C200']

export default function TriadInversionNavigator({ isHe }: { isHe: boolean }) {
  const [shapeIdx, setShapeIdx] = useState(0)
  // Window: left edge fret (0-based)
  const shape = SHAPES[shapeIdx]

  // Actual frets for each string
  const baseFret = shape.baseOffset
  const frets = shape.offsets.map(o => baseFret + o) as [number, number, number]
  const strMap: Record<number, number> = { 3: frets[0], 2: frets[1], 1: frets[2] }

  // We'll display frets 0..SHOW_FRETS
  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#E83020', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'טריאדה C מז׳ור — שלושת ההיפוכים' : 'C Major Triad — Three Inversions'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        {/* Shape selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {SHAPES.map((s, i) => (
            <button key={i} onClick={() => setShapeIdx(i)} style={{
              flex: 1, padding: '7px 4px', border: 'none', cursor: 'pointer',
              background: i === shapeIdx ? '#2B50E8' : '#1A1A2E',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {isHe ? s.labelHe : s.label}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H}
            style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>

            {/* Fret lines */}
            {Array.from({ length: SHOW_FRETS + 1 }, (_, f) => (
              <line key={f}
                x1={LEFT + f * FRET_W} y1={TOP_STR - 12}
                x2={LEFT + f * FRET_W} y2={TOP_STR + 2 * STR_GAP + 12}
                stroke={f === 0 ? '#1A1A2E' : '#D8D0BC'}
                strokeWidth={f === 0 ? 3 : 1} />
            ))}

            {/* Position markers */}
            {[3, 5, 7, 9, 12].map(f => (
              <circle key={f}
                cx={LEFT + f * FRET_W + FRET_W / 2}
                cy={TOP_STR + STR_GAP}
                r={3} fill="#D8D0BC" />
            ))}

            {/* Fret numbers */}
            {[0,3,5,7,9,12,15].map(f => (
              <text key={f}
                x={LEFT + f * FRET_W + FRET_W / 2} y={H - 4}
                textAnchor="middle" fontSize={8} fill="#8A7E68"
                fontFamily="var(--fm-font-display)">{f}</text>
            ))}

            {/* Strings 3, 2, 1 */}
            {[3, 2, 1].map((s, di) => (
              <line key={s}
                x1={LEFT} y1={strY(s)} x2={RIGHT} y2={strY(s)}
                stroke="#8A7E68" strokeWidth={0.8 + (2 - di) * 0.2} />
            ))}

            {/* String labels */}
            {[3, 2, 1].map(s => (
              <text key={s} x={LEFT - 8} y={strY(s) + 4}
                textAnchor="end" fontSize={9} fontWeight={700}
                fill="#8A7E68" fontFamily="var(--fm-font-display)">
                {s === 3 ? 'G' : s === 2 ? 'B' : 'e'}
              </text>
            ))}

            {/* Highlight window: bracket around the shape */}
            {(() => {
              const minFret = Math.min(...frets)
              const maxFret = Math.max(...frets)
              const x1 = LEFT + minFret * FRET_W - 4
              const x2 = LEFT + (maxFret + 1) * FRET_W + 4
              return (
                <rect x={x1} y={TOP_STR - 14} width={x2 - x1}
                  height={2 * STR_GAP + 28}
                  fill="rgba(43,80,232,0.07)" stroke="#2B50E8"
                  strokeWidth={1.5} rx={2} />
              )
            })()}

            {/* Note dots */}
            {([3, 2, 1] as const).map((s, di) => {
              const f = strMap[s]
              const cx = fretX(f)
              const cy = strY(s)
              const col = DOT_COLORS[di]
              return (
                <g key={s}>
                  <circle cx={cx} cy={cy} r={11} fill={col} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={8} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {shape.noteNames[di].split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Note labels */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {([3, 2, 1] as const).map((s, di) => (
            <div key={s} style={{
              flex: 1, padding: '8px 10px',
              background: '#1A1A2E', borderInlineStart: `3px solid ${DOT_COLORS[di]}`,
            }}>
              <div style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
                color: '#8A7E68', letterSpacing: '0.1em', marginBottom: 2,
              }}>
                {isHe ? `מיתר ${s}` : `String ${s}`} · {isHe ? `סריג ${strMap[s]}` : `Fret ${strMap[s]}`}
              </div>
              <div style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                color: '#FAF8F0', letterSpacing: '0.05em',
              }}>
                {shape.noteNames[di]}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#5A5242',
          letterSpacing: '0.05em', lineHeight: 1.6, marginTop: 12,
        }}>
          {isHe
            ? 'שלושת ההיפוכים אינם "אקורדים שונים" — הם אותם שלושה תווים בסדר שונה. שימו לב כיצד הם נשארים באותו אזור בצוואר.'
            : 'All three inversions are not "different chords" — they are the same three notes in a different order. Notice how they all stay in the same region of the neck.'}
        </p>
      </div>
    </div>
  )
}
