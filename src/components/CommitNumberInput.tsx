import { useState, type InputHTMLAttributes } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'min' | 'max'> {
  value: number
  min: number
  max: number
  /** Called with the raw typed number on blur/Enter; the caller clamps it. */
  onCommit: (value: number) => void
}

/**
 * Number input that keeps the typed text as a draft and only commits on blur or Enter,
 * so partial input (e.g. "1" on the way to "12") isn't clamped mid-typing.
 */
export function CommitNumberInput({ value, min, max, onCommit, ...rest }: Props) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    if (draft !== null && draft.trim() !== '') onCommit(Number(draft))
    setDraft(null)
  }

  return (
    <input
      {...rest}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={draft ?? value}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
    />
  )
}
