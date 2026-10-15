import { describe, expect, it } from 'vitest'
import { MAX_TAPS, TAP_RESET_MS, TapTempo } from './tapTempo'

function tapAt(tapper: TapTempo, times: number[]): (number | null)[] {
  return times.map((t) => tapper.tap(t))
}

describe('TapTempo', () => {
  it('needs two taps before reporting a tempo', () => {
    const results = tapAt(new TapTempo(), [0, 500])
    expect(results).toEqual([null, 120])
  })

  it('averages intervals across recent taps', () => {
    // Slightly uneven taps around 100 BPM (600ms).
    const results = tapAt(new TapTempo(), [0, 590, 1210, 1800, 2400])
    expect(results.at(-1)).toBe(100)
  })

  it('only averages the most recent taps', () => {
    const tapper = new TapTempo()
    // Slow taps (1000ms) followed by enough fast taps (500ms) to push them out of the window.
    const times = [0, 1000, 2000]
    for (let i = 1; i <= MAX_TAPS; i++) times.push(2000 + i * 500)
    expect(tapAt(tapper, times).at(-1)).toBe(120)
  })

  it('starts a new sequence after a long pause', () => {
    const tapper = new TapTempo()
    tapAt(tapper, [0, 500, 1000])
    expect(tapper.tap(1000 + TAP_RESET_MS + 1)).toBeNull()
    expect(tapper.tap(1000 + TAP_RESET_MS + 1 + 1000)).toBe(60)
  })

  it('clamps very fast or slow tapping to the tempo range', () => {
    expect(tapAt(new TapTempo(), [0, 50]).at(-1)).toBe(300)
    expect(tapAt(new TapTempo(), [0, 1999]).at(-1)).toBe(30)
  })
})
