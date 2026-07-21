import { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { uploadService } from '@/admin/services/upload-service'
import type { BucketName } from '@/admin/services/upload-service'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  bucket?: BucketName
  className?: string
  aspectRatio?: string
}

export function ImageUpload({
  value,
  onChange,
  bucket = 'uploads',
  className,
  aspectRatio = '16/9',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const [progress, setProgress] = useState(0)

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90))
    }, 200)

    try {
      const { url } = await uploadService.upload(file, bucket)
      clearInterval(interval)
      setProgress(100)
      setPreview(url)
      onChange(url)
    } catch (err) {
      clearInterval(interval)
      setProgress(0)
      console.error('Upload failed:', err)
    } finally {
      setTimeout(() => setIsUploading(false), 500)
    }
  }, [bucket, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleRemove = () => {
    setPreview(undefined)
    onChange('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-[var(--color-border)]">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full object-cover transition-all"
            style={{ aspectRatio }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleUpload(file)
                }
                input.click()
              }}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg bg-white/20 hover:bg-red-500/50 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all',
            isUploading && 'pointer-events-none opacity-50'
          )}
          style={{ aspectRatio, minHeight: '120px' }}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
              <span className="text-xs text-[var(--color-text-tertiary)]">{progress}%</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="p-3 rounded-xl bg-[var(--color-surface-hover)]">
                <ImageIcon className="w-6 h-6 text-[var(--color-text-tertiary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Drop an image or click to browse
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                PNG, JPG, WebP up to 5MB
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
