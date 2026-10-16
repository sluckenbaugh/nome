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
      // A large key beside the tempo field: LED and label stacked, plus the Return hint on wide screens.
      className={`${KEY} w-full flex-col gap-2 text-lg`}
    >
      <Led on={flash} className="size-3" />
      Tap
      {/* Keyboard hint only on wider screens; small screens are mostly touch, with no Return key. */}
      <span className="hidden text-[10px] tracking-widest text-ink-muted md:inline">↵ Return</span>
    </button>
  )
}
