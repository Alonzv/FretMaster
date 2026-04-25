import { useState } from 'react'

// ── Chord diagram geometry ────────────────────────────────────────────────────

const LEFT_PAD     = 28
const TOP_PAD      = 44
const STR_SPACING  = 22
const FRET_SPACING = 36
const N_STRINGS    = 6
const N_FRETS      = 3
const DOT_R        = 10

const SVG_W = LEFT_PAD * 2 + (N_STRINGS - 1) * STR_SPACING
const SVG_H = TOP_PAD + N_FRETS * FRET_SPACING + 16

const sx = (si: number)   => LEFT_PAD + si * STR_SPACING
const fy = (fret: number) => TOP_PAD + (fret - 0.5) * FRET_SPACING

// ── E Major voicing ───────────────────────────────────────────────────────────
// String numbering: si=0 → str6 (low E), si=5 → str1 (high e)
// E major open: 0 2 2 1 0 0 (low to high)
//   str6 si=0: open  E  → root
//   str5 si=1: fret2 B  → fifth
//   str4 si=2: fret2 E  → root
//   str3 si=3: fret1 G# → third
//   str2 si=4: open  B  → fifth
//   str1 si=5: open  E  → root

type Role = 'root' | 'third' | 'fifth'

interface StringEntry {
  si:    number
  fret:  number
  open:  boolean
  role:  Role
  note:  string
  strNum: number  // guitar string number (1-6)
}

const E_MAJOR: StringEntry[] = [
  { si: 0, fret: 0, open: true,  role: 'root',  note: 'E',  strNum: 6 },
  { si: 1, fret: 2, open: false, role: 'fifth', note: 'B',  strNum: 5 },
  { si: 2, fret: 2, open: false, role: 'root',  note: 'E',  strNum: 4 },
  { si: 3, fret: 1, open: false, role: 'third', note: 'G#', strNum: 3 },
  { si: 4, fret: 0, open: true,  role: 'fifth', note: 'B',  strNum: 2 },
  { si: 5, fret: 0, open: true,  role: 'root',  note: 'E',  strNum: 1 },
]

const ROLE_COLORS = {
  root:  { fill: '#2B50E8', text: '#FAF8F0' },
  third: { fill: '#E83020', text: '#FAF8F0' },
  fifth: { fill: '#F5C200', text: '#1A1A2E' },
} as const

const ROLE_LABELS: Record<Role, { he: string; en: string }> = {
  root:  { he: 'שורש',   en: 'Root'  },
  third: { he: 'טרצה',   en: 'Third' },
  fifth: { he: "קווינטה", en: 'Fifth' },
}

const LEGEND = [
  { role: 'root'  as Role, label: { he: 'שורש (×3)',        en: 'Root (×3)'          } },
  { role: 'third' as Role, label: { he: 'טרצה גדולה (×1)',  en: 'Major Third (×1)'   } },
  { role: 'fifth' as Role, label: { he: 'קווינטה (×2)',     en: 'Fifth (×2)'          } },
]

