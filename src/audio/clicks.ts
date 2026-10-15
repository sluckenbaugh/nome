export type ClickKind = 'normal' | 'accent'

const CLICK_SOUND: Record<ClickKind, { frequency: number; peak: number }> = {
  normal: { frequency: 1000, peak: 0.6 },
  accent: { frequency: 1700, peak: 1 },
}

const ATTACK_S = 0.001
const DECAY_S = 0.04

/**
 * Schedules one synthesized click at `time` (AudioContext seconds).
 * Kept separate from the engine so it can later be swapped for sample playback.
 */
export function playClick(ctx: BaseAudioContext, time: number, kind: ClickKind, destination: AudioNode): void {
  const { frequency, peak } = CLICK_SOUND[kind]
  const osc = ctx.createOscillator()
  const envelope = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.value = frequency
  envelope.gain.setValueAtTime(0.0001, time)
  envelope.gain.exponentialRampToValueAtTime(peak, time + ATTACK_S)
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + DECAY_S)

  osc.connect(envelope).connect(destination)
  osc.start(time)
  osc.stop(time + DECAY_S + 0.01)
  osc.onended = () => {
    osc.disconnect()
    envelope.disconnect()
  }
}
