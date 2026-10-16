import { kitsFromFiles, SYNTH_KIT, type SoundKit } from '../logic/soundKits'

// Every folder in src/assets/sounds with a main.wav and accent.wav becomes a kit; no code change needed.
const files = import.meta.glob<string>('../assets/sounds/*/{main,accent}.wav', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const SOUND_KITS: SoundKit[] = [SYNTH_KIT, ...kitsFromFiles(files)]

export function isKitId(value: unknown): value is string {
  return typeof value === 'string' && SOUND_KITS.some((kit) => kit.id === value)
}

export function getKit(id: string): SoundKit {
  return SOUND_KITS.find((kit) => kit.id === id) ?? SYNTH_KIT
}
