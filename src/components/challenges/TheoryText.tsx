import { useState, useRef, useEffect, type ReactNode } from 'react'
import { GLOSSARY } from '../../lib/challenges/glossary'

interface Props {
  text: string
  isHe: boolean
  style?: React.CSSProperties
}

// Renders a plain string and wraps any glossary term with a hoverable tooltip.
// Used for explanation + theory blocks — lets the user learn terminology in place.
export default function TheoryText({ text, isHe, style }: Props) {
  const nodes = tokenize(text, isHe)
  return <span style={style}>{nodes}</span>
}

function tokenize(text: string, isHe: boolean): ReactNode[] {
  // Longest-first so "רלטיב מינור" wins over "מינור".
  const terms = [...GLOSSARY]
    .sort((a, b) => (isHe ? b.termHe.length - a.termHe.length : b.termEn.length - a.termEn.length))

  // Iterative greedy replacement.
  const pieces: Array<{ kind: 'text'; value: string } | { kind: 'term'; term: typeof GLOSSARY[number] }> = [
    { kind: 'text', value: text },
  ]

  for (const term of terms) {
    const needle = isHe ? term.termHe : term.termEn
    const needleLower = needle.toLowerCase()
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i]
      if (piece.kind !== 'text') continue
      const hayLower = piece.value.toLowerCase()
      const idx = hayLower.indexOf(needleLower)
      if (idx < 0) continue
      // Split into before / hit / after
      const before = piece.value.slice(0, idx)
      const hit    = piece.value.slice(idx, idx + needle.length)
      const after  = piece.value.slice(idx + needle.length)
      const replacement: typeof pieces = []
      if (before) replacement.push({ kind: 'text', value: before })
      replacement.push({ kind: 'term', term: { ...term, termHe: hit, termEn: hit } })
      if (after) replacement.push({ kind: 'text', value: after })
      pieces.splice(i, 1, ...replacement)
      // Continue scanning from the piece after the hit (before was already term-free).
      i += replacement.length - 1
    }
  }

  return pieces.map((p, i) =>
    p.kind === 'text'
      ? <span key={i}>{p.value}</span>
      : <TermChip key={i} entry={p.term} isHe={isHe} />
  )
}

function TermChip({ entry, isHe }: { entry: typeof GLOSSARY[number]; isHe: boolean }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<'below' | 'above'>('below')
  const anchorRef = useRef<HTMLSpanElement | null>(null)

  // When opened, check if there's room below the anchor; flip up otherwise.
  useEffect(() => {
    if (!open || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    setPosition(spaceBelow < 180 ? 'above' : 'below')
  }, [open])

  // Show on both click (mobile) and hover (desktop).
  return (
    <span
      ref={anchorRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen(o => !o)}
      style={{
        position: 'relative',
        display: 'inline-block',
        color: 'var(--fm-primary)',
        fontWeight: 600,
        cursor: 'help',
        borderBottom: '1px dashed var(--fm-primary)',
        paddingBottom: 1,
      }}
    >
      {isHe ? entry.termHe : entry.termEn}
      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            [position === 'above' ? 'bottom' : 'top']: 'calc(100% + 6px)',
            insetInlineStart: 0,
            zIndex: 200,
            width: 280,
            maxWidth: '85vw',
            padding: 14,
            borderRadius: 12,
            background: 'var(--fm-bg-card)',
            border: '1px solid var(--fm-border)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.55,
            color: 'var(--fm-text-muted)',
            textAlign: isHe ? 'right' : 'left',
            cursor: 'default',
          }}
        >
          <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 4 }}>
            {isHe ? entry.termHe : entry.termEn}
          </span>
          {isHe ? entry.definitionHe : entry.definitionEn}
        </span>
      )}
    </span>
  )
}
