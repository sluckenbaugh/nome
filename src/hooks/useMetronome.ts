import { useCallback, useEffect, useState } from 'react'
import { MetronomeEngine, type ActiveBeat, type EngineSettings } from '../audio/MetronomeEngine'

/** Owns a single MetronomeEngine and keeps it in sync with React state. */
export function useMetronome({ bpm, steps, volume, drops }: EngineSettings) {
  const [engine] = useState(() => new MetronomeEngine({ bpm, steps, volume, drops }))
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeBeat, setActiveBeat] = useState<ActiveBeat>({ step: -1, dropped: false })

  useEffect(() => engine.subscribe(setActiveBeat), [engine])
  useEffect(() => () => engine.stop(), [engine])

  useEffect(() => engine.setBpm(bpm), [engine, bpm])
  useEffect(() => engine.setSteps(steps), [engine, steps])
  useEffect(() => engine.setVolume(volume), [engine, volume])
  useEffect(() => engine.setDrops(drops), [engine, drops])

  const toggle = useCallback(() => {
    if (engine.isRunning) engine.stop()
    else engine.start()
    setIsPlaying(engine.isRunning)
  }, [engine])

  return { isPlaying, activeStep: activeBeat.step, activeDropped: activeBeat.dropped, toggle }
}
