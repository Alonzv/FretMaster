import { useState } from 'react'

// ── Fretboard geometry ────────────────────────────────────────────────────────
const FRET_COUNT = 5
const FRET_W     = 50
const STR_GAP    = 18
const LEFT       = 36
const TOP        = 20
const W          = LEFT + FRET_COUNT * FRET_W + 20
const H          = TOP + 5 * STR_GAP + 34

const strY  = (s: number) => TOP + (6 - s) * STR_GAP

const STR_LABELS = ['e','B','G','D','A','E']

// ── Voicing stages ────────────────────────────────────────────────────────────
// G7 at fret 5 area (open position shape moved up):
// Full G7 (str 6,5,4,3,2,1): 3x2333 → let's use a movable shape
// We use a 4-string Drop 2 shape of G7 on strings 4-3-2-1 at position 5
// G=str4/f5(root), B=str3/f4(3rd M3), D=str2/f3(5th), F=str1/f1(7th m7)
// Actually let's use a cleaner example: C7 at fret 3
// C7 Drop2 on strings 4-3-2-1:
//   C=str4/f3(root), E=str3/f2(3rd), G=str2/f3(5th), Bb=str1/f1(b7)
// Let's use a slightly higher position so numbers are clean:
// G7 at standard position, strings 5-4-3-2:
//   G=str6/f3(root-bass), B=str5/f2(3rd), D=str4/f5(5th), F=str3/f5(b7th)
// Even simpler — use C Dominant 7, fret 3 area:
// Strings 5-4-3-2: A-string base
//   C=str5/f3(root), E=str4/f2(3rd), G=str3/f5(5th), Bb=str2/f3(b7)
// The clearest pedagogical example: use root on str 5, fret 3 = C
// This gives us a playable G7 shape (rooted on A-string at fret 3 = C7):
//   Str5/f3 = C (root)
//   Str4/f2 = E (3rd)  — 1 fret behind because of tuning
//   Str3/f3 = G (5th)  — same fret as root
//   Wait, that's wrong. Let me compute properly.
// C = MIDI 48 = str5/f3 (open A2=45, +3=48=C)
// E = MIDI 52 = str4/f2 (open D3=50, +2=52=E) → 3rd (major)
// G = MIDI 55 = str4/f5 or str3/f0 (open G3=55) → 5th
// Bb = MIDI 58 = str3/f3 or str2/f3 (open B3=59, -1=58) → b7
//
// So C7 on strings 5-4-3-2:
//   C=str5/f3, E=str4/f2, G=str3/f0(open!), Bb=str2/f3 → but open strings are messy
//
// Let's just use a concrete movable voicing everyone knows:
// C7 barre-style on strings 4-3-2-1 (no open strings):
//   C = str4/f10, E = str3/f9, G = str2/f8, Bb = str1/f6
// That's too high. Use a shape nearer fret 5:
// G7 on strings 6-4-3-2 (Drop 3 style) — fret 3 area:
//   G=str6/f3, D=str4/f5, F=str3/f5, B=str2/f4(wrong B is 3rd)
// Ok, let me just define exact notes and make it work visually.
// I'll use E7 at fret 7 area (movable shape):
// E7 Drop2 on strings 4-3-2-1:
//   E=str4/f7(root), G#=str3/f6(3rd), B=str2/f7(5th), D=str1/f5(b7)
// Base fret 5, so display frets 5-9.
// fretX: base=5, so fretX(5)=LEFT+0*FRET_W+FRET_W/2, fretX(7)=LEFT+2*FRET_W+FRET_W/2
// Actually let me rewrite fretX to use baseFret:

interface Note {
  str: number
  fret: number
  role: '1' | '3' | '5' | '7'
  name: string
  active: boolean  // shown or hidden (5th gets hidden in shell)
}

interface ExtNote {
  id: string
  str: number
  fret: number
  role: '9' | '11' | '13'
  name: string
  color: string
  label: string
  labelHe: string
  desc: string
  descHe: string
}

