interface Props {
  on: boolean
  /** Outline only: used for a beat that Drops silenced. */
  hollow?: boolean
  className?: string
}

export function Led({ on, hollow = false, className = 'size-2.5' }: Props) {
  const state = !on
    ? 'bg-led-off shadow-[inset_0_1px_1px_rgb(0_0_0/0.4)]'
    : hollow
      ? 'border-2 border-amber bg-transparent'
      : 'bg-amber shadow-[0_0_6px_2px_rgb(242_162_12/0.65)]'
  return <span aria-hidden className={`inline-block shrink-0 rounded-full transition-[background-color,box-shadow] duration-75 ${state} ${className}`} />
}
