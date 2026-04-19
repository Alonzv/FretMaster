export interface OnboardingData {
  lang: 'he' | 'en'
  name: string
  level: string
  styles: string[]
  guitarists: string[]
  goals: string[]
  dailyTime: string
}

export const GUITARISTS = [
  { id: 'hendrix', name: 'Jimi Hendrix', emoji: '🎸' },
  { id: 'clapton', name: 'Eric Clapton', emoji: '🎸' },
  { id: 'srv', name: 'Stevie Ray Vaughan', emoji: '🎸' },
  { id: 'page', name: 'Jimmy Page', emoji: '🎸' },
  { id: 'gilmour', name: 'David Gilmour', emoji: '🎸' },
  { id: 'bb_king', name: 'B.B. King', emoji: '🎸' },
  { id: 'slash', name: 'Slash', emoji: '🎸' },
  { id: 'santana', name: 'Carlos Santana', emoji: '🎸' },
  { id: 'metheny', name: 'Pat Metheny', emoji: '🎸' },
  { id: 'chet', name: 'Chet Atkins', emoji: '🎸' },
  { id: 'van_halen', name: 'Eddie Van Halen', emoji: '🎸' },
  { id: 'beck', name: 'Jeff Beck', emoji: '🎸' },
  { id: 'satriani', name: 'Joe Satriani', emoji: '🎸' },
  { id: 'nuno', name: 'Nuno Bettencourt', emoji: '🎸' },
  { id: 'wes', name: 'Wes Montgomery', emoji: '🎸' },
]

export const emptyOnboarding = (): OnboardingData => ({
  lang: 'he',
  name: '',
  level: '',
  styles: [],
  guitarists: [],
  goals: [],
  dailyTime: '',
})
