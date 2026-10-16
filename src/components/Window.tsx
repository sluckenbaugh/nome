import type { ReactNode } from 'react'

interface Props {
  /** Shown centred in the title bar; also the page's main heading. */
  title: string
  /** Controls at the right end of the title bar. */
  titleAside?: ReactNode
  /** Heading level for the title: h1 for a page's window, h2 for a dialog shown over a page. */
  headingLevel?: 'h1' | 'h2'
  children: ReactNode
}

/** A classic Mac window: pinstriped title bar, 1px outline and a hard shadow. */
export function Window({ title, titleAside, headingLevel: Heading = 'h1', children }: Props) {
  return (
    <div className="border border-line bg-panel shadow-[4px_4px_0_var(--color-shadow)]">
      <div className="relative flex h-8 items-center border-b border-line px-2">
        <span aria-hidden className="title-stripes absolute inset-x-1.5 top-[6px] bottom-[7px]" />
        <Heading tabIndex={-1} className="outline-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-panel px-2 py-1 text-base leading-none font-bold">{title}</Heading>
        {titleAside && <div className="relative ml-auto bg-panel pl-1">{titleAside}</div>}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}
