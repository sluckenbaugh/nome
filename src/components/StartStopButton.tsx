interface Props {
  isPlaying: boolean
  onToggle: () => void
}

export function StartStopButton({ isPlaying, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isPlaying}
      aria-keyshortcuts="Space"
      className={`h-14 w-40 rounded-full text-lg font-bold text-white shadow-md transition-colors ${
        isPlaying ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {isPlaying ? 'Stop' : 'Start'} <span className="text-xs font-medium opacity-70">(Space)</span>
    </button>
  )
}
