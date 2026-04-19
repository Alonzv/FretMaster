// Renders a single note on a 5-line staff in treble clef — used for note-reading challenges.
// Always drawn left-to-right regardless of UI language.

interface Props {
  // Position on the staff: 0 = middle C (below staff), 1 = D, 2 = E (bottom line), etc.
  // Treble clef: bottom line E=2, top line F=10. Middle C = 0.
  staffStep: number
  // Accidental to draw before the note head: '', '#', 'b'.
  accidental?: '' | '#' | 'b'
}

// SVG coordinate helpers
const WIDTH  = 260
const HEIGHT = 140
const STAFF_TOP    = 50
const STAFF_BOTTOM = 100
const LINE_SPACING = (STAFF_BOTTOM - STAFF_TOP) / 4 // 4 gaps between 5 lines
const NOTE_X       = 170

// Y position for a given staff step (0 = middle C, grows upward).
function yForStep(step: number): number {
  // Middle C is one ledger line below bottom staff line.
  // Step 0 (middle C) sits on ledger line below bottom.
  // Each step is LINE_SPACING / 2 vertical distance.
  return STAFF_BOTTOM + LINE_SPACING / 2 - (step * LINE_SPACING / 2)
}

export default function StaffVisual({ staffStep, accidental = '' }: Props) {
  const noteY = yForStep(staffStep)

  // Ledger lines above or below the staff
  const ledgerLines: number[] = []
  if (staffStep <= 0) {
    // Below staff: middle C (step 0) needs 1 ledger line below
    for (let s = 0; s >= staffStep - 1; s -= 2) {
      const y = yForStep(s)
      if (y > STAFF_BOTTOM) ledgerLines.push(y)
    }
  } else if (staffStep >= 10) {
    // Above staff: step 10 is top line F
    for (let s = 12; s <= staffStep + 1; s += 2) {
      const y = yForStep(s)
      if (y < STAFF_TOP) ledgerLines.push(y)
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: '100%', maxWidth: 340, height: 'auto', display: 'block' }}
      role="img"
      aria-label="Musical note on treble clef staff"
    >
      {/* Staff lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={`line-${i}`}
          x1={30}
          y1={STAFF_TOP + i * LINE_SPACING}
          x2={WIDTH - 20}
          y2={STAFF_TOP + i * LINE_SPACING}
          stroke="var(--fm-text-muted)"
          strokeWidth={1}
        />
      ))}

      {/* Treble clef symbol — simplified spiral */}
      <text
        x={38}
        y={STAFF_BOTTOM + 5}
        fontSize={60}
        fontFamily="serif"
        fontWeight={500}
        fill="var(--fm-text)"
        style={{ userSelect: 'none' }}
      >
        𝄞
      </text>

      {/* Ledger lines */}
      {ledgerLines.map((y, i) => (
        <line
          key={`ledger-${i}`}
          x1={NOTE_X - 12}
          y1={y}
          x2={NOTE_X + 12}
          y2={y}
          stroke="var(--fm-text-muted)"
          strokeWidth={1}
        />
      ))}

      {/* Accidental */}
      {accidental && (
        <text
          x={NOTE_X - 20}
          y={noteY + 5}
          textAnchor="end"
          fontSize={24}
          fontFamily="serif"
          fontWeight={600}
          fill="var(--fm-text)"
        >
          {accidental === '#' ? '♯' : '♭'}
        </text>
      )}

      {/* Note head (filled oval, slightly tilted) */}
      <ellipse
        cx={NOTE_X}
        cy={noteY}
        rx={8}
        ry={6}
        fill="var(--fm-primary)"
        transform={`rotate(-20 ${NOTE_X} ${noteY})`}
      />

      {/* Stem — points up if note is below middle line, down if above */}
      {(() => {
        const stemUp = staffStep < 6
        const stemX  = stemUp ? NOTE_X + 7 : NOTE_X - 7
        const stemY1 = noteY
        const stemY2 = stemUp ? noteY - 34 : noteY + 34
        return (
          <line
            x1={stemX}
            y1={stemY1}
            x2={stemX}
            y2={stemY2}
            stroke="var(--fm-primary)"
            strokeWidth={2}
          />
        )
      })()}
    </svg>
  )
}
