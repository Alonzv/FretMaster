import { useState } from 'react'

interface Props { isHe: boolean }

type ScaleType = 'natural' | 'harmonic' | 'melodic'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Open string pitch classes (semitones from C, mod 12): E A D G B E
const OPEN_STRINGS = [4, 9, 2, 7, 11, 4] // index 0 = string 6 (low E), 5 = string 1 (high E)
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E']

const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  natural:  [0, 2, 3, 5, 7, 8, 10],
  harmonic: [0, 2, 3, 5, 7, 8, 11],
  melodic:  [0, 2, 3, 5, 7, 9, 11],
}

const DEGREE_LABELS: Record<ScaleType, string[]> = {
  natural:  ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  harmonic: ['1', '2', 'b3', '4', '5', 'b6', '7'],
  melodic:  ['1', '2', 'b3', '4', '5', '6', '7'],
}

function getDegreeLabel(interval: number, scaleType: ScaleType): string {
  const idx = SCALE_INTERVALS[scaleType].indexOf(interval)
  return idx >= 0 ? DEGREE_LABELS[scaleType][idx] : ''
}

function dotFill(interval: number): string {
  if (interval === 0) return '#E83020'
  if (interval === 3) return '#2B50E8'
  if (interval === 2 || interval === 5 || interval === 7) return '#3E4455'
  if (interval === 8 || interval === 9) return '#C49A00'
  if (interval === 10 || interval === 11) return '#C07020'
  return '#3E4455'
}

function textFill(interval: number): string {
  if (interval === 0) return '#FAF8F0'
  if (interval === 3) return '#FAF8F0'
  if (interval === 2 || interval === 5 || interval === 7) return '#A8B0C0'
  return '#0F1118'
}

function isChangingDot(interval: number, scale: ScaleType): boolean {
  if (scale === 'natural') return false
  if (scale === 'harmonic') return interval === 11
  if (scale === 'melodic') return interval === 9 || interval === 11
  return false
}

// SVG geometry
const SVG_W = 672
const SVG_H = 196
const LEFT = 34
const RIGHT_PAD = 10
const COLS = 13
const FRET_W = (SVG_W - LEFT - RIGHT_PAD) / COLS
const STR_TOP = 30
const STR_GAP = 26
const DOT_R = 10

function fretX(fret: number) { return LEFT + (fret + 0.5) * FRET_W }
function strY(s: number) { return STR_TOP + s * STR_GAP }

