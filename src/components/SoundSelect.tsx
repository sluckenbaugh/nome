import { useId } from 'react'
import type { SoundKit } from '../logic/soundKits'
import { Select } from './Select'
import { SILKSCREEN } from './ui'

interface Props {
  kits: SoundKit[]
  value: string
  onChange: (id: string) => void
}

export function SoundSelect({ kits, value, onChange }: Props) {
  const labelId = useId()
  return (
    // Same label column width as SliderRow so it lines up with the sliders.
    <div className="flex w-full items-center gap-3">
      <span id={labelId} className={`w-16 shrink-0 ${SILKSCREEN}`}>
        Sound
      </span>
      <Select options={kits.map((kit) => ({ value: kit.id, label: kit.label }))} value={value} onChange={onChange} labelledBy={labelId} />
    </div>
  )
}
