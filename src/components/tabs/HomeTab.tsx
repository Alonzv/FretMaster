import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getTopicsByStage, type Topic } from '../../lib/topics/topicData'
import { getTopicTree } from '../../lib/topics/topicTrees'
import { getTreeWithStatus } from '../../lib/skilltree/treeEngine'
import { loadXP, getLevel } from '../../lib/gamification/xp'
import { loadStreak } from '../../lib/gamification/streak'

interface Props {
  onSelectTopic: (topic: Topic) => void
}

// Compute progress % for a topic
function topicProgress(topicId: string): { done: number; total: number } {
  const nodes = getTopicTree(topicId)
  if (!nodes.length) return { done: 0, total: 0 }
  const withStatus = getTreeWithStatus(nodes)
  const done = withStatus.filter(n => n.status === 'complete' || n.status === 'mastered').length
  return { done, total: nodes.length }
}

// Check if a stage is ≥50% complete (for unlock logic)
function stageCompletionPct(stage: 1 | 2 | 3): number {
  const topics = getTopicsByStage(stage)
  if (!topics.length) return 0
  let totalDone = 0, totalNodes = 0
  for (const t of topics) {
    const { done, total } = topicProgress(t.id)
    totalDone += done
    totalNodes += total
  }
  return totalNodes > 0 ? Math.round((totalDone / totalNodes) * 100) : 0
}

// Stage icons: geometric SVG paths (no emoji)
const STAGE_ICONS = {
  1: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 0h6v6h-6v-6z"/></svg>,
  2: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>,
  3: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M7 19v-2h4v-3.1c-1.44-.31-2.63-1.05-3.56-2.22C6.5 10.52 6 9.14 6 7.55v-.92L4.08 4.5 5.5 3.08 20.92 18.5 19.5 19.92l-1.97-1.97c-.52.38-1.09.67-1.72.88-.63.21-1.19.16-1.81.17V17H10l-3 2zm9-4.85-3.06-3.06c.04.31.06.62.06.91 0 1.01-.27 1.93-.82 2.75-.55.82-1.27 1.37-2.18 1.65V15h-1V7.55c0-.6.08-1.18.23-1.72L5.4 3.98c.04-.04.04-.06 0-.06l.27.47-.51.52L5 4.77V7.55c0 2.08.7 3.85 2.1 5.33C8.5 14.35 10.13 15 12 15c.63 0 1.24-.09 1.82-.27L14 15h-.15l3 3c.04-.28.07-.57.09-.85H19v-1h-3V15z"/></svg>,
}
const STAGE_META = {
  1: { labelHe: 'שלב 1 — יסודות', labelEn: 'Stage 1 — Foundations' },
  2: { labelHe: 'שלב 2 — ביניים',  labelEn: 'Stage 2 — Intermediate' },
  3: { labelHe: 'שלב 3 — מתקדם',   labelEn: 'Stage 3 — Advanced' },
}

