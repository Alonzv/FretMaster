import { useState, useRef } from 'react'

// ── Chord data in C major ─────────────────────────────────────────────────────
type DegreeId = 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii'

interface Degree {
  id: DegreeId
  roman: string        // display label
  quality: 'major' | 'minor' | 'diminished'
  function: 'tonic' | 'subdominant' | 'dominant'
  functionLabel: string
  functionLabelHe: string
  color: string
  chordName: string    // chord in C major
  // frequencies (Hz) for a simple 3-note chord played via oscillators
  // root, third, fifth in octave 3-4 range
  freqs: [number, number, number]
  desc: string
  descHe: string
}

const DEGREES: Degree[] = [
  {
    id: 'I', roman: 'I', quality: 'major',
    function: 'tonic', functionLabel: 'Home / Tonic', functionLabelHe: 'בית / טוניקה',
    color: '#2B50E8', chordName: 'C',
    freqs: [261.63, 329.63, 392.00],
    desc: 'The home base. Stability and resolution.',
    descHe: 'בסיס הבית. יציבות ופתרון.',
  },
  {
    id: 'ii', roman: 'ii', quality: 'minor',
    function: 'subdominant', functionLabel: 'Journey / Subdominant', functionLabelHe: 'מסע / סאב-דומיננטה',
    color: '#00C896', chordName: 'Dm',
    freqs: [293.66, 349.23, 440.00],
    desc: 'Soft departure. Preparation for tension.',
    descHe: 'עזיבה רכה. הכנה למתח.',
  },
  {
    id: 'iii', roman: 'iii', quality: 'minor',
    function: 'tonic', functionLabel: 'Home / Tonic', functionLabelHe: 'בית / טוניקה',
    color: '#2B50E8', chordName: 'Em',
    freqs: [329.63, 392.00, 493.88],
    desc: 'Alternate tonic color. Poetic and introspective.',
    descHe: 'צבע טוניקה חלופי. פואטי ופנימי.',
  },
  {
    id: 'IV', roman: 'IV', quality: 'major',
    function: 'subdominant', functionLabel: 'Journey / Subdominant', functionLabelHe: 'מסע / סאב-דומיננטה',
    color: '#00C896', chordName: 'F',
    freqs: [349.23, 440.00, 523.25],
    desc: 'Adventure and openness. The song leaves home.',
    descHe: 'הרפתקה ופתיחות. השיר עוזב את הבית.',
  },
  {
    id: 'V', roman: 'V', quality: 'major',
    function: 'dominant', functionLabel: 'Tension / Dominant', functionLabelHe: 'מתח / דומיננטה',
    color: '#E83020', chordName: 'G',
    freqs: [392.00, 493.88, 587.33],
    desc: 'Maximum tension. Demands return to I.',
    descHe: 'מתח מקסימלי. דורש חזרה ל-I.',
  },
  {
    id: 'vi', roman: 'vi', quality: 'minor',
    function: 'tonic', functionLabel: 'Home / Tonic', functionLabelHe: 'בית / טוניקה',
    color: '#2B50E8', chordName: 'Am',
    freqs: [440.00, 523.25, 659.25],
    desc: 'The emotional home. Sad but resolved.',
    descHe: 'הבית הרגשי. עצוב אך יציב.',
  },
  {
    id: 'vii', roman: 'vii°', quality: 'diminished',
    function: 'dominant', functionLabel: 'Tension / Dominant', functionLabelHe: 'מתח / דומיננטה',
    color: '#E83020', chordName: 'Bdim',
    freqs: [493.88, 587.33, 698.46],
    desc: 'Unstable tension. Restless and unsettled.',
    descHe: 'מתח חסר יציבות. חסר מנוחה.',
  },
]

const FUNCTION_COLORS: Record<string, string> = {
  tonic:       '#2B50E8',
  subdominant: '#00C896',
  dominant:    '#E83020',
}

// ── Preset progressions ───────────────────────────────────────────────────────
interface Preset {
  label: string
  labelHe: string
  ids: DegreeId[]
}

const PRESETS: Preset[] = [
  { label: 'I - IV - V',       labelHe: 'I - IV - V',       ids: ['I', 'IV', 'V'] },
  { label: 'I - V - vi - IV',  labelHe: 'I - V - vi - IV',  ids: ['I', 'V', 'vi', 'IV'] },
  { label: 'ii - V - I',       labelHe: 'ii - V - I',        ids: ['ii', 'V', 'I'] },
  { label: 'I - vi - IV - V',  labelHe: 'I - vi - IV - V',  ids: ['I', 'vi', 'IV', 'V'] },
]

