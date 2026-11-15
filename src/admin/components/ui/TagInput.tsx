import { Select, Tag } from 'antd'
import { FormField } from '@/admin/components/ui/FormField'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  options?: string[]
  placeholder?: string
  error?: string
  description?: string
}

/**
 * Tag picker built on Ant Design Select (tags mode) — supports
 * free-form entry plus autocomplete against known options.
 */
export function TagInput({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Add tag...',
  error,
  description,
}: TagInputProps) {
  return (
    <FormField label={label} error={error} description={description}>
      <Select
        mode="tags"
        value={value}
        onChange={(next) => onChange((next as string[]).map((t) => t.trim()).filter(Boolean))}
        options={options.map((option) => ({ value: option, label: option }))}
        placeholder={placeholder}
        tokenSeparators={[',', '،']}
        maxTagCount="responsive"
        tagRender={(props) => {
          const { label, closable, onClose } = props
          return (
            <Tag closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
              {label}
            </Tag>
          )
        }}
        notFoundContent={null}
      />
    </FormField>
  )
}
