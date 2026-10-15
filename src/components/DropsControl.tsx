import { DENSITY_STEP, type DropSettings } from '../logic/drops'
import { SliderRow } from './SliderRow'

interface Props {
  drops: DropSettings
  onChange: (drops: DropSettings) => void
}

export function DropsControl({ drops, onChange }: Props) {
  const percent = Math.round(drops.density * 100)

  return (
    <section aria-label="Drops" className="flex w-full flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => onChange({ ...drops, enabled: !drops.enabled })}
        aria-pressed={drops.enabled}
        title="Randomly mute beats to practise keeping time"
        className={`h-9 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
          drops.enabled
            ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
            : 'border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500'
        }`}
      >
        Drops
      </button>
      {/* Adjustable while off (dimmed) so the density can be set before enabling. */}
      <SliderRow
        label="Density"
        display={`${percent}%`}
        value={percent}
        min={0}
        max={100}
        step={DENSITY_STEP * 100}
        onChange={(value) => onChange({ ...drops, density: value / 100 })}
        ariaLabel="Drop density"
        ariaValueText={`${percent}% of beats dropped`}
        dimmed={!drops.enabled}
      />
    </section>
  )
}
