import type { ReactNode } from 'react'
import { CommitNumberInput } from './CommitNumberInput'
import { SliderRow } from './SliderRow'
import { KEY_SM } from './ui'
import { clampBpm, doubleBpm, halveBpm, MAX_BPM, MIN_BPM } from '../logic/tempo'

interface Props {
  bpm: number
  onChange: (bpm: number) => void
  /** Rendered beside the tempo keys (the Tap key). */
  tapKey: ReactNode
  /** Rendered in the LCD's bottom-left corner (the beat light). */
  beatLight: ReactNode
}

export function TempoControl({ bpm, onChange, tapKey, beatLight }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-3">
        {/* Recessed LCD: faint unlit "888" segments sit behind the editable lit digits. */}
        <label className="relative flex flex-1 flex-col justify-center rounded-[4px] border border-line bg-lcd px-3 py-2">
          <span className="relative ml-auto font-lcd text-[2.6rem] leading-none">
            <span aria-hidden className="text-lcd-on/10">
              888
            </span>
            <CommitNumberInput
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              onCommit={(value) => onChange(clampBpm(value))}
              className="absolute inset-0 w-full bg-transparent text-right font-lcd text-lcd-on caret-lcd-on outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Tempo in beats per minute"
            />
          </span>
          <span className="mt-1 flex items-center justify-between">
            {beatLight}
            <span className="text-[10px] font-bold tracking-[0.2em] text-lcd-on/60">BPM</span>
          </span>
        </label>

        <div className="grid grid-cols-[repeat(2,2.5rem)_3.25rem] grid-rows-2 gap-2">
          <button type="button" className={KEY_SM} onClick={() => onChange(clampBpm(bpm - 1))} disabled={bpm <= MIN_BPM} aria-label="Decrease tempo">
            −
          </button>
          <button type="button" className={KEY_SM} onClick={() => onChange(clampBpm(bpm + 1))} disabled={bpm >= MAX_BPM} aria-label="Increase tempo">
            +
          </button>
          <div className="row-span-2 flex">{tapKey}</div>
          <button type="button" className={KEY_SM} onClick={() => onChange(halveBpm(bpm))} disabled={bpm <= MIN_BPM} aria-label="Halve tempo">
            /2
          </button>
          <button type="button" className={KEY_SM} onClick={() => onChange(doubleBpm(bpm))} disabled={bpm >= MAX_BPM} aria-label="Double tempo">
            ×2
          </button>
        </div>
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
    </div>
  )
}
