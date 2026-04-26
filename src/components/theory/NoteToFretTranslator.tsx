import { useState } from 'react'

// ── Note data ─────────────────────────────────────────────────────────────────
// Guitar first position (frets 0-5), natural notes only.
// str: 6=low E, 5=A, 4=D, 3=G, 2=B, 1=high E

interface FretPos { str: number; fret: number }

const NOTES = [
  {
    letter: 'E', staffPos: 0,          // line 1, bottom
    midi: 52,
    descHe: 'הצליל הנמוך ביותר בגיטרה. מופיע על 3 מיתרים שונים בפוזיציה ראשונה.',
    descEn: 'The lowest note on guitar. Appears on 3 different strings in first position.',
    positions: [
      { str: 6, fret: 0 },  // E2
      { str: 4, fret: 2 },  // E3
      { str: 1, fret: 0 },  // E4
    ] as FretPos[],
  },
  {
    letter: 'F', staffPos: 1,          // space 1
    midi: 53,
    descHe: 'חצי טון מעל מי. מופיע על 3 מיתרים. שים לב — מיתר 1 פתוח הוא E, לא F.',
    descEn: 'Half step above E. Appears on 3 strings. Note — open string 1 is E, not F.',
    positions: [
      { str: 6, fret: 1 },
      { str: 4, fret: 3 },
      { str: 1, fret: 1 },
    ] as FretPos[],
  },
  {
    letter: 'G', staffPos: 2,          // line 2 (G-line, anchored by treble clef)
    midi: 55,
    descHe: 'מפתח הסול מצביע על שורה זו! מיתר 3 פתוח הוא G.',
    descEn: 'The treble clef anchors G here! Open string 3 is G.',
    positions: [
      { str: 6, fret: 3 },
      { str: 3, fret: 0 },
      { str: 1, fret: 3 },
    ] as FretPos[],
  },
  {
    letter: 'A', staffPos: 3,          // space 2
    midi: 57,
    descHe: 'מיתר 5 פתוח הוא לָה. אחד מ-2 המקומות בפוזיציה ראשונה.',
    descEn: 'Open string 5 is A. One of just 2 locations in first position.',
    positions: [
      { str: 5, fret: 0 },
      { str: 3, fret: 2 },
    ] as FretPos[],
  },
  {
    letter: 'B', staffPos: 4,          // line 3, middle line
    midi: 59,
    descHe: 'מיתר 2 פתוח הוא סי. ה-B נמצא על 3 מיתרים שונים!',
    descEn: 'Open string 2 is B. The note B appears on 3 different strings!',
    positions: [
      { str: 5, fret: 2 },
      { str: 3, fret: 4 },
      { str: 2, fret: 0 },
    ] as FretPos[],
  },
  {
    letter: 'C', staffPos: 5,          // space 3
    midi: 60,
    descHe: 'דו — תו C4 (Middle C) הוא יחידת הייחוס של כל המוזיקה. 2 מיקומים בפוזיציה ראשונה.',
    descEn: 'C4 (Middle C) — the universal reference point of all music. 2 positions in first position.',
    positions: [
      { str: 5, fret: 3 },
      { str: 2, fret: 1 },
    ] as FretPos[],
  },
  {
    letter: 'D', staffPos: 6,          // line 4
    midi: 62,
    descHe: 'רה — מיתר 4 פתוח הוא D. 2 מיקומים, שניהם בהישג יד.',
    descEn: 'Open string 4 is D. 2 positions, both easily reachable.',
    positions: [
      { str: 4, fret: 0 },
      { str: 2, fret: 3 },
    ] as FretPos[],
  },
]

// ── Fretboard geometry ────────────────────────────────────────────────────────
const FRET_W   = 42    // width of each fret compartment
const N_FRETS  = 6     // frets 0-5
const NECK_LEFT = 44   // x of nut
const NECK_TOP  = 14   // y of string 6 (top)
const STR_GAP  = 14    // spacing between strings
const NECK_W   = NECK_LEFT + N_FRETS * FRET_W + 12
const NECK_H   = NECK_TOP + 5 * STR_GAP + 26

