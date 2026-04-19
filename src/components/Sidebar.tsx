import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { ActiveTab } from '../App'

interface Props {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  onOpenProfile: () => void
  user: User
  profileName: string
  avatar: string
  isRTL: boolean
  mobileOpen: boolean
  onMobileClose: () => void
}

const NAV_ITEMS: { id: ActiveTab; labelHe: string; labelEn: string; icon: string }[] = [
  { id: 'home',     labelHe: 'בית',           labelEn: 'Home',           icon: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3z' },
  { id: 'daily',    labelHe: 'אתגר היומי',     labelEn: 'Daily Challenge', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z' },
  { id: 'practice', labelHe: 'תרגול חופשי',   labelEn: 'Free Practice',   icon: 'M8 5v14l11-7z' },
]

export default function Sidebar({ activeTab, onTabChange, onOpenProfile, user, profileName, avatar, isRTL, mobileOpen, onMobileClose }: Props) {
  const side = isRTL ? 'right' : 'left'
  const initials = profileName.slice(0, 2).toUpperCase()

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fm-sidebar-backdrop"
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0, 0, 0, 0.55)',
            animation: 'fm-fade-in 0.2s ease',
          }}
        />
      )}

      <aside
        className={`fm-sidebar ${mobileOpen ? 'fm-sidebar-open' : ''}`}
        style={{
          top: 0, bottom: 0, [side]: 0,
          width: 240,
          background: 'var(--fm-bg-deep)',
          borderInlineEnd: '1px solid var(--fm-border)',
          display: 'flex', flexDirection: 'column',
          zIndex: 99,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 22px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fm-primary)', letterSpacing: '-0.4px' }}>
            FretMaster
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14.5,
                  textAlign: isRTL ? 'right' : 'left',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--fm-bg-card)'; e.currentTarget.style.color = 'var(--fm-text)' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fm-text-muted)' } }}
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
        <div style={{ padding: '14px 12px', borderTop: '1px solid var(--fm-border)' }}>
          <button
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 10,
              width: '100%',
              cursor: 'pointer',
              background: 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--fm-bg-card)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: avatar ? 'transparent' : 'var(--fm-primary)',
              color: 'white', fontWeight: 700, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
              backgroundImage: avatar ? `url(${avatar})` : undefined,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              {!avatar && initials}
            </div>
            <div style={{ flex: 1, overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              width: '100%', marginTop: 6,
              padding: '7px 10px', borderRadius: 8,
              background: 'transparent', color: 'var(--fm-text-muted)',
              fontSize: 12, cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fm-coral)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fm-text-muted)')}
          >
            {isRTL ? 'התנתק' : 'Sign out'}
          </button>
        </div>
      </aside>
    </>
  )
}
