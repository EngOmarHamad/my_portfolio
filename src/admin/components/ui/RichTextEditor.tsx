import { useRef, useCallback } from 'react'
import { Button, Tooltip } from 'antd'
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  FontSizeOutlined,
  MessageOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import { theme } from 'antd'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Write your content...', minHeight = '240px' }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { token } = theme.useToken()

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }, [value, onChange])

  const toolbar = [
    { icon: <BoldOutlined />, action: () => insertMarkdown('**', '**'), label: 'Bold' },
    { icon: <ItalicOutlined />, action: () => insertMarkdown('*', '*'), label: 'Italic' },
    { icon: <FontSizeOutlined />, action: () => insertMarkdown('## ', ''), label: 'Heading' },
    { icon: <UnorderedListOutlined />, action: () => insertMarkdown('- ', ''), label: 'Bullet list' },
    { icon: <OrderedListOutlined />, action: () => insertMarkdown('1. ', ''), label: 'Numbered list' },
    { icon: <MessageOutlined />, action: () => insertMarkdown('> ', ''), label: 'Quote' },
    { icon: <CodeOutlined />, action: () => insertMarkdown('```\n', '\n```'), label: 'Code block' },
  ]

  return (
    <div style={{ border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '4px 8px',
          background: token.colorFillQuaternary,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {toolbar.map((item) => (
          <Tooltip key={item.label} title={item.label}>
            <Button type="text" size="small" icon={item.icon} onClick={item.action} />
          </Tooltip>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: token.colorTextTertiary, paddingInlineEnd: 4 }}>Markdown supported</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight,
          padding: '10px 12px',
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.6,
          background: token.colorBgContainer,
          color: token.colorText,
          border: 'none',
          outline: 'none',
          resize: 'vertical',
        }}
      />
    </div>
  )
}
