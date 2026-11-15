import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRightOutlined,
  CarryOutOutlined,
  CodeOutlined,
  EditOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  LayoutOutlined,
  MessageOutlined,
  PictureOutlined,
  PlusOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from 'antd'
import { supabase } from '@/admin/lib/supabase'
import { StatsCard } from '@/admin/components/ui/StatsCard'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { useAuthStore } from '@/admin/stores/auth-store'
import { useHero } from '@/portfolio/hooks/use-portfolio-data'

interface DashboardStats {
  projects: number
  skills: number
  messages: number
  unreadMessages: number
  blog: number
  services: number
  testimonials: number
  certificates: number
  gallery: number
  experience: number
  education: number
  achievements: number
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { user } = useAuthStore()
  const { data: hero } = useHero()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: async () => {
      const [
        projects,
        skills,
        messages,
        unreadMessages,
        blog,
        services,
        testimonials,
        certificates,
        gallery,
        experience,
        education,
        achievements,
        recentMessagesRes,
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase.from('achievements').select('*', { count: 'exact', head: true }),
        supabase
          .from('contact_messages')
          .select('id,name,email,subject,message,is_read,created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const stats: DashboardStats = {
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        messages: messages.count ?? 0,
        unreadMessages: unreadMessages.count ?? 0,
        blog: blog.count ?? 0,
        services: services.count ?? 0,
        testimonials: testimonials.count ?? 0,
        certificates: certificates.count ?? 0,
        gallery: gallery.count ?? 0,
        experience: experience.count ?? 0,
        education: education.count ?? 0,
        achievements: achievements.count ?? 0,
      }

      return {
        stats,
        recentMessages: (recentMessagesRes.data ?? []) as Array<{
          id: string
          name: string
          email: string
          subject: string | null
          message: string | null
          is_read: boolean | null
          created_at: string | null
        }>,
      }
    },
  })

  const stats = data?.stats

  const totalContent = useMemo(() => {
    if (!stats) return 0
    return (
      stats.projects +
      stats.skills +
      stats.services +
      stats.experience +
      stats.education +
      stats.certificates +
      stats.testimonials +
      stats.achievements +
      stats.blog +
      stats.gallery
    )
  }, [stats])

  if (isLoading) return <PageSkeleton />

  const greetingName = hero?.name || user?.email?.split('@')[0] || 'Admin'
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const primary = token.colorPrimary
  const secondary = token.colorWarning || '#D97706'

  const kpiCards = [
    {
      title: 'Projects',
      value: stats?.projects ?? 0,
      icon: <FolderOpenOutlined />,
      path: '/admin/projects',
      color: primary,
      hint: 'Portfolio work items',
    },
    {
      title: 'Messages',
      value: stats?.messages ?? 0,
      icon: <MessageOutlined />,
      path: '/admin/messages',
      color: stats?.unreadMessages ? token.colorError : secondary,
      hint: `${stats?.unreadMessages ?? 0} unread`,
    },
    {
      title: 'Blog Posts',
      value: stats?.blog ?? 0,
      icon: <FileTextOutlined />,
      path: '/admin/blog',
      color: secondary,
      hint: 'Published & drafts',
    },
    {
      title: 'Skills',
      value: stats?.skills ?? 0,
      icon: <CodeOutlined />,
      path: '/admin/skills',
      color: token.colorInfo || primary,
      hint: 'Technical profile',
    },
  ]

  const contentSections = [
    { label: 'Services', value: stats?.services ?? 0, path: '/admin/services', icon: <CarryOutOutlined /> },
    { label: 'Experience', value: stats?.experience ?? 0, path: '/admin/experience', icon: <HistoryOutlined /> },
    { label: 'Education', value: stats?.education ?? 0, path: '/admin/education', icon: <ReadOutlined /> },
    { label: 'Certificates', value: stats?.certificates ?? 0, path: '/admin/certificates', icon: <SafetyCertificateOutlined /> },
    { label: 'Testimonials', value: stats?.testimonials ?? 0, path: '/admin/testimonials', icon: <StarOutlined /> },
    { label: 'Achievements', value: stats?.achievements ?? 0, path: '/admin/achievements', icon: <TrophyOutlined /> },
    { label: 'Gallery', value: stats?.gallery ?? 0, path: '/admin/gallery', icon: <PictureOutlined /> },
  ]

  const quickActions = [
    { label: 'Edit Hero', desc: 'Update headline & intro', path: '/admin/hero', icon: <LayoutOutlined />, color: primary },
    { label: 'Manage Projects', desc: 'Add or refine case studies', path: '/admin/projects', icon: <FolderOpenOutlined />, color: secondary },
    { label: 'Write Blog Post', desc: 'Publish new content', path: '/admin/blog', icon: <EditOutlined />, color: primary },
    { label: 'Review Messages', desc: 'Respond to inquiries', path: '/admin/messages', icon: <MessageOutlined />, color: token.colorError },
    { label: 'Update About', desc: 'Refresh your story', path: '/admin/about', icon: <UserOutlined />, color: secondary },
    { label: 'SEO & Settings', desc: 'Tune visibility and config', path: '/admin/seo', icon: <SearchOutlined />, color: primary },
  ]

  const maxSectionCount = Math.max(1, ...contentSections.map((s) => s.value))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          border: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
        }}
      >
        <div
          style={{
            padding: '26px 28px 22px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            position: 'relative',
            background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillQuaternary ?? token.colorFillTertiary} 100%)`,
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              insetInlineEnd: -40,
              top: -30,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${token.colorPrimary}22 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
            <Tag bordered={false} style={{ marginBottom: 10, borderRadius: 999, fontWeight: 500, color: token.colorPrimary, background: token.colorPrimaryBg }}>
              Admin Dashboard
            </Tag>
            <Typography.Title level={2} style={{ margin: '0 0 6px', letterSpacing: '-0.03em', color: token.colorText }}>
              Welcome back, {greetingName}
            </Typography.Title>
            <Typography.Paragraph style={{ color: token.colorTextSecondary, margin: 0, fontSize: 15, maxWidth: 620 }}>
              Manage your portfolio content, track engagement, and keep every section up to date from one professional workspace.
            </Typography.Paragraph>
            <Space wrap size={10} style={{ marginTop: 18 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/projects')}>
                Add project
              </Button>
              <Button icon={<FileTextOutlined />} onClick={() => navigate('/admin/blog')}>
                New post
              </Button>
              <Button icon={<SettingOutlined />} onClick={() => navigate('/admin/settings')}>
                Settings
              </Button>
            </Space>
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, textAlign: 'end' }}>
              {today}
            </Typography.Text>
            <Card
              size="small"
              style={{
                background: token.colorBgContainer,
                borderColor: token.colorBorderSecondary,
                minWidth: 220,
                borderRadius: 14,
              }}
              styles={{ body: { padding: '14px 16px' } }}
            >
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Total content items
              </Typography.Text>
              <div style={{ fontSize: 30, fontWeight: 700, color: token.colorText, lineHeight: 1.1, marginTop: 4 }}>
                {totalContent}
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Across portfolio sections
              </Typography.Text>
            </Card>
          </div>
        </div>
      </Card>

      <PageHeader
        eyebrow="Overview"
        title="Portfolio control center"
        description="Key metrics, quick actions, and content health at a glance."
      />

      <Row gutter={[16, 16]}>
        {kpiCards.map((card) => (
          <Col key={card.title} xs={24} sm={12} xl={6}>
            <StatsCard {...card} onClick={() => navigate(card.path)} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title={
              <Space>
                <span>Content distribution</span>
                <Tag style={{ marginInlineEnd: 0, color: secondary, background: `${secondary}1A`, border: `1px solid ${secondary}33` }}>{totalContent} items</Tag>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/admin/data')} style={{ paddingInline: 0 }}>
                View data <ArrowRightOutlined />
              </Button>
            }
            style={{ borderRadius: 16, height: '100%' }}
            styles={{ header: { borderBottom: `1px solid ${token.colorBorderSecondary}` } }}
          >
            <Row gutter={[12, 12]}>
              {contentSections.map((section) => (
                <Col key={section.label} xs={24} sm={12} md={12} lg={12}>
                  <div
                    onClick={() => navigate(section.path)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(section.path)}
                    style={{
                      padding: '14px 14px 12px',
                      border: `1px solid ${token.colorBorderSecondary}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: token.colorBgContainer,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Space size={10}>
                        <Avatar
                          size={34}
                          shape="square"
                          icon={section.icon}
                          style={{ background: token.colorFillTertiary, color: token.colorPrimary }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: token.colorText }}>{section.label}</div>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {section.value} entries
                          </Typography.Text>
                        </div>
                      </Space>
                      <Typography.Text strong style={{ fontSize: 18 }}>{section.value}</Typography.Text>
                    </div>
                    <Progress
                      percent={Math.round((section.value / maxSectionCount) * 100)}
                      showInfo={false}
                      strokeColor={{ '0%': primary, '100%': secondary }}
                      railColor={token.colorFillSecondary}
                      size="small"
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card
              title="Quick actions"
              style={{ borderRadius: 16 }}
              styles={{ header: { borderBottom: `1px solid ${token.colorBorderSecondary}` } }}
            >
              <List
                itemLayout="horizontal"
                dataSource={quickActions}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => navigate(item.path)}
                    style={{
                      padding: '10px 8px',
                      cursor: 'pointer',
                      borderRadius: 10,
                      marginBottom: 4,
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={36}
                          icon={item.icon}
                          style={{ background: `color-mix(in srgb, ${item.color} 14%, transparent)`, color: item.color }}
                        />
                      }
                      title={<span style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</span>}
                      description={<span style={{ fontSize: 12 }}>{item.desc}</span>}
                    />
                    <ArrowRightOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                  </List.Item>
                )}
              />
            </Card>

            <Card
              title={
                <Space>
                  <span>Recent messages</span>
                  {(stats?.unreadMessages ?? 0) > 0 && <Tag color="red">{stats?.unreadMessages} unread</Tag>}
                </Space>
              }
              extra={
                <Button type="link" onClick={() => navigate('/admin/messages')} style={{ paddingInline: 0 }}>
                  Inbox
                </Button>
              }
              style={{ borderRadius: 16 }}
              styles={{ header: { borderBottom: `1px solid ${token.colorBorderSecondary}` } }}
            >
              {!data?.recentMessages?.length ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No messages yet"
                  styles={{ image: { marginBottom: 8 } }}
                />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={data.recentMessages}
                  split={false}
                  renderItem={(msg) => (
                    <List.Item
                      onClick={() => navigate('/admin/messages')}
                      style={{ padding: '10px 4px', cursor: 'pointer' }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ background: msg.is_read ? token.colorFillSecondary : token.colorPrimary }}>
                            {msg.name?.[0]?.toUpperCase() || '?'}
                          </Avatar>
                        }
                        title={
                          <Space size={6}>
                            <span style={{ fontSize: 13, fontWeight: msg.is_read ? 500 : 650 }}>
                              {msg.name || 'Unknown sender'}
                            </span>
                            {!msg.is_read && <Tag color="processing" style={{ marginInlineEnd: 0 }}>New</Tag>}
                          </Space>
                        }
                        description={
                          <div style={{ fontSize: 12 }}>
                            <div style={{ color: token.colorTextSecondary, marginBottom: 2 }}>
                              {msg.subject || msg.email || 'No subject'}
                            </div>
                            <Typography.Paragraph
                              type="secondary"
                              ellipsis={{ rows: 2 }}
                              style={{ margin: 0, fontSize: 12 }}
                            >
                              {msg.message || '—'}
                            </Typography.Paragraph>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}
