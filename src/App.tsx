import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { supabase } from './lib/supabase'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import type { OnboardingData } from './store/onboarding'
import DailyTab    from './components/tabs/DailyTab'
import PracticeTab from './components/tabs/PracticeTab'
import HomeTab     from './components/tabs/HomeTab'
import TheoryTab   from './components/tabs/TheoryTab'
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

export type ActiveTab = 'home' | 'daily' | 'practice' | 'theory' | 'scaleup'

interface UserProfile {
  name: string
  level: string
  lang: string
  styles: string[]
  goals: string[]
  daily_time: string
}

// ── Navigation back-stack ─────────────────────────────────────────────────────
// Each navigation "level" pushes a handler that undoes it. Browser back calls
// the latest handler. Tab changes reset the stack. For programmatic exits
// (e.g. challenge complete) we need to also pop the history entries silently.

export type PushBackFn    = (fn: () => void) => void
export type CleanupBackFn = (count: number) => void

export default function App() {
  const { i18n } = useTranslation()
  const [user, setUser]         = useState<User | null>(null)
  const [profile, setProfile]   = useState<UserProfile | null>(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [theoryResetSignal, setTheoryResetSignal] = useState(0)
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

  // ── Back-stack for browser history ─────────────────────────────────────────
  const backStack = useRef<Array<() => void>>([])
  const skipPopCount = useRef(0)   // entries to silently discard (programmatic back)

  /** Push a undo-function AND a history entry. Call this on every nav forward. */
  const pushBack: PushBackFn = useCallback((fn) => {
    backStack.current.push(fn)
    history.pushState({ fmDepth: backStack.current.length }, '')
  }, [])

  /**
   * Programmatically remove `count` history entries WITHOUT triggering our
   * popstate handler (used when navigating forward in app flow naturally exits).
   */
  const cleanupBack: CleanupBackFn = useCallback((count) => {
    if (count <= 0) return
    const removed = backStack.current.splice(backStack.current.length - count, count)
    if (removed.length === 0) return
    // history.go(-N) fires exactly ONE popstate event regardless of N
    skipPopCount.current += 1
    history.go(-removed.length)
  }, [])

  /** Reset the back-stack and history to root (used on tab change). */
  const resetToRoot = useCallback(() => {
    const depth = backStack.current.length
    backStack.current = []
    if (depth > 0) {
      // history.go(-N) always fires exactly ONE popstate event regardless of N,
      // so we must absorb exactly 1, not `depth`.
      skipPopCount.current += 1
      history.go(-depth)
    }
    history.replaceState({ fmDepth: 0 }, '')
  }, [])

  // Set up initial history state + popstate listener
  useEffect(() => {
    history.replaceState({ fmDepth: 0 }, '')

    const onPop = () => {
      // Silently absorb programmatic history.go() calls
      if (skipPopCount.current > 0) {
        skipPopCount.current--
        return
      }
      const fn = backStack.current.pop()
      if (fn) {
        fn()
      } else {
        // Stack is empty — we're at root. Push a fresh entry so the next
        // back press doesn't exit the app to the previous website.
        history.pushState({ fmDepth: 0 }, '')
      }
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Apply theme + font-size whenever settings change
  useEffect(() => { applySettings(settings) }, [settings])

  // Periodically check hearts refill (every 60s)
  useEffect(() => {
    refillTimerRef.current = setInterval(() => {
      setHearts(prev => applyRefill(prev))
    }, 60_000)
    return () => { if (refillTimerRef.current) clearInterval(refillTimerRef.current) }
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

  // ── Tab navigation ──────────────────────────────────────────────────────────
  const handleTabChange = useCallback((tab: ActiveTab) => {
    if (tab === 'theory' && activeTab === 'theory') {
      // Already on theory tab — signal TheoryTab to close any open article
      setTheoryResetSignal(s => s + 1)
      setSidebarOpen(false)
      return
    }
    resetToRoot()
    setActiveTab(tab)
    setSelectedTopic(null)  // always clear topic when switching tabs
    setSidebarOpen(false)
  }, [activeTab, resetToRoot])

  // ── Topic navigation ────────────────────────────────────────────────────────
  const handleSelectTopic = useCallback((topic: Topic) => {
    setSelectedTopic(topic)
    pushBack(() => setSelectedTopic(null))
  }, [pushBack])

  const handleBackFromTopic = useCallback(() => {
    // In-app back button inside SkillTreeView: also pop the history entry
    backStack.current.pop()
    skipPopCount.current++
    history.go(-1)
    setSelectedTopic(null)
  }, [])

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--fm-bg-deep)' }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--fm-primary)', fontFamily: 'var(--fm-font-display)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }} className="fm-logo-glow">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
            <rect y="0" width="22" height="3" fill="currentColor"/>
            <rect y="6.5" width="22" height="3" fill="currentColor"/>
            <rect y="13" width="22" height="3" fill="currentColor"/>
          </svg>
          FretMaster
        </div>
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
      {showIntro && <AppIntro isHe={isRTL} onDone={() => setShowIntro(false)} />}

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <header className="fm-topbar">
        {selectedTopic ? (
          /* Back arrow + topic name when inside a topic */
          <button
            onClick={handleBackFromTopic}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--fm-primary)', fontWeight: 700, fontSize: 14,
              padding: '4px 0', flexShrink: 0,
            }}
            aria-label={isRTL ? 'חזרה' : 'Back'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isRTL ? 'none' : 'scaleX(-1)' }}>
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isRTL ? selectedTopic.titleHe : selectedTopic.titleEn}
            </span>
          </button>
        ) : (
          /* Hamburger for sidebar (desktop) */
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
        )}

        {/* Logo (always centered) */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: 19, fontWeight: 900, color: 'var(--fm-primary)',
          fontFamily: 'var(--fm-font-display)', letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', gap: 7,
          pointerEvents: 'none',
        }}>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
            <rect y="0" width="15" height="2" fill="currentColor"/>
            <rect y="4.5" width="15" height="2" fill="currentColor"/>
            <rect y="9" width="15" height="2" fill="currentColor"/>
          </svg>
          FretMaster
        </div>

        {/* Profile avatar */}
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

      {/* Sidebar (desktop nav / mobile drawer) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenProfile={() => setShowProfile(true)}
        user={user}
        profileName={profileName}
        avatar={settings.avatar}
        isRTL={isRTL}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="fm-sidebar-space" />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="fm-main">
        {activeTab === 'home' && !selectedTopic && (
          <HomeTab onSelectTopic={handleSelectTopic} />
        )}
        {activeTab === 'home' && selectedTopic && (
          <SkillTreeView
            hearts={hearts}
            streak={streak}
            onSessionComplete={handleSessionComplete}
            onWrongAnswer={handleWrongAnswer}
            topicNodes={getTopicTree(selectedTopic.id)}
            topicTitle={{ he: selectedTopic.titleHe, en: selectedTopic.titleEn }}
            onBack={handleBackFromTopic}
            pushBack={pushBack}
            cleanupBack={cleanupBack}
          />
        )}
        {activeTab === 'daily'    && <DailyTab    progress={progress} onSessionComplete={handleSessionComplete} hearts={hearts} onWrongAnswer={handleWrongAnswer} pushBack={pushBack} cleanupBack={cleanupBack} />}
        {activeTab === 'practice' && <PracticeTab hearts={hearts} onWrongAnswer={handleWrongAnswer} />}
        {activeTab === 'theory'   && <TheoryTab pushBack={pushBack} cleanupBack={cleanupBack} onClose={() => handleTabChange('home')} resetSignal={theoryResetSignal} />}
        {activeTab === 'scaleup'  && (
          <iframe
            src="/scaleup/index.html"
            title="ScaleUp"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="microphone"
          />
        )}
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

