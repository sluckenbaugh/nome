import type { ActiveBeat } from '../audio/MetronomeEngine'
import type { StepState } from '../logic/steps'

interface Props {
  beat: ActiveBeat
  steps: StepState[]
}

/**
 * Flashes once per beat: bright on accents, normal on plain steps, a hollow ring when Drops
 * silenced the beat, and nothing on muted steps. Remounting on `beat.count` restarts the fade.
 */
export function BeatLight({ beat, steps }: Props) {
  const state = steps[beat.step]
  const flash =
    beat.step < 0 || state === 'mute'
      ? null
      : beat.dropped
        ? 'border-2 border-accent'
        : state === 'accent'
          ? 'bg-accent'
          : 'bg-accent/60'

  return (
    <span aria-hidden className="relative inline-block size-2.5 rounded-full border border-ink-muted/60">
      {flash && <span key={beat.count} className={`beat-flash absolute -inset-px rounded-full ${flash}`} />}
    </span>
  )
}
