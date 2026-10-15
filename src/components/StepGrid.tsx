import { addStep, cycleStep, MAX_STEPS, MIN_STEPS, removeStep, setStepCount, type StepState } from '../logic/steps'
import { CommitNumberInput } from './CommitNumberInput'

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

const countButton =
  'size-9 rounded-full text-lg font-semibold bg-zinc-200 text-zinc-800 hover:bg-zinc-300 ' +
  'dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none'

const ACTIVE_STYLE = 'scale-110 ring-4 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
const DROPPED_STYLE = 'outline-2 outline-offset-4 outline-dashed outline-zinc-400 dark:outline-zinc-500'

export function StepGrid({ steps, activeStep, activeDropped, onChange }: Props) {
  return (
    <section aria-label="Steps" className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <button type="button" className={countButton} onClick={() => onChange(removeStep(steps))} disabled={steps.length <= MIN_STEPS} aria-label="Remove step">
          −
        </button>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-500">
          Steps
          <CommitNumberInput
            min={MIN_STEPS}
            max={MAX_STEPS}
            value={steps.length}
            onCommit={(count) => onChange(setStepCount(steps, count))}
            aria-label={`Number of steps (${MIN_STEPS}–${MAX_STEPS})`}
            className="w-14 rounded-md border border-zinc-300 bg-transparent py-1 text-center text-base font-semibold tabular-nums text-zinc-900 outline-none [appearance:textfield] focus:border-indigo-500 dark:border-zinc-700 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none"
          />
        </label>
        <button type="button" className={countButton} onClick={() => onChange(addStep(steps))} disabled={steps.length >= MAX_STEPS} aria-label="Add step">
          +
        </button>
      </div>

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

      <p className="text-xs text-zinc-500">Tap a step to cycle normal → accent → mute</p>
    </section>
  )
}
