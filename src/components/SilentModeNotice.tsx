import { useEffect, useRef, type KeyboardEvent } from 'react'
import { canBypassSilentMode } from '../audio/audioSession'
import { KEY_SM } from './ui'
import { Window } from './Window'

const SEEN_KEY = 'nome:silent-notice-seen'

/**
 * Touch devices (phones, tablets) are the ones with a silent mode that mutes Web Audio, unless the
 * browser lets the engine switch to a playback audio session.
 */
function shouldShow(): boolean {
  if (!window.matchMedia('(pointer: coarse)').matches || canBypassSilentMode()) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) === null
  } catch {
    return true
  }
}

/** A dialog shown once per browser session on touch devices, reminding users to turn off silent mode. */
export function SilentModeNotice() {
  const ref = useRef<HTMLDialogElement>(null)
  const okRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!shouldShow()) return
    ref.current?.showModal()
    // showModal would otherwise focus the title heading (it has tabIndex -1), so start on OK.
    okRef.current?.focus()
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // Without storage it shows again on the next load, which is fine.
    }
  }, [])

  // Keep Space/Enter on the OK button from reaching the global start/stop and tap-tempo shortcuts.
  const stopShortcut = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.code === 'Space') e.stopPropagation()
  }

  return (
    <dialog
      ref={ref}
      aria-label="Sound"
      aria-describedby="silent-notice-text"
      onKeyDown={stopShortcut}
      onKeyUp={stopShortcut}
      className="m-auto w-[calc(100%-2rem)] max-w-xs overflow-visible bg-transparent p-0 font-sans text-ink backdrop:bg-black/40"
    >
      <Window title="Sound" headingLevel="h2">
        <p id="silent-notice-text" className="text-sm">
          Silent mode must be turned off on your device to hear the metronome.
        </p>
        <form method="dialog" className="mt-4 flex justify-end">
          <button type="submit" ref={okRef} className={KEY_SM}>
            OK
          </button>
        </form>
      </Window>
    </dialog>
  )
}
