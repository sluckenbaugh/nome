import { useCallback, useEffect, useState } from 'react'
import { MetronomeEngine, type ActiveBeat, type EngineSettings } from '../audio/MetronomeEngine'

/** Owns a single MetronomeEngine and keeps it in sync with React state. */
export function useMetronome({ bpm, steps, volume, drops, kit }: EngineSettings) {
  const [engine] = useState(() => new MetronomeEngine({ bpm, steps, volume, drops, kit }))
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeBeat, setActiveBeat] = useState<ActiveBeat>({ step: -1, dropped: false, count: 0 })

  useEffect(() => engine.subscribe(setActiveBeat), [engine])
  useEffect(() => () => engine.stop(), [engine])

  useEffect(() => engine.setBpm(bpm), [engine, bpm])
  useEffect(() => engine.setSteps(steps), [engine, steps])
  useEffect(() => engine.setVolume(volume), [engine, volume])
  useEffect(() => engine.setDrops(drops), [engine, drops])
  useEffect(() => engine.setKit(kit), [engine, kit])

  const toggle = useCallback(() => {
    if (engine.isRunning) engine.stop()
    else engine.start()
    setIsPlaying(engine.isRunning)
  }, [engine])

  return { isPlaying, activeBeat, activeStep: activeBeat.step, activeDropped: activeBeat.dropped, toggle }
}
