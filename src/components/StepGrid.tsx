import { cycleStep, type StepState } from '../logic/steps'
import { Led } from './Led'
import { KEY_BASE, KEY_FACE } from './ui'

interface Props {
  steps: StepState[]
  activeStep: number
  /** The active beat was silenced by Drops: its LED shows hollow and the pad doesn't press. */
  activeDropped: boolean
  onChange: (steps: StepState[]) => void
}

const PAD_FACE: Record<StepState, string> = {
  normal: KEY_FACE,
  accent: 'border-amber-deep bg-[color-mix(in_srgb,var(--color-amber)_55%,var(--color-key))] text-lcd',
  // Muted pads sit flat and dark, like an unlit key.
  mute: 'border-rule bg-pad-mute text-ink-muted shadow-[inset_0_1px_3px_rgb(0_0_0/0.35)]',
}

/** Sinks the pad on its beat; skipped when the user prefers reduced motion. */
const PAD_PRESSED = 'motion-safe:translate-y-[2px] motion-safe:shadow-[0_0_0_var(--color-key-edge),0_1px_2px_rgb(0_0_0/0.15)]'

export function StepGrid({ steps, activeStep, activeDropped, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Four pads per row; step 5 starts the next row. */}
      <div className="grid grid-cols-4 gap-x-3 gap-y-3">
        {steps.map((state, i) => {
          const isActive = i === activeStep
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Led on={isActive} hollow={activeDropped} />
              <button
                type="button"
                onClick={() => onChange(cycleStep(steps, i))}
                aria-label={`Step ${i + 1}: ${state}. Click to change.`}
                title="Click to cycle: normal → accent → mute"
                className={`${KEY_BASE} ${PAD_FACE[state]} relative size-14 justify-center text-[10px] ${
                  state === 'mute' ? 'shadow-none active:shadow-none' : ''
                } ${isActive && !activeDropped && state !== 'mute' ? PAD_PRESSED : ''}`}
              >
                {state === 'accent' && <span aria-hidden className="text-base leading-none">▲</span>}
                {state === 'mute' && <span aria-hidden className="tracking-[0.15em]">Mute</span>}
                <span aria-hidden className="absolute bottom-0.5 left-1.5 text-[9px] opacity-50">
                  {i + 1}
                </span>
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-ink-muted">Tap a pad to cycle normal → accent → mute</p>
    </div>
  )
}
