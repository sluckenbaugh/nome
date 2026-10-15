import { describe, expect, it } from 'vitest'
import { isDropped, isDropSettings } from './drops'

describe('isDropped', () => {
  it('never drops at 0% and always drops at 100%', () => {
    for (const r of [0, 0.25, 0.5, 0.999999]) {
      expect(isDropped(0, () => r)).toBe(false)
      expect(isDropped(1, () => r)).toBe(true)
    }
  })

  it('drops when the roll is below the density', () => {
    expect(isDropped(0.25, () => 0.2)).toBe(true)
    expect(isDropped(0.25, () => 0.25)).toBe(false)
    expect(isDropped(0.25, () => 0.3)).toBe(false)
  })

  it('drops roughly density% of beats with real randomness', () => {
    let dropped = 0
    for (let i = 0; i < 10000; i++) if (isDropped(0.3)) dropped++
    expect(dropped / 10000).toBeGreaterThan(0.27)
    expect(dropped / 10000).toBeLessThan(0.33)
  })
})

describe('isDropSettings', () => {
  it('accepts valid settings', () => {
    expect(isDropSettings({ enabled: true, density: 0.5 })).toBe(true)
    expect(isDropSettings({ enabled: false, density: 0 })).toBe(true)
  })

  it('rejects bad stored values', () => {
    expect(isDropSettings(null)).toBe(false)
    expect(isDropSettings({ enabled: 'yes', density: 0.5 })).toBe(false)
    expect(isDropSettings({ enabled: true, density: 1.5 })).toBe(false)
    expect(isDropSettings({ enabled: true })).toBe(false)
  })
})