// E7 at fret 7, strings 4-3-2-1
// E=str4/f7, G#=str3/f6, B=str2/f7, D=str1/f5
// Extensions (from root E, fret 7 on str4):
//   9th (F#) = E+2st = F#: on str2, fret 7+2=9? No.
//   Let me place extensions on nearby strings.
//   9th = 2 frets above root octave. Root on str4/f7.
//   Octave of E above: str2/f9 or str1/f12. Let's use str2/f9.
//   Wait, str2 is occupied by B (5th). After shell, str2 fret 7 = B is gone.
//   After removing 5th (B on str2/f7), str2 is free.
//   9th (F#) on str2/f7 (7+2=9? No, F#=1st above E: E+2st=F#)
//   Actually 9th = 2nd = 2 semitones above root but higher octave
//   E=0, F=1, F#=2, G=3, G#=4 -> 9th of E is F# (2 semitones from E)
//   On str2 (open=B=7st): F# = 7st -> fret = 2-7= can't be negative
//   Hmm. Let's think differently.
//   str1 (open e=E4=24st from E2):
//     F# on str1: E4=open, F#4=2st above=fret 2.
//     But our voicing is at fret 5 area.
//     F#5 = F#4+12 = 2+12=14 frets. Too high.
//   Let me use a different root position: C7 at fret 8 area on strings 4-3-2-1:
//     C=str4/f10, E=str3/f9, G=str2/f8, Bb=str1/f6 -- that's high
//
//   SIMPLEST APPROACH: Just define the notes absolutely and make a clean demo.
//   G7 at fret 3 region, all on strings 5-4-3-2 (A-string root):
//     G=str5/f10 (too high), or G=str6/f3, B=str5/f2, D=str4/f5 (wrong order)
//
//   I'm overcomplicating this. Let me just pick concrete fret positions
//   that look good on a 5-fret window and are musically correct.
//
//   G7 Drop2 on strings 4-3-2-1, root on str4 fret 5 (G):
//     G = str4/f5 (root)
//     B = str3/f4 (maj 3rd)
//     D = str2/f3 (5th) -- actually str2 open is B. D on str2 = fret 3 ✓ (B+3=D)
//     F = str1/f1 (b7th) -- str1 open is E. F on str1 = fret 1 ✓
//   But window is frets 1-5, which is fine.
//
//   5th to remove: D on str2/f3
//   Free finger after removal: can add extensions
//   9th (A) of G: A is 2 st above G. On str2: B(open)+? = A is 1 semitone below B.
//     str2/f-1? No. str1/f5 (E+5=A) ✓ -- That's in our window! fret 5.
//   13th (E) of G: E on str1/f0=open ✓ -- fret 0 in window.
//   11th (#11 = C# of G Lydian): on str2/f1 (B+1=C) wait C not C#...
//     C# on str2: B(open)=59, C#=61, fret 2 ✓
//
//   So the full picture:
//   Window: frets 1-5 (show fret 0 too for open strings)
//   BASE NOTES (G7): G=str4/f5, B=str3/f4, D=str2/f3, F=str1/f1
//   SHELL (remove D on str2/f3): only G, B, F remain
//   Extensions:
//     9th (A): str1/f5 ← replaces nothing since str1/f1(F) is still there...
//     Hmm, two notes on same string.
//
//   Let me try a 6-string voicing where 5th is on a different string:
//   G7 on strings 6-5-4-3 (low root position), fret 3 area:
//     G = str6/f3 (root)
//     B = str5/f2 (maj 3rd, P4 interval so -1 fret from root = fret 2) ✓
//     D = str4/f0 (open D) ← open string...
//     Actually: str4 open = D ✓ and str4/f5 would be G (root again)
//
//   OK I'm going to simplify drastically. The component shows a DIAGRAMMATIC
//   illustration, not necessarily a real playable shape. The point is to show
//   the concept. I'll use a clear 4-note grid on strings 4-3-2-1:
//
//   G7 movable shape at fret 3, strings 4-3-2-1:
//   G=str4/f5, B=str3/f4, D=str2/f3, F=str1/f1
//   (same as above, window 1-5)
//
//   Remove 5th: D on str2/f3 → grey out → str2 is now free
//   9th (A): on str2/f5 (B open-B=0 oh wait str2=open B =59 MIDI, A=57=59-2=fret-2? No)
//   str2: open=B(59), fret1=C(60), fret2=C#(61), fret3=D(62), fret4=D#, fret5=E(64)
//   A on str2 = 59-2=57 → negative fret. Can't do.
//   A on str3: open G(55), A=57=55+2=fret2 ✓
//   But str3 is occupied by B (3rd).
//
//   FINAL DECISION: I'll just use plausible-looking fret positions that
//   illustrate the CONCEPT clearly, even if they aren't a standard shape.
//   The pedagogical goal is what matters.
//
//   G Dominant 7:
//   Full chord: G(root), B(3rd), D(5th), F(b7th)
//   Display on strings 4-3-2-1:
//     str4/f5 = G (root)     ← correct, str4 open = D, +5 = G ✓
//     str3/f4 = B (3rd)      ← str3 open = G, +4 = B ✓
//     str2/f3 = D (5th)      ← str2 open = B, +3 = D ✓
//     str1/f1 = F (b7th)     ← str1 open = E, +1 = F ✓
//   All correct! Window: frets 1-5.
//
//   Shell: remove D on str2/f3 (5th)
//   Extensions (freed string = str2):
//     9th (A): where? str2/f5 = E (not A). str1/f5 = A ✓ (E+5=A)
//       But str1 is occupied by F. After removing F too? No, F is the 7th.
//       We only remove the 5th (D). F stays.
//       So str1 has F. str2 is free.
//       A on str2: B(open=0) → A = -2? Can't.
//       Place A on str3/f2: G+2=A ✓ but str3 has B...
//
//   I think the cleanest solution for the component is to NOT worry about
//   exact playability and show a conceptual diagram where:
//   - Full chord: 4 notes shown on fretboard
//   - Shell mode: 5th node is visually greyed out/removed
//   - Extension added: new node appears on a plausible fret position
//
//   So I'll define the extension positions as conceptually plausible even if
//   not all perfectly on the same strings. The text explains the concept.

