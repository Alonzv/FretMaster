import { useState } from 'react'
import { supabase } from '../lib/supabase'
import i18n from '../i18n'
import type { User } from '@supabase/supabase-js'

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
  onClose: () => void
}

const PROGRESS_ITEMS = [
  { labelHe: 'למידה',      labelEn: 'Learning',  pct: 15 },
  { labelHe: 'המסע שלך',   labelEn: 'Journey',   pct: 8  },
  { labelHe: 'אימון',      labelEn: 'Practice',  pct: 0  },
  { labelHe: 'תאוריה',     labelEn: 'Theory',    pct: 0  },
]

const LEVEL_LABELS: Record<string, { he: string; en: string }> = {
  beginner:         { he: 'מתחיל',         en: 'Beginner' },
  intermediate_low: { he: 'מתחיל-בינוני',  en: 'Early Intermediate' },
  intermediate:     { he: 'בינוני',         en: 'Intermediate' },
  advanced:         { he: 'מתקדם',          en: 'Advanced' },
}

export default function ProfileScreen({ user, profile, onClose }: Props) {
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
              fontSize: 20, fontWeight: 700, color: 'var(--fm-white)',
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
                  border: '1px solid var(--fm-primary-soft)',
                  borderRadius: 6, padding: '2px 8px',
                }}>
                  {isHe ? levelInfo.he : levelInfo.en}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { labelHe: 'אתגרים', labelEn: 'Challenges', value: '0' },
              { labelHe: 'שיעורים', labelEn: 'Lessons',   value: '0' },
              { labelHe: 'XP',     labelEn: 'XP',          value: '0' },
            ].map(stat => (
              <div key={stat.labelEn} className="fm-card" style={{ textAlign: 'center', padding: '14px 10px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fm-primary)', marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fm-text-muted)' }}>
                  {isHe ? stat.labelHe : stat.labelEn}
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="fm-card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isHe ? 'התקדמות' : 'Progress'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PROGRESS_ITEMS.map(item => (
                <div key={item.labelEn}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: 'var(--fm-text)' }}>
                      {isHe ? item.labelHe : item.labelEn}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.pct > 0 ? 'var(--fm-primary)' : 'var(--fm-text-dim)' }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--fm-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${item.pct}%`,
                      background: 'var(--fm-primary)', borderRadius: 3,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="fm-card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
