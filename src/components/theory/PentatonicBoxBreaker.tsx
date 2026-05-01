import React, { useState } from 'react'

// ── Geometry ──────────────────────────────────────────────────────────────────
// A minor pentatonic rooted at A on str6 fret5
// Box 1: frets 5-8, strings 1-6 (2 notes per string)
// Extended view: frets 5-17, shows diagonal slide path across all 5 boxes

const FRET_W   = 36
const STR_GAP  = 18
const LEFT     = 32
const TOP      = 18
const STRINGS  = 6

// Box mode: frets 5-9 (5 frets)
const BOX_FRET_COUNT  = 5
const BOX_BASE        = 5

// Extended mode: frets 5-17 (13 frets)
const EXT_FRET_COUNT  = 13
const EXT_BASE        = 5

// A minor pentatonic: semitones above A = 0,3,5,7,10
// Open string semitones: E2=4, A2=9, D3=2, G3=7, B3=11, E4=4
const OPEN_ST: Record<number, number> = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 }
const ROOT_ST  = 9   // A
const PENTA_ST = new Set([0, 3, 5, 7, 10])  // A minor pentatonic mod 12

function notePC(str: number, fret: number): number {
  return (OPEN_ST[str] + fret) % 12
}

function relSt(str: number, fret: number): number {
  return (notePC(str, fret) - ROOT_ST + 12) % 12
}

function isPenta(str: number, fret: number): boolean {
  return PENTA_ST.has(relSt(str, fret))
}

const STR_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']  // index 0 = str1

// ── Box 1 note positions (fret 5-8) ──────────────────────────────────────────
// Per string, the two pentatonic frets in box 1 area
const BOX1_NOTES: { str: number; fret: number }[] = []
for (let s = 1; s <= 6; s++) {
  for (let f = BOX_BASE; f < BOX_BASE + BOX_FRET_COUNT; f++) {
    if (isPenta(s, f)) BOX1_NOTES.push({ str: s, fret: f })
  }
}

// ── Extended diagonal path (slide route) ─────────────────────────────────────
// The classic 3-note-per-string diagonal lick climbing from fret5 to fret17
// Chosen positions that trace the diagonal across all 5 boxes
const SLIDE_PATH: { str: number; fret: number; slide?: boolean }[] = [
  { str: 6, fret: 5  },
  { str: 6, fret: 7, slide: true },
  { str: 5, fret: 5  },
  { str: 5, fret: 7, slide: true },
  { str: 4, fret: 5  },
  { str: 4, fret: 7, slide: true },
  { str: 3, fret: 5  },
  { str: 3, fret: 7, slide: true },
  { str: 2, fret: 6  },
  { str: 2, fret: 8, slide: true },
  { str: 1, fret: 5  },
  { str: 1, fret: 8, slide: true },
  // Continue into next boxes diagonally
  { str: 1, fret: 10 },
  { str: 2, fret: 10 },
  { str: 2, fret: 13, slide: true },
  { str: 3, fret: 12 },
  { str: 3, fret: 14, slide: true },
  { str: 4, fret: 12 },
  { str: 4, fret: 15, slide: true },
  { str: 5, fret: 12 },
  { str: 5, fret: 15, slide: true },
  { str: 6, fret: 12 },
  { str: 6, fret: 15, slide: true },
]

// ── All pentatonic positions in extended window ───────────────────────────────
const EXT_NOTES: { str: number; fret: number }[] = []
for (let s = 1; s <= 6; s++) {
  for (let f = EXT_BASE; f < EXT_BASE + EXT_FRET_COUNT; f++) {
    if (isPenta(s, f)) EXT_NOTES.push({ str: s, fret: f })
  }
}

