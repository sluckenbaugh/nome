import { describe, expect, it } from 'vitest'
import { addStep, cycleStep, isSteps, MAX_STEPS, nextStepState, removeStep, type StepState } from './steps'

describe('nextStepState', () => {
  it('cycles normal → accent → mute → normal', () => {
    expect(nextStepState('normal')).toBe('accent')
    expect(nextStepState('accent')).toBe('mute')
    expect(nextStepState('mute')).toBe('normal')
  })
})

describe('cycleStep', () => {
  it('changes only the given step and does not mutate the input', () => {
    const steps: StepState[] = ['accent', 'normal', 'normal']
    expect(cycleStep(steps, 1)).toEqual(['accent', 'accent', 'normal'])
    expect(steps).toEqual(['accent', 'normal', 'normal'])
  })
})

describe('addStep / removeStep', () => {
  it('adds a normal step up to the max', () => {
    expect(addStep(['accent'])).toEqual(['accent', 'normal'])
    const full = Array<StepState>(MAX_STEPS).fill('normal')
    expect(addStep(full)).toHaveLength(MAX_STEPS)
  })
  it('removes the last step but never goes below one', () => {
    expect(removeStep(['accent', 'mute'])).toEqual(['accent'])
    expect(removeStep(['accent'])).toEqual(['accent'])
  })
})

describe('isSteps', () => {
  it('validates stored step arrays', () => {
    expect(isSteps(['accent', 'normal', 'mute'])).toBe(true)
    expect(isSteps([])).toBe(false)
    expect(isSteps(Array(8).fill('normal'))).toBe(false)
    expect(isSteps(['loud'])).toBe(false)
    expect(isSteps('normal')).toBe(false)
  })
})
