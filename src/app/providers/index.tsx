import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from '@/shared/i18n'
import { BackendUnavailableError } from '@/portfolio/services/portfolio-service'

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
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
