import { Led } from './Led'

interface Props {
  onStop: () => void
}

/** Menu-bar control shown on other pages while the metronome is playing, so it can be stopped from there. */
export function PlayingIndicator({ onStop }: Props) {
  return (
    <button
      type="button"
      onClick={onStop}
      aria-label="Metronome playing. Stop"
      className="flex h-full items-center gap-2 px-2.5 text-sm outline-none focus-visible:underline"
    >
      <Led on tone="red" className="size-2" />
      <span>Playing</span>
      <span className="font-semibold uppercase">Stop</span>
    </button>
  )
}