const BASE_FRET = 1  // lowest fret in window
const DISP_FRETS = 5 // display frets 1-5

const fretXAbs = (f: number) => LEFT + (f - BASE_FRET) * FRET_W + FRET_W / 2

// G7 chord notes (verified correct):
const FULL_NOTES: Note[] = [
  { str: 4, fret: 5, role: '1', name: 'G',  active: true },
  { str: 3, fret: 4, role: '3', name: 'B',  active: true },
  { str: 2, fret: 3, role: '5', name: 'D',  active: true },  // ← will be removed
  { str: 1, fret: 1, role: '7', name: 'F',  active: true },
]

// Extensions that appear after 5th is removed
// 9th (A): place on str3/f2 (G+2=A — conceptually on a "freed position")
// #11 (C#): on str3/f3 — conceptually
// 13 (E): on str2/f5 (B+4=E? No: B=0, C=1,C#=2,D=3,D#=4,E=5 → fret5 on str2 = E ✓)
const EXTENSIONS: ExtNote[] = [
  {
    id: 'add9',
    str: 3, fret: 2,
    role: '9', name: 'A',
    color: '#F5C200',
    label: 'Add 9 (A)',
    labelHe: 'הוסף 9 (A)',
    desc: 'Luxurious depth. The signature neo-soul sound.',
    descHe: 'עומק יוקרתי. הסאונד האופייני של הניאו-סול.',
  },
  {
    id: 'add13',
    str: 2, fret: 5,
    role: '13', name: 'E',
    color: '#FF6B35',
    label: 'Add 13 (E)',
    labelHe: 'הוסף 13 (E)',
    desc: 'Sharp funk groove. The sound of big-band jazz.',
    descHe: 'גרוב פאנק חריף. הסאונד של ג\'אז ביג-בנד.',
  },
]

const ROLE_COLOR: Record<string, string> = {
  '1': '#E83020',
  '3': '#2B50E8',
  '5': '#4A4A6E',
  '7': '#F5C200',
  '9': '#F5C200',
  '11': '#00C896',
  '13': '#FF6B35',
}

