import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/admin/stores/auth-store'
import { authService } from '@/admin/services/auth-service'

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      try {
        const session = await authService.getSession()
        if (session) {
          const u = await authService.getUser()
          setUser(u)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    init()

    const sub = authService.onAuthStateChange((u) => {
      setUser(u)
    })

    return () => sub.data.subscription.unsubscribe()
  }, [setUser])

  return { user, isLoading, isAuthenticated, logout }
}

export function useRequireAuth() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return { isAuthenticated, isLoading }
}
