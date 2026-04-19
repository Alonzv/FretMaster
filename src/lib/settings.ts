// App-wide user settings — persisted in localStorage, applied to the DOM via classes.

export interface AppSettings {
  theme: 'dark' | 'light'
  notifications: boolean   // browser push reminders for daily challenge
  audioEnabled: boolean    // play audio in ear-training exercises (Phase 2)
  micEnabled: boolean      // listen to guitar via microphone (Phase 3 / Pitchy.js)
  fontSize: 'normal' | 'large'
  avatar: string           // base64 data URL of profile picture, or ''
}

const KEY = 'fm_settings_v1'

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  notifications: false,
  audioEnabled: true,
  micEnabled: false,
  fontSize: 'normal',
  avatar: '',
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(KEY, JSON.stringify(s))
}

// Apply theme + font-size classes to <body>. Call whenever settings change.
export function applySettings(s: AppSettings): void {
  const body = document.body
  if (s.theme === 'dark') {
    body.classList.add('dark')
    body.classList.remove('light')
  } else {
    body.classList.add('light')
    body.classList.remove('dark')
  }
  if (s.fontSize === 'large') {
    body.classList.add('large-text')
  } else {
    body.classList.remove('large-text')
  }
}

// Request browser notification permission. Returns true if granted.
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

// Resize an image File to a small square and return a base64 data URL.
export function resizeAvatarToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const SIZE = 160
        const canvas = document.createElement('canvas')
        canvas.width = SIZE
        canvas.height = SIZE
        const ctx = canvas.getContext('2d')!
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = reject
      img.src = ev.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
