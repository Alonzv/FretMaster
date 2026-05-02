import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theoryContent } from '../../data/theoryContent'
import { theoryCategories } from '../../data/theoryCategories'
import ArticleReader from '../theory/ArticleReader'
import type { PushBackFn, CleanupBackFn } from '../../App'

interface Props {
  pushBack?: PushBackFn
  cleanupBack?: CleanupBackFn
  onClose?: () => void
  resetSignal?: number
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconX() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  )
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      style={{
        transition: 'transform 0.22s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline
        points="3,5 8,11 13,5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  )
}

// ── Shared tag chip ────────────────────────────────────────────────────────────
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

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({
  article, lang, isHe, activeTag, onOpen, onTagClick,
}: {
  article: (typeof theoryContent)[string]
  lang: 'he' | 'en'
  isHe: boolean
  activeTag: string | null
  onOpen: () => void
  onTagClick: (tag: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const c = article[lang]

  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', width: '100%', textAlign: isHe ? 'right' : 'left',
        background: hovered ? 'var(--fm-bg-elevated)' : 'var(--fm-bg-card)',
        border: `1px solid ${hovered ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
        padding: '18px 20px',
        cursor: 'pointer',
        borderRadius: 0,
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
        {c.tags.map((tag, i) => (
          <TagChip
            key={i}
            tag={tag}
            active={tag === activeTag}
            onClick={e => { e.stopPropagation(); onTagClick(tag) }}
          />
        ))}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--fm-font-display)',
        fontSize: 17, fontWeight: 800,
        color: 'var(--fm-text)', marginBottom: 5, lineHeight: 1.25,
      }}>
        {c.title}
      </div>

      {/* Subtitle */}
      <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', lineHeight: 1.5 }}>
        {c.subtitle}
      </div>

      {/* Section count */}
      <div style={{
        marginTop: 12,
        fontFamily: 'var(--fm-font-display)',
        fontSize: 10, fontWeight: 600,
        color: 'var(--fm-primary)', letterSpacing: '0.1em',
      }}>
        {c.sections.length} {isHe ? 'פרקים' : 'sections'}
      </div>
    </button>
  )
}

// ── Accordion row ─────────────────────────────────────────────────────────────
function AccordionRow({
  title,
  description,
  articleIds,
  isOpen,
  onToggle,
  lang,
  isHe,
  activeTag,
  onOpenArticle,
  onTagClick,
}: {
  title: string
  description: string
  articleIds: string[]
  isOpen: boolean
  onToggle: () => void
  lang: 'he' | 'en'
  isHe: boolean
  activeTag: string | null
  onOpenArticle: (id: string) => void
  onTagClick: (tag: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  // Resolve article IDs to actual content objects (skip missing ones)
  const articles = articleIds
    .map(id => theoryContent[id as keyof typeof theoryContent])
    .filter(Boolean)

  // If tag filter is active, check if any article in this category matches
  const visibleArticles = activeTag
    ? articles.filter(a => a[lang].tags.includes(activeTag))
    : articles

  // Do not render accordion row at all if tag filter returns 0 results
  // (still render the row header so users can see the category exists, just dim it)
  const hasVisible = visibleArticles.length > 0

  const headerBg = isOpen
    ? 'var(--fm-text)'
    : hovered
      ? 'var(--fm-bg-elevated)'
      : 'var(--fm-bg-card)'

  const headerColor = isOpen ? '#FAF8F0' : 'var(--fm-text)'

  return (
    <div style={{ borderBottom: '1px solid var(--fm-border)' }}>
      {/* Category header row */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={isOpen}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '18px 20px',
          background: headerBg,
          border: 'none',
          borderInlineStart: `3px solid ${isOpen ? 'var(--fm-primary)' : 'transparent'}`,
          cursor: 'pointer',
          textAlign: isHe ? 'right' : 'left',
          gap: 12,
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {/* Left: text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 14, fontWeight: 800,
            color: headerColor,
            letterSpacing: '0.04em',
            marginBottom: 3,
            transition: 'color 0.15s',
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 11,
            color: isOpen ? 'rgba(250,248,240,0.65)' : 'var(--fm-text-muted)',
            lineHeight: 1.5,
            transition: 'color 0.15s',
          }}>
            {description}
          </div>
        </div>

        {/* Right: article count + chevron */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 10, fontWeight: 700,
            color: isOpen ? 'rgba(250,248,240,0.5)' : 'var(--fm-text-muted)',
            letterSpacing: '0.1em',
          }}>
            {articles.length} {isHe ? 'מאמרים' : 'articles'}
          </span>
          <div style={{ color: isOpen ? '#FAF8F0' : 'var(--fm-text-muted)' }}>
            <IconChevron open={isOpen} />
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? '9999px' : '0',
          transition: isOpen
            ? 'max-height 0.35s ease-in'
            : 'max-height 0.25s ease-out',
        }}
      >
        <div style={{
          padding: '4px 0 16px',
          borderInlineStart: '3px solid var(--fm-primary)',
          marginInlineStart: 0,
        }}>
          {hasVisible ? (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 6,
              padding: '0 0 0 0',
            }}>
              {visibleArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  lang={lang}
                  isHe={isHe}
                  activeTag={activeTag}
                  onOpen={() => onOpenArticle(article.id)}
                  onTagClick={onTagClick}
                />
              ))}
            </div>
          ) : (
            <div style={{
              padding: '20px 20px',
              fontFamily: 'var(--fm-font-display)',
              fontSize: 12, color: 'var(--fm-text-muted)',
              letterSpacing: '0.06em',
            }}>
              {isHe ? 'אין מאמרים בקטגוריה זו עבור סינון זה.' : 'No articles in this category for the active filter.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TheoryTab({ pushBack, cleanupBack, onClose, resetSignal }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const lang  = isHe ? 'he' : 'en'

  const [openArticleId, setOpenArticleId] = useState<string | null>(null)
  const openArticleIdRef = useRef<string | null>(null)

  const [activeTag, setActiveTag] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('tag')
  )

  // Track which accordion categories are open (multiple allowed simultaneously)
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set()
  )

  // Push a back entry when the tab first mounts so browser back returns to home.
  useEffect(() => {
    pushBack?.(() => onClose?.())
    return () => {
      const url = new URL(window.location.href)
      url.searchParams.delete('tag')
      history.replaceState(history.state, '', url.toString())
      cleanupBack?.(openArticleIdRef.current ? 2 : 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close open article when sidebar theory link is clicked while on this tab
  useEffect(() => {
    if (!resetSignal) return
    if (openArticleIdRef.current) {
      cleanupBack?.(1)
      closeArticle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal])

  // Sync activeTag with URL
  useEffect(() => {
    const url = new URL(window.location.href)
    if (activeTag) url.searchParams.set('tag', activeTag)
    else url.searchParams.delete('tag')
    history.replaceState(history.state, '', url.toString())
  }, [activeTag])

  // When tag filter becomes active, expand all categories that contain matching articles
  useEffect(() => {
    if (!activeTag) return
    const toOpen = new Set<string>()
    for (const cat of theoryCategories) {
      const hasMatch = cat.articles.some(id => {
        const a = theoryContent[id as keyof typeof theoryContent]
        return a && a[lang].tags.includes(activeTag)
      })
      if (hasMatch) toOpen.add(cat.id)
    }
    if (toOpen.size > 0) setOpenCategories(prev => new Set([...prev, ...toOpen]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleTagClick = (tag: string) => {
    if (openArticleIdRef.current) {
      cleanupBack?.(1)
      closeArticle()
    }
    setActiveTag(tag)
  }

  const handleClearFilter = () => setActiveTag(null)

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Article reader view ──────────────────────────────────────────────────────
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

  // ── Categorised IDs (to detect uncategorised articles) ───────────────────────
  const categorisedIds = new Set(theoryCategories.flatMap(c => c.articles))
  const uncategorisedArticles = Object.values(theoryContent).filter(
    a => !categorisedIds.has(a.id)
  )

  // ── Library view ─────────────────────────────────────────────────────────────
  return (
    <div className="fm-page" dir={isHe ? 'rtl' : 'ltr'} style={{ padding: '40px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
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

      {/* Active tag filter indicator */}
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

      {/* Accordion categories */}
      <div style={{
        maxWidth: 680,
        border: '1px solid var(--fm-border)',
      }}>
        {theoryCategories.map(cat => (
          <AccordionRow
            key={cat.id}

            title={cat.title[lang]}
            description={cat.description[lang]}
            articleIds={cat.articles}
            isOpen={openCategories.has(cat.id)}
            onToggle={() => toggleCategory(cat.id)}
            lang={lang}
            isHe={isHe}
            activeTag={activeTag}
            onOpenArticle={openArticle}
            onTagClick={handleTagClick}
          />
        ))}

        {/* Fallback row for uncategorised articles */}
        {uncategorisedArticles.length > 0 && (
          <AccordionRow
            key="__other"
            title={isHe ? 'נושאים נוספים' : 'Additional Topics'}
            description={isHe
              ? 'מאמרים שטרם סווגו לקטגוריה ספציפית.'
              : 'Articles not yet assigned to a specific category.'}
            articleIds={uncategorisedArticles.map(a => a.id)}
            isOpen={openCategories.has('__other')}
            onToggle={() => toggleCategory('__other')}
            lang={lang}
            isHe={isHe}
            activeTag={activeTag}
            onOpenArticle={openArticle}
            onTagClick={handleTagClick}
          />
        )}
      </div>
    </div>
  )
}
