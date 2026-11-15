import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge must know the custom type scale; otherwise `text-label` is
 * mistaken for a colour and dropped when merged with `text-ink-muted`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['hero', 'h2', 'h3', 'title', 'lead', 'body', 'label'] }],
      rounded: [{ rounded: ['chip', 'card'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
