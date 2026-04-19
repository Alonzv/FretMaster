// Music-theory primitives used by the challenge generators.
// All note handling uses sharps as the canonical accidental; flat keys are rendered
// by converting when needed.

export const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export const NOTE_NAMES_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const

export type NoteName = typeof NOTE_NAMES_SHARP[number] | typeof NOTE_NAMES_FLAT[number]

// Returns the pitch class (0–11) for a note name, accepting both sharps and flats.
export function pitchClass(note: string): number {
  const idxSharp = (NOTE_NAMES_SHARP as readonly string[]).indexOf(note)
  if (idxSharp >= 0) return idxSharp
  const idxFlat = (NOTE_NAMES_FLAT as readonly string[]).indexOf(note)
  if (idxFlat >= 0) return idxFlat
  throw new Error(`Unknown note: ${note}`)
}

// Standard guitar tuning: string 1 (high E) down to string 6 (low E).
// Each entry is the open-string pitch class.
export const STRING_OPEN_PC: Record<number, number> = {
  1: pitchClass('E'),
  2: pitchClass('B'),
  3: pitchClass('G'),
  4: pitchClass('D'),
  5: pitchClass('A'),
  6: pitchClass('E'),
}

// Note name at a specific string/fret (always returned with sharps).
export function noteAt(stringNum: number, fret: number): string {
  const pc = (STRING_OPEN_PC[stringNum] + fret) % 12
  return NOTE_NAMES_SHARP[pc]
}

// Interval qualities by semitone distance (0–12).
export const INTERVAL_NAMES: Record<number, { he: string; en: string; short: string }> = {
  0:  { he: 'פרימה',               en: 'Perfect Unison',  short: 'P1' },
  1:  { he: 'סקונדה קטנה',         en: 'Minor 2nd',       short: 'm2' },
  2:  { he: 'סקונדה גדולה',        en: 'Major 2nd',       short: 'M2' },
  3:  { he: 'טרצה קטנה',           en: 'Minor 3rd',       short: 'm3' },
  4:  { he: 'טרצה גדולה',          en: 'Major 3rd',       short: 'M3' },
  5:  { he: 'קוורטה זכה',          en: 'Perfect 4th',     short: 'P4' },
  6:  { he: 'טריטון',              en: 'Tritone',         short: 'TT' },
  7:  { he: 'קווינטה זכה',         en: 'Perfect 5th',     short: 'P5' },
  8:  { he: 'סקסטה קטנה',          en: 'Minor 6th',       short: 'm6' },
  9:  { he: 'סקסטה גדולה',         en: 'Major 6th',       short: 'M6' },
  10: { he: 'ספטימה קטנה',         en: 'Minor 7th',       short: 'm7' },
  11: { he: 'ספטימה גדולה',        en: 'Major 7th',       short: 'M7' },
  12: { he: 'אוקטבה',              en: 'Perfect Octave',  short: 'P8' },
}

// Semitone distance from a → b, folded to 0..12 ascending.
export function interval(a: string, b: string): number {
  const diff = (pitchClass(b) - pitchClass(a) + 12) % 12
  return diff
}

// Circle of fifths — each entry knows its sharp/flat count and its relative minor.
export interface KeyInfo {
  tonic: string
  accidentals: number        // positive = sharps, negative = flats
  relativeMinor: string
  useFlats: boolean
}

export const MAJOR_KEYS: KeyInfo[] = [
  { tonic: 'C',  accidentals: 0,  relativeMinor: 'A',  useFlats: false },
  { tonic: 'G',  accidentals: 1,  relativeMinor: 'E',  useFlats: false },
  { tonic: 'D',  accidentals: 2,  relativeMinor: 'B',  useFlats: false },
  { tonic: 'A',  accidentals: 3,  relativeMinor: 'F#', useFlats: false },
  { tonic: 'E',  accidentals: 4,  relativeMinor: 'C#', useFlats: false },
  { tonic: 'B',  accidentals: 5,  relativeMinor: 'G#', useFlats: false },
  { tonic: 'F#', accidentals: 6,  relativeMinor: 'D#', useFlats: false },
  { tonic: 'F',  accidentals: -1, relativeMinor: 'D',  useFlats: true  },
  { tonic: 'Bb', accidentals: -2, relativeMinor: 'G',  useFlats: true  },
  { tonic: 'Eb', accidentals: -3, relativeMinor: 'C',  useFlats: true  },
  { tonic: 'Ab', accidentals: -4, relativeMinor: 'F',  useFlats: true  },
  { tonic: 'Db', accidentals: -5, relativeMinor: 'Bb', useFlats: true  },
]

// The 7 chord qualities of a major key: I ii iii IV V vi vii°
export const MAJOR_DIATONIC_QUALITIES = [
  { roman: 'I',   quality: 'maj',  qualityHe: 'מז׳ור',     qualityEn: 'major'      },
  { roman: 'ii',  quality: 'min',  qualityHe: 'מינור',      qualityEn: 'minor'      },
  { roman: 'iii', quality: 'min',  qualityHe: 'מינור',      qualityEn: 'minor'      },
  { roman: 'IV',  quality: 'maj',  qualityHe: 'מז׳ור',     qualityEn: 'major'      },
  { roman: 'V',   quality: 'maj',  qualityHe: 'מז׳ור',     qualityEn: 'major'      },
  { roman: 'vi',  quality: 'min',  qualityHe: 'מינור',      qualityEn: 'minor'      },
  { roman: 'vii°',quality: 'dim',  qualityHe: 'מוקטן',      qualityEn: 'diminished' },
]

// Diatonic scale degrees in a major key (whole–whole–half–whole–whole–whole–half).
export const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11]

// Returns the 7 notes of a major key starting at the tonic, using correct accidentals.
export function majorScaleNotes(tonic: string, useFlats = false): string[] {
  const set = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP
  const start = pitchClass(tonic)
  return MAJOR_SCALE_STEPS.map(step => set[(start + step) % 12])
}

// Utility: shuffle then take the first N.
export function pickDistinct<T>(pool: T[], count: number, exclude: T[] = []): T[] {
  const avail = pool.filter(x => !exclude.includes(x))
  const copy = [...avail]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

export function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

import type { Bilingual } from './types'

// Monolingual variant: build 4 choices where both languages share the same label.
export function buildChoices(correct: string, distractorPool: string[]): { choices: Bilingual[]; correctIndex: number } {
  const distractors = pickDistinct(distractorPool, 3, [correct])
  const flat = [correct, ...distractors]
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[flat[i], flat[j]] = [flat[j], flat[i]]
  }
  return {
    choices: flat.map(v => ({ he: v, en: v })),
    correctIndex: flat.indexOf(correct),
  }
}

// Bilingual variant: caller supplies {he, en} pairs and which one is correct.
export function buildBilingualChoices(
  correct: Bilingual,
  distractorPool: Bilingual[],
): { choices: Bilingual[]; correctIndex: number } {
  // Deduplicate distractors by English label.
  const avail = distractorPool.filter(d => d.en !== correct.en)
  const picked: Bilingual[] = []
  const copy = [...avail]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  for (const d of copy) {
    if (picked.length === 3) break
    if (!picked.some(p => p.en === d.en)) picked.push(d)
  }
  const flat = [correct, ...picked]
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[flat[i], flat[j]] = [flat[j], flat[i]]
  }
  return {
    choices: flat,
    correctIndex: flat.findIndex(c => c.en === correct.en),
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}
