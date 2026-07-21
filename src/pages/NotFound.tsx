import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'

export function NotFoundPage() {
  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[8rem] sm:text-[10rem] font-serif font-normal leading-none tracking-[-0.04em]">
              <span className="text-gradient">404</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-xl sm:text-2xl text-text mt-6 mb-3">
              Page Not Found
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all duration-200 shadow-soft"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  )
}
