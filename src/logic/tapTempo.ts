import { clampBpm } from './tempo'

/** Gaps longer than this start a new tap sequence. */
export const TAP_RESET_MS = 2000
/** Number of most recent taps used for the average (gives MAX_TAPS - 1 intervals). */
export const MAX_TAPS = 6

/**
 * Turns a series of tap timestamps (ms, e.g. from `event.timeStamp` or `performance.now()`)
 * into a BPM by averaging the intervals between recent taps.
 */
export class TapTempo {
  private taps: number[] = []

  /** Records a tap. Returns the detected BPM once at least two taps are in the sequence. */
  tap(timeMs: number): number | null {
    const last = this.taps[this.taps.length - 1]
    if (last !== undefined && (timeMs - last > TAP_RESET_MS || timeMs <= last)) {
      this.taps = []
    }
    this.taps.push(timeMs)
    if (this.taps.length > MAX_TAPS) this.taps.shift()
    if (this.taps.length < 2) return null

    const avgInterval = (this.taps[this.taps.length - 1] - this.taps[0]) / (this.taps.length - 1)
    return clampBpm(60000 / avgInterval)
  }

  reset(): void {
    this.taps = []
  }
}
