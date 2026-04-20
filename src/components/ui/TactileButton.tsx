import type { CSSProperties, ReactNode } from 'react'

// ── TactileButton ─────────────────────────────────────────────────────────────
// Primary button with a hard bottom shadow that physically "sinks" on press.
// variant:
//   primary — burnt terracotta (default)
//   success — sage green (correct answer, session complete)
//   ghost   — borderless, muted text
//   outline — bordered, transparent bg

interface Props {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'success' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
  style?: CSSProperties
  type?: 'button' | 'submit'
  ariaLabel?: string
}

export default function TactileButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  style,
  type = 'button',
  ariaLabel,
}: Props) {
  const cls = variant === 'success' ? 'fm-btn-success'
            : variant === 'ghost'   ? 'fm-btn-ghost'
            : variant === 'outline' ? 'fm-btn-outline'
            : 'fm-btn-primary'

  const pad = size === 'sm' ? '10px 18px'
            : size === 'lg' ? '18px 32px'
            : '15px 24px'

  const fs  = size === 'sm' ? 13
            : size === 'lg' ? 17
            : 15

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${cls} ${className}`}
      style={{
        width: fullWidth ? '100%' : undefined,
        padding: pad,
        fontSize: fs,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
