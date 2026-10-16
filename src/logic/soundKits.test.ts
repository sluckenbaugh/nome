import { describe, expect, it } from 'vitest'
import { findOnset, kitLabel, kitsFromFiles } from './soundKits'

describe('kitLabel', () => {
  it('title-cases folder names', () => {
    expect(kitLabel('old-school')).toBe('Old School')
    expect(kitLabel('airblocks')).toBe('Airblocks')
    expect(kitLabel('Library')).toBe('Library')
    expect(kitLabel('wood_block')).toBe('Wood Block')
  })
})

describe('kitsFromFiles', () => {
  it('pairs main/accent files by folder and sorts by label', () => {
    const kits = kitsFromFiles({
      '../assets/sounds/woodblock/main.wav': 'w-main',
      '../assets/sounds/woodblock/accent.wav': 'w-accent',
      '../assets/sounds/Library/accent.wav': 'l-accent',
      '../assets/sounds/Library/main.wav': 'l-main',
    })
    expect(kits).toEqual([
      { id: 'library', label: 'Library', main: 'l-main', accent: 'l-accent' },
      { id: 'woodblock', label: 'Woodblock', main: 'w-main', accent: 'w-accent' },
    ])
  })

  it('skips folders missing a file and ignores other files', () => {
    const kits = kitsFromFiles({
      '../assets/sounds/half/main.wav': 'x',
      '../assets/sounds/full/main.wav': 'm',
      '../assets/sounds/full/accent.wav': 'a',
      '../assets/sounds/full/notes.wav': 'n',
    })
    expect(kits.map((k) => k.id)).toEqual(['full'])
  })
})

describe('findOnset', () => {
  it('finds the first sample above the threshold in any channel', () => {
    const left = [0, 0, 0, 0.0005, 0, 0.5]
    const right = [0, 0, 0, 0, 0.01, 0]
    expect(findOnset([left, right])).toBe(4)
  })

  it('returns 0 for a file that starts immediately or is silent', () => {
    expect(findOnset([[0.9, 0.1]])).toBe(0)
    expect(findOnset([[0, 0, 0]])).toBe(0)
  })
})
