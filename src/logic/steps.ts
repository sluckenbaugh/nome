export type StepState = 'normal' | 'accent' | 'mute'

export const MIN_STEPS = 1
export const MAX_STEPS = 7
export const DEFAULT_STEPS: StepState[] = ['accent', 'normal', 'normal', 'normal']

const CYCLE: Record<StepState, StepState> = {
  normal: 'accent',
  accent: 'mute',
  mute: 'normal',
}

export function nextStepState(state: StepState): StepState {
  return CYCLE[state]
}

export function cycleStep(steps: StepState[], index: number): StepState[] {
  return steps.map((s, i) => (i === index ? nextStepState(s) : s))
}

export function addStep(steps: StepState[]): StepState[] {
  return steps.length >= MAX_STEPS ? steps : [...steps, 'normal']
}

export function removeStep(steps: StepState[]): StepState[] {
  return steps.length <= MIN_STEPS ? steps : steps.slice(0, -1)
}

export function isSteps(value: unknown): value is StepState[] {
  return (
    Array.isArray(value) &&
    value.length >= MIN_STEPS &&
    value.length <= MAX_STEPS &&
    value.every((s) => s === 'normal' || s === 'accent' || s === 'mute')
  )
}
