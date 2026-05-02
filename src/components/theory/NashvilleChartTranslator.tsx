import { useState } from 'react'

interface Props {
  isHe: boolean
}

// ── Music theory helpers ──────────────────────────────────────────────────────

const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const CHROMATIC_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const PREFER_FLAT     = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'])

// Major scale intervals (semitones from root)
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
// Chord quality suffix per scale degree (1-indexed → index 0-6)
const DEGREE_QUALITY  = ['', 'm', 'm', '', '', 'm', 'dim']

const KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db']

/** Returns an array of 7 chord names for a given major key root. */
function getScaleChords(root: string): string[] {
  const chromatic = PREFER_FLAT.has(root) ? CHROMATIC_FLAT : CHROMATIC_SHARP
  const rootIdx   = chromatic.indexOf(root)
  return MAJOR_INTERVALS.map((semitones, i) => {
    const noteIdx = (rootIdx + semitones) % 12
    return chromatic[noteIdx] + DEGREE_QUALITY[i]
  })
}

// ── Chart data ────────────────────────────────────────────────────────────────

// Nashville number as string (e.g. '1', '6-') → 0-based scale degree index
function degreeIndex(num: string): number {
  const n = parseInt(num.replace('-', ''), 10)
  return n - 1
}

type CellType = 'normal' | 'split' | 'diamond'

interface ChartCell {
  type: CellType
  nums: string[]   // e.g. ['1'], ['6-'], ['4', '5']
}

const CHART_ROWS: ChartCell[][] = [
  [
    { type: 'normal',  nums: ['1']      },
    { type: 'normal',  nums: ['5']      },
    { type: 'normal',  nums: ['6-']     },
    { type: 'normal',  nums: ['4']      },
  ],
  [
    { type: 'normal',  nums: ['1']      },
    { type: 'normal',  nums: ['5']      },
    { type: 'split',   nums: ['4', '5'] },
    { type: 'diamond', nums: ['1']      },
  ],
]

// ── Sub-components ────────────────────────────────────────────────────────────

function DiamondIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }}>
      <polygon points="5,0 10,5 5,10 0,5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  )
}

interface CellProps {
  cell: ChartCell
  chords: string[]
  isHe: boolean
}

