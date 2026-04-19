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
import Sidebar from './components/Sidebar'
import type { User } from '@supabase/supabase-js'

type ActiveTab = 'learning' | 'journey' | 'practice' | 'theory'

interface UserProfile {
  name: string
  level: string
  lang: string
  styles: string[]
  goals: string[]
  daily_time: string
}

export default function App() {
  const { i18n } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('learning')
  const [showProfile, setShowProfile] = useState(false)
  const isRTL = i18n.language === 'he'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) loadProfile(u.id)
      else setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadProfile(u.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile(data)
      if (data.lang) i18n.changeLanguage(data.lang)
    }
    setChecking(false)
  }

  useEffect(() => {
    document.body.classList.add('dark')
  }, [])

  const handleOnboardComplete = (data: OnboardingData) => {
    i18n.changeLanguage(data.lang)
  }

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--fm-bg-deep)' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--fm-primary)' }}>FretMaster</div>
      </div>
    )
  }

  if (!user) {
    return <OnboardingFlow onComplete={handleOnboardComplete} />
  }

  const profileName = profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="fm-layout" dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProfile={() => setShowProfile(true)}
        user={user}
        profileName={profileName}
        isRTL={isRTL}
      />

      {/* Sidebar spacer */}
      <div className="fm-sidebar-space" />

      {/* Main content */}
      <main className="fm-main">
        {activeTab === 'learning'  && <LearningTab onGoToJourney={() => setActiveTab('journey')} userLevel={profile?.level || 'beginner'} />}
        {activeTab === 'journey'   && <JourneyTab />}
        {activeTab === 'practice'  && <PracticeTab />}
        {activeTab === 'theory'    && <TheoryTab />}
      </main>

      {showProfile && user && (
        <ProfileScreen user={user} profile={profile} onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}
