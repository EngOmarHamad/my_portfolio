import { useState, useRef, useCallback } from 'react'
import { Bold, Italic, List, ListOrdered, Heading, Quote, Code } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Write your content...', minHeight = '300px' }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    { icon: Bold, action: () => insertMarkdown('**', '**'), label: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), label: 'Italic' },
    { icon: Heading, action: () => insertMarkdown('## ', ''), label: 'Heading' },
    { icon: List, action: () => insertMarkdown('- ', ''), label: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', ''), label: 'Ordered List' },
    { icon: Quote, action: () => insertMarkdown('> ', ''), label: 'Quote' },
    { icon: Code, action: () => insertMarkdown('```\n', '\n```'), label: 'Code' },
  ]

  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
        {toolbar.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            title={item.label}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <item.icon className="w-4 h-4" />
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[10px] text-[var(--color-text-tertiary)]">Markdown supported</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none resize-y font-mono"
        style={{ minHeight }}
      />
    </div>
  )
}
