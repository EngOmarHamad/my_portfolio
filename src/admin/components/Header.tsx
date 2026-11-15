import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Space, Tag, Tooltip, Typography, theme as antdTheme } from 'antd'
import type { MenuProps } from 'antd'
import {
  BellOutlined,
  ExportOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/admin/stores/auth-store'
import { useSidebarStore } from '@/admin/stores/sidebar-store'
import { authService } from '@/admin/services/auth-service'
import { SITE_SECTIONS } from '@/shared/config/site-structure'
import { ThemeToggle } from '@/portfolio/components/ui/ThemeToggle'

interface HeaderProps {
  isMobile: boolean
}

export function Header({ isMobile }: HeaderProps) {
  const { user } = useAuthStore()
  const { toggle, isCollapsed, toggleCollapse } = useSidebarStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = antdTheme.useToken()

  const currentSection =
    SITE_SECTIONS.find((section) => section.adminPath === location.pathname) ?? SITE_SECTIONS[0]

  const handleLogout = async () => {
    await authService.logout()
    navigate('/admin/login')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'email',
      label: (
        <div style={{ paddingBlock: 2 }}>
          <div style={{ fontSize: 12, color: token.colorTextTertiary }}>Signed in as</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: token.colorText }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'site',
      icon: <ExportOutlined />,
      label: <Link to="/">Open live site</Link>,
    },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', danger: true },
  ]

  const quickAddItems: MenuProps['items'] = [
    { key: '/admin/projects', label: 'New Project' },
    { key: '/admin/blog', label: 'New Blog Post' },
    { key: '/admin/services', label: 'New Service' },
    { key: '/admin/certificates', label: 'New Certificate' },
  ]

  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 68,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: `color-mix(in srgb, ${token.colorBgContainer} 88%, transparent)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingInline: isMobile ? 14 : 28,
      }}
    >
      {isMobile ? (
        <Button type="text" icon={<MenuOutlined />} onClick={toggle} aria-label="Open navigation" />
      ) : (
        <Button
          type="text"
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        />
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
        <Breadcrumb
          items={[{ title: 'Admin' }, { title: currentSection?.label ?? 'Dashboard' }]}
          style={{ fontSize: 12, lineHeight: 1 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Typography.Text strong style={{ fontSize: 15, lineHeight: 1.2 }}>
            {currentSection?.label ?? 'Dashboard'}
          </Typography.Text>
          {currentSection?.publicPath && (
            <Tag color="cyan" style={{ marginInlineEnd: 0, fontSize: 11, lineHeight: '18px' }}>
              Linked to site
            </Tag>
          )}
        </div>
      </div>

      <Space size={6} wrap>
        <Dropdown menu={{ items: quickAddItems, onClick: ({ key }) => navigate(String(key)) }} trigger={['click']}>
          <Button icon={<PlusOutlined />}>{!isMobile && 'Quick add'}</Button>
        </Dropdown>

        {currentSection?.publicPath && (
          <Tooltip title="Open public page">
            <Link to={currentSection.publicPath} target="_blank" rel="noopener noreferrer">
              <Button icon={<ExportOutlined />} />
            </Link>
          </Tooltip>
        )}

        <Tooltip title="Dashboard overview">
          <Link to="/admin">
            <Button icon={<QuestionCircleOutlined />} />
          </Link>
        </Tooltip>

        <Tooltip title="Messages">
          <Link to="/admin/messages">
            <Badge dot offset={[-4, 4]}>
              <Button icon={<BellOutlined />} />
            </Badge>
          </Link>
        </Tooltip>

        <ThemeToggle />

        <Dropdown
          menu={{ items: userMenuItems, onClick: ({ key }) => key === 'logout' && handleLogout() }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 38,
              paddingInline: 6,
              borderRadius: 999,
            }}
          >
            <Avatar size={28} icon={<UserOutlined />} style={{ background: token.colorPrimary }} />
            {!isMobile && (
              <span
                style={{
                  fontSize: 13,
                  color: token.colorTextSecondary,
                  maxWidth: 140,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
            )}
          </Button>
        </Dropdown>
      </Space>
    </Layout.Header>
  )
}
