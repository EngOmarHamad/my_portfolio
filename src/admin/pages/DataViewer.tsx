import { useEffect, useState } from 'react'
import { supabase } from '@/admin/lib/supabase'

const TABLES = [
  'hero', 'about', 'skill_categories', 'skills', 'projects',
  'project_images', 'services', 'experience', 'education',
  'certificates', 'testimonials', 'achievements', 'blog_posts',
  'gallery_categories', 'gallery_images', 'contact_info',
  'contact_messages', 'social_links', 'tech_stack', 'timeline_items',
  'resume', 'seo', 'settings',
]

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

  const selectedData = data[selectedTable] || []

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Supabase Data Viewer</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Browse all database tables</p>
        </div>
        <button
          onClick={loadAll}
          className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors"
        >
          Refresh All
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <div className="w-56 shrink-0 space-y-1">
          {TABLES.map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTable === table
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {table}
              <span className="ml-2 text-xs opacity-60">({data[table]?.length ?? '-'})</span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{selectedTable}</h2>
            <span className="text-sm text-[var(--color-text-tertiary)]">{selectedData.length} rows</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
          ) : selectedData.length === 0 ? (
            <div className="py-20 text-center text-sm text-[var(--color-text-tertiary)]">No data</div>
          ) : (
            <div className="overflow-auto max-h-[75vh] border border-[var(--color-border)] rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                    {Object.keys(selectedData[0] as Record<string, unknown>).map((col) => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-[var(--color-text)] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedData.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]/50">
                      {Object.values(row as Record<string, unknown>).map((val, j) => (
                        <td key={j} className="px-3 py-2 text-[var(--color-text-secondary)] max-w-xs truncate">
                          {val === null ? <span className="text-[var(--color-text-tertiary)]">NULL</span>
                          : typeof val === 'object' ? (
                            <pre className="text-xs whitespace-pre-wrap max-h-24 overflow-y-auto">{JSON.stringify(val, null, 1)}</pre>
                          ) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
