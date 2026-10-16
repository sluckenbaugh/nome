import type { ReactNode } from 'react'
import { SILKSCREEN } from './ui'

interface Props {
  label: string
  /** Controls shown at the right end of the header rule. */
  aside?: ReactNode
  children: ReactNode
}

/** A recessed panel section of the device with a printed label and rule. */
export function Module({ label, aside, children }: Props) {
  return (
    <section
      aria-label={label}
      className="rounded-md border border-rule bg-panel px-4 pt-3 pb-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
    >
      <header className="mb-3 flex min-h-9 items-center gap-3">
        <h2 className={SILKSCREEN}>{label}</h2>
        <span aria-hidden className="h-px flex-1 bg-rule" />
        {aside}
      </header>
      {children}
    </section>
  )
}
