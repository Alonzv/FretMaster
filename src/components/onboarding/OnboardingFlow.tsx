import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import type { OnboardingData } from '../../store/onboarding'
import { emptyOnboarding, GUITARISTS } from '../../store/onboarding'
import AuthScreen from './AuthScreen'

const TOTAL_STEPS = 5

interface Props {
  onComplete: (data: OnboardingData) => void
}

function Dots({ step }: { step: number }) {
  return (
    <div className="fm-dots">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={`fm-dot${i === step ? ' active' : ''}`} />
      ))}
    </div>
  )
}

function ChipGroup({ options, selected, onToggle }: {
  options: { id: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => (
        <button
          key={o.id}
          className={`fm-chip${selected.includes(o.id) ? ' selected' : ''}`}
          onClick={() => onToggle(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function OnboardingFlow({ onComplete }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(emptyOnboarding)
  const [showAuth, setShowAuth] = useState(false)

  const isRTL = data.lang === 'he'

  const toggleLang = (lang: 'he' | 'en') => {
    setData(d => ({ ...d, lang }))
    i18n.changeLanguage(lang)
    localStorage.setItem('fm_lang', lang)
  }

  const toggleMulti = (field: 'styles' | 'guitarists' | 'goals', id: string) => {
    setData(d => ({
      ...d,
      [field]: d[field].includes(id) ? d[field].filter(x => x !== id) : [...d[field], id],
    }))
  }

  const canNext = () => {
    if (step === 0) return data.name.trim().length > 0
    if (step === 1) return data.level !== ''
    if (step === 2) return data.styles.length > 0
    if (step === 3) return data.goals.length > 0
    if (step === 4) return data.dailyTime !== ''
    return false
  }

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
    else setShowAuth(true)
  }

  const back = () => setStep(s => s - 1)

  const levels = ['beginner', 'intermediate_low', 'intermediate', 'advanced']
  const styleKeys = ['rock', 'blues', 'jazz', 'classical', 'metal', 'pop', 'folk', 'funk', 'country', 'flamenco']
  const goalKeys = ['solos', 'accompaniment', 'theory', 'fills', 'improv', 'fingerpicking', 'songwriting']
  const timeKeys = ['t5', 't15', 't30', 't60']

  if (showAuth) {
    return <AuthScreen onboardingData={data} onComplete={onComplete} />
  }

  return (
    <div className="fm-onboard" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--fm-primary)' }}>🎸 FretMaster</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['he', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => toggleLang(l)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: data.lang === l ? 'var(--fm-primary)' : 'var(--fm-bg-input)',
                color: data.lang === l ? 'var(--fm-white)' : 'var(--fm-text-muted)',
                border: '1px solid var(--fm-border)',
              }}
            >
              {l === 'he' ? 'עב' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Dots */}
      <Dots step={step} />

      {/* Content */}
      <div style={{ flex: 1, marginTop: 32 }}>

        {/* Step 0 — Name */}
        {step === 0 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
              {t('onboard.welcome')}
            </h1>
            <p style={{ color: 'var(--fm-text-muted)', marginBottom: 32, fontSize: 16 }}>
              {t('onboard.welcomeSub')}
            </p>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--fm-text)' }}>
              {t('onboard.yourName')}
            </label>
            <input
              className="fm-input"
              placeholder={t('onboard.namePlaceholder')}
              value={data.name}
              onChange={e => setData(d => ({ ...d, name: e.target.value }))}
              autoFocus
            />
          </div>
        )}

        {/* Step 1 — Level */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
              {t('onboard.levelTitle')}
            </h1>
            <p style={{ color: 'var(--fm-text-muted)', marginBottom: 24, fontSize: 15 }}>
              {t('onboard.levelSub')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {levels.map(lv => (
                <button
                  key={lv}
                  className={`fm-level-card${data.level === lv ? ' selected' : ''}`}
                  onClick={() => setData(d => ({ ...d, level: lv }))}
                >
                  <div style={{ fontWeight: 700, fontSize: 16, color: data.level === lv ? 'var(--fm-primary)' : 'var(--fm-text)' }}>
                    {t(`onboard.levels.${lv}`)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', marginTop: 3 }}>
                    {t(`onboard.levels.${lv}Desc`)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Styles + Guitarists */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
              {t('onboard.stylesTitle')}
            </h1>
            <p style={{ color: 'var(--fm-text-muted)', marginBottom: 20, fontSize: 15 }}>
              {t('onboard.stylesSub')}
            </p>
            <ChipGroup
              options={styleKeys.map(k => ({ id: k, label: t(`onboard.styles.${k}`) }))}
              selected={data.styles}
              onToggle={id => toggleMulti('styles', id)}
            />

            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--fm-text)', marginTop: 32, marginBottom: 8 }}>
              {t('onboard.guitaristsTitle')}
            </h2>
            <p style={{ color: 'var(--fm-text-muted)', marginBottom: 16, fontSize: 14 }}>
              {t('onboard.guitaristsSub')}
            </p>
            <ChipGroup
              options={GUITARISTS.map(g => ({ id: g.id, label: g.name }))}
              selected={data.guitarists}
              onToggle={id => toggleMulti('guitarists', id)}
            />
          </div>
        )}

        {/* Step 3 — Goals */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
              {t('onboard.goalsTitle')}
            </h1>
            <p style={{ color: 'var(--fm-text-muted)', marginBottom: 24, fontSize: 15 }}>
              {t('onboard.goalsSub')}
            </p>
            <ChipGroup
              options={goalKeys.map(k => ({ id: k, label: t(`onboard.goals.${k}`) }))}
              selected={data.goals}
              onToggle={id => toggleMulti('goals', id)}
            />
          </div>
        )}

        {/* Step 4 — Daily Time */}
        {step === 4 && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--fm-text)', marginBottom: 8 }}>
              {t('onboard.timeTitle')}
            </h1>
            <p style={{ color: 'var(--fm-text-muted)', marginBottom: 24, fontSize: 15 }}>
              {t('onboard.timeSub')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {timeKeys.map(tk => (
                <button
                  key={tk}
                  className={`fm-level-card${data.dailyTime === tk ? ' selected' : ''}`}
                  onClick={() => setData(d => ({ ...d, dailyTime: tk }))}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ fontWeight: 700, fontSize: 18, color: data.dailyTime === tk ? 'var(--fm-primary)' : 'var(--fm-text)' }}>
                    {t(`onboard.times.${tk}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="fm-btn-primary" onClick={next} disabled={!canNext()}>
          {step === TOTAL_STEPS - 1 ? t('onboard.start') : t('onboard.next')}
        </button>
        {step > 0 && (
          <button className="fm-btn-ghost" onClick={back}>
            {t('onboard.back')}
          </button>
        )}
      </div>
    </div>
  )
}
