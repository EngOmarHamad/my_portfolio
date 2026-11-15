/** Motion tokens — the only durations and easing the public site uses. */
export const EASE = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const

/** Word-by-word stagger for headline reveals. */
export const STAGGER = 0.06

export const transition = (duration: number = DURATION.base, delay = 0) => ({ duration, delay, ease: EASE })

/** Viewport options shared by scroll reveals: trigger once, slightly before entry. */
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const
