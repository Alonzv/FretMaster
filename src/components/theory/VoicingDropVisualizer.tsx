import { useState } from 'react'

// ── Voicing data ──────────────────────────────────────────────────────────────
// All voicings are for Cmaj7 as the canonical example.
// Strings: 6=low E (top of diagram), 1=high e (bottom).
// x = fret number (0=open).

interface VoicingNote {
  str: number   // 1-6
  fret: number
  role: '1' | '3' | '5' | '7' | 'x'  // x = muted
  label: string  // note name
}

interface Voicing {
  id: string
  label: string
  labelHe: string
  desc: string
  descHe: string
  notes: VoicingNote[]
  mutedStrings: number[]  // strings that are muted
  baseFret: number  // lowest fret shown (for position label)
  color: string
}

const VOICINGS: Voicing[] = [
  {
    id: 'closed',
    label: 'Closed (Dense)',
    labelHe: 'סגור (צפוף)',
    color: '#4A4A6E',
    desc: 'All four notes packed tightly. Impossible to play cleanly on guitar — the low frequencies clash and create "Mud".',
    descHe: 'ארבעת התווים צפופים. קשה לנגן על גיטרה — התדרים הנמוכים מתנגשים ויוצרים "בוץ".',
    baseFret: 7,
    mutedStrings: [6, 5],
    notes: [
      { str: 4, fret: 9,  role: '1', label: 'C'  },
      { str: 3, fret: 9,  role: '3', label: 'E'  },
      { str: 2, fret: 8,  role: '5', label: 'G'  },
      { str: 1, fret: 8,  role: '7', label: 'B'  },
    ],
  },
  {
    id: 'drop2',
    label: 'Drop 2',
    labelHe: 'דרופ 2',
    color: '#2B50E8',
    desc: 'The 5th (G) is dropped an octave to the bass. Result: 5-1-3-7 on strings 4-3-2-1. Clear, balanced, the jazz/funk standard.',
    descHe: 'הקווינטה (G) הופלה אוקטבה לבס. תוצאה: 5-1-3-7 על מיתרים 4-3-2-1. צלול, מאוזן, הסטנדרט של ג\'אז ופאנק.',
    baseFret: 7,
    mutedStrings: [6, 5],
    notes: [
      { str: 4, fret: 10, role: '5', label: 'G'  },
      { str: 3, fret: 9,  role: '1', label: 'C'  },
      { str: 2, fret: 8,  role: '3', label: 'E'  },
      { str: 1, fret: 8,  role: '7', label: 'B'  },
    ],
  },
  {
    id: 'drop3',
    label: 'Drop 3',
    labelHe: 'דרופ 3',
    color: '#E83020',
    desc: 'The 3rd (E) is dropped to the bass string. A string skip is created. Result: deep, piano-like, perfect for chord-melody.',
    descHe: 'הטרצה (E) הופלה למיתר הבס. נוצר דילוג מיתר. תוצאה: עמוק, פסנתרי, מושלם לקורד-מלודי.',
    baseFret: 5,
    mutedStrings: [5],
    notes: [
      { str: 6, fret: 7,  role: '3', label: 'E'  },
      { str: 4, fret: 7,  role: '5', label: 'G'  },
      { str: 3, fret: 9,  role: '1', label: 'C'  },
      { str: 2, fret: 8,  role: '7', label: 'B'  },
    ],
  },
]

// ── Fretboard geometry ────────────────────────────────────────────────────────
const FRET_COUNT = 5   // display 5 frets
const FRET_W     = 52
const STR_GAP    = 18
const LEFT       = 36
const TOP        = 20
const W          = LEFT + FRET_COUNT * FRET_W + 20
const H          = TOP + 5 * STR_GAP + 36

const strY  = (s: number) => TOP + (6 - s) * STR_GAP
const fretX = (f: number, base: number) => LEFT + (f - base) * FRET_W + FRET_W / 2

const ROLE_COLOR: Record<string, string> = {
  '1': '#E83020',  // root — always red
  '3': '#2B50E8',  // third — blue
  '5': '#4A4A6E',  // fifth — grey
  '7': '#F5C200',  // seventh — yellow
  'x': 'transparent',
}

const STR_LABELS = ['e','B','G','D','A','E']  // index 0=str1

