import { supabase } from '@/admin/lib/supabase'

export type BucketName = 'avatars' | 'projects' | 'gallery' | 'resume' | 'certificates' | 'blog' | 'uploads'

export const uploadService = {
  async upload(file: File, bucket: BucketName, path?: string) {
    const filePath = path || `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      path: data.path,
      url: urlData.publicUrl,
    }
  },

  async remove(path: string, bucket: BucketName) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  },

  async list(bucket: BucketName) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list()

    if (error) throw error
    return data
  },

  getPublicUrl(path: string, bucket: BucketName) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },
}
