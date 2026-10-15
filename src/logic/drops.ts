export interface DropSettings {
  enabled: boolean
  /** Chance (0–1) that any audible beat is silenced. */
  density: number
}

export const DEFAULT_DROPS: DropSettings = { enabled: false, density: 0.25 }

/** Slider granularity, as a fraction. */
export const DENSITY_STEP = 0.05

/**
 * Rolls whether one beat is dropped. Rolled independently for every beat as it is scheduled,
 * so 0 never drops and 1 always drops (Math.random() is always < 1).
 */
export function isDropped(density: number, random: () => number = Math.random): boolean {
  return random() < density
}

export function isDropSettings(value: unknown): value is DropSettings {
  if (typeof value !== 'object' || value === null) return false
  const { enabled, density } = value as Record<string, unknown>
  return typeof enabled === 'boolean' && typeof density === 'number' && density >= 0 && density <= 1
}
