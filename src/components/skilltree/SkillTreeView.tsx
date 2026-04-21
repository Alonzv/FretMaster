import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { Difficulty, SessionResult } from '../../lib/challenges/types'
import type { HeartsState } from '../../lib/gamification/hearts'
import type { StreakState } from '../../lib/gamification/streak'
import { loadXP, addXP, getLevel, getLevelProgress, type XPState } from '../../lib/gamification/xp'
import { getTreeWithStatus, findNextNode, applySessionToNode, type NodeWithStatus } from '../../lib/skilltree/treeEngine'
import ChallengeRunner from '../challenges/ChallengeRunner'
import HeartsDisplay from '../challenges/HeartsDisplay'
import TactileButton from '../ui/TactileButton'

const ZIGZAG = [0, 60, 100, 60, 0, -60, -100, -60]

// SVG progress ring constants
const NODE_SIZE   = 88
const RING_R      = 39
const RING_CX     = NODE_SIZE / 2
const RING_CY     = NODE_SIZE / 2
const RING_CIRC   = 2 * Math.PI * RING_R          // ≈ 244.9
const SEG_LEN     = (RING_CIRC - 6) / 3           // 3 equal arcs, 2px gap each
const SEG_GAP     = 2

interface Props {
  hearts: HeartsState
  streak: StreakState
  onSessionComplete: (result: SessionResult) => void
  onWrongAnswer: () => void
}

