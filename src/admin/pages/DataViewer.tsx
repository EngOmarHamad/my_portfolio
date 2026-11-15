import { useEffect, useState } from 'react'
import { Alert, Button, Empty, Menu, Spin, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { supabase } from '@/admin/lib/supabase'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { DataTable } from '@/admin/components/ui/DataTable'
import type { Column } from '@/admin/components/ui/DataTable'

const TABLES = [
  'hero', 'about', 'skill_categories', 'skills', 'projects',
  'project_images', 'services', 'experience', 'education',
  'certificates', 'testimonials', 'achievements', 'blog_posts',
  'gallery_categories', 'gallery_images', 'contact_info',
  'contact_messages', 'social_links', 'timeline_items',
  'resume', 'seo', 'settings',
]

type ViewerRow = Record<string, unknown>

const renderCell = (val: unknown) => {
  if (val === null) {
    return (
      <Typography.Text type="secondary" italic>
        NULL
      </Typography.Text>
    )
  }
  if (typeof val === 'object') {
    return (
      <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', maxHeight: 96, overflowY: 'auto', margin: 0 }}>
        {JSON.stringify(val, null, 1)}
      </pre>
    )
  }
  return (
    <Typography.Text
      type="secondary"
      ellipsis
      style={{ display: 'block', maxWidth: 260 }}
    >
      {String(val)}
    </Typography.Text>
  )
}

export function DataViewerPage() {
  const [data, setData] = useState<Record<string, unknown[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTable, setSelectedTable] = useState(TABLES[0])

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    setError('')
    const result: Record<string, unknown[]> = {}

    for (const table of TABLES) {
      try {
        const { data: rows, error } = await supabase.from(table).select('*')
        if (error) throw error
        result[table] = rows || []
      } catch (err) {
        result[table] = []
        console.error(`Error loading ${table}:`, err)
      }
    }

    setData(result)
    setLoading(false)
  }

  const selectedData = (data[selectedTable] || []) as ViewerRow[]

  const firstRow = selectedData[0]
  const columns: Column<ViewerRow>[] = firstRow
    ? Object.keys(firstRow).map((key) => ({
        key,
        header: key,
        render: (row: ViewerRow) => renderCell(row[key]),
      }))
    : []

  return (
    <div>
      <PageHeader
        title="Supabase Data Viewer"
        description="Browse all database tables"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Data Viewer' }]}
        actions={
          <Button icon={<ReloadOutlined />} onClick={loadAll} loading={loading}>
            Refresh All
          </Button>
        }
      />

      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <div style={{ display: 'flex', gap: 16 }}>
        <Menu
          mode="inline"
          style={{ width: 220, flexShrink: 0 }}
          selectedKeys={[selectedTable]}
          onClick={(e) => setSelectedTable(e.key)}
          items={TABLES.map((table) => ({
            key: table,
            label: `${table} (${data[table]?.length ?? '-'})`,
          }))}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {selectedTable}
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {selectedData.length} rows
            </Typography.Text>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
              <Spin size="large" />
            </div>
          ) : selectedData.length === 0 ? (
            <Empty description="No data" style={{ padding: '64px 24px' }} />
          ) : (
            <DataTable
              columns={columns}
              data={selectedData}
              keyExtractor={(row) => String(selectedData.indexOf(row))}
              emptyMessage="No data"
            />
          )}
        </div>
      </div>
    </div>
  )
}
