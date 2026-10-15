export const DEFAULT_VOLUME = 0.8

export function isVolume(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && value <= 1
}

/** Maps a 0–1 fader position to gain on a squared curve, which feels more even to the ear than linear. */
export function faderToGain(position: number): number {
  return position * position
}
