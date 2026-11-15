import { Outlet } from 'react-router-dom'
import { ConfigProvider, Drawer, Grid, Layout, theme as antdTheme } from 'antd'
import { Header } from '@/admin/components/Header'
import { SidebarContent } from '@/admin/components/Sidebar'
import { useAuth, useRequireAuth } from '@/admin/hooks/use-auth'
import { useSidebarStore } from '@/admin/stores/sidebar-store'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'

const SIDER_WIDTH = 272
const SIDER_COLLAPSED_WIDTH = 76

export function AdminLayout() {
  const screens = Grid.useBreakpoint()
  const isMobile = screens.lg === false
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const isOpen = useSidebarStore((state) => state.isOpen)
  const setOpen = useSidebarStore((state) => state.setOpen)
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse)
  const { token } = antdTheme.useToken()

  useAuth()
  const { isAuthenticated, isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: token.colorBgLayout,
        }}
      >
        <PageSkeleton />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const contentOffset = isMobile ? 0 : isCollapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: { bodyBg: token.colorBgLayout },
        },
      }}
    >
      <Layout hasSider={!isMobile} style={{ minHeight: '100dvh', background: token.colorBgLayout }}>
        {!isMobile && (
          <Layout.Sider
            theme="light"
            width={SIDER_WIDTH}
            collapsedWidth={SIDER_COLLAPSED_WIDTH}
            collapsible
            collapsed={isCollapsed}
            trigger={null}
            style={{
              position: 'fixed',
              insetInlineStart: 0,
              top: 0,
              bottom: 0,
              height: '100dvh',
              overflow: 'hidden',
              zIndex: 60,
              borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorBgContainer,
            }}
          >
            <SidebarContent collapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
          </Layout.Sider>
        )}

        {isMobile && (
          <Drawer
            placement="left"
            open={isOpen}
            onClose={() => setOpen(false)}
            width={SIDER_WIDTH}
            styles={{
              body: { padding: 0, background: token.colorBgContainer },
              header: { display: 'none' },
              mask: { backdropFilter: 'blur(4px)' },
            }}
            closable={false}
          >
            <SidebarContent onNavigate={() => setOpen(false)} />
          </Drawer>
        )}

        <Layout
          style={{
            marginInlineStart: contentOffset,
            transition: 'margin-inline-start 240ms cubic-bezier(0.2, 0, 0, 1)',
            background: token.colorBgLayout,
            minHeight: '100dvh',
          }}
        >
          <Header isMobile={isMobile} />
          <Layout.Content style={{ padding: isMobile ? 16 : 28 }}>
            <div
              style={{
                maxWidth: 1440,
                margin: '0 auto',
                width: '100%',
              }}
            >
              <Outlet />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