export default function HomeTab({ onSelectTopic }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  // Live XP + streak from localStorage
  const [xpState]     = useState(() => loadXP())
  const [streakState] = useState(() => loadStreak())
  const level = getLevel(xpState.total)

  // Stage 3 locked until Stage 2 is ≥50% done
  const stage2Pct = stageCompletionPct(2)
  const stage3Locked = stage2Pct < 50

  // Stagger animation index
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  // XP bar inside current level
  const xpInLevel   = xpState.total - level.minXP
  const xpNeeded    = level.maxXP > 0 ? level.maxXP - level.minXP : 1
  const xpPct       = level.maxXP > 0 ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px 80px', maxWidth: 720, margin: '0 auto' }}>

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <div style={{
        marginBottom: 28,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        {/* Level badge + streak row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isHe ? 'flex-end' : 'flex-start',
          gap: 10, marginBottom: 12, flexWrap: 'wrap',
        }}>
          {/* Level badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 12px',
            background: 'var(--fm-primary-bg)',
            border: '1px solid var(--fm-primary-soft)',
            borderRadius: 0, cursor: 'default',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--fm-primary)" aria-hidden="true">
              <path d="M7 2v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2V2h-2v2H9V2H7zm12 6v12H5V8h14zm-7 2l-1.5 3.1L7 13.5l2.5 2.4-.6 3.1L12 17.4l3.1 1.6-.6-3.1 2.5-2.4-3.5-.4L12 10z"/>
            </svg>
            <span style={{
              fontSize: 13, fontWeight: 700, color: 'var(--fm-primary)',
              fontFamily: 'var(--fm-font-display)',
            }}>
              {isHe ? `רמה ${level.level} — ${level.titleHe}` : `Lv.${level.level} ${level.title}`}
            </span>
          </div>

          {/* Streak badge */}
          {streakState.count > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px',
              background: 'var(--fm-streak-bg)',
              border: '1px solid rgba(245,194,0,0.3)',
              borderRadius: 0, cursor: 'default',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--fm-streak)" className="fm-streak-anim" aria-hidden="true">
                <path d="M7 2v13h3v7l7-12h-4l4-8z"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-streak)' }}>
                {streakState.count} {isHe ? 'ימים ברצף' : 'day streak'}
              </span>
            </div>
          )}

          {/* Total XP */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px',
            background: 'var(--fm-xp-bg)',
            border: '1px solid rgba(245,194,0,0.2)',
            borderRadius: 0, cursor: 'default',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--fm-xp)" aria-hidden="true">
              <path d="M12 1L9 9H1l6.5 5L5 22l7-5 7 5-2.5-8L22 9h-8z"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-xp)' }}>
              {xpState.total.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* XP progress bar */}
        {level.maxXP > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 4, fontSize: 11, color: 'var(--fm-text-dim)',
            }}>
              <span>{isHe ? `ל-רמה ${level.level + 1}` : `To Level ${level.level + 1}`}</span>
              <span>{xpPct}%</span>
            </div>
            <div style={{
              height: 6, background: 'var(--fm-bg-input)',
              borderRadius: 999, overflow: 'hidden',
            }}>
              <div
                className="fm-xp-bar-fill"
                style={{ width: `${xpPct}%`, height: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontSize: 26, fontWeight: 900, margin: '0 0 6px',
          color: 'var(--fm-text)',
          fontFamily: 'var(--fm-font-display)',
          textAlign: isHe ? 'right' : 'left',
        }}>
          {isHe ? 'בחר נושא ללמידה' : 'Choose a Topic'}
        </h1>
        <p style={{
          margin: 0, fontSize: 14, color: 'var(--fm-text-muted)',
          lineHeight: 1.5, textAlign: isHe ? 'right' : 'left',
        }}>
          {isHe
            ? 'כל נושא כולל 25 אתגרים בעצימות עולה — מבסיס עד שליטה מלאה'
            : 'Each topic has 25 challenges at increasing difficulty — from basics to mastery'}
        </p>
      </div>

      {/* ── Stages ─────────────────────────────────────────────────────────── */}
      {([1, 2, 3] as const).map((stage, stageIdx) => {
        const locked = stage === 3 && stage3Locked
        const meta = STAGE_META[stage]
        const stagePct = stageCompletionPct(stage)

        return (
          <div
            key={stage}
            style={{
              marginBottom: 36,
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(14px)',
              transition: `opacity 0.4s ease ${stageIdx * 0.1 + 0.1}s, transform 0.4s ease ${stageIdx * 0.1 + 0.1}s`,
            }}
          >
            {/* Stage header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: `1px solid ${locked ? 'var(--fm-border)' : 'var(--fm-border-mid)'}`,
              flexDirection: isHe ? 'row-reverse' : 'row',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isHe ? 'row-reverse' : 'row' }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: locked ? 'var(--fm-text-dim)' : 'var(--fm-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {STAGE_ICONS[stage]}
                  {isHe ? meta.labelHe : meta.labelEn}
                </span>
                {locked && (
                  <span className="fm-locked-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    {isHe ? `נפתח ב-50% שלב 2 (${stage2Pct}%)` : `Unlocks at 50% Stage 2 (${stage2Pct}%)`}
                  </span>
                )}
              </div>
              {stagePct > 0 && !locked && (
                <span style={{ fontSize: 12, color: 'var(--fm-primary)', fontWeight: 700 }}>
                  {stagePct}%
                </span>
              )}
            </div>

            {/* Cards grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
              gap: 11,
              opacity: locked ? 0.45 : 1,
              pointerEvents: locked ? 'none' : 'auto',
              transition: 'opacity 0.3s',
            }}>
              {getTopicsByStage(stage).map((topic, i) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  isHe={isHe}
                  animDelay={stageIdx * 0.1 + i * 0.05 + 0.15}
                  visible={visible}
                  onClick={() => !locked && onSelectTopic(topic)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Topic card ─────────────────────────────────────────────────────────────────

interface CardProps {
  topic: Topic
  isHe: boolean
  onClick: () => void
  animDelay?: number
  visible: boolean
}

function TopicCard({ topic, isHe, onClick, visible }: CardProps) {
  const { done, total } = topicProgress(topic.id)
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const started = done > 0
  const complete = pct === 100

  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--fm-bg-card)',
        border: `2px solid ${started ? topic.color + '55' : 'var(--fm-border)'}`,
        borderRadius: 18,
        padding: '15px 13px 13px',
        cursor: 'pointer',
        textAlign: isHe ? 'right' : 'left',
        display: 'flex', flexDirection: 'column', gap: 9,
        transition: 'transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s ease, border-color 0.18s',
        boxShadow: started
          ? `0 4px 20px ${topic.color}22, 0 2px 0 0 ${topic.color}44`
          : '0 2px 8px rgba(0,0,0,0.14)',
        position: 'relative', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        // Stagger-in via inline transition delay
      }}
      onPointerEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'
        e.currentTarget.style.boxShadow = `0 12px 32px ${topic.color}44, 0 2px 0 0 ${topic.color}55`
        e.currentTarget.style.borderColor = topic.color + 'aa'
      }}
      onPointerLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = started ? `0 4px 20px ${topic.color}22` : '0 2px 8px rgba(0,0,0,0.14)'
        e.currentTarget.style.borderColor = started ? topic.color + '55' : 'var(--fm-border)'
      }}
    >
      {/* Colored top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: complete
          ? 'linear-gradient(90deg, #22c55e, #16a34a)'
          : `linear-gradient(90deg, ${topic.color}, ${topic.color}66)`,
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Completion shimmer */}
      {complete && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, transparent 60%)',
          borderRadius: 16, pointerEvents: 'none',
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: complete ? 'rgba(34,197,94,0.15)' : `${topic.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 2,
        transition: 'background 0.2s',
      }}>
        {complete ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={topic.color}>
            <path d={topic.icon} />
          </svg>
        )}
      </div>

      {/* Title & desc */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 800, color: 'var(--fm-text)',
          lineHeight: 1.3, marginBottom: 3,
        }}>
          {isHe ? topic.titleHe : topic.titleEn}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--fm-text-muted)', lineHeight: 1.4 }}>
          {isHe ? topic.descHe : topic.descEn}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isHe ? 'flex-end' : 'space-between',
          marginBottom: 4, gap: 4,
          flexDirection: isHe ? 'row-reverse' : 'row',
        }}>
          <span style={{ fontSize: 10, color: 'var(--fm-text-muted)', fontWeight: 600 }}>
            {isHe ? `${done}/${total}` : `${done}/${total}`}
          </span>
          {pct > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: complete ? '#22c55e' : topic.color }}>
              {pct}%
            </span>
          )}
        </div>
        <div style={{ height: 3, background: 'var(--fm-border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: complete
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : `linear-gradient(90deg, ${topic.color}, ${topic.color}88)`,
            borderRadius: 2,
            transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
      </div>

      {/* CTA label */}
      <div style={{
        fontSize: 11, fontWeight: 700,
        color: complete ? '#22c55e' : topic.color,
        display: 'flex', alignItems: 'center', gap: 4,
        flexDirection: isHe ? 'row-reverse' : 'row',
      }}>
        {complete ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {isHe ? 'הושלם!' : 'Complete!'}
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            {started ? (isHe ? 'המשך' : 'Continue') : (isHe ? 'התחל' : 'Start')}
          </>
        )}
      </div>
    </button>
  )
}
