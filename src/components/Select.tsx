import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { KEY_BASE, KEY_FACE } from './ui'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  /** id of the element that labels this control. */
  labelledBy: string
}

const TYPEAHEAD_RESET_MS = 500
/** Approximate open-list height, used to decide whether to open upward. */
const LIST_MAX_HEIGHT = 256

/**
 * Custom select styled to match the app. Follows the WAI-ARIA "select-only combobox" pattern:
 * focus stays on the trigger and the highlighted option is tracked with aria-activedescendant.
 *
 * Keys: ↑/↓/Home/End move (and open), Enter/Space open (when reached by Tab) and choose, Esc closes, Tab chooses and moves on,
 * typing letters jumps to a matching option.
 */
export function Select({ options, value, onChange, labelledBy }: Props) {
  const id = useId()
  const listId = `${id}-list`
  const optionId = (i: number) => `${id}-opt-${i}`

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [openUp, setOpenUp] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', time: 0 })
  /** Focused by a click/tap rather than Tab: Space/Enter then go to the global shortcuts instead of opening. */
  const focusedByPointer = useRef(false)

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))
  const selected = options[selectedIndex]

  const openList = (index = selectedIndex) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) setOpenUp(window.innerHeight - rect.bottom < LIST_MAX_HEIGHT && rect.top > window.innerHeight - rect.bottom)
    setActive(index)
    setOpen(true)
  }

  const choose = (index: number) => {
    onChange(options[index].value)
    setOpen(false)
  }

  // Close when clicking anywhere outside.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Keep the highlighted option visible when the list scrolls.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const jumpToTyped = (char: string): number | null => {
    const now = Date.now()
    const t = typeahead.current
    t.text = now - t.time > TYPEAHEAD_RESET_MS ? char : t.text + char
    t.time = now
    const from = open ? active : selectedIndex
    // A repeated single letter cycles through matches; otherwise match the typed prefix.
    const prefix = t.text.split('').every((c) => c === t.text[0]) ? t.text[0] : t.text
    for (let step = prefix.length === 1 ? 1 : 0; step <= options.length; step++) {
      const i = (from + step) % options.length
      if (options[i].label.toLowerCase().startsWith(prefix)) return i
    }
    return null
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1
    const handled = () => {
      e.preventDefault()
      // Keep Space/Enter from also reaching the global start/stop and tap-tempo shortcuts.
      e.stopPropagation()
    }

    if (!open) {
      const isActivationKey = e.key === 'Enter' || e.key === ' '
      if (isActivationKey && focusedByPointer.current) return
      if (['ArrowDown', 'ArrowUp'].includes(e.key) || isActivationKey) {
        handled()
        openList()
      } else if (e.key === 'Home' || e.key === 'End') {
        handled()
        openList(e.key === 'Home' ? 0 : last)
      } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const i = jumpToTyped(e.key.toLowerCase())
        if (i !== null) onChange(options[i].value)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        handled()
        setActive((i) => Math.min(last, i + 1))
        break
      case 'ArrowUp':
        handled()
        if (e.altKey) choose(active)
        else setActive((i) => Math.max(0, i - 1))
        break
      case 'Home':
      case 'PageUp':
        handled()
        setActive(0)
        break
      case 'End':
      case 'PageDown':
        handled()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        handled()
        choose(active)
        break
      case 'Escape':
        handled()
        setOpen(false)
        break
      case 'Tab':
        choose(active)
        break
      default:
        if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          handled()
          const i = jumpToTyped(e.key.toLowerCase())
          if (i !== null) setActive(i)
        }
    }
  }

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <div
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onPointerDown={() => (focusedByPointer.current = true)}
        onBlur={() => {
          focusedByPointer.current = false
          setOpen(false)
        }}
        className={`${KEY_BASE} ${KEY_FACE} h-9 w-full cursor-pointer justify-between px-3 text-sm`}
      >
        <span className="truncate">{selected?.label}</span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={`size-4 shrink-0 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          // Keep focus on the trigger while clicking options.
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute inset-x-0 z-20 max-h-64 overflow-auto border border-line bg-panel py-1 shadow-[2px_2px_0_var(--color-shadow)] ${
            openUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {options.map((option, i) => {
            const isSelected = i === selectedIndex
            return (
              <li
                key={option.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                onClick={() => choose(i)}
                onMouseMove={() => setActive(i)}
                // Highlighted option is inverted, like the menu bar's menus.
                className={`flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm font-semibold uppercase tracking-wider ${
                  i === active ? 'bg-ink text-panel' : isSelected ? 'text-amber-deep dark:text-amber' : 'text-ink'
                }`}
              >
                {option.label}
                {isSelected && (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden className="size-4">
                    <path d="m4.5 10.5 3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
