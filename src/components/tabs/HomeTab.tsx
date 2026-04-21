import { useTranslation } from 'react-i18next'
import { getTopicsByStage, type Topic } from '../../lib/topics/topicData'
import { getTopicTree } from '../../lib/topics/topicTrees'
import { getTreeWithStatus } from '../../lib/skilltree/treeEngine'

interface Props {
  onSelectTopic: (topic: Topic) => void
}

// Compute simple progress % for a topic
function topicProgress(topicId: string): { done: number; total: number } {
  const nodes = getTopicTree(topicId)
  if (!nodes.length) return { done: 0, total: 0 }
  const withStatus = getTreeWithStatus(nodes)
  const done = withStatus.filter(n => n.status === 'complete' || n.status === 'mastered').length
  return { done, total: nodes.length }
}

const STAGE_LABELS = {
  1: { he: '⭐ שלב 1 — יסודות', en: '⭐ Stage 1 — Foundations' },
  2: { he: '🎸 שלב 2 — ביניים', en: '🎸 Stage 2 — Intermediate' },
  3: { he: '🎓 שלב 3 — מתקדם', en: '🎓 Stage 3 — Advanced' },
}

export default function HomeTab({ onSelectTopic }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  return (
    <div style={{ minHeight: '100vh', padding: '28px 16px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28, textAlign: isHe ? 'right' : 'left' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--fm-primary)',
          marginBottom: 6,
        }}>
          FretMaster
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 900, margin: '0 0 6px',
          color: 'var(--fm-text)',
          fontFamily: "'Oswald', 'DM Sans', sans-serif",
        }}>
          {isHe ? 'בחר נושא ללמידה' : 'Choose a Topic'}
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--fm-text-muted)', lineHeight: 1.5 }}>
          {isHe
            ? 'כל נושא כולל 25 אתגרים בעצימות עולה — מבסיס עד שליטה מלאה'
            : 'Each topic has 25 challenges at increasing difficulty — from basics to full mastery'}
        </p>
      </div>

      {/* Stages */}
      {([1, 2, 3] as const).map(stage => (
        <div key={stage} style={{ marginBottom: 36 }}>
          {/* Stage divider */}
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--fm-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            marginBottom: 14,
            paddingBottom: 8,
            borderBottom: '1px solid var(--fm-border)',
            textAlign: isHe ? 'right' : 'left',
          }}>
            {isHe ? STAGE_LABELS[stage].he : STAGE_LABELS[stage].en}
          </div>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(152px, 1fr))',
            gap: 12,
          }}>
            {getTopicsByStage(stage).map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isHe={isHe}
                onClick={() => onSelectTopic(topic)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Topic card ─────────────────────────────────────────────────────────────────

function TopicCard({ topic, isHe, onClick }: { topic: Topic; isHe: boolean; onClick: () => void }) {
  const { done, total } = topicProgress(topic.id)
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const started = done > 0

  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--fm-bg-card)',
        border: `2px solid ${started ? topic.color + '55' : 'var(--fm-border)'}`,
        borderRadius: 18,
        padding: '16px 14px 14px',
        cursor: 'pointer',
        textAlign: isHe ? 'right' : 'left',
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: started ? `0 4px 20px ${topic.color}22` : '0 2px 8px rgba(0,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onPointerEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 28px ${topic.color}33`
      }}
      onPointerLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = started ? `0 4px 20px ${topic.color}22` : '0 2px 8px rgba(0,0,0,0.12)'
      }}
    >
      {/* Colored top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${topic.color}, ${topic.color}88)`,
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${topic.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        marginTop: 4,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={topic.color}>
          <path d={topic.icon} />
        </svg>
      </div>

      {/* Title & desc */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13, fontWeight: 800, color: 'var(--fm-text)',
          lineHeight: 1.3, marginBottom: 4,
        }}>
          {isHe ? topic.titleHe : topic.titleEn}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fm-text-muted)', lineHeight: 1.4 }}>
          {isHe ? topic.descHe : topic.descEn}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 5,
        }}>
          <span style={{ fontSize: 10, color: 'var(--fm-text-muted)', fontWeight: 600 }}>
            {isHe ? `${done}/${total} שלבים` : `${done}/${total} nodes`}
          </span>
          {pct > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: topic.color }}>{pct}%</span>
          )}
        </div>
        <div style={{ height: 4, background: 'var(--fm-border)', borderRadius: 2, overflow: 'hidden' }}>
          {pct > 0 && (
            <div style={{
              height: '100%', width: `${pct}%`,
              background: `linear-gradient(90deg, ${topic.color}, ${topic.color}aa)`,
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }} />
          )}
        </div>
      </div>

      {/* CTA label */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: pct === 100 ? '#22c55e' : topic.color,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {pct === 100 ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {isHe ? 'הושלם!' : 'Complete!'}
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            {started ? (isHe ? 'המשך' : 'Continue') : (isHe ? 'התחל' : 'Start')}
          </>
        )}
      </div>
    </button>
  )
}
