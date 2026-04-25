import { useState } from 'react'

// ── Circle of Fifths data ─────────────────────────────────────────────────────
// Clockwise from 12 o'clock: C G D A E B F# Db Ab Eb Bb F
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

// ── Circle SVG constants ──────────────────────────────────────────────────────
const SVG_SIZE = 282
const CX = 141, CY = 141
const R_OUTER = 134   // outer edge
const R_MID   = 97    // major/minor boundary
const R_INNER = 58    // inner edge of minor ring

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

// ── Mini power-chord neck ─────────────────────────────────────────────────────
// Root on E string (str6, MIDI 40, chroma 4), fifth on A string (str5), 2 frets up.
// Show 14 fret positions (0-13) so all cases fit.

const MNECK_FRET_W = 28
const MNECK_N      = 14
const MNECK_LEFT   = 32
const MNECK_STR1_Y = 22   // E string (top)
const MNECK_STR2_Y = 44   // A string (bottom)
const MNECK_H      = 66
const MNECK_W      = MNECK_LEFT + MNECK_N * MNECK_FRET_W + MNECK_LEFT
const MNECK_DOT_R  = 9

function mneckX(fret: number) { return MNECK_LEFT + fret * MNECK_FRET_W + MNECK_FRET_W / 2 }

function MiniNeck({ chroma, majorName, isHe }: { chroma: number; majorName: string; isHe: boolean }) {
  // root fret on E string (chroma 4):
  const rootFret  = (chroma - 4 + 12) % 12
  const fifthFret = rootFret + 2
  const fifthName = POSITIONS[(POSITIONS.findIndex(p => p.chroma === chroma) + 1) % 12].major

  return (
    <div style={{ overflowX: 'auto', marginTop: 14 }}>
      <div style={{
        fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
        color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.14em',
        marginBottom: 6, textAlign: 'center',
      }}>
        {isHe
          ? `${majorName} ← שורש  |  ${fifthName} ← קווינטה זכה (+7 סריגים)`
          : `${majorName} ← Root  |  ${fifthName} ← Perfect 5th (+7 frets)`}
      </div>
      <svg width={MNECK_W} height={MNECK_H} style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>
        {/* String labels */}
        <text x={MNECK_LEFT - 4} y={MNECK_STR1_Y + 4} textAnchor="end"
          fontSize={8} fill="#8A7E68" fontFamily="var(--fm-font-display)">E</text>
        <text x={MNECK_LEFT - 4} y={MNECK_STR2_Y + 4} textAnchor="end"
          fontSize={8} fill="#8A7E68" fontFamily="var(--fm-font-display)">A</text>
        {/* Nut */}
        <line x1={MNECK_LEFT} y1={MNECK_STR1_Y - 9} x2={MNECK_LEFT} y2={MNECK_STR2_Y + 9}
          stroke="#1A1A2E" strokeWidth={3} />
        {/* Fret lines */}
        {Array.from({ length: MNECK_N + 1 }, (_, i) => (
          <line key={i}
            x1={MNECK_LEFT + i * MNECK_FRET_W} y1={MNECK_STR1_Y - 8}
            x2={MNECK_LEFT + i * MNECK_FRET_W} y2={MNECK_STR2_Y + 8}
            stroke="#C0B898" strokeWidth={1}
          />
        ))}
        {/* Strings */}
        <line x1={MNECK_LEFT} y1={MNECK_STR1_Y} x2={MNECK_W - MNECK_LEFT + 4} y2={MNECK_STR1_Y}
          stroke="#8A7E68" strokeWidth={1.2} />
        <line x1={MNECK_LEFT} y1={MNECK_STR2_Y} x2={MNECK_W - MNECK_LEFT + 4} y2={MNECK_STR2_Y}
          stroke="#8A7E68" strokeWidth={1.8} />
        {/* Fret numbers */}
        {Array.from({ length: MNECK_N }, (_, i) => (
          <text key={i} x={mneckX(i)} y={MNECK_H - 4}
            textAnchor="middle" fontSize={7} fill="#8A7E68" fontFamily="var(--fm-font-display)">
            {i}
          </text>
        ))}
        {/* Connection line */}
        <line
          x1={mneckX(rootFret)} y1={MNECK_STR1_Y}
          x2={mneckX(fifthFret)} y2={MNECK_STR2_Y}
          stroke="#C0B898" strokeWidth={1} strokeDasharray="3,2"
        />
        {/* Root dot — E string */}
        <circle cx={mneckX(rootFret)} cy={MNECK_STR1_Y} r={MNECK_DOT_R} fill="#2B50E8" />
        <text x={mneckX(rootFret)} y={MNECK_STR1_Y + 4}
          textAnchor="middle" fontSize={8} fill="#FAF8F0"
          fontFamily="var(--fm-font-display)" fontWeight={700}>
          {majorName}
        </text>
        {/* Fifth dot — A string */}
        {fifthFret < MNECK_N && (
          <>
            <circle cx={mneckX(fifthFret)} cy={MNECK_STR2_Y} r={MNECK_DOT_R} fill="#F5C200" />
            <text x={mneckX(fifthFret)} y={MNECK_STR2_Y + 4}
              textAnchor="middle" fontSize={8} fill="#1A1A2E"
              fontFamily="var(--fm-font-display)" fontWeight={700}>
              {fifthName}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CircleClock({ isHe }: { isHe: boolean }) {
  const [selected, setSelected] = useState<number>(0)
  const fifthIdx = (selected + 1) % 12

  const OUTER_MID = (R_MID + R_OUTER) / 2
  const INNER_MID = (R_INNER + R_MID) / 2

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מעגל החמישיות — לחץ על תו' : 'Circle of Fifths — Click a Note'}
        </span>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* ── SVG Circle ── */}
        <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: 'block', userSelect: 'none' }}>
          {/* Ring backgrounds */}
          <circle cx={CX} cy={CY} r={R_OUTER} fill="#EBE7DF" stroke="#C0B898" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R_MID}   fill="#F4F0E8" stroke="#C0B898" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R_INNER} fill="#FAF8F0" stroke="#C0B898" strokeWidth={1} />

          {/* Outer sectors — major */}
          {POSITIONS.map((_, i) => (
            <path key={`os-${i}`}
              d={sector(R_MID, R_OUTER, i)}
              fill={i === selected ? '#2B50E8' : i === fifthIdx ? '#F5C200' : 'transparent'}
              stroke="#C0B898" strokeWidth={0.6}
              style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
              onClick={() => setSelected(i)}
            />
          ))}

          {/* Inner sectors — minor */}
          {POSITIONS.map((_, i) => (
            <path key={`is-${i}`}
              d={sector(R_INNER, R_MID, i)}
              fill={i === selected ? 'rgba(43,80,232,0.1)' : 'transparent'}
              stroke="#C0B898" strokeWidth={0.6}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(i)}
            />
          ))}

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

          {/* Major labels */}
          {POSITIONS.map((p, i) => {
            const { x, y } = tpos(OUTER_MID, i)
            return (
              <text key={`ml-${i}`} x={x} y={y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={i === selected ? 13 : 11} fontWeight={700}
                fill={i === selected ? '#FAF8F0' : i === fifthIdx ? '#1A1A2E' : '#3A3020'}
                fontFamily="var(--fm-font-display)"
                style={{ cursor: 'pointer', pointerEvents: 'none' }}>
                {p.major}
              </text>
            )
          })}

          {/* Minor labels */}
          {POSITIONS.map((p, i) => {
            const { x, y } = tpos(INNER_MID, i)
            return (
              <text key={`il-${i}`} x={x} y={y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fontWeight={600}
                fill={i === selected ? '#2B50E8' : '#8A7E68'}
                fontFamily="var(--fm-font-display)"
                style={{ pointerEvents: 'none' }}>
                {p.minor}
              </text>
            )
          })}

          {/* Center label */}
          <text x={CX} y={CY - 7} textAnchor="middle" fontSize={8} fill="#8A7E68"
            fontFamily="var(--fm-font-display)" fontWeight={700} style={{ pointerEvents: 'none' }}>
            {isHe ? 'מעגל' : 'CIRCLE'}
          </text>
          <text x={CX} y={CY + 7} textAnchor="middle" fontSize={8} fill="#8A7E68"
            fontFamily="var(--fm-font-display)" fontWeight={700} style={{ pointerEvents: 'none' }}>
            {isHe ? 'חמישיות' : 'OF FIFTHS'}
          </text>
        </svg>

        {/* ── Selection info ── */}
        <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{
            background: '#2B50E8', color: '#FAF8F0',
            fontFamily: 'var(--fm-font-display)', fontSize: 12, fontWeight: 700,
            padding: '4px 14px', letterSpacing: '0.08em',
          }}>
            {POSITIONS[selected].major}
          </span>
          <span style={{ color: '#8A7E68', fontFamily: 'var(--fm-font-display)', fontSize: 11 }}>→</span>
          <span style={{
            background: '#F5C200', color: '#1A1A2E',
            fontFamily: 'var(--fm-font-display)', fontSize: 12, fontWeight: 700,
            padding: '4px 14px', letterSpacing: '0.08em',
          }}>
            {POSITIONS[fifthIdx].major} {isHe ? '(שכן הקווינטה)' : '(fifth neighbor)'}
          </span>
        </div>

        {/* ── Mini neck ── */}
        <div style={{ width: '100%', maxWidth: 456 }}>
          <MiniNeck chroma={POSITIONS[selected].chroma} majorName={POSITIONS[selected].major} isHe={isHe} />
        </div>
      </div>
    </div>
  )
}
