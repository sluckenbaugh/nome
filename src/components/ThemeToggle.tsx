import { KEY_SM } from './ui'

interface Props {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button type="button" onClick={onToggle} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className={`${KEY_SM} text-base`}>
      {isDark ? '☀︎' : '☾'}
    </button>
  )
}
