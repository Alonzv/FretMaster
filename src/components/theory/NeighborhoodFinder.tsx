import { useState } from 'react'

// ── Circle of Fifths data ─────────────────────────────────────────────────────
const POSITIONS = [
  { major: 'C',   minor: 'Am',  chroma: 0  },
  { major: 'G',   minor: 'Em',  chroma: 7  },
  { major: 'D',   minor: 'Bm',  chroma: 2  },
  { major: 'A',   minor: 'F♯m', chroma: 9  },
  { major: 'E',   minor: 'C♯m', chroma: 4  },
  { major: 'B',   minor: 'G♯m', chroma: 11 },
  { major: 'F♯',  minor: 'D♯m', chroma: 6  },
  { major: 'D♭',  minor: 'B♭m', chroma: 1  },
  { major: 'A♭',  minor: 'Fm',  chroma: 8  },
  { major: 'E♭',  minor: 'Cm',  chroma: 3  },
  { major: 'B♭',  minor: 'Gm',  chroma: 10 },
  { major: 'F',   minor: 'Dm',  chroma: 5  },
]

const N = POSITIONS.length
const wrap = (i: number) => ((i % N) + N) % N

// Diatonic chords for position `sel` (in key of POSITIONS[sel].major):
//  outer[sel-1] = IV,  outer[sel] = I,   outer[sel+1] = V
//  inner[sel-1] = ii,  inner[sel] = vi,  inner[sel+1] = iii
const DEGREES: Record<number, { outer: string; inner: string }> = {
  [-1]: { outer: 'IV', inner: 'ii'  },
  [ 0]: { outer: 'I',  inner: 'vi'  },
  [ 1]: { outer: 'V',  inner: 'iii' },
}

// ── Circle SVG (shared geometry) ─────────────────────────────────────────────
const SVG_SIZE = 282
const CX = 141, CY = 141
const R_OUTER = 134
const R_MID   = 97
const R_INNER = 58

