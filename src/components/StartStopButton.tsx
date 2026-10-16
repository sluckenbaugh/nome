import { Led } from './Led'
import { KEY_BASE, KEY_CAPS } from './ui'

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
      // Near-black with accent text while playing (in both themes), so the red LED stays visible.
        className={`${KEY_BASE} ${KEY_CAPS} h-14 w-full justify-center gap-3 border-line text-lg ${isPlaying ? 'bg-lcd text-accent' : 'bg-accent text-lcd'}`}
    >
        <Led on={isPlaying} tone="red" />
      {isPlaying ? 'Stop' : 'Start'}
      <span className="text-[10px] tracking-[0.2em] opacity-60">Space</span>
      </button>
    </div>
  )
}
