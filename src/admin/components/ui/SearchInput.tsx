import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  allowClear?: boolean
  width?: number | string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  allowClear = true,
  width = 280,
}: SearchInputProps) {
  return (
    <Input
      allowClear={allowClear}
      prefix={<SearchOutlined />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width }}
    />
  )
}
