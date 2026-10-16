import { useEffect, useRef } from 'react'

interface Shortcuts {
  /** Space */
  onSpace: () => void
  /** Enter/Return; receives the event timestamp (ms) for accurate tap timing. */
  onEnter: (timeMs: number) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || target instanceof HTMLTextAreaElement) return true
  return target instanceof HTMLInputElement && target.type !== 'range' && target.type !== 'checkbox'
}

/**
 * Space/Enter shortcuts are skipped while typing, and when a button or select was reached by keyboard (Tab)
 * so keyboard users can still activate the focused control. A button focused by a mouse/touch press
 * doesn't count, so clicking Start and then pressing Space stops it.
 *
 * `:focus-visible` can't be used for this: Chromium turns it on for any focused element as soon as a
 * key is pressed, so a mouse-focused button would match by the time the shortcut handler runs.
 */
function shouldHandle(e: KeyboardEvent, keyboardNav: boolean): boolean {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return false
  if (isTypingTarget(e.target)) return false
  // Buttons and the custom Select (role=combobox) use Space/Enter themselves when reached by keyboard.
  return !(keyboardNav && e.target instanceof HTMLElement && e.target.matches('button, [role="combobox"]'))
}

/** Global keys: Space → start/stop, Enter → tap tempo. */
export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  const latest = useRef(shortcuts)
  useEffect(() => {
    latest.current = shortcuts
  })

  useEffect(() => {
    let keyboardNav = false
    const onPointerDown = () => {
      keyboardNav = false
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') keyboardNav = true
      const isSpace = e.code === 'Space'
      const isEnter = e.key === 'Enter'
      if ((!isSpace && !isEnter) || !shouldHandle(e, keyboardNav)) return
      // Also stops the key from activating a mouse-focused button, which would double-fire.
      e.preventDefault()
      if (e.repeat) return
      if (isSpace) latest.current.onSpace()
      else latest.current.onEnter(e.timeStamp)
    }
    // Buttons activate on Space keyup, so block that too.
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && shouldHandle(e, keyboardNav)) e.preventDefault()
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])
}
