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
    // A container, so the number size can follow the Tempo box's own width (narrow phones and the
    // two-column wide layout) rather than the screen width.
    <div className="@container flex flex-col gap-3">
      {/*
        Small screens: the tempo field and Tap key split the width as two equal squares.
        md and up: the field takes ~70% and Tap ~30%, with Tap stretched to the field's height.
      */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        {/* Classic text field: editable tempo, with the beat light and units along the bottom. */}
        <label className="flex aspect-square min-w-0 flex-col md:aspect-auto rounded-[4px] border border-line bg-key p-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
          <CommitNumberInput
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onCommit={(value) => onChange(clampBpm(value))}
            // Smaller digits in the narrowest boxes so three-digit tempos always fit.
            className="min-h-0 w-full flex-1 bg-transparent text-center text-4xl leading-none font-semibold tabular-nums text-ink caret-accent outline-none [appearance:textfield] @min-[17rem]:text-5xl [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Tempo in beats per minute"
          />
          <span className="flex items-center justify-between">
            {beatLight}
            <span className="text-[10px] font-bold tracking-[0.2em] text-ink-muted">BPM</span>
          </span>
        </label>
        <div className="flex aspect-square md:aspect-auto">{tapKey}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
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
