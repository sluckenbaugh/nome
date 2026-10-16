import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Window } from './Window'

export const SITE_TITLE = 'Nome'

interface Props {
  /** Window title and main heading. */
  title: string
  /** Browser tab title; defaults to "<title> — Nome". */
  documentTitle?: string
  /** Width classes for the window column (or both columns, with `aside`). */
  widthClassName?: string
  /** A second window: below the main one, or beside it (2:1) from the `lg` breakpoint. */
  aside?: ReactNode
  children: ReactNode
}

/**
 * A page's window on the desktop. Sets the tab title and, after an in-app navigation, moves focus
 * to the page heading so screen readers announce the new page.
 */
export function Page({ title, documentTitle, widthClassName = 'max-w-md md:max-w-3xl', aside, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // React Router gives the entry the app loaded on the key 'default'. That page keeps the browser's
  // normal focus; only in-app navigations move focus to the new heading.
  const isInitialLoad = useLocation().key === 'default'

  useEffect(() => {
    document.title = documentTitle ?? `${title} — ${SITE_TITLE}`
  }, [title, documentTitle])

  useEffect(() => {
    if (!isInitialLoad) ref.current?.querySelector('h1')?.focus()
  }, [isInitialLoad])

  return (
    <div ref={ref} className={`mx-auto px-3 pt-10 sm:pt-16 ${widthClassName}`}>
      {aside ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Window title={title}>{children}</Window>
          {aside}
        </div>
      ) : (
        <Window title={title}>{children}</Window>
      )}
    </div>
  )
}
