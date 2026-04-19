import { useState } from 'react'
import { supabase } from '../lib/supabase'
import i18n from '../i18n'
import type { User } from '@supabase/supabase-js'
import type { CategoryId, CategoryProgress } from '../lib/challenges/types'
import { CATEGORIES } from '../lib/challenges/categories'
import { totalXP } from '../lib/challenges/progress'

interface UserProfile {
  name: string
  level: string
  lang: string
  styles: string[]
  goals: string[]
  daily_time: string
}

interface Props {
  user: User
  profile: UserProfile | null
  progress: Record<CategoryId, CategoryProgress>
  onClose: () => void
}

const LEVEL_LABELS: Record<string, { he: string; en: string }> = {
  beginner:         { he: 'מתחיל',         en: 'Beginner' },
  intermediate_low: { he: 'מתחיל-בינוני',  en: 'Early Intermediate' },
  intermediate:     { he: 'בינוני',         en: 'Intermediate' },
  advanced:         { he: 'מתקדם',          en: 'Advanced' },
}

export default function ProfileScreen({ user, profile, progress, onClose }: Props) {
  const isHe = i18n.language === 'he'
  const [lang, setLang] = useState(i18n.language)

  const changeLang = (code: string) => {
    setLang(code)
    i18n.changeLanguage(code)
    localStorage.setItem('fm_lang', code)
  }

  const displayName = profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()
  const levelInfo = LEVEL_LABELS[profile?.level || '']

  // Real aggregate stats from challenge progress.
  const xp = totalXP(progress)
  const availableCats = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  const sessions = Object.values(progress).reduce((s, p) => s + p.sessionsPlayed, 0)
  const totalAnswered = Object.values(progress).reduce((s, p) => s + p.totalAnswered, 0)
  const totalCorrect  = Object.values(progress).reduce((s, p) => s + p.totalCorrect, 0)
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    }}
      onClick={onClose}
    >
      <div
        style={{
          width: 420,
          maxWidth: '100%',
          height: '100vh',
          background: 'var(--fm-bg-deep)',
          overflowY: 'auto',
          direction: isHe ? 'rtl' : 'ltr',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--fm-border)',
          background: 'var(--fm-bg-card)',
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--fm-text)', margin: 0 }}>
            {isHe ? 'הפרופיל שלי' : 'My Profile'}
          </h2>
          <button onClick={onClose} style={{ fontSize: 20, color: 'var(--fm-text-muted)', padding: 4, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Avatar + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--fm-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: 'white',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--fm-text)' }}>{displayName}</div>
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 2 }}>{user.email}</div>
              {levelInfo && (
                <div style={{
                  display: 'inline-block', marginTop: 6,
                  fontSize: 12, fontWeight: 600,
                  color: 'var(--fm-primary)',
                  background: 'var(--fm-primary-bg)',
                  border: '1px solid var(--fm-primary)',
                  borderRadius: 6, padding: '2px 8px',
                }}>
                  {isHe ? levelInfo.he : levelInfo.en}
                </div>
              )}
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <StatCard label={isHe ? 'XP' : 'XP'} value={xp.toString()} highlight />
            <StatCard label={isHe ? 'סשנים' : 'Sessions'} value={sessions.toString()} />
            <StatCard label={isHe ? 'דיוק' : 'Accuracy'} value={`${overallAccuracy}%`} />
          </div>

          {/* Per-category breakdown */}
          <div className="fm-card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isHe ? 'פירוט לפי קטגוריה' : 'By category'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {availableCats.map(cat => {
                const cp = progress[cat.id]
                const accuracy = cp.totalAnswered > 0 ? (cp.totalCorrect / cp.totalAnswered) * 100 : 0
                const everPlayed = cp.sessionsPlayed > 0

                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fm-text)' }}>
                        {isHe ? cat.titleHe : cat.titleEn}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: everPlayed ? 'var(--fm-primary)' : 'var(--fm-text-muted)' }}>
                        {everPlayed ? `${Math.round(accuracy)}%` : (isHe ? '—' : '—')}
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'var(--fm-bg-input)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.max(accuracy, everPlayed ? 3 : 0)}%`,
                        background: 'var(--fm-primary)',
                        borderRadius: 999,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Settings */}
          <div className="fm-card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-muted)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isHe ? 'הגדרות' : 'Settings'}
            </h3>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginBottom: 8 }}>
                {isHe ? 'שפה' : 'Language'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ code: 'he', label: 'עברית' }, { code: 'en', label: 'English' }].map(l => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    style={{
                      flex: 1, padding: '10px',
                      borderRadius: 8,
                      border: `2px solid ${lang === l.code ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
                      background: lang === l.code ? 'var(--fm-primary-bg)' : 'var(--fm-bg-input)',
                      color: lang === l.code ? 'var(--fm-primary)' : 'var(--fm-text)',
                      fontWeight: lang === l.code ? 700 : 400,
                      fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                width: '100%', padding: '12px',
                borderRadius: 8,
                border: '1.5px solid var(--fm-coral)',
                background: 'transparent',
                color: 'var(--fm-coral)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {isHe ? 'התנתקות' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="fm-card"
      style={{
        textAlign: 'center', padding: '14px 10px',
        background: highlight ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
        border: `1px solid ${highlight ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: highlight ? 'var(--fm-primary)' : 'var(--fm-text)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
    </div>
  )
}
