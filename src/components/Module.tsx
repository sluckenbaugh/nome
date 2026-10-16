import { useId, type ReactNode } from 'react'

interface Props {
  label: string
  /** Controls shown right-aligned at the top of the box. */
  aside?: ReactNode
  children: ReactNode
  /** Extra layout classes for where the box sits in its parent (e.g. grid placement). */
  className?: string
  /** Element id, e.g. so a Guide section can be linked to with /guide#id. */
  id?: string
}

/** A classic group box: thin outline with its title sitting in the top border. */
export function Module({ label, aside, children, className = '', id }: Props) {
  const titleId = useId()
  return (
    <section id={id} aria-labelledby={titleId} className={`relative mt-2 flex flex-col border border-ink-muted/60 px-3 pt-5 pb-3 ${className}`}>
      <h2 id={titleId} className="absolute -top-2.5 left-2 bg-panel px-1.5 text-sm leading-5 font-medium">
        {label}
      </h2>
      {aside && <div className="-mt-1 mb-3 flex justify-end">{aside}</div>}
      {children}
    </section>
  )
}
