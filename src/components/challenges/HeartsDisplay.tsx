import { useEffect, useState } from 'react'
import { MAX_HEARTS, msUntilNextHeart, type HeartsState } from '../../lib/gamification/hearts'

// SVG heart — filled or empty
function Heart({ filled, shaking }: { filled: boolean; shaking: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'var(--fm-coral, #e05260)' : 'none'}
      stroke={filled ? 'var(--fm-coral, #e05260)' : 'var(--fm-border)'}
      strokeWidth={2}
      style={{
        flexShrink: 0,
        transition: 'fill 0.25s, stroke 0.25s',
        animation: shaking ? 'fm-shake 0.4s ease' : undefined,
      }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

interface Props {
  hearts: HeartsState
  lastLost?: boolean   // true for one render cycle after losing a heart → triggers shake
}

export default function HeartsDisplay({ hearts, lastLost = false }: Props) {
  const [countdown, setCountdown] = useState('')
  const isFull = hearts.current >= MAX_HEARTS

  // Countdown timer for next refill
  useEffect(() => {
    if (isFull) { setCountdown(''); return }
    const update = () => {
      const ms = msUntilNextHeart(hearts)
      if (ms <= 0) { setCountdown(''); return }
      const m = Math.floor(ms / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setCountdown(`${m}:${s.toString().padStart(2, '0')}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [hearts, isFull])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <Heart
          key={i}
          filled={i < hearts.current}
          shaking={lastLost && i === hearts.current}
        />
      ))}
      {!isFull && countdown && (
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: 'var(--fm-text-muted)',
          marginLeft: 4,
        }}>
          {countdown}
        </span>
      )}
    </div>
  )
}
