import { Led } from './Led'
import { KEY } from './ui'

interface Props {
  flash: boolean
  onTap: (timeMs: number) => void
}

export function TapTempoButton({ flash, onTap }: Props) {
  return (
    <button
      type="button"
      // pointerdown rather than click: it fires on press, so the timing matches the user's tap.
      onPointerDown={(e) => onTap(e.timeStamp)}
      // detail === 0 means keyboard activation (button focused via Tab); pointer taps are handled above.
      onClick={(e) => e.detail === 0 && onTap(e.timeStamp)}
      aria-keyshortcuts="Enter"
      aria-label="Tap tempo"
      // A compact row (LED + Tap) in the narrow tempo layout; stacked with the ↵ hint when there's room.
      className={`${KEY} w-full gap-1.5 text-sm @min-[19rem]:flex-col @min-[19rem]:gap-1`}
    >
      <Led on={flash} className="size-2" />
      Tap
      <span className="hidden text-[9px] tracking-widest text-ink-muted @min-[19rem]:inline">↵</span>
    </button>
  )
}
