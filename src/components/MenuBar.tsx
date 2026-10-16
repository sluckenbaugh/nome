import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

export interface MenuItem {
  label: string
  checked: boolean
  onSelect: () => void
}

export interface Menu {
  label: string
  items: MenuItem[]
}

interface Props {
  appName: string
  menus: Menu[]
}

/**
 * Classic Mac-style menu bar. Each title opens a menu of radio items (checkmark on the current
 * choice). Mouse: click a title to open, hover another title to switch, click outside to close.
 * Keyboard: ↓ / Enter / Space on a title opens it; in a menu ↑/↓/Home/End move, ←/→ switch menus,
 * Enter/Space choose, Esc closes. Keys handled here don't reach the global Space/Enter shortcuts.
 */
export function MenuBar({ appName, menus }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([])
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Focus the checked item (or the first) whenever a menu opens.
  useEffect(() => {
    if (open === null) return
    const checked = menus[open].items.findIndex((item) => item.checked)
    itemRefs.current[Math.max(0, checked)]?.focus()
  }, [open, menus])

  useEffect(() => {
    if (open === null) return
    const onPointerDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const close = (refocusTitle: boolean) => {
    if (refocusTitle && open !== null) titleRefs.current[open]?.focus()
    setOpen(null)
  }

  const onTitleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(index)
    }
  }

  const onItemKeyDown = (e: KeyboardEvent, menuIndex: number, itemIndex: number) => {
    const items = menus[menuIndex].items
    const focusItem = (i: number) => itemRefs.current[(i + items.length) % items.length]?.focus()
    const handled = () => {
      e.preventDefault()
      e.stopPropagation()
    }
    switch (e.key) {
      case 'ArrowDown':
        handled()
        focusItem(itemIndex + 1)
        break
      case 'ArrowUp':
        handled()
        focusItem(itemIndex - 1)
        break
      case 'Home':
        handled()
        focusItem(0)
        break
      case 'End':
        handled()
        focusItem(items.length - 1)
        break
      case 'ArrowRight':
      case 'ArrowLeft':
        handled()
        setOpen((menuIndex + (e.key === 'ArrowRight' ? 1 : -1) + menus.length) % menus.length)
        break
      case 'Enter':
      case ' ':
        handled()
        items[itemIndex].onSelect()
        close(true)
        break
      case 'Escape':
        handled()
        close(true)
        break
      case 'Tab':
        setOpen(null)
        break
    }
  }

  return (
    <div ref={barRef} className="sticky top-0 z-30 border-b border-line bg-panel shadow-[0_1px_0_var(--color-shadow)]">
      <nav aria-label="Menu" className="mx-auto flex h-8 max-w-md items-stretch px-1 md:max-w-3xl">
        <span className="flex items-center px-2 text-sm font-bold">{appName}</span>
        {menus.map((menu, m) => (
          <div key={menu.label} className="relative flex">
            <button
              ref={(el) => {
                titleRefs.current[m] = el
              }}
              type="button"
              aria-haspopup="menu"
              aria-expanded={open === m}
              onClick={() => setOpen(open === m ? null : m)}
              onPointerEnter={() => open !== null && open !== m && setOpen(m)}
              onKeyDown={(e) => onTitleKeyDown(e, m)}
              className={`px-2.5 text-sm outline-none focus-visible:underline ${open === m ? 'bg-ink text-panel' : ''}`}
            >
              {menu.label}
            </button>
            {open === m && (
              <div
                role="menu"
                aria-label={menu.label}
                className="absolute top-full left-0 min-w-44 border border-line bg-panel py-1 shadow-[2px_2px_0_var(--color-shadow)]"
              >
                {menu.items.map((item, i) => (
                  <button
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[i] = el
                    }}
                    type="button"
                    role="menuitemradio"
                    aria-checked={item.checked}
                    tabIndex={-1}
                    onClick={() => {
                      item.onSelect()
                      close(false)
                    }}
                    onKeyDown={(e) => onItemKeyDown(e, m, i)}
                    onPointerEnter={(e) => e.currentTarget.focus()}
                    className="flex w-full items-center gap-2 px-2 py-1 text-left text-sm outline-none focus:bg-ink focus:text-panel"
                  >
                    <span aria-hidden className="w-3 text-center">
                      {item.checked ? '✓' : ''}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
