import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'

// The CMS (antd, editors, PDF tooling) is a separate chunk the public site never downloads.
const AdminApp = lazy(() => import('@/admin/AdminApp').then((m) => ({ default: m.AdminApp })))

export default function App() {
  return (
    <Providers>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </Providers>
  )
}
