import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from '@/shared/i18n'
import { BackendUnavailableError } from '@/portfolio/services/portfolio-service'

const loadMotionFeatures = () => import('./motion-features').then((module) => module.default)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: (failureCount, error) => !(error instanceof BackendUnavailableError) && failureCount < 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          {/* Honour the OS reduced-motion preference everywhere. */}
          <MotionConfig reducedMotion="user">
            {/* `m` components ship without features; these stream in after first render. */}
            <LazyMotion features={loadMotionFeatures}>{children}</LazyMotion>
          </MotionConfig>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
