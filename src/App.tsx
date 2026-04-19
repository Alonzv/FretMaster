import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { supabase } from './lib/supabase'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import type { OnboardingData } from './store/onboarding'
import LearningTab from './components/tabs/LearningTab'
import JourneyTab from './components/tabs/JourneyTab'
import PracticeTab from './components/tabs/PracticeTab'
import TheoryTab from './components/tabs/TheoryTab'
import ProfileScreen from './components/ProfileScreen'
import type { User } from '@supabase/supabase-js'

type ActiveTab = 'learning' | 'journey' | 'practice' | 'theory'

export default function App() {
  const { i18n } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('learning')
  const [showProfile, setShowProfile] = useState(false)
  const isRTL = i18n.language === 'he'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.classList.add('dark')
  }, [])

  const handleOnboardComplete = (data: OnboardingData) => {
    i18n.changeLanguage(data.lang)
  }

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--fm-bg-deep)' }}>
        <span style={{ fontSize: 48 }}>🎸</span>
      </div>
    )
  }

  if (!user) {
    return <OnboardingFlow onComplete={handleOnboardComplete} />
  }

  const isHe = i18n.language === 'he'

  const TABS: { id: ActiveTab; emoji: string; label: string }[] = [
    { id: 'learning', emoji: '📖', label: isHe ? 'למידה' : 'Learn' },
    { id: 'journey', emoji: '🗺️', label: isHe ? 'המסע' : 'Journey' },
    { id: 'practice', emoji: '🎸', label: isHe ? 'אימון' : 'Practice' },
    { id: 'theory', emoji: '🎼', label: isHe ? 'תאוריה' : 'Theory' },
  ]

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || '?'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="fm-app" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'var(--fm-bg-card)',
        borderBottom: '1px solid var(--fm-border)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--fm-primary)' }}>🎸 FretMaster</span>
        <button
          onClick={() => setShowProfile(true)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--fm-primary)',
            color: 'var(--fm-white)',
            fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {initials}
        </button>
      </div>

      {activeTab === 'learning' && <LearningTab onGoToJourney={() => setActiveTab('journey')} />}
      {activeTab === 'journey' && <JourneyTab />}
      {activeTab === 'practice' && <PracticeTab />}
      {activeTab === 'theory' && <TheoryTab />}

      <nav className="fm-tabs">
        {TABS.map(tb => (
          <button
            key={tb.id}
            className={`fm-tab${activeTab === tb.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tb.id)}
          >
            <span style={{ fontSize: 20 }}>{tb.emoji}</span>
            <span>{tb.label}</span>
          </button>
        ))}
      </nav>

      {showProfile && (
        <ProfileScreen user={user} onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}
