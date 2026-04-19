import { useEffect, useRef, useState } from 'react'
import TheoryText from './TheoryText'

interface Props {
  titleHe: string
  titleEn: string
  bodyHe: string
  bodyEn: string
  isHe: boolean
}

// Subtle "?" button that opens a popover with the theoretical background.
// Auto-flips to "above" when there isn't enough room below, and falls back to a
// centered modal on very small screens so the text is never clipped.
export default function TheoryButton({ titleHe, titleEn, bodyHe, bodyEn, isHe }: Props) {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'below' | 'above' | 'modal'>('below')
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    if (window.innerWidth < 520) {
      setPlacement('modal')
    } else if (spaceBelow >= 220) {
      setPlacement('below')
    } else if (spaceAbove >= 220) {
      setPlacement('above')
    } else {
      setPlacement('modal')
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div ref={anchorRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={isHe ? 'הסבר תאורטי' : 'Theory explanation'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 999,
          background: open ? 'var(--fm-primary-bg)' : 'transparent',
          color: open ? 'var(--fm-primary)' : 'var(--fm-text-muted)',
          border: `1px solid ${open ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
        {isHe ? 'מה זה?' : 'Why?'}
      </button>

      {open && placement !== 'modal' && (
        <>
          <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            role="dialog"
            style={{
              position: 'absolute',
              [placement === 'above' ? 'bottom' : 'top']: 'calc(100% + 8px)',
              [isHe ? 'right' : 'left']: 0,
              zIndex: 50,
              width: 'min(360px, 85vw)',
              padding: 18,
              borderRadius: 14,
              background: 'var(--fm-bg-card)',
              border: '1px solid var(--fm-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
              textAlign: isHe ? 'right' : 'left',
            }}
          >
            <PopBody titleHe={titleHe} titleEn={titleEn} bodyHe={bodyHe} bodyEn={bodyEn} isHe={isHe} />
          </div>
        </>
      )}

      {open && placement === 'modal' && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(440px, 100%)',
              padding: 22,
              borderRadius: 16,
              background: 'var(--fm-bg-deep)',
              border: '1px solid var(--fm-border)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
              textAlign: isHe ? 'right' : 'left',
            }}
          >
            <PopBody titleHe={titleHe} titleEn={titleEn} bodyHe={bodyHe} bodyEn={bodyEn} isHe={isHe} />
            <button
              onClick={close}
              style={{
                marginTop: 16, width: '100%',
                padding: '10px 16px', borderRadius: 10,
                background: 'var(--fm-primary)', color: 'white',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {isHe ? 'סגור' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PopBody({ titleHe, titleEn, bodyHe, bodyEn, isHe }: Omit<Props, never>) {
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {isHe ? 'תאוריה' : 'Theory'}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
        {isHe ? titleHe : titleEn}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--fm-text-muted)' }}>
        <TheoryText text={isHe ? bodyHe : bodyEn} isHe={isHe} />
      </div>
    </>
  )
}