export default function VoicingDropVisualizer({ isHe }: { isHe: boolean }) {
  const [selected, setSelected] = useState<string>('drop2')
  const [showLabels, setShowLabels] = useState<'note' | 'role'>('role')

  const voicing = VOICINGS.find(v => v.id === selected)!

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'ויזואליזר Drop Voicings — Cmaj7' : 'Drop Voicings Visualizer — Cmaj7'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Voicing selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {VOICINGS.map(v => (
            <button key={v.id} onClick={() => setSelected(v.id)} style={{
              flex: 1, padding: '9px 6px', border: 'none', cursor: 'pointer',
              background: v.id === selected ? v.color : '#1A1A2E',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {isHe ? v.labelHe : v.label}
            </button>
          ))}
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, justifyContent: 'flex-end' }}>
          {(['note', 'role'] as const).map(mode => (
            <button key={mode} onClick={() => setShowLabels(mode)} style={{
              padding: '5px 12px', border: `1px solid #1A1A2E`, cursor: 'pointer',
              background: showLabels === mode ? '#1A1A2E' : 'transparent',
              color: showLabels === mode ? '#FAF8F0' : '#1A1A2E',
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {mode === 'note'
                ? (isHe ? 'שמות תווים' : 'Note Names')
                : (isHe ? 'תפקיד' : 'Role')}
            </button>
          ))}
        </div>

        {/* Fretboard diagram */}
        <div style={{ overflowX: 'auto', marginBottom: 14 }}>
          <svg width={W} height={H}
            style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>

            {/* Fret lines */}
            {Array.from({ length: FRET_COUNT + 1 }, (_, f) => {
              const x = LEFT + f * FRET_W
              return (
                <line key={f} x1={x} y1={TOP - 10} x2={x} y2={TOP + 5 * STR_GAP + 10}
                  stroke={f === 0 ? '#1A1A2E' : '#C0B898'}
                  strokeWidth={f === 0 ? 3 : 1} />
              )
            })}

            {/* Fret number labels */}
            {Array.from({ length: FRET_COUNT }, (_, f) => (
              <text key={f}
                x={LEFT + f * FRET_W + FRET_W / 2}
                y={H - 4}
                textAnchor="middle" fontSize={8} fill="#8A7E68"
                fontFamily="var(--fm-font-display)">
                {voicing.baseFret + f}
              </text>
            ))}

            {/* Strings */}
            {[6, 5, 4, 3, 2, 1].map((s, di) => {
              const muted = voicing.mutedStrings.includes(s)
              return (
                <g key={s}>
                  <line
                    x1={LEFT} y1={strY(s)} x2={W - 12} y2={strY(s)}
                    stroke={muted ? '#D8D0BC' : '#8A7E68'}
                    strokeWidth={0.8 + di * 0.18}
                    strokeDasharray={muted ? '4 3' : undefined} />
                  {/* String label */}
                  <text x={LEFT - 8} y={strY(s) + 4}
                    textAnchor="end" fontSize={9} fontWeight={700}
                    fill={muted ? '#D8D0BC' : '#8A7E68'}
                    fontFamily="var(--fm-font-display)">
                    {STR_LABELS[s - 1]}
                  </text>
                  {/* Muted X */}
                  {muted && (
                    <text x={LEFT - 20} y={strY(s) + 4}
                      textAnchor="middle" fontSize={10} fontWeight={900}
                      fill="#C0B898" fontFamily="var(--fm-font-display)">
                      x
                    </text>
                  )}
                </g>
              )
            })}

            {/* String-skip indicator for Drop 3 */}
            {voicing.id === 'drop3' && (
              <rect
                x={LEFT + 0.5} y={strY(5) - STR_GAP / 2}
                width={FRET_COUNT * FRET_W - 1} height={STR_GAP}
                fill="rgba(232,48,32,0.07)" stroke="#E83020"
                strokeWidth={1} strokeDasharray="4 2" />
            )}

            {/* Note dots */}
            {voicing.notes.map((n, i) => {
              const cx  = fretX(n.fret, voicing.baseFret - 1)
              const cy  = strY(n.str)
              const col = ROLE_COLOR[n.role]
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={12} fill={col} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={9} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {showLabels === 'note' ? n.label : n.role}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Description */}
        <div style={{
          padding: '10px 14px',
          background: 'rgba(43,80,232,0.07)',
          borderInlineStart: `4px solid ${voicing.color}`,
          fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
          lineHeight: 1.6,
        }}>
          {isHe ? voicing.descHe : voicing.desc}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            { color: '#E83020', label: isHe ? 'שורש (1)' : 'Root (1)' },
            { color: '#2B50E8', label: isHe ? 'טרצה (3)' : '3rd' },
            { color: '#4A4A6E', label: isHe ? 'קווינטה (5)' : '5th' },
            { color: '#F5C200', label: isHe ? 'ספטימה (7)' : '7th' },
          ].map(item => (
            <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: item.color, borderRadius: '50%', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10,
                color: '#2A2820', letterSpacing: '0.05em',
              }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
