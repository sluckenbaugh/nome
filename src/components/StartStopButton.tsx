import { Led } from './Led'
import { KEY_BASE, KEY_LATCHED } from './ui'

interface Props {
  isPlaying: boolean
  onToggle: () => void
}

export function StartStopButton({ isPlaying, onToggle }: Props) {
  return (
    // Classic default-button ring: a thick rounded outline set slightly apart from the key.
    <div className="rounded-[10px] border-[3px] border-line p-[2px]">
      <button
      type="button"
      onClick={onToggle}
      aria-pressed={isPlaying}
      aria-keyshortcuts="Space"
      className={`${KEY_BASE} h-14 w-full justify-center gap-3 border-amber-deep bg-amber text-lg text-lcd ${isPlaying ? KEY_LATCHED : ''}`}
    >
        <Led on={isPlaying} tone="red" />
      {isPlaying ? 'Stop' : 'Start'}
      <span className="text-[10px] tracking-[0.2em] opacity-60">Space</span>
      </button>
    </div>
  )
}
