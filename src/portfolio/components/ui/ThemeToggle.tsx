import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/portfolio/hooks/useTheme'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-surface/60 text-text-secondary backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:text-text hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.span>
    </motion.button>
  )
}
