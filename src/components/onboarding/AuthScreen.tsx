import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { OnboardingData } from '../../store/onboarding'

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
        const { error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        // Save profile after signup
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            name: onboardingData.name,
            lang: onboardingData.lang,
            level: onboardingData.level,
            styles: onboardingData.styles,
            guitarists: onboardingData.guitarists,
            goals: onboardingData.goals,
            daily_time: onboardingData.dailyTime,
          })
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      }
      onComplete(onboardingData)
    } catch (e: unknown) {
      setError(t('auth.error'))
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fm-onboard" dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--fm-primary)' }}>🎸 FretMaster</span>
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
