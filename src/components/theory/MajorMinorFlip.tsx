import { useState } from 'react'

// ── Chord diagram geometry ────────────────────────────────────────────────────
// Vertical layout: strings = vertical lines (left=str6/low-E, right=str1/high-e)
//                  frets   = horizontal lines (top=nut)

const LEFT_PAD    = 28
const TOP_PAD     = 44   // space above nut for open-string circles + mutes
const STR_SPACING = 22
const FRET_SPACING = 36
const N_STRINGS   = 6
const N_FRETS     = 3
const DOT_R       = 10

const SVG_W = LEFT_PAD * 2 + (N_STRINGS - 1) * STR_SPACING
const SVG_H = TOP_PAD + N_FRETS * FRET_SPACING + 16

const sx = (si: number) => LEFT_PAD + si * STR_SPACING                  // string x
const fy = (fret: number) => TOP_PAD + (fret - 0.5) * FRET_SPACING      // dot y inside fret cell

// ── A Major / A Minor fingering ───────────────────────────────────────────────
// A major: x 0 2 2 2 0  →  muted str6, open str5, fret2 str4/3/2, open str1
// A minor: x 0 2 2 1 0  →  same except str2 (si=4) moves from fret2 → fret1

const ROLE_COLORS = {
  root:  { fill: '#2B50E8', text: '#FAF8F0' },
  third: { fill: '#E83020', text: '#FAF8F0' },
  fifth: { fill: '#F5C200', text: '#1A1A2E' },
} as const
type Role = keyof typeof ROLE_COLORS

interface StringDef { si: number; fret: number; open: boolean; role: Role; note: string }

function getChord(isMajor: boolean): StringDef[] {
  return [
    // si=0 (str6): muted — represented separately
    { si: 1, fret: 0, open: true,  role: 'root',  note: 'A' },
    { si: 2, fret: 2, open: false, role: 'fifth', note: 'E' },
    { si: 3, fret: 2, open: false, role: 'root',  note: 'A' },
    { si: 4, fret: isMajor ? 2 : 1, open: false, role: 'third', note: isMajor ? 'C#' : 'C' },
    { si: 5, fret: 0, open: true,  role: 'fifth', note: 'E' },
  ]
}