function IconSearch() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
      <circle cx="5.5" cy="5.5" r="4"/>
      <line x1="9" y1="9" x2="12" y2="12"/>
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VoicingVisualizer({ isHe }: { isHe: boolean }) {
  const [revealed, setRevealed] = useState(false)
  const lang = isHe ? 'he' : 'en'

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#F5C200', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? "ניתוח אקורד E מז'ור" : 'E Major Chord Analysis'}
        </span>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* ── Chord diagram ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 22, fontWeight: 800,
            color: '#1A1A2E', marginBottom: 12, letterSpacing: '-0.02em', textAlign: 'center',
          }}>
            E {isHe ? "מז'ור" : 'Major'}
          </div>

          <svg width={SVG_W} height={SVG_H} style={{ display: 'block' }}>
            {/* Nut */}
            <line x1={sx(0)} y1={TOP_PAD} x2={sx(N_STRINGS - 1)} y2={TOP_PAD}
              stroke="#1A1A2E" strokeWidth={4} />

            {/* Fret lines */}
            {Array.from({ length: N_FRETS }, (_, i) => (
              <line key={i}
                x1={sx(0)} y1={TOP_PAD + (i + 1) * FRET_SPACING}
                x2={sx(N_STRINGS - 1)} y2={TOP_PAD + (i + 1) * FRET_SPACING}
                stroke="#C0B898" strokeWidth={1}
              />
            ))}

            {/* String lines */}
            {Array.from({ length: N_STRINGS }, (_, si) => (
              <line key={si}
                x1={sx(si)} y1={TOP_PAD}
                x2={sx(si)} y2={TOP_PAD + N_FRETS * FRET_SPACING}
                stroke="#8A7E68" strokeWidth={0.8 + si * 0.22}
              />
            ))}

            {/* Dots */}
            {E_MAJOR.map(d => {
              const cx  = sx(d.si)
              const cy  = d.open ? TOP_PAD - 14 : fy(d.fret)
              const rc  = ROLE_COLORS[d.role]

              // Before reveal: open=empty circle, fretted=dark fill
              // After reveal: all colored by role
              const circleFill   = revealed ? rc.fill : d.open ? 'none' : '#1A1A2E'
              const circleStroke = revealed ? rc.fill : '#1A1A2E'
              const strokeW      = (!revealed && d.open) ? 1.5 : 0

              return (
                <g key={d.si}>
                  <circle cx={cx} cy={cy} r={DOT_R}
                    fill={circleFill} stroke={circleStroke} strokeWidth={strokeW}
                    style={{ transition: 'fill 0.35s, stroke 0.35s' }}
                  />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={8}
                    fill={revealed ? rc.text : 'transparent'}
                    fontFamily="var(--fm-font-display)" fontWeight={700}
                    style={{ transition: 'fill 0.35s' }}>
                    {d.note}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── Info panel ── */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {/* Analyse button */}
          <button
            onClick={() => setRevealed(p => !p)}
            style={{
              width: '100%', padding: '13px 20px',
              background: revealed ? '#1A1A2E' : '#F5C200',
              color: revealed ? '#FAF8F0' : '#1A1A2E',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 22,
              transition: 'background 0.25s, color 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            <IconSearch />
            {revealed
              ? (isHe ? 'הסתר ניתוח' : 'Hide Analysis')
              : (isHe ? 'נתח את האקורד' : 'Analyze Chord')}
          </button>

          {/* Per-string table */}
          <div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10,
            }}>
              {isHe ? 'ניתוח לפי מיתר' : 'Per-String Breakdown'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[...E_MAJOR].sort((a, b) => b.strNum - a.strNum).map(d => {
                const rc = ROLE_COLORS[d.role]
                return (
                  <div key={d.si} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 600,
                      color: '#8A7E68', width: 40, flexShrink: 0,
                    }}>
                      {isHe ? `מיתר ${d.strNum}` : `Str ${d.strNum}`}
                    </span>
                    <span style={{
                      width: 30, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: revealed ? rc.fill : '#C0B898',
                      color: revealed ? rc.text : '#FAF8F0',
                      fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                      transition: 'background 0.35s, color 0.35s',
                    }}>
                      {d.note}
                    </span>
                    <span style={{
                      fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#5A5040',
                      opacity: revealed ? 1 : 0,
                      transition: 'opacity 0.35s',
                    }}>
                      {ROLE_LABELS[d.role][lang]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend (visible after reveal) */}
          <div style={{
            marginTop: 20,
            borderTop: '1px solid #D8D0BC', paddingTop: 16,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.4s',
            pointerEvents: revealed ? 'auto' : 'none',
          }}>
            {LEGEND.map(({ role, label }) => {
              const rc = ROLE_COLORS[role]
              return (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 14, height: 14, background: rc.fill, flexShrink: 0 }} />
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 11,
                    color: '#1A1A2E', fontWeight: 600,
                  }}>
                    {label[lang]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
