import { describe, expect, it } from 'vitest'
import { clampBpm, DEFAULT_BPM, doubleBpm, halveBpm, isBpm, MAX_BPM, MIN_BPM } from './tempo'

describe('clampBpm', () => {
  it('keeps values inside the range and rounds to whole BPM', () => {
    expect(clampBpm(120)).toBe(120)
    expect(clampBpm(120.6)).toBe(121)
  })
  it('clamps to the min and max', () => {
    expect(clampBpm(5)).toBe(MIN_BPM)
    expect(clampBpm(999)).toBe(MAX_BPM)
  })
  it('falls back to the default for non-numbers', () => {
    expect(clampBpm(NaN)).toBe(DEFAULT_BPM)
  })
})

describe('halve / double', () => {
  it('halves and doubles', () => {
    expect(halveBpm(120)).toBe(60)
    expect(doubleBpm(120)).toBe(240)
  })
  it('clamps at the range edges', () => {
    expect(halveBpm(30)).toBe(MIN_BPM)
    expect(doubleBpm(250)).toBe(MAX_BPM)
  })
})

describe('isBpm', () => {
  it('accepts whole numbers in range only', () => {
    expect(isBpm(120)).toBe(true)
    expect(isBpm(120.5)).toBe(false)
    expect(isBpm(10)).toBe(false)
    expect(isBpm(400)).toBe(true)
    expect(isBpm(401)).toBe(false)
    expect(isBpm('120')).toBe(false)
  })
})
