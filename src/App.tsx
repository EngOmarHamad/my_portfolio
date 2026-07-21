import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { AdminRouter } from '@/admin/AdminRouter'
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </Providers>
  )
}
