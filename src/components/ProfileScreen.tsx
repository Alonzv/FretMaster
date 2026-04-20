import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import i18n from '../i18n'
import type { User } from '@supabase/supabase-js'
import type { CategoryId, CategoryProgress } from '../lib/challenges/types'
import { CATEGORIES } from '../lib/challenges/categories'
import { totalXP } from '../lib/challenges/progress'
import type { AppSettings } from '../lib/settings'
import { requestNotificationPermission } from '../lib/settings'
import AvatarCropModal from './AvatarCropModal'

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
  settings: AppSettings
  onSettingsChange: (patch: Partial<AppSettings>) => void
  onClose: () => void
}

const LEVEL_LABELS: Record<string, { he: string; en: string }> = {
  beginner:         { he: 'מתחיל',        en: 'Beginner' },
  intermediate_low: { he: 'מתחיל-בינוני', en: 'Early Intermediate' },
  intermediate:     { he: 'בינוני',        en: 'Intermediate' },
  advanced:         { he: 'מתקדם',         en: 'Advanced' },
}

export default function ProfileScreen({ user, profile, progress, settings, onSettingsChange, onClose }: Props) {
  const isHe = i18n.language === 'he'
  const fileRef = useRef<HTMLInputElement>(null)
  const [notifState, setNotifState] = useState<'idle' | 'denied'>('idle')
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const displayName = profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()
  const levelInfo = LEVEL_LABELS[profile?.level || '']

  // Real stats
  const xp = totalXP(progress)
  const availableCats = CATEGORIES.filter(c => c.phase === 1 && c.generator)
  const sessions = Object.values(progress).reduce((s, p) => s + p.sessionsPlayed, 0)
  const totalAnswered = Object.values(progress).reduce((s, p) => s + p.totalAnswered, 0)
  const totalCorrect  = Object.values(progress).reduce((s, p) => s + p.totalCorrect, 0)
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  const handleAvatarClick = () => fileRef.current?.click()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so the same file can be re-selected after cancel
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = ev => {
      if (ev.target?.result) setCropSrc(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCropConfirm = (dataUrl: string) => {
    onSettingsChange({ avatar: dataUrl })
    setCropSrc(null)
  }

  const handleNotifToggle = async () => {
    if (settings.notifications) {
      onSettingsChange({ notifications: false })
      return
    }
    const granted = await requestNotificationPermission()
    if (granted) {
      onSettingsChange({ notifications: true })
    } else {
      setNotifState('denied')
    }
  }

  const changeLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('fm_lang', code)
  }

  return (
    <>
    {cropSrc && (
      <AvatarCropModal
        imageSrc={cropSrc}
        onConfirm={handleCropConfirm}
        onCancel={() => setCropSrc(null)}
        isHe={isHe}
      />
    )}
    <div style={{ display: cropSrc ? 'none' : undefined }}>
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: isHe ? 'flex-start' : 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(440px, 100%)',
          height: '100vh',
          background: 'var(--fm-bg-deep)',
          overflowY: 'auto',
          direction: isHe ? 'rtl' : 'ltr',
          boxShadow: isHe ? '8px 0 32px rgba(0,0,0,0.2)' : '-8px 0 32px rgba(0,0,0,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: '1px solid var(--fm-border)',
          background: 'var(--fm-bg-card)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--fm-text)', margin: 0 }}>
            {isHe ? 'הפרופיל שלי' : 'My Profile'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fm-text-muted)', cursor: 'pointer',
              background: 'var(--fm-bg-input)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Avatar + info ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Clickable avatar */}
            <div
              onClick={handleAvatarClick}
              style={{
                width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
                backgroundColor: settings.avatar ? 'transparent' : 'var(--fm-primary)',
                backgroundImage: settings.avatar ? `url("${settings.avatar}")` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: 'white',
                cursor: 'pointer', position: 'relative',
                boxShadow: '0 0 0 3px var(--fm-primary-bg), 0 0 0 4px var(--fm-primary)',
              }}
              title={isHe ? 'שנה תמונה' : 'Change photo'}
            >
              {!settings.avatar && initials}
              {/* Camera overlay */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm7-12h-2.17L15 1H9L7.17 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                </svg>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--fm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
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

          {/* ── Summary stats ─────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <StatCard label="XP" value={xp.toString()} highlight />
            <StatCard label={isHe ? 'סשנים' : 'Sessions'} value={sessions.toString()} />
            <StatCard label={isHe ? 'דיוק' : 'Accuracy'} value={`${overallAccuracy}%`} />
          </div>

          {/* ── Per-category progress ─────────────────────────────────────── */}
          <Section title={isHe ? 'פירוט לפי קטגוריה' : 'By category'} isHe={isHe}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {availableCats.map(cat => {
                const cp = progress[cat.id]
                const accuracy = cp.totalAnswered > 0 ? (cp.totalCorrect / cp.totalAnswered) * 100 : 0
                const everPlayed = cp.sessionsPlayed > 0
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fm-text)' }}>
                        {isHe ? cat.titleHe : cat.titleEn}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: everPlayed ? 'var(--fm-primary)' : 'var(--fm-text-muted)', whiteSpace: 'nowrap' }}>
                        {everPlayed ? `${Math.round(accuracy)}%` : '—'}
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
          </Section>

          {/* ── Appearance ───────────────────────────────────────────────── */}
          <Section title={isHe ? 'מראה' : 'Appearance'} isHe={isHe}>
            <ToggleRow
              label={isHe ? 'מצב לילה' : 'Dark mode'}
              sub={isHe ? 'רקע כהה נוח לעיניים' : 'Easy on the eyes in low light'}
              checked={settings.theme === 'dark'}
              onChange={v => onSettingsChange({ theme: v ? 'dark' : 'light' })}
            />
            <Divider />
            <ToggleRow
              label={isHe ? 'טקסט גדול' : 'Large text'}
              sub={isHe ? 'מגדיל את הגופן בכל האפליקציה' : 'Increases font size throughout the app'}
              checked={settings.fontSize === 'large'}
              onChange={v => onSettingsChange({ fontSize: v ? 'large' : 'normal' })}
            />
          </Section>

          {/* ── Language ─────────────────────────────────────────────────── */}
          <Section title={isHe ? 'שפה' : 'Language'} isHe={isHe}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ code: 'he', label: 'עברית' }, { code: 'en', label: 'English' }].map(l => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  style={{
                    flex: 1, padding: '11px',
                    borderRadius: 10,
                    border: `2px solid ${i18n.language === l.code ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
                    background: i18n.language === l.code ? 'var(--fm-primary-bg)' : 'var(--fm-bg-input)',
                    color: i18n.language === l.code ? 'var(--fm-primary)' : 'var(--fm-text)',
                    fontWeight: i18n.language === l.code ? 700 : 500,
                    fontSize: 14, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Notifications ────────────────────────────────────────────── */}
          <Section title={isHe ? 'התראות' : 'Notifications'} isHe={isHe}>
            <ToggleRow
              label={isHe ? 'תזכורת אתגר יומי' : 'Daily challenge reminder'}
              sub={notifState === 'denied'
                ? (isHe ? 'ההרשאה נדחתה — יש לאפשר בהגדרות הדפדפן' : 'Permission denied — enable in browser settings')
                : (isHe ? 'קבל התראה כשהאתגר היומי זמין' : 'Get notified when your daily challenge is ready')}
              checked={settings.notifications}
              onChange={handleNotifToggle}
              warning={notifState === 'denied'}
            />
          </Section>

          {/* ── Audio & Microphone ───────────────────────────────────────── */}
          <Section title={isHe ? 'אודיו' : 'Audio'} isHe={isHe}>
            <ToggleRow
              label={isHe ? 'השמעת צלילים' : 'Play audio'}
              sub={isHe ? 'בתרגילי אימון אוזן — ישמיע צלילים ואקורדים (בקרוב)' : 'Play notes and chords in ear training exercises (coming soon)'}
              checked={settings.audioEnabled}
              onChange={v => onSettingsChange({ audioEnabled: v })}
            />
            <Divider />
            <ToggleRow
              label={isHe ? 'האזנה לגיטרה' : 'Listen to my guitar'}
              sub={isHe ? 'המחשב ישמע מה שאתה מנגן דרך המיקרופון (בקרוב)' : 'The app listens to what you play via microphone (coming soon)'}
              checked={settings.micEnabled}
              onChange={v => onSettingsChange({ micEnabled: v })}
            />
          </Section>

          {/* ── Sign out ─────────────────────────────────────────────────── */}
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              width: '100%', padding: '12px',
              borderRadius: 10,
              border: '1.5px solid var(--fm-coral)',
              background: 'transparent',
              color: 'var(--fm-coral)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--fm-coral-faint)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {isHe ? 'התנתקות' : 'Sign Out'}
          </button>

        </div>
      </div>
    </div>
    </div>
    </>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, isHe, children }: { title: string; isHe: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--fm-bg-card)',
      border: '1px solid var(--fm-border)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: 'var(--fm-text-muted)',
        textTransform: 'uppercase', letterSpacing: 0.8,
        padding: '12px 18px 10px',
        textAlign: isHe ? 'right' : 'left',
      }}>
        {title}
      </div>
      <div style={{ padding: '4px 18px 16px' }}>
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--fm-border)', margin: '12px 0' }} />
}

function ToggleRow({
  label, sub, checked, onChange, warning,
}: {
  label: string
  sub?: string
  checked: boolean
  onChange: (v: boolean) => void
  warning?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fm-text)' }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 12, color: warning ? 'var(--fm-coral)' : 'var(--fm-text-muted)', marginTop: 2, lineHeight: 1.4 }}>
            {sub}
          </div>
        )}
      </div>
      {/* iOS-style toggle */}
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13, flexShrink: 0,
          background: checked ? 'var(--fm-primary)' : 'var(--fm-border)',
          position: 'relative', cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          transition: 'left 0.2s ease',
        }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      textAlign: 'center', padding: '14px 10px',
      background: highlight ? 'var(--fm-primary-bg)' : 'var(--fm-bg-card)',
      border: `1px solid ${highlight ? 'var(--fm-primary)' : 'var(--fm-border)'}`,
      borderRadius: 14,
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: highlight ? 'var(--fm-primary)' : 'var(--fm-text)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fm-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
    </div>
  )
}
