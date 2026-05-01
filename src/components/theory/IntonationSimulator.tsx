import { useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────
// Saddle offset range: -6 to +6 mm (0 = factory default, which is too short)
// At offset 0, fretted note is +8 cents sharp (string stretch not compensated)
// At offset +6 (saddle moved back = string lengthened), error drops to 0
// Linear model: cents_error = 8 - (saddle_offset / 6) * 8

const SADDLE_MIN  = 0     // fully forward (string too short)
const SADDLE_MAX  = 12    // fully back (string too long)
const SADDLE_IDEAL = 6    // perfectly compensated position

function centsError(saddlePos: number): number {
  // +8 cents at pos 0, 0 cents at pos 6, -8 cents at pos 12
  return 8 - ((saddlePos / SADDLE_IDEAL) * 8)
}

// ── Tuner needle display ───────────────────────────────────────────────────────
interface TunerProps {
  cents: number   // -12 to +12
}

function TunerDisplay({ cents }: TunerProps) {
  const W    = 280
  const H    = 90
  const CX   = W / 2
  const CY   = H - 10
  const R    = 65

  // Needle angle: 0 cents = straight up (-90 deg), ±12 = ±60 deg
  const maxDeg = 55
  const angle  = -90 + (cents / 12) * maxDeg
  const rad    = (angle * Math.PI) / 180
  const nx     = CX + R * Math.cos(rad)
  const ny     = CY + R * Math.sin(rad)

  const isGreen  = Math.abs(cents) <= 1.5
  const isYellow = !isGreen && Math.abs(cents) <= 4
  const meterColor = isGreen ? '#00C896' : isYellow ? '#F5C200' : '#E83020'

  // Arc background
  const arcPath = (startDeg: number, endDeg: number, r: number) => {
    const s = ((startDeg - 90) * Math.PI) / 180
    const e = ((endDeg - 90) * Math.PI) / 180
    const sx = CX + r * Math.cos(s)
    const sy = CY + r * Math.sin(s)
    const ex = CX + r * Math.cos(e)
    const ey = CY + r * Math.sin(e)
    const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
  }

  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      {/* Background arc */}
      <path d={arcPath(-maxDeg, maxDeg, R - 8)}
        fill="none" stroke="#2A2840" strokeWidth={14} />

      {/* Sharp zone (right) */}
      <path d={arcPath(8, maxDeg, R - 8)}
        fill="none" stroke="rgba(232,48,32,0.25)" strokeWidth={14} />

      {/* Flat zone (left) */}
      <path d={arcPath(-maxDeg, -8, R - 8)}
        fill="none" stroke="rgba(232,48,32,0.25)" strokeWidth={14} />

      {/* Green center zone */}
      <path d={arcPath(-6, 6, R - 8)}
        fill="none" stroke="rgba(0,200,150,0.3)" strokeWidth={14} />

      {/* Tick marks */}
      {[-maxDeg, -30, -15, 0, 15, 30, maxDeg].map((deg, i) => {
        const r1 = (deg - 90) * Math.PI / 180
        const inner = R - 18
        const outer = R - 4
        return (
          <line key={i}
            x1={CX + inner * Math.cos(r1)} y1={CY + inner * Math.sin(r1)}
            x2={CX + outer * Math.cos(r1)} y2={CY + outer * Math.sin(r1)}
            stroke="#4A4A6A" strokeWidth={1.5} />
        )
      })}

      {/* Labels */}
      {[
        { deg: -maxDeg, label: '-12' },
        { deg: 0,       label: '0'   },
        { deg: maxDeg,  label: '+12' },
      ].map((t, i) => {
        const r1 = (t.deg - 90) * Math.PI / 180
        const lr = R + 10
        return (
          <text key={i}
            x={CX + lr * Math.cos(r1)} y={CY + lr * Math.sin(r1) + 4}
            textAnchor="middle" fontSize={8} fill="#6A6A8A"
            fontFamily="var(--fm-font-display)">
            {t.label}
          </text>
        )
      })}

      {/* Needle */}
      <line x1={CX} y1={CY} x2={nx} y2={ny}
        stroke={meterColor} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={5} fill={meterColor} />

      {/* Cents readout */}
      <text x={CX} y={CY - R - 6}
        textAnchor="middle" fontSize={14} fontWeight={900}
        fill={meterColor} fontFamily="var(--fm-font-display)">
        {cents > 0 ? `+${cents.toFixed(1)}` : cents.toFixed(1)} ¢
      </text>

      {/* Status */}
      <text x={CX} y={CY - R + 10}
        textAnchor="middle" fontSize={8} fontWeight={700}
        fill={meterColor} fontFamily="var(--fm-font-display)"
        letterSpacing="0.12em">
        {isGreen ? 'IN TUNE' : cents > 0 ? 'SHARP' : 'FLAT'}
      </text>
    </svg>
  )
}

