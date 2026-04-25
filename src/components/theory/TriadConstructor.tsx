import { useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────

const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const OPEN_MIDI = [40, 45, 50, 55, 59, 64] // low E → high e

const QUALITY_INTERVALS: Record<string, [number, number]> = {
  major:      [4, 7],
  minor:      [3, 7],
  diminished: [3, 6],
  augmented:  [4, 8],
}

const QUALITY_LABELS: Record<string, { he: string; en: string }> = {
  major:      { he: "מז'ורי",  en: 'Major' },
  minor:      { he: 'מינורי', en: 'Minor' },
  diminished: { he: 'מוקטן',  en: 'Diminished' },
  augmented:  { he: 'מוגדל',  en: 'Augmented' },
}

const ROLE_CFG = {
  root:  { fill: '#2B50E8', text: '#FAF8F0', label: { he: 'שורש',   en: 'Root'  } },
  third: { fill: '#E83020', text: '#FAF8F0', label: { he: 'טרצה',   en: 'Third' } },
  fifth: { fill: '#F5C200', text: '#1A1A2E', label: { he: "קווינטה", en: 'Fifth' } },
} as const

type Role = keyof typeof ROLE_CFG

// ── Fretboard geometry ────────────────────────────────────────────────────────

const N_STR   = 6
const N_FRETS = 12
const L_PAD   = 28
const OPEN_W  = 26
const FRET_W  = 36
const STR_GAP = 22
const TOP_PAD = 24
const DOT_R   = 9
const FB_X0   = L_PAD + OPEN_W
const SVG_W   = FB_X0 + N_FRETS * FRET_W + 8
const SVG_H   = TOP_PAD * 2 + (N_STR - 1) * STR_GAP

const strY    = (vi: number)   => TOP_PAD + vi * STR_GAP
const fretCX  = (fret: number) => fret === 0
  ? L_PAD + OPEN_W / 2
  : FB_X0 + (fret - 1) * FRET_W + FRET_W / 2
const fretLineX = (n: number) => FB_X0 + n * FRET_W

// ── Dot finder ────────────────────────────────────────────────────────────────

interface Dot { vi: number; fret: number; role: Role; note: string }

function buildDots(
  rootC: number, thirdC: number, fifthC: number,
  showRoot: boolean, showThird: boolean, showFifth: boolean,
): Dot[] {
  const result: Dot[] = []
  for (let si = 0; si < N_STR; si++) {
    const vi = N_STR - 1 - si
    for (let fret = 0; fret <= N_FRETS; fret++) {
      const chroma = (OPEN_MIDI[si] + fret) % 12
      if (showRoot  && chroma === rootC)  result.push({ vi, fret, role: 'root',  note: NOTES[rootC]  })
      if (showThird && chroma === thirdC) result.push({ vi, fret, role: 'third', note: NOTES[thirdC] })
      if (showFifth && chroma === fifthC) result.push({ vi, fret, role: 'fifth', note: NOTES[fifthC] })
    }
  }
  return result
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TriadConstructor({ isHe }: { isHe: boolean }) {
  const [rootChroma, setRootChroma] = useState(0)
  const [quality,    setQuality]    = useState('major')
  const [showRoot,   setShowRoot]   = useState(true)
  const [showThird,  setShowThird]  = useState(true)
  const [showFifth,  setShowFifth]  = useState(true)

  const lang = isHe ? 'he' : 'en'
  const [thirdSemi, fifthSemi] = QUALITY_INTERVALS[quality]
  const thirdC = (rootChroma + thirdSemi) % 12
  const fifthC  = (rootChroma + fifthSemi)  % 12

  const dots = buildDots(rootChroma, thirdC, fifthC, showRoot, showThird, showFifth)

  const layerVis: Record<Role, boolean> = { root: showRoot, third: showThird, fifth: showFifth }
  const layerToggle: Record<Role, () => void> = {
    root:  () => setShowRoot(p  => !p),
    third: () => setShowThird(p => !p),
    fifth: () => setShowFifth(p => !p),
  }
  const roleNote: Record<Role, string> = {
    root: NOTES[rootChroma], third: NOTES[thirdC], fifth: NOTES[fifthC],
  }

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'בניית טריאדה' : 'Triad Constructor'}
        </span>
      </div>

      <div style={{ padding: '20px 20px 24px' }}>
        {/* ── Root picker ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
            color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8,
          }}>
            {isHe ? 'שורש' : 'Root'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {NOTES.map((n, i) => {
              const active = rootChroma === i
              return (
                <button key={i} onClick={() => setRootChroma(i)} style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                  padding: '3px 9px',
                  background: active ? '#2B50E8' : 'transparent',
                  color: active ? '#FAF8F0' : '#1A1A2E',
                  border: `1.5px solid ${active ? '#2B50E8' : '#C0B898'}`,
                  cursor: 'pointer', letterSpacing: '0.04em',
                  transition: 'all 0.12s',
                }}>{n}</button>
              )
            })}
          </div>
        </div>

        {/* ── Quality picker ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
            color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8,
          }}>
            {isHe ? 'סוג' : 'Quality'}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.keys(QUALITY_INTERVALS).map(q => {
              const active = quality === q
              return (
                <button key={q} onClick={() => setQuality(q)} style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                  padding: '4px 12px',
                  background: active ? '#1A1A2E' : 'transparent',
                  color: active ? '#FAF8F0' : '#1A1A2E',
                  border: `1.5px solid ${active ? '#1A1A2E' : '#C0B898'}`,
                  cursor: 'pointer', letterSpacing: '0.06em',
                  transition: 'all 0.12s',
                }}>
                  {QUALITY_LABELS[q][lang]}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Layer toggles ── */}
        <div style={{ marginBottom: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.keys(ROLE_CFG) as Role[]).map(role => {
            const on  = layerVis[role]
            const cfg = ROLE_CFG[role]
            return (
              <button key={role} onClick={layerToggle[role]} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 12px',
                background: on ? cfg.fill : 'transparent',
                color: on ? cfg.text : '#1A1A2E',
                border: `1.5px solid ${on ? cfg.fill : '#C0B898'}`,
                cursor: 'pointer',
                fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'all 0.12s',
              }}>
                <span>{cfg.label[lang]}</span>
                <span style={{ opacity: 0.7 }}>({roleNote[role]})</span>
              </button>
            )
          })}
        </div>

        {/* ── Fretboard ── */}
        <div style={{ overflowX: 'auto' }}>
          <svg
            width={SVG_W} height={SVG_H}
            style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}
          >
            {/* Nut + fret lines */}
            {Array.from({ length: N_FRETS + 1 }, (_, i) => (
              <line key={i}
                x1={fretLineX(i)} y1={TOP_PAD - 8}
                x2={fretLineX(i)} y2={TOP_PAD + (N_STR - 1) * STR_GAP + 8}
                stroke={i === 0 ? '#1A1A2E' : '#C0B898'}
                strokeWidth={i === 0 ? 3 : 1}
              />
            ))}
            {/* Strings */}
            {Array.from({ length: N_STR }, (_, vi) => (
              <line key={vi}
                x1={L_PAD} y1={strY(vi)} x2={SVG_W - 8} y2={strY(vi)}
                stroke="#8A7E68" strokeWidth={0.7 + vi * 0.28}
              />
            ))}
            {/* Fret position markers */}
            {[3, 5, 7, 9, 12].filter(f => f <= N_FRETS).map(f => (
              <text key={f} x={fretCX(f)} y={SVG_H - 4}
                textAnchor="middle" fontSize={8} fill="#8A7E68"
                fontFamily="var(--fm-font-display)" fontWeight={600}>
                {f}
              </text>
            ))}
            {/* "Open" label */}
            <text x={L_PAD + OPEN_W / 2} y={SVG_H - 4}
              textAnchor="middle" fontSize={7} fill="#8A7E68"
              fontFamily="var(--fm-font-display)" fontWeight={600}>
              0
            </text>
            {/* Note dots */}
            {dots.map((d, i) => {
              const cx  = fretCX(d.fret)
              const cy  = strY(d.vi)
              const cfg = ROLE_CFG[d.role]
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={DOT_R} fill={cfg.fill} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={8} fill={cfg.text}
                    fontFamily="var(--fm-font-display)" fontWeight={700}>
                    {d.note}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── Formula line ── */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
            color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>
            {NOTES[rootChroma]} {QUALITY_LABELS[quality][lang]}:
          </span>
          {(Object.keys(ROLE_CFG) as Role[]).map((role, i) => {
            const cfg  = ROLE_CFG[role]
            const note = roleNote[role]
            return (
              <span key={role} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {i > 0 && <span style={{ color: '#C0B898', fontSize: 13, fontWeight: 700 }}>+</span>}
                <span style={{
                  background: cfg.fill, color: cfg.text,
                  fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                  padding: '2px 8px', letterSpacing: '0.04em',
                }}>
                  {note}
                </span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
