import { useCallback, useEffect, useState } from 'react'
import { MetronomeEngine, type EngineSettings } from '../audio/MetronomeEngine'

/** Owns a single MetronomeEngine and keeps it in sync with React state. */
export function useMetronome({ bpm, steps, volume }: EngineSettings) {
  const [engine] = useState(() => new MetronomeEngine({ bpm, steps, volume }))
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => engine.subscribe(setActiveStep), [engine])
  useEffect(() => () => engine.stop(), [engine])

  useEffect(() => engine.setBpm(bpm), [engine, bpm])
  useEffect(() => engine.setSteps(steps), [engine, steps])
  useEffect(() => engine.setVolume(volume), [engine, volume])

  const toggle = useCallback(() => {
    if (engine.isRunning) engine.stop()
    else engine.start()
    setIsPlaying(engine.isRunning)
  }, [engine])

  return { isPlaying, activeStep, toggle }
}