// ── Bridge / saddle diagram ───────────────────────────────────────────────────
interface BridgeProps {
  saddlePos: number   // 0-12
  color: string
}

function BridgeDiagram({ saddlePos, color }: BridgeProps) {
  const W     = 320
  const H     = 70
  const STR_Y = 22
  const BODY_X = 30
  const NUT_X  = BODY_X + 10 + (saddlePos / SADDLE_MAX) * 80
  const NUT_W  = 10
  const NUT_H  = 28
  const NUT_Y  = STR_Y - 10

  return (
    <svg width={W} height={H} style={{ display: 'block', background: '#1A1A2E' }}>
      {/* Nut / string contact label */}
      <text x={10} y={STR_Y + 4}
        textAnchor="middle" fontSize={7} fill="#6A6A8A"
        fontFamily="var(--fm-font-display)">
        NUT
      </text>
      <line x1={20} y1={STR_Y - 12} x2={20} y2={STR_Y + 14}
        stroke="#FAF8F0" strokeWidth={3} />

      {/* String */}
      <line x1={20} y1={STR_Y} x2={NUT_X + NUT_W / 2} y2={STR_Y}
        stroke="#8A7E68" strokeWidth={1.5} />
      <line x1={NUT_X + NUT_W / 2} y1={STR_Y} x2={W - 10} y2={STR_Y}
        stroke="#4A4A6A" strokeWidth={1.5} strokeDasharray="4 3" />

      {/* Fret 12 marker */}
      <line x1={NUT_X / 2 + 10} y1={STR_Y - 10} x2={NUT_X / 2 + 10} y2={STR_Y + 10}
        stroke="#3A3A5A" strokeWidth={1} />
      <text x={NUT_X / 2 + 10} y={H - 4}
        textAnchor="middle" fontSize={7} fill="#6A6A8A"
        fontFamily="var(--fm-font-display)">
        12
      </text>

      {/* Saddle */}
      <rect x={NUT_X} y={NUT_Y} width={NUT_W} height={NUT_H}
        fill={color} />
      <text x={NUT_X + NUT_W / 2} y={H - 4}
        textAnchor="middle" fontSize={7} fill={color}
        fontFamily="var(--fm-font-display)" fontWeight={700}>
        SADDLE
      </text>

      {/* Arrow showing adjustment direction */}
      <text x={NUT_X + NUT_W + 6} y={STR_Y + 4}
        fontSize={10} fill="#6A6A8A"
        fontFamily="var(--fm-font-display)">
        {'>>>'}
      </text>

      {/* Bridge body */}
      <rect x={BODY_X + 100} y={STR_Y - 14} width={W - BODY_X - 108} height={28}
        fill="#2A2840" stroke="#3A3A5A" strokeWidth={1} />
      <text x={BODY_X + 100 + (W - BODY_X - 108) / 2} y={STR_Y + 4}
        textAnchor="middle" fontSize={7} fill="#6A6A8A"
        fontFamily="var(--fm-font-display)">
        BRIDGE
      </text>
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IntonationSimulator({ isHe }: { isHe: boolean }) {
  const [saddlePos, setSaddlePos] = useState<number>(2)   // starts too short
  const [mode, setMode]           = useState<'harmonic' | 'fretted'>('harmonic')

  const cents   = mode === 'harmonic' ? 0 : centsError(saddlePos)
  const isGreen = Math.abs(cents) <= 1.5
  const color   = isGreen ? '#00C896' : Math.abs(cents) <= 4 ? '#F5C200' : '#E83020'

  const moveBack    = () => setSaddlePos(p => Math.min(SADDLE_MAX, p + 1))
  const moveForward = () => setSaddlePos(p => Math.max(SADDLE_MIN, p - 1))
  const reset       = () => setSaddlePos(2)

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
          {isHe ? 'סימולטור אינטונציה — סריג 12' : 'Intonation Simulator — Fret 12'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['harmonic', 'fretted'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
              background: mode === m ? (m === 'harmonic' ? '#2B50E8' : '#E83020') : '#1A1A2E',
              color: '#FAF8F0',
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {m === 'harmonic'
                ? (isHe ? 'הרמוניק (מדויק)' : 'Harmonic (exact)')
                : (isHe ? 'תו לחוץ (מתוח)' : 'Fretted Note (stretched)')}
            </button>
          ))}
        </div>

        {/* Description */}
        <div style={{
          padding: '8px 14px', marginBottom: 14,
          background: mode === 'harmonic' ? 'rgba(43,80,232,0.08)' : 'rgba(232,48,32,0.08)',
          borderInlineStart: `4px solid ${mode === 'harmonic' ? '#2B50E8' : '#E83020'}`,
          fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
          lineHeight: 1.6,
        }}>
          {mode === 'harmonic'
            ? (isHe
              ? 'ההרמוניק בסריג 12 תמיד מדויק מתמטית. אצבע מונחת בלחץ אפסי — ללא מתיחת מיתר.'
              : 'The 12th fret harmonic is always mathematically exact. Finger barely touches — zero string stretch.')
            : (isHe
              ? `לחיצה על סריג 12 מותחת את המיתר כלפי מטה. האוכף ממוקם ב-${saddlePos}/12 — התו ${isGreen ? 'כמעט מדויק' : cents > 0 ? 'גבוה מדי (Sharp)' : 'נמוך מדי (Flat)'}.`
              : `Pressing fret 12 stretches the string down. Saddle at ${saddlePos}/12 — note is ${isGreen ? 'nearly perfect' : cents > 0 ? 'too sharp' : 'too flat'}.`)}
        </div>

        {/* Tuner display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{
            background: '#1A1A2E', padding: '10px 14px',
            border: `2px solid ${color}`,
          }}>
            <TunerDisplay cents={cents} />
          </div>
        </div>

        {/* Bridge diagram */}
        {mode === 'fretted' && (
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              {isHe ? 'מיקום האוכף' : 'Saddle Position'}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <BridgeDiagram saddlePos={saddlePos} color={color} />
            </div>
          </div>
        )}

        {/* Saddle controls */}
        {mode === 'fretted' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {isHe ? 'הזז אוכף' : 'Move Saddle'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={moveForward} style={{
                flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
                background: '#1A1A2E', color: '#FAF8F0',
                fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {isHe ? 'קצר (קדימה)' : 'Forward (shorter)'}
              </button>
              <button onClick={moveBack} style={{
                flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
                background: '#1A1A2E', color: '#FAF8F0',
                fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {isHe ? 'האר (אחורה)' : 'Back (longer)'}
              </button>
              <button onClick={reset} style={{
                padding: '10px 14px', border: `1px solid #8A7E68`, cursor: 'pointer',
                background: 'transparent', color: '#8A7E68',
                fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {isHe ? 'איפוס' : 'Reset'}
              </button>
            </div>

            {/* Position bar */}
            <div style={{ marginTop: 10 }}>
              <div style={{
                height: 6, background: '#D8D0BC',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0,
                  width: `${(saddlePos / SADDLE_MAX) * 100}%`,
                  height: '100%', background: color,
                  transition: 'width 0.2s, background 0.3s',
                }} />
                {/* Ideal marker */}
                <div style={{
                  position: 'absolute',
                  left: `${(SADDLE_IDEAL / SADDLE_MAX) * 100}%`,
                  top: -4, bottom: -4, width: 2,
                  background: '#00C896', transform: 'translateX(-50%)',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 8, color: '#8A7E68',
                }}>
                  {isHe ? 'קצר' : 'Short'}
                </span>
                <span style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 8, color: '#00C896', fontWeight: 700,
                }}>
                  {isHe ? 'מדויק' : 'Ideal'}
                </span>
                <span style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 8, color: '#8A7E68',
                }}>
                  {isHe ? 'ארוך' : 'Long'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Success / instruction panel */}
        <div style={{
          padding: '10px 14px',
          background: isGreen && mode === 'fretted'
            ? 'rgba(0,200,150,0.12)'
            : 'rgba(43,80,232,0.07)',
          borderInlineStart: `4px solid ${isGreen && mode === 'fretted' ? '#00C896' : '#2B50E8'}`,
          fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
          lineHeight: 1.6,
        }}>
          {mode === 'harmonic'
            ? (isHe
              ? 'הרמוניק = 0 סנטים. עכשיו לחץ על "תו לחוץ" כדי לראות מה קורה כשלוחצים על הסריג.'
              : 'Harmonic = 0 cents. Now tap "Fretted Note" to see what happens when you press the fret.')
            : isGreen
              ? (isHe
                ? 'האינטונציה מדויקת. ההרמוניק והתו הלחוץ זהים.'
                : 'Intonation is correct. Harmonic and fretted note match.')
              : cents > 0
                ? (isHe
                  ? 'התו הלחוץ גבוה מדי (Sharp). הזז את האוכף אחורה כדי להאריך את המיתר.'
                  : 'Fretted note is sharp. Move saddle back to lengthen the string.')
                : (isHe
                  ? 'התו הלחוץ נמוך מדי (Flat). הזז את האוכף קדימה כדי לקצר את המיתר.'
                  : 'Fretted note is flat. Move saddle forward to shorten the string.')}
        </div>
      </div>
    </div>
  )
}
