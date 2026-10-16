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
    // Container queries: the layout follows the Tempo box's own width (narrow phones, and the
    // two-column wide layout), not the screen width.
    <div className="@container flex flex-col gap-3">
      {/*
        Narrow (< 19rem of content): the field takes a full row and the five keys sit in one row
        beneath it, with Tap given a wider slot. Wider: field on the left, keys in a 2×2 block with a tall Tap key on the right.
      */}
      <div className="flex flex-col gap-3 @min-[19rem]:flex-row @min-[19rem]:items-stretch">
        {/* Classic text field: editable tempo, beat light and units underneath. */}
        <label className="flex min-w-0 flex-1 flex-col justify-center rounded-[4px] border border-line bg-key px-3 py-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
          <CommitNumberInput
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onCommit={(value) => onChange(clampBpm(value))}
            className="w-full bg-transparent text-right text-5xl leading-none font-semibold tabular-nums text-ink caret-accent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Tempo in beats per minute"
          />
          <span className="mt-1.5 flex items-center justify-between">
            {beatLight}
            <span className="text-[10px] font-bold tracking-[0.2em] text-ink-muted">BPM</span>
          </span>
        </label>

        <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_1.5fr] gap-2 @min-[19rem]:grid-cols-[repeat(2,2.5rem)_3.25rem] @min-[19rem]:grid-rows-2">
          <button type="button" className={KEY_SM} onClick={() => onChange(clampBpm(bpm - 1))} disabled={bpm <= MIN_BPM} aria-label="Decrease tempo">
            −
          </button>
          <button type="button" className={KEY_SM} onClick={() => onChange(clampBpm(bpm + 1))} disabled={bpm >= MAX_BPM} aria-label="Increase tempo">
            +
          </button>
          <button type="button" className={KEY_SM} onClick={() => onChange(halveBpm(bpm))} disabled={bpm <= MIN_BPM} aria-label="Halve tempo">
            /2
          </button>
          <button type="button" className={KEY_SM} onClick={() => onChange(doubleBpm(bpm))} disabled={bpm >= MAX_BPM} aria-label="Double tempo">
            ×2
          </button>
          {/* Last in source order so Tab follows the visual order; pinned to the right column when wide. */}
          <div className="flex @min-[19rem]:col-start-3 @min-[19rem]:row-span-2 @min-[19rem]:row-start-1">{tapKey}</div>
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
