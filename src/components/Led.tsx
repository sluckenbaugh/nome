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
    ? 'bg-led-off shadow-[inset_0_1px_1px_rgb(0_0_0/0.4)]'
    : hollow
      ? 'border-2 border-amber bg-transparent'
      : tone === 'red'
        ? 'bg-[#e0321b] shadow-[0_0_6px_2px_rgb(224_50_27/0.6)]'
        : 'bg-amber shadow-[0_0_6px_2px_rgb(242_162_12/0.65)]'
  return <span aria-hidden className={`inline-block shrink-0 rounded-full transition-[background-color,box-shadow] duration-75 ${state} ${className}`} />
}
