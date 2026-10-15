import { useCallback, useEffect, useRef, useState } from 'react'
import { TapTempo } from '../logic/tapTempo'

const FLASH_MS = 100

/** Feeds tap timestamps into TapTempo and reports the detected BPM; `flash` briefly lights the Tap button. */
export function useTapTempo(onTempo: (bpm: number) => void) {
  const tapper = useRef(new TapTempo())
  const [flash, setFlash] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const tap = useCallback(
    (timeMs: number) => {
      const bpm = tapper.current.tap(timeMs)
      if (bpm !== null) onTempo(bpm)
      setFlash(true)
      clearTimeout(flashTimer.current)
      flashTimer.current = setTimeout(() => setFlash(false), FLASH_MS)
    },
    [onTempo],
  )

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  return { tap, flash }
}
