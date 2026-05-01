import { useState, useEffect, useRef } from 'react'

// ── Mode data (all rooted on A, parallel approach) ────────────────────────────
// Fretboard: strings 1-6, root A on str1 fret5 / str2 fret10 / str3 fret2 / str4 fret7
// We show a 5-fret window around fret 4-8 on strings 1-4
// Intervals in semitones above root (mod 12)

interface ModeNote {
  degree: number    // 1-7
  semitones: number // 0-11 above root
  label: string     // interval label
}

interface Mode {
  id: string
  name: string
  nameHe: string
  family: 'major' | 'minor' | 'diminished'
  color: string
  vibe: string
  vibeHe: string
  characterDegree: number   // which degree is the character note (vs Ionian/Aeolian)
  characterLabel: string    // e.g. "#4", "b7", "nat 6"
  notes: ModeNote[]
}

// Root = A = 0. Semitones for each mode degree (7 notes).
const MODES: Mode[] = [
  {
    id: 'ionian',
    name: 'Ionian',
    nameHe: 'יוני',
    family: 'major',
    color: '#2B50E8',
    vibe: 'Pure & Stable',
    vibeHe: 'טהור ויציב',
    characterDegree: 0,
    characterLabel: 'standard',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 2,  label: '2'  },
      { degree: 3, semitones: 4,  label: '3'  },
      { degree: 4, semitones: 5,  label: '4'  },
      { degree: 5, semitones: 7,  label: '5'  },
      { degree: 6, semitones: 9,  label: '6'  },
      { degree: 7, semitones: 11, label: '7'  },
    ],
  },
  {
    id: 'lydian',
    name: 'Lydian',
    nameHe: 'לידי',
    family: 'major',
    color: '#00C896',
    vibe: 'Dreamy & Floating',
    vibeHe: 'חלומי ומרחף',
    characterDegree: 4,
    characterLabel: '#4',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 2,  label: '2'  },
      { degree: 3, semitones: 4,  label: '3'  },
      { degree: 4, semitones: 6,  label: '#4' },
      { degree: 5, semitones: 7,  label: '5'  },
      { degree: 6, semitones: 9,  label: '6'  },
      { degree: 7, semitones: 11, label: '7'  },
    ],
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    nameHe: 'מיקסולידי',
    family: 'major',
    color: '#FF6B35',
    vibe: 'Rock & Groove',
    vibeHe: 'רוק וגרוב',
    characterDegree: 7,
    characterLabel: 'b7',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 2,  label: '2'  },
      { degree: 3, semitones: 4,  label: '3'  },
      { degree: 4, semitones: 5,  label: '4'  },
      { degree: 5, semitones: 7,  label: '5'  },
      { degree: 6, semitones: 9,  label: '6'  },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
  {
    id: 'aeolian',
    name: 'Aeolian',
    nameHe: 'איאולי',
    family: 'minor',
    color: '#5A3FD4',
    vibe: 'Tragic & Dark',
    vibeHe: 'טרגי ואפל',
    characterDegree: 0,
    characterLabel: 'standard',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 2,  label: '2'  },
      { degree: 3, semitones: 3,  label: 'b3' },
      { degree: 4, semitones: 5,  label: '4'  },
      { degree: 5, semitones: 7,  label: '5'  },
      { degree: 6, semitones: 8,  label: 'b6' },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
  {
    id: 'dorian',
    name: 'Dorian',
    nameHe: 'דורי',
    family: 'minor',
    color: '#E83020',
    vibe: 'Cool & Funky',
    vibeHe: 'קולי ופאנקי',
    characterDegree: 6,
    characterLabel: 'nat 6',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 2,  label: '2'  },
      { degree: 3, semitones: 3,  label: 'b3' },
      { degree: 4, semitones: 5,  label: '4'  },
      { degree: 5, semitones: 7,  label: '5'  },
      { degree: 6, semitones: 9,  label: '6'  },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
  {
    id: 'phrygian',
    name: 'Phrygian',
    nameHe: 'פריגי',
    family: 'minor',
    color: '#F5C200',
    vibe: 'Flamenco & Metal',
    vibeHe: 'פלמנקו ומטאל',
    characterDegree: 2,
    characterLabel: 'b2',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 1,  label: 'b2' },
      { degree: 3, semitones: 3,  label: 'b3' },
      { degree: 4, semitones: 5,  label: '4'  },
      { degree: 5, semitones: 7,  label: '5'  },
      { degree: 6, semitones: 8,  label: 'b6' },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
  {
    id: 'locrian',
    name: 'Locrian',
    nameHe: 'לוקרי',
    family: 'diminished',
    color: '#6B6B6B',
    vibe: 'Unstable & Dark',
    vibeHe: 'חסר יציבות ואפל',
    characterDegree: 5,
    characterLabel: 'b5',
    notes: [
      { degree: 1, semitones: 0,  label: '1'  },
      { degree: 2, semitones: 1,  label: 'b2' },
      { degree: 3, semitones: 3,  label: 'b3' },
      { degree: 4, semitones: 5,  label: '4'  },
      { degree: 5, semitones: 6,  label: 'b5' },
      { degree: 6, semitones: 8,  label: 'b6' },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
]

// ── Fretboard geometry ─────────────────────────────────────────────────────────
// 4 strings (1-4), 6 frets displayed (fret 4-9)
// Root A: str1 fret5, str2 fret10 (outside window), str3 fret2 (outside), str4 fret7
// We use window fret 4-9 → show strings 1, 2 (partial), 3 (partial), 4
// Simpler: show strings 1-4, frets 4-9

const BASE_FRET  = 4
const FRET_COUNT = 6
const FRET_W     = 44
const STR_GAP    = 18
const LEFT       = 28
const TOP        = 16
const W          = LEFT + FRET_COUNT * FRET_W + 16
const H          = TOP + 3 * STR_GAP + 30

const strY  = (s: number) => TOP + (4 - s) * STR_GAP   // s=4 top, s=1 bottom
const fretX = (f: number) => LEFT + (f - BASE_FRET) * FRET_W + FRET_W / 2

// Open string semitones (E2=0 relative) — we compute mod 12 for pitch class
// E2=4, A2=9, D3=2, G3=7, B3=11, E4=4
// String 1=E4 (st=4), 2=B3 (st=11), 3=G3 (st=7), 4=D3 (st=2)
const OPEN_ST: Record<number, number> = { 1: 4, 2: 11, 3: 7, 4: 2 }
const ROOT_ST = 9  // A = 9 semitones above E (chroma)

function noteStOnString(str: number, fret: number): number {
  return (OPEN_ST[str] + fret) % 12
}

// For the displayed fret window, compute which fret positions belong to the mode
function getModePositions(mode: Mode) {
  const modeSt = new Set(mode.notes.map(n => (ROOT_ST + n.semitones) % 12))
  const positions: { str: number; fret: number; label: string; isRoot: boolean; isCharacter: boolean }[] = []

  for (let str = 1; str <= 4; str++) {
    for (let fret = BASE_FRET; fret < BASE_FRET + FRET_COUNT; fret++) {
      const st = noteStOnString(str, fret)
      if (modeSt.has(st)) {
        const relSt = (st - ROOT_ST + 12) % 12
        const noteData = mode.notes.find(n => (n.semitones % 12) === relSt)
        const isRoot = relSt === 0
        const characterNote = mode.notes.find(n => n.label === mode.characterLabel)
        const isCharacter = !isRoot && characterNote !== undefined && (n => n.semitones % 12 === relSt)(characterNote)
        positions.push({
          str, fret,
          label: noteData?.label ?? '',
          isRoot,
          isCharacter,
        })
      }
    }
  }
  return positions
}

// ── Drone oscillator ───────────────────────────────────────────────────────────
// Pure A2 drone via Web Audio API
function useDrone() {
  const ctxRef  = useRef<AudioContext | null>(null)
  const oscRef  = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const [running, setRunning] = useState(false)

  const start = () => {
    if (running) return
    const ctx  = new AudioContext()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type      = 'sawtooth'
    osc.frequency.value = 110  // A2
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    ctxRef.current  = ctx
    oscRef.current  = osc
    gainRef.current = gain
    setRunning(true)
  }

  const stop = () => {
    if (!running) return
    gainRef.current?.gain.setTargetAtTime(0, ctxRef.current!.currentTime, 0.1)
    setTimeout(() => {
      oscRef.current?.stop()
      ctxRef.current?.close()
      oscRef.current  = null
      ctxRef.current  = null
      gainRef.current = null
    }, 300)
    setRunning(false)
  }

  useEffect(() => () => { stop() }, [])

  return { running, start, stop }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ParallelModeComparator({ isHe }: { isHe: boolean }) {
  const [selectedId, setSelectedId] = useState<string>('dorian')
  const drone = useDrone()

  const mode = MODES.find(m => m.id === selectedId)!
  const positions = getModePositions(mode)

  const STR_LABELS = ['e', 'B', 'G', 'D']  // str1-4

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{
        background: '#1A1A2E', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 4, height: 20, background: '#E83020', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'השוואת מודוסים מקבילים — שורש A' : 'Parallel Mode Comparator — Root A'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Mode tabs — two rows */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setSelectedId(m.id)} style={{
              padding: '8px 10px', border: 'none', cursor: 'pointer',
              background: m.id === selectedId ? m.color : '#1A1A2E',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              outline: m.id === selectedId ? `2px solid ${m.color}` : 'none',
              outlineOffset: 1,
            }}>
              {isHe ? m.nameHe : m.name}
            </button>
          ))}
        </div>

        {/* Vibe + character note row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            padding: '6px 14px',
            background: mode.color,
            fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 800,
            color: '#FAF8F0', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {isHe ? mode.vibeHe : mode.vibe}
          </div>
          {mode.characterLabel !== 'standard' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                color: '#8A7E68', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {isHe ? 'תו מאפיין:' : 'Character Note:'}
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#FAF8F0', border: `3px solid ${mode.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 900,
                  color: mode.color,
                }}>
                  {mode.characterLabel}
                </span>
              </div>
            </div>
          )}
          {mode.characterLabel === 'standard' && (
            <span style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.1em',
            }}>
              {isHe ? 'סולם הבסיס — אין שינוי' : 'Base scale — no alteration'}
            </span>
          )}
        </div>

        {/* Fretboard + drone side by side */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 16 }}>
          {/* Fretboard */}
          <div style={{ overflowX: 'auto' }}>
            <svg width={W} height={H}
              style={{ display: 'block', background: '#1A1A2E', border: `2px solid ${mode.color}` }}>

              {/* Fret lines */}
              {Array.from({ length: FRET_COUNT + 1 }, (_, f) => {
                const x = LEFT + f * FRET_W
                return (
                  <line key={f}
                    x1={x} y1={TOP - 8} x2={x} y2={TOP + 3 * STR_GAP + 8}
                    stroke={f === 0 ? '#FAF8F0' : '#3A3A5A'} strokeWidth={f === 0 ? 2.5 : 1} />
                )
              })}

              {/* Fret numbers */}
              {Array.from({ length: FRET_COUNT }, (_, f) => (
                <text key={f}
                  x={LEFT + f * FRET_W + FRET_W / 2} y={H - 4}
                  textAnchor="middle" fontSize={8} fill="#8A7E68"
                  fontFamily="var(--fm-font-display)">
                  {BASE_FRET + f}
                </text>
              ))}

              {/* Strings */}
              {[4, 3, 2, 1].map((s) => (
                <g key={s}>
                  <line
                    x1={LEFT} y1={strY(s)} x2={W - 10} y2={strY(s)}
                    stroke="#4A4A6A"
                    strokeWidth={s === 4 ? 2 : s === 3 ? 1.5 : s === 2 ? 1.2 : 1} />
                  <text x={LEFT - 6} y={strY(s) + 4}
                    textAnchor="end" fontSize={8} fontWeight={700}
                    fill="#6A6A8A" fontFamily="var(--fm-font-display)">
                    {STR_LABELS[4 - s]}
                  </text>
                </g>
              ))}

              {/* Note dots */}
              {positions.map((p, i) => {
                const cx = fretX(p.fret)
                const cy = strY(p.str)
                const isChar = p.isCharacter
                const fill = p.isRoot
                  ? '#E83020'
                  : isChar
                    ? mode.color
                    : '#3A3A5A'
                return (
                  <g key={i}>
                    {isChar && (
                      <circle cx={cx} cy={cy} r={15}
                        fill="none" stroke={mode.color} strokeWidth={2}
                        strokeDasharray="4 2" opacity={0.6} />
                    )}
                    <circle cx={cx} cy={cy} r={11}
                      fill={fill}
                      stroke={isChar ? mode.color : 'none'}
                      strokeWidth={isChar ? 2 : 0} />
                    <text x={cx} y={cy + 4}
                      textAnchor="middle" fontSize={8} fontWeight={800}
                      fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                      {p.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Drone panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {isHe ? 'פדל בס — A' : 'Bass Drone — A'}
            </div>
            <button
              onClick={drone.running ? drone.stop : drone.start}
              style={{
                width: 80, height: 80, border: 'none', cursor: 'pointer',
                background: drone.running ? mode.color : '#1A1A2E',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
              {/* Waveform icon */}
              <svg width={36} height={20} viewBox="0 0 36 20">
                {drone.running
                  ? [3, 9, 15, 21, 27, 33].map((x, i) => (
                    <rect key={i} x={x} y={10 - [4, 9, 7, 9, 5, 3][i]}
                      width={4} height={[8, 18, 14, 18, 10, 6][i]}
                      fill="#FAF8F0" />
                  ))
                  : <line x1={2} y1={10} x2={34} y2={10} stroke="#FAF8F0" strokeWidth={2} />
                }
              </svg>
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 8, fontWeight: 700,
                color: '#FAF8F0', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {drone.running
                  ? (isHe ? 'עצור' : 'Stop')
                  : (isHe ? 'הפעל' : 'Play')}
              </span>
            </button>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 8,
              color: '#8A7E68', letterSpacing: '0.05em',
              maxWidth: 90, lineHeight: 1.4,
            }}>
              {isHe
                ? 'השמע את הסולם מעל ה-Drone'
                : 'Hum the scale over the Drone'}
            </div>
          </div>
        </div>

        {/* Scale notes strip */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isHe ? 'תווי הסולם — A' : 'Scale Tones — A'}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {mode.notes.map((n) => {
              const isChar = n.label === mode.characterLabel
              const isRoot = n.semitones === 0
              return (
                <div key={n.degree} style={{
                  width: 40, height: 40,
                  background: isRoot ? '#E83020' : isChar ? mode.color : '#1A1A2E',
                  border: isChar && !isRoot ? `2px solid ${mode.color}` : '2px solid transparent',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 1,
                }}>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 800,
                    color: '#FAF8F0',
                  }}>
                    {n.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 7,
                    color: 'rgba(250,248,240,0.5)',
                  }}>
                    {n.degree}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#E83020', label: isHe ? 'שורש (A)' : 'Root (A)' },
            { color: mode.color, label: isHe ? 'תו מאפיין' : 'Character Note', dashed: true },
            { color: '#3A3A5A', label: isHe ? 'תווי הסולם' : 'Scale Tones' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 12, height: 12, background: item.color, borderRadius: '50%',
                border: item.dashed ? `2px solid ${item.color}` : 'none',
                flexShrink: 0,
              }} />
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
