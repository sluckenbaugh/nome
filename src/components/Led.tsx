interface Props {
  on: boolean
  /** Outline only: used for a beat that Drops silenced. */
  hollow?: boolean
  /** Red for use on amber surfaces (the Start key), where an amber LED would vanish. */
  tone?: 'amber' | 'red'
  className?: string
}

export function Led({ on, hollow = false, tone = 'amber', className = 'size-2.5' }: Props) {
  const state = !on
    ? 'border border-ink-muted/60 bg-transparent'
    : hollow
      ? 'border-2 border-amber bg-transparent'
      : tone === 'red'
        ? 'border border-line bg-[#e0321b]'
        : 'border border-line bg-amber'
  return <span aria-hidden className={`inline-block shrink-0 rounded-full transition-colors duration-75 ${state} ${className}`} />
}