function IconSwap() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
      <line x1="2" y1="4" x2="12" y2="4"/>
      <polyline points="9,1 12,4 9,7"/>
      <line x1="12" y1="10" x2="2" y2="10"/>
      <polyline points="5,7 2,10 5,13"/>
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MajorMinorFlip({ isHe }: { isHe: boolean }) {
  const [isMajor, setIsMajor] = useState(true)
  const lang    = isHe ? 'he' : 'en'
  const chord   = getChord(isMajor)

  const thirdNote  = isMajor ? 'C#' : 'C'
  const thirdFret  = isMajor ? 2 : 1
  const ghostFret  = isMajor ? 1 : 2
  const ghostNote  = isMajor ? 'C' : 'C#'
  const ghostLabel = isMajor
    ? (isHe ? 'טרצה קטנה (+3)' : 'Minor 3rd (+3)')
    : (isHe ? 'טרצה גדולה (+4)' : 'Major 3rd (+4)')
  const activeLabel = isMajor
    ? (isHe ? 'טרצה גדולה (+4) — מז׳ורי' : 'Major 3rd (+4) — Major')
    : (isHe ? 'טרצה קטנה (+3) — מינורי'  : 'Minor 3rd (+3) — Minor')

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#E83020', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? "מתג מז'ור / מינור" : 'Major / Minor Flip'}
        </span>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* ── Chord diagram ── */}
        <div style={{ flexShrink: 0 }}>
          {/* Chord name */}
          <div style={{
            fontFamily: 'var(--fm-font-display)', fontSize: 22, fontWeight: 800,
            color: '#1A1A2E', marginBottom: 12, letterSpacing: '-0.02em', textAlign: 'center',
            transition: 'color 0.2s',
          }}>
            A {isMajor ? (isHe ? "מז'ור" : 'Major') : (isHe ? 'מינור' : 'Minor')}
          </div>

          <svg width={SVG_W} height={SVG_H} style={{ display: 'block' }}>
            {/* Mute marker (str6, si=0) */}
            <text x={sx(0)} y={TOP_PAD - 24} textAnchor="middle"
              fontSize={15} fill="#1A1A2E" fontWeight={700}>
              ×
            </text>

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

            {/* Open string circles (plain, non-third) */}
            {chord.filter(d => d.open && d.role !== 'third').map(d => {
              const rc = ROLE_COLORS[d.role]
              return (
                <g key={d.si}>
                  <circle cx={sx(d.si)} cy={TOP_PAD - 14} r={DOT_R}
                    fill={rc.fill} />
                  <text x={sx(d.si)} y={TOP_PAD - 10}
                    textAnchor="middle" fontSize={8} fill={rc.text}
                    fontFamily="var(--fm-font-display)" fontWeight={700}>
                    {d.note}
                  </text>
                </g>
              )
            })}

            {/* Fretted dots (non-third) */}
            {chord.filter(d => !d.open && d.role !== 'third').map(d => {
              const rc = ROLE_COLORS[d.role]
              return (
                <g key={d.si}>
                  <circle cx={sx(d.si)} cy={fy(d.fret)} r={DOT_R} fill={rc.fill} />
                  <text x={sx(d.si)} y={fy(d.fret) + 4}
                    textAnchor="middle" fontSize={8} fill={rc.text}
                    fontFamily="var(--fm-font-display)" fontWeight={700}>
                    {d.note}
                  </text>
                </g>
              )
            })}

            {/* Ghost third (inactive position) */}
            <circle cx={sx(4)} cy={fy(ghostFret)} r={DOT_R}
              fill="none" stroke="#E83020" strokeWidth={1.5} strokeDasharray="3,2"
              opacity={0.35}
              style={{ transition: 'opacity 0.3s' }}
            />
            <text x={sx(4)} y={fy(ghostFret) + 4}
              textAnchor="middle" fontSize={8} fill="#E83020"
              fontFamily="var(--fm-font-display)" fontWeight={700} opacity={0.35}
              style={{ transition: 'opacity 0.3s' }}>
              {ghostNote}
            </text>

            {/* Active third */}
            <circle cx={sx(4)} cy={fy(thirdFret)} r={DOT_R}
              fill="#E83020"
              style={{ transition: 'cy 0.25s ease' }}
            />
            <text x={sx(4)} y={fy(thirdFret) + 4}
              textAnchor="middle" fontSize={8} fill="#FAF8F0"
              fontFamily="var(--fm-font-display)" fontWeight={700}
              style={{ transition: 'y 0.25s ease' }}>
              {thirdNote}
            </text>
          </svg>
        </div>

        {/* ── Info panel ── */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {/* Flip button */}
          <button
            onClick={() => setIsMajor(p => !p)}
            style={{
              width: '100%', padding: '13px 20px',
              background: isMajor ? '#2B50E8' : '#1A1A2E',
              color: '#FAF8F0', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--fm-font-display)', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 22,
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            <IconSwap />
            {isMajor
              ? (isHe ? 'הפוך למינורי' : 'Flip to Minor')
              : (isHe ? "הפוך למז'ורי" : 'Flip to Major')}
          </button>

          {/* What moved */}
          <div style={{ borderInlineStart: '3px solid #E83020', paddingInlineStart: 14, marginBottom: 20 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
              color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8,
            }}>
              {isHe ? 'מה השתנה?' : 'What changed?'}
            </div>
            <div style={{ fontFamily: 'var(--fm-font-display)', fontSize: 12, color: '#1A1A2E', lineHeight: 1.8 }}>
              <span style={{ background: '#E83020', color: '#FAF8F0', padding: '1px 6px', fontWeight: 700, fontSize: 11 }}>
                {isHe ? 'הטרצה' : 'The Third'}
              </span>
              {'  '}
              <span style={{ color: '#3A3020' }}>{activeLabel}</span>
            </div>
            <div style={{ marginTop: 8, fontFamily: 'var(--fm-font-display)', fontSize: 11, color: '#5A5040', lineHeight: 1.7 }}>
              {isHe
                ? `אצבע אחת זזה סריג ${isMajor ? 'קדימה' : 'אחורה'} — כל האקורד השתנה`
                : `One finger moved one fret ${isMajor ? 'forward' : 'back'} — the whole chord changed`}
            </div>
          </div>

          {/* Ghost legend */}
          <div style={{
            padding: '10px 12px',
            background: 'rgba(232,48,32,0.06)', border: '1px solid rgba(232,48,32,0.2)',
          }}>
            <div style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700, color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
              {isHe ? 'מיקום הצל (לא פעיל)' : 'Ghost Position (inactive)'}
            </div>
            <div style={{ fontFamily: 'var(--fm-font-display)', fontSize: 11, color: '#3A3020' }}>
              {ghostNote} — {ghostLabel}
            </div>
          </div>

          {/* Formula */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700, color: '#8A7E68', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
              {isHe ? 'נוסחה' : 'Formula'}
            </div>
            {[
              { role: 'root'  as Role, note: 'A',       label: { en: 'Root',                          he: 'שורש' } },
              { role: 'third' as Role, note: thirdNote,  label: { en: isMajor ? 'Major 3rd (+4)' : 'Minor 3rd (+3)', he: isMajor ? 'טרצה גדולה (+4)' : 'טרצה קטנה (+3)' } },
              { role: 'fifth' as Role, note: 'E',        label: { en: 'Perfect 5th (+7)',              he: 'קווינטה זכה (+7)' } },
            ].map(row => {
              const rc = ROLE_COLORS[row.role]
              return (
                <div key={row.role} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    width: 28, height: 28, background: rc.fill, color: rc.text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700, flexShrink: 0,
                    transition: 'background 0.2s',
                  }}>
                    {row.note}
                  </span>
                  <span style={{ fontFamily: 'var(--fm-font-display)', fontSize: 11, color: '#3A3020' }}>
                    {row.label[lang]}
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
