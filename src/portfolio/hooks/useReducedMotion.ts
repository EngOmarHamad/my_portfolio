import { useSyncExternalStore } from 'react'

/**
 * The site intentionally ALWAYS plays its animations.
 * OS-level "reduce motion" preferences are ignored by design —
 * the motion language here is functional and subtle.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    () => () => {},
    () => false,
    () => false,
  )
}
