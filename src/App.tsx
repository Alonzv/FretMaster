import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { supabase } from './lib/supabase'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import type { OnboardingData } from './store/onboarding'
import ChallengesTab from './components/tabs/ChallengesTab'
import DailyTab      from './components/tabs/DailyTab'
import FreePlayTab   from './components/tabs/FreePlayTab'
import StatsTab      from './components/tabs/StatsTab'
import ProfileScreen from './components/ProfileScreen'
import Sidebar       from './components/Sidebar'
import type { User } from '@supabase/supabase-js'
import type { CategoryId, CategoryProgress, SessionResult } from './lib/challenges/types'
import { loadAllProgress, applySessionResult } from './lib/challenges/progress'

export type ActiveTab = 'challenges' | 'daily' | 'free' | 'stats'

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
  const [user, setUser]         = useState<User | null>(null)
  const [profile, setProfile]   = useState<UserProfile | null>(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('challenges')
  const [showProfile, setShowProfile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile
  const [progress, setProgress] = useState<Record<CategoryId, CategoryProgress>>(() => loadAllProgress())
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

  const handleSessionComplete = useCallback((result: SessionResult) => {
    setProgress(prev => applySessionResult(prev, result))
  }, [])

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
      {/* Mobile top bar */}
      <header className="fm-topbar">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
          style={{
            width: 40, height: 40, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--fm-text)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fm-primary)' }}>FretMaster</div>
        <button
          onClick={() => setShowProfile(true)}
          aria-label="Profile"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--fm-primary)', color: 'white',
            fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {profileName.slice(0, 1).toUpperCase()}
        </button>
      </header>

      <Sidebar
        activeTab={activeTab}
        onTabChange={(t) => { setActiveTab(t); setSidebarOpen(false) }}
        onOpenProfile={() => setShowProfile(true)}
        user={user}
        profileName={profileName}
        isRTL={isRTL}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Sidebar spacer (desktop only) */}
      <div className="fm-sidebar-space" />

      <main className="fm-main">
        {activeTab === 'challenges' && <ChallengesTab progress={progress} onSessionComplete={handleSessionComplete} />}
        {activeTab === 'daily'      && <DailyTab      progress={progress} onSessionComplete={handleSessionComplete} />}
        {activeTab === 'free'       && <FreePlayTab />}
        {activeTab === 'stats'      && <StatsTab      progress={progress} />}
      </main>

      {showProfile && user && (
        <ProfileScreen user={user} profile={profile} onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}
