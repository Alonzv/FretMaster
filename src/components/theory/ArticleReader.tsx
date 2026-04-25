import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theoryContent, type ArticleSection } from '../../data/theoryContent'
import IntervalExplorer    from './IntervalExplorer'
import TriadConstructor   from './TriadConstructor'
import MajorMinorFlip     from './MajorMinorFlip'
import VoicingVisualizer  from './VoicingVisualizer'

interface Props {
  articleId: string
  onBack: () => void
  onTagClick?: (tag: string) => void
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBack({ rtl }: { rtl: boolean }) {
  // Points right in RTL (toward list), left in LTR
  return rtl ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
    </svg>
  )
}

function IconBookOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
    </svg>
  )
}

function IconFretboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
  )
}

function IconQuote() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  )
}

// ── Section renderers ─────────────────────────────────────────────────────────

function ParagraphSection({ section }: { section: ArticleSection }) {
  return (
    <div style={{ marginBottom: 48 }}>
      {section.title && (
        <h2 style={{
          fontFamily: 'var(--fm-font-display)',
          fontSize: 20, fontWeight: 700,
          color: '#1A1A2E', margin: '0 0 18px',
          letterSpacing: '0.01em', lineHeight: 1.35,
        }}>
          {section.title}
        </h2>
      )}
      <p style={{
        fontFamily: 'var(--fm-font-body)',
        fontSize: 18, fontWeight: 400,
        color: '#2A2820', lineHeight: 1.85, margin: 0,
        whiteSpace: 'pre-line',
      }}>
        {section.content}
      </p>
    </div>
  )
}

function HighlightSection({ section, accent }: { section: ArticleSection; accent: 'blue' | 'sand' }) {
  const bg      = accent === 'blue' ? 'rgba(43,80,232,0.05)' : '#F5F2EB'
  const border  = accent === 'blue' ? '#2B50E8' : '#C8B870'
  const iconBg  = accent === 'blue' ? 'rgba(43,80,232,0.12)' : 'rgba(200,184,112,0.20)'
  const iconCol = accent === 'blue' ? '#2B50E8' : '#8A7840'
  const Icon    = accent === 'blue' ? IconBookOpen : IconFretboard

  return (
    <div style={{
      marginBottom: 48, background: bg,
      border: `1px solid ${border}`,
      borderRight: `4px solid ${border}`,
      padding: '28px 28px 28px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: section.title ? 16 : 0 }}>
        <div style={{
          width: 30, height: 30, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: iconCol }}><Icon /></span>
        </div>
        {section.title && (
          <h2 style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 18, fontWeight: 700,
            color: '#1A1A2E', margin: 0,
            letterSpacing: '0.01em', lineHeight: 1.35,
          }}>
            {section.title}
          </h2>
        )}
      </div>
      <p style={{
        fontFamily: 'var(--fm-font-body)',
        fontSize: 18, fontWeight: 400,
        color: '#2A2820', lineHeight: 1.85, margin: 0,
        whiteSpace: 'pre-line',
      }}>
        {section.content}
      </p>
    </div>
  )
}

