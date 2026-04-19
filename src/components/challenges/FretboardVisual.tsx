// Small fretboard SVG used by fretboard-recognition questions.
// Renders 6 strings × (minFret..maxFret) and highlights a single string/fret position.

interface Props {
  string: 1 | 2 | 3 | 4 | 5 | 6
  fret: number
  // Show this many frets total; centered on the target fret where possible.
  frets?: number
  isRTL?: boolean
}

const STRING_THICKNESS = [5, 4.5, 4, 3, 2.5, 2] // string 6 (low E, thickest) → string 1

export default function FretboardVisual({ string, fret, frets = 6, isRTL = false }: Props) {
  const width = 320
  const height = 140
  const padX = 24
  const padY = 18

  // Pick a fret window so the highlighted fret is visible.
  const minFret = Math.max(0, Math.min(12 - frets + 1, fret - 1))
  const fretCount = frets
  const fretWidth = (width - padX * 2) / fretCount

  const stringGap = (height - padY * 2) / 5 // 5 gaps between 6 strings

  // Helper: SVG x position for a given fret number (center of that fret cell).
  const xForFret = (f: number) => padX + (f - minFret - 0.5) * fretWidth

  // Strings are drawn with string 6 at the top for RTL guitarists' mental model isn't standard;
  // we use the conventional diagram where string 1 (high E) is on top.
  const yForString = (s: number) => padY + (s - 1) * stringGap

  const highlightX = xForFret(fret === 0 ? minFret : fret)
  const highlightY = yForString(string)

  // Inlay dots at frets 3, 5, 7, 9 (single) and 12 (double).
  const inlays = [3, 5, 7, 9, 12]
  const doubleInlay = 12

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', maxWidth: 420, height: 'auto', transform: isRTL ? 'scaleX(-1)' : 'none' }}
      role="img"
      aria-label={`Fretboard highlight: string ${string}, fret ${fret}`}
    >
      {/* Nut (left edge when fret 0 visible) */}
      {minFret === 0 && (
        <rect x={padX - 3} y={padY - 4} width={6} height={height - padY * 2 + 8} rx={2} fill="var(--fm-text)" opacity={0.85} />
      )}

      {/* Fret lines */}
      {Array.from({ length: fretCount + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={padX + i * fretWidth}
          y1={padY - 4}
          x2={padX + i * fretWidth}
          y2={height - padY + 4}
          stroke="var(--fm-border)"
          strokeWidth={1.5}
        />
      ))}

      {/* Inlay dots */}
      {Array.from({ length: fretCount }, (_, i) => {
        const f = minFret + i + 1
        if (!inlays.includes(f)) return null
        const cx = padX + (i + 0.5) * fretWidth
        if (f === doubleInlay) {
          return (
            <g key={`inlay-${f}`} fill="var(--fm-border)" opacity={0.55}>
              <circle cx={cx} cy={padY + stringGap * 1.5} r={3.5} />
              <circle cx={cx} cy={padY + stringGap * 3.5} r={3.5} />
            </g>
          )
        }
        return <circle key={`inlay-${f}`} cx={cx} cy={height / 2} r={3.5} fill="var(--fm-border)" opacity={0.55} />
      })}

      {/* Strings */}
      {[1, 2, 3, 4, 5, 6].map(s => (
        <line
          key={`str-${s}`}
          x1={padX}
          y1={yForString(s)}
          x2={width - padX}
          y2={yForString(s)}
          stroke="var(--fm-text-muted)"
          strokeWidth={STRING_THICKNESS[s - 1]}
          strokeLinecap="round"
        />
      ))}

      {/* Fret numbers */}
      {Array.from({ length: fretCount }, (_, i) => {
        const f = minFret + i + 1
        return (
          <text
            key={`num-${f}`}
            x={padX + (i + 0.5) * fretWidth}
            y={height - 2}
            textAnchor="middle"
            fontSize={9}
            fill="var(--fm-text-muted)"
            style={{ transform: isRTL ? 'scaleX(-1)' : 'none', transformOrigin: `${padX + (i + 0.5) * fretWidth}px ${height - 2}px` }}
          >
            {f}
          </text>
        )
      })}

      {/* Highlight marker */}
      <circle cx={highlightX} cy={highlightY} r={12} fill="var(--fm-primary)" />
      <circle cx={highlightX} cy={highlightY} r={12} fill="none" stroke="var(--fm-primary)" strokeOpacity={0.25} strokeWidth={6} />
      <text
        x={highlightX}
        y={highlightY + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="white"
        style={{ transform: isRTL ? 'scaleX(-1)' : 'none', transformOrigin: `${highlightX}px ${highlightY + 4}px` }}
      >
        ?
      </text>
    </svg>
  )
}
