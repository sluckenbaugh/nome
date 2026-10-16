import type { ReactNode } from 'react'

interface Props {
  /** Shown centred in the title bar; also the page's main heading. */
  title: string
  /** Controls at the right end of the title bar. */
  titleAside?: ReactNode
  children: ReactNode
}

/** A classic Mac window: pinstriped title bar, 1px outline and a hard shadow. */
export function Window({ title, titleAside, children }: Props) {
  return (
    <div className="border border-line bg-panel shadow-[4px_4px_0_var(--color-shadow)]">
      <div className="relative flex h-8 items-center border-b border-line px-2">
        <span aria-hidden className="title-stripes absolute inset-x-1.5 top-[6px] bottom-[7px]" />
        <h1 tabIndex={-1} className="outline-none absolute left-1/2 -translate-x-1/2 bg-panel px-2 py-1 text-base leading-none font-bold">{title}</h1>
        {titleAside && <div className="relative ml-auto bg-panel pl-1">{titleAside}</div>}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}
