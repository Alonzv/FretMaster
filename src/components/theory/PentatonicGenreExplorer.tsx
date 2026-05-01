import { useState } from 'react'

// ── Genre modes ───────────────────────────────────────────────────────────────
type GenreId = 'rock' | 'blues' | 'country' | 'jazz'

interface GenreConfig {
  id: GenreId
  label: string
  labelHe: string
  color: string
  desc: string
  descHe: string
}

const GENRES: GenreConfig[] = [
  {
    id: 'rock',
    label: 'Rock / Outside',
    labelHe: 'רוק / Outside',
    color: '#E83020',
    desc: 'Side-Slipping: the entire pattern shifts one fret up (Bb minor pentatonic). All notes clash intentionally.',
    descHe: 'Side-Slipping: כל התבנית זזה סריג אחד קדימה (Bb מינור פנטטוני). כל התווים מתנגשים בכוונה.',
  },
  {
    id: 'blues',
    label: 'Blues',
    labelHe: 'בלוז',
    color: '#2B50E8',
    desc: 'The Blue Note (b5) is added — a dissonant passing tone that screams and demands to be bent.',
    descHe: 'הבלו נוט (b5) מתווסף — צליל דיסוננטי שזועק ודורש מתיחה (Bending).',
  },
  {
    id: 'country',
    label: 'Country',
    labelHe: 'קאנטרי',
    color: '#F5C200',
    desc: 'The chromatic approach: the b3 slides up into the major 3rd, creating the classic Country squawk.',
    descHe: 'הגישה הכרומטית: ה-b3 מחליק אל הטרצה הגדולה (3), יוצר את ה-Squawk הקלאסי של הקאנטרי.',
  },
  {
    id: 'jazz',
    label: 'Jazz',
    labelHe: "ג'אז",
    color: '#00C896',
    desc: 'Root substitution: the same A minor pentatonic notes function as 3-5-7-9-13 over an Fmaj7 chord.',
    descHe: 'החלפת שורש: אותם תווים של A מינור פנטטוני מתפקדים כ-3-5-7-9-13 מעל אקורד Fmaj7.',
  },
]

// ── Fretboard geometry ────────────────────────────────────────────────────────
// Root: A on str6 fret5. Display window frets 4-10, strings 1-6.
const BASE_FRET  = 4
const FRET_COUNT = 7
const FRET_W     = 44
const STR_GAP    = 18
const LEFT       = 32
const TOP        = 18
const STRINGS    = 6
const W          = LEFT + FRET_COUNT * FRET_W + 16
const H          = TOP + (STRINGS - 1) * STR_GAP + 30

const strY  = (s: number) => TOP + (6 - s) * STR_GAP
const fretX = (f: number) => LEFT + (f - BASE_FRET) * FRET_W + FRET_W / 2

// Open string semitones
const OPEN_ST: Record<number, number> = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 }
const STR_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']

// A minor pentatonic (root=9): degrees 0,3,5,7,10 relative
const PENTA_DEG = new Set([0, 3, 5, 7, 10])

function relSt(openSt: number, fret: number, root: number): number {
  return ((openSt + fret) % 12 - root + 12) % 12
}

// Build A minor pentatonic positions in fret window
function buildPenta(root: number) {
  const positions: { str: number; fret: number; deg: number }[] = []
  for (let s = 1; s <= 6; s++) {
    for (let f = BASE_FRET; f < BASE_FRET + FRET_COUNT; f++) {
      const rel = relSt(OPEN_ST[s], f, root)
      if (PENTA_DEG.has(rel)) positions.push({ str: s, fret: f, deg: rel })
    }
  }
  return positions
}

// Blue note: b5 = degree 6
function buildBlueNotes(root: number) {
  const positions: { str: number; fret: number }[] = []
  for (let s = 1; s <= 6; s++) {
    for (let f = BASE_FRET; f < BASE_FRET + FRET_COUNT; f++) {
      const rel = relSt(OPEN_ST[s], f, root)
      if (rel === 6) positions.push({ str: s, fret: f })
    }
  }
  return positions
}

