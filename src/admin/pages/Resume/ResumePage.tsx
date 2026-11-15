import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Empty, List, Space, Typography, Upload } from 'antd'
import { DownloadOutlined, FilePdfOutlined, InboxOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { uploadService } from '@/admin/services/upload-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { Resume } from '@/admin/types'

const resumeService = createBaseService<Resume>('resume')

export function ResumePage() {
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: () => resumeService.list({ pageSize: 10 }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (resume: Resume) => {
      await uploadService.remove(resume.file_url, 'resume')
      await resumeService.remove(resume.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume'] })
      toast.success('Resume deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return false
    }
    setIsUploading(true)
    try {
      const { url } = await uploadService.upload(file, 'resume', `resume_${Date.now()}.pdf`)
      await resumeService.create({
        file_url: url,
        file_name: file.name,
        file_size: file.size,
        is_active: true,
      } as Partial<Resume>)
      queryClient.invalidateQueries({ queryKey: ['resume'] })
      toast.success('Resume uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload')
    } finally {
      setIsUploading(false)
    }
    return false
  }

  if (isLoading) return <PageSkeleton />

  const activeResume = resumes?.data?.find((r) => r.is_active)
  const previousVersions = (resumes?.data ?? []).filter((r) => !r.is_active)

  return (
    <div>
      <PageHeader
        title="Resume"
        description="Manage your resume PDF"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Resume' }]}
      />

      <div style={{ maxWidth: 640 }}>
        <Card
          size="small"
          style={{ marginBottom: 16 }}
          styles={{ body: { padding: 24 } }}
          title="Upload Resume"
        >
          <Upload.Dragger
            accept=".pdf"
            showUploadList={false}
            disabled={isUploading}
            beforeUpload={(file) => {
              void handleUpload(file)
              return Upload.LIST_IGNORE
            }}
            style={{ padding: 8 }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{isUploading ? 'Uploading…' : 'Click or drag a PDF to this area'}</p>
            <p className="ant-upload-hint">PDF only, max 10MB</p>
          </Upload.Dragger>
        </Card>

        <Card
          size="small"
          style={{ marginBottom: 16 }}
          styles={{ body: { padding: 24 } }}
          title="Active Resume"
        >
          {activeResume ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface-hover)',
              }}
            >
              <Space size={12}>
                <FilePdfOutlined style={{ fontSize: 28, color: 'var(--color-primary)' }} />
                <div>
                  <Typography.Text strong>{activeResume.file_name}</Typography.Text>
                  <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
                    {(activeResume.file_size / 1024).toFixed(0)} KB
                  </Typography.Paragraph>
                </div>
              </Space>
              <Space size={0}>
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  href={activeResume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <DeleteButton onDelete={() => deleteMutation.mutateAsync(activeResume)} tooltip="Delete resume" />
              </Space>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active resume yet" />
          )}
        </Card>

        {previousVersions.length > 0 && (
          <Card size="small" styles={{ body: { padding: 24 } }} title="Previous Versions">
            <List
              dataSource={previousVersions}
              renderItem={(r) => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      type="text"
                      icon={<DownloadOutlined />}
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />,
                    <DeleteButton key="delete" onDelete={() => deleteMutation.mutateAsync(r)} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FilePdfOutlined style={{ fontSize: 20, color: 'var(--color-text-tertiary)' }} />}
                    title={<Typography.Text style={{ fontSize: 14 }}>{r.file_name}</Typography.Text>}
                    description={
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