function ChartCell({ cell, chords }: CellProps) {
  const accent = '#2B50E8'

  if (cell.type === 'split') {
    const [numA, numB] = cell.nums
    const chordA = chords[degreeIndex(numA)]
    const chordB = chords[degreeIndex(numB)]

    return (
      <div style={{
        flex: 1,
        border: `1.5px solid ${accent}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Number row — two halves */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${accent}`,
          background: `rgba(43,80,232,0.06)`,
        }}>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 4px',
            borderRight: `1px dashed ${accent}`,
          }}>
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 18, fontWeight: 800,
              color: accent,
              letterSpacing: '0.02em',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}>{numA}</span>
          </div>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 4px',
          }}>
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 18, fontWeight: 800,
              color: accent,
              letterSpacing: '0.02em',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}>{numB}</span>
          </div>
        </div>

        {/* Chord row — two halves */}
        <div style={{ display: 'flex', background: '#FAF8F2' }}>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px 4px',
            borderRight: `1px dashed rgba(43,80,232,0.25)`,
          }}>
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 14, fontWeight: 700,
              color: '#1A1A2E',
            }}>{chordA}</span>
          </div>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px 4px',
          }}>
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 14, fontWeight: 700,
              color: '#1A1A2E',
            }}>{chordB}</span>
          </div>
        </div>
      </div>
    )
  }

  const num   = cell.nums[0]
  const chord = chords[degreeIndex(num)]
  const isDiamond = cell.type === 'diamond'
  const numColor = isDiamond ? '#C8A830' : accent
  const borderColor = isDiamond ? '#C8A830' : accent
  const bgColor = isDiamond
    ? 'rgba(200,168,48,0.07)'
    : 'rgba(43,80,232,0.06)'

  return (
    <div style={{
      flex: 1,
      border: `1.5px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Number */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px 8px',
        background: bgColor,
        borderBottom: `1px solid ${borderColor}`,
        gap: 3,
      }}>
        <span style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 18, fontWeight: 800,
          color: numColor,
          letterSpacing: '0.02em',
        }}>{num}</span>
        {isDiamond && <span style={{ color: numColor }}><DiamondIcon /></span>}
      </div>

      {/* Chord name */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px 6px',
        background: '#FAF8F2',
        flex: 1,
      }}>
        <span style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 14, fontWeight: 700,
          color: '#1A1A2E',
          transition: 'color 0.15s',
        }}>{chord}</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NashvilleChartTranslator({ isHe }: Props) {
  const [key, setKey] = useState('C')
  const chords = getScaleChords(key)

  const label = isHe ? 'בחרו סולם:' : 'Select Key:'
  const rowLabel = (i: number) =>
    isHe ? `שורה ${i + 1}` : `Line ${i + 1}`

  return (
    <div style={{
      border: '1px solid #D8D0BC',
      background: '#FDFAF4',
      padding: 0,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: '#F0EBE0',
        borderBottom: '1px solid #D8D0BC',
        direction: isHe ? 'rtl' : 'ltr',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 13, fontWeight: 700,
          color: '#1A1A2E',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {isHe ? 'מתרגם צ\'ארט נאשוויל' : 'Nashville Chart Translator'}
        </div>

        {/* Key selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          direction: 'ltr',
        }}>
          <span style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 12, fontWeight: 600,
            color: '#5A5040',
            letterSpacing: '0.08em',
          }}>
            {label}
          </span>
          <select
            value={key}
            onChange={e => setKey(e.target.value)}
            style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 14, fontWeight: 700,
              color: '#1A1A2E',
              background: '#FDFAF4',
              border: '1.5px solid #2B50E8',
              padding: '5px 10px',
              borderRadius: 0,
              cursor: 'pointer',
              outline: 'none',
              minWidth: 68,
            }}
          >
            {KEYS.map(k => (
              <option key={k} value={k}>{k} Major</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart rows */}
      <div style={{ padding: '20px 20px 24px', direction: 'ltr' }}>

        {/* Legend row */}
        <div style={{
          display: 'flex', gap: 20, marginBottom: 16,
          flexWrap: 'wrap',
          direction: isHe ? 'rtl' : 'ltr',
        }}>
          {[
            { color: '#2B50E8', label: isHe ? 'מספר נאשוויל' : 'Nashville number' },
            { color: '#C8A830', label: isHe ? 'יהלום: נגן ותן להדהד' : 'Diamond: play and let ring' },
          ].map(({ color, label: lbl }) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: color, flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--fm-font-body)',
                fontSize: 11, color: '#5A5040',
              }}>{lbl}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 11, fontWeight: 700,
              color: '#2B50E8',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}>4 5</span>
            <span style={{
              fontFamily: 'var(--fm-font-body)',
              fontSize: 11, color: '#5A5040',
            }}>{isHe ? 'חלוקת תיבה: שני אקורדים' : 'Split bar: two chords'}</span>
          </div>
        </div>

        {CHART_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} style={{ marginBottom: rowIdx < CHART_ROWS.length - 1 ? 12 : 0 }}>
            {/* Row label */}
            <div style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 10, fontWeight: 600,
              color: '#8A7E68',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 6,
              textAlign: isHe ? 'right' : 'left',
            }}>
              {rowLabel(rowIdx)}
            </div>

            {/* Cells */}
            <div style={{ display: 'flex', gap: 6 }}>
              {row.map((cell, cellIdx) => (
                <ChartCell
                  key={cellIdx}
                  cell={cell}
                  chords={chords}
                  isHe={isHe}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div style={{
          marginTop: 18,
          padding: '10px 14px',
          background: 'rgba(43,80,232,0.05)',
          borderLeft: '3px solid #2B50E8',
          direction: isHe ? 'rtl' : 'ltr',
        }}>
          <p style={{
            fontFamily: 'var(--fm-font-body)',
            fontSize: 13, color: '#3A3028',
            lineHeight: 1.6, margin: 0,
          }}>
            {isHe
              ? 'שימו לב: מספרי נאשוויל לא השתנו. רק האקורדים הממשיים התעדכנו לפי הסולם שבחרתם. זוהי בדיוק הכוח של השיטה.'
              : 'Notice: the Nashville numbers did not change. Only the actual chord names updated to match your chosen key. This is exactly the power of the system.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
