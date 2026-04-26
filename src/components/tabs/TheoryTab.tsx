import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theoryContent } from '../../data/theoryContent'
import ArticleReader from '../theory/ArticleReader'
import type { PushBackFn, CleanupBackFn } from '../../App'

interface Props {
  pushBack?: PushBackFn
  cleanupBack?: CleanupBackFn
  onClose?: () => void
  resetSignal?: number
}

function IconX() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"/>
      <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"/>
    </svg>
  )
}

export default function TheoryTab({ pushBack, cleanupBack, onClose, resetSignal }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const lang  = isHe ? 'he' : 'en'

  const [openArticleId, setOpenArticleId] = useState<string | null>(null)
  const openArticleIdRef = useRef<string | null>(null)

  const [activeTag, setActiveTag] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('tag')
  )

  // Push a back entry when the tab first mounts so browser back returns to home.
  useEffect(() => {
    pushBack?.(() => onClose?.())
    return () => {
      // Clear tag param from URL on unmount
      const url = new URL(window.location.href)
      url.searchParams.delete('tag')
      history.replaceState(history.state, '', url.toString())
      cleanupBack?.(openArticleIdRef.current ? 2 : 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close open article when the sidebar theory link is clicked while already on this tab
  useEffect(() => {
    if (!resetSignal) return
    if (openArticleIdRef.current) {
      cleanupBack?.(1)
      closeArticle()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal])

  // Sync activeTag ↔ URL search param
  useEffect(() => {
    const url = new URL(window.location.href)
    if (activeTag) url.searchParams.set('tag', activeTag)
    else url.searchParams.delete('tag')
    history.replaceState(history.state, '', url.toString())
  }, [activeTag])

  const openArticle = (id: string) => {
    pushBack?.(() => closeArticle())
    openArticleIdRef.current = id
    setOpenArticleId(id)
  }

  const closeArticle = () => {
    openArticleIdRef.current = null
    setOpenArticleId(null)
  }

  const handleInAppBack = () => {
    cleanupBack?.(1)
    closeArticle()
  }

  // Called from ArticleReader tag click: close article, apply filter
  const handleTagClick = (tag: string) => {
    if (openArticleIdRef.current) {
      cleanupBack?.(1)
      closeArticle()
    }
    setActiveTag(tag)
  }

  const handleClearFilter = () => setActiveTag(null)

  if (openArticleId) {
    return (
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <ArticleReader
          articleId={openArticleId}
          onBack={handleInAppBack}
          onTagClick={handleTagClick}
        />
      </div>
    )
  }

  const allArticles = Object.values(theoryContent)
  const articles = activeTag
    ? allArticles.filter(a => a[lang].tags.includes(activeTag))
    : allArticles

  return (
    <div className="fm-page" dir={isHe ? 'rtl' : 'ltr'} style={{ padding: '40px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 11, fontWeight: 700,
          color: 'var(--fm-primary)',
          textTransform: 'uppercase', letterSpacing: '0.22em',
          marginBottom: 12,
        }}>
          {isHe ? 'ספריית תיאוריה' : 'Theory Library'}
        </div>
        <h1 style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 32, fontWeight: 800,
          color: 'var(--fm-text)',
          margin: '0 0 10px', letterSpacing: '-0.3px',
        }}>
          {isHe ? 'הספרייה התאורטית' : 'Theory Library'}
        </h1>
        <p style={{
          fontSize: 15, color: 'var(--fm-text-muted)',
          lineHeight: 1.65, margin: 0, maxWidth: 480,
        }}>
          {isHe
            ? 'תיאוריה מוסברת לעומק, ללא מבחנים. קרא בקצב שלך.'
            : 'Music theory explained in depth, no quizzes. Read at your own pace.'}
        </p>
      </div>

      {/* ── Active filter indicator ─────────────────────────────────────────── */}
      {activeTag && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 24, maxWidth: 680,
          padding: '10px 16px',
          background: 'var(--fm-bg-elevated)',
          border: '1px solid var(--fm-primary)',
          borderInlineStart: '4px solid var(--fm-primary)',
        }}>
          <span style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 11, fontWeight: 700,
            color: 'var(--fm-text)',
            textTransform: 'uppercase', letterSpacing: '0.14em',
            flex: 1,
          }}>
            {isHe ? `מציג מאמרים בנושא: ${activeTag}` : `Showing articles tagged: ${activeTag}`}
          </span>
          <button
            onClick={handleClearFilter}
            aria-label={isHe ? 'נקה סינון' : 'Clear filter'}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'transparent',
              border: '1px solid var(--fm-border-mid)',
              color: 'var(--fm-text-muted)',
              fontFamily: 'var(--fm-font-display)',
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '5px 10px',
              cursor: 'pointer',
              transition: 'color 0.12s, border-color 0.12s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--fm-text)'
              e.currentTarget.style.borderColor = 'var(--fm-text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--fm-text-muted)'
              e.currentTarget.style.borderColor = 'var(--fm-border-mid)'
            }}
          >
            <IconX />
            <span>{isHe ? 'נקה' : 'Clear'}</span>
          </button>
        </div>
      )}

      {/* ── Article cards ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
        {articles.length === 0 && (
          <div style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 13, color: 'var(--fm-text-muted)',
            padding: '32px 0', letterSpacing: '0.06em',
          }}>
            {isHe ? 'לא נמצאו מאמרים עבור תגית זו.' : 'No articles found for this tag.'}
          </div>
        )}

        {articles.map(article => {
          const c = article[lang]
          return (
            <button
              key={article.id}
              onClick={() => openArticle(article.id)}
              style={{
                display: 'block', width: '100%', textAlign: isHe ? 'right' : 'left',
                background: 'var(--fm-bg-card)',
                border: '1px solid var(--fm-border)',
                padding: '22px 24px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                borderRadius: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--fm-primary)'
                e.currentTarget.style.background = 'var(--fm-bg-elevated)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--fm-border)'
                e.currentTarget.style.background = 'var(--fm-bg-card)'
              }}
            >
              {/* Tags — clickable, stop propagation so card doesn't open */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {c.tags.map((tag, i) => {
                  const isActive = tag === activeTag
                  return (
                    <TagChip
                      key={i}
                      tag={tag}
                      active={isActive}
                      onClick={e => { e.stopPropagation(); handleTagClick(tag) }}
                    />
                  )
                })}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'var(--fm-font-display)',
                fontSize: 20, fontWeight: 800,
                color: 'var(--fm-text)', marginBottom: 6, lineHeight: 1.25,
              }}>
                {c.title}
              </div>

              {/* Subtitle */}
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', lineHeight: 1.55 }}>
                {c.subtitle}
              </div>

              {/* Section count */}
              <div style={{
                marginTop: 16,
                fontFamily: 'var(--fm-font-display)',
                fontSize: 11, fontWeight: 600,
                color: 'var(--fm-primary)', letterSpacing: '0.1em',
              }}>
                {c.sections.length} {isHe ? 'פרקים' : 'sections'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Shared tag chip used in article index cards ────────────────────────────────
function TagChip({
  tag, active, onClick,
}: {
  tag: string
  active: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  const [hovered, setHovered] = useState(false)

  const bg     = active ? 'var(--fm-primary)' : hovered ? 'var(--fm-text)' : 'transparent'
  const color  = active || hovered ? '#FAF8F0' : 'var(--fm-text-muted)'
  const border = active ? 'var(--fm-primary)' : hovered ? 'var(--fm-text)' : 'var(--fm-border-mid)'

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(e as unknown as React.MouseEvent) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--fm-font-display)',
        fontSize: 10, fontWeight: 700,
        color, background: bg,
        border: `1px solid ${border}`,
        padding: '2px 8px',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'color 0.12s, background 0.12s, border-color 0.12s',
        display: 'inline-block',
        userSelect: 'none',
      }}
    >
      {tag}
    </span>
  )
}
