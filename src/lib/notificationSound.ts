/**
 * Notification chime.
 *
 * Synthesised with the Web Audio API rather than shipped as an audio file:
 * no extra payload, works offline, and nothing to cache-bust.
 *
 * Browsers block audio until the user has interacted with the page, so the
 * AudioContext is created lazily and resumed on the first gesture — see
 * `primeNotificationSound()`, which AppLayout calls once on mount.
 */

const STORAGE_KEY = 'ack:notification-sound'

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) {
    try {
      ctx = new Ctor()
    } catch {
      return null
    }
  }
  return ctx
}

/** Whether the user wants an audible chime. Defaults to on. */
export function isNotificationSoundEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setNotificationSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  } catch {
    /* private mode — the preference just won't persist */
  }
}

/** One struck bell partial: a sine that swells in and decays away. */
function strike(audio: AudioContext, freq: number, startAt: number, gain: number, decay: number) {
  const osc = audio.createOscillator()
  const env = audio.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startAt)

  env.gain.setValueAtTime(0.0001, startAt)
  env.gain.exponentialRampToValueAtTime(gain, startAt + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, startAt + decay)

  osc.connect(env)
  env.connect(audio.destination)
  osc.start(startAt)
  osc.stop(startAt + decay + 0.05)
}

/**
 * Play the two-note notification chime (a rising fifth, church-bell-ish).
 * Silent — never throws — if audio is unavailable or the user has muted it.
 */
export function playNotificationSound() {
  if (!isNotificationSoundEnabled()) return

  const audio = getContext()
  if (!audio) return

  const start = () => {
    const t = audio.currentTime + 0.01
    // Root note, then a fifth above it, each with a quieter octave partial
    // so the tone reads as a bell rather than a bare sine beep.
    strike(audio, 880, t, 0.16, 0.55)
    strike(audio, 1760, t, 0.05, 0.35)
    strike(audio, 1318.5, t + 0.13, 0.14, 0.75)
    strike(audio, 2637, t + 0.13, 0.04, 0.45)
  }

  if (audio.state === 'suspended') {
    audio.resume().then(start).catch(() => {})
  } else {
    start()
  }
}

/** Short buzz alongside the chime, where the device supports it. */
export function vibrateForNotification() {
  try {
    navigator.vibrate?.([120, 60, 120])
  } catch {
    /* unsupported — ignore */
  }
}

export function alertForNotification() {
  playNotificationSound()
  vibrateForNotification()
}

/**
 * Unlock audio on the user's first interaction. Without this the AudioContext
 * stays suspended and the first notification of the session is silent.
 */
export function primeNotificationSound() {
  if (typeof window === 'undefined') return

  const unlock = () => {
    const audio = getContext()
    audio?.resume().catch(() => {})
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
    window.removeEventListener('touchstart', unlock)
  }

  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
  window.addEventListener('touchstart', unlock, { once: true })
}
