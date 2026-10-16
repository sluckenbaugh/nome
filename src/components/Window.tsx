import type { ReactNode } from 'react'

interface Props {
  /** Controls at the right end of the title bar. */
  titleAside?: ReactNode
  children: ReactNode
}

/** A classic Mac window: pinstriped title bar titled "Controls", 1px outline and a hard shadow. */
export function Window({ titleAside, children }: Props) {
  return (
    <div className="border border-line bg-panel shadow-[4px_4px_0_var(--color-shadow)]">
      <div className="relative flex h-8 items-center border-b border-line px-2">
        <span aria-hidden className="title-stripes absolute inset-x-1.5 top-[7px] bottom-[7px]" />
        <h1 className="absolute left-1/2 -translate-x-1/2 bg-panel px-2 text-base leading-none font-bold">Controls</h1>
        {titleAside && <div className="relative ml-auto bg-panel pl-1">{titleAside}</div>}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}
