export const MIN_BPM = 20
export const MAX_BPM = 300
export const DEFAULT_BPM = 120

export function clampBpm(bpm: number): number {
  if (!Number.isFinite(bpm)) return DEFAULT_BPM
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)))
}

export function halveBpm(bpm: number): number {
  return clampBpm(bpm / 2)
}

export function doubleBpm(bpm: number): number {
  return clampBpm(bpm * 2)
}

export function isBpm(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= MIN_BPM && value <= MAX_BPM
}
