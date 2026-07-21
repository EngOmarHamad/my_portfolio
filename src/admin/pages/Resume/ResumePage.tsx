import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { uploadService } from '@/admin/services/upload-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { toast } from 'sonner'
import { Upload, FileDown, Trash2, Loader2, FileText } from 'lucide-react'
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['resume'] }); toast.success('Resume deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
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
  }

  if (isLoading) return <PageSkeleton />

  const activeResume = resumes?.data?.find((r) => r.is_active)

  return (
    <div>
      <PageHeader title="Resume" description="Manage your resume PDF" />

      <div className="max-w-lg space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
          <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                <span className="text-sm text-[var(--color-text-tertiary)]">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-[var(--color-surface-hover)]">
                  <Upload className="w-6 h-6 text-[var(--color-text-tertiary)]" />
                </div>
                <span className="text-sm font-medium">Click to upload PDF</span>
                <span className="text-xs text-[var(--color-text-tertiary)]">PDF only, max 10MB</span>
              </div>
            )}
            <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={isUploading} />
          </label>
        </div>

        {activeResume && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4">Active Resume</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface-hover)]">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-[var(--color-primary)]" />
                <div>
                  <p className="font-medium text-[var(--color-text)]">{activeResume.file_name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{(activeResume.file_size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={activeResume.file_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors">
                  <FileDown className="w-4 h-4" />
                </a>
                <button onClick={() => deleteMutation.mutate(activeResume)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {resumes && resumes.data.length > 1 && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4">Previous Versions</h2>
            <div className="space-y-2">
              {resumes.data.filter(r => !r.is_active).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-hover)]">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                    <div>
                      <p className="text-sm text-[var(--color-text)]">{r.file_name}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteMutation.mutate(r)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