// ── Audio helpers ─────────────────────────────────────────────────────────────
function playChord(freqs: [number, number, number], duration = 1.1) {
  const ctx  = new AudioContext()
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.001, ctx.currentTime)
  master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.04)
  master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  master.connect(ctx.destination)

  freqs.forEach(f => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = f
    gain.gain.value = 0.33
    osc.connect(gain)
    gain.connect(master)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.1)
  })

  setTimeout(() => ctx.close(), (duration + 0.4) * 1000)
}

async function playProgression(
  progression: DegreeId[],
  onStep: (i: number) => void,
  onDone: () => void
) {
  const tempo = 1.2  // seconds per chord
  for (let i = 0; i < progression.length; i++) {
    onStep(i)
    const deg = DEGREES.find(d => d.id === progression[i])!
    playChord(deg.freqs, tempo - 0.1)
    await new Promise(r => setTimeout(r, tempo * 1000))
  }
  onDone()
}

// ── Tension bar ───────────────────────────────────────────────────────────────
function TensionBar({ progression }: { progression: DegreeId[] }) {
  const max = 100
  const scores: Record<string, number> = {
    tonic: 15, subdominant: 45, dominant: 90,
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 28, position: 'relative' }}>
      {progression.map((id, i) => {
        const deg   = DEGREES.find(d => d.id === id)!
        const score = scores[deg.function]
        const pct   = (score / max) * 100
        return (
          <div key={i} style={{ flex: 1, padding: '0 1px' }}>
            <div style={{ height: 28, background: '#E8E4DA', position: 'relative' }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: `${pct}%`,
                background: FUNCTION_COLORS[deg.function],
                transition: 'height 0.3s ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RomanNumeralAnalyzer({ isHe }: { isHe: boolean }) {
  const [progression, setProgression] = useState<DegreeId[]>(['I', 'V', 'vi', 'IV'])
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying]       = useState(false)
  const playRef = useRef(false)

  const addDegree = (id: DegreeId) => {
    if (progression.length >= 8) return
    setProgression(p => [...p, id])
  }

  const removeLast = () => {
    setProgression(p => p.slice(0, -1))
  }

  const clearAll = () => {
    setProgression([])
  }

  const loadPreset = (ids: DegreeId[]) => {
    setProgression(ids)
  }

  const handlePlay = async () => {
    if (isPlaying || progression.length === 0) return
    setIsPlaying(true)
    playRef.current = true
    await playProgression(
      progression,
      i => setPlayingIndex(i),
      () => {
        setPlayingIndex(null)
        setIsPlaying(false)
        playRef.current = false
      }
    )
  }

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{
        background: '#1A1A2E', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 4, height: 20, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מנתח ספרות רומיות — סולם C' : 'Roman Numeral Analyzer — Key of C'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>

        {/* Preset progressions */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isHe ? 'מהלכים מוכרים' : 'Classic Progressions'}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => loadPreset(p.ids)} style={{
                padding: '6px 12px', border: '1px solid #1A1A2E', cursor: 'pointer',
                background: 'transparent', color: '#1A1A2E',
                fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A1A2E'
                e.currentTarget.style.color = '#FAF8F0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#1A1A2E'
              }}>
                {isHe ? p.labelHe : p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Degree palette */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isHe ? 'הוסף אקורד' : 'Add Chord'}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {DEGREES.map(deg => (
              <button
                key={deg.id}
                onClick={() => { addDegree(deg.id); playChord(deg.freqs, 0.7) }}
                title={deg.chordName}
                style={{
                  padding: '9px 10px', border: 'none', cursor: 'pointer',
                  background: FUNCTION_COLORS[deg.function],
                  color: '#FAF8F0',
                  fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 900,
                  letterSpacing: '0.04em',
                  minWidth: 44,
                  opacity: progression.length >= 8 ? 0.4 : 1,
                }}
              >
                {deg.roman}
              </button>
            ))}
          </div>
        </div>

        {/* Active progression display */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
            color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isHe ? 'המהלך הנוכחי' : 'Current Progression'}
            {progression.length > 0 && (
              <span style={{ marginInlineStart: 8, fontWeight: 400, color: '#B0A88C' }}>
                ({progression.length}/8)
              </span>
            )}
          </div>

          {progression.length === 0 ? (
            <div style={{
              padding: '18px 16px',
              background: 'rgba(43,80,232,0.06)',
              border: '1px dashed #C0B898',
              fontFamily: 'var(--fm-font-display)', fontSize: 11, color: '#B0A88C',
              letterSpacing: '0.06em',
            }}>
              {isHe ? 'לחץ על ספרה כדי להוסיף אקורד...' : 'Tap a numeral to add a chord...'}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {progression.map((id, i) => {
                const deg      = DEGREES.find(d => d.id === id)!
                const isActive = playingIndex === i
                return (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    padding: '10px 10px 8px',
                    background: isActive ? FUNCTION_COLORS[deg.function] : '#1A1A2E',
                    border: `2px solid ${FUNCTION_COLORS[deg.function]}`,
                    minWidth: 58,
                    transition: 'background 0.15s',
                  }}>
                    <span style={{
                      fontFamily: 'var(--fm-font-display)', fontSize: 20, fontWeight: 900,
                      color: isActive ? '#FAF8F0' : FUNCTION_COLORS[deg.function],
                      lineHeight: 1,
                    }}>
                      {deg.roman}
                    </span>
                    <span style={{
                      fontFamily: 'var(--fm-font-display)', fontSize: 9,
                      color: isActive ? 'rgba(250,248,240,0.75)' : '#8A7E68',
                      letterSpacing: '0.04em',
                    }}>
                      {deg.chordName}
                    </span>
                    <span style={{
                      fontFamily: 'var(--fm-font-display)', fontSize: 8, fontWeight: 700,
                      color: isActive ? 'rgba(250,248,240,0.9)' : FUNCTION_COLORS[deg.function],
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      marginTop: 2,
                    }}>
                      {isHe ? deg.functionLabelHe.split(' / ')[0] : deg.functionLabel.split(' / ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tension arc */}
        {progression.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 5,
            }}>
              {isHe ? 'רמת מתח' : 'Tension Level'}
            </div>
            <TensionBar progression={progression} />
            <div style={{ display: 'flex', gap: 0 }}>
              {progression.map((id, i) => {
                const deg = DEGREES.find(d => d.id === id)!
                return (
                  <div key={i} style={{
                    flex: 1, padding: '3px 2px 0',
                    fontFamily: 'var(--fm-font-display)', fontSize: 8,
                    color: FUNCTION_COLORS[deg.function],
                    textAlign: 'center', fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}>
                    {deg.roman}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Functional analysis panel */}
        {progression.length > 0 && (
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {progression.map((id, i) => {
              const deg = DEGREES.find(d => d.id === id)!
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 12px',
                  background: '#1A1A2E',
                  borderInlineStart: `4px solid ${FUNCTION_COLORS[deg.function]}`,
                }}>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 16, fontWeight: 900,
                    color: FUNCTION_COLORS[deg.function], minWidth: 32,
                  }}>
                    {deg.roman}
                  </span>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                    color: '#FAF8F0', minWidth: 28,
                  }}>
                    {deg.chordName}
                  </span>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
                    color: FUNCTION_COLORS[deg.function], letterSpacing: '0.08em',
                    textTransform: 'uppercase', flex: 1,
                  }}>
                    {isHe ? deg.functionLabelHe : deg.functionLabel}
                  </span>
                  <span style={{
                    fontFamily: 'var(--fm-font-display)', fontSize: 9,
                    color: '#8A7E68',
                  }}>
                    {isHe ? deg.descHe : deg.desc}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Controls row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            disabled={isPlaying || progression.length === 0}
            style={{
              flex: 2, minWidth: 100, padding: '11px 8px',
              border: 'none', cursor: isPlaying || progression.length === 0 ? 'not-allowed' : 'pointer',
              background: isPlaying ? '#3A3A5A' : '#2B50E8',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 800,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              opacity: progression.length === 0 ? 0.4 : 1,
            }}
          >
            {isPlaying
              ? (isHe ? 'מנגן...' : 'Playing...')
              : (isHe ? 'נגן מהלך' : 'Play Progression')}
          </button>
          <button
            onClick={removeLast}
            disabled={progression.length === 0}
            style={{
              flex: 1, minWidth: 72, padding: '11px 8px',
              border: '1px solid #1A1A2E', cursor: progression.length === 0 ? 'not-allowed' : 'pointer',
              background: 'transparent', color: '#1A1A2E',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              opacity: progression.length === 0 ? 0.35 : 1,
            }}
          >
            {isHe ? 'מחק אחרון' : 'Remove Last'}
          </button>
          <button
            onClick={clearAll}
            disabled={progression.length === 0}
            style={{
              flex: 1, minWidth: 60, padding: '11px 8px',
              border: '1px solid #C0B898', cursor: progression.length === 0 ? 'not-allowed' : 'pointer',
              background: 'transparent', color: '#8A7E68',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              opacity: progression.length === 0 ? 0.35 : 1,
            }}
          >
            {isHe ? 'נקה' : 'Clear'}
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { color: '#2B50E8', label: isHe ? 'טוניקה (בית)' : 'Tonic (Home)' },
            { color: '#00C896', label: isHe ? 'סאב-דומיננטה (מסע)' : 'Subdominant (Journey)' },
            { color: '#E83020', label: isHe ? 'דומיננטה (מתח)' : 'Dominant (Tension)' },
          ].map(item => (
            <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: item.color, flexShrink: 0 }} />
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
