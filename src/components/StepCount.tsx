import { addStep, MAX_STEPS, MIN_STEPS, removeStep, setStepCount, type StepState } from '../logic/steps'
import { CommitNumberInput } from './CommitNumberInput'
import { KEY_SM } from './ui'

interface Props {
  steps: StepState[]
  onChange: (steps: StepState[]) => void
}

export function StepCount({ steps, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={KEY_SM} onClick={() => onChange(removeStep(steps))} disabled={steps.length <= MIN_STEPS} aria-label="Remove step">
        −
      </button>
      <CommitNumberInput
        min={MIN_STEPS}
        max={MAX_STEPS}
        value={steps.length}
        onCommit={(count) => onChange(setStepCount(steps, count))}
        aria-label={`Number of steps (${MIN_STEPS}–${MAX_STEPS})`}
        className="lcd-glow h-9 w-11 rounded-[4px] bg-lcd text-center font-lcd text-base text-lcd-on caret-lcd-on shadow-[inset_0_2px_4px_rgb(0_0_0/0.7)] outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-amber [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={KEY_SM} onClick={() => onChange(addStep(steps))} disabled={steps.length >= MAX_STEPS} aria-label="Add step">
        +
      </button>
    </div>
  )
}
