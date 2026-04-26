import { useState } from 'react'

// ── Chromatic note data ───────────────────────────────────────────────────────
const CHROMATIC = ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#']

// Open string pitches in semitones relative to E2 (str6 open = 0)
// str6=E2(0), str5=A2(5), str4=D3(10), str3=G3(15), str2=B3(19), str1=E4(24)
const OPEN_ST = [0, 5, 10, 15, 19, 24] // index 0=str6, 5=str1

// Semitone value of a given string+fret (str: 6=low, 1=high; fret: 0-12)
const noteST = (str: number, fret: number) => OPEN_ST[6 - str] + fret

// Pitch class (0-11) of a string+fret
const notePC = (str: number, fret: number) => noteST(str, fret) % 12

// Pitch class of the open string root note names
const ROOT_PC: Record<string, number> = {
  E:0, F:1, 'F#':2, G:3, 'G#':4, A:5, 'A#':6, B:7, C:8, 'C#':9, D:10, 'D#':11,
}

// ── Geometry ──────────────────────────────────────────────────────────────────
const W        = 380
const H        = 180
const LEFT     = 48
const RIGHT    = W - 12
const STR_GAP  = 22
const TOP_STR  = 24
const N_FRETS  = 12
const FRET_W   = (RIGHT - LEFT) / N_FRETS

const strY  = (s: number) => TOP_STR + (6 - s) * STR_GAP
const fretX = (f: number) => LEFT + f * FRET_W + FRET_W / 2

const STR_LABEL = ['e','B','G','D','A','E'] // index 0=str1, 5=str6
const strLabel  = (s: number) => STR_LABEL[s - 1]

// All positions of a given pitch class on the fretboard (str 1-6, fret 0-12)
const allPositions = (pc: number) => {
  const out: { str: number; fret: number }[] = []
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= N_FRETS; f++) {
      if (notePC(s, f) === pc) out.push({ str: s, fret: f })
    }
  }
  return out
}

// Group into octave "constellations": same absolute pitch (same semitone value)
// We'll just highlight all occurrences and draw lines between same-PC pairs

export default function OctaveConstellationMap({ isHe }: { isHe: boolean }) {
  const [selectedNote, setSelectedNote] = useState('A')

  const pc  = ROOT_PC[selectedNote]
  const pos = allPositions(pc)

  // Sort by absolute pitch (lower first: str6 open = lowest)
  const sorted = [...pos].sort((a, b) => noteST(a.str, a.fret) - noteST(b.str, b.fret))

  // Group into octave clusters: positions that share the same absolute semitone value
  const octaveClusters: { str: number; fret: number }[][] = []
  let lastST = -99
  sorted.forEach(p => {
    const st = noteST(p.str, p.fret)
    if (st === lastST) {
      octaveClusters[octaveClusters.length - 1].push(p)
    } else {
      octaveClusters.push([p])
      lastST = st
    }
  })

  // Lines: connect each position to its nearest octave-up (same PC, 12 st higher)
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  sorted.forEach(p => {
    const pST = noteST(p.str, p.fret)
    // Find the next same-PC position (12 semitones higher)
    const partner = sorted.find(q => noteST(q.str, q.fret) === pST + 12)
    if (partner) {
      lines.push({
        x1: fretX(p.fret),       y1: strY(p.str),
        x2: fretX(partner.fret), y2: strY(partner.str),
      })
    }
  })

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#F5C200', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מפת קונסטלציית האוקטבות' : 'Octave Constellation Map'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        {/* Note selector */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {CHROMATIC.map(n => (
            <button key={n} onClick={() => setSelectedNote(n)} style={{
              width: 34, height: 28, border: 'none', cursor: 'pointer',
              background: n === selectedNote ? '#F5C200' : '#1A1A2E',
              color: n === selectedNote ? '#1A1A2E' : '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {n}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H}
            style={{ display: 'block', background: '#1A1A2E', border: '1px solid #D8D0BC' }}>

            {/* Fret lines */}
            {Array.from({ length: N_FRETS + 1 }, (_, f) => (
              <line key={f}
                x1={LEFT + f * FRET_W} y1={TOP_STR - 10}
                x2={LEFT + f * FRET_W} y2={TOP_STR + 5 * STR_GAP + 10}
                stroke={f === 0 ? '#FAF8F0' : '#2A2A3E'}
                strokeWidth={f === 0 ? 2.5 : 1} />
            ))}

            {/* Fret numbers */}
            {[0,3,5,7,9,12].map(f => (
              <text key={f} x={fretX(f)} y={H - 4}
                textAnchor="middle" fontSize={8} fill="#4A4A6E"
                fontFamily="var(--fm-font-display)">{f}</text>
            ))}

            {/* Strings */}
            {[6, 5, 4, 3, 2, 1].map((s, di) => (
              <line key={s}
                x1={LEFT} y1={strY(s)} x2={RIGHT} y2={strY(s)}
                stroke="#3A3A52" strokeWidth={0.8 + di * 0.18} />
            ))}

            {/* String labels */}
            {[6, 5, 4, 3, 2, 1].map(s => (
              <text key={s} x={LEFT - 8} y={strY(s) + 4}
                textAnchor="end" fontSize={9} fontWeight={700}
                fill="#4A4A6E" fontFamily="var(--fm-font-display)">
                {strLabel(s)}
              </text>
            ))}

            {/* Octave connector lines */}
            {lines.map((ln, i) => (
              <line key={i}
                x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                stroke="#F5C200" strokeWidth={1.5} strokeOpacity={0.5}
                strokeDasharray="3 3" />
            ))}

            {/* Note dots */}
            {sorted.map((p, i) => {
              // Octave index (0=lowest, 1=next, …)
              const oct  = octaveClusters.findIndex(c => c.some(q => q.str === p.str && q.fret === p.fret))
              const cols = ['#2B50E8','#F5C200','#E83020','#00C896']
              const col  = cols[oct % cols.length]
              return (
                <g key={i}>
                  <circle cx={fretX(p.fret)} cy={strY(p.str)} r={9} fill={col} />
                  <text x={fretX(p.fret)} y={strY(p.str) + 4}
                    textAnchor="middle" fontSize={8} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {selectedNote}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
          {['#2B50E8','#F5C200','#E83020','#00C896'].map((c, i) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: c, borderRadius: '50%', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820',
                letterSpacing: '0.05em',
              }}>
                {isHe ? `אוקטבה ${i + 1}` : `Octave ${i + 1}`}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width={24} height={8}><line x1={0} y1={4} x2={24} y2={4} stroke="#F5C200" strokeWidth={1.5} strokeDasharray="3 3" /></svg>
            <span style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10, color: '#2A2820',
              letterSpacing: '0.05em',
            }}>
              {isHe ? 'קפיצת אוקטבה' : 'Octave jump'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