export default function ShellVoicingLaboratory({ isHe }: { isHe: boolean }) {
  const [phase, setPhase]         = useState<'full' | 'shell' | 'extended'>('full')
  const [activeExt, setActiveExt] = useState<string | null>(null)

  const showFifth    = phase === 'full'
  const showFreeFinger = phase !== 'full'

  const handleOmit = () => {
    setPhase('shell')
    setActiveExt(null)
  }
  const handleAddExt = (id: string) => {
    setPhase('extended')
    setActiveExt(id)
  }

  const ext = EXTENSIONS.find(e => e.id === activeExt)

  return (
    <div style={{ background: '#F0EDE4', border: '1px solid #D8D0BC' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 20, background: '#00C896', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
          color: '#FAF8F0', textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>
          {isHe ? 'מעבדת Shell Voicings — G7' : 'Shell Voicing Laboratory — G7'}
        </span>
      </div>

      <div style={{ padding: '16px 20px 22px' }}>
        {/* Phase indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
          {[
            { id: 'full',     label: isHe ? 'אקורד מלא' : 'Full Chord' },
            { id: 'shell',    label: isHe ? 'שלד (Shell)' : 'Shell Voicing' },
            { id: 'extended', label: isHe ? 'מורחב' : 'Extended' },
          ].map((p, i) => (
            <div key={p.id} style={{
              flex: 1, padding: '8px 4px',
              background: phase === p.id ? '#1A1A2E' : '#D8D0BC',
              color: phase === p.id ? '#FAF8F0' : '#8A7E68',
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textAlign: 'center',
              borderInlineEnd: i < 2 ? '1px solid #F0EDE4' : 'none',
            }}>
              {p.label}
            </div>
          ))}
        </div>

        {/* Fretboard */}
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <svg width={W} height={H}
            style={{ display: 'block', background: '#FAF8F0', border: '1px solid #D8D0BC' }}>

            {/* Fret lines */}
            {Array.from({ length: DISP_FRETS + 1 }, (_, f) => {
              const x = LEFT + f * FRET_W
              return (
                <line key={f} x1={x} y1={TOP - 10} x2={x} y2={TOP + 5 * STR_GAP + 10}
                  stroke={f === 0 ? '#1A1A2E' : '#C0B898'}
                  strokeWidth={f === 0 ? 3 : 1} />
              )
            })}

            {/* Fret numbers */}
            {Array.from({ length: DISP_FRETS }, (_, f) => (
              <text key={f}
                x={fretXAbs(BASE_FRET + f)} y={H - 4}
                textAnchor="middle" fontSize={8} fill="#8A7E68"
                fontFamily="var(--fm-font-display)">
                {BASE_FRET + f}
              </text>
            ))}

            {/* Strings */}
            {[6, 5, 4, 3, 2, 1].map((s, di) => (
              <g key={s}>
                <line
                  x1={LEFT} y1={strY(s)} x2={W - 12} y2={strY(s)}
                  stroke="#8A7E68" strokeWidth={0.8 + di * 0.18} />
                <text x={LEFT - 8} y={strY(s) + 4}
                  textAnchor="end" fontSize={9} fontWeight={700}
                  fill="#8A7E68" fontFamily="var(--fm-font-display)">
                  {STR_LABELS[s - 1]}
                </text>
              </g>
            ))}

            {/* Full chord notes */}
            {FULL_NOTES.map((n, i) => {
              const isFifth = n.role === '5'
              const hidden  = isFifth && !showFifth
              const cx = fretXAbs(n.fret)
              const cy = strY(n.str)
              const col = hidden ? '#D8D0BC' : ROLE_COLOR[n.role]
              return (
                <g key={i} style={{ transition: 'opacity 0.3s' }}>
                  <circle cx={cx} cy={cy} r={12}
                    fill={col}
                    opacity={hidden ? 0.3 : 1} />
                  {!hidden && (
                    <text x={cx} y={cy + 4}
                      textAnchor="middle" fontSize={9} fontWeight={800}
                      fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                      {n.role}
                    </text>
                  )}
                  {hidden && (
                    <text x={cx} y={cy + 4}
                      textAnchor="middle" fontSize={9}
                      fill="#8A7E68" fontFamily="var(--fm-font-display)">
                      {n.role}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Extension note */}
            {phase === 'extended' && ext && (
              <g>
                <circle cx={fretXAbs(ext.fret)} cy={strY(ext.str)} r={12}
                  fill={ext.color} />
                <text x={fretXAbs(ext.fret)} y={strY(ext.str) + 4}
                  textAnchor="middle" fontSize={9} fontWeight={800}
                  fill="#FAF8F0" fontFamily="var(--fm-font-display)">
                  {ext.role}
                </text>
              </g>
            )}

            {/* "Free finger" indicator */}
            {showFreeFinger && (() => {
              const fifth = FULL_NOTES.find(n => n.role === '5')!
              return (
                <g>
                  <rect x={fretXAbs(fifth.fret) - 16} y={strY(fifth.str) - 16}
                    width={32} height={32} fill="transparent"
                    stroke="#00C896" strokeWidth={2} strokeDasharray="4 2" />
                  <text x={fretXAbs(fifth.fret)} y={strY(fifth.str) + 4}
                    textAnchor="middle" fontSize={7} fontWeight={700}
                    fill="#00C896" fontFamily="var(--fm-font-display)">
                    {isHe ? 'פנוי' : 'FREE'}
                  </text>
                </g>
              )
            })()}
          </svg>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Step 1: Omit 5th */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleOmit}
              disabled={!showFifth && phase === 'shell' && !activeExt}
              style={{
                padding: '10px 18px', border: 'none', cursor: 'pointer',
                background: phase !== 'full' ? '#4A4A6E' : '#E83020',
                color: '#FAF8F0',
                fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: phase !== 'full' ? 0.6 : 1,
              }}>
              {isHe ? 'השמט קווינטה (5)' : 'Omit 5th'}
            </button>
            {phase !== 'full' && (
              <span style={{
                fontFamily: 'var(--fm-font-body)', fontSize: 11, color: '#00C896',
                fontWeight: 700,
              }}>
                {isHe ? 'אצבע התפנתה!' : 'Finger freed!'}
              </span>
            )}
          </div>

          {/* Step 2: Add extension */}
          {showFreeFinger && (
            <div>
              <div style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
                color: '#8A7E68', letterSpacing: '0.12em', marginBottom: 8,
                textTransform: 'uppercase',
              }}>
                {isHe ? 'השתמש באצבע הפנויה להוסיף:' : 'Use the free finger to add:'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {EXTENSIONS.map(e => (
                  <button key={e.id} onClick={() => handleAddExt(e.id)} style={{
                    flex: 1, padding: '10px 8px', border: `2px solid ${e.color}`,
                    cursor: 'pointer',
                    background: activeExt === e.id ? e.color : 'transparent',
                    color: activeExt === e.id ? '#FAF8F0' : e.color,
                    fontFamily: 'var(--fm-font-display)', fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.06em',
                  }}>
                    {isHe ? e.labelHe : e.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extension description */}
          {ext && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(43,80,232,0.07)',
              borderInlineStart: `4px solid ${ext.color}`,
              fontFamily: 'var(--fm-font-body)', fontSize: 12, color: '#2A2820',
              lineHeight: 1.6,
            }}>
              {isHe ? ext.descHe : ext.desc}
            </div>
          )}

          {/* Reset */}
          {phase !== 'full' && (
            <button onClick={() => { setPhase('full'); setActiveExt(null) }} style={{
              alignSelf: 'flex-start',
              padding: '6px 14px', border: '1px solid #1A1A2E', cursor: 'pointer',
              background: 'transparent', color: '#1A1A2E',
              fontFamily: 'var(--fm-font-display)', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {isHe ? 'אפס' : 'Reset'}
            </button>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { color: '#E83020', label: isHe ? 'שורש' : 'Root (1)' },
            { color: '#2B50E8', label: isHe ? 'טרצה' : '3rd' },
            { color: '#4A4A6E', label: isHe ? 'קווינטה — מושמט' : '5th — omitted' },
            { color: '#F5C200', label: isHe ? 'ספטימה' : '7th' },
          ].map(item => (
            <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: item.color, borderRadius: '50%', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--fm-font-display)', fontSize: 10,
                color: '#2A2820', letterSpacing: '0.05em',
              }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
