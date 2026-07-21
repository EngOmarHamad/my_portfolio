import { supabase } from '@/admin/lib/supabase'
import type { QueryParams, TableName } from '@/admin/types'

export function createBaseService<T extends Record<string, any>>(tableName: TableName) {
  const query = () => supabase.from(tableName)

  return {
    async list(params: QueryParams = {}) {
      const {
        search,
        page = 1,
        pageSize = 10,
        sortBy = 'created_at',
        sortOrder = 'desc',
        status,
        category,
        featured,
      } = params

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = query().select('*', { count: 'exact' })

      if (search) {
        q = q.or(
          tableName === 'projects'
            ? `title.ilike.%${search}%,description.ilike.%${search}%`
            : `title.ilike.%${search}%,name.ilike.%${search}%`
        )
      }

      if (status) {
        q = q.eq('status', status)
      }

      if (category) {
        q = q.eq('category', category)
      }

      if (featured !== undefined) {
        q = q.eq('is_featured', featured)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      q = q
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to)

      const { data, error, count } = await q as { data: T[] | null; error: any; count: number | null }

      if (error) throw error
      return { data: (data ?? []) as T[], count: count ?? 0 }
    },

    async getById(id: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (query().select('*').eq('id', id).single() as any)
      if (error) throw error
      return data as T
    },

    async create(record: Partial<T>) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (query().insert(record as any).select().single() as any)
      if (error) throw error
      return data as T
    },

    async update(id: string, record: Partial<T>) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (query().update(record as any).eq('id', id).select().single() as any)
      if (error) throw error
      return data as T
    },

    async remove(id: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (query().delete().eq('id', id) as any)
      if (error) throw error
    },

    async bulkRemove(ids: string[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (query().delete().in('id', ids) as any)
      if (error) throw error
    },

    async toggleStatus(id: string, field: string, value: boolean) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (query().update({ [field]: value } as any).eq('id', id).select().single() as any)
      if (error) throw error
      return data as T
    },

    async updateOrder(id: string, display_order: number) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (query().update({ display_order } as any).eq('id', id) as any)
      if (error) throw error
    },

    async reorder(items: { id: string; display_order: number }[]) {
      for (const item of items) {
        await this.updateOrder(item.id, item.display_order)
      }
    },
  }
}
