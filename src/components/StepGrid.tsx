import { cycleStep, type StepState } from '../logic/steps'
import { Led } from './Led'
import { KEY_BASE, KEY_FACE, KEY_INVERTED } from './ui'

interface Props {
  steps: StepState[]
  activeStep: number
  /** The active beat was silenced by Drops: its LED shows hollow and the pad doesn't invert. */
  activeDropped: boolean
  onChange: (steps: StepState[]) => void
}

const PAD_FACE: Record<StepState, string> = {
  normal: KEY_FACE,
  accent: 'border-line bg-amber text-lcd',
  // Muted pads get the classic grey dither, like a disabled control.
  mute: 'dither border-ink-muted/60 bg-panel text-ink-muted',
}

/**
 * On its beat a pad flashes inverted. Accents go near-black with amber (in both themes, since `ink` is
 * light in dark mode) so they still read as accents.
 */
const PAD_ON_BEAT: Record<StepState, string> = {
  normal: KEY_INVERTED,
  accent: 'border-line bg-lcd text-amber',
  mute: PAD_FACE.mute,
}

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
                className={`${KEY_BASE} ${isActive && !activeDropped ? PAD_ON_BEAT[state] : PAD_FACE[state]} relative size-14 justify-center text-[10px]`}
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
