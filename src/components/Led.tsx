interface Props {
  on: boolean
  /** Outline only: used for a beat that Drops silenced. */
  hollow?: boolean
  /** Red for use on accent surfaces (the Start key), where an accent LED would vanish. */
  tone?: 'accent' | 'red'
  className?: string
}

export function Led({ on, hollow = false, tone = 'accent', className = 'size-2.5' }: Props) {
  const state = !on
    ? 'border border-ink-muted/60 bg-transparent'
    : hollow
      ? 'border-2 border-accent bg-transparent'
      : tone === 'red'
        ? 'border border-line bg-[#e0321b]'
        : 'border border-line bg-accent'
  return <span aria-hidden className={`inline-block shrink-0 rounded-full transition-colors duration-75 ${state} ${className}`} />
}
