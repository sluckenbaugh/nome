interface Props {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="size-10 rounded-full text-xl hover:bg-zinc-200 dark:hover:bg-zinc-800"
    >
      {isDark ? '☀︎' : '☾'}
    </button>
  )
}