// str: 6=low(top), 1=high(bottom)
const strY = (s: number) => NECK_TOP + (6 - s) * STR_GAP
// fret compartment center x: 0=open column, 1-5=fret compartments
const fretCX = (f: number) => NECK_LEFT + f * FRET_W + FRET_W / 2
const fretLineX = (f: number) => NECK_LEFT + f * FRET_W

// top=str6='E', then str5='A', str4='D', str3='G', str2='B', str1='e'
const STR_LABEL = (s: number) => ['e', 'B', 'G', 'D', 'A', 'E'][6 - s]

// ── Staff geometry ─────────────────────────────────────────────────────────────
const STAFF_GAP  = 12
const STAFF_BOT  = 68   // y of line 1 (bottom)
const STAFF_W    = 340
const STAFF_H    = 92
const CLEF_X     = 16   // treble clef x
const NOTE_X     = 130  // x of the note head

const staffNoteY = (pos: number) => STAFF_BOT - pos * (STAFF_GAP / 2)

const TREBLE = String.fromCodePoint(0x1D11E)

// ── Component ─────────────────────────────────────────────────────────────────

export default function NoteToFretTranslator({ isHe }: { isHe: boolean }) {
  const [idx, setIdx] = useState(0)
  const note = NOTES[idx]

  const prev = () => setIdx(i => (i - 1 + NOTES.length) % NOTES.length)
  const next = () => setIdx(i => (i + 1) % NOTES.length)

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#E83020', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'תו על חמשה — איפה על הגיטרה?' : 'Note on Staff — Where on Guitar?'}
        </span>
      </div>

      <div style={{ padding: '20px 20px 24px' }}>
        {/* ── Staff + navigation ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={prev} style={{
            width: 36, height: 36, background: '#1A1A2E', border: 'none',
            color: '#FAF8F0', cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--fm-font-display)', fontSize: 18, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>‹</button>

          <div style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
            <svg width={STAFF_W} height={STAFF_H} style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>
              {/* Staff lines */}
              {[0,1,2,3,4].map(i => {
                const y = STAFF_BOT - i * STAFF_GAP
                return <line key={i} x1={8} y1={y} x2={STAFF_W - 8} y2={y} stroke="#C0B898" strokeWidth={0.9} />
              })}

              {/* Treble clef */}
              <text x={CLEF_X} y={STAFF_BOT + 12} fontSize={68}
                fontFamily="'Times New Roman','Palatino',serif"
                fill="#1A1A2E" style={{ userSelect: 'none' }}>
                {TREBLE}
              </text>

              {/* Note name label */}
              <text x={NOTE_X} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="#2B50E8" fontFamily="var(--fm-font-display)" letterSpacing="0.1em">
                {note.letter}
              </text>

              {/* Ledger line if note is on line 1 (E, pos=0) */}
              {note.staffPos === 0 && (
                <line x1={NOTE_X - 16} y1={staffNoteY(0)} x2={NOTE_X + 16} y2={staffNoteY(0)}
                  stroke="#1A1A2E" strokeWidth={1.2} />
              )}

              {/* Note head */}
              <ellipse cx={NOTE_X} cy={staffNoteY(note.staffPos)}
                rx={12} ry={8.5}
                fill="#2B50E8" stroke="#2B50E8" strokeWidth={1}
                transform={`rotate(-15,${NOTE_X},${staffNoteY(note.staffPos)})`} />

              {/* Stem (upward from right side, for pos < 5; downward if pos >= 5) */}
              {note.staffPos < 5 ? (
                <line x1={NOTE_X + 12} y1={staffNoteY(note.staffPos)}
                  x2={NOTE_X + 12} y2={staffNoteY(note.staffPos) - 36}
                  stroke="#2B50E8" strokeWidth={2} />
              ) : (
                <line x1={NOTE_X - 12} y1={staffNoteY(note.staffPos)}
                  x2={NOTE_X - 12} y2={staffNoteY(note.staffPos) + 36}
                  stroke="#2B50E8" strokeWidth={2} />
              )}

              {/* Position count badge */}
              <rect x={STAFF_W - 80} y={STAFF_H - 24} width={72} height={18} fill="#1A1A2E" />
              <text x={STAFF_W - 44} y={STAFF_H - 11} textAnchor="middle" fontSize={9} fontWeight={700}
                fill="#FAF8F0" fontFamily="var(--fm-font-display)" letterSpacing="0.1em">
                {note.positions.length} {isHe ? 'מיקומים' : 'POSITIONS'}
              </text>
            </svg>
          </div>

          <button onClick={next} style={{
            width: 36, height: 36, background: '#1A1A2E', border: 'none',
            color: '#FAF8F0', cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--fm-font-display)', fontSize: 18, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>›</button>
        </div>

        {/* ── Description ── */}
        <div style={{
          padding: '10px 14px', marginBottom: 18,
          background: 'rgba(43,80,232,0.07)', border: '1px solid rgba(43,80,232,0.25)',
          borderInlineStart: '4px solid #2B50E8',
          fontFamily: 'var(--fm-font-display)', fontSize: 11, color: '#2A2820',
          letterSpacing: '0.05em', lineHeight: 1.65,
        }}>
          {isHe ? note.descHe : note.descEn}
        </div>

        {/* ── Fretboard ── */}
        <div style={{ overflowX: 'auto' }}>
          <svg width={NECK_W} height={NECK_H} style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>
            {/* String labels */}
            {[6,5,4,3,2,1].map(s => (
              <text key={s} x={NECK_LEFT - 6} y={strY(s) + 4}
                textAnchor="end" fontSize={9} fontWeight={700}
                fill="#8A7E68" fontFamily="var(--fm-font-display)">
                {STR_LABEL(s)}
              </text>
            ))}

            {/* Nut (thicker line between open and fret 1) */}
            <line x1={fretLineX(1)} y1={NECK_TOP - 8} x2={fretLineX(1)} y2={NECK_TOP + 5 * STR_GAP + 8}
              stroke="#1A1A2E" strokeWidth={3} />

            {/* Fret lines */}
            {[0,2,3,4,5,6].map(f => (
              <line key={f} x1={fretLineX(f)} y1={NECK_TOP - 8} x2={fretLineX(f)} y2={NECK_TOP + 5 * STR_GAP + 8}
                stroke="#C0B898" strokeWidth={1} />
            ))}

            {/* Strings */}
            {[6,5,4,3,2,1].map((s, di) => {
              const thickness = 0.8 + di * 0.2
              return (
                <line key={s} x1={NECK_LEFT} y1={strY(s)} x2={NECK_W - 8} y2={strY(s)}
                  stroke="#8A7E68" strokeWidth={thickness} />
              )
            })}

            {/* Fret numbers */}
            {[0,1,2,3,4,5].map(f => (
              <text key={f} x={fretCX(f)} y={NECK_H - 5} textAnchor="middle"
                fontSize={9} fill="#8A7E68" fontFamily="var(--fm-font-display)">
                {f}
              </text>
            ))}

            {/* Highlighted note dots */}
            {note.positions.map((pos, pi) => {
              const x = fretCX(pos.fret)
              const y = strY(pos.str)
              return (
                <g key={pi}>
                  <circle cx={x} cy={y} r={11} fill="#2B50E8" />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fontWeight={800}
                    fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                    {note.letter}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── Note steps ── */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, justifyContent: 'center' }}>
          {NOTES.map((n, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 30, height: 30, border: 'none', cursor: 'pointer',
                background: i === idx ? '#2B50E8' : '#1A1A2E',
                color: '#FAF8F0',
                fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                transition: 'background 0.2s',
              }}
            >
              {n.letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
