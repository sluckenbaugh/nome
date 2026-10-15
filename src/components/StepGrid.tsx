import { addStep, cycleStep, MAX_STEPS, MIN_STEPS, removeStep, type StepState } from '../logic/steps'

interface Props {
  steps: StepState[]
  activeStep: number
  onChange: (steps: StepState[]) => void
}

const STEP_STYLE: Record<StepState, string> = {
  accent: 'h-16 bg-indigo-600 dark:bg-indigo-500',
  normal: 'h-11 bg-zinc-400 dark:bg-zinc-500',
  mute: 'h-11 bg-transparent border-2 border-dashed border-zinc-300 dark:border-zinc-700',
}

const countButton =
  'size-9 rounded-full text-lg font-semibold bg-zinc-200 text-zinc-800 hover:bg-zinc-300 ' +
  'dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none'

export function StepGrid({ steps, activeStep, onChange }: Props) {
  return (
    <section aria-label="Steps" className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button type="button" className={countButton} onClick={() => onChange(removeStep(steps))} disabled={steps.length <= MIN_STEPS} aria-label="Remove step">
          −
        </button>
        <div className="flex h-20 items-end gap-2">
          {steps.map((state, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(cycleStep(steps, i))}
              aria-label={`Step ${i + 1}: ${state}. Click to change.`}
              title="Click to cycle: normal → accent → mute"
              className={`w-9 rounded-md transition-[height,transform,box-shadow] duration-100 ${STEP_STYLE[state]} ${
                i === activeStep ? 'scale-110 ring-4 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900' : ''
              }`}
            />
          ))}
        </div>
        <button type="button" className={countButton} onClick={() => onChange(addStep(steps))} disabled={steps.length >= MAX_STEPS} aria-label="Add step">
          +
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        {steps.length} {steps.length === 1 ? 'step' : 'steps'} · tap a step to cycle normal → accent → mute
      </p>
    </section>
  )
}
