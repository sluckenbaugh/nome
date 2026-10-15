import { CommitNumberInput } from './CommitNumberInput'
import { SliderRow } from './SliderRow'
import { clampBpm, doubleBpm, halveBpm, MAX_BPM, MIN_BPM } from '../logic/tempo'

interface Props {
  bpm: number
  onChange: (bpm: number) => void
}

const smallButton =
  'h-10 min-w-10 rounded-full px-3 text-sm font-semibold bg-zinc-200 text-zinc-800 hover:bg-zinc-300 ' +
  'dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none'

export function TempoControl({ bpm, onChange }: Props) {
  return (
    <section aria-label="Tempo" className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button type="button" className={smallButton} onClick={() => onChange(clampBpm(bpm - 1))} disabled={bpm <= MIN_BPM} aria-label="Decrease tempo">
          −
        </button>
        <label className="flex flex-col items-center">
          <CommitNumberInput
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onCommit={(value) => onChange(clampBpm(value))}
            className="w-40 bg-transparent text-center text-7xl font-bold tabular-nums tracking-tight outline-none [appearance:textfield] focus:text-indigo-600 dark:focus:text-indigo-400 [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Tempo in beats per minute"
          />
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">BPM</span>
        </label>
        <button type="button" className={smallButton} onClick={() => onChange(clampBpm(bpm + 1))} disabled={bpm >= MAX_BPM} aria-label="Increase tempo">
          +
        </button>
      </div>

      <SliderRow
        display={String(bpm)}
        value={bpm}
        min={MIN_BPM}
        max={MAX_BPM}
        onChange={onChange}
        ariaLabel="Tempo slider"
        ariaValueText={`${bpm} BPM`}
      />

      <div className="flex gap-2">
        <button type="button" className={smallButton} onClick={() => onChange(halveBpm(bpm))} disabled={bpm <= MIN_BPM} aria-label="Halve tempo">
          /2
        </button>
        <button type="button" className={smallButton} onClick={() => onChange(doubleBpm(bpm))} disabled={bpm >= MAX_BPM} aria-label="Double tempo">
          ×2
        </button>
      </div>
    </section>
  )
}
