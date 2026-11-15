import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Empty, Modal, Tag, Typography } from 'antd'
import { PlusOutlined, PictureOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { GalleryImage } from '@/admin/types'

const galleryService = createBaseService<GalleryImage>('gallery_images')

export function GalleryPage() {
  const [showUpload, setShowUpload] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryService.list({ pageSize: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Image deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const createMutation = useMutation({
    mutationFn: (values: Partial<GalleryImage>) => galleryService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Image added'); setShowUpload(false) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to add image'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Manage your gallery images"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Gallery' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowUpload(true)}>
            Add Images
          </Button>
        }
      />

      {data && data.data.length === 0 ? (
        <Empty
          image={<PictureOutlined style={{ fontSize: 48, color: 'var(--color-text-tertiary)' }} />}
          description={
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Upload your first gallery image.
            </Typography.Paragraph>
          }
          style={{ padding: '64px 24px' }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowUpload(true)}>
            Add Images
          </Button>
        </Empty>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {data?.data.map((image) => (
            <Card
              key={image.id}
              size="small"
              styles={{ body: { padding: 0 } }}
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    src={image.url}
                    alt={image.alt_text || ''}
                    style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                  />
                  {image.is_featured && (
                    <Tag color="gold" style={{ position: 'absolute', top: 8, left: 8, margin: 0 }}>
                      Featured
                    </Tag>
                  )}
                </div>
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 8px',
                }}
              >
                <Typography.Text type="secondary" ellipsis style={{ fontSize: 12, flex: 1, minWidth: 0 }}>
                  {image.alt_text || 'No caption'}
                </Typography.Text>
                <DeleteButton onDelete={() => deleteMutation.mutateAsync(image.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showUpload}
        onCancel={() => setShowUpload(false)}
        footer={null}
        title="Add Image to Gallery"
        width={480}
        destroyOnHidden forceRender
      >
        <div style={{ marginTop: 16 }}>
          <ImageUpload
            onChange={(url) => createMutation.mutate({ url, is_featured: false, display_order: 0 } as Partial<GalleryImage>)}
            bucket="gallery"
            aspectRatio="1/1"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <Button onClick={() => setShowUpload(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
