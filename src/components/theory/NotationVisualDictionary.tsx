import { useState } from 'react'

// ── Staff geometry ─────────────────────────────────────────────────────────────
// Small (card): GAP=8, lines at y [6,14,22,30,38]  → h=54
// Large (panel): GAP=12, lines at y [8,20,32,44,56] → h=72
// Staff position pos: 0=E(line1/bottom), 1=F(space), 2=G(line2), 3=A, 4=B(line3/mid), 5=C, 6=D(line4), 7=E, 8=F(line5/top)
// y(pos) = bottomLine - pos * (GAP/2)

const SM_GAP = 8
const SM_BOTTOM = 38  // y of line1
const SM_H = 54
const SM_W = 80

const LG_GAP = 12
const LG_BOTTOM = 56  // y of line1
const LG_H = 80
const LG_W = 160

const smY = (pos: number) => SM_BOTTOM - pos * (SM_GAP / 2)
const lgY = (pos: number) => LG_BOTTOM - pos * (LG_GAP / 2)

// ── SVG helpers ───────────────────────────────────────────────────────────────

function SmLines({ x1 = 4, x2 = SM_W - 4 }: { x1?: number; x2?: number }) {
  return <>
    {[0,1,2,3,4].map(i => (
      <line key={i} x1={x1} y1={SM_BOTTOM - i * SM_GAP} x2={x2} y2={SM_BOTTOM - i * SM_GAP}
        stroke="#C0B898" strokeWidth={0.8} />
    ))}
  </>
}

function LgLines({ x1 = 4, x2 = LG_W - 4 }: { x1?: number; x2?: number }) {
  return <>
    {[0,1,2,3,4].map(i => (
      <line key={i} x1={x1} y1={LG_BOTTOM - i * LG_GAP} x2={x2} y2={LG_BOTTOM - i * LG_GAP}
        stroke="#C0B898" strokeWidth={0.8} />
    ))}
  </>
}

function SmHead({ pos, filled }: { pos: number; filled: boolean }) {
  const cy = smY(pos)
  return (
    <ellipse cx={44} cy={cy} rx={7} ry={5}
      fill={filled ? '#1A1A2E' : 'none'}
      stroke="#1A1A2E" strokeWidth={1.6}
      transform={`rotate(-15,44,${cy})`} />
  )
}
function LgHead({ pos, filled }: { pos: number; filled: boolean }) {
  const cy = lgY(pos)
  return (
    <ellipse cx={88} cy={cy} rx={10} ry={7.5}
      fill={filled ? '#1A1A2E' : 'none'}
      stroke="#1A1A2E" strokeWidth={2}
      transform={`rotate(-15,88,${cy})`} />
  )
}

const TREBLE = String.fromCodePoint(0x1D11E)

// ── Symbol definitions ────────────────────────────────────────────────────────
interface SymbolDef {
  id: string
  nameHe: string
  nameEn: string
  descHe: string
  descEn: string
  renderSm: () => React.ReactNode
  renderLg: () => React.ReactNode
}

