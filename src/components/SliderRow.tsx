import type { ReactNode } from 'react'
import { ROW_LABEL } from './ui'

interface Props {
  /** Optional; the label column is kept (empty) when omitted so tracks stay aligned. */
  label?: ReactNode
  /** Text in the right-hand value column, e.g. "120" or "25%". */
  display: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  ariaLabel: string
  ariaValueText?: string
  /** Fades the fader and value (still adjustable), e.g. when the feature it controls is off. */
  dimmed?: boolean
}

/**
 * Label column + fader + value column. All sliders use this so their tracks share the same
 * left and right edges.
 */
export function SliderRow({ label, display, value, min, max, step, onChange, ariaLabel, ariaValueText, dimmed = false }: Props) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className={`w-16 shrink-0 ${ROW_LABEL}`} aria-hidden={label ? undefined : true}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`fader min-w-0 flex-1 transition-opacity ${dimmed ? 'opacity-50' : ''}`}
        aria-label={ariaLabel}
        aria-valuetext={ariaValueText}
      />
      <span className={`w-10 shrink-0 text-right text-sm font-semibold tabular-nums transition-opacity ${dimmed ? 'opacity-50' : ''}`}>{display}</span>
    </div>
  )
}