function ExampleSection({ section }: { section: ArticleSection }) {
  const entries = section.content.split('\n').filter(Boolean)

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 20, paddingBottom: 14,
        borderBottom: '2px solid #E83020',
      }}>
        <div style={{
          width: 32, height: 32, background: '#E83020',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#FAF8F0' }}><IconQuote /></span>
        </div>
        {section.title && (
          <h2 style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 18, fontWeight: 700,
            color: '#1A1A2E', margin: 0, letterSpacing: '0.01em',
          }}>
            {section.title}
          </h2>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {entries.map((entry, i) => {
          const colonIdx  = entry.indexOf(':')
          const hasTitle  = colonIdx !== -1
          const entryTitle = hasTitle ? entry.slice(0, colonIdx).trim() : ''
          const entryBody  = hasTitle ? entry.slice(colonIdx + 1).trim() : entry
          return (
            <div key={i} style={{
              borderRight: '5px solid #E83020',
              paddingRight: 20, paddingLeft: 16,
              paddingTop: 16, paddingBottom: 16,
              background: 'rgba(232,48,32,0.04)',
            }}>
              {entryTitle && (
                <div style={{
                  fontFamily: 'var(--fm-font-display)',
                  fontSize: 15, fontWeight: 700,
                  color: '#E83020', marginBottom: 8,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {entryTitle}
                </div>
              )}
              <p style={{
                fontFamily: 'var(--fm-font-body)',
                fontSize: 17, fontWeight: 400,
                color: '#3A3020', lineHeight: 1.8,
                margin: 0, fontStyle: 'italic',
              }}>
                {entryBody}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Article tag chip (clickable) ──────────────────────────────────────────────

function ArticleTagChip({ tag, onClick }: { tag: string; onClick?: (tag: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const interactive = !!onClick

  const bg     = hovered && interactive ? '#1A1A2E' : 'transparent'
  const color  = hovered && interactive ? '#FAF8F0' : '#1A1A2E'
  const border = hovered && interactive ? '#1A1A2E' : '#1A1A2E'

  return (
    <span
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onClick(tag) : undefined}
      onKeyDown={interactive ? e => { if (e.key === 'Enter' || e.key === ' ') onClick(tag) } : undefined}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      style={{
        fontFamily: 'var(--fm-font-display)',
        fontSize: 11, fontWeight: 700,
        color, background: bg,
        border: `1.5px solid ${border}`,
        padding: '4px 10px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        borderRadius: 0,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'color 0.12s, background 0.12s',
        userSelect: 'none',
        display: 'inline-block',
      }}
    >
      {tag}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ArticleReader({ articleId, onBack, onTagClick }: Props) {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'
  const lang = isHe ? 'he' : 'en'
  const dir  = isHe ? 'rtl' : 'ltr'

  const article   = theoryContent[articleId]
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const max = scrollHeight - clientHeight
      setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (!article) {
    return (
      <div dir={dir} style={{ padding: 40, color: '#1A1A2E', fontFamily: 'var(--fm-font-body)' }}>
        {isHe ? 'מאמר לא נמצא.' : 'Article not found.'}
      </div>
    )
  }

  const content = article[lang]

  return (
    <div
      dir={dir}
      style={{
        position: 'absolute', inset: 0,
        background: '#F7F4EC',
        display: 'flex', flexDirection: 'column',
        zIndex: 10,
        fontFamily: 'var(--fm-font-body)',
      }}
    >
      {/* ── Sticky top bar ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: '#F7F4EC',
        borderBottom: '1px solid #D8D0BC',
        flexShrink: 0,
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: '#E0D8C8', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: '#2B50E8',
            transition: 'width 0.1s linear',
          }} />
        </div>

        {/* Nav row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px' }}>
          <button
            onClick={onBack}
            aria-label={isHe ? 'חזור' : 'Back'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: isHe ? '6px 10px 6px 14px' : '6px 14px 6px 10px',
              background: 'transparent',
              border: '1px solid #C0B898',
              color: '#1A1A2E',
              fontFamily: 'var(--fm-font-display)',
              fontSize: 13, fontWeight: 600,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#EDE8DC')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <IconBack rtl={isHe} />
            <span>{isHe ? 'חזור' : 'Back'}</span>
          </button>

          <span style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 11, fontWeight: 600,
            color: '#8A7E68',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
          }}>
            {isHe ? 'ספריית תיאוריה' : 'Theory Library'}
          </span>
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Article header */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '52px 32px 0' }}>
          <div style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 11, fontWeight: 700,
            color: '#2B50E8',
            textTransform: 'uppercase', letterSpacing: '0.22em',
            marginBottom: 20,
          }}>
            {isHe ? 'תיאוריה מוזיקלית' : 'Music Theory'}
          </div>

          <h1 style={{
            fontFamily: 'var(--fm-font-display)',
            fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 800,
            color: '#0F0D08', margin: '0 0 16px',
            lineHeight: 1.12, letterSpacing: '-0.01em',
          }}>
            {content.title}
          </h1>

          <p style={{
            fontFamily: 'var(--fm-font-body)',
            fontSize: 18, fontWeight: 400,
            color: '#5A5040', lineHeight: 1.6,
            margin: '0 0 28px',
          }}>
            {content.subtitle}
          </p>

          {/* Tags — clickable for filtering */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
            {content.tags.map((tag, i) => (
              <ArticleTagChip key={i} tag={tag} onClick={onTagClick} />
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: 2,
            background: isHe
              ? 'linear-gradient(to left, #2B50E8 0%, #1A1A2E 40%, transparent 100%)'
              : 'linear-gradient(to right, #2B50E8 0%, #1A1A2E 40%, transparent 100%)',
            marginBottom: 52,
          }} />
        </div>

        {/* Sections */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px 80px' }}>
          {content.sections.map((section, i) => {
            switch (section.type) {
              case 'paragraph':
                return <ParagraphSection key={i} section={section} />
              case 'highlight':
                return <HighlightSection key={i} section={section} accent="blue" />
              case 'fretboard':
                return <HighlightSection key={i} section={section} accent="sand" />
              case 'example':
                return <ExampleSection key={i} section={section} />
              case 'interactive':
                return (
                  <div key={i} style={{ marginBottom: 48 }}>
                    {section.content === 'interval-explorer'   && <IntervalExplorer   isHe={isHe} />}
                    {section.content === 'triad-construction'  && <TriadConstructor   isHe={isHe} />}
                    {section.content === 'major-minor-flip'    && <MajorMinorFlip     isHe={isHe} />}
                    {section.content === 'voicing-visualizer'  && <VoicingVisualizer  isHe={isHe} />}
                  </div>
                )
              default:
                return null
            }
          })}

          {/* End marker */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            marginTop: 16, paddingTop: 32,
            borderTop: '1px solid #D0C8B4',
          }}>
            <div style={{ width: 32, height: 2, background: '#2B50E8', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--fm-font-display)',
              fontSize: 11, fontWeight: 700,
              color: '#8A7E68',
              textTransform: 'uppercase', letterSpacing: '0.2em',
            }}>
              {isHe ? 'סוף המאמר' : 'End of Article'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
