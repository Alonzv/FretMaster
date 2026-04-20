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

// Zigzag offsets for the linear path (px, applied to each node container)
const ZIGZAG = [0, 60, 100, 60, 0, -60, -100, -60]

interface Props {
  hearts: HeartsState
  streak: StreakState
  onSessionComplete: (result: SessionResult) => void
  onWrongAnswer: () => void
}

export default function SkillTreeView({ hearts, streak, onSessionComplete, onWrongAnswer }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const [nodes, setNodes]         = useState<NodeWithStatus[]>(() => getTreeWithStatus())
  const [selected, setSelected]   = useState<NodeWithStatus | null>(null)
  const [running, setRunning]     = useState(false)
  const [xp, setXp]               = useState<XPState>(() => loadXP())
  const [winNode, setWinNode]     = useState<{ title: string; xpGained: number; stars: number } | null>(null)
  const nextNodeRef               = useRef<HTMLButtonElement>(null)

  const refreshTree = useCallback(() => setNodes(getTreeWithStatus()), [])

  // Scroll to first available node on mount
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

          // Award XP: base reward × stars multiplier, bonus on first completion
          const starsMultiplier = result.stars === 3 ? 1.5 : result.stars === 2 ? 1.2 : 1
          const xpGained = Math.round(selected.xpReward * starsMultiplier) + (wasNew ? 10 : 0)
          const newXP = addXP(xpGained)
          setXp(newXP)

          onSessionComplete(result)
          refreshTree()
          setRunning(false)
          setSelected(null)

          // Show win overlay
          if (result.stars >= 1) {
            setWinNode({
              title: isHe ? selected.titleHe : selected.titleEn,
              xpGained,
              stars: result.stars,
            })
          }
        }}
      />
    )
  }

  // ── Win overlay ─────────────────────────────────────────────────────────
  if (winNode) {
    return (
      <WinOverlay
        title={winNode.title}
        xpGained={winNode.xpGained}
        stars={winNode.stars}
        isHe={isHe}
        onClose={() => setWinNode(null)}
      />
    )
  }

  // ── Node detail bottom sheet ────────────────────────────────────────────
  if (selected) {
    return <NodeSheet node={selected} isHe={isHe} hearts={hearts} onStart={() => setRunning(true)} onClose={() => setSelected(null)} />
  }

  const suggestedNext = findNextNode(nodes)
  const level = getLevel(xp.total)
  const levelPct = getLevelProgress(xp.total)

  // ── Tree map ────────────────────────────────────────────────────────────
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
        <XPBar xp={xp.total} level={level} progress={levelPct} isHe={isHe} />
      </div>

      {/* Path */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 0 40px',
        position: 'relative',
      }}>
        {nodes.map((node, idx) => {
          const offset = ZIGZAG[idx % ZIGZAG.length]
          const isNext = node.id === suggestedNext?.id
          const showDivider = !!node.group

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {showDivider && (
                <div style={{
                  marginTop: idx === 0 ? 0 : 36,
                  marginBottom: 18,
                  fontFamily: "'Oswald', 'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  color: 'var(--fm-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  background: 'var(--fm-bg-card)',
                  border: '1px solid var(--fm-border-mid)',
                  borderRadius: 6,
                  padding: '5px 16px',
                  boxShadow: '0 2px 0 0 var(--fm-border)',
                }}>
                  {isHe ? node.group!.he : node.group!.en}
                </div>
              )}

              {idx > 0 && !showDivider && (
                <div style={{ width: 2, height: 32, borderLeft: '2px dashed var(--fm-border-mid)' }} />
              )}
              {idx > 0 && showDivider && (
                <div style={{ width: 2, height: 14, borderLeft: '2px dashed var(--fm-border-mid)' }} />
              )}

              <div style={{ transform: `translateX(${offset}px)`, position: 'relative' }}>
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

// ── XP bar ────────────────────────────────────────────────────────────────────

function XPBar({ xp, level, progress, isHe }: {
  xp: number
  level: ReturnType<typeof getLevel>
  progress: number
  isHe: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Level badge — Oswald font for retro-label feel */}
      <div style={{
        fontFamily: "'Oswald', 'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 600,
        color: 'var(--fm-primary)',
        background: 'var(--fm-primary-bg)',
        border: '1px solid var(--fm-primary)',
        borderRadius: 5,
        padding: '3px 8px',
        flexShrink: 0,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        boxShadow: '0 2px 0 0 var(--fm-primary-shadow)',
      }}>
        LV{level.level}
      </div>
      {/* Progress bar with inset shadow (depth feel) */}
      <div style={{
        flex: 1, height: 7, borderRadius: 999,
        background: 'var(--fm-bg-input)',
        overflow: 'hidden',
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
      {/* XP total */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fm-xp)', flexShrink: 0 }}>
        {xp} XP
      </div>
      <div style={{ fontSize: 11, color: 'var(--fm-text-muted)', flexShrink: 0, display: 'none' /* hidden on small screens */ }}>
        {isHe ? level.titleHe : level.title}
      </div>
    </div>
  )
}

// ── Win overlay ───────────────────────────────────────────────────────────────

const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

function WinOverlay({ title, xpGained, stars, isHe, onClose }: {
  title: string
  xpGained: number
  stars: number
  isHe: boolean
  onClose: () => void
}) {
  // Auto-dismiss after 3s
  useEffect(() => {
    const id = setTimeout(onClose, 3200)
    return () => clearTimeout(id)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        flexDirection: 'column', gap: 0,
        animation: 'fm-fade-in 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* Burst particles */}
      <BurstParticles />

      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--fm-bg-deep)',
          border: '2px solid var(--fm-primary)',
          borderRadius: 24,
          padding: '36px 40px',
          textAlign: 'center',
          minWidth: 260,
          animation: 'fm-celebrate 0.4s cubic-bezier(0.22,1,0.36,1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Trophy */}
        <div style={{ fontSize: 52, marginBottom: 8 }}>🏆</div>

        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fm-text)', marginBottom: 4 }}>
          {isHe ? 'כל הכבוד!' : 'Well done!'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--fm-text-muted)', marginBottom: 20 }}>
          {title}
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <svg key={s} width="32" height="32" viewBox="0 0 24 24"
              fill={stars >= s ? '#f5b730' : 'var(--fm-border)'}
              style={{ animation: stars >= s ? `fm-star-pop 0.4s ${s * 0.12}s both ease` : undefined }}
            >
              <path d={STAR_PATH} />
            </svg>
          ))}
        </div>

        {/* XP gained */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--fm-primary-bg, rgba(88,204,2,0.1))',
          border: '1px solid var(--fm-primary)',
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

// CSS-based burst particles
function BurstParticles() {
  const colors = ['#f5b730', '#58cc02', '#e05260', '#1cb0f6', '#a259ff', '#ff9600']
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
        const tx  = Math.cos(rad) * p.dist
        const ty  = Math.sin(rad) * p.dist
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: p.size, height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              animation: `fm-burst 0.7s ${p.delay}s both ease-out`,
              ['--tx' as string]: `${tx}px`,
              ['--ty' as string]: `${ty}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}

// ── Single node button ────────────────────────────────────────────────────────

const TreeNodeButton = React.forwardRef<HTMLButtonElement, {
  node: NodeWithStatus
  isNext: boolean
  isHe: boolean
  onClick: () => void
}>(({ node, isNext, isHe, onClick }, ref) => {
  const locked    = node.status === 'locked'
  const complete  = node.status === 'complete'
  const mastered  = node.status === 'mastered'
  const available = node.status === 'available'

  const ringColor = mastered ? '#f5b730'
                  : (complete || available) ? 'var(--fm-primary)'
                  : 'var(--fm-border)'

  const bgColor   = mastered ? '#f5b730'
                  : (complete || available) ? 'var(--fm-primary)'
                  : 'var(--fm-bg-card)'

  const iconColor = (complete || mastered || available) ? 'white' : 'var(--fm-text-muted)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button
        ref={ref}
        onClick={onClick}
        disabled={locked}
        title={isHe ? node.titleHe : node.titleEn}
        style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: bgColor,
          border: `3px solid ${ringColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: locked ? 'not-allowed' : 'pointer',
          opacity: locked ? 0.42 : 1,
          position: 'relative',
          /* Tactile hard shadow — same language as buttons */
          boxShadow: locked
            ? '0 3px 0 0 var(--fm-border)'
            : mastered
              ? '0 5px 0 0 #8C7010, 0 2px 12px rgba(0,0,0,0.2)'
              : (complete || available)
                ? '0 5px 0 0 var(--fm-primary-shadow), 0 2px 12px rgba(0,0,0,0.2)'
                : '0 3px 0 0 var(--fm-border)',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          animation: isNext && available ? 'fm-pulse 2.4s ease-in-out infinite' : undefined,
        }}
        onMouseEnter={e => {
          if (!locked) {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.06)'
          }
        }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
        onMouseDown={e => {
          if (!locked) {
            e.currentTarget.style.transform = 'translateY(5px) scale(0.97)'
            e.currentTarget.style.boxShadow = '0 0 0 0 transparent'
          }
        }}
        onMouseUp={e => {
          if (!locked) e.currentTarget.style.transform = 'translateY(0) scale(1)'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill={iconColor}>
          <path d={node.icon} />
        </svg>

        {locked && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--fm-text-muted)">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>
        )}

        {(complete || mastered) && (
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 22, height: 22, borderRadius: '50%',
            backgroundColor: mastered ? '#f5b730' : 'var(--fm-primary)',
            border: '2px solid var(--fm-bg-deep)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        )}
      </button>

      <div style={{
        fontSize: 12, fontWeight: 700,
        color: locked ? 'var(--fm-text-muted)' : 'var(--fm-text)',
        maxWidth: 100, textAlign: 'center', lineHeight: 1.3,
      }}>
        {isHe ? node.titleHe : node.titleEn}
      </div>

      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3].map(s => (
          <svg key={s} width="12" height="12" viewBox="0 0 24 24"
            fill={node.progress.stars >= s ? '#f5b730' : 'var(--fm-border)'}
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
    </div>
  )
})
TreeNodeButton.displayName = 'TreeNodeButton'

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

// ── Node detail bottom sheet ──────────────────────────────────────────────────

function NodeSheet({ node, isHe, hearts, onStart, onClose }: {
  node: NodeWithStatus
  isHe: boolean
  hearts?: HeartsState
  onStart: () => void
  onClose: () => void
}) {
  const locked    = node.status === 'locked'
  const done      = node.status === 'complete' || node.status === 'mastered'
  const noHearts  = hearts && hearts.current === 0

  const diffLabel = (d: Difficulty) => {
    if (d === 'easy')   return isHe ? 'קל' : 'Easy'
    if (d === 'medium') return isHe ? 'בינוני' : 'Medium'
    return isHe ? 'קשה' : 'Hard'
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 520,
          background: 'var(--fm-bg-deep)',
          borderRadius: '20px 20px 0 0',
          padding: '28px 24px 40px',
          direction: isHe ? 'rtl' : 'ltr',
          animation: 'fm-slide-up 0.25s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'var(--fm-border)',
          margin: '0 auto 24px',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            backgroundColor: locked ? 'var(--fm-bg-card)' : 'var(--fm-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24"
              fill={locked ? 'var(--fm-text-muted)' : 'white'}>
              <path d={node.icon} />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fm-text)', lineHeight: 1.2 }}>
              {isHe ? node.titleHe : node.titleEn}
            </div>
            <div style={{
              fontSize: 11, marginTop: 5,
              fontFamily: "'Oswald', 'DM Sans', sans-serif",
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fm-text-muted)',
            }}>
              {diffLabel(node.difficulty)} · {node.xpReward} XP
            </div>
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'var(--fm-text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
          {isHe ? node.descHe : node.descEn}
        </p>

        {done && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: isHe ? 'flex-end' : 'flex-start' }}>
            {[1, 2, 3].map(s => (
              <svg key={s} width="24" height="24" viewBox="0 0 24 24"
                fill={node.progress.stars >= s ? '#f5b730' : 'var(--fm-border)'}
              >
                <path d={STAR_PATH} />
              </svg>
            ))}
            <span style={{ fontSize: 13, color: 'var(--fm-text-muted)', alignSelf: 'center', marginLeft: 4 }}>
              {node.progress.bestAccuracy}%
            </span>
          </div>
        )}

        {locked ? (
          <div style={{
            padding: '13px 16px', borderRadius: 10,
            background: 'var(--fm-bg-input)', border: '1px solid var(--fm-border)',
            fontSize: 13, color: 'var(--fm-text-muted)', textAlign: 'center',
            borderBottom: '3px solid var(--fm-border)',
          }}>
            {isHe ? '🔒 השלם את הצמתים הקודמים כדי לפתוח' : '🔒 Complete previous nodes to unlock'}
          </div>
        ) : noHearts ? (
          <div style={{
            padding: '13px 16px', borderRadius: 10,
            background: 'var(--fm-bg-input)', border: '1px solid var(--fm-coral)',
            fontSize: 13, color: 'var(--fm-text-muted)', textAlign: 'center',
            borderBottom: '3px solid var(--fm-coral-shadow)',
          }}>
            {isHe ? '❤️ אזלו הלבבות — המתן לטעינה מחדש כדי להמשיך' : '❤️ No hearts left — wait for a refill to continue'}
          </div>
        ) : (
          <TactileButton
            variant={done ? 'success' : 'primary'}
            fullWidth
            onClick={onStart}
          >
            {done ? (isHe ? '▶ שחק שוב' : '▶ Play again') : (isHe ? 'התחל' : 'Start')}
          </TactileButton>
        )}
      </div>
    </div>
  )
}
