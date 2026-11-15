import { Spin, Table } from 'antd'
import { ErrorState } from './ErrorState'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  sortable?: boolean
  width?: number | string
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  emptyMessage?: string
  emptyDescription?: string
  onRowClick?: (item: T) => void
  selectedIds?: string[]
  onSelect?: (id: string) => void
  onSelectAll?: () => void
  keyExtractor: (item: T) => string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

/**
 * Standard data table built on Ant Design Table.
 * Pages own pagination/search; this renders a professional, consistent table.
 */
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  emptyMessage,
  emptyDescription,
  onRowClick,
  selectedIds,
  onSelect,
  onSelectAll,
  keyExtractor,
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  if (isError) {
    return <ErrorState message={error?.message} onRetry={onRetry} />
  }

  const hasSelection = Boolean(onSelect && onSelectAll)

  return (
    <Spin spinning={Boolean(isLoading)}>
      <div
        className="admin-data-table"
        style={{
          background: 'var(--ant-color-bg-container, #fff)',
          border: '1px solid var(--ant-color-border-secondary, #edf1f7)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <style>{`
          .admin-data-table .ant-table {
            background: transparent !important;
          }
          .admin-data-table .ant-table-container {
            border-inline-start: 0 !important;
            border-top: 0 !important;
          }
          .admin-data-table .ant-table-thead > tr > th {
            font-size: 13px;
            font-weight: 600;
            color: var(--ant-color-text-secondary, #475569) !important;
            background: var(--ant-color-bg-container, #fff) !important;
            border-bottom: 1px solid var(--ant-color-border-secondary, #edf1f7) !important;
            padding-top: 14px !important;
            padding-bottom: 14px !important;
            white-space: nowrap;
          }
          .admin-data-table .ant-table-thead > tr > th::before {
            display: none !important;
          }
          .admin-data-table .ant-table-tbody > tr > td {
            padding-top: 14px !important;
            padding-bottom: 14px !important;
            border-bottom: 1px solid var(--ant-color-border-secondary, #f0f3f8) !important;
            color: var(--ant-color-text, #0f172a);
          }
          .admin-data-table .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
          }
          .admin-data-table .ant-table-tbody > tr.ant-table-row:hover > td {
            background: var(--ant-color-fill-quaternary, #f8fafc) !important;
          }
          .admin-data-table .ant-table-tbody > tr.ant-table-row-selected > td {
            background: var(--ant-color-primary-bg, rgba(25,53,75,0.06)) !important;
          }
          .admin-data-table .ant-table-cell-row-hover {
            background: transparent !important;
          }
          .admin-data-table .ant-table-selection-column {
            padding-inline-start: 18px !important;
            padding-inline-end: 8px !important;
          }
          .admin-data-table .ant-table-placeholder .ant-table-cell {
            padding: 28px 16px !important;
          }
          .admin-data-table .ant-spin-nested-loading,
          .admin-data-table .ant-spin-container {
            background: transparent;
          }
        `}</style>
        <Table<T>
          rowKey={keyExtractor}
          size="middle"
          columns={columns.map((col) => ({
            key: col.key,
            title: col.header,
            dataIndex: col.key,
            width: col.width,
            render: (_value: unknown, record: T) => col.render(record),
            sorter: col.sortable && onSort ? true : undefined,
            sortOrder: sortBy === col.key ? (sortOrder === 'asc' ? 'ascend' : 'descend') : undefined,
            className: col.className,
          }))}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
          onChange={(_pagination, _filters, sorter) => {
            const s = Array.isArray(sorter) ? sorter[0] : sorter
            if (s?.columnKey && onSort) onSort(String(s.columnKey))
          }}
          onRow={
            onRowClick
              ? (record) => ({ onClick: () => onRowClick(record), style: { cursor: 'pointer' } })
              : undefined
          }
          rowSelection={
            hasSelection
              ? {
                  selectedRowKeys: selectedIds ?? [],
                  onSelect: (record) => onSelect?.(keyExtractor(record as T)),
                  onSelectAll: () => onSelectAll?.(),
                }
              : undefined
          }
          locale={{
            emptyText: (
              <EmptyState
                title={emptyMessage || 'No data found'}
                description={emptyDescription || 'There are no items to display.'}
              />
            ),
          }}
        />
      </div>
    </Spin>
  )
}
