import { useState } from 'react'
import { Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { PictureOutlined, LoadingOutlined } from '@ant-design/icons'
import { toast } from '@/shared/lib/toast'
import { uploadService } from '@/admin/services/upload-service'
import type { BucketName } from '@/admin/services/upload-service'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  bucket?: BucketName
  className?: string
  aspectRatio?: string
}

/**
 * Image uploader built on Ant Design Upload (picture-card)
 * with a custom Supabase storage request.
 */
export function ImageUpload({
  value,
  onChange,
  bucket = 'uploads',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const fileList: UploadFile[] = value
    ? [{ uid: 'preview', name: 'uploaded-image', status: 'done', url: value }]
    : []

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const file = options.file as File
    setUploading(true)
    try {
      const { url } = await uploadService.upload(file, bucket)
      onChange(url)
      options.onSuccess?.(url)
      toast.success('Image uploaded')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      options.onError?.(err as Error)
      toast.error(`Upload failed: ${message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done' && info.file.response) {
      onChange(String(info.file.response))
    } else if (info.file.status === 'removed') {
      onChange('')
    }
  }

  return (
    <Upload
      className={className}
      listType="picture-card"
      fileList={fileList}
      customRequest={customRequest}
      onChange={handleChange}
      onPreview={(file) => window.open(file.url, '_blank')}
      accept="image/*"
      maxCount={1}
    >
      {fileList.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 12 }}>
          {uploading ? <LoadingOutlined style={{ fontSize: 20 }} /> : <PictureOutlined style={{ fontSize: 20 }} />}
          <div style={{ marginTop: 6 }}>{uploading ? 'Uploading…' : 'Upload image'}</div>
        </div>
      )}
    </Upload>
  )
}
