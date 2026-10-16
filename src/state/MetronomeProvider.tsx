import type { ReactNode } from 'react'
import { getKit, isKitId } from '../audio/soundKits'
import { useMetronome } from '../hooks/useMetronome'
import { usePersistentState } from '../hooks/usePersistentState'
import { useTapTempo } from '../hooks/useTapTempo'
import { DEFAULT_DROPS, isDropSettings } from '../logic/drops'
import { SYNTH_KIT_ID } from '../logic/soundKits'
import { DEFAULT_STEPS, isSteps } from '../logic/steps'
import { DEFAULT_BPM, isBpm } from '../logic/tempo'
import { DEFAULT_VOLUME, isVolume } from '../logic/volume'
import { MetronomeContext } from './metronomeContext'

/**
 * Owns the saved settings, the audio engine and tap tempo above the routes, so the metronome keeps
 * playing (and keeps its settings) while the user moves between pages.
 */
export function MetronomeProvider({ children }: { children: ReactNode }) {
  const [bpm, setBpm] = usePersistentState('nome:bpm', DEFAULT_BPM, isBpm)
  const [steps, setSteps] = usePersistentState('nome:steps', DEFAULT_STEPS, isSteps)
  const [volume, setVolume] = usePersistentState('nome:volume', DEFAULT_VOLUME, isVolume)
  const [drops, setDrops] = usePersistentState('nome:drops', DEFAULT_DROPS, isDropSettings)
  const [kitId, setKitId] = usePersistentState('nome:kit', SYNTH_KIT_ID, isKitId)
  const kit = getKit(kitId)
  const { isPlaying, activeBeat, activeStep, activeDropped, toggle } = useMetronome({ bpm, steps, volume, drops, kit })
  const { tap, flash } = useTapTempo(setBpm)

  return (
    <MetronomeContext.Provider
      value={{ bpm, setBpm, steps, setSteps, volume, setVolume, drops, setDrops, kitId, setKitId, kit, isPlaying, activeBeat, activeStep, activeDropped, toggle, tap, flash }}
    >
      {children}
    </MetronomeContext.Provider>
  )
}
