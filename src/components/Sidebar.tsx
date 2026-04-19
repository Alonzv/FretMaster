import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type ActiveTab = 'learning' | 'journey' | 'practice' | 'theory'

interface Props {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  onOpenProfile: () => void
  user: User
  profileName: string
  isRTL: boolean
}

const NAV_ITEMS: { id: ActiveTab; labelHe: string; labelEn: string; icon: string }[] = [
  { id: 'learning',  labelHe: 'למידה',     labelEn: 'Learn',    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' },
  { id: 'journey',   labelHe: 'המסע שלך',  labelEn: 'Journey',  icon: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7' },
  { id: 'practice',  labelHe: 'אימון',     labelEn: 'Practice', icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
  { id: 'theory',    labelHe: 'תאוריה',   labelEn: 'Theory',   icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z' },
]

export default function Sidebar({ activeTab, onTabChange, onOpenProfile, user, profileName, isRTL }: Props) {
  const side = isRTL ? 'right' : 'left'
  const initials = profileName.slice(0, 2).toUpperCase()

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      [side]: 0,
      width: 220,
      background: 'var(--fm-bg-card)',
      borderLeft: isRTL ? 'none' : '1px solid var(--fm-border)',
      borderRight: isRTL ? '1px solid var(--fm-border)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      direction: isRTL ? 'rtl' : 'ltr',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid var(--fm-border)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fm-primary)', letterSpacing: '-0.5px' }}>
          FretMaster
        </div>
        <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginTop: 2 }}>
          {isRTL ? 'המורה הגיטרה שלך' : 'Your guitar teacher'}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 10,
                background: isActive ? 'var(--fm-primary-bg)' : 'transparent',
                color: isActive ? 'var(--fm-primary)' : 'var(--fm-text-muted)',
                fontWeight: isActive ? 700 : 400,
                fontSize: 15,
                textAlign: isRTL ? 'right' : 'left',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: isActive ? '1px solid var(--fm-primary-soft)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--fm-bg-input)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d={item.icon} />
              </svg>
              {isRTL ? item.labelHe : item.labelEn}
            </button>
          )
        })}
      </nav>

      {/* Profile at bottom */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--fm-border)' }}>
        <button
          onClick={onOpenProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            width: '100%',
            cursor: 'pointer',
            background: 'transparent',
            border: '1px solid transparent',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--fm-bg-input)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--fm-primary)',
            color: 'var(--fm-white)',
            fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profileName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fm-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
        </button>

        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '8px',
            borderRadius: 8,
            border: '1px solid var(--fm-border)',
            background: 'transparent',
            color: 'var(--fm-text-muted)',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--fm-coral)'; e.currentTarget.style.borderColor = 'var(--fm-coral)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--fm-text-muted)'; e.currentTarget.style.borderColor = 'var(--fm-border)' }}
        >
          {isRTL ? 'התנתק' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
