import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Button, Menu, Tooltip, Typography, theme } from 'antd'
import type { MenuProps } from 'antd'
import {
  DashboardOutlined,
  LayoutOutlined,
  UserOutlined,
  CodeOutlined,
  FolderOpenOutlined,
  CarryOutOutlined,
  HistoryOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  PictureOutlined,
  FilePdfOutlined,
  MailOutlined,
  MessageOutlined,
  ShareAltOutlined,
  SearchOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { SITE_SECTIONS, SECTION_GROUP_LABELS } from '@/shared/config/site-structure'
import { useHero } from '@/portfolio/hooks/use-portfolio-data'
import { useAuthStore } from '@/admin/stores/auth-store'
import { authService } from '@/admin/services/auth-service'

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <DashboardOutlined />,
  PanelsTopLeft: <LayoutOutlined />,
  User: <UserOutlined />,
  Code2: <CodeOutlined />,
  FolderKanban: <FolderOpenOutlined />,
  Briefcase: <CarryOutOutlined />,
  History: <HistoryOutlined />,
  GraduationCap: <ReadOutlined />,
  Award: <SafetyCertificateOutlined />,
  Star: <StarOutlined />,
  Trophy: <TrophyOutlined />,
  Timeline: <FieldTimeOutlined />,
  FileText: <FileTextOutlined />,
  Image: <PictureOutlined />,
  FileDown: <FilePdfOutlined />,
  Mail: <MailOutlined />,
  MessageSquare: <MessageOutlined />,
  Share2: <ShareAltOutlined />,
  Search: <SearchOutlined />,
  Settings: <SettingOutlined />,
  Database: <DatabaseOutlined />,
  FileAdd: <FileAddOutlined />,
  FileDone: <FileDoneOutlined />,
}

interface SidebarContentProps {
  collapsed?: boolean
  onNavigate?: () => void
  onToggleCollapse?: () => void
}

const pathIconOverrides: Record<string, React.ReactNode> = {
  '/admin/create-cv': <FileAddOutlined />,
  '/admin/cv-from-data': <FileDoneOutlined />,
}

function buildMenuItems(): MenuProps['items'] {
  const groups = Array.from(new Set(SITE_SECTIONS.map((s) => s.group)))
  return groups.map((group) => ({
    type: 'group' as const,
    key: `group-${group}`,
    label: SECTION_GROUP_LABELS[group],
    children: SITE_SECTIONS.filter((s) => s.group === group).map((section) => ({
      key: section.adminPath,
      icon: pathIconOverrides[section.adminPath] ?? iconMap[section.icon],
      label: section.label,
    })),
  }))
}

function findActiveSection(pathname: string) {
  return (
    SITE_SECTIONS.find((section) => section.adminPath === pathname) ??
    SITE_SECTIONS.filter((section) => section.adminPath !== '/admin')
      .sort((a, b) => b.adminPath.length - a.adminPath.length)
      .find((section) => pathname.startsWith(section.adminPath)) ??
    SITE_SECTIONS[0]
  )
}

export function SidebarContent({ collapsed = false, onNavigate, onToggleCollapse }: SidebarContentProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: hero } = useHero()
  const { token } = theme.useToken()
  const initials =
    hero?.name
      ?.split(' ')
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD'
  const activeSection = findActiveSection(location.pathname)

  const handleLogout = async () => {
    await authService.logout()
    navigate('/admin/login')
  }

  const scrollbarStyles = `
    .admin-sidebar-scroll {
      scrollbar-width: thin;
      scrollbar-color: ${token.colorFillSecondary} transparent;
    }
    .admin-sidebar-scroll::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .admin-sidebar-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .admin-sidebar-scroll::-webkit-scrollbar-thumb {
      background: ${token.colorFillSecondary};
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    .admin-sidebar-scroll:hover::-webkit-scrollbar-thumb {
      background: ${token.colorFill};
      border: 2px solid transparent;
      background-clip: padding-box;
    }
  `

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: token.colorBgContainer,
      }}
    >
      <style>{scrollbarStyles}</style>
      <div
        style={{
          padding: collapsed ? '16px 10px 12px' : '18px 16px 14px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Link
          to="/admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <Avatar
            shape="square"
            size={38}
            style={{
              background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfo} 100%)`,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              boxShadow: `0 8px 18px ${token.colorPrimary}33`,
            }}
          >
            {initials}
          </Avatar>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: token.colorText,
                  fontWeight: 700,
                  fontSize: 15,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Portfolio Admin
              </div>
              <Typography.Text style={{ color: token.colorTextTertiary, fontSize: 11 }}>
                Content workspace
              </Typography.Text>
            </div>
          )}
        </Link>
      </div>

      <div
        className="admin-sidebar-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '10px 6px' : '10px 8px',
        }}
      >
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={buildMenuItems()}
          selectedKeys={[activeSection.adminPath]}
          onClick={({ key }) => {
            navigate(String(key))
            onNavigate?.()
          }}
          style={{
            background: 'transparent',
            borderInlineEnd: 'none',
            fontSize: 13,
          }}
        />
      </div>

      <div
        style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: collapsed ? 10 : 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flexShrink: 0,
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10,
            minWidth: 0,
            padding: collapsed ? 0 : '4px 4px 0',
          }}
        >
          <Avatar
            size={34}
            style={{
              background: token.colorFillSecondary,
              color: token.colorText,
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </Avatar>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ color: token.colorText, fontSize: 12, fontWeight: 600 }}>Account</div>
              <Tooltip title={user?.email || 'Admin'}>
                <div
                  style={{
                    color: token.colorTextTertiary,
                    fontSize: 11,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 150,
                  }}
                >
                  {user?.email ?? 'Admin'}
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            {!collapsed && (
              <Tooltip title="View live site">
                <Link to="/">
                  <Button type="text" size="small" icon={<GlobalOutlined />} />
                </Link>
              </Tooltip>
            )}
            <Tooltip title="Sign out">
              <Button type="text" size="small" icon={<LogoutOutlined />} onClick={handleLogout} />
            </Tooltip>
          </div>
          {onToggleCollapse && (
            <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Button
                type="text"
                size="small"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={onToggleCollapse}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
