import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { supabase } from './lib/supabase'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import type { OnboardingData } from './store/onboarding'
import DailyTab    from './components/tabs/DailyTab'
import PracticeTab from './components/tabs/PracticeTab'
import HomeTab     from './components/tabs/HomeTab'
import ProfileScreen from './components/ProfileScreen'
import Sidebar       from './components/Sidebar'
import AppIntro, { hasSeenIntro } from './components/AppIntro'
import SkillTreeView from './components/skilltree/SkillTreeView'
import type { Topic } from './lib/topics/topicData'
import { getTopicTree } from './lib/topics/topicTrees'
import type { User } from '@supabase/supabase-js'
import type { CategoryId, CategoryProgress, SessionResult } from './lib/challenges/types'
import { loadAllProgress, applySessionResult } from './lib/challenges/progress'
import { loadSettings, saveSettings, applySettings } from './lib/settings'
import type { AppSettings } from './lib/settings'
import { loadAndRefill, loseHeart, applyRefill } from './lib/gamification/hearts'
import type { HeartsState } from './lib/gamification/hearts'
import { loadStreak, recordActivity } from './lib/gamification/streak'
import type { StreakState } from './lib/gamification/streak'

export type ActiveTab = 'home' | 'daily' | 'practice'

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [progress, setProgress] = useState<Record<CategoryId, CategoryProgress>>(() => loadAllProgress())
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const [hearts, setHearts] = useState<HeartsState>(() => loadAndRefill())
  const [streak, setStreak] = useState<StreakState>(() => loadStreak())
  const refillTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isRTL = i18n.language === 'he'

  // Apply theme + font-size to <body> on mount and whenever settings change.
  useEffect(() => {
    applySettings(settings)
  }, [settings])

  // Periodically check if hearts have refilled (every 60s).
  useEffect(() => {
    refillTimerRef.current = setInterval(() => {
      setHearts(prev => applyRefill(prev))
    }, 60_000)
    return () => {
      if (refillTimerRef.current) clearInterval(refillTimerRef.current)
    }
  }, [])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      applySettings(next)
      return next
    })
  }, [])

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
    // Show intro on first login
    if (!hasSeenIntro()) setShowIntro(true)
  }

  const handleOnboardComplete = (data: OnboardingData) => {
    i18n.changeLanguage(data.lang)
  }

  const handleSessionComplete = useCallback((result: SessionResult) => {
    setProgress(prev => applySessionResult(prev, result))
    setStreak(prev => recordActivity(prev))
  }, [])

  const handleWrongAnswer = useCallback(() => {
    setHearts(prev => loseHeart(prev))
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
      {/* First-launch intro overlay */}
      {showIntro && (
        <AppIntro isHe={isRTL} onDone={() => setShowIntro(false)} />
      )}

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
            backgroundColor: settings.avatar ? 'transparent' : 'var(--fm-primary)',
            color: 'white', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden',
            backgroundImage: settings.avatar ? `url("${settings.avatar}")` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        >
          {!settings.avatar && profileName.slice(0, 1).toUpperCase()}
        </button>
      </header>

      <Sidebar
        activeTab={activeTab}
        onTabChange={(t) => { setActiveTab(t); setSidebarOpen(false); if (t !== 'home') setSelectedTopic(null) }}
        onOpenProfile={() => setShowProfile(true)}
        user={user}
        profileName={profileName}
        avatar={settings.avatar}
        isRTL={isRTL}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="fm-sidebar-space" />

      <main className="fm-main">
        {activeTab === 'home' && !selectedTopic && (
          <HomeTab onSelectTopic={topic => setSelectedTopic(topic)} />
        )}
        {activeTab === 'home' && selectedTopic && (
          <SkillTreeView
            hearts={hearts}
            streak={streak}
            onSessionComplete={handleSessionComplete}
            onWrongAnswer={handleWrongAnswer}
            topicNodes={getTopicTree(selectedTopic.id)}
            topicTitle={{ he: selectedTopic.titleHe, en: selectedTopic.titleEn }}
            onBack={() => setSelectedTopic(null)}
          />
        )}
        {activeTab === 'daily'    && <DailyTab    progress={progress} onSessionComplete={handleSessionComplete} hearts={hearts} onWrongAnswer={handleWrongAnswer} />}
        {activeTab === 'practice' && <PracticeTab hearts={hearts} onWrongAnswer={handleWrongAnswer} />}
      </main>

      {showProfile && user && (
        <ProfileScreen
          user={user}
          profile={profile}
          progress={progress}
          settings={settings}
          onSettingsChange={updateSettings}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}
