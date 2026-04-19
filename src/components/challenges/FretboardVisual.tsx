// Guitar neck SVG — always rendered left-to-right regardless of UI language.
// String 1 (high e, thin) on top, string 6 (low E, thick) on bottom — the standard
// chord-diagram orientation viewed as if you're holding the guitar in front of you.

interface Props {
  string: 1 | 2 | 3 | 4 | 5 | 6
  fret: number
  frets?: number
  isHe?: boolean
}

const STRING_THICKNESS = [1.2, 1.6, 2.0, 2.6, 3.2, 3.8] // string 1 (top) → string 6 (bottom)

// Lowercase "e" for high E, uppercase "E" for low E so students can tell them apart.
const STRING_LABELS_SHORT = ['', 'e', 'B', 'G', 'D', 'A', 'E']
const STRING_LABELS_LONG_HE = ['', 'מי (גבוה)', 'סי', 'סול', 'רה', 'לה', 'מי (בס)']
const STRING_LABELS_LONG_EN = ['', 'high e',     'B',   'G',   'D',  'A',  'low E']

export default function FretboardVisual({ string, fret, frets = 5, isHe = false }: Props) {
  const width  = 360
  const height = 180
  const leftPad   = 48
  const rightPad  = 16
  const topPad    = 16
  const bottomPad = 30

  // Frame the highlighted fret with breathing room on both sides.
  const minFret = Math.max(0, fret <= 2 ? 0 : fret - 2)
  const maxFret = minFret + frets
  const displayedFrets = maxFret - minFret
  const fretWidth = (width - leftPad - rightPad) / displayedFrets
  const stringGap = (height - topPad - bottomPad) / 5

  const yForString = (s: number) => topPad + (s - 1) * stringGap
  // X for the CENTER of a fret cell (where fingers actually go).
  const xForFret   = (f: number) => leftPad + (f - minFret - 0.5) * fretWidth
  // X for the fret-line itself (the wire).
  const xForFretLine = (f: number) => leftPad + (f - minFret) * fretWidth

  const highlightX = fret === 0 ? leftPad - 20 : xForFret(fret)
  const highlightY = yForString(string)

  const inlaySingle = [3, 5, 7, 9]
  const inlayDouble = 12

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block' }}
      role="img"
      aria-label={`Fretboard: string ${string}, fret ${fret}`}
    >
      {/* Background neck surface */}
      <rect
        x={leftPad}
        y={topPad - 4}
        width={width - leftPad - rightPad}
        height={height - topPad - bottomPad + 8}
        rx={4}
        fill="var(--fm-bg-input)"
        opacity={0.35}
      />

      {/* Nut (thick bar on the left when fret 0 is visible) */}
      {minFret === 0 && (
        <rect
          x={leftPad - 4}
          y={topPad - 4}
          width={6}
          height={height - topPad - bottomPad + 8}
          rx={2}
          fill="var(--fm-text)"
          opacity={0.85}
        />
      )}

      {/* Fret lines */}
      {Array.from({ length: displayedFrets + 1 }, (_, i) => {
        const f = minFret + i
        return (
          <line
            key={`fret-${i}`}
            x1={xForFretLine(f)}
            y1={topPad - 4}
            x2={xForFretLine(f)}
            y2={height - bottomPad + 4}
            stroke="var(--fm-border)"
            strokeWidth={f === 0 ? 0 : 1.5}
          />
        )
      })}

      {/* Inlay dots */}
      {Array.from({ length: displayedFrets }, (_, i) => {
        const f = minFret + i + 1
        if (!inlaySingle.includes(f) && f !== inlayDouble) return null
        const cx = xForFret(f)
        if (f === inlayDouble) {
          return (
            <g key={`inlay-${f}`} fill="var(--fm-border)" opacity={0.7}>
              <circle cx={cx} cy={topPad + stringGap * 1.5} r={3.5} />
              <circle cx={cx} cy={topPad + stringGap * 3.5} r={3.5} />
            </g>
          )
        }
        return (
          <circle
            key={`inlay-${f}`}
            cx={cx}
            cy={(topPad + height - bottomPad) / 2}
            r={3.5}
            fill="var(--fm-border)"
            opacity={0.7}
          />
        )
      })}

      {/* String labels on the LEFT, always (regardless of UI direction) */}
      {[1, 2, 3, 4, 5, 6].map(s => (
        <g key={`label-${s}`}>
          <text
            x={leftPad - 12}
            y={yForString(s) + 4}
            textAnchor="end"
            fontSize={13}
            fontWeight={700}
            fill={s === string ? 'var(--fm-primary)' : 'var(--fm-text-muted)'}
          >
            {STRING_LABELS_SHORT[s]}
          </text>
        </g>
      ))}

      {/* Strings */}
      {[1, 2, 3, 4, 5, 6].map(s => (
        <line
          key={`str-${s}`}
          x1={leftPad}
          y1={yForString(s)}
          x2={width - rightPad}
          y2={yForString(s)}
          stroke="var(--fm-text-muted)"
          strokeWidth={STRING_THICKNESS[s - 1]}
          strokeLinecap="round"
        />
      ))}

      {/* Fret numbers under the neck */}
      {Array.from({ length: displayedFrets }, (_, i) => {
        const f = minFret + i + 1
        return (
          <text
            key={`num-${f}`}
            x={xForFret(f)}
            y={height - 10}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="var(--fm-text-muted)"
          >
            {f}
          </text>
        )
      })}

      {/* Highlight marker */}
      <circle cx={highlightX} cy={highlightY} r={14} fill="none" stroke="var(--fm-primary)" strokeOpacity={0.25} strokeWidth={8} />
      <circle cx={highlightX} cy={highlightY} r={13} fill="var(--fm-primary)" />
      <text
        x={highlightX}
        y={highlightY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight={800}
        fill="white"
      >
        ?
      </text>

      {/* Caption under marker showing which string the highlight is on */}
      <text
        x={leftPad - 12}
        y={yForString(string) + 4}
        textAnchor="end"
        fontSize={13}
        fontWeight={700}
        fill="var(--fm-primary)"
      >
        {STRING_LABELS_SHORT[string]}
      </text>

      {/* Short legend at bottom-right */}
      <text
        x={width - rightPad}
        y={height - 10}
        textAnchor="end"
        fontSize={9}
        fill="var(--fm-text-dim)"
      >
        {isHe ? STRING_LABELS_LONG_HE[string] : STRING_LABELS_LONG_EN[string]}
      </text>
    </svg>
  )
}
