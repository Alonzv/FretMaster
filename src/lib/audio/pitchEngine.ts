import { PitchDetector } from 'pitchy'

// ── Note utilities ────────────────────────────────────────────────────────────

const NOTE_NAMES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_NAMES_HE = ['דו', 'דו#', 'רה', 'רה#', 'מי', 'פה', 'פה#', 'סול', 'סול#', 'לה', 'לה#', 'סי']

/** Convert frequency (Hz) → { note, octave, cents } */
export function freqToNote(freq: number): { note: string; noteHe: string; octave: number; cents: number } {
  // A4 = 69 MIDI, 440 Hz
  const midi     = 12 * Math.log2(freq / 440) + 69
  const rounded  = Math.round(midi)
  const cents    = Math.round((midi - rounded) * 100)
  const note     = NOTE_NAMES_EN[((rounded % 12) + 12) % 12]
  const noteHe   = NOTE_NAMES_HE[((rounded % 12) + 12) % 12]
  const octave   = Math.floor(rounded / 12) - 1
  return { note, noteHe, octave, cents }
}

// ── Guitar standard tuning ─────────────────────────────────────────────────

export interface StringInfo {
  string: number    // 1=low E (thickest) … 6=high E
  note: string
  noteHe: string
  octave: number
  freq: number
}

export const GUITAR_STRINGS: StringInfo[] = [
  { string: 6, note: 'E', noteHe: 'מי', octave: 2, freq: 82.41  },
  { string: 5, note: 'A', noteHe: 'לה', octave: 2, freq: 110.00 },
  { string: 4, note: 'D', noteHe: 'רה', octave: 3, freq: 146.83 },
  { string: 3, note: 'G', noteHe: 'סול', octave: 3, freq: 196.00 },
  { string: 2, note: 'B', noteHe: 'סי', octave: 3, freq: 246.94 },
  { string: 1, note: 'E', noteHe: 'מי', octave: 4, freq: 329.63 },
]

// ── Audio engine ──────────────────────────────────────────────────────────────

const BUFFER_SIZE  = 2048
const CLARITY_MIN  = 0.85
const MIN_FREQ     = 60    // Hz — below low E open
const MAX_FREQ     = 1400  // Hz — above high e

export interface PitchResult {
  freq:    number       // Hz
  note:    string
  noteHe:  string
  octave:  number
  cents:   number       // -50 … +50
  clarity: number       // 0–1
  inTune:  boolean      // |cents| ≤ 8
}

export type PitchCallback = (result: PitchResult | null) => void

export class PitchEngine {
  private ctx:      AudioContext | null = null
  private source:   MediaStreamAudioSourceNode | null = null
  private analyser: AnalyserNode | null = null
  private detector: PitchDetector<Float32Array<ArrayBuffer>> | null = null
  private buf:      Float32Array<ArrayBuffer> | null = null
  private rafId:    number = 0
  private stream:   MediaStream | null = null
  private cb:       PitchCallback

  constructor(cb: PitchCallback) {
    this.cb = cb
  }

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    this.ctx     = new AudioContext()
    this.source  = this.ctx.createMediaStreamSource(this.stream)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = BUFFER_SIZE
    this.source.connect(this.analyser)

    this.detector = PitchDetector.forFloat32Array(BUFFER_SIZE) as PitchDetector<Float32Array<ArrayBuffer>>
    this.detector.clarityThreshold = CLARITY_MIN
    this.buf      = new Float32Array(BUFFER_SIZE) as Float32Array<ArrayBuffer>

    this._loop()
  }

  stop(): void {
    cancelAnimationFrame(this.rafId)
    this.source?.disconnect()
    this.stream?.getTracks().forEach(t => t.stop())
    this.ctx?.close()
    this.ctx = null
    this.source = null
    this.analyser = null
    this.stream = null
  }

  private _loop = (): void => {
    if (!this.analyser || !this.detector || !this.buf || !this.ctx) return
    this.analyser.getFloatTimeDomainData(this.buf)

    const [freq, clarity] = this.detector.findPitch(this.buf, this.ctx.sampleRate)

    if (clarity >= CLARITY_MIN && freq >= MIN_FREQ && freq <= MAX_FREQ) {
      const { note, noteHe, octave, cents } = freqToNote(freq)
      this.cb({ freq, note, noteHe, octave, cents, clarity, inTune: Math.abs(cents) <= 8 })
    } else {
      this.cb(null)
    }

    this.rafId = requestAnimationFrame(this._loop)
  }
}
