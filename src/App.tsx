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
import type { User } from '@supabase/supabase-js'

type ActiveTab = 'learning' | 'journey' | 'practice' | 'theory'

export default function App() {
  const { i18n } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('learning')
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

  return (
    <div className="fm-app" dir={isRTL ? 'rtl' : 'ltr'}>
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
    </div>
  )
}