const SYMBOLS: SymbolDef[] = [
  {
    id: 'treble-clef',
    nameHe: 'מפתח סול', nameEn: 'Treble Clef',
    descHe: 'עוגן החמשה. מציב את השורה השנייה מלמטה כתו סול (G). בלעדיו לא ניתן לדעת גובה הצלילים.',
    descEn: 'The anchor of the staff. It places note G on the 2nd line from the bottom. Without it, pitch is unknown.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <text x={20} y={SM_H - 4} fontSize={46} fontFamily="'Times New Roman','Palatino',serif"
          fill="#1A1A2E" textAnchor="middle" style={{ userSelect: 'none' }}>
          {TREBLE}
        </text>
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <text x={36} y={LG_H - 2} fontSize={72} fontFamily="'Times New Roman','Palatino',serif"
          fill="#1A1A2E" textAnchor="middle" style={{ userSelect: 'none' }}>
          {TREBLE}
        </text>
      </svg>
    ),
  },
  {
    id: 'time-44',
    nameHe: 'מנה 4/4', nameEn: '4/4 Time',
    descHe: '4 פעימות בכל תיבה. מנת הזמן הנפוצה ביותר ברוק, פופ, ובלוז. הסמל העליון = כמות הפעימות, התחתון = ערך הבסיס.',
    descEn: '4 beats per measure. The most common time signature in rock, pop, and blues. Upper = beat count, lower = base unit.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <text x={40} y={smY(6) + 5} fontSize={20} fontWeight={800} fill="#1A1A2E"
          textAnchor="middle" fontFamily="var(--fm-font-display)">4</text>
        <text x={40} y={smY(2) + 5} fontSize={20} fontWeight={800} fill="#1A1A2E"
          textAnchor="middle" fontFamily="var(--fm-font-display)">4</text>
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <text x={80} y={lgY(6) + 8} fontSize={30} fontWeight={800} fill="#1A1A2E"
          textAnchor="middle" fontFamily="var(--fm-font-display)">4</text>
        <text x={80} y={lgY(2) + 8} fontSize={30} fontWeight={800} fill="#1A1A2E"
          textAnchor="middle" fontFamily="var(--fm-font-display)">4</text>
      </svg>
    ),
  },
  {
    id: 'whole-note',
    nameHe: 'תו שלם – 4 פעימות', nameEn: 'Whole Note – 4 beats',
    descHe: 'עיגול חלול ללא גבעול. הצליל נמשך 4 פעימות שלמות. בגיטרה: נגן ועצור רק לאחר 4 ספירות.',
    descEn: 'Hollow oval without a stem. The sound lasts 4 full beats. On guitar: play and hold for 4 counts.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <SmHead pos={4} filled={false} />
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <LgHead pos={4} filled={false} />
      </svg>
    ),
  },
  {
    id: 'half-note',
    nameHe: 'תו חצי – 2 פעימות', nameEn: 'Half Note – 2 beats',
    descHe: 'עיגול חלול עם גבעול. מחזיק שתי פעימות. נפוץ מאוד בבלדות ובמוזיקה איטית.',
    descEn: 'Hollow oval with a stem. Holds two beats. Very common in ballads and slow music.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <SmHead pos={4} filled={false} />
        <line x1={51} y1={smY(4)} x2={51} y2={smY(4) - 24} stroke="#1A1A2E" strokeWidth={1.8} />
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <LgHead pos={4} filled={false} />
        <line x1={98} y1={lgY(4)} x2={98} y2={lgY(4) - 34} stroke="#1A1A2E" strokeWidth={2} />
      </svg>
    ),
  },
  {
    id: 'quarter-note',
    nameHe: 'תו רבע – 1 פעימה', nameEn: 'Quarter Note – 1 beat',
    descHe: 'עיגול מלא עם גבעול. פעימה אחת. הצורה הנפוצה ביותר בכתיבת מוזיקה.',
    descEn: 'Filled oval with a stem. One beat. The most common note shape in all music writing.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <SmHead pos={4} filled />
        <line x1={51} y1={smY(4)} x2={51} y2={smY(4) - 24} stroke="#1A1A2E" strokeWidth={1.8} />
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <LgHead pos={4} filled />
        <line x1={98} y1={lgY(4)} x2={98} y2={lgY(4) - 34} stroke="#1A1A2E" strokeWidth={2} />
      </svg>
    ),
  },
  {
    id: 'eighth-note',
    nameHe: 'תו שמינית – ½ פעימה', nameEn: 'Eighth Note – ½ beat',
    descHe: 'עיגול מלא עם גבעול ודגל. חצי פעימה. שניים מאוגדים יחד שווים תו רבע אחד.',
    descEn: 'Filled oval with a stem and flag. Half a beat. Two beamed together equal one quarter note.',
    renderSm: () => {
      const headY = smY(4), stemTopY = headY - 24
      return (
        <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
          <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
          <SmLines />
          <SmHead pos={4} filled />
          <line x1={51} y1={headY} x2={51} y2={stemTopY} stroke="#1A1A2E" strokeWidth={1.8} />
          <path d={`M51,${stemTopY} C61,${stemTopY+4} 59,${stemTopY+13} 49,${stemTopY+16}`}
            stroke="#1A1A2E" strokeWidth={2} fill="none" />
        </svg>
      )
    },
    renderLg: () => {
      const headY = lgY(4), stemTopY = headY - 34
      return (
        <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
          <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
          <LgLines />
          <LgHead pos={4} filled />
          <line x1={98} y1={headY} x2={98} y2={stemTopY} stroke="#1A1A2E" strokeWidth={2} />
          <path d={`M98,${stemTopY} C115,${stemTopY+6} 112,${stemTopY+20} 96,${stemTopY+24}`}
            stroke="#1A1A2E" strokeWidth={2.5} fill="none" />
        </svg>
      )
    },
  },
  {
    id: 'whole-rest',
    nameHe: 'הפסקה שלמה', nameEn: 'Whole Rest',
    descHe: 'מלבן תלוי מהשורה הרביעית. 4 פעימות של שקט מוחלט. גם ידועה כ"תיבה שלמה שקטה".',
    descEn: 'Rectangle hanging below the 4th line. 4 beats of silence. Also means "an entire measure of silence".',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <rect x={24} y={smY(6)} width={32} height={6} fill="#1A1A2E" />
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <rect x={52} y={lgY(6)} width={52} height={9} fill="#1A1A2E" />
      </svg>
    ),
  },
  {
    id: 'half-rest',
    nameHe: 'הפסקה חצי', nameEn: 'Half Rest',
    descHe: 'מלבן יושב על השורה השלישית (האמצעית). 2 פעימות של שקט. הפוך מהפסקה שלמה.',
    descEn: 'Rectangle sitting on the 3th (middle) line. 2 beats of silence. The inverse of the whole rest.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <rect x={24} y={smY(4) - 6} width={32} height={6} fill="#1A1A2E" />
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <rect x={52} y={lgY(4) - 9} width={52} height={9} fill="#1A1A2E" />
      </svg>
    ),
  },
  {
    id: 'quarter-rest',
    nameHe: 'הפסקה רבע', nameEn: 'Quarter Rest',
    descHe: 'סמל זיגזג ייחודי. פעימה אחת של שקט. הגרוב של המוזיקה נוצר לרוב בשקטים האלה.',
    descEn: 'A distinctive zigzag symbol. One beat of silence. Groove is often created from these silences.',
    renderSm: () => (
      <svg width={SM_W} height={SM_H} style={{ display: 'block' }}>
        <rect width={SM_W} height={SM_H} fill="#FAF8F0" />
        <SmLines />
        <path d="M44,10 L36,17 L44,24 L36,31 L39,38 L33,45"
          stroke="#1A1A2E" strokeWidth={2.2} fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    renderLg: () => (
      <svg width={LG_W} height={LG_H} style={{ display: 'block' }}>
        <rect width={LG_W} height={LG_H} fill="#FAF8F0" />
        <LgLines />
        <path d="M84,12 L70,22 L84,32 L70,42 L76,52 L62,66"
          stroke="#1A1A2E" strokeWidth={3} fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotationVisualDictionary({ isHe }: { isHe: boolean }) {
  const [selected, setSelected] = useState<string | null>(null)
  const sym = selected ? SYMBOLS.find(s => s.id === selected) ?? null : null

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#2B50E8', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מילון הסמלים — לחץ להרחבה' : 'Symbol Dictionary — Click to Expand'}
        </span>
      </div>

      <div style={{ padding: '20px 20px 24px' }}>
        {/* ── Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: sym ? 20 : 0 }}>
          {SYMBOLS.map(s => {
            const isActive = selected === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSelected(isActive ? null : s.id)}
                style={{
                  background: isActive ? '#1A1A2E' : '#FAF8F0',
                  border: `2px solid ${isActive ? '#2B50E8' : '#D8D0BC'}`,
                  padding: '10px 6px 8px',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#2B50E8' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#D8D0BC' }}
              >
                <div style={{ filter: isActive ? 'invert(1)' : 'none', transition: 'filter 0.2s' }}>
                  {s.renderSm()}
                </div>
                <div style={{
                  fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
                  color: isActive ? '#FAF8F0' : '#5A5040',
                  textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {isHe ? s.nameHe : s.nameEn}
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Expanded panel ── */}
        {sym && (
          <div style={{
            background: '#1A1A2E', padding: '20px 22px',
            display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap',
          }}>
            {/* Large symbol */}
            <div style={{ background: '#FAF8F0', padding: 10, flexShrink: 0 }}>
              {sym.renderLg()}
            </div>

            {/* Description */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 14, fontWeight: 700,
                color: '#FAF8F0', letterSpacing: '0.06em', marginBottom: 10,
              }}>
                {isHe ? sym.nameHe : sym.nameEn}
              </div>
              <p style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 12,
                color: 'rgba(250,248,240,0.75)', lineHeight: 1.7, margin: 0,
                letterSpacing: '0.04em',
              }}>
                {isHe ? sym.descHe : sym.descEn}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
