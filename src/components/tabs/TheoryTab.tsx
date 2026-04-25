import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theoryContent } from '../../data/theoryContent'
import ArticleReader from '../theory/ArticleReader'
import type { PushBackFn, CleanupBackFn } from '../../App'

interface Props {
  pushBack?: PushBackFn
  cleanupBack?: CleanupBackFn
  onClose?: () => void   // called by browser back when on the article list
}

export default function TheoryTab({ pushBack, cleanupBack, onClose }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const lang  = isHe ? 'he' : 'en'

  const [openArticleId, setOpenArticleId] = useState<string | null>(null)

  // Push a back entry when the tab first mounts so the browser back button
  // returns to the previous tab (home) instead of exiting the app.
  useEffect(() => {
    pushBack?.(() => onClose?.())
    return () => {
      // If we unmount programmatically (tab switch), clean up both the
      // tab-level entry and any open-article entry.
      cleanupBack?.(openArticleId ? 2 : 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openArticle = (id: string) => {
    pushBack?.(() => closeArticle())
    setOpenArticleId(id)
  }

  const closeArticle = () => {
    setOpenArticleId(null)
  }

  const handleInAppBack = () => {
    // In-app back button: remove the article's history entry, then close
    cleanupBack?.(1)
    closeArticle()
  }

  if (openArticleId) {
    return (
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <ArticleReader articleId={openArticleId} onBack={handleInAppBack} />
      </div>
    )
  }

  const articles = Object.values(theoryContent)

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
          {isHe ? 'מאמרי עומק' : 'Deep Reads'}
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

      {/* Article cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
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
              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {c.tags.map((tag, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--fm-font-display)',
                    fontSize: 10, fontWeight: 700,
                    color: 'var(--fm-text-muted)',
                    border: '1px solid var(--fm-border-mid)',
                    padding: '2px 8px',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>
                    {tag}
                  </span>
                ))}
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