export default function MinorScaleComparator({ isHe }: Props) {
  const [rootIdx, setRootIdx] = useState(9) // default A
  const [scale, setScale] = useState<ScaleType>('natural')
  const [animKey, setAnimKey] = useState(0)

  function switchScale(s: ScaleType) {
    if (s === scale) return
    setScale(s)
    setAnimKey(k => k + 1)
  }

  const root = NOTES[rootIdx]

  // Compute dots
  const dots: { str: number; fret: number; interval: number }[] = []
  for (let str = 0; str < 6; str++) {
    for (let fret = 0; fret <= 12; fret++) {
      const pitch = (OPEN_STRINGS[str] + fret) % 12
      const interval = (pitch - rootIdx + 12) % 12
      if (SCALE_INTERVALS[scale].includes(interval)) {
        dots.push({ str, fret, interval })
      }
    }
  }

  const scaleTitles: Record<ScaleType, { he: string; en: string }> = {
    natural:  { he: 'מינור טבעי',  en: 'Natural Minor'  },
    harmonic: { he: 'מינור הרמוני', en: 'Harmonic Minor' },
    melodic:  { he: 'מינור מלודי', en: 'Melodic Minor'  },
  }

  const changeInfo: Record<ScaleType, { he: string; en: string } | null> = {
    natural:  null,
    harmonic: {
      he: 'הדרגה ה-7 עולה מ-b7 ל-7 (Leading Tone). האקורד החמישי הופך למז\'ורי.',
      en: 'Degree 7 raised from b7 to natural 7 (Leading Tone). The V chord becomes major.',
    },
    melodic: {
      he: 'הדרגות 6 ו-7 עולות: b6 הופך ל-6, b7 הופך ל-7. הסולם זהה כמעט למז\'ור מלמעלה.',
      en: 'Degrees 6 and 7 raised: b6 becomes 6, b7 becomes 7. Upper half mirrors the major scale.',
    },
  }

  const tabs: { id: ScaleType; label: string }[] = [
    { id: 'natural',  label: isHe ? 'טבעי'   : 'Natural'  },
    { id: 'harmonic', label: isHe ? 'הרמוני' : 'Harmonic' },
    { id: 'melodic',  label: isHe ? 'מלודי'  : 'Melodic'  },
  ]

  return (
    <div style={{
      background: '#0F1118',
      border: '1px solid #252835',
      padding: '26px 22px 28px',
      fontFamily: 'var(--fm-font-body)',
    }}>
      <style>{`
        @keyframes minorDotGlow {
          0%   { stroke-width: 0; stroke-opacity: 0; }
          35%  { stroke-width: 8; stroke-opacity: 0.85; }
          100% { stroke-width: 0; stroke-opacity: 0; }
        }
        .msc-dot-pulse {
          stroke: #FAF8F0;
          animation: minorDotGlow 0.8s ease-out;
        }
      `}</style>

      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: 12, marginBottom: 20,
      }}>
        <div style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 12, fontWeight: 700,
          color: '#8A90A8',
          textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'השוואת סולמות מינוריים' : 'Minor Scale Comparator'}
        </div>

        {/* Root selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 11, fontWeight: 600,
            color: '#5A6070',
            textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>
            {isHe ? 'שורש' : 'Root'}
          </span>
          <select
            value={rootIdx}
            onChange={e => { setRootIdx(Number(e.target.value)); setAnimKey(k => k + 1) }}
            style={{
              background: '#181B28',
              border: '1px solid #2B50E8',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)',
              fontSize: 14, fontWeight: 700,
              padding: '5px 10px',
              cursor: 'pointer', outline: 'none',
            }}
          >
            {NOTES.map((n, i) => (
              <option key={i} value={i}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '2px solid #252835', marginBottom: 22 }}>
        {tabs.map(tab => {
          const active = tab.id === scale
          return (
            <button
              key={tab.id}
              onClick={() => switchScale(tab.id)}
              style={{
                flex: 1, padding: '11px 8px',
                background: active ? '#2B50E8' : 'transparent',
                color: active ? '#FAF8F0' : '#5A6070',
                border: 'none',
                borderBottom: active ? '2px solid #2B50E8' : '2px solid transparent',
                marginBottom: -2,
                fontFamily: 'var(--fm-font-display)',
                fontSize: 13, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.14s',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Scale title + formula */}
      <div style={{ marginBottom: changeInfo[scale] ? 14 : 20 }}>
        <div style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 13, color: '#8A90A8',
          marginBottom: 10,
        }}>
          <span style={{ color: '#E83020', fontWeight: 700 }}>{root}</span>
          {' '}{isHe ? scaleTitles[scale].he : scaleTitles[scale].en}
        </div>

        {/* Degree pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SCALE_INTERVALS[scale].map((interval, i) => {
            const label = DEGREE_LABELS[scale][i]
            const isNew = isChangingDot(interval, scale)
            return (
              <span key={i} style={{
                fontFamily: 'var(--fm-font-display)',
                fontSize: 13, fontWeight: 700,
                color: interval === 0
                  ? '#E83020'
                  : isNew
                    ? '#F5C200'
                    : interval === 3
                      ? '#7090E8'
                      : '#6A7088',
                background: isNew ? 'rgba(245,194,0,0.10)' : 'transparent',
                padding: '2px 6px',
                border: isNew ? '1px solid rgba(245,194,0,0.35)' : '1px solid transparent',
                transition: 'all 0.25s',
              }}>
                {label}
              </span>
            )
          })}
        </div>
      </div>

      {/* Change annotation */}
      {changeInfo[scale] && (
        <div style={{
          marginBottom: 20,
          padding: '10px 14px',
          background: 'rgba(245,194,0,0.07)',
          border: '1px solid rgba(245,194,0,0.28)',
          fontFamily: 'var(--fm-font-body)',
          fontSize: 13, color: '#C8A800',
          lineHeight: 1.6,
        }}>
          {isHe ? changeInfo[scale]!.he : changeInfo[scale]!.en}
        </div>
      )}

      {/* Fretboard SVG */}
      <div style={{ overflowX: 'auto' }}>
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', minWidth: SVG_W }}
        >
          {/* Position marker shading: frets 3, 5, 7, 9 */}
          {[3, 5, 7, 9].map(f => (
            <rect
              key={`shade${f}`}
              x={LEFT + f * FRET_W}
              y={STR_TOP - 8}
              width={FRET_W}
              height={5 * STR_GAP + 16}
              fill="rgba(255,255,255,0.018)"
            />
          ))}

          {/* Position marker dots at midpoint between strings */}
          {[3, 5, 7, 9].map(f => (
            <circle
              key={`mrkr${f}`}
              cx={LEFT + (f + 0.5) * FRET_W}
              cy={STR_TOP + 2.5 * STR_GAP}
              r={3.5}
              fill="#272A38"
            />
          ))}
          {/* Fret 12 double dot */}
          {[1.5, 3.5].map((offset, i) => (
            <circle
              key={`m12_${i}`}
              cx={LEFT + 12.5 * FRET_W}
              cy={STR_TOP + offset * STR_GAP}
              r={3.5}
              fill="#272A38"
            />
          ))}

          {/* Nut */}
          <rect
            x={LEFT - 1}
            y={STR_TOP - 8}
            width={3}
            height={5 * STR_GAP + 16}
            fill="#7A6A48"
          />

          {/* Fret bars */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map(f => (
            <rect
              key={`fret${f}`}
              x={LEFT + f * FRET_W - 1}
              y={STR_TOP - 6}
              width={2}
              height={5 * STR_GAP + 12}
              fill="#303446"
            />
          ))}

          {/* Strings (low E thickest at top) */}
          {[0, 1, 2, 3, 4, 5].map(str => (
            <line
              key={`str${str}`}
              x1={LEFT}
              y1={strY(str)}
              x2={SVG_W - RIGHT_PAD}
              y2={strY(str)}
              stroke="#404560"
              strokeWidth={str === 0 ? 2.4 : str === 1 ? 1.9 : str === 2 ? 1.5 : str === 3 ? 1.2 : 1}
            />
          ))}

          {/* String name labels */}
          {STRING_NAMES.map((name, str) => (
            <text
              key={`sname${str}`}
              x={LEFT - 7}
              y={strY(str) + 5}
              textAnchor="end"
              fontSize={10}
              fontFamily="var(--fm-font-display)"
              fontWeight={700}
              fill="#4A5068"
            >
              {name}
            </text>
          ))}

          {/* Fret numbers */}
          {[0, 3, 5, 7, 9, 12].map(f => (
            <text
              key={`fnum${f}`}
              x={fretX(f)}
              y={STR_TOP - 14}
              textAnchor="middle"
              fontSize={9}
              fontFamily="var(--fm-font-display)"
              fill="#404560"
            >
              {f === 0 ? 'O' : f}
            </text>
          ))}

          {/* Scale dots */}
          {dots.map(({ str, fret, interval }) => {
            const cx = fretX(fret)
            const cy = strY(str)
            const fill = dotFill(interval)
            const label = getDegreeLabel(interval, scale)
            const shouldAnimate = isChangingDot(interval, scale)

            return (
              <g key={`${animKey}-${str}-${fret}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={DOT_R}
                  fill={fill}
                  className={shouldAnimate ? 'msc-dot-pulse' : ''}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--fm-font-display)"
                  fontWeight={700}
                  fill={textFill(interval)}
                  style={{ pointerEvents: 'none' }}
                >
                  {label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 14,
        marginTop: 18, paddingTop: 14,
        borderTop: '1px solid #252835',
      }}>
        {[
          { color: '#E83020', label: isHe ? 'שורש — 1' : 'Root — 1' },
          { color: '#2B50E8', label: isHe ? 'טרצה קטנה — b3' : 'Minor 3rd — b3' },
          { color: '#3E4455', label: isHe ? 'דרגות 2, 4, 5' : 'Degrees 2, 4, 5' },
          { color: '#C49A00', label: isHe ? 'ד. 6 (b6 / 6) — משתנה' : 'Deg 6 (b6 / 6) — changes' },
          { color: '#C07020', label: isHe ? 'ד. 7 (b7 / 7) — משתנה' : 'Deg 7 (b7 / 7) — changes' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#5A6070' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
