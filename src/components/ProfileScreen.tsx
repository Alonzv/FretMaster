import { useState } from 'react'
import { supabase } from '../lib/supabase'
import i18n from '../i18n'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User
  onClose: () => void
}

const PROGRESS_ITEMS = [
  { labelHe: 'למידה', labelEn: 'Learning', emoji: '📖', pct: 15 },
  { labelHe: 'המסע שלך', labelEn: 'Your Journey', emoji: '🗺️', pct: 8 },
  { labelHe: 'אימון', labelEn: 'Practice', emoji: '🎸', pct: 0 },
  { labelHe: 'תאוריה', labelEn: 'Theory', emoji: '🎼', pct: 0 },
]

const SETTINGS_LANGS = [
  { code: 'he', label: 'עברית' },
  { code: 'en', label: 'English' },
]

export default function ProfileScreen({ user, onClose }: Props) {
  const isHe = i18n.language === 'he'
  const [lang, setLang] = useState(i18n.language)

  const changeLang = (code: string) => {
    setLang(code)
    i18n.changeLanguage(code)
    localStorage.setItem('fm_lang', code)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'גיטריסט'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--fm-bg-deep)',
      overflowY: 'auto',
      maxWidth: 480,
      margin: '0 auto',
    }}
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--fm-border)',
        background: 'var(--fm-bg-card)',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--fm-text)', margin: 0 }}>
          {isHe ? 'הפרופיל שלי' : 'My Profile'}
        </h2>
        <button
          onClick={onClose}
          style={{ fontSize: 24, color: 'var(--fm-text-muted)', padding: 4 }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--fm-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: 'var(--fm-white)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--fm-text)' }}>{displayName}</div>
            <div style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>{user.email}</div>
            <div style={{ fontSize: 12, color: 'var(--fm-secondary)', marginTop: 4, fontWeight: 600 }}>
              🔥 {isHe ? '0 ימים רצופים' : '0 day streak'}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="fm-card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 16 }}>
            {isHe ? 'ההתקדמות שלי' : 'My Progress'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PROGRESS_ITEMS.map(item => (
              <div key={item.labelEn}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: 'var(--fm-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{item.emoji}</span>
                    <span>{isHe ? item.labelHe : item.labelEn}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.pct > 0 ? 'var(--fm-primary)' : 'var(--fm-text-dim)' }}>
                    {item.pct}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--fm-bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.pct}%`,
                    background: item.pct > 0 ? 'var(--fm-primary)' : 'transparent',
                    borderRadius: 4,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { labelHe: 'אתגרים', labelEn: 'Challenges', value: '0', emoji: '⚡' },
            { labelHe: 'שיעורים', labelEn: 'Lessons', value: '0', emoji: '📖' },
            { labelHe: 'XP', labelEn: 'XP', value: '0', emoji: '🏆' },
          ].map(stat => (
            <div key={stat.labelEn} className="fm-card" style={{ textAlign: 'center', padding: 12 }}>
              <div style={{ fontSize: 22 }}>{stat.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fm-primary)', margin: '4px 0 2px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fm-text-muted)' }}>
                {isHe ? stat.labelHe : stat.labelEn}
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="fm-card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 16 }}>
            {isHe ? 'הגדרות' : 'Settings'}
          </h3>

          {/* Language */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginBottom: 8 }}>
              {isHe ? 'שפה' : 'Language'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {SETTINGS_LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 10,
                    border: `2px solid ${lang === l.code ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
                    background: lang === l.code ? 'var(--fm-primary-bg)' : 'var(--fm-bg-input)',
                    color: lang === l.code ? 'var(--fm-primary)' : 'var(--fm-text)',
                    fontWeight: lang === l.code ? 700 : 400,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={signOut}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: '1.5px solid var(--fm-coral)',
              background: 'var(--fm-coral-faint)',
              color: 'var(--fm-coral)',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isHe ? 'התנתק' : 'Sign Out'}
          </button>
        </div>

      </div>
    </div>
  )
}