// ── Box outlines (approximate fret ranges per box) ───────────────────────────
const BOX_COLORS = ['#2B50E8', '#E83020', '#00C896', '#F5C200', '#5A3FD4']
const BOX_RANGES = [
  { start: 5, end: 8  },
  { start: 7, end: 10 },
  { start: 10, end: 12 },
  { start: 12, end: 15 },
  { start: 15, end: 17 },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function PentatonicBoxBreaker({ isHe }: { isHe: boolean }) {
  const [extended, setExtended] = useState(false)

  const fretCount = extended ? EXT_FRET_COUNT : BOX_FRET_COUNT
  const baseF     = extended ? EXT_BASE       : BOX_BASE
  const W         = LEFT + fretCount * FRET_W + 16
  const H         = TOP + (STRINGS - 1) * STR_GAP + 30

  const strY  = (s: number) => TOP + (6 - s) * STR_GAP
  const fretX = (f: number) => LEFT + (f - baseF) * FRET_W + FRET_W / 2

  const displayNotes   = extended ? EXT_NOTES   : BOX1_NOTES

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{
        background: '#1A1A2E', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 4, height: 20, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'שובר הקופסאות — A מינור פנטטוני' : 'Box Breaker — A Minor Pentatonic'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          <button onClick={() => setExtended(false)} style={{
            flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
            background: !extended ? '#2B50E8' : '#1A1A2E',
            color: '#FAF8F0',
            fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {isHe ? 'קופסה 1 בלבד' : 'Box 1 Only'}
          </button>
          <button onClick={() => setExtended(true)} style={{
            flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
            background: extended ? '#E83020' : '#1A1A2E',
            color: '#FAF8F0',
            fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {isHe ? 'Extend — נגינה אלכסונית' : 'Extend — Diagonal Playing'}
          </button>
        </div>

        {/* Description strip */}
        <div style={{
          padding: '8px 14px', marginBottom: 14,
          background: extended ? 'rgba(232,48,32,0.09)' : 'rgba(43,80,232,0.08)',
          borderInlineStart: `4px solid ${extended ? '#E83020' : '#2B50E8'}`,
          fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
          lineHeight: 1.6,
        }}>
          {extended
            ? (isHe
              ? 'כל חמש הקופסאות פרוסות על פני הצוואר. הקווים האלכסוניים מסמנים החלקות (Slides) שמחברות קופסה לקופסה. כך יד זזה ממקום למקום בתנועה אחת.'
              : 'All five boxes spread across the neck. Diagonal lines mark slides connecting box to box — one fluid hand motion from fret 5 to fret 17.')
            : (isHe
              ? 'קופסה 1 — שני תווים על כל מיתר. לחץ "Extend" כדי לראות כיצד הסולם נמתח לאורך כל הצוואר.'
              : 'Box 1 — two notes per string. Press "Extend" to see how the scale stretches across the entire neck.')}
        </div>

        {/* Fretboard */}
        <div style={{ overflowX: 'auto', marginBottom: 14 }}>
          <svg width={W} height={H}
            style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>

            {/* Box outlines in extended mode */}
            {extended && BOX_RANGES.map((box, bi) => {
              const x1 = LEFT + (box.start - baseF) * FRET_W
              const x2 = LEFT + (box.end   - baseF + 1) * FRET_W
              if (x1 < LEFT || x2 > W - 10) return null
              return (
                <rect key={bi}
                  x={x1} y={TOP - 12}
                  width={x2 - x1} height={(STRINGS - 1) * STR_GAP + 24}
                  fill={`${BOX_COLORS[bi]}14`}
                  stroke={BOX_COLORS[bi]} strokeWidth={1}
                  strokeDasharray="5 3" />
              )
            })}

            {/* Box labels */}
            {extended && BOX_RANGES.map((box, bi) => {
              const midX = LEFT + ((box.start + box.end) / 2 - baseF + 0.5) * FRET_W
              if (midX < LEFT || midX > W - 10) return null
              return (
                <text key={bi} x={midX} y={TOP - 16}
                  textAnchor="middle" fontSize={8} fontWeight={700}
                  fill={BOX_COLORS[bi]} fontFamily="var(--fm-font-display)">
                  {bi + 1}
                </text>
              )
            })}

            {/* Fret lines */}
            {Array.from({ length: fretCount + 1 }, (_, f) => {
              const x = LEFT + f * FRET_W
              return (
                <line key={f} x1={x} y1={TOP - 10} x2={x} y2={TOP + (STRINGS - 1) * STR_GAP + 10}
                  stroke={f === 0 ? '#1A1A2E' : '#C0B898'}
                  strokeWidth={f === 0 ? 3 : 1} />
              )
            })}

            {/* Fret numbers */}
            {Array.from({ length: fretCount }, (_, f) => (
              <text key={f}
                x={LEFT + f * FRET_W + FRET_W / 2} y={H - 4}
                textAnchor="middle" fontSize={7} fill="#8A7E68"
                fontFamily="var(--fm-font-display)">
                {baseF + f}
              </text>
            ))}

            {/* Strings */}
            {[6, 5, 4, 3, 2, 1].map((s, di) => (
              <g key={s}>
                <line x1={LEFT} y1={strY(s)} x2={W - 10} y2={strY(s)}
                  stroke="#8A7E68" strokeWidth={0.8 + di * 0.18} />
                <text x={LEFT - 6} y={strY(s) + 4}
                  textAnchor="end" fontSize={9} fontWeight={700}
                  fill="#8A7E68" fontFamily="var(--fm-font-display)">
                  {STR_LABELS[s - 1]}
                </text>
              </g>
            ))}

            {/* Slide lines in extended mode */}
            {extended && (() => {
              const lines: React.ReactElement[] = []
              for (let i = 0; i < SLIDE_PATH.length - 1; i++) {
                const a = SLIDE_PATH[i]
                const b = SLIDE_PATH[i + 1]
                if (!b.slide) continue
                // Same string slide
                if (a.str === b.str) {
                  const ax = fretX(a.fret)
                  const bx = fretX(b.fret)
                  const y  = strY(a.str)
                  if (ax < W - 10 && bx < W - 10) {
                    lines.push(
                      <line key={i} x1={ax} y1={y} x2={bx} y2={y}
                        stroke="#E83020" strokeWidth={2.5}
                        strokeDasharray="6 3" markerEnd="url(#arr)" />
                    )
                  }
                }
              }
              return lines
            })()}

            {/* Arrow marker definition */}
            <defs>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#E83020" />
              </marker>
            </defs>

            {/* Note dots */}
            {displayNotes.map((n, i) => {
              const cx   = fretX(n.fret)
              const cy   = strY(n.str)
              const isR  = relSt(n.str, n.fret) === 0
              const fill = isR ? '#E83020' : '#2B50E8'
              const lbl  = isR ? 'R' : relSt(n.str, n.fret) === 3 ? 'b3'
                        : relSt(n.str, n.fret) === 5 ? '4'
                        : relSt(n.str, n.fret) === 7 ? '5'
                        : 'b7'
              if (cx > W - 8) return null
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={11} fill={fill} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={8} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {lbl}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { color: '#E83020', label: isHe ? 'שורש (A)' : 'Root (A)' },
            { color: '#2B50E8', label: isHe ? 'תווי הסולם' : 'Scale Tones' },
            ...(extended ? [{ color: '#E83020', label: isHe ? 'החלקה (Slide)' : 'Slide', dashed: true }] : []),
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {'dashed' in item && item.dashed
                ? <div style={{ width: 24, height: 2, borderTop: `2.5px dashed ${item.color}` }} />
                : <div style={{ width: 10, height: 10, background: item.color, borderRadius: '50%', flexShrink: 0 }} />
              }
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10,
                color: '#2A2820', letterSpacing: '0.05em',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
