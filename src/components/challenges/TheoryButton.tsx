import { useState } from 'react'

interface Props {
  titleHe: string
  titleEn: string
  bodyHe: string
  bodyEn: string
  isHe: boolean
}

// Subtle "?" button that opens a popover with the theoretical background of the challenge.
// Anchored inline — the popover appears below the button, full-width on mobile.
export default function TheoryButton({ titleHe, titleEn, bodyHe, bodyEn, isHe }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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

      {open && (
        <>
          {/* Click-outside catcher */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          />
          <div
            role="dialog"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              [isHe ? 'right' : 'left']: 0,
              zIndex: 50,
              width: 'min(360px, 85vw)',
              padding: 18,
              borderRadius: 14,
              background: 'var(--fm-bg-card)',
              border: '1px solid var(--fm-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
              textAlign: isHe ? 'right' : 'left',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              {isHe ? 'תאוריה' : 'Theory'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
              {isHe ? titleHe : titleEn}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fm-text-muted)' }}>
              {isHe ? bodyHe : bodyEn}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
