export type StepState = 'normal' | 'accent' | 'mute'

export const MIN_STEPS = 1
export const MAX_STEPS = 16
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

export function clampStepCount(count: number): number {
  if (!Number.isFinite(count)) return MIN_STEPS
  return Math.min(MAX_STEPS, Math.max(MIN_STEPS, Math.round(count)))
}

/** Resizes to `count` (clamped to 1–16): extra steps are dropped from the end, new ones are added as normal. */
export function setStepCount(steps: StepState[], count: number): StepState[] {
  const n = clampStepCount(count)
  if (n === steps.length) return steps
  if (n < steps.length) return steps.slice(0, n)
  return [...steps, ...Array<StepState>(n - steps.length).fill('normal')]
}

export function addStep(steps: StepState[]): StepState[] {
  return setStepCount(steps, steps.length + 1)
}

export function removeStep(steps: StepState[]): StepState[] {
  return setStepCount(steps, steps.length - 1)
}

export function isSteps(value: unknown): value is StepState[] {
  return (
    Array.isArray(value) &&
    value.length >= MIN_STEPS &&
    value.length <= MAX_STEPS &&
    value.every((s) => s === 'normal' || s === 'accent' || s === 'mute')
  )
}
