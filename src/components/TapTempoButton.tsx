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
      className={`h-14 w-full rounded-full border-2 text-lg font-bold transition-colors ${
        flash
          ? 'border-amber-400 bg-amber-400 text-zinc-900'
          : 'border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500'
      }`}
    >
      Tap <span className="text-xs font-medium opacity-60">(Return)</span>
    </button>
  )
}
