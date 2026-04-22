import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { OnboardingData } from '../../store/onboarding'

const SOCIAL_PROVIDERS = [
  {
    provider: 'google' as const,
    label: 'Google',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`,
  },
  {
    provider: 'apple' as const,
    label: 'Apple',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.24.74 3.01.8.88-.17 1.79-.88 3.08-.94 1.95-.07 3.41.8 4.23 2.1-3.88 2.34-3.09 7.47.68 8.92zm-3.44-17c.25 1.73-1.37 3.39-3.04 3.26-.25-1.65 1.29-3.38 3.04-3.26z"/></svg>`,
  },
  {
    provider: 'facebook' as const,
    label: 'Facebook',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  },
  {
    provider: 'twitter' as const,
    label: 'X',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
]

interface Props {
  onboardingData: OnboardingData
  onComplete: (data: OnboardingData) => void
}

export default function AuthScreen({ onboardingData, onComplete }: Props) {
  const { t } = useTranslation()
  const isRTL = onboardingData.lang === 'he'
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        const userId = data.user?.id
        if (userId) {
          // Best-effort — don't block auth if profiles table not ready
          try {
            await supabase.from('profiles').upsert({
              id: userId,
              name: onboardingData.name,
              lang: onboardingData.lang,
              level: onboardingData.level,
              styles: onboardingData.styles,
              guitarists: onboardingData.guitarists,
              goals: onboardingData.goals,
              daily_time: onboardingData.dailyTime,
            })
          } catch { /* ignore */ }
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      }
      onComplete(onboardingData)
    } catch (e: unknown) {
      setError(t('auth.error'))
      void e // swallow — user sees error message above
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fm-onboard" dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--fm-primary)', fontFamily: 'var(--fm-font-display)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 9 }} className="fm-logo-glow">
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true">
            <rect y="0" width="17" height="2.5" fill="currentColor"/>
            <rect y="5.25" width="17" height="2.5" fill="currentColor"/>
            <rect y="10.5" width="17" height="2.5" fill="currentColor"/>
          </svg>
          FretMaster
        </span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
        {mode === 'signup' ? t('auth.signUp') : t('auth.signIn')}
      </h1>
      <p style={{ color: 'var(--fm-text-muted)', marginBottom: 32, fontSize: 15 }}>
        {mode === 'signup'
          ? (isRTL ? `היי ${onboardingData.name}! ניצור לך חשבון` : `Hi ${onboardingData.name}! Let's create your account`)
          : (isRTL ? 'ברוך הבא בחזרה' : 'Welcome back')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: 'var(--fm-text)' }}>
            {t('auth.email')}
          </label>
          <input
            className="fm-input"
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            dir="ltr"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: 'var(--fm-text)' }}>
            {t('auth.password')}
          </label>
          <input
            className="fm-input"
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            dir="ltr"
          />
        </div>

        {error && (
          <div style={{ color: 'var(--fm-coral)', fontSize: 14, textAlign: 'center' }}>{error}</div>
        )}

        <button
          className="fm-btn-primary"
          onClick={submit}
          disabled={loading || !email || password.length < 6}
          style={{ marginTop: 8 }}
        >
          {loading ? t('auth.loading') : (mode === 'signup' ? t('auth.signUp') : t('auth.signIn'))}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--fm-border)' }} />
          <span style={{ color: 'var(--fm-text-dim)', fontSize: 13 }}>{isRTL ? 'או' : 'or'}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--fm-border)' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SOCIAL_PROVIDERS.map(({ provider, label, svg }) => (
            <button
              key={provider}
              onClick={() => supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin },
              })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px 16px',
                borderRadius: 10,
                border: '1.5px solid var(--fm-border)',
                background: 'var(--fm-bg-input)',
                color: 'var(--fm-text)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.93)')}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center' }}
                dangerouslySetInnerHTML={{ __html: svg }} />
              <span>{isRTL ? `המשך עם ${label}` : `Continue with ${label}`}</span>
            </button>
          ))}
        </div>

        <button
          className="fm-btn-ghost"
          onClick={() => setMode(m => m === 'signup' ? 'signin' : 'signup')}
          style={{ textAlign: 'center' }}
        >
          {mode === 'signup' ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
          <span style={{ color: 'var(--fm-primary)', fontWeight: 600 }}>
            {mode === 'signup' ? t('auth.signIn') : t('auth.signUp')}
          </span>
        </button>
      </div>
    </div>
  )
}
