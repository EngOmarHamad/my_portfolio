import { useEffect, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { transition } from '@/portfolio/lib/motion'
import { dismissToast, getToasts, subscribeToasts, type ToastItem } from '@/portfolio/lib/toast-store'

function ToastRow({ item }: { item: ToastItem }) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(item.id), 2800)
    return () => window.clearTimeout(timer)
  }, [item.id])

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={transition(0.2)}
      className="flex items-center gap-3 rounded-chip border border-line-strong bg-panel-2 px-4 py-3 text-sm text-ink"
    >
      <span className="grid size-5 place-items-center rounded-full bg-signal text-on-signal">
        <Check className="size-3" aria-hidden />
      </span>
      {item.message}
    </motion.li>
  )
}

export function Toaster() {
  const current = useSyncExternalStore(subscribeToasts, getToasts, getToasts)
  return (
    <ol aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:bottom-6 sm:items-end">
      <AnimatePresence initial={false}>
        {current.map((item) => (
          <ToastRow key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
