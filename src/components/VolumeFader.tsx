import { SliderRow } from './SliderRow'

interface Props {
  volume: number
  onChange: (volume: number) => void
}

export function VolumeFader({ volume, onChange }: Props) {
  const percent = Math.round(volume * 100)
  return (
    <SliderRow
      label="Volume"
      display={`${percent}%`}
      value={percent}
      min={0}
      max={100}
      onChange={(value) => onChange(value / 100)}
      ariaLabel="Volume"
    />
  )
}
