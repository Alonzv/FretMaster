import { useState } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────────
interface ChordType {
  id: string
  label: string
  labelHe: string
  quality: 'major' | 'minor' | 'dominant' | 'half-dim'
  desc: string
  descHe: string
  color: string
  // intervals in semitones from root: [root=0, 3rd, 5th, 7th]
  intervals: number[]
  intervalLabels: string[]
}

const CHORD_TYPES: ChordType[] = [
  {
    id: 'maj7',
    label: 'Major 7',
    labelHe: "מז'ור 7",
    quality: 'major',
    color: '#2B50E8',
    desc: 'Nostalgic, dreamy, floating. The sound of cinematic resolution.',
    descHe: 'נוסטלגי, חולמני, מרחף. הסאונד של פתרון קולנועי.',
    intervals: [0, 4, 7, 11],
    intervalLabels: ['1', 'M3', 'P5', 'M7'],
  },
  {
    id: 'min7',
    label: 'Minor 7',
    labelHe: 'מינור 7',
    quality: 'minor',
    color: '#5A3FD4',
    desc: 'Soft, open, sophisticated. The sound of modern R&B and neo-soul.',
    descHe: 'רך, פתוח, מתוחכם. הסאונד של R&B ונאו-סול מודרני.',
    intervals: [0, 3, 7, 10],
    intervalLabels: ['1', 'm3', 'P5', 'm7'],
  },
  {
    id: 'dom7',
    label: 'Dominant 7',
    labelHe: 'דומיננט 7',
    quality: 'dominant',
    color: '#E83020',
    desc: 'Tension and urgency. The tritone inside demands resolution to the tonic.',
    descHe: 'מתח ודחיפות. הטריטון הפנימי דורש פתרון לטוניקה.',
    intervals: [0, 4, 7, 10],
    intervalLabels: ['1', 'M3', 'P5', 'm7'],
  },
  {
    id: 'hdim7',
    label: 'Half-Dim 7',
    labelHe: 'חצי מוקטן 7',
    quality: 'half-dim',
    color: '#6B6B6B',
    desc: 'Gloomy, mysterious, restless. The dark bridge of ii-V-I in minor.',
    descHe: 'קודר, מסתורי, חסר מנוחה. הגשר האפל של ii-V-I במינור.',
    intervals: [0, 3, 6, 10],
    intervalLabels: ['1', 'm3', 'b5', 'm7'],
  },
]

interface Extension {
  id: string
  label: string
  semitones: number // above root
  desc: string
  descHe: string
  color: string
  reqQuality?: string[] // which chord types support it
}

const EXTENSIONS: Extension[] = [
  {
    id: 'add9',
    label: '9',
    semitones: 14,
    color: '#F5C200',
    desc: 'Luxurious depth. The signature of neo-soul and R&B.',
    descHe: 'עומק יוקרתי. תעודת הזהות של הניאו-סול.',
  },
  {
    id: 'sharp11',
    label: '#11',
    semitones: 18,
    color: '#00C896',
    desc: 'Magic, wonder, cinematic float. The Lydian weapon (Zimmer, E.T.).',
    descHe: 'קסם, פליאה, ריחוף קולנועי. נשק הלידי (צימר, אי.טי).',
    reqQuality: ['major', 'dominant'],
  },
  {
    id: 'add11',
    label: '11',
    semitones: 17,
    color: '#00C896',
    desc: 'Modern, transparent, open. Common in minor chords.',
    descHe: 'מודרני, שקוף, פתוח. נפוץ באקורדים מינוריים.',
    reqQuality: ['minor', 'half-dim'],
  },
  {
    id: 'add13',
    label: '13',
    semitones: 21,
    color: '#FF6B35',
    desc: 'Sharp, rich groove. The sound of funk and big-band jazz.',
    descHe: "גרוב חריף ועשיר. הסאונד של פאנק וג'אז ביג-בנד.",
    reqQuality: ['dominant', 'major'],
  },
]

// ── Piano keyboard renderer ───────────────────────────────────────────────────
// Shows one octave (C to B = semitones 0-11) + a bit above
const PIANO_W  = 340
const PIANO_H  = 90
const KEY_W    = PIANO_W / 7  // 7 white keys: C D E F G A B
const KEY_H    = PIANO_H

const WHITE_KEYS = [
  { note: 'C', st: 0  },
  { note: 'D', st: 2  },
  { note: 'E', st: 4  },
  { note: 'F', st: 5  },
  { note: 'G', st: 7  },
  { note: 'A', st: 9  },
  { note: 'B', st: 11 },
]
const BLACK_KEYS = [
  { note: 'C#', st: 1,  x: KEY_W * 0.65 },
  { note: 'D#', st: 3,  x: KEY_W * 1.65 },
  { note: 'F#', st: 6,  x: KEY_W * 3.65 },
  { note: 'G#', st: 8,  x: KEY_W * 4.65 },
  { note: 'A#', st: 10, x: KEY_W * 5.65 },
]

function PianoViz({ activeSt }: { activeSt: number[] }) {
  const stMod = (st: number) => ((st % 12) + 12) % 12

  return (
    <svg width={PIANO_W} height={PIANO_H}
      style={{ display: 'block', border: '1px solid #1A1A2E' }}>
      {WHITE_KEYS.map((k, i) => {
        const hit = activeSt.some(s => stMod(s) === k.st)
        return (
          <g key={k.note}>
            <rect x={i * KEY_W + 1} y={0} width={KEY_W - 2} height={KEY_H}
              fill={hit ? '#2B50E8' : '#FAF8F0'} stroke="#1A1A2E" strokeWidth={1} />
            {hit && (
              <text x={i * KEY_W + KEY_W / 2} y={KEY_H - 10}
                textAnchor="middle" fontSize={9} fontWeight={800}
                fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                {k.note}
              </text>
            )}
          </g>
        )
      })}
      {BLACK_KEYS.map(k => {
        const hit = activeSt.some(s => stMod(s) === k.st)
        return (
          <rect key={k.note} x={k.x} y={0} width={KEY_W * 0.6} height={KEY_H * 0.62}
            fill={hit ? '#E83020' : '#1A1A2E'} stroke="#000" strokeWidth={1} />
        )
      })}
    </svg>
  )
}

