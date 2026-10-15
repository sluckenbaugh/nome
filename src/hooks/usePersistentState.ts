import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

/**
 * useState backed by localStorage. Stored values that fail `isValid` (corrupt, outdated, or edited
 * by hand) are ignored in favour of `initial`. Storage errors (private mode, quota) are swallowed.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw)
        if (isValid(parsed)) return parsed
      }
    } catch {
      // fall through to the default
    }
    return initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage unavailable; settings just won't persist
    }
  }, [key, value])

  return [value, setValue]
}
