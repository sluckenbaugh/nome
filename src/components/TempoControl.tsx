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
    // A container, so the number size can follow the Tempo box's own width rather than the screen.
    <div className="@container flex flex-col gap-3">
      {/*
        Small screens: the tempo field and Tap key split the width as two equal squares, with the
        -, +, /2 and x2 keys in a row of four beneath them.
        md and up (wide layout): field on the left, a 2x2 block of keys, and a tall Tap key on the right.
        Tab order is field, Tap, then the four keys in both layouts.
      */}
      <div className="grid grid-cols-4 gap-2 md:grid-cols-[minmax(0,1fr)_2.5rem_2.5rem_3.25rem] md:grid-rows-2">
        {/* Classic text field: editable tempo, with the beat light and units along the bottom. */}
        <label className="col-span-2 flex aspect-square min-w-0 flex-col rounded-[4px] border border-line bg-key p-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent md:col-span-1 md:col-start-1 md:row-span-2 md:row-start-1 md:mr-1 md:aspect-auto md:justify-center md:px-3 md:py-2">
          <CommitNumberInput
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onCommit={(value) => onChange(clampBpm(value))}
            // Smaller digits in the narrowest boxes so three-digit tempos always fit.
            className="min-h-0 w-full flex-1 bg-transparent text-center text-4xl leading-none font-semibold tabular-nums text-ink caret-accent outline-none [appearance:textfield] @min-[17rem]:text-5xl md:flex-none md:text-right [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Tempo in beats per minute"
          />
          <span className="flex items-center justify-between md:mt-1.5">
            {beatLight}
            <span className="text-[10px] font-bold tracking-[0.2em] text-ink-muted">BPM</span>
          </span>
        </label>
        <div className="col-span-2 flex aspect-square md:col-span-1 md:col-start-4 md:row-span-2 md:row-start-1 md:aspect-auto">{tapKey}</div>

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
