import { useCallback, useEffect, useState } from 'react'
import { usePersistentState } from './usePersistentState'

export type ThemePreference = 'system' | 'light' | 'dark'

const isThemePreference = (v: unknown): v is ThemePreference => v === 'system' || v === 'light' || v === 'dark'
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

/** Follows the OS colour scheme until the user picks one explicitly. */
export function useTheme() {
  const [preference, setPreference] = usePersistentState<ThemePreference>('nome:theme', 'system', isThemePreference)
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches)

  useEffect(() => {
    const query = darkQuery()
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const isDark = preference === 'dark' || (preference === 'system' && systemDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = useCallback(() => setPreference(isDark ? 'light' : 'dark'), [isDark, setPreference])

  return { isDark, toggleTheme }
}