export default function SkillTreeView({ hearts, streak, onSessionComplete, onWrongAnswer }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [nodes, setNodes]       = useState<NodeWithStatus[]>(() => getTreeWithStatus())
  const [selected, setSelected] = useState<NodeWithStatus | null>(null)
  const [running, setRunning]   = useState(false)
  const [xp, setXp]             = useState<XPState>(() => loadXP())
  const [winNode, setWinNode]   = useState<{ title: string; xpGained: number; stars: number } | null>(null)
  const nextNodeRef             = useRef<HTMLButtonElement>(null)

  const refreshTree = useCallback(() => setNodes(getTreeWithStatus()), [])

  useEffect(() => {
    setTimeout(() => nextNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
  }, [])

  // ── Session runner ──────────────────────────────────────────────────────
  if (running && selected) {
    return (
      <ChallengeRunner
        categoryId={selected.categoryId}
        difficulty={selected.difficulty}
        hearts={hearts}
        onWrongAnswer={onWrongAnswer}
        onExit={() => { setRunning(false); setSelected(null); refreshTree() }}
        onComplete={result => {
          const prevNodes = getTreeWithStatus()
          const prevNode  = prevNodes.find(n => n.id === selected.id)
          const wasNew    = !prevNode || prevNode.progress.stars === 0

          applySessionToNode(
            selected.id,
            result.stars,
            result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0,
          )

          const starsMultiplier = result.stars === 3 ? 1.5 : result.stars === 2 ? 1.2 : 1
          const xpGained = Math.round(selected.xpReward * starsMultiplier) + (wasNew ? 10 : 0)
          const newXP = addXP(xpGained)
          setXp(newXP)

          onSessionComplete(result)
          refreshTree()
          setRunning(false)
          setSelected(null)

          if (result.stars >= 1) {
            setWinNode({ title: isHe ? selected.titleHe : selected.titleEn, xpGained, stars: result.stars })
          }
        }}
      />
    )
  }

  if (winNode) {
    return <WinOverlay title={winNode.title} xpGained={winNode.xpGained} stars={winNode.stars} isHe={isHe} onClose={() => setWinNode(null)} />
  }

  if (selected) {
    return <NodeSheet node={selected} isHe={isHe} hearts={hearts} onStart={() => setRunning(true)} onClose={() => setSelected(null)} />
  }

  const suggestedNext = findNextNode(nodes)
  const level   = getLevel(xp.total)
  const levelPct = getLevelProgress(xp.total)

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--fm-bg-deep)',
        borderBottom: '1px solid var(--fm-border)',
        padding: '10px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StreakChip count={streak.count} isHe={isHe} />
          <HeartsDisplay hearts={hearts} />
        </div>
        <XPBar xp={xp.total} level={level} progress={levelPct} />
      </div>

      {/* Path */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 0 40px' }}>
        {nodes.map((node, idx) => {
          const offset     = ZIGZAG[idx % ZIGZAG.length]
          const isNext     = node.id === suggestedNext?.id
          const showDivider = !!node.group

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {showDivider && (
                <div style={{
                  marginTop: idx === 0 ? 0 : 40, marginBottom: 20,
                  fontFamily: "'Oswald', 'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  color: 'var(--fm-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  background: 'var(--fm-bg-card)',
                  border: '1px solid var(--fm-border-mid)',
                  borderRadius: 6, padding: '5px 18px',
                  boxShadow: '0 2px 0 0 var(--fm-border)',
                }}>
                  {isHe ? node.group!.he : node.group!.en}
                </div>
              )}

              {idx > 0 && !showDivider && <Connector />}
              {idx > 0 && showDivider  && <div style={{ width: 2, height: 16, borderLeft: '2px dashed var(--fm-border-mid)' }} />}

              <div style={{ transform: `translateX(${offset}px)` }}>
                <TreeNodeButton
                  node={node}
                  isNext={isNext}
                  isHe={isHe}
                  ref={isNext ? nextNodeRef : undefined}
                  onClick={() => node.status !== 'locked' && setSelected(node)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Connector line between nodes ─────────────────────────────────────────────

function Connector() {
  return (
    <svg width="24" height="36" viewBox="0 0 24 36" style={{ overflow: 'visible' }}>
      <line x1="12" y1="0" x2="12" y2="36"
        stroke="var(--fm-border-mid)" strokeWidth="2.5"
        strokeDasharray="4 4" strokeLinecap="round"
      />
    </svg>
  )
}

// ── Tree node button ──────────────────────────────────────────────────────────

const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

const TreeNodeButton = React.forwardRef<HTMLButtonElement, {
  node: NodeWithStatus
  isNext: boolean
  isHe: boolean
  onClick: () => void
}>(({ node, isNext, isHe, onClick }, ref) => {
  const locked   = node.status === 'locked'
  const complete = node.status === 'complete'
  const mastered = node.status === 'mastered'
  const available = node.status === 'available'
  const stars    = node.progress.stars  // 0–3

  // ── Color theme per state ────────────────────────────────────────────────
  const theme = mastered
    ? { bg: 'linear-gradient(145deg,#fdd835,#f5b730)', icon: '#fff', shadow: '#a07010', ring: '#f5b730', trackOpacity: 0.25 }
    : complete
    ? { bg: 'linear-gradient(145deg,var(--fm-secondary),color-mix(in srgb,var(--fm-secondary) 80%,#000))', icon: '#fff', shadow: 'var(--fm-secondary-shadow)', ring: '#f5b730', trackOpacity: 0.2 }
    : available
    ? { bg: 'linear-gradient(145deg,var(--fm-primary),color-mix(in srgb,var(--fm-primary) 80%,#000))', icon: '#fff', shadow: 'var(--fm-primary-shadow)', ring: 'var(--fm-primary)', trackOpacity: 0.18 }
    : { bg: 'var(--fm-bg-card)', icon: 'var(--fm-border)', shadow: 'var(--fm-border)', ring: 'var(--fm-border)', trackOpacity: 0.4 }

  // ── Progress ring arcs (3 segments) ─────────────────────────────────────
  // Each segment = SEG_LEN stroke, spaced SEG_GAP apart, rotated so gap starts at top
  const segments = [0, 1, 2].map(i => {
    const filled  = stars > i
    const offset  = i * (SEG_LEN + SEG_GAP)
    // Full dasharray = one segment on, rest off
    const dash    = `${SEG_LEN} ${RING_CIRC - SEG_LEN}`
    const dashOff = RING_CIRC - offset
    return { filled, dash, dashOff }
  })

  const buttonSize  = NODE_SIZE - 18  // 70px inner circle
  const innerInset  = 9               // (NODE_SIZE - buttonSize) / 2

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
      position: 'relative',
    }}>
      {/* Outer progress ring + button wrapper */}
      <div style={{ position: 'relative', width: NODE_SIZE, height: NODE_SIZE }}>

        {/* SVG progress ring */}
        <svg
          width={NODE_SIZE} height={NODE_SIZE}
          viewBox={`0 0 ${NODE_SIZE} ${NODE_SIZE}`}
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          {/* Track (3 dim segments) */}
          {[0, 1, 2].map(i => (
            <circle key={`t${i}`}
              cx={RING_CX} cy={RING_CY} r={RING_R}
              fill="none"
              stroke={theme.ring}
              strokeOpacity={theme.trackOpacity}
              strokeWidth={3}
              strokeDasharray={`${SEG_LEN} ${RING_CIRC - SEG_LEN}`}
              strokeDashoffset={RING_CIRC - i * (SEG_LEN + SEG_GAP)}
              strokeLinecap="round"
            />
          ))}
          {/* Filled segments */}
          {segments.map((seg, i) => seg.filled && (
            <circle key={`f${i}`}
              cx={RING_CX} cy={RING_CY} r={RING_R}
              fill="none"
              stroke={theme.ring}
              strokeWidth={3.5}
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.dashOff}
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Inner circle button */}
        <button
          ref={ref}
          onClick={onClick}
          disabled={locked}
          title={isHe ? node.titleHe : node.titleEn}
          style={{
            position: 'absolute',
            top: innerInset, left: innerInset,
            width: buttonSize, height: buttonSize,
            borderRadius: '50%',
            background: theme.bg,
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: locked ? 'not-allowed' : 'pointer',
            opacity: locked ? 0.5 : 1,
            boxShadow: locked
              ? `0 3px 0 0 ${theme.shadow}`
              : `0 5px 0 0 ${theme.shadow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
            transition: 'transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s',
            animation: (isNext && available) ? 'fm-pulse 2.4s ease-in-out infinite' : undefined,
          }}
          onMouseEnter={e => { if (!locked) { e.currentTarget.style.transform = 'translateY(-3px) scale(1.07)' } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
          onMouseDown={e => {
            if (!locked) {
              e.currentTarget.style.transform = 'translateY(5px) scale(0.96)'
              e.currentTarget.style.boxShadow = `0 0 0 0 transparent, inset 0 1px 0 rgba(255,255,255,0.1)`
            }
          }}
          onMouseUp={e => { if (!locked) e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
        >
          {locked ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.icon}>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill={theme.icon}>
              <path d={node.icon} />
            </svg>
          )}
        </button>

        {/* Completion badge */}
        {(complete || mastered) && (
          <div style={{
            position: 'absolute', bottom: innerInset - 4, right: innerInset - 4,
            width: 22, height: 22, borderRadius: '50%',
            background: mastered ? 'linear-gradient(135deg,#fdd835,#f5b730)' : 'var(--fm-primary)',
            border: '2.5px solid var(--fm-bg-deep)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d={mastered ? STAR_PATH : 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'} />
            </svg>
          </div>
        )}

        {/* "Next" indicator chevron */}
        {isNext && available && (
          <div style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--fm-primary)', color: 'white',
            borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700,
            fontFamily: "'Oswald','DM Sans',sans-serif", letterSpacing: '0.08em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 0 0 var(--fm-primary-shadow)',
            whiteSpace: 'nowrap',
          }}>
            {isHe ? 'הבא' : 'NEXT'}
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 13, fontWeight: 700, lineHeight: 1.3,
        color: locked ? 'var(--fm-text-muted)' : 'var(--fm-text)',
        maxWidth: 108, textAlign: 'center',
        opacity: locked ? 0.6 : 1,
      }}>
        {isHe ? node.titleHe : node.titleEn}
      </div>
    </div>
  )
})
TreeNodeButton.displayName = 'TreeNodeButton'

// ── XP bar ────────────────────────────────────────────────────────────────────

function XPBar({ xp, level, progress }: {
  xp: number
  level: ReturnType<typeof getLevel>
  progress: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        fontFamily: "'Oswald', 'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 600, color: 'var(--fm-primary)',
        background: 'var(--fm-primary-bg)', border: '1px solid var(--fm-primary)',
        borderRadius: 5, padding: '3px 8px', flexShrink: 0,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        boxShadow: '0 2px 0 0 var(--fm-primary-shadow)',
      }}>
        LV{level.level}
      </div>
      <div style={{
        flex: 1, height: 7, borderRadius: 999,
        background: 'var(--fm-bg-input)', overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.28)',
      }}>
        <div style={{
          height: '100%', borderRadius: 999,
          background: 'var(--fm-primary)',
          width: `${progress * 100}%`,
          boxShadow: '0 1px 4px var(--fm-primary-glow)',
          transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fm-xp)', flexShrink: 0 }}>
        {xp} XP
      </div>
    </div>
  )
}

// ── Win overlay ───────────────────────────────────────────────────────────────

function WinOverlay({ title, xpGained, stars, isHe, onClose }: {
  title: string; xpGained: number; stars: number; isHe: boolean; onClose: () => void
}) {
  useEffect(() => {
    const id = setTimeout(onClose, 3200)
    return () => clearTimeout(id)
  }, [onClose])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', flexDirection: 'column',
      animation: 'fm-fade-in 0.2s ease', cursor: 'pointer',
    }}>
      <BurstParticles />
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--fm-bg-deep)', border: '2px solid var(--fm-primary)',
        borderRadius: 24, padding: '36px 40px', textAlign: 'center', minWidth: 260,
        animation: 'fm-celebrate 0.4s cubic-bezier(0.22,1,0.36,1)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fm-text)', marginBottom: 4 }}>
          {isHe ? 'כל הכבוד!' : 'Well done!'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--fm-text-muted)', marginBottom: 20 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <svg key={s} width="32" height="32" viewBox="0 0 24 24"
              fill={stars >= s ? '#f5b730' : 'var(--fm-border)'}
              style={{ animation: stars >= s ? `fm-star-pop 0.4s ${s * 0.12}s both ease` : undefined }}>
              <path d={STAR_PATH} />
            </svg>
          ))}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--fm-primary-bg)', border: '1px solid var(--fm-primary)',
          borderRadius: 20, padding: '6px 16px',
          fontSize: 15, fontWeight: 800, color: 'var(--fm-primary)',
        }}>
          +{xpGained} XP
        </div>
        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--fm-text-muted)' }}>
          {isHe ? 'לחץ להמשיך' : 'Tap to continue'}
        </div>
      </div>
    </div>
  )
}

function BurstParticles() {
  const colors = ['#f5b730', '#8FAD79', '#e05260', '#1cb0f6', '#a259ff', '#ff9600']
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * 360
    const color = colors[i % colors.length]
    const dist  = 80 + Math.random() * 80
    const size  = 6 + Math.random() * 8
    return { angle, color, dist, size, delay: Math.random() * 0.2 }
  })
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: p.size, height: p.size, borderRadius: '50%',
            backgroundColor: p.color,
            animation: `fm-burst 0.7s ${p.delay}s both ease-out`,
            ['--tx' as string]: `${Math.cos(rad) * p.dist}px`,
            ['--ty' as string]: `${Math.sin(rad) * p.dist}px`,
          } as React.CSSProperties} />
        )
      })}
    </div>
  )
}

// ── Streak chip ───────────────────────────────────────────────────────────────

function StreakChip({ count, isHe }: { count: number; isHe: boolean }) {
  const active = count > 0
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 8,
      background: active ? 'var(--fm-streak-bg)' : 'var(--fm-bg-card)',
      border: `1px solid ${active ? 'var(--fm-streak)' : 'var(--fm-border)'}`,
      boxShadow: active ? '0 2px 0 0 color-mix(in srgb, var(--fm-streak) 60%, black)' : '0 2px 0 0 var(--fm-border)',
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'var(--fm-streak)' : 'var(--fm-text-muted)'}>
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
      </svg>
      <span style={{
        fontFamily: "'Oswald', 'DM Sans', sans-serif",
        fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
        color: active ? 'var(--fm-streak)' : 'var(--fm-text-muted)',
      }}>
        {count} {isHe ? 'ימים' : count === 1 ? 'day' : 'days'}
      </span>
    </div>
  )
}

// ── Node detail modal (centered) ──────────────────────────────────────────────

function NodeSheet({ node, isHe, hearts, onStart, onClose }: {
  node: NodeWithStatus
  isHe: boolean
  hearts?: HeartsState
  onStart: () => void
  onClose: () => void
}) {
  const locked   = node.status === 'locked'
  const done     = node.status === 'complete' || node.status === 'mastered'
  const noHearts = hearts && hearts.current === 0

  const diffLabel = (d: Difficulty) => {
    if (d === 'easy')   return isHe ? 'קל' : 'Easy'
    if (d === 'medium') return isHe ? 'בינוני' : 'Medium'
    return isHe ? 'קשה' : 'Hard'
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 460,
          background: 'var(--fm-bg-deep)',
          border: '1px solid var(--fm-border)',
          borderRadius: 24,
          padding: '32px 28px',
          direction: isHe ? 'rtl' : 'ltr',
          animation: 'fm-celebrate 0.32s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, flexShrink: 0,
            background: locked ? 'var(--fm-bg-card)' : 'var(--fm-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: locked ? 'none' : '0 4px 0 0 var(--fm-primary-shadow)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={locked ? 'var(--fm-text-muted)' : 'white'}>
              {locked
                ? <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                : <path d={node.icon} />}
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fm-text)', lineHeight: 1.2 }}>
              {isHe ? node.titleHe : node.titleEn}
            </div>
            <div style={{
              fontSize: 11, marginTop: 6,
              fontFamily: "'Oswald', 'DM Sans', sans-serif",
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--fm-text-muted)',
            }}>
              {diffLabel(node.difficulty)} · {node.xpReward} XP
            </div>
          </div>
        </div>

        {/* Stars if done */}
        {done && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
            justifyContent: isHe ? 'flex-end' : 'flex-start',
          }}>
            {[1, 2, 3].map(s => (
              <svg key={s} width="22" height="22" viewBox="0 0 24 24"
                fill={node.progress.stars >= s ? '#f5b730' : 'var(--fm-border)'}>
                <path d={STAR_PATH} />
              </svg>
            ))}
            <span style={{ fontSize: 12, color: 'var(--fm-text-muted)', alignSelf: 'center' }}>
              {node.progress.bestAccuracy}%
            </span>
          </div>
        )}

        {/* Description */}
        <p style={{ fontSize: 14, color: 'var(--fm-text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
          {isHe ? node.descHe : node.descEn}
        </p>

        {/* CTA */}
        {locked ? (
          <div style={{
            padding: '13px 16px', borderRadius: 12,
            background: 'var(--fm-bg-input)', border: '1px solid var(--fm-border)',
            fontSize: 13, color: 'var(--fm-text-muted)', textAlign: 'center',
            borderBottom: '3px solid var(--fm-border)',
          }}>
            {isHe ? '🔒 השלם את הצמתים הקודמים כדי לפתוח' : '🔒 Complete previous nodes to unlock'}
          </div>
        ) : noHearts ? (
          <div style={{
            padding: '13px 16px', borderRadius: 12,
            background: 'var(--fm-bg-input)', border: '1px solid var(--fm-coral)',
            fontSize: 13, color: 'var(--fm-text-muted)', textAlign: 'center',
            borderBottom: '3px solid var(--fm-coral-shadow)',
          }}>
            {isHe ? '❤️ אזלו הלבבות — המתן לטעינה מחדש כדי להמשיך' : '❤️ No hearts left — wait for a refill to continue'}
          </div>
        ) : (
          <TactileButton variant={done ? 'success' : 'primary'} fullWidth onClick={onStart}>
            {done ? (isHe ? '▶ שחק שוב' : '▶ Play again') : (isHe ? 'התחל' : 'Start')}
          </TactileButton>
        )}
      </div>
    </div>
  )
}
