import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const PARAM = 'case'

/** Case-study modal state lives in the URL (?case=id) so Back closes it and links are shareable. */
export function useCaseStudy() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const openId = params.get(PARAM)

  const open = useCallback(
    (id: string) => {
      const next = new URLSearchParams(location.search)
      next.set(PARAM, id)
      navigate({ search: next.toString() }, { state: { caseOpened: true }, preventScrollReset: true })
    },
    [location.search, navigate],
  )

  const close = useCallback(() => {
    if ((location.state as { caseOpened?: boolean } | null)?.caseOpened) {
      navigate(-1)
      return
    }
    const next = new URLSearchParams(location.search)
    next.delete(PARAM)
    navigate({ search: next.toString() }, { replace: true, preventScrollReset: true })
  }, [location.search, location.state, navigate])

  return { openId, open, close }
}
