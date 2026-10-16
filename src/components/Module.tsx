import { useId, type ReactNode } from 'react'

interface Props {
  label: string
  /** Controls shown right-aligned at the top of the box. */
  aside?: ReactNode
  children: ReactNode
}

/** A classic group box: thin outline with its title sitting in the top border. */
export function Module({ label, aside, children }: Props) {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className="relative mt-2 border border-ink-muted/60 px-3 pt-5 pb-3">
      <h2 id={titleId} className="absolute -top-2.5 left-2 bg-panel px-1.5 font-pixel text-sm leading-5 font-medium">
        {label}
      </h2>
      {aside && <div className="-mt-1 mb-3 flex justify-end">{aside}</div>}
      {children}
    </section>
  )
}