// Country: pairs of (b3, 3) on same string (chromatic approach)
function buildCountryPairs(root: number) {
  const pairs: { str: number; fretFrom: number; fretTo: number }[] = []
  for (let s = 1; s <= 6; s++) {
    let b3f: number | null = null
    let maj3f: number | null = null
    for (let f = BASE_FRET; f < BASE_FRET + FRET_COUNT; f++) {
      const rel = relSt(OPEN_ST[s], f, root)
      if (rel === 3) b3f = f
      if (rel === 4) maj3f = f
    }
    if (b3f !== null && maj3f !== null && Math.abs(maj3f - b3f) === 1) {
      pairs.push({ str: s, fretFrom: b3f, fretTo: maj3f })
    }
  }
  return pairs
}

// Jazz role labels for A minor pentatonic over Fmaj7
const JAZZ_ROLES: Record<number, string> = {
  0:  '3',   // A = major 3rd of F
  3:  '5',   // C = 5th of F
  5:  '7',   // D = major 7th of F
  7:  '9',   // E = 9th of F
  10: '13',  // G = 13th of F
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PentatonicGenreExplorer({ isHe }: { isHe: boolean }) {
  const [genre, setGenre] = useState<GenreId>('blues')

  const g = GENRES.find(x => x.id === genre)!

  // Base root: A=9. Rock shifts to Bb=10.
  const root      = genre === 'rock' ? 10 : 9
  const rootLabel = genre === 'rock' ? 'Bb' : 'A'

  const basePenta  = buildPenta(root)
  const blueNotes  = genre === 'blues'   ? buildBlueNotes(9)    : []
  const countryPairs = genre === 'country' ? buildCountryPairs(9)  : []

  function dotFill(deg: number): string {
    if (deg === 0) return '#E83020'   // root
    if (genre === 'jazz') return g.color
    return '#1A1A2E'
  }

  function dotLabel(deg: number): string {
    if (genre === 'jazz') return JAZZ_ROLES[deg] ?? ''
    const MAP: Record<number, string> = { 0: 'R', 3: 'b3', 5: '4', 7: '5', 10: 'b7' }
    return MAP[deg] ?? ''
  }

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{
        background: '#1A1A2E', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 4, height: 20, background: '#F5C200', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'חוקר הז\'אנרים — פנטטוני' : 'Genre Explorer — Pentatonic'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Genre buttons */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 16, flexWrap: 'wrap' }}>
          {GENRES.map(gx => (
            <button key={gx.id} onClick={() => setGenre(gx.id)} style={{
              flex: 1, minWidth: 72, padding: '9px 6px',
              border: 'none', cursor: 'pointer',
              background: gx.id === genre ? gx.color : '#1A1A2E',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {isHe ? gx.labelHe : gx.label}
            </button>
          ))}
        </div>

        {/* Chord context strip */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {isHe ? 'אקורד רקע:' : 'Backing chord:'}
          </div>
          <div style={{
            padding: '5px 14px', background: '#1A1A2E',
            fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 900,
            color: g.color, letterSpacing: '0.08em',
          }}>
            {genre === 'jazz' ? 'Fmaj7' : genre === 'rock' ? 'A7' : 'A7'}
          </div>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {isHe ? 'סולם:' : 'Scale:'}
          </div>
          <div style={{
            padding: '5px 14px', background: g.color,
            fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 900,
            color: '#FAF8F0', letterSpacing: '0.08em',
          }}>
            {rootLabel} min penta
          </div>
        </div>

        {/* Description */}
        <div style={{
          padding: '9px 14px', marginBottom: 14,
          background: 'rgba(0,0,0,0.04)',
          borderInlineStart: `4px solid ${g.color}`,
          fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
          lineHeight: 1.6,
        }}>
          {isHe ? g.descHe : g.desc}
        </div>

        {/* Fretboard */}
        <div style={{ overflowX: 'auto', marginBottom: 14 }}>
          <svg width={W} height={H}
            style={{ display: 'block', background: '#FAF8F0', border: `2px solid ${g.color}` }}>

            {/* Arrow defs */}
            <defs>
              <marker id="pg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={g.color} />
              </marker>
            </defs>

            {/* Fret lines */}
            {Array.from({ length: FRET_COUNT + 1 }, (_, f) => {
              const x = LEFT + f * FRET_W
              return (
                <line key={f} x1={x} y1={TOP - 10} x2={x} y2={TOP + (STRINGS - 1) * STR_GAP + 10}
                  stroke={f === 0 ? '#1A1A2E' : '#C0B898'}
                  strokeWidth={f === 0 ? 3 : 1} />
              )
            })}

            {/* Fret numbers */}
            {Array.from({ length: FRET_COUNT }, (_, f) => (
              <text key={f}
                x={LEFT + f * FRET_W + FRET_W / 2} y={H - 4}
                textAnchor="middle" fontSize={7} fill="#8A7E68"
                fontFamily="var(--fm-font-display)">
                {BASE_FRET + f}
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

            {/* Country chromatic slides */}
            {countryPairs.map((pair, i) => {
              const ax = fretX(pair.fretFrom)
              const bx = fretX(pair.fretTo)
              const y  = strY(pair.str)
              return (
                <g key={i}>
                  <line x1={ax} y1={y} x2={bx - 12} y2={y}
                    stroke={g.color} strokeWidth={2.5}
                    markerEnd="url(#pg-arr)" />
                  <circle cx={bx} cy={y} r={11}
                    fill={g.color} opacity={0.35} />
                  <text x={bx} y={y + 4}
                    textAnchor="middle" fontSize={8} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    3
                  </text>
                </g>
              )
            })}

            {/* Blue notes */}
            {blueNotes.map((n, i) => {
              const cx = fretX(n.fret)
              const cy = strY(n.str)
              if (cx > W - 10) return null
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={13}
                    fill="none" stroke={g.color} strokeWidth={2.5}
                    strokeDasharray="4 2" />
                  <circle cx={cx} cy={cy} r={11} fill={g.color} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={8} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    b5
                  </text>
                </g>
              )
            })}

            {/* Main pentatonic dots */}
            {basePenta.map((n, i) => {
              const cx = fretX(n.fret)
              const cy = strY(n.str)
              if (cx > W - 10) return null

              // In rock mode, show with red-tinted fill to signal "wrong" tension
              const isRock  = genre === 'rock'
              const fill    = dotFill(n.deg)
              const opacity = isRock ? 0.85 : 1

              return (
                <g key={i}>
                  {isRock && (
                    <circle cx={cx} cy={cy} r={13}
                      fill="none" stroke="#E83020" strokeWidth={1.5}
                      strokeDasharray="3 2" opacity={0.5} />
                  )}
                  <circle cx={cx} cy={cy} r={11}
                    fill={fill} opacity={opacity} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={8} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {dotLabel(n.deg)}
                  </text>
                </g>
              )
            })}

            {/* Rock: "shifted" label overlay */}
            {genre === 'rock' && (
              <text x={LEFT + FRET_COUNT * FRET_W / 2} y={TOP - 14}
                textAnchor="middle" fontSize={9} fontWeight={800}
                fill="#E83020" fontFamily="var(--fm-font-display)"
                letterSpacing="0.1em">
                {isHe ? 'SIDE-SLIP — Bb' : 'SIDE-SLIP — Bb'}
              </text>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, background: '#E83020', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820' }}>
              {isHe ? 'שורש' : 'Root'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, background: '#1A1A2E', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820' }}>
              {isHe ? 'תווי הסולם' : 'Scale Tones'}
            </span>
          </div>
          {genre === 'blues' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: '#2B50E8', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820' }}>
                {isHe ? 'בלו נוט (b5)' : 'Blue Note (b5)'}
              </span>
            </div>
          )}
          {genre === 'country' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 2, borderTop: `2.5px solid ${g.color}` }} />
              <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820' }}>
                {isHe ? 'החלקה b3 אל 3' : 'Slide b3 to 3'}
              </span>
            </div>
          )}
          {genre === 'jazz' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: g.color, borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820' }}>
                {isHe ? 'תפקיד מעל Fmaj7' : 'Role over Fmaj7'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