function pt(r: number, deg: number) {
  const a = deg * Math.PI / 180
  return `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`
}
function sector(r1: number, r2: number, pos: number): string {
  const c = pos * 30 - 90
  return `M ${pt(r1,c-15)} L ${pt(r2,c-15)} A ${r2} ${r2} 0 0 1 ${pt(r2,c+15)} L ${pt(r1,c+15)} A ${r1} ${r1} 0 0 0 ${pt(r1,c-15)} Z`
}
function tpos(r: number, pos: number) {
  const a = (pos * 30 - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

// ── Chord card used in side panel ─────────────────────────────────────────────
function ChordCard({
  name, degree, quality, isHe,
}: {
  name: string; degree: string; quality: 'major' | 'minor'; isHe: boolean
}) {
  const isMajor = quality === 'major'
  const degLabel = isHe
    ? { 'I': 'I — טוניקה', 'IV': 'IV — תת-דומיננטה', 'V': 'V — דומיננטה',
        'vi': 'vi', 'ii': 'ii', 'iii': 'iii' }[degree] ?? degree
    : { 'I': 'I — Tonic', 'IV': 'IV — Sub-dominant', 'V': 'V — Dominant',
        'vi': 'vi', 'ii': 'ii', 'iii': 'iii' }[degree] ?? degree

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
    }}>
      <span style={{
        width: 34, height: 34,
        background: isMajor ? '#2B50E8' : '#1A1A2E',
        color: '#FAF8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 700,
        flexShrink: 0, letterSpacing: '-0.02em',
      }}>
        {name}
      </span>
      <span style={{
        fontFamily: 'var(--fm-font-display)', fontSize: 11,
        color: '#5A5040', letterSpacing: '0.06em',
      }}>
        {degLabel}
      </span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NeighborhoodFinder({ isHe }: { isHe: boolean }) {
  const [selected, setSelected] = useState<number>(0)

  const OUTER_MID = (R_MID + R_OUTER) / 2
  const INNER_MID = (R_INNER + R_MID) / 2

  // Neighbourhood: positions sel-1, sel, sel+1
  function offsetOf(i: number): number | null {
    for (const off of [-1, 0, 1]) {
      if (wrap(selected + off) === i) return off
    }
    return null
  }

  const neighbourhood = [-1, 0, 1].map(off => ({
    off,
    outerPos: wrap(selected + off),
    innerPos: wrap(selected + off),
    outerDeg: DEGREES[off].outer,
    innerDeg: DEGREES[off].inner,
  }))

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#F5C200', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מציאת שכנים הרמוניים — בחר סולם' : 'Harmonic Neighborhood — Choose a Key'}
        </span>
      </div>

      <div style={{ padding: '20px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>
        {/* ── SVG Circle ── */}
        <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: 'block', userSelect: 'none', flexShrink: 0 }}>
          {/* Ring backgrounds */}
          <circle cx={CX} cy={CY} r={R_OUTER} fill="#EBE7DF" stroke="#C0B898" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R_MID}   fill="#F4F0E8" stroke="#C0B898" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R_INNER} fill="#FAF8F0" stroke="#C0B898" strokeWidth={1} />

          {/* Outer sectors */}
          {POSITIONS.map((_, i) => {
            const off = offsetOf(i)
            const inNeigh = off !== null
            const fillColor = off === 0  ? '#2B50E8'
              : off === -1 ? 'rgba(43,80,232,0.45)'
              : off === 1  ? 'rgba(43,80,232,0.60)'
              : 'transparent'
            return (
              <path key={`os-${i}`}
                d={sector(R_MID, R_OUTER, i)}
                fill={fillColor}
                stroke="#C0B898" strokeWidth={0.6}
                style={{
                  cursor: 'pointer',
                  opacity: inNeigh ? 1 : 0.35,
                  transition: 'fill 0.2s, opacity 0.2s',
                }}
                onClick={() => setSelected(i)}
              />
            )
          })}

          {/* Inner sectors */}
          {POSITIONS.map((_, i) => {
            const off = offsetOf(i)
            const inNeigh = off !== null
            const fillColor = off === 0  ? 'rgba(26,26,46,0.75)'
              : off !== null ? 'rgba(26,26,46,0.45)'
              : 'transparent'
            return (
              <path key={`is-${i}`}
                d={sector(R_INNER, R_MID, i)}
                fill={fillColor}
                stroke="#C0B898" strokeWidth={0.6}
                style={{
                  cursor: 'pointer',
                  opacity: inNeigh ? 1 : 0.25,
                  transition: 'fill 0.2s, opacity 0.2s',
                }}
                onClick={() => setSelected(i)}
              />
            )
          })}

          {/* Spoke lines */}
          {Array.from({ length: 12 }, (_, i) => {
            const deg = i * 30 - 90 - 15
            const a = deg * Math.PI / 180
            return (
              <line key={`sp-${i}`}
                x1={CX + R_INNER * Math.cos(a)} y1={CY + R_INNER * Math.sin(a)}
                x2={CX + R_OUTER * Math.cos(a)} y2={CY + R_OUTER * Math.sin(a)}
                stroke="#C0B898" strokeWidth={0.8}
              />
            )
          })}

          {/* Major labels with degree overlay */}
          {POSITIONS.map((p, i) => {
            const { x, y } = tpos(OUTER_MID, i)
            const off = offsetOf(i)
            const inNeigh = off !== null
            const deg = inNeigh ? DEGREES[off!].outer : ''
            return (
              <g key={`ml-${i}`} style={{ pointerEvents: 'none' }}>
                <text x={x} y={inNeigh ? y - 5 : y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={off === 0 ? 13 : 11} fontWeight={700}
                  fill={inNeigh ? '#FAF8F0' : '#8A7E68'}
                  fontFamily="var(--fm-font-display)">
                  {p.major}
                </text>
                {inNeigh && (
                  <text x={x} y={y + 8}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={8} fontWeight={600}
                    fill="rgba(255,255,255,0.75)"
                    fontFamily="var(--fm-font-display)">
                    {deg}
                  </text>
                )}
              </g>
            )
          })}

          {/* Minor labels with degree overlay */}
          {POSITIONS.map((p, i) => {
            const { x, y } = tpos(INNER_MID, i)
            const off = offsetOf(i)
            const inNeigh = off !== null
            const deg = inNeigh ? DEGREES[off!].inner : ''
            return (
              <g key={`il-${i}`} style={{ pointerEvents: 'none' }}>
                <text x={x} y={inNeigh ? y - 4 : y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8} fontWeight={600}
                  fill={inNeigh ? '#FAF8F0' : '#8A7E68'}
                  fontFamily="var(--fm-font-display)">
                  {p.minor}
                </text>
                {inNeigh && (
                  <text x={x} y={y + 7}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={7} fontWeight={600}
                    fill="rgba(255,255,255,0.75)"
                    fontFamily="var(--fm-font-display)">
                    {deg}
                  </text>
                )}
              </g>
            )
          })}

          {/* Center */}
          <text x={CX} y={CY - 7} textAnchor="middle" fontSize={8} fill="#8A7E68"
            fontFamily="var(--fm-font-display)" fontWeight={700} style={{ pointerEvents: 'none' }}>
            {isHe ? 'לחץ' : 'CLICK'}
          </text>
          <text x={CX} y={CY + 7} textAnchor="middle" fontSize={8} fill="#8A7E68"
            fontFamily="var(--fm-font-display)" fontWeight={700} style={{ pointerEvents: 'none' }}>
            {isHe ? 'לבחור' : 'TO SELECT'}
          </text>
        </svg>

        {/* ── Chord panel ── */}
        <div style={{ minWidth: 180 }}>
          {/* Key title */}
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 18, fontWeight: 800,
            color: '#1A1A2E', marginBottom: 18, letterSpacing: '-0.02em',
          }}>
            {isHe
              ? `שכונת ${POSITIONS[selected].major} מז'ור`
              : `${POSITIONS[selected].major} Major Neighborhood`}
          </div>

          {/* Major section */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              color: '#2B50E8', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8,
              borderBottom: '2px solid #2B50E8', paddingBottom: 4,
            }}>
              {isHe ? "אקורדים מז'ורים" : 'Major Chords'}
            </div>
            {neighbourhood.map(({ off, outerPos, outerDeg }) => (
              <ChordCard
                key={`out-${off}`}
                name={POSITIONS[outerPos].major}
                degree={outerDeg}
                quality="major"
                isHe={isHe}
              />
            ))}
          </div>

          {/* Minor section */}
          <div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8,
              borderBottom: '1px solid #C0B898', paddingBottom: 4,
            }}>
              {isHe ? 'אקורדים מינוריים' : 'Minor Chords'}
            </div>
            {neighbourhood.map(({ off, innerPos, innerDeg }) => (
              <ChordCard
                key={`in-${off}`}
                name={POSITIONS[innerPos].minor}
                degree={innerDeg}
                quality="minor"
                isHe={isHe}
              />
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: '8px 12px',
            background: '#1A1A2E', color: '#FAF8F0',
            fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            6 {isHe ? 'אקורדים דיאטוניים' : 'diatonic chords'}
          </div>
        </div>
      </div>
    </div>
  )
}
