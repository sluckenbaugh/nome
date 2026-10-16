import { cycleStep, type StepState } from '../logic/steps'

interface Props {
  steps: StepState[]
  activeStep: number
  /** The active beat was silenced by Drops: show a dashed outline instead of the normal highlight. */
  activeDropped: boolean
  onChange: (steps: StepState[]) => void
}

const STEP_STYLE: Record<StepState, string> = {
  accent: 'h-14 bg-indigo-600 dark:bg-indigo-500',
  normal: 'h-9 bg-zinc-400 dark:bg-zinc-500',
  mute: 'h-9 bg-transparent border-2 border-dashed border-zinc-300 dark:border-zinc-700',
}

const ACTIVE_STYLE = 'scale-110 ring-4 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
const DROPPED_STYLE = 'outline-2 outline-offset-4 outline-dashed outline-zinc-400 dark:outline-zinc-500'

export function StepGrid({ steps, activeStep, activeDropped, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Four steps per row; step 5 starts the next row. */}
      <div className="grid grid-cols-4 gap-x-3 gap-y-2">
        {steps.map((state, i) => (
          <div key={i} className="flex h-16 w-12 items-end justify-center">
            <button
              type="button"
              onClick={() => onChange(cycleStep(steps, i))}
              aria-label={`Step ${i + 1}: ${state}. Click to change.`}
              title="Click to cycle: normal → accent → mute"
              className={`w-full rounded-md transition-[height,transform,box-shadow] duration-100 ${STEP_STYLE[state]} ${
                i === activeStep ? (activeDropped ? DROPPED_STYLE : ACTIVE_STYLE) : ''
              }`}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-muted">Tap a step to cycle normal → accent → mute</p>
    </div>
  )
}
