import { useSidebarStore } from '@/admin/stores/sidebar-store'
import { SITE_SECTIONS } from '@/shared/config/site-structure'

export function useSidebar() {
  const store = useSidebarStore()
  return { ...store, items: SITE_SECTIONS }
}
