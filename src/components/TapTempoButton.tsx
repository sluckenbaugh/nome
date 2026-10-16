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
      // Small screens: a large square key (LED, label, "↵ Return" stacked). Wide layout: the narrower
      // tall key with just "↵".
      className={`${KEY} w-full flex-col gap-2 text-lg md:gap-1 md:text-sm`}
    >
      <Led on={flash} className="size-3 md:size-2" />
      Tap
      <span className="text-[10px] tracking-widest text-ink-muted md:text-[9px]">
        ↵<span className="md:hidden"> Return</span>
      </span>
    </button>
  )
}