// ── Stack diagram ─────────────────────────────────────────────────────────────
function StackDiagram({
  chord, activeExts, isHe,
}: { chord: ChordType; activeExts: string[]; isHe: boolean }) {
  const allExts = EXTENSIONS.filter(e => activeExts.includes(e.id))

  // Stack bottom→top: root, 3rd, 5th, 7th, [extensions]
  const layers = [
    { label: isHe ? 'שורש (1)' : 'Root (1)',  color: '#E83020' },
    { label: isHe ? 'טרצה (3)' : '3rd',        color: chord.color },
    { label: isHe ? 'קווינטה (5)' : '5th',      color: '#4A4A6E' },
    { label: isHe ? 'ספטימה (7)' : '7th',       color: chord.color },
    ...allExts.map(e => ({
      label: e.label,
      color: e.color,
    })),
  ]

  const H    = 36
  const GAP  = 4
  const totalH = layers.length * (H + GAP)

  return (
    <svg width={160} height={totalH + 8} style={{ display: 'block' }}>
      {[...layers].reverse().map((layer, i) => {
        const y = i * (H + GAP)
        return (
          <g key={i}>
            <rect x={0} y={y} width={156} height={H}
              fill={layer.color} />
            <text x={78} y={y + H / 2 + 5}
              textAnchor="middle" fontSize={10} fontWeight={700}
              fill="#FAF8F0" fontFamily="var(--fm-font-display)"
              letterSpacing="0.05em">
              {layer.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChordExtensionBuilder({ isHe }: { isHe: boolean }) {
  const [selectedChord, setSelectedChord] = useState<string>('dom7')
  const [activeExts, setActiveExts]       = useState<string[]>([])

  const chord = CHORD_TYPES.find(c => c.id === selectedChord)!

  const toggleExt = (id: string) => {
    setActiveExts(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const availableExts = EXTENSIONS.filter(
    e => !e.reqQuality || e.reqQuality.includes(chord.quality)
  )

  // All active semitones: chord intervals + extensions
  const activeSt = [
    ...chord.intervals,
    ...activeExts
      .map(id => EXTENSIONS.find(e => e.id === id))
      .filter(e => e && (!e.reqQuality || e.reqQuality.includes(chord.quality)))
      .map(e => e!.semitones),
  ]

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#F5C200', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'בונה האקורד המורחב' : 'Chord Extension Builder'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Chord type selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {CHORD_TYPES.map(ct => (
            <button key={ct.id}
              onClick={() => { setSelectedChord(ct.id); setActiveExts([]) }}
              style={{
                flex: 1, minWidth: 72, padding: '8px 6px',
                border: 'none', cursor: 'pointer',
                background: ct.id === selectedChord ? ct.color : '#1A1A2E',
                color: '#FAF8F0',
                fontFamily: 'var(--fm-font-display)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
              {isHe ? ct.labelHe : ct.label}
            </button>
          ))}
        </div>

        {/* Chord description */}
        <div style={{
          padding: '10px 14px', marginBottom: 16,
          background: 'rgba(43,80,232,0.07)', borderInlineStart: `4px solid ${chord.color}`,
          fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
          lineHeight: 1.6,
        }}>
          {isHe ? chord.descHe : chord.desc}
        </div>

        {/* Main layout: stack + piano */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.12em', marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              {isHe ? 'מבנה האקורד' : 'Chord Stack'}
            </div>
            <StackDiagram chord={chord} activeExts={activeExts} isHe={isHe} />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              color: '#8A7E68', letterSpacing: '0.12em', marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              {isHe ? 'על הפסנתר (C)' : 'On the Piano (C)'}
            </div>
            <PianoViz activeSt={activeSt} />
          </div>
        </div>

        {/* Extension buttons */}
        <div style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
          color: '#8A7E68', letterSpacing: '0.12em', marginBottom: 8,
          textTransform: 'uppercase',
        }}>
          {isHe ? 'הוסף מתח / צבע' : 'Add Tension / Color'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {availableExts.map(ext => {
            const on = activeExts.includes(ext.id)
            return (
              <button key={ext.id} onClick={() => toggleExt(ext.id)} style={{
                padding: '10px 16px', border: `2px solid ${ext.color}`,
                cursor: 'pointer',
                background: on ? ext.color : 'transparent',
                color: on ? '#FAF8F0' : ext.color,
                fontFamily: 'var(--fm-font-display)', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.08em',
              }}>
                +{ext.label}
              </button>
            )
          })}
        </div>

        {/* Active extension descriptions */}
        {activeExts.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {activeExts
              .map(id => availableExts.find(e => e.id === id))
              .filter(Boolean)
              .map(ext => (
                <div key={ext!.id} style={{
                  padding: '8px 12px',
                  background: '#1A1A2E',
                  borderInlineStart: `3px solid ${ext!.color}`,
                  fontFamily: 'var(--fm-font-body)', fontSize: 11, color: '#FAF8F0',
                  lineHeight: 1.5,
                }}>
                  <span style={{ fontWeight: 700, color: ext!.color, fontFamily: 'var(--fm-font-display)' }}>
                    {ext!.label}
                  </span>
                  {' '}{isHe ? ext!.descHe : ext!.desc}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
