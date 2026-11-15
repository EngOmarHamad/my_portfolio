import { Pagination as AntdPagination, theme } from 'antd'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const { token } = theme.useToken()
  if (total <= 0) return null

  return (
    <div
      className="admin-pagination"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '14px 2px 4px',
      }}
    >
      <style>{`
        .admin-pagination .ant-pagination {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .admin-pagination .ant-pagination-total-text {
          color: ${token.colorTextSecondary};
          font-size: 13px;
          margin-inline-end: 8px !important;
          height: 32px;
          line-height: 32px;
        }
        .admin-pagination .ant-pagination-item {
          border-radius: 10px;
          border-color: ${token.colorBorderSecondary};
          background: ${token.colorBgContainer};
          font-weight: 500;
        }
        .admin-pagination .ant-pagination-item a {
          color: ${token.colorTextSecondary};
        }
        .admin-pagination .ant-pagination-item:hover {
          border-color: ${token.colorPrimary};
        }
        .admin-pagination .ant-pagination-item:hover a {
          color: ${token.colorPrimary};
        }
        .admin-pagination .ant-pagination-item-active {
          border-color: ${token.colorPrimary} !important;
          background: ${token.colorPrimary} !important;
          font-weight: 600;
        }
        .admin-pagination .ant-pagination-item-active a,
        .admin-pagination .ant-pagination-item-active:hover a {
          color: #fff !important;
        }
        .admin-pagination .ant-pagination-prev .ant-pagination-item-link,
        .admin-pagination .ant-pagination-next .ant-pagination-item-link,
        .admin-pagination .ant-pagination-jump-prev .ant-pagination-item-link,
        .admin-pagination .ant-pagination-jump-next .ant-pagination-item-link {
          border-radius: 10px;
          border-color: ${token.colorBorderSecondary};
          color: ${token.colorTextSecondary};
        }
        .admin-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
        .admin-pagination .ant-pagination-next:hover .ant-pagination-item-link {
          border-color: ${token.colorPrimary};
          color: ${token.colorPrimary};
        }
        .admin-pagination .ant-pagination-disabled .ant-pagination-item-link {
          color: ${token.colorTextQuaternary ?? token.colorTextTertiary} !important;
        }
        .admin-pagination .ant-select-selector {
          border-radius: 10px !important;
        }
      `}</style>
      <AntdPagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange ? (_current, size) => onPageSizeChange(size) : undefined}
        showSizeChanger={Boolean(onPageSizeChange)}
        showTotal={(t, range) => `Showing ${range[0]}–${range[1]} of ${t}`}
        responsive
      />
    </div>
  )
}
