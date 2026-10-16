import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { ActiveBeat } from '../audio/MetronomeEngine'
import type { DropSettings } from '../logic/drops'
import type { SoundKit } from '../logic/soundKits'
import type { StepState } from '../logic/steps'

/** Saved metronome settings, the running engine's state, and tap tempo, shared by every page. */
export interface MetronomeContextValue {
  bpm: number
  setBpm: Dispatch<SetStateAction<number>>
  steps: StepState[]
  setSteps: Dispatch<SetStateAction<StepState[]>>
  volume: number
  setVolume: Dispatch<SetStateAction<number>>
  drops: DropSettings
  setDrops: Dispatch<SetStateAction<DropSettings>>
  kitId: string
  setKitId: Dispatch<SetStateAction<string>>
  kit: SoundKit
  isPlaying: boolean
  activeBeat: ActiveBeat
  activeStep: number
  activeDropped: boolean
  toggle: () => void
  tap: (timeMs: number) => void
  /** True briefly after each tap (lights the Tap key's LED). */
  flash: boolean
}

export const MetronomeContext = createContext<MetronomeContextValue | null>(null)

export function useMetronomeContext(): MetronomeContextValue {
  const value = useContext(MetronomeContext)
  if (!value) throw new Error('useMetronomeContext must be used inside <MetronomeProvider>')
  return value
}
