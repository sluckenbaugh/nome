import { DENSITY_STEP, type DropSettings } from '../logic/drops'
import { Led } from './Led'
import { SliderRow } from './SliderRow'

interface Props {
  drops: DropSettings
  onChange: (drops: DropSettings) => void
}

export function DropsControl({ drops, onChange }: Props) {
  const percent = Math.round(drops.density * 100)

  return (
    // Adjustable while off (dimmed) so the density can be set before enabling.
    <SliderRow
      label={
        <button
          type="button"
          onClick={() => onChange({ ...drops, enabled: !drops.enabled })}
          aria-pressed={drops.enabled}
          title="Randomly mute beats to practise keeping time"
          className="flex items-center gap-1.5 rounded-sm uppercase outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-amber"
        >
          <Led on={drops.enabled} />
          Drops
        </button>
      }
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
  )
}
