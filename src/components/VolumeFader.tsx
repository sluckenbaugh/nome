interface Props {
  volume: number
  onChange: (volume: number) => void
}

export function VolumeFader({ volume, onChange }: Props) {
  return (
    <label className="flex w-full items-center gap-3 text-sm text-zinc-500">
      <span className="w-14">Volume</span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="flex-1 accent-indigo-600 dark:accent-indigo-400"
        aria-label="Volume"
      />
      <span className="w-10 text-right tabular-nums">{Math.round(volume * 100)}%</span>
    </label>
  )
}
