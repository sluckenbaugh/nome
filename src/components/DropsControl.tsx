import { DENSITY_STEP, type DropSettings } from '../logic/drops'
import { Led } from './Led'
import { SliderRow } from './SliderRow'
import { KEY_BASE, KEY_FACE, KEY_INVERTED } from './ui'

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
          // Fits the 64px label column so the fader stays aligned with the others; inverted while on.
          className={`${KEY_BASE} ${drops.enabled ? KEY_INVERTED : KEY_FACE} h-8 w-full justify-center gap-1 px-1 text-[11px]`}
        >
          <Led on={drops.enabled} className="size-2" />
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
